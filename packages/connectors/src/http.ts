/**
 * Politesse réseau.
 *
 * Un portail public n'a aucune obligation de nous servir. Trois choses le
 * rendent supportable : un User-Agent qui dit qui nous sommes et comment nous
 * joindre, une limitation de débit, et le respect d'ETag / If-Modified-Since
 * pour ne pas redemander ce qui n'a pas bougé.
 */

/**
 * Notre carte de visite auprès des portails publics.
 *
 * L'URL doit mener quelque part de valide : c'est par elle qu'un administrateur
 * d'Agentschap Binnenlands Bestuur ou d'Eurostat saura qui l'appelle, et
 * pourra nous écrire plutôt que nous bloquer. GitHub redirige indéfiniment
 * l'ancien nom vers le nouveau, mais l'inverse n'est pas vrai — d'où l'ordre
 * imposé : renommer le dépôt, puis déployer cette ligne.
 */
export const USER_AGENT =
  'PlateformeCitoyenne/2.0 (+https://github.com/CFeyants/appcitoyenne; contact: cedricfeyants@gmail.com)';

export interface OptionsHttp {
  /** Millisecondes entre deux appels au même hôte. */
  delaiMs?: number;
  /** Nombre de tentatives sur erreur transitoire (429, 5xx, réseau). */
  tentatives?: number;
  accept?: string;
  timeoutMs?: number;
}

const dernierAppel = new Map<string, number>();
/** Cache d'ETag, par URL. Persisté par l'appelant si nécessaire. */
const etags = new Map<string, string>();

function dormir(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export class ErreurAmont extends Error {
  constructor(
    readonly statut: number,
    readonly url: string,
    message: string,
  ) {
    super(message);
    this.name = 'ErreurAmont';
  }
}

/**
 * Récupère du JSON en respectant l'hôte. Renvoie `null` sur 304 : la donnée
 * n'a pas changé, il n'y a rien à réingérer.
 */
export async function obtenirJson<T = unknown>(url: string, options: OptionsHttp = {}): Promise<T | null> {
  const { delaiMs = 250, tentatives = 3, accept = 'application/json', timeoutMs = 45_000 } = options;
  const hote = new URL(url).host;

  for (let essai = 1; essai <= tentatives; essai++) {
    const precedent = dernierAppel.get(hote) ?? 0;
    const attente = precedent + delaiMs - Date.now();
    if (attente > 0) await dormir(attente);
    dernierAppel.set(hote, Date.now());

    const controleur = new AbortController();
    const minuteur = setTimeout(() => controleur.abort(), timeoutMs);
    try {
      const entetes: Record<string, string> = { Accept: accept, 'User-Agent': USER_AGENT };
      const etag = etags.get(url);
      if (etag) entetes['If-None-Match'] = etag;

      const reponse = await fetch(url, { headers: entetes, signal: controleur.signal });
      clearTimeout(minuteur);

      if (reponse.status === 304) return null;
      if (reponse.status === 429 || reponse.status >= 500) {
        if (essai === tentatives) throw new ErreurAmont(reponse.status, url, `amont ${reponse.status}`);
        // Attente exponentielle : 1 s, 2 s, 4 s.
        await dormir(1000 * 2 ** (essai - 1));
        continue;
      }
      if (!reponse.ok) throw new ErreurAmont(reponse.status, url, `amont ${reponse.status}`);

      const nouvelEtag = reponse.headers.get('etag');
      if (nouvelEtag) etags.set(url, nouvelEtag);
      return (await reponse.json()) as T;
    } catch (e) {
      clearTimeout(minuteur);
      if (e instanceof ErreurAmont) throw e;
      if (essai === tentatives) throw e;
      await dormir(1000 * 2 ** (essai - 1));
    }
  }
  return null;
}

/** Exécute des tâches avec une concurrence bornée. Quatre, pas plus. */
export async function enParallele<T, R>(
  entrees: T[],
  concurrence: number,
  travail: (entree: T, index: number) => Promise<R>,
): Promise<R[]> {
  const resultats = new Array<R>(entrees.length);
  let curseur = 0;
  const ouvriers = Array.from({ length: Math.min(concurrence, entrees.length) }, async () => {
    while (curseur < entrees.length) {
      const i = curseur++;
      resultats[i] = await travail(entrees[i]!, i);
    }
  });
  await Promise.all(ouvriers);
  return resultats;
}
