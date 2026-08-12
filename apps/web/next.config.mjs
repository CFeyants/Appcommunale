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
};

export default nextConfig;
