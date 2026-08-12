/**
 * Connecteur Lokaal Beslist — décisions locales flamandes.
 *
 * C'est la seule brique reprise de la version 1 du projet, et la seule source
 * réellement exploitable du pilote.
 *
 * Point d'accès : https://lokaalbeslist.vlaanderen.be — JSON:API, sans clé,
 * en-tête `Accept: application/vnd.api+json` obligatoire.
 * Licence : Modellicentie Gratis Hergebruik (mention de la source obligatoire).
 *
 * Le chemin réel de la donnée, vérifié le 12 août 2026 :
 *
 *   sessions  →  agenda-items  →  handled-by  →  resolutions
 *   (Zitting)    (Agendapunt)     (Behandeling)  (Besluit)
 *
 * Il n'existe pas de raccourci : `/resolutions` n'accepte aucun filtre par
 * commune (406 Not Acceptable), et `include=` échoue en 500 sur cette
 * instance. C'est pourquoi la résolution n'est demandée que pour les points
 * qui ont franchi la pré-sélection par intitulé — sinon l'ingestion ferait
 * plusieurs dizaines de milliers d'appels pour rien.
 */

import { enParallele, obtenirJson } from '../http';

const BASE = 'https://lokaalbeslist.vlaanderen.be';
const ACCEPT = 'application/vnd.api+json';
export const LICENCE = 'Modellicentie Gratis Hergebruik';
export const ORGANISME = 'Agentschap Binnenlands Bestuur — Lokaal Beslist';

const filtreCommune = (commune: string) =>
  `filter[governing-body][is-time-specialization-of][administrative-unit][name]=${encodeURIComponent(commune)}`;

interface RessourceJsonApi {
  id: string;
  type: string;
  attributes?: Record<string, unknown>;
  relationships?: Record<string, { links?: { related?: string } }>;
}
interface ReponseJsonApi {
  data?: RessourceJsonApi | RessourceJsonApi[];
  meta?: { count?: number };
}

async function appeler(chemin: string): Promise<ReponseJsonApi | null> {
  const url = chemin.startsWith('http') ? chemin : `${BASE}${chemin}`;
  return obtenirJson<ReponseJsonApi>(url, { accept: ACCEPT, delaiMs: 200, tentatives: 3 });
}

function tableau(r: ReponseJsonApi | null): RessourceJsonApi[] {
  if (!r?.data) return [];
  return Array.isArray(r.data) ? r.data : [r.data];
}

// ---------------------------------------------------------------------------

export interface SeanceBrute {
  id: string;
  debut: string | null;
  debutPrevu: string | null;
  fin: string | null;
  uri: string | null;
}

export interface PointBrut {
  id: string;
  seanceId: string;
  /** Intitulé néerlandais tel que publié. Jamais nettoyé, jamais traduit ici. */
  titre: string;
  description: string;
  planifiePublic: boolean;
  /** Lien vers ce que l'autorité publie réellement (agenda ou liste de décisions). */
  lienPublic: string | null;
  uri: string | null;
  /** Renseigné seulement après résolution : le besluit rattaché, s'il existe. */
  resolution: ResolutionBrute | null;
}

export interface ResolutionBrute {
  id: string;
  titre: string;
  /** Texte du besluit. À Kraainem, il répète l'intitulé : l'autorité ne publie pas la motivation. */
  valeur: string;
  datePublication: string | null;
  langue: string | null;
  uri: string | null;
  /** Nombre d'articles publiés. Zéro à Kraainem sur toute la période observée. */
  nombreArticles: number;
}

export interface ResultatCollecte {
  commune: string;
  seances: SeanceBrute[];
  points: PointBrut[];
  /** Nombre total de séances annoncé par la source, tous exercices confondus. */
  totalSeancesSource: number | null;
  collecteLe: string;
  /** Appels HTTP réellement effectués, pour que le rapport de lot soit vérifiable. */
  appels: number;
}

let appels = 0;

export async function collecterSeances(commune: string, depuis: string, limite = 400): Promise<{ seances: SeanceBrute[]; total: number | null }> {
  const seances: SeanceBrute[] = [];
  let total: number | null = null;
  const taille = 50;

  for (let page = 0; page * taille < limite; page++) {
    const chemin = `/sessions?${filtreCommune(commune)}&page[size]=${taille}&page[number]=${page}&sort=-started-at`;
    const reponse = await appeler(chemin);
    appels++;
    if (total === null) total = reponse?.meta?.count ?? null;
    const lot = tableau(reponse);
    if (lot.length === 0) break;

    let atteintLaLimite = false;
    for (const s of lot) {
      const a = s.attributes ?? {};
      const debut = (a['started-at'] as string) ?? null;
      const debutPrevu = (a['planned-start'] as string) ?? null;
      const reference = debut ?? debutPrevu;
      if (reference && reference < depuis) {
        atteintLaLimite = true;
        continue;
      }
      seances.push({
        id: s.id,
        debut,
        debutPrevu,
        fin: (a['ended-at'] as string) ?? null,
        uri: (a.uri as string) ?? null,
      });
    }
    if (atteintLaLimite || lot.length < taille) break;
  }
  return { seances, total };
}

