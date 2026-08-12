/**
 * Ingestion planifiée.
 *
 * « Ingestion planifiée, jamais à la demande » : cette commande remplit
 * /data ; l'interface lit /data. Aucun appel à une API tierce n'a lieu pendant
 * le rendu d'une page.
 *
 *   npm run ingest            — toutes les sources
 *   npm run ingest lokaalbeslist
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { evaluerAdmission, type EntreeAdmission } from '@pc/core';
import { collecter, FICHE_SOURCE, LICENCE, ORGANISME, type PointBrut } from '../lokaalbeslist/index';
import { collecterEntreprisesOsm } from '../osm/index';
import { collecterEnergie } from '../fluvius/index';
import { collecterQualiteAir } from '../irceline/index';
import { collecterActesUe } from '../eurlex/index';
import { collecterDepensesPubliques, collecterTrajectoireGes } from '../eurostat/index';

const ICI = dirname(fileURLToPath(import.meta.url));
const RACINE = resolve(ICI, '../../../..');
const DATA = resolve(RACINE, 'data');

const COMMUNE = 'Kraainem';
const CODE_NIS = '23099';
/**
 * Fenêtre de collecte. Deux ans : assez pour que les plafonds mensuels du § 9
 * soient réellement éprouvés, assez peu pour que l'ingestion reste polie.
 */
const DEPUIS = '2024-08-01';

async function ecrire(chemin: string, donnees: unknown) {
  const complet = resolve(DATA, chemin);
  await mkdir(dirname(complet), { recursive: true });
  await writeFile(complet, JSON.stringify(donnees, null, 2) + '\n', 'utf8');
  console.log(`  écrit  ${chemin}`);
}

async function lireSiPresent<T>(chemin: string): Promise<T | null> {
  try {
    return JSON.parse(await readFile(resolve(DATA, chemin), 'utf8')) as T;
  } catch {
    return null;
  }
}

const etats: Array<Record<string, unknown>> = [];

function noter(fiche: Record<string, unknown>, resultat: { items: number; ok: boolean; raison?: string }) {
  const maintenant = new Date().toISOString();
  etats.push({
    ...fiche,
    derniereCollecteReussie: resultat.ok ? maintenant : null,
    derniereTentative: maintenant,
    nombreItems: resultat.items,
    etat: resultat.ok ? 'ok' : 'panne',
    ...(resultat.raison ? { raison: resultat.raison } : {}),
  });
}

// ---------------------------------------------------------------------------

async function ingererLokaalBeslist() {
  console.log(`\n▸ Lokaal Beslist — ${COMMUNE}, depuis le ${DEPUIS}`);

  /**
   * Pré-sélection : on ne demande le besluit que pour les points dont
   * l'intitulé n'est pas déjà exclu par le test d'admission. C'est le même
   * code que celui qui décidera de la publication — pas une heuristique
   * parallèle qui pourrait diverger.
   */
  const estCandidat = (p: PointBrut) => {
    const pre = evaluerAdmission({ titreOrigine: p.titre, aResolution: true, actionRenseignee: false });
    return pre.admission.motif !== 'approbation-proces-verbal' &&
      pre.admission.motif !== 'fixation-ordre-du-jour' &&
      pre.admission.motif !== 'acte-personnel-individuel' &&
      pre.admission.motif !== 'marche-fournitures-internes-sous-seuil' &&
      pre.admission.motif !== 'autorisation-individuelle-sans-effet-tiers' &&
      pre.admission.motif !== 'acte-pure-procedure';
  };

  try {
    const brut = await collecter(COMMUNE, { depuis: DEPUIS, limiteSeances: 400, estCandidat });
    console.log(
      `  ${brut.seances.length} séances · ${brut.points.length} points · ` +
        `${brut.points.filter((p) => p.resolution).length} besluiten résolus · ${brut.appels} appels HTTP`,
    );

    // Journal explicite : ce que la source publie, et ce qu'elle ne publie pas.
    const avecTexte = brut.points.filter(
      (p) => p.resolution && p.resolution.valeur && p.resolution.valeur !== p.titre.trim(),
    ).length;
    const avecArticles = brut.points.filter((p) => (p.resolution?.nombreArticles ?? 0) > 0).length;
    console.log(`  texte de motivation distinct de l’intitulé : ${avecTexte} · articles publiés : ${avecArticles}`);

    await ecrire(`kraainem/lokaalbeslist.json`, {
      source: { organisme: ORGANISME, licence: LICENCE, endpoint: FICHE_SOURCE.endpoint },
      commune: COMMUNE,
      codeNis: CODE_NIS,
      fenetre: { depuis: DEPUIS, jusqua: brut.collecteLe.slice(0, 10) },
      totalSeancesSource: brut.totalSeancesSource,
      collecteLe: brut.collecteLe,
      statistiques: {
        seances: brut.seances.length,
        points: brut.points.length,
        besluitenResolus: brut.points.filter((p) => p.resolution).length,
        avecTexteDistinct: avecTexte,
        avecArticles: avecArticles,
        appelsHttp: brut.appels,
      },
      seances: brut.seances,
      points: brut.points,
    });

    noter({ ...FICHE_SOURCE }, { items: brut.points.length, ok: true });
  } catch (e) {
    console.error('  échec :', e instanceof Error ? e.message : e);
    const ancien = await lireSiPresent<{ points: unknown[] }>('kraainem/lokaalbeslist.json');
    noter({ ...FICHE_SOURCE }, {
      items: ancien?.points?.length ?? 0,
      ok: false,
      raison: e instanceof Error ? e.message : String(e),
    });
  }
}

