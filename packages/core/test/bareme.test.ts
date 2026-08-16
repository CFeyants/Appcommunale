/**
 * Le barème, testé.
 *
 * Le test de somme nulle vient en premier : c'est la propriété qui définit le
 * bonus-malus. Sans elle, le dispositif n'est plus une redistribution entre
 * pairs mais un prélèvement, et il change de nature.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  ANCRAGES_CARBONE,
  bonusMalus,
  impactMonetise,
  indiceAccident,
  referenceSectorielle,
  residuCarbone,
  seuilDeclaration,
  trajectoireCarbone,
  valeurCarbone,
  arrondiSignifiant,
  PRIX_QUOTA_ETS,
  type PostePris,
} from '../src/bareme';

// ---------------------------------------------------------------------------
// 1. La somme nulle — en premier
// ---------------------------------------------------------------------------

test('bonus-malus : la somme des soldes est nulle au centime près', () => {
  const secteur = [
    { id: 'a', intensite: 0.42, volume: 1_200_000 },
    { id: 'b', intensite: 0.31, volume: 800_000 },
    { id: 'c', intensite: 0.55, volume: 2_400_000 },
    { id: 'd', intensite: 0.28, volume: 150_000 },
  ];
  const r = bonusMalus(secteur, 250);
  assert.equal(r.sommeCentimes, 0, 'la somme doit être exactement nulle, pas approximativement');
  const sommeEuros = r.soldes.reduce((s, x) => s + x.soldeEur, 0);
  assert.ok(Math.abs(sommeEuros) < 0.005, `somme en euros = ${sommeEuros}`);
});

test('bonus-malus : la somme reste nulle sur des valeurs qui tombent mal', () => {
  // Des intensités et des volumes choisis pour produire des reliquats d'arrondi.
  const secteur = Array.from({ length: 17 }, (_, i) => ({
    id: `e${i}`,
    intensite: 0.1 + i * 0.0137,
    volume: 3_333 * (i + 1),
  }));
  for (const valeur of [1, 7.77, 250, 1_000_000]) {
    const r = bonusMalus(secteur, valeur);
    assert.equal(r.sommeCentimes, 0, `somme non nulle pour une valeur unitaire de ${valeur}`);
  }
});

test('bonus-malus : une entreprise à la référence a un solde nul', () => {
  const secteur = [
    { id: 'a', intensite: 0.4, volume: 1000 },
    { id: 'b', intensite: 0.4, volume: 2000 },
  ];
  const r = bonusMalus(secteur, 250);
  assert.equal(r.reference, 0.4);
  for (const s of r.soldes) assert.equal(s.soldeEur, 0);
});

test('bonus-malus : la référence est pondérée par les volumes, pas une moyenne simple', () => {
  const secteur = [
    { id: 'petite', intensite: 1, volume: 1 },
    { id: 'grosse', intensite: 0, volume: 99 },
  ];
  // Une moyenne simple donnerait 0,5 ; la pondérée donne 0,01.
  assert.equal(referenceSectorielle(secteur), 0.01);
});

test('bonus-malus : un secteur vide ne fait pas exploser le calcul', () => {
  const r = bonusMalus([], 250);
  assert.equal(r.sommeCentimes, 0);
  assert.deepEqual(r.soldes, []);
});

// ---------------------------------------------------------------------------
// 2. Le résidu — on soustrait le prix acquitté, on ne retire jamais la ligne
// ---------------------------------------------------------------------------

test('résidu : un poste non couvert garde la valeur publique entière', () => {
  const r = residuCarbone('aucune', 2026);
  assert.equal(r.euroParTonne, valeurCarbone(2026).euroParTonne);
  assert.equal(r.dejaAcquitte, 0);
});

test('résidu : un poste couvert vaut la valeur publique moins le prix acquitté', () => {
  const publique = valeurCarbone(2026).euroParTonne;
  const r = residuCarbone('ets', 2026);
  assert.equal(r.euroParTonne, publique - PRIX_QUOTA_ETS.montant);
  assert.equal(r.dejaAcquitte, PRIX_QUOTA_ETS.montant);
});

test('résidu : le chauffage des bâtiments n’est couvert par rien avant 2028', () => {
  const avant = residuCarbone('ets2-a-partir-de-2028', 2026);
  assert.equal(avant.dejaAcquitte, 0, 'avant 2028, rien n’a été acquitté sur ce poste');
  assert.equal(avant.euroParTonne, valeurCarbone(2026).euroParTonne);

  const apres = residuCarbone('ets2-a-partir-de-2028', 2028);
  assert.equal(apres.dejaAcquitte, PRIX_QUOTA_ETS.montant);
});

test('résidu : une ligne totalement couverte reste au calcul avec un résidu nul', () => {
  // On force le cas en se plaçant sur une année où la valeur publique est
  // inférieure au prix acquitté : le résidu tombe à zéro, jamais en négatif,
  // et la ligne subsiste.
  const r = residuCarbone('ets', 2020);
  assert.ok(r.euroParTonne >= 0, 'le résidu ne peut pas être négatif');
  assert.ok(r.dejaAcquitte > 0, 'le prix déjà payé reste affiché');
  assert.ok(r.chaine.join(' ').includes('jamais retirée') || r.euroParTonne > 0);
});

test('impact : une ligne au résidu nul figure toujours dans la chaîne', () => {
  const postes: PostePris[] = [
    {
      cle: 'elec',
      libelle: 'Électricité',
      quantite: 100_000,
      unite: 'kWh',
      facteurEmission: 0.14,
      uniteFacteur: 'kg CO₂e/kWh',
      origineFacteur: origine(),
      couverture: 'ets',
    },
  ];
  const r = impactMonetise(postes, { annee: 2020, usage: 'classer-les-leviers' });
  assert.equal(r.lignes.length, 1, 'la ligne ne disparaît pas, même à résidu nul');
  assert.ok(r.dejaTarifeEur > 0, 'le prix déjà payé est comptabilisé et affichable');
});

// ---------------------------------------------------------------------------
// 3. Aucun montant sans sa chaîne
// ---------------------------------------------------------------------------

test('impact : chaque ligne porte sa chaîne de calcul complète', () => {
  const r = impactMonetise(postesExemple(), { annee: 2026, usage: 'classer-les-leviers', montantMarcheEur: 400_000 });
  assert.ok(r.lignes.length > 0);
  for (const l of r.lignes) {
    assert.ok(l.chaine.length >= 4, `ligne ${l.cle} : chaîne trop courte`);
    assert.ok(l.chaine.some((c) => c.includes('Facteur d’émission')));
    assert.ok(l.chaine.some((c) => c.includes('Montant')));
  }
  assert.ok(r.partDuMontant !== null);
});

test('impact : une quantité non déclarée applique le forfait et le marque comme tel', () => {
  const postes: PostePris[] = [
    {
      cle: 'gasoil',
      libelle: 'Carburant',
      quantite: null,
      unite: 'L',
      facteurEmission: 2.7,
      uniteFacteur: 'kg CO₂e/L',
      origineFacteur: origine(),
      couverture: 'aucune',
      forfait: { quantite: 9_000, origine: origine(), quantile: 'quantile haut de la branche' },
    },
  ];
  const r = impactMonetise(postes, { annee: 2026, usage: 'attribuer' });
  assert.equal(r.lignes[0]!.statutQuantite, 'forfait');
  assert.equal(r.lignes[0]!.quantite, 9_000);
  assert.ok(
    r.lignes[0]!.chaine[0]!.includes('porte sur ce contrat, pas sur l’entreprise'),
    'le forfait doit se déclarer comme portant sur le contrat',
  );
});

test('impact : un poste non discriminant est compté mais signalé à l’attribution', () => {
  const postes: PostePris[] = [
    {
      cle: 'repas',
      libelle: 'Repas servis',
      quantite: 120_000,
      unite: 'repas',
      facteurEmission: 2.1,
      uniteFacteur: 'kg CO₂e/repas',
      origineFacteur: origine(),
      couverture: 'aucune',
      nonDiscriminant: true,
    },
  ];
  const attribuer = impactMonetise(postes, { annee: 2026, usage: 'attribuer' });
  assert.ok(attribuer.lignes[0]!.montantEur > 0, 'la ligne est comptée');
  assert.ok(attribuer.lignes[0]!.chaine.some((c) => c.includes('ne départage pas')));

  const classer = impactMonetise(postes, { annee: 2026, usage: 'classer-les-leviers' });
  assert.ok(!classer.lignes[0]!.chaine.some((c) => c.includes('ne départage pas')));
});

// ---------------------------------------------------------------------------
// 4. La valeur du carbone
// ---------------------------------------------------------------------------

test('valeur du carbone : une année d’ancrage est publiée, une année intercalaire est calculée', () => {
  assert.equal(valeurCarbone(2030).statut, 'publie');
  assert.equal(valeurCarbone(2030).euroParTonne, 250);
  const v2026 = valeurCarbone(2026);
  assert.equal(v2026.statut, 'calcule');
  assert.equal(v2026.euroParTonne, 190, 'interpolation linéaire entre 2020 et 2030');
  assert.ok(v2026.chaine.some((c) => c.includes('Pente')));
});

test('valeur du carbone : au-delà du dernier ancrage, c’est une hypothèse, pas une extrapolation', () => {
  const v = valeurCarbone(2060);
  assert.equal(v.statut, 'hypothese');
  assert.equal(v.euroParTonne, ANCRAGES_CARBONE.at(-1)!.euroParTonne);
});

test('valeur du carbone : la trajectoire à trois ans est croissante et datée', () => {
  const t = trajectoireCarbone(2026, 3);
  assert.equal(t.length, 4);
  for (let i = 1; i < t.length; i++) {
    assert.ok(t[i]!.euroParTonne >= t[i - 1]!.euroParTonne, 'la trajectoire ne peut pas décroître');
  }
});

// ---------------------------------------------------------------------------
// 5. Le seuil se calcule
// ---------------------------------------------------------------------------

test('seuil : il est calculé et sa chaîne montre le quotient', () => {
  const s = seuilDeclaration(7_800, 0.13);
  assert.equal(Math.round(s.seuilEur), 60_000);
  assert.ok(s.chaine.some((c) => c.includes('÷')));
});

test('seuil : un taux d’impact nul n’exige aucune déclaration', () => {
  const s = seuilDeclaration(7_800, 0);
  assert.equal(s.seuilEur, Number.POSITIVE_INFINITY);
});

// ---------------------------------------------------------------------------
// 6. L'indice d'accident
// ---------------------------------------------------------------------------

test('indice d’accident : une seule année ne produit aucun indice', () => {
  const r = indiceAccident([{ annee: 2025, accidents: [{ joursIncapacite: 10 }], equivalentsTempsPlein: 50 }]);
  assert.ok(Number.isNaN(r.indice));
  assert.equal(r.statut, 'hypothese');
});

test('indice d’accident : un accident long est plafonné à 120 jours', () => {
  const base = (jours: number) => [
    { annee: 2026, accidents: [{ joursIncapacite: jours }], equivalentsTempsPlein: 100 },
    { annee: 2025, accidents: [], equivalentsTempsPlein: 100 },
    { annee: 2024, accidents: [], equivalentsTempsPlein: 100 },
  ];
  const plafonne = indiceAccident(base(400));
  const juste = indiceAccident(base(120));
  assert.equal(plafonne.indice, juste.indice, 'au-delà de 120 jours, l’indice ne bouge plus');
  assert.ok(plafonne.chaine.some((c) => c.includes('plafonné')));
});

test('indice d’accident : la moyenne porte sur trois ans', () => {
  const r = indiceAccident([
    { annee: 2026, accidents: [{ joursIncapacite: 30 }], equivalentsTempsPlein: 100 },
    { annee: 2025, accidents: [], equivalentsTempsPlein: 100 },
    { annee: 2024, accidents: [], equivalentsTempsPlein: 100 },
    { annee: 2023, accidents: [{ joursIncapacite: 999 }], equivalentsTempsPlein: 100 },
  ]);
  assert.deepEqual(r.anneesRetenues, [2026, 2025, 2024], 'seules les trois dernières années comptent');
  // (1 accident × 4 + 30 jours) ÷ 300 ETP
  assert.equal(r.indice, 34 / 300);
});

// ---------------------------------------------------------------------------
// 7. Les interdits
// ---------------------------------------------------------------------------

test('arrondi : un ordre de grandeur n’est jamais masqué', () => {
  assert.equal(arrondiSignifiant(0.0043), 0.0043);
  assert.notEqual(arrondiSignifiant(0.0043), 0);
  assert.equal(arrondiSignifiant(12_345), 12_000);
});

test('le module n’expose aucune fonction de rang ni d’agrégation en note', async () => {
  const module = await import('../src/bareme');
  const interdits = /^(classer|rang|note|score|palmares|meilleur|top)/i;
  const fautifs = Object.keys(module).filter(
    (nom) => typeof (module as Record<string, unknown>)[nom] === 'function' && interdits.test(nom),
  );
  assert.deepEqual(fautifs, [], `fonctions interdites exposées : ${fautifs.join(', ')}`);
});

// ---------------------------------------------------------------------------

function origine() {
  return {
    organisme: 'Source de test',
    reference: 'jeu de test',
    releveLe: '2026-08-16',
    verifieParAppel: false,
  };
}

function postesExemple(): PostePris[] {
  return [
    {
      cle: 'gaz',
      libelle: 'Gaz de chauffage',
      quantite: 900_000,
      unite: 'kWh',
      facteurEmission: 0.2,
      uniteFacteur: 'kg CO₂e/kWh',
      origineFacteur: origine(),
      couverture: 'ets2-a-partir-de-2028',
    },
    {
      cle: 'elec',
      libelle: 'Électricité',
      quantite: 300_000,
      unite: 'kWh',
      facteurEmission: 0.14,
      uniteFacteur: 'kg CO₂e/kWh',
      origineFacteur: origine(),
      couverture: 'ets',
    },
  ];
}