export async function collecterPoints(seance: SeanceBrute): Promise<PointBrut[]> {
  const reponse = await appeler(`/sessions/${seance.id}/agenda-items?page[size]=100`);
  appels++;
  return tableau(reponse).map((p) => {
    const a = p.attributes ?? {};
    const liens = (a['alternate-link'] as string[] | undefined) ?? [];
    // Le lien vers la liste des décisions vaut mieux que celui vers l'agenda :
    // c'est ce que l'autorité publie une fois la séance tenue.
    const lien = liens.find((l) => l.includes('besluitenlijst')) ?? liens[0] ?? null;
    return {
      id: p.id,
      seanceId: seance.id,
      titre: String(a.title ?? '').trim(),
      description: String(a.description ?? '').trim(),
      planifiePublic: Boolean(a['planned-public']),
      lienPublic: lien,
      uri: (a.uri as string) ?? null,
      resolution: null,
    };
  });
}

/**
 * Va chercher le besluit rattaché à un point. Deux appels : le point renvoie
 * une « behandeling », qui renvoie la ou les résolutions.
 *
 * Renvoie `null` quand l'autorité n'a rattaché aucun acte — cas normal pour un
 * point inscrit mais non traité, et motif d'exclusion `sans-acte`.
 */
export async function resoudre(pointId: string): Promise<ResolutionBrute | null> {
  const traitement = await appeler(`/agenda-items/${pointId}/handled-by`);
  appels++;
  const t = tableau(traitement)[0];
  if (!t) return null;

  const resolutions = await appeler(`/agenda-item-handlings/${t.id}/resolutions`);
  appels++;
  const r = tableau(resolutions)[0];
  if (!r) return null;

  const a = r.attributes ?? {};
  let nombreArticles = 0;
  const lienArticles = r.relationships?.articles?.links?.related;
  if (lienArticles) {
    const articles = await appeler(lienArticles);
    appels++;
    nombreArticles = articles?.meta?.count ?? tableau(articles).length;
  }

  return {
    id: r.id,
    titre: String(a.title ?? '').trim(),
    valeur: String(a.value ?? a.description ?? '').replace(/\s+/g, ' ').trim(),
    datePublication: (a['publication-date'] as string) ?? null,
    langue: (a.language as string) ?? null,
    uri: (a.uri as string) ?? null,
    nombreArticles,
  };
}

/**
 * Collecte complète pour une commune.
 *
 * `estCandidat` permet à l'appelant de n'aller chercher les besluiten que pour
 * les points qui peuvent devenir des items — la pré-sélection par intitulé du
 * test d'admission. Sans elle, l'ingestion multiplierait par vingt le nombre
 * d'appels pour un résultat identique.
 */
export async function collecter(
  commune: string,
  options: { depuis: string; limiteSeances?: number; estCandidat?: (point: PointBrut) => boolean } ,
): Promise<ResultatCollecte> {
  appels = 0;
  const { seances, total } = await collecterSeances(commune, options.depuis, options.limiteSeances ?? 400);

  const lots = await enParallele(seances, 4, (s) => collecterPoints(s));

  /*
   * Déduplication.
   *
   * La source rattache un même point d'agenda à plusieurs séances : la séance
   * qui publie l'ordre du jour et celle qui publie la liste des décisions
   * portent le même `agenda-item`. Sans cette étape, un acte apparaîtrait deux
   * fois dans le fil, et les statistiques du rapport seraient fausses.
   *
   * On garde l'occurrence dont la séance est la plus ancienne — celle où le
   * point a réellement été traité.
   */
  const dateSeance = new Map(seances.map((s) => [s.id, s.debut ?? s.debutPrevu ?? '']));
  const uniques = new Map<string, PointBrut>();
  for (const point of lots.flat()) {
    const existant = uniques.get(point.id);
    if (!existant) {
      uniques.set(point.id, point);
      continue;
    }
    const dNouveau = dateSeance.get(point.seanceId) ?? '';
    const dExistant = dateSeance.get(existant.seanceId) ?? '';
    // À contenu identique, on préfère l'occurrence qui porte un lien vers la
    // liste des décisions : c'est ce que l'autorité publie vraiment.
    const meilleur =
      (point.lienPublic?.includes('besluitenlijst') ? 1 : 0) - (existant.lienPublic?.includes('besluitenlijst') ? 1 : 0);
    if (meilleur > 0 || (meilleur === 0 && dNouveau && dNouveau < dExistant)) uniques.set(point.id, point);
  }
  const points = [...uniques.values()];

  const candidats = options.estCandidat ? points.filter(options.estCandidat) : points;
  await enParallele(candidats, 4, async (p) => {
    p.resolution = await resoudre(p.id);
  });

  return {
    commune,
    seances,
    points,
    totalSeancesSource: total,
    collecteLe: new Date().toISOString(),
    appels,
  };
}

/** Fiche de la source, pour la page « État des sources ». */
export const FICHE_SOURCE = {
  connecteur: 'lokaalbeslist',
  libelle: 'Décisions locales — Lokaal Beslist',
  organisme: ORGANISME,
  licence: LICENCE,
  endpoint: `${BASE}/sessions`,
  cadence: 'Quotidienne, la nuit',
  limitesConnues: [
    'La commune publie la liste des décisions, pas leur motivation : le champ « texte » du besluit répète l’intitulé.',
    'Aucun article de règlement n’est publié : la relation « articles » renvoie zéro pour tous les besluiten de Kraainem observés.',
    'L’endpoint /resolutions n’accepte aucun filtre par commune (HTTP 406) et include= échoue en HTTP 500 : la résolution se fait point par point.',
    'Les intitulés sont en néerlandais, y compris pour une commune à facilités.',
    'Aucun vote nominatif n’est publié pour Kraainem sur la période observée.',
  ],
} as const;
