/**
 * Accès aux données.
 *
 * L'interface lit /data et rien d'autre. Aucun appel réseau n'a lieu pendant le
 * rendu d'une page : si un portail public tombe, la plateforme continue de
 * servir la dernière collecte, et le dit.
 *
 * Toute lecture passe par `lire()`, qui renvoie `null` quand le fichier
 * n'existe pas encore. Les écrans traitent ce `null` comme une absence de
 * donnée à afficher, jamais comme une erreur à masquer.
 */

import 'server-only';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { cache } from 'react';

import {
  evaluerAdmission,
  appliquerPlafonds,
  type Categorie,
  type Item,
  type MotifExclusion,
  type Theme,
} from '@pc/core';
import { REFORMULATIONS } from '@/contenu/reformulations';

const DATA = resolve(process.cwd(), '../../data');

const lire = cache(async <T>(chemin: string): Promise<T | null> => {
  try {
    return JSON.parse(await readFile(resolve(DATA, chemin), 'utf8')) as T;
  } catch {
    return null;
  }
});

// ---------------------------------------------------------------------------
// Lokaal Beslist → items
// ---------------------------------------------------------------------------

interface PointCollecte {
  id: string;
  seanceId: string;
  titre: string;
  description: string;
  lienPublic: string | null;
  uri: string | null;
  resolution: {
    id: string;
    titre: string;
    valeur: string;
    datePublication: string | null;
    langue: string | null;
    nombreArticles: number;
  } | null;
}

interface SeanceCollecte {
  id: string;
  debut: string | null;
  debutPrevu: string | null;
  fin: string | null;
  uri: string | null;
}

export interface CollecteLokaalBeslist {
  commune: string;
  codeNis: string;
  fenetre: { depuis: string; jusqua: string };
  totalSeancesSource: number | null;
  collecteLe: string;
  statistiques: {
    seances: number;
    points: number;
    besluitenResolus: number;
    avecTexteDistinct: number;
    avecArticles: number;
    appelsHttp: number;
  };
  seances: SeanceCollecte[];
  points: PointCollecte[];
}

export interface ItemAffiche extends Item {
  /** Explication lisible du motif d'exclusion, pour l'onglet « écartés ». */
  explicationAdmission: string;
  /** Lien vers ce que l'autorité publie réellement. */
  lienAutorite: string | null;
  dateSeance: string | null;
}

/**
 * Construit les items à partir de la collecte brute et de la table de
 * reformulations écrite à la main.
 *
 * Un point sans reformulation ne devient jamais un item publié : le champ
 * `impact` est rédigé par un humain, et le schéma refuse un item publié sans
 * reformulation validée (§ 9). Il reste au registre, avec la mention « texte
 * original seulement ».
 */
