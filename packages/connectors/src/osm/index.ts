/**
 * Connecteur OpenStreetMap — établissements ouverts au public.
 *
 * Pourquoi celui-ci et pas la Banque-Carrefour des Entreprises : le fichier
 * KBO Open Data exige une inscription nominative et un identifiant de
 * téléchargement (HTTP 302 vers une page d'authentification, vérifié le
 * 12 août 2026). Voir IMPOSSIBLE.md.
 *
 * OpenStreetMap est contributif, donc incomplet — et c'est affiché comme tel,
 * conformément à la règle « quand une donnée manque, publie l'absence ».
 *
 * Licence : ODbL 1.0. L'attribution est obligatoire et figure sur chaque écran
 * qui affiche ces données.
 */

import { obtenirJson } from '../http';

const OVERPASS = 'https://overpass-api.de/api/interpreter';

export interface EtablissementOsm {
  id: string;
  nom: string;
  categorie: 'commerce' | 'sante' | 'transport' | 'culture-sport' | 'service' | 'restauration';
  typeOsm: string;
  adresse: string | null;
  telephone: string | null;
  site: string | null;
  horaires: string | null;
  latitude: number;
  longitude: number;
}

const CATEGORIE: Array<{ test: (tags: Record<string, string>) => boolean; cat: EtablissementOsm['categorie'] }> = [
  { test: (t) => ['pharmacy', 'doctors', 'dentist', 'clinic', 'hospital', 'veterinary'].includes(t.amenity ?? ''), cat: 'sante' },
  { test: (t) => ['restaurant', 'cafe', 'bar', 'fast_food', 'pub', 'ice_cream'].includes(t.amenity ?? ''), cat: 'restauration' },
  { test: (t) => ['library', 'theatre', 'cinema', 'community_centre', 'arts_centre'].includes(t.amenity ?? '') || Boolean(t.leisure), cat: 'culture-sport' },
  { test: (t) => ['bus_station', 'car_rental', 'bicycle_rental', 'charging_station', 'fuel', 'parking'].includes(t.amenity ?? ''), cat: 'transport' },
  { test: (t) => Boolean(t.shop), cat: 'commerce' },
];

export const FICHE_SOURCE_OSM = {
  connecteur: 'osm-overpass',
  libelle: 'Établissements ouverts au public — OpenStreetMap',
  organisme: 'OpenStreetMap — contributeurs',
  licence: 'ODbL 1.0 (attribution obligatoire)',
  endpoint: OVERPASS,
  cadence: 'Hebdomadaire',
  limitesConnues: [
    'Base contributive : la couverture est incomplète et inégale selon les quartiers.',
    'Aucune source publique n’existe pour la liste des commerçants d’une commune belge : ni registre communal ouvert, ni filtre « ouvert au public » dans la Banque-Carrefour des Entreprises.',
    'Une minorité de fiches porte une adresse complète ; le reste n’a que des coordonnées géographiques.',
    'Rien ne garantit qu’un établissement fermé ait été retiré de la base.',
  ],
} as const;

interface ReponseOverpass {
  elements: Array<{
    type: string;
    id: number;
    lat?: number;
    lon?: number;
    center?: { lat: number; lon: number };
    tags?: Record<string, string>;
  }>;
}

export async function collecterEntreprisesOsm(codeNis: string) {
  const requete = `[out:json][timeout:90];area["ref:INS"="${codeNis}"]->.a;(node["shop"](area.a);way["shop"](area.a);node["amenity"](area.a);way["amenity"](area.a);node["office"](area.a);node["leisure"](area.a);way["leisure"](area.a););out center;`;
  const url = `${OVERPASS}?data=${encodeURIComponent(requete)}`;
  const reponse = await obtenirJson<ReponseOverpass>(url, { delaiMs: 1500, tentatives: 3, timeoutMs: 120_000 });
  if (!reponse) throw new Error('Overpass n’a rien renvoyé');

  const etablissements: EtablissementOsm[] = [];
  for (const e of reponse.elements) {
    const tags = e.tags ?? {};
    const nom = tags.name ?? tags['name:nl'] ?? tags['name:fr'];
    // Sans nom, une fiche de service ne peut pas être rendue lisible : on
    // l'écarte plutôt que d'afficher « commerce sans nom ».
    if (!nom) continue;
    const lat = e.lat ?? e.center?.lat;
    const lon = e.lon ?? e.center?.lon;
    if (lat === undefined || lon === undefined) continue;

    const trouve = CATEGORIE.find((c) => c.test(tags));
    const rue = tags['addr:street'];
    const numero = tags['addr:housenumber'];
    const cp = tags['addr:postcode'];
    const ville = tags['addr:city'];

    etablissements.push({
      id: `${e.type}/${e.id}`,
      nom,
      categorie: trouve?.cat ?? 'service',
      typeOsm: tags.shop ?? tags.amenity ?? tags.leisure ?? tags.office ?? 'inconnu',
      adresse: rue ? [numero, rue].filter(Boolean).join(' ') + (cp ? `, ${cp} ${ville ?? ''}`.trimEnd() : '') : null,
      telephone: tags.phone ?? tags['contact:phone'] ?? null,
      site: tags.website ?? tags['contact:website'] ?? null,
      horaires: tags.opening_hours ?? null,
      latitude: lat,
      longitude: lon,
    });
  }

  etablissements.sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));

  return {
    fiche: FICHE_SOURCE_OSM,
    collecteLe: new Date().toISOString(),
    codeNis,
    etablissements,
    completude: {
      total: etablissements.length,
      avecAdresse: etablissements.filter((e) => e.adresse).length,
      avecHoraires: etablissements.filter((e) => e.horaires).length,
      avecTelephone: etablissements.filter((e) => e.telephone).length,
    },
  };
}
