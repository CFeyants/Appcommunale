// Connecteur Lokaal Beslist — fonction serverless (Vercel).
// Récupère les vraies séances du conseil et du collège de Kraainem via l'API
// publique JSON:API (sans clé) et les normalise pour le front.
//
// Source : https://lokaalbeslist.vlaanderen.be — décisions locales flamandes
// en données liées. Licence : Modellicentie Gratis Hergebruik (mention obligatoire).
//
// Contournement CORS + normalisation : le navigateur appelle /api/lokaalbeslist
// (même origine), la fonction appelle l'API amont côté serveur.

const BASE = "https://lokaalbeslist.vlaanderen.be";
const FILTER =
  "filter[governing-body][is-time-specialization-of][administrative-unit][name]=Kraainem";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  // cache CDN 1h, revalidation en tâche de fond
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");

  const size = Math.min(parseInt(req.query?.size, 10) || 30, 100);
  const url =
    `${BASE}/sessions?${FILTER}` +
    `&page[size]=${size}&sort=-started-at`;

  try {
    const r = await fetch(url, {
      headers: { Accept: "application/vnd.api+json" },
    });
    if (!r.ok) throw new Error(`upstream ${r.status}`);
    const json = await r.json();
    const data = Array.isArray(json.data) ? json.data : [];

    const items = data
      .map((s) => {
        const a = s.attributes || {};
        const date = a["started-at"] || a["planned-start"] || a["ended-at"] || null;
        const id = s.id;
        const self = s.links && s.links.self ? s.links.self : null;
        return {
          id,
          date,
          url: self || `${BASE}/`,
        };
      })
      .filter((x) => x.date);

    const total =
      (json.meta && (json.meta.count ?? json.meta["total-count"])) ?? null;

    res.status(200).json({
      ok: true,
      source: "Lokaal Beslist",
      licence: "Modellicentie Gratis Hergebruik",
      total,
      items,
    });
  } catch (e) {
    // Le front retombe sur les données de démonstration.
    res.status(200).json({ ok: false, error: String(e && e.message || e), items: [] });
  }
}
