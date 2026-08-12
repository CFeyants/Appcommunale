import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ICI = dirname(fileURLToPath(import.meta.url));
/** Racine du monorepo, deux niveaux au-dessus de apps/web. */
const RACINE = resolve(ICI, '../..');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Les paquets internes sont consommés en TypeScript source : pas d'étape de
  // compilation intermédiaire, donc pas de version compilée qui diverge.
  transpilePackages: ['@pc/core', '@pc/ui', '@pc/connectors'],
  // Politesse réseau et identification du projet : le User-Agent des
  // connecteurs porte un contact, voir packages/connectors/src/http.ts.
  poweredByHeader: false,

  /*
   * Déploiement en monorepo : embarquer /data avec les fonctions.
   *
   * L'interface lit /data avec `fs.readFile` et un chemin calculé à
   * l'exécution. Le traçage de fichiers de Next ne peut pas le deviner : sans
   * les deux options ci-dessous, les fonctions déployées ne trouvent aucun
   * instantané et **tous les écrans s'affichent vides**, sans erreur — le pire
   * des échecs, celui qui ressemble à un succès.
   *
   * `outputFileTracingRoot` autorise le traçage à remonter au-dessus de
   * apps/web ; `outputFileTracingIncludes` force l'inclusion des instantanés.
   */
  outputFileTracingRoot: RACINE,
  outputFileTracingIncludes: {
    '/**': ['../../data/**/*.json'],
  },

  /*
   * « Chaque écran expose son JSON à la même URL suffixée .json. »
   *
   * Le routeur de Next ne sait pas nommer un segment dynamique « [locale].json ».
   * Les réécritures ci-dessous donnent l'adresse promise sans tordre
   * l'arborescence : /fr.json, /fr/budget.json, /fr/acte/<id>.json.
   */
  async rewrites() {
    return [
      { source: '/:locale(fr|nl|en).json', destination: '/api/json/:locale/fil' },
      { source: '/:locale(fr|nl|en)/acte/:id.json', destination: '/api/json/:locale/acte-:id' },
      { source: '/:locale(fr|nl|en)/:ecran.json', destination: '/api/json/:locale/:ecran' },
      { source: '/api/:locale(fr|nl|en)/acte/:id.json', destination: '/api/json/:locale/acte-:id' },
    ];
  },

  async headers() {
    return [
      {
        source: '/:chemin*',
        headers: [
          // Aucun traceur tiers n'est chargé ; la politique le rend vérifiable
          // depuis l'extérieur plutôt que sur parole.
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data:",
              "font-src 'self'",
              // Aucune connexion sortante : les données viennent de /data.
              "connect-src 'self'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'no-referrer' },
          // Aucune de ces trois permissions n'est utilisée, sauf la
          // géolocalisation pour le signalement — et seulement à la demande.
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
        ],
      },
      /*
       * Les exports sont faits pour être repris : ils doivent être lisibles
       * depuis un autre domaine. C'est la réversibilité, rendue opérante.
       *
       * Les trois motifs sont nécessaires : les en-têtes sont appariés sur le
       * chemin **demandé**, pas sur la destination de la réécriture. Une seule
       * règle sur `/api/*` laisserait `/fr/budget.json` sans en-tête, et un
       * réutilisateur se heurterait à la politique d'origine sans comprendre
       * pourquoi.
       */
      ...['/api/:chemin*', '/:locale(fr|nl|en).json', '/:locale(fr|nl|en)/:chemin*.json'].map((source) => ({
        source,
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, OPTIONS' },
          { key: 'Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' },
        ],
      })),
      {
        source: '/sw.js',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' }],
      },
    ];
  },
};

export default nextConfig;
