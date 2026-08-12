/**
 * Connecteur Fluvius — énergie prélevée, injectée et production décentralisée,
 * par commune.
 *
 * Les identifiants de jeux de données changent : ceux-ci ont été rappelés le
 * 12 août 2026 et répondent. Le champ commune est en MAJUSCULES dans la source.
 */

import { obtenirJson } from '../http';

const BASE = 'https://opendata.fluvius.be/api/explore/v2.1/catalog/datasets';
const JEU_VOLUMES = '1-19-totaal-gealloceerd-volume';

export const FICHE_SOURCE_FLUVIUS = {
  connecteur: 'fluvius',
  libelle: 'Énergie prélevée et injectée par commune — Fluvius',
  organisme: 'Fluvius System Operator',
  licence: 'Licence ouverte Fluvius (Opendatasoft)',
  endpoint: `${BASE}/${JEU_VOLUMES}/records`,
  cadence: 'Mensuelle',
  limitesConnues: [
    'Volumes de réseau, pas consommation réelle des ménages : l’autoconsommation solaire n’y figure pas.',
    'Le champ commune est en majuscules dans la source ; toute requête en minuscules renvoie zéro ligne sans erreur.',
    'Les identifiants de jeux de données Fluvius changent sans préavis : deux identifiants cités dans la version 1 du projet avaient déjà disparu.',
    'Aucune ventilation par ménage : la donnée est agrégée à la commune.',
  ],
} as const;

interface Enregistrement {
  rapporteringsmaand: string;
  leveringsadresgemeente: string;
  sector: string;
  totaal_volume_afname: number | null;
  totaal_volume_injectie: number | null;
}

export async function collecterEnergie(communeMajuscules: string) {
  const url =
    `${BASE}/${JEU_VOLUMES}/records?` +
    `where=${encodeURIComponent(`leveringsadresgemeente="${communeMajuscules}"`)}` +
    `&limit=100&order_by=rapporteringsmaand`;

  const mensuel: Array<{ mois: string; secteur: string; prelevementKwh: number | null; injectionKwh: number | null }> = [];
  for (let offset = 0; offset < 1000; offset += 100) {
    const reponse = await obtenirJson<{ total_count: number; results: Enregistrement[] }>(`${url}&offset=${offset}`, {
      delaiMs: 400,
    });
    if (!reponse || reponse.results.length === 0) break;
    for (const r of reponse.results) {
      mensuel.push({
        mois: r.rapporteringsmaand,
        secteur: r.sector,
        prelevementKwh: r.totaal_volume_afname,
        injectionKwh: r.totaal_volume_injectie,
      });
    }
    if (offset + 100 >= reponse.total_count) break;
  }

  // Agrégation sur les douze derniers mois disponibles, par secteur.
  const mois = [...new Set(mensuel.map((m) => m.mois))].sort();
  const douzeDerniers = mois.slice(-12);
  const parSecteur = new Map<string, { prelevement: number; injection: number }>();
  for (const m of mensuel) {
    if (!douzeDerniers.includes(m.mois)) continue;
    const acc = parSecteur.get(m.secteur) ?? { prelevement: 0, injection: 0 };
    acc.prelevement += m.prelevementKwh ?? 0;
    acc.injection += m.injectionKwh ?? 0;
    parSecteur.set(m.secteur, acc);
  }

  return {
    fiche: FICHE_SOURCE_FLUVIUS,
    collecteLe: new Date().toISOString(),
    commune: communeMajuscules,
    fenetre: { du: douzeDerniers[0] ?? null, au: douzeDerniers.at(-1) ?? null },
    mensuel,
    parSecteur: [...parSecteur.entries()].map(([secteur, v]) => ({
      secteur,
      prelevementGwh: Math.round((v.prelevement / 1e6) * 10) / 10,
      injectionGwh: Math.round((v.injection / 1e6) * 10) / 10,
    })),
  };
}