async function ingererOsm() {
  console.log('\n▸ OpenStreetMap — établissements de Kraainem');
  try {
    const r = await collecterEntreprisesOsm(CODE_NIS);
    await ecrire('kraainem/osm-etablissements.json', r);
    noter(r.fiche, { items: r.etablissements.length, ok: true });
    console.log(`  ${r.etablissements.length} établissements`);
  } catch (e) {
    console.error('  échec :', e instanceof Error ? e.message : e);
    noter({ connecteur: 'osm-overpass', libelle: 'Établissements — OpenStreetMap', organisme: 'OpenStreetMap', licence: 'ODbL 1.0', endpoint: 'https://overpass-api.de/api/interpreter', cadence: 'Hebdomadaire', limitesConnues: [] }, { items: 0, ok: false, raison: String(e) });
  }
}

async function ingererFluvius() {
  console.log('\n▸ Fluvius — énergie par commune');
  try {
    const r = await collecterEnergie('KRAAINEM');
    await ecrire('kraainem/fluvius-energie.json', r);
    noter(r.fiche, { items: r.mensuel.length, ok: true });
    console.log(`  ${r.mensuel.length} points mensuels`);
  } catch (e) {
    console.error('  échec :', e instanceof Error ? e.message : e);
    noter({ connecteur: 'fluvius', libelle: 'Énergie par commune — Fluvius', organisme: 'Fluvius', licence: 'Licence ouverte Fluvius', endpoint: 'https://opendata.fluvius.be', cadence: 'Mensuelle', limitesConnues: [] }, { items: 0, ok: false, raison: String(e) });
  }
}

async function ingererIrceline() {
  console.log('\n▸ IRCEL-CELINE — qualité de l’air');
  try {
    const r = await collecterQualiteAir(50.85, 4.47);
    await ecrire('kraainem/irceline-air.json', r);
    noter(r.fiche, { items: r.stations.length, ok: true });
    console.log(`  ${r.stations.length} stations retenues, la plus proche à ${r.stations[0]?.distanceKm ?? '?'} km`);
  } catch (e) {
    console.error('  échec :', e instanceof Error ? e.message : e);
    noter({ connecteur: 'irceline', libelle: 'Qualité de l’air — IRCEL-CELINE', organisme: 'IRCEL-CELINE', licence: 'CC BY 4.0', endpoint: 'https://geo.irceline.be/sos/api/v1/stations', cadence: 'Horaire', limitesConnues: [] }, { items: 0, ok: false, raison: String(e) });
  }
}

async function ingererEurlex() {
  console.log('\n▸ EUR-Lex / CELLAR');
  try {
    const r = await collecterActesUe();
    await ecrire('europe/eurlex-actes.json', r);
    noter(r.fiche, { items: r.actes.length, ok: true });
    console.log(`  ${r.actes.length} actes`);
  } catch (e) {
    console.error('  échec :', e instanceof Error ? e.message : e);
    noter({ connecteur: 'eurlex-cellar', libelle: 'Actes européens — EUR-Lex / CELLAR', organisme: 'Office des publications de l’Union européenne', licence: 'Réutilisation autorisée — décision 2011/833/UE', endpoint: 'https://publications.europa.eu/webapi/rdf/sparql', cadence: 'Quotidienne', limitesConnues: [] }, { items: 0, ok: false, raison: String(e) });
  }
}

async function ingererEurostat() {
  console.log('\n▸ Eurostat — dépenses publiques par fonction et par sous-secteur');
  try {
    const r = await collecterDepensesPubliques([2021, 2022, 2023, 2024]);
    await ecrire('belgique/eurostat-depenses.json', r);
    noter(r.fiche, { items: r.exercices.length, ok: true });
    console.log(`  ${r.exercices.length} exercices · population de référence ${r.populationBelgique?.valeur ?? '?'}`);

    const ges = await collecterTrajectoireGes('BE');
    await ecrire('belgique/eurostat-ges.json', ges);
    console.log(`  trajectoire GES : ${ges.serie.length} années, dernière ${ges.derniereMesure?.periode} = ${ges.derniereMesure?.valeur} Mt`);
  } catch (e) {
    console.error('  échec :', e instanceof Error ? e.message : e);
    noter({ connecteur: 'eurostat-cofog', libelle: 'Dépenses publiques par fonction — Eurostat', organisme: 'Eurostat', licence: 'Réutilisation autorisée — décision 2011/833/UE', endpoint: 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_exp', cadence: 'Annuelle', limitesConnues: [] }, { items: 0, ok: false, raison: String(e) });
  }
}

// ---------------------------------------------------------------------------

const SOURCES: Record<string, () => Promise<void>> = {
  lokaalbeslist: ingererLokaalBeslist,
  eurostat: ingererEurostat,
  osm: ingererOsm,
  fluvius: ingererFluvius,
  irceline: ingererIrceline,
  eurlex: ingererEurlex,
};

const demandees = process.argv.slice(2);
const aLancer = demandees.length > 0 ? demandees : Object.keys(SOURCES);

for (const nom of aLancer) {
  const fn = SOURCES[nom];
  if (!fn) {
    console.error(`Source inconnue : ${nom}. Connues : ${Object.keys(SOURCES).join(', ')}`);
    process.exitCode = 1;
    continue;
  }
  await fn();
}

// L'état des sources est fusionné, pas écrasé : une source non relancée garde
// son dernier état connu plutôt que de disparaître de la page.
const ancien = (await lireSiPresent<Array<Record<string, unknown>>>('etat-sources.json')) ?? [];
const fusion = new Map<string, Record<string, unknown>>();
for (const e of ancien) fusion.set(String(e.connecteur), e);
for (const e of etats) fusion.set(String(e.connecteur), e);
await ecrire('etat-sources.json', [...fusion.values()]);

console.log('\nIngestion terminée.');
