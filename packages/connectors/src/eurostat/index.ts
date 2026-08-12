/**
 * Connecteur Eurostat — dépenses des administrations publiques par fonction
 * (classification CFAP / COFOG), jeu `gov_10a_exp`.
 *
 * Pourquoi ce connecteur porte l'écran budget : la donnée budgétaire communale
 * belge n'est pas ouverte. Le jeu « Digitale Rapporteringen BBC » n'est pas
 * atteignable sans identifiants (HTTP 401 sur le service OData, portails CKAN
 * indisponibles au 12 août 2026 — voir IMPOSSIBLE.md).
 *
 * Ce qui est ouvert, en revanche, l'est complètement : Eurostat publie la
 * dépense publique belge par fonction ET par sous-secteur. Les sous-secteurs
 * se lisent exactement comme les niveaux de pouvoir de la plateforme :
 *
 *   S1311  administration centrale        → Belgique
 *   S1312  administrations d'États fédérés → Communauté et Région
 *   S1313  administrations locales         → Commune (agrégat national)
 *   S13    ensemble des administrations
 *
 * L'écran affiche donc le vrai empilement là où il existe, et l'absence là où
 * elle est : le budget de Kraainem elle-même n'est publié nulle part en
 * données ouvertes réutilisables.
 */

import { obtenirJson } from '../http';

const BASE = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data';

export const FICHE_SOURCE_EUROSTAT = {
  connecteur: 'eurostat-cofog',
  libelle: 'Dépenses publiques par fonction — Eurostat (CFAP)',
  organisme: 'Eurostat — Commission européenne',
  licence: 'Réutilisation autorisée — décision 2011/833/UE',
  endpoint: `${BASE}/gov_10a_exp`,
  cadence: 'Annuelle',
  limitesConnues: [
    'Agrégat national : le sous-secteur « administrations locales » couvre les 581 communes belges ensemble, pas Kraainem.',
    'Les comptes publics sont arrêtés avec un décalage : le dernier exercice disponible a environ dix-huit mois.',
    'La classification CFAP n’est pas la nomenclature BBC utilisée par les communes flamandes : les deux ne se recouvrent pas ligne à ligne.',
    'Aucune distinction entre budget voté et budget exécuté : Eurostat publie l’exécuté.',
  ],
} as const;

export const SOUS_SECTEURS = {
  S13: { code: 'S13', libelle: 'Ensemble des administrations publiques', niveau: null },
  S1311: { code: 'S1311', libelle: 'Administration centrale', niveau: 'belgique' },
  S1312: { code: 'S1312', libelle: 'Communautés et Régions', niveau: 'region' },
  S1313: { code: 'S1313', libelle: 'Administrations locales', niveau: 'commune' },
} as const;

interface JsonStat {
  label: string;
  updated?: string;
  value: Record<string, number>;
  id: string[];
  size: number[];
  dimension: Record<string, { label: string; category: { index: Record<string, number>; label: Record<string, string> } }>;
}

async function interroger(secteur: string, annee: number, langue = 'fr'): Promise<JsonStat | null> {
  const url =
    `${BASE}/gov_10a_exp?geo=BE&unit=MIO_EUR&sector=${secteur}&na_item=TE` +
    `&time=${annee}&format=JSON&lang=${langue}`;
  return obtenirJson<JsonStat>(url, { delaiMs: 400, tentatives: 3, timeoutMs: 90_000 });
}

export interface FonctionDepense {
  code: string;
  libelle: string;
  /** true pour les dix grandes fonctions GF01 à GF10 ; false pour leurs sous-lignes. */
  principale: boolean;
  montantMillionsEur: number;
}

