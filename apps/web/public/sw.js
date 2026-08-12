/*
 * Mode hors ligne.
 *
 * Exigence d'accessibilité autant que de confort : une part des gens
 * consultent dans un transport, un sous-sol, ou avec un forfait limité.
 *
 * Stratégie, volontairement simple :
 *   — les pages déjà visitées sont servies depuis le cache quand le réseau
 *     tombe, et le bandeau « hors ligne » de l'application le dit ;
 *   — les ressources statiques passent par le cache d'abord ;
 *   — rien n'est préchargé de force : on ne consomme pas le forfait de
 *     quelqu'un pour des écrans qu'il n'a pas demandés.
 */

const CACHE = 'pc-v2';

self.addEventListener('install', (evenement) => {
  self.skipWaiting();
  evenement.waitUntil(caches.open(CACHE));
});

self.addEventListener('activate', (evenement) => {
  evenement.waitUntil(
    caches.keys().then((cles) => Promise.all(cles.filter((c) => c !== CACHE).map((c) => caches.delete(c)))),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (evenement) => {
  const requete = evenement.request;
  if (requete.method !== 'GET') return;

  const url = new URL(requete.url);
  if (url.origin !== self.location.origin) return;

  // Ressources statiques : cache d'abord.
  if (url.pathname.startsWith('/_next/static') || url.pathname.startsWith('/fonts')) {
    evenement.respondWith(
      caches.match(requete).then(
        (cache) =>
          cache ||
          fetch(requete).then((reponse) => {
            const copie = reponse.clone();
            caches.open(CACHE).then((c) => c.put(requete, copie));
            return reponse;
          }),
      ),
    );
    return;
  }

  // Pages et données : réseau d'abord, cache en repli.
  evenement.respondWith(
    fetch(requete)
      .then((reponse) => {
        const copie = reponse.clone();
        caches.open(CACHE).then((c) => c.put(requete, copie));
        return reponse;
      })
      .catch(() => caches.match(requete).then((cache) => cache || caches.match('/fr'))),
  );
});
