/**
 * Les règles non négociables, rendues exécutables.
 *
 * Chaque test de ce fichier correspond à une phrase de la spécification. Si
 * l'un tombe, c'est que le produit a changé de nature — pas qu'un détail a
 * bougé.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { ItemSchema, SourceSchema } from '../src/schemas';
import { ordonner, POIDS, scorer, type ProfilPertinence } from '../src/pertinence';
import {
  CONSENTEMENTS_PAR_DEFAUT,
  estSensible,
  FREQUENCES,
  observer,
  PREFERENCES_PAR_DEFAUT,
  purgerTraces,
  RETENTION_TRACES_JOURS,
  SCOPES_DEMANDES,
  type AttributDeduit,
} from '../src/identite';
import { suggererDestinataire } from '../src/competences';

const RACINE = resolve(import.meta.dirname, '../../..');

const itemValide = {
  id: 'item-1',
  typeOslo: 'https://data.vlaanderen.be/ns/besluit#Besluit',
  niveau: 'commune' as const,
  territoireCode: '23099',
  categorie: 'decision' as const,
  titre: 'La zone 30 est étendue à l’avenue Armand Forton',
  titreOrigine: 'Mobiliteit - Aanvullend reglement',
  langueOrigine: 'nl' as const,
  impact: 'La vitesse passe à 30 km/h. Concerne les riverains. Dès la pose des panneaux.',
  action: { kind: 'aucune_action' as const, explication: 'Rien à faire : la mesure s’applique d’elle-même.' },
  themes: ['mobilite-voirie' as const],
  publics: ['riverains'],
  texteOrigine: '',
  dateActe: '2026-07-22',
  adoptee: true,
  source: {
    organisme: 'Lokaal Beslist',
    url: 'https://lokaalbeslist.vlaanderen.be/',
    dateDonnee: '2026-07-22',
    licence: 'Modellicentie Gratis Hergebruik',
    consulteLe: '2026-08-12',
  },
  admission: { publie: true, aUnActe: true, changeQuelqueChose: true, actionRenseignee: true, evalueLe: '2026-08-12' },
  reformulation: { validePar: 'Rédaction', valideLe: '2026-08-12', assisteeParModele: true },
  objectifsLies: [],
  itemsLies: [],
};

// --- Règle : aucune information sans source --------------------------------

test('un item sans source ne se valide pas', () => {
  const { source: _s, ...sansSource } = itemValide;
  assert.throws(() => ItemSchema.parse(sansSource));
});

test('une source doit porter organisme, url, date, licence et date de consultation', () => {
  assert.throws(() => SourceSchema.parse({ organisme: 'X', url: 'https://exemple.be' }));
  assert.doesNotThrow(() => SourceSchema.parse(itemValide.source));
});

// --- Règle : jamais un ordre du jour présenté comme une décision adoptée ----

test('un acte adopté ne peut pas porter une date future', () => {
  const futur = new Date(Date.now() + 30 * 86_400_000).toISOString().slice(0, 10);
  assert.throws(() => ItemSchema.parse({ ...itemValide, adoptee: true, dateActe: futur }), /date future/);
});

test('des dates incohérentes sont refusées plutôt que corrigées', () => {
  assert.throws(
    () => ItemSchema.parse({ ...itemValide, entreeEnVigueur: '2026-09-01', echeance: '2026-08-01' }),
    /incohérentes/,
  );
});

// --- Règle : un item publié porte une reformulation humaine ----------------

test('un item publié sans reformulation validée est refusé', () => {
  const { reformulation: _r, ...sansReformulation } = itemValide;
  assert.throws(() => ItemSchema.parse(sansReformulation), /reformulation/);
});

test('un item non publié doit porter son motif', () => {
  assert.throws(
    () =>
      ItemSchema.parse({
        ...itemValide,
        admission: { ...itemValide.admission, publie: false },
      }),
    /motif/,
  );
});

// --- Règle : le tri est déterministe et explicable -------------------------

test('deux profils identiques produisent exactement le même ordre', () => {
  const profil: ProfilPertinence = {
    abonnements: { commune: ['mobilite-voirie'] },
    publics: ['riverains'],
    niveauResidence: 'commune',
    interetsDeduits: [],
  };
  const items = [
    ItemSchema.parse(itemValide),
    ItemSchema.parse({ ...itemValide, id: 'item-2', themes: ['logement'], dateActe: '2026-07-20' }),
    ItemSchema.parse({ ...itemValide, id: 'item-3', themes: ['mobilite-voirie'], dateActe: '2026-07-21' }),
  ];
  const maintenant = new Date('2026-08-12');
  const a = ordonner(items, profil, maintenant).map((x) => x.item.id);
  const b = ordonner([...items].reverse(), profil, maintenant).map((x) => x.item.id);
  assert.deepEqual(a, b);
});

test('chaque item porte la raison de sa présence', () => {
  const profil: ProfilPertinence = {
    abonnements: { commune: ['mobilite-voirie'] },
    publics: [],
    niveauResidence: 'commune',
    interetsDeduits: [],
  };
  const score = scorer(ItemSchema.parse(itemValide), profil, new Date('2026-08-12'));
  assert.match(score.raison, /mobilité et voirie/);
  assert.match(score.raison, /votre commune/);
});

test('un intérêt déduit pèse au plus la moitié d’un thème déclaré', () => {
  const item = ItemSchema.parse(itemValide);
  const declare = scorer(item, {
    abonnements: { commune: ['mobilite-voirie'] },
    publics: [],
    niveauResidence: 'commune',
    interetsDeduits: [],
  });
  const deduit = scorer(item, {
    abonnements: {},
    publics: [],
    niveauResidence: 'commune',
    interetsDeduits: ['mobilite-voirie'],
  });
  assert.ok(deduit.parts.theme <= declare.parts.theme / 2 + 0.001);
  assert.equal(deduit.viaInteretDeduit, true);
});

test('les poids sont exposés et somment à 110', () => {
  assert.equal(Object.values(POIDS).reduce((s, p) => s + p, 0), 110);
});

// --- Règle : rien n'est activé par défaut ----------------------------------

test('les deux consentements sont désactivés par défaut', () => {
  assert.equal(CONSENTEMENTS_PAR_DEFAUT.situation.accorde, false);
  assert.equal(CONSENTEMENTS_PAR_DEFAUT.deduction.accorde, false);
});

test('aucune notification n’est active par défaut, et la fréquence maximale est hebdomadaire', () => {
  assert.deepEqual(PREFERENCES_PAR_DEFAUT.regles, []);
  assert.equal(PREFERENCES_PAR_DEFAUT.utilitaires.calendrierDechets.actif, false);
  assert.equal(PREFERENCES_PAR_DEFAUT.utilitaires.travauxVoirie.actif, false);
  assert.equal(PREFERENCES_PAR_DEFAUT.utilitaires.echeanceDemarche.actif, false);
  // « hebdomadaire » est la fréquence la plus rapprochée du vocabulaire :
  // aucune valeur « quotidienne » ni « temps réel » n'existe.
  assert.deepEqual([...FREQUENCES], ['jamais', 'hebdomadaire', 'mensuelle']);
});

test('aucun abonnement thématique n’est présélectionné', () => {
  assert.deepEqual(PREFERENCES_PAR_DEFAUT.abonnements, {});
  assert.equal(PREFERENCES_PAR_DEFAUT.impactGeneral, true);
});

// --- Règle : pas de numéro de registre national ----------------------------

test('la portée eid n’est pas demandée', () => {
  assert.ok(!SCOPES_DEMANDES.includes('eid'));
  assert.ok(!SCOPES_DEMANDES.includes('phone'));
});

test('aucun fichier du dépôt ne stocke le numéro de registre national', () => {
  const interdits = [/\bssin\b\s*[:=]/i, /rijksregisternummer\s*[:=]/i, /numeroRegistreNational/i];
  const fichiers: string[] = [];
  const parcourir = (dossier: string) => {
    for (const entree of readdirSync(dossier)) {
      if (['node_modules', '.next', '.git', 'data', '_archive-v1', 'captures'].includes(entree)) continue;
      const chemin = join(dossier, entree);
      if (statSync(chemin).isDirectory()) parcourir(chemin);
      // Les fichiers de test sont exclus : celui-ci contient les motifs
      // interdits, puisque c'est lui qui les cherche.
      else if (/\.(ts|tsx)$/.test(entree) && !/\.test\.tsx?$/.test(entree)) fichiers.push(chemin);
    }
  };
  parcourir(join(RACINE, 'packages'));
  parcourir(join(RACINE, 'apps'));

  for (const f of fichiers) {
    const contenu = readFileSync(f, 'utf8');
    for (const motif of interdits) {
      assert.ok(!motif.test(contenu), `${f} semble stocker un numéro de registre national`);
    }
  }
});

// --- Règle : aucune déduction sur les catégories sensibles -----------------

test('la santé et ses détours sont exclus de la déduction', () => {
  assert.equal(estSensible('sante-soins'), true);
  assert.equal(estSensible('logement', 'aide au logement pour personnes handicapées'), true);
  assert.equal(estSensible('mobilite-voirie', 'zone 30'), false);
});

test('observer refuse d’écrire un attribut sensible, même appelée par erreur', () => {
  const apres = observer([], {
    theme: 'sante-soins',
    libelle: 'consultation médicale',
    produitPar: 'test',
    date: '2026-08-12',
  });
  assert.deepEqual(apres, []);
});

test('les traces au-delà de quatre-vingt-dix jours sont purgées', () => {
  const vieux: AttributDeduit = {
    id: 'a',
    theme: 'mobilite-voirie',
    libelle: 'x',
    produitPar: 'test',
    premiereObservation: '2026-01-01',
    derniereObservation: '2026-01-01',
    occurrences: 3,
  };
  const recent: AttributDeduit = { ...vieux, id: 'b', derniereObservation: '2026-08-01' };
  const restants = purgerTraces([vieux, recent], new Date('2026-08-12'));
  assert.deepEqual(restants.map((a) => a.id), ['b']);
  assert.equal(RETENTION_TRACES_JOURS, 90);
});

// --- Règle : le routage propose, il ne décide pas -------------------------

test('la table de compétences propose un destinataire modifiable, ou rien', () => {
  const s = suggererDestinataire('taxes-budget', 'commune');
  assert.ok(s);
  assert.equal(s!.modifiable, true);
  assert.ok(s!.alternatives.length > 0);
  assert.ok(s!.raison.length > 10);
  // Un cas non couvert renvoie null plutôt qu'un guichet plausible mais faux.
  assert.equal(suggererDestinataire('culture-sport', 'europe'), null);
});

// --- Règle : aucun graphique sans explication -----------------------------

test('aucun appel à CadreGraphique ne passe une explication vide', () => {
  const fichiers: string[] = [];
  const parcourir = (dossier: string) => {
    for (const entree of readdirSync(dossier)) {
      if (['node_modules', '.next'].includes(entree)) continue;
      const chemin = join(dossier, entree);
      if (statSync(chemin).isDirectory()) parcourir(chemin);
      else if (/\.tsx$/.test(entree)) fichiers.push(chemin);
    }
  };
  parcourir(join(RACINE, 'apps/web/src'));

  for (const f of fichiers) {
    const contenu = readFileSync(f, 'utf8');
    if (!contenu.includes('<CadreGraphique')) continue;
    // Chaque occurrence doit être suivie d'une propriété explication.
    const occurrences = contenu.split('<CadreGraphique').length - 1;
    const explications = contenu.split(/explication=\{/).length - 1;
    assert.ok(
      explications >= occurrences,
      `${f} : ${occurrences} graphique(s) pour ${explications} explication(s)`,
    );
    assert.ok(!/explication=\{\{\s*\}\}/.test(contenu), `${f} : explication vide`);
  }
});

// --- Règle : ne classe rien ni personne -----------------------------------

test('aucune liste d’entités n’est triée par une valeur décroissante', () => {
  const suspects: string[] = [];
  const parcourir = (dossier: string) => {
    for (const entree of readdirSync(dossier)) {
      if (['node_modules', '.next'].includes(entree)) continue;
      const chemin = join(dossier, entree);
      if (statSync(chemin).isDirectory()) parcourir(chemin);
      else if (/\.tsx$/.test(entree)) {
        const contenu = readFileSync(chemin, 'utf8');
        // Un tri décroissant sur un montant, un score ou un nombre de soutiens
        // produirait un classement d'entités. Le tri du fil, lui, porte sur le
        // score de pertinence de l'utilisateur et vit dans @pc/core.
        if (/\.sort\([^)]*b\.(montant|valeur|soutiens|total|note|score)/.test(contenu)) suspects.push(chemin);
      }
    }
  };
  parcourir(join(RACINE, 'apps/web/src'));
  assert.deepEqual(suspects, []);
});
