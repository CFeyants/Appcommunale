'use client';

import Link from 'next/link';
import { EtiquetteCategorie, LigneSource, PastillePertinence, PuceNiveau } from '@pc/ui';
import type { Dictionnaire, Locale } from '@/i18n';
import { formaterDate } from '@/i18n';
import type { ItemLeger } from '@/lib/donnees';

/**
 * La carte du fil. Cinq éléments, jamais six :
 *   1. l'étiquette de catégorie, en capitales ;
 *   2. le gros titre, en français ordinaire ;
 *   3. le niveau de pouvoir ;
 *   4. deux à trois lignes de détail — ce qui change, pour qui, à partir de quand ;
 *   5. la ligne de source, visible sans clic.
 *
 * Ce qui est emprunté au réseau social : la carte pleine largeur, la hiérarchie
 * typographique forte, la lecture au pouce, la densité faible. Ce qui ne l'est
 * pas : aucun compteur de vues, aucun « populaire », aucun pouce sur une
 * information.
 */
export function CarteFil({
  item,
  score,
  raison,
  d,
  locale,
}: {
  item: ItemLeger;
  score?: number;
  raison?: string;
  d: Dictionnaire;
  locale: Locale;
}) {
  return (
    <article className="carte group relative transition-colors hover:border-[var(--pc-trait-fort)]">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <EtiquetteCategorie categorie={item.categorie} libelle={d.categories[item.categorie]} />
          {score !== undefined && raison ? <PastillePertinence score={score} raison={raison} /> : null}
        </div>

        <h2 className="mt-3 text-[19px] font-semibold leading-snug tracking-tight sm:text-[21px]">
          <Link href={`/${locale}/acte/${item.id}`} className="after:absolute after:inset-0">
            {item.titre}
          </Link>
        </h2>

        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <PuceNiveau libelle={`${d.niveaux[item.niveau]} · Kraainem`} />
          <span className="chiffre text-[11.5px] text-[var(--pc-encre-tenue)]">{formaterDate(item.dateActe, locale)}</span>
        </div>

        <p className="mt-3 max-w-prose text-[14.5px] leading-relaxed text-[var(--pc-encre-douce)]">{item.impact}</p>

        {item.themes.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {item.themes.map((t) => (
              <li
                key={t}
                className="rounded-full bg-[var(--pc-fond-enfonce)] px-2 py-0.5 text-[11px] text-[var(--pc-encre-douce)]"
              >
                {d.themes[t]}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t border-[var(--pc-trait)] bg-[var(--pc-fond-enfonce)] px-5 py-2.5">
        <LigneSource source={item.source} />
      </div>

      {raison ? (
        <p className="relative z-10 border-t border-[var(--pc-trait)] px-5 py-2 text-[11.5px] text-[var(--pc-encre-tenue)]">
          <span className="font-medium">{d.accueil.raisonPresence} :</span> {raison}
        </p>
      ) : null}
    </article>
  );
}