export async function collecterDepensesPubliques(annees: number[] = [2022, 2023, 2024]) {
  const exercices: Array<{
    annee: number;
    secteurs: Array<{ code: string; libelle: string; total: number; fonctions: FonctionDepense[] }>;
  }> = [];

  for (const annee of annees) {
    const secteurs: Array<{ code: string; libelle: string; total: number; fonctions: FonctionDepense[] }> = [];
    for (const code of Object.keys(SOUS_SECTEURS)) {
      const reponse = await interroger(code, annee);
      if (!reponse) continue;
      const cofog = reponse.dimension.cofog99;
      if (!cofog) continue;
      const inverse: Record<number, string> = {};
      for (const [cle, i] of Object.entries(cofog.category.index)) inverse[i] = cle;

      const fonctions: FonctionDepense[] = [];
      let total = 0;
      for (const [i, montant] of Object.entries(reponse.value)) {
        const codeFonction = inverse[Number(i)];
        if (!codeFonction) continue;
        if (codeFonction === 'TOTAL') {
          total = montant;
          continue;
        }
        // GF01 à GF10 : deux chiffres après « GF » = fonction principale.
        const principale = /^GF\d{2}$/.test(codeFonction);
        fonctions.push({
          code: codeFonction,
          libelle: cofog.category.label[codeFonction] ?? codeFonction,
          principale,
          montantMillionsEur: montant,
        });
      }
      fonctions.sort((a, b) => a.code.localeCompare(b.code));
      secteurs.push({
        code,
        libelle: SOUS_SECTEURS[code as keyof typeof SOUS_SECTEURS].libelle,
        total,
        fonctions,
      });
    }
    if (secteurs.length > 0) exercices.push({ annee, secteurs });
  }

  if (exercices.length === 0) throw new Error('Eurostat n’a renvoyé aucun exercice exploitable');

  return {
    fiche: FICHE_SOURCE_EUROSTAT,
    collecteLe: new Date().toISOString(),
    /** Population belge au 1er janvier, pour le montant par habitant. */
    populationBelgique: await collecterPopulationBelgique(),
    exercices,
  };
}

/**
 * Trajectoire réelle des émissions de gaz à effet de serre.
 *
 * C'est ce qui permet à l'écran Vision d'afficher une trajectoire mesurée et
 * non une intention : la série 1990-2024 est publiée, la cible de la loi
 * européenne sur le climat est chiffrée et datée, l'écart se calcule.
 *
 * `src_crf=TOTX4_MEMO` : total hors utilisation des terres et hors postes pour
 * mémoire — le périmètre sur lequel porte la cible de −55 %.
 */
export async function collecterTrajectoireGes(geo = 'BE') {
  const url =
    `${BASE}/env_air_gge?geo=${geo}&airpol=GHG&src_crf=TOTX4_MEMO&unit=MIO_T&format=JSON&lang=fr`;
  const reponse = await obtenirJson<JsonStat>(url, { delaiMs: 400, timeoutMs: 90_000 });
  if (!reponse) throw new Error('Eurostat n’a renvoyé aucune série d’émissions');

  const temps = reponse.dimension.time.category.index;
  const inverse: Record<number, string> = {};
  for (const [annee, i] of Object.entries(temps)) inverse[i] = annee;

  const serie = Object.entries(reponse.value)
    .map(([i, valeur]) => ({ periode: inverse[Number(i)]!, valeur }))
    .filter((p) => p.periode)
    .sort((a, b) => a.periode.localeCompare(b.periode));

  const reference = serie.find((p) => p.periode === '1990')?.valeur ?? null;

  return {
    geo,
    unite: 'Mt CO₂e',
    perimetre: 'Total hors UTCATF et hors postes pour mémoire (TOTX4_MEMO)',
    reference1990: reference,
    serie,
    derniereMesure: serie.at(-1) ?? null,
    source: {
      organisme: 'Eurostat — Commission européenne',
      url: 'https://ec.europa.eu/eurostat/databrowser/view/env_air_gge/default/table',
      licence: 'Réutilisation autorisée — décision 2011/833/UE',
    },
  };
}

async function collecterPopulationBelgique(): Promise<{ valeur: number; annee: number } | null> {
  const url = `${BASE}/demo_pjan?geo=BE&sex=T&age=TOTAL&format=JSON&lang=fr&lastTimePeriod=1`;
  const reponse = await obtenirJson<JsonStat>(url, { delaiMs: 400 });
  if (!reponse) return null;
  const valeur = Object.values(reponse.value)[0];
  const temps = reponse.dimension.time?.category.index ?? {};
  const annee = Number(Object.keys(temps)[0] ?? 0);
  return valeur ? { valeur, annee } : null;
}