export const chargerFil = cache(async () => {
  const collecte = await lire<CollecteLokaalBeslist>('kraainem/lokaalbeslist.json');
  if (!collecte) {
    return {
      disponible: false as const,
      items: [] as ItemAffiche[],
      seances: [] as Array<{ id: string; date: string | null; points: number }>,
      fenetre: null,
      statistiques: null,
      collecteLe: null,
      totalSeancesSource: null,
      depassements: [] as Array<{ niveau: string; mois: string; retenus: number; plafond: number }>,
    };
  }

  const dateParSeance = new Map(collecte.seances.map((s) => [s.id, s.debut ?? s.debutPrevu ?? null]));
  const bruts: ItemAffiche[] = [];

  for (const point of collecte.points) {
    const reformulation = REFORMULATIONS[point.id];
    const dateSeance = dateParSeance.get(point.seanceId) ?? null;
    const dateActe = (point.resolution?.datePublication ?? dateSeance ?? collecte.fenetre.jusqua).slice(0, 10);

    const resultat = evaluerAdmission({
      titreOrigine: point.titre,
      aResolution: Boolean(point.resolution),
      impact: reformulation?.impact,
      actionRenseignee: Boolean(reformulation?.action),
    });

    const titreOrigine = point.titre.trim() || point.description.trim() || '(intitulé absent à la source)';
    const categorie: Categorie = reformulation?.categorie ?? 'decision';
    const themes: Theme[] = reformulation?.themes ?? [];

    bruts.push({
      id: point.id,
      typeOslo: 'https://data.vlaanderen.be/ns/besluit#Besluit',
      niveau: 'commune',
      territoireCode: collecte.codeNis,
      categorie,
      // Sans reformulation, le titre affiché reste l'intitulé d'origine, tronqué
      // à la longueur du schéma. Il ne sera de toute façon pas publié dans le fil.
      titre: (reformulation?.titre ?? titreOrigine).slice(0, 90),
      titreOrigine,
      langueOrigine: 'nl',
      impact: reformulation?.impact ?? 'Impact non rédigé : cet acte n’a pas encore été reformulé en français ordinaire.',
      action: reformulation?.action ?? {
        kind: 'aucune_action',
        explication: 'L’action n’a pas encore été qualifiée pour cet acte.',
      },
      themes,
      publics: reformulation?.publics ?? [],
      texteOrigine:
        point.resolution && point.resolution.valeur !== titreOrigine ? point.resolution.valeur : '',
      dateActe,
      entreeEnVigueur: reformulation?.entreeEnVigueur,
      echeance: reformulation?.echeance,
      adoptee: Boolean(point.resolution) && dateActe <= new Date().toISOString().slice(0, 10),
      source: {
        organisme: 'Agentschap Binnenlands Bestuur — Lokaal Beslist',
        url: point.lienPublic ?? point.uri ?? 'https://lokaalbeslist.vlaanderen.be/',
        dateDonnee: dateActe,
        licence: 'Modellicentie Gratis Hergebruik',
        consulteLe: collecte.collecteLe.slice(0, 10),
        identifiantAmont: point.id,
      },
      admission: resultat.admission,
      reformulation: reformulation
        ? { validePar: reformulation.validePar, valideLe: reformulation.valideLe, assisteeParModele: reformulation.assisteeParModele }
        : undefined,
      objectifsLies: reformulation?.objectifsLies ?? [],
      itemsLies: [],
      seanceId: point.seanceId,
      explicationAdmission: resultat.explication,
      lienAutorite: point.lienPublic,
      dateSeance,
    });
  }

  const { items, depassements } = appliquerPlafonds(bruts);

  const seances = collecte.seances
    .map((s) => ({
      id: s.id,
      date: s.debut ?? s.debutPrevu,
      points: collecte.points.filter((p) => p.seanceId === s.id).length,
    }))
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));

  // On ne renvoie jamais la collecte brute : elle pèse dix mégaoctets, et tout
  // ce dont les écrans ont besoin est déjà dérivé ici.
  return {
    disponible: true as const,
    items: items as ItemAffiche[],
    seances,
    fenetre: collecte.fenetre,
    statistiques: collecte.statistiques,
    collecteLe: collecte.collecteLe,
    totalSeancesSource: collecte.totalSeancesSource,
    depassements,
  };
});

/**
 * Projection légère, pour ce qui traverse vers le client.
 *
 * Le texte intégral des actes pèse plusieurs mégaoctets sur deux ans de
 * séances. Il n'a d'intérêt que sur la fiche d'un acte précis : l'envoyer avec
 * la liste ferait payer à chaque visiteur, y compris sur un forfait limité, le
 * poids de trois mille délibérations qu'il ne lira pas. Le mode hors ligne
 * serait tout aussi lourd.
 */
export type ItemLeger = Omit<ItemAffiche, 'texteOrigine'>;

export function alleger(item: ItemAffiche): ItemLeger {
  const { texteOrigine: _texte, ...reste } = item;
  return reste;
}

