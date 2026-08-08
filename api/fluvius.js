// Connecteur Fluvius — fonction serverless (Vercel).
// Consommation d'électricité et de gaz de Kraainem, et parc de production
// décentralisée, via le portail open data Fluvius (Opendatasoft, sans clé).
//
// Source : https://opendata.fluvius.be — mention de la source obligatoire.
//
// Note pour qui relit le dossier « Les données » : les identifiants de jeux
// qui y figurent (totaal-gealloceerd-volume, lokale-productie-installaties-
// per-gemeente) n'existent plus dans le catalogue. Les identifiants ci-dessous
// ont été relevés dans le catalogue le 8 août 2026 et répondent pour Kraainem.

const BASE = "https://opendata.fluvius.be/api/explore/v2.1/catalog/datasets";
const DS_VOLUME = "1-19-totaal-gealloceerd-volume";
const DS_PROD =
  "1_20-lijst-van-decentrale-productie-installaties-gekoppeld-aan-het-distributiene";

const COMMUNE = "KRAAINEM"; // champ leveringsadresgemeente, en majuscules
const POSTAL = "1950";
const MOIS = 12;

async function ods(dataset, params) {
  const qs = new URLSearchParams(params).toString();
  const r = await fetch(`${BASE}/${dataset}/records?${qs}`, {
    headers: { Accept: "application/json" },
  });
  if (!r.ok) throw new Error(`${dataset} → ${r.status}`);
  return r.json();
}

// Le jeu est publié mois par mois, avec un décalage variable. Plutôt que de
// figer une date de début, on prend les derniers mois disponibles et on
// renvoie la période réellement couverte.
function fenetre(rows) {
  const mois = [...new Set(rows.map((r) => String(r.rapporteringsmaand).slice(0, 7)))]
    .sort()
    .reverse()
    .slice(0, MOIS);
  return new Set(mois);
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Le jeu est mensuel : un cache de 12 h suffit largement.
  res.setHeader("Cache-Control", "s-maxage=43200, stale-while-revalidate=604800");

  try {
    const [vol, prod, prodTotal] = await Promise.all([
      ods(DS_VOLUME, {
        where: `leveringsadresgemeente="${COMMUNE}"`,
        group_by: "sector,rapporteringsmaand",
        select:
          "sector,rapporteringsmaand,sum(totaal_volume_afname) as afname,sum(totaal_volume_injectie) as injectie",
        order_by: "rapporteringsmaand desc",
        limit: String(MOIS * 4),
      }),
      ods(DS_PROD, {
        where: `postcode="${POSTAL}"`,
        group_by: "boekjaar_periode",
        select: "boekjaar_periode,sum(geinstalleerd_productievermogen_kva) as kva",
        order_by: "boekjaar_periode desc",
        limit: "1",
      }),
      ods(DS_PROD, { where: `postcode="${POSTAL}"`, limit: "1" }),
    ]);

    const rows = Array.isArray(vol.results) ? vol.results : [];
    const garde = fenetre(rows);
    const retenus = rows.filter((r) =>
      garde.has(String(r.rapporteringsmaand).slice(0, 7)),
    );

    const somme = (secteur, champ) =>
      Math.round(
        retenus
          .filter((r) => r.sector === secteur)
          .reduce((t, r) => t + (Number(r[champ]) || 0), 0),
      );

    const mois = [...garde].sort();
    const pv = (prod.results && prod.results[0]) || {};

    res.status(200).json({
      ok: true,
      source: "Fluvius — portail open data",
      licence: "Mention de la source obligatoire",
      periode: { de: mois[0] ?? null, a: mois[mois.length - 1] ?? null, mois: mois.length },
      elecKwh: somme("Elektriciteit", "afname"),
      gazKwh: somme("Gas", "afname"),
      injectionKwh: somme("Elektriciteit", "injectie"),
      pvInstallations: prodTotal.total_count ?? null,
      pvKva: pv.kva != null ? Math.round(Number(pv.kva)) : null,
      pvReleve: pv.boekjaar_periode ? String(pv.boekjaar_periode).slice(0, 7) : null,
    });
  } catch (e) {
    // Le front retombe sur les valeurs relevées le 8 août 2026 (src/data.ts).
    res.status(200).json({ ok: false, error: String((e && e.message) || e) });
  }
}
