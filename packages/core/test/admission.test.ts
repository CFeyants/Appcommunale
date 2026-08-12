/**
 * Le test d'admission, testé.
 *
 * Ce fichier est la contrepartie exécutable du § 9 : chaque motif d'exclusion
 * y a son cas, et les trois questions du test y sont vérifiées séparément.
 * Les intitulés utilisés sont ceux, réels, des séances de Kraainem.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { appliquerPlafonds, evaluerAdmission } from '../src/admission';
import { ItemSchema } from '../src/schemas';
import { PLAFOND_MENSUEL } from '../src/vocabulaires';

const BASE = { aResolution: true, impact: 'Un impact rédigé qui dépasse vingt caractères.', actionRenseignee: true };

test('question 1 — un point sans acte rattaché n’entre pas', () => {
  const r = evaluerAdmission({ ...BASE, titreOrigine: 'Mobiliteit - Signalisatievergunning', aResolution: false });
  assert.equal(r.admission.publie, false);
  assert.equal(r.admission.motif, 'sans-acte');
  assert.equal(r.admission.aUnActe, false);
});

test('question 2 — chaque motif d’exclusion est détecté sur un intitulé réel', () => {
  const cas: Array<[string, string]> = [
    ['Goedkeuring notulen van 4 augustus 2026', 'approbation-proces-verbal'],
    ['Vaststelling van de agenda van de gemeenteraad', 'fixation-ordre-du-jour'],
    ['Personeel - Aanstelling van een administratief medewerker', 'acte-personnel-individuel'],
    ['Facturen', 'marche-fournitures-internes-sous-seuil'],
    ['Inname openbaar domein - Verhuis Tramlaan 12', 'autorisation-individuelle-sans-effet-tiers'],
    ['Kennisname van de briefwisseling', 'acte-pure-procedure'],
  ];
  for (const [titre, motif] of cas) {
    const r = evaluerAdmission({ ...BASE, titreOrigine: titre });
    assert.equal(r.admission.publie, false, `« ${titre} » aurait dû être écarté`);
    assert.equal(r.admission.motif, motif, `« ${titre} » : mauvais motif`);
  }
});

test('question 2 — un acte réel sans impact rédigé reste au registre', () => {
  const r = evaluerAdmission({ titreOrigine: 'Mobiliteit - Aanvullend reglement', aResolution: true, actionRenseignee: false });
  assert.equal(r.admission.publie, false);
  assert.equal(r.admission.motif, 'sans-impact-identifiable');
  assert.equal(r.admission.aUnActe, true);
});

test('question 3 — l’action doit être qualifiée, « aucune action » comprise', () => {
  const r = evaluerAdmission({ ...BASE, titreOrigine: 'Mobiliteit - Aanvullend reglement', actionRenseignee: false });
  assert.equal(r.admission.publie, false);
  assert.equal(r.admission.changeQuelqueChose, true);
  assert.equal(r.admission.actionRenseignee, false);
});

test('les trois oui font entrer l’item', () => {
  const r = evaluerAdmission({ ...BASE, titreOrigine: 'Mobiliteit - Aanvullend reglement' });
  assert.equal(r.admission.publie, true);
  assert.equal(r.admission.motif, undefined);
});

test('le test est déterministe : deux appels donnent le même verdict', () => {
  const entree = { ...BASE, titreOrigine: 'Belastingreglement op verwaarloosde woningen' };
  const a = evaluerAdmission(entree, new Date('2026-08-12'));
  const b = evaluerAdmission(entree, new Date('2026-08-12'));
  assert.deepEqual(a, b);
});

test('les plafonds mensuels sont appliqués et le dépassement est signalé', () => {
  const gabarit = (n: number) => ({
    id: `item-${n}`,
    typeOslo: 'https://data.vlaanderen.be/ns/besluit#Besluit',
    niveau: 'commune' as const,
    territoireCode: '23099',
    categorie: 'decision' as const,
    titre: `Décision numéro ${n} de la commune`,
    titreOrigine: `Besluit ${n}`,
    langueOrigine: 'nl' as const,
    impact: 'Ce qui change, pour qui, à partir de quand — vingt caractères au moins.',
    action: { kind: 'aucune_action' as const, explication: 'Rien à faire pour cet acte.' },
    themes: [],
    publics: [],
    texteOrigine: '',
    dateActe: '2026-03-15',
    adoptee: true,
    source: {
      organisme: 'Lokaal Beslist',
      url: 'https://lokaalbeslist.vlaanderen.be/',
      dateDonnee: '2026-03-15',
      licence: 'Modellicentie Gratis Hergebruik',
      consulteLe: '2026-08-12',
    },
    admission: {
      publie: true,
      aUnActe: true,
      changeQuelqueChose: true,
      actionRenseignee: true,
      evalueLe: '2026-08-12',
    },
    reformulation: { validePar: 'Rédaction', valideLe: '2026-08-12', assisteeParModele: false },
    objectifsLies: [],
    itemsLies: [],
  });

  const trop = PLAFOND_MENSUEL.commune + 5;
  const items = Array.from({ length: trop }, (_, i) => ItemSchema.parse(gabarit(i)));
  const { items: sortie, depassements } = appliquerPlafonds(items);

  assert.equal(sortie.filter((i) => i.admission.publie).length, PLAFOND_MENSUEL.commune);
  assert.equal(depassements.length, 1);
  assert.equal(depassements[0]!.retenus, trop);
  // Rien n'est supprimé : les items en trop restent, avec leur motif.
  assert.equal(sortie.length, trop);
  assert.equal(sortie.filter((i) => i.admission.motif === 'plafond-mensuel-atteint').length, 5);
});