/**
 * Le registre n'affiche que l'intitulé, la date et le motif.
 *
 * Le motif circule sous forme de code, pas de phrase : trois mille lignes de
 * texte identique répété pèsent plusieurs mégaoctets, et la phrase est déjà
 * connue du client par `EXPLICATION_MOTIF`.
 */
export interface EntreeRegistre {
  id: string;
  titreOrigine: string;
  dateActe: string;
  motif: MotifExclusion | null;
}

export function versRegistre(item: ItemAffiche): EntreeRegistre {
  return {
    id: item.id,
    titreOrigine: item.titreOrigine,
    dateActe: item.dateActe,
    motif: item.admission.motif ?? null,
  };
}

/** Retrouve un acte par son identifiant, avec son texte intégral. */
export const chargerActe = cache(async (id: string) => {
  const { items } = await chargerFil();
  return items.find((i) => i.id === id) ?? null;
});

// ---------------------------------------------------------------------------
// Les autres sources
// ---------------------------------------------------------------------------

export interface DepensesPubliques {
  collecteLe: string;
  populationBelgique: { valeur: number; annee: number } | null;
  exercices: Array<{
    annee: number;
    secteurs: Array<{
      code: string;
      libelle: string;
      total: number;
      fonctions: Array<{ code: string; libelle: string; principale: boolean; montantMillionsEur: number }>;
    }>;
  }>;
}

export const chargerDepenses = cache(() => lire<DepensesPubliques>('belgique/eurostat-depenses.json'));

export interface TrajectoireGes {
  unite: string;
  perimetre: string;
  reference1990: number | null;
  serie: Array<{ periode: string; valeur: number }>;
  derniereMesure: { periode: string; valeur: number } | null;
  source: { organisme: string; url: string; licence: string };
}

export const chargerGes = cache(() => lire<TrajectoireGes>('belgique/eurostat-ges.json'));

export interface Energie {
  collecteLe: string;
  fenetre: { du: string | null; au: string | null };
  mensuel: Array<{ mois: string; secteur: string; prelevementKwh: number | null; injectionKwh: number | null }>;
  parSecteur: Array<{ secteur: string; prelevementGwh: number; injectionGwh: number }>;
}

export const chargerEnergie = cache(() => lire<Energie>('kraainem/fluvius-energie.json'));

export interface Air {
  collecteLe: string;
  totalStationsBelgique: number;
  aucuneStationSurLaCommune: boolean;
  stations: Array<{ id: number; libelle: string; distanceKm: number; latitude: number; longitude: number }>;
}

export const chargerAir = cache(() => lire<Air>('kraainem/irceline-air.json'));

export interface Etablissements {
  collecteLe: string;
  etablissements: Array<{
    id: string;
    nom: string;
    categorie: string;
    typeOsm: string;
    adresse: string | null;
    telephone: string | null;
    site: string | null;
    horaires: string | null;
    latitude: number;
    longitude: number;
  }>;
  completude: { total: number; avecAdresse: number; avecHoraires: number; avecTelephone: number };
}

export const chargerEtablissements = cache(() => lire<Etablissements>('kraainem/osm-etablissements.json'));

export interface ActesUe {
  collecteLe: string;
  depuis: string;
  actes: Array<{ celex: string; date: string; titre: string; urlEli: string; urlEurLex: string; nature: string }>;
}

export const chargerActesUe = cache(() => lire<ActesUe>('europe/eurlex-actes.json'));

export interface EtatSource {
  connecteur: string;
  libelle: string;
  organisme: string;
  licence: string;
  endpoint: string;
  cadence: string;
  derniereCollecteReussie: string | null;
  derniereTentative: string | null;
  nombreItems: number;
  etat: 'ok' | 'degrade' | 'panne' | 'non-branche';
  raison?: string;
  limitesConnues: string[];
}

export const chargerEtatSources = cache(async () => (await lire<EtatSource[]>('etat-sources.json')) ?? []);
