import Link from 'next/link';
import { EXPLICATION_MOTIF } from '@pc/core';
import { Tabs, TabsList, TabsTrigger } from '@pc/ui';
import type { Dictionnaire, Locale } from '@/i18n';
import { formaterDate, formaterNombre } from '@/i18n';
import type { EntreeRegistre } from '@/lib/donnees';

/**
 * Le registre complet, rendu côté serveur.
 *
 * Il est piloté par l'URL — onglet, recherche, page — et non par un état
 * client. Trois raisons, dans l'ordre :
 *
 *   1. trois mille lignes ne traversent pas le réseau pour être filtrées dans
 *      le navigateur : la page d'accueil retombe de sept cents à cinquante
 *      kilo-octets, ce qui compte pour qui consulte avec un forfait limité ;
 *   2. le registre fonctionne sans JavaScript, ce qui est une exigence
 *      d'accessibilité autant que de robustesse ;
 *   3. une recherche devient une adresse qu'on peut citer — utile quand
 *      quelqu'un veut montrer un acte écarté et son motif.
 *
 * La pagination est explicite et finie. Il n'y a pas de défilement infini,
 * et la dernière page le dit.
 */

const PAR_PAGE = 40;

export interface EtatRegistre {
  onglet: 'retenus' | 'ecartes' | 'seances';
  recherche: string;
  page: number;
}

export function lireEtatRegistre(sp: Record<string, string | string[] | undefined>): EtatRegistre {
  const onglet = sp.onglet === 'ecartes' || sp.onglet === 'seances' ? sp.onglet : 'retenus';
  const recherche = typeof sp.q === 'string' ? sp.q : '';
  const page = Math.max(1, Number(typeof sp.page === 'string' ? sp.page : 1) || 1);
  return { onglet, recherche, page };
}

function lien(locale: Locale, etat: Partial<EtatRegistre>, base: EtatRegistre) {
  const p = new URLSearchParams();
  const o = { ...base, ...etat };
  if (o.onglet !== 'retenus') p.set('onglet', o.onglet);
  if (o.recherche) p.set('q', o.recherche);
  if (o.page > 1) p.set('page', String(o.page));
  const q = p.toString();
  return `/${locale}${q ? `?${q}` : ''}#registre`;
}

