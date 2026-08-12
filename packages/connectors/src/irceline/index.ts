/**
 * Connecteur IRCEL-CELINE — qualité de l'air.
 *
 * Résultat honnête de ce connecteur, et c'est le plus utile : il n'y a aucune
 * station de mesure à Kraainem. La station la plus proche est une station
 * trafic bruxelloise, à plusieurs kilomètres, dont la valeur ne décrit pas
 * l'air de la commune. L'écran affiche donc la distance et le fait que la
 * commune n'est pas mesurée, plutôt qu'un chiffre emprunté.
 */

import { obtenirJson } from '../http';

const STATIONS = 'https://geo.irceline.be/sos/api/v1/stations';

export const FICHE_SOURCE_IRCELINE = {
  connecteur: 'irceline',
  libelle: 'Qualité de l’air — IRCEL-CELINE',
  organisme: 'Cellule interrégionale de l’environnement (IRCEL-CELINE)',
  licence: 'CC BY 4.0',
  endpoint: STATIONS,
  cadence: 'Horaire',
  limitesConnues: [
    'Aucune station de mesure sur le territoire de Kraainem.',
    'La station la plus proche est une station trafic : sa valeur décrit un carrefour, pas une commune résidentielle.',
    'Les grilles modélisées à 4 × 4 km existent mais ne sont pas exposées en API : elles ne sont disponibles que par FTP.',
  ],
} as const;

interface StationGeoJson {
  properties: { id: number; label: string };
  geometry: { coordinates: [number, number, number | string] };
}

function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function collecterQualiteAir(lat: number, lon: number) {
  const reponse = await obtenirJson<StationGeoJson[]>(STATIONS, { delaiMs: 500 });
  if (!reponse) throw new Error('IRCELINE n’a rien renvoyé');

  const stations = reponse
    .map((s) => {
      const [sLon, sLat] = s.geometry.coordinates;
      return {
        id: s.properties.id,
        libelle: s.properties.label,
        latitude: sLat,
        longitude: sLon,
        distanceKm: Math.round(distanceKm(lat, lon, sLat, sLon) * 10) / 10,
      };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 8);

  return {
    fiche: FICHE_SOURCE_IRCELINE,
    collecteLe: new Date().toISOString(),
    totalStationsBelgique: reponse.length,
    /** Vrai dès qu'aucune station n'est à moins d'un kilomètre du centre. */
    aucuneStationSurLaCommune: (stations[0]?.distanceKm ?? 99) > 1,
    stations,
  };
}