export function Registre({
  retenus,
  ecartes,
  seances,
  etat,
  d,
  locale,
}: {
  retenus: EntreeRegistre[];
  ecartes: EntreeRegistre[];
  seances: Array<{ id: string; date: string | null; points: number }>;
  etat: EtatRegistre;
  d: Dictionnaire;
  locale: Locale;
}) {
  const q = etat.recherche.trim().toLowerCase();
  const filtrer = (l: EntreeRegistre[]) => (q ? l.filter((i) => i.titreOrigine.toLowerCase().includes(q)) : l);
  const liste = etat.onglet === 'ecartes' ? filtrer(ecartes) : filtrer(retenus);
  const total = etat.onglet === 'seances' ? seances.length : liste.length;
  const pages = Math.max(1, Math.ceil(total / PAR_PAGE));
  const page = Math.min(etat.page, pages);
  const debut = (page - 1) * PAR_PAGE;

  return (
    <section className="mt-14 scroll-mt-20" id="registre" aria-labelledby="titre-registre">
      <h2 id="titre-registre" className="text-[19px] font-semibold tracking-tight">
        {d.accueil.registreTitre}
      </h2>
      <p className="mt-1.5 max-w-prose text-[13.5px] text-[var(--pc-encre-douce)]">{d.accueil.registreIntro}</p>

      <form method="get" action={`/${locale}`} className="mt-4 flex flex-wrap items-center gap-2">
        <input type="hidden" name="onglet" value={etat.onglet} />
        <label className="flex-1 sm:max-w-xs">
          <span className="sr-only">{d.commun.recherche}</span>
          <input
            name="q"
            defaultValue={etat.recherche}
            placeholder={`${d.commun.recherche} dans les intitulés néerlandais`}
            className="h-9 w-full rounded-[var(--pc-rayon)] border border-[var(--pc-trait-fort)] bg-[var(--pc-fond-eleve)] px-3 text-[13px]"
          />
        </label>
        <button
          type="submit"
          className="h-9 rounded-[var(--pc-rayon)] border border-[var(--pc-trait-fort)] bg-[var(--pc-fond-eleve)] px-3 text-[13px] hover:bg-[var(--pc-fond-enfonce)]"
        >
          {d.commun.recherche}
        </button>
        <a
          href={`/api/${locale}/registre.csv?onglet=${etat.onglet}`}
          className="h-9 rounded-[var(--pc-rayon)] border border-[var(--pc-trait-fort)] bg-[var(--pc-fond-eleve)] px-3 text-[13px] leading-9 hover:bg-[var(--pc-fond-enfonce)]"
        >
          {d.commun.exportCsv}
        </a>
      </form>

      <Tabs value={etat.onglet} className="mt-5">
        <TabsList>
          <TabsTrigger value="retenus" asChild>
            <Link href={lien(locale, { onglet: 'retenus', page: 1 }, etat)}>
              {d.accueil.ongletRetenus} <span className="chiffre opacity-60">{retenus.length}</span>
            </Link>
          </TabsTrigger>
          <TabsTrigger value="ecartes" asChild>
            <Link href={lien(locale, { onglet: 'ecartes', page: 1 }, etat)}>
              {d.accueil.ongletEcartes} <span className="chiffre opacity-60">{ecartes.length}</span>
            </Link>
          </TabsTrigger>
          <TabsTrigger value="seances" asChild>
            <Link href={lien(locale, { onglet: 'seances', page: 1 }, etat)}>
              {d.accueil.ongletSeances} <span className="chiffre opacity-60">{seances.length}</span>
            </Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-4">
        {etat.onglet === 'seances' ? (
          <ul className="divide-y divide-[var(--pc-trait)] rounded-[var(--pc-rayon)] border border-[var(--pc-trait)]">
            {seances.slice(debut, debut + PAR_PAGE).map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-4 px-4 py-2.5 text-[13px]">
                <span className="chiffre">{s.date ? formaterDate(s.date, locale) : '—'}</span>
                <span className="chiffre text-[var(--pc-encre-tenue)]">
                  {formaterNombre(s.points, locale)} points
                </span>
              </li>
            ))}
          </ul>
        ) : total === 0 ? (
          <p className="px-1 py-8 text-center text-[13px] text-[var(--pc-encre-tenue)]">{d.commun.aucunResultat}</p>
        ) : (
          <ul className="divide-y divide-[var(--pc-trait)] rounded-[var(--pc-rayon)] border border-[var(--pc-trait)]">
            {liste.slice(debut, debut + PAR_PAGE).map((item) => (
              <li key={item.id} className="px-4 py-3">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <Link
                    href={`/${locale}/acte/${item.id}`}
                    className="text-[13.5px] font-medium underline-offset-2 hover:underline"
                  >
                    {item.titreOrigine}
                  </Link>
                  <span className="chiffre shrink-0 text-[11.5px] text-[var(--pc-encre-tenue)]">
                    {formaterDate(item.dateActe, locale)}
                  </span>
                </div>
                {etat.onglet === 'ecartes' && item.motif && (
                  <p className="mt-1 text-[12px] text-[var(--pc-encre-tenue)]">
                    <span className="font-medium">{d.accueil.motifEcart} :</span> {EXPLICATION_MOTIF[item.motif]}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <nav className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[13px]" aria-label="Pagination">
        <span className="chiffre text-[var(--pc-encre-tenue)]">
          Page {page} sur {pages} — {formaterNombre(total, locale)} entrées
        </span>
        <span className="flex gap-2">
          {page > 1 && (
            <Link
              href={lien(locale, { page: page - 1 }, etat)}
              className="rounded-[var(--pc-rayon)] border border-[var(--pc-trait-fort)] px-3 py-1.5"
            >
              Précédent
            </Link>
          )}
          {page < pages ? (
            <Link
              href={lien(locale, { page: page + 1 }, etat)}
              className="rounded-[var(--pc-rayon)] border border-[var(--pc-trait-fort)] px-3 py-1.5"
            >
              Suivant
            </Link>
          ) : (
            <span className="text-[var(--pc-encre-tenue)]">{d.accueil.finDeListe}</span>
          )}
        </span>
      </nav>
    </section>
  );
}
