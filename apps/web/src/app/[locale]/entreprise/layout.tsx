import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftRight, TriangleAlert } from 'lucide-react';
import { dictionnaire, estLocale, type Locale } from '@/i18n';
import { NavEntreprise } from '@/components/entreprise/nav';
import { ENTREPRISE } from '@/contenu/entreprise';
import './entreprise.css';

/**
 * L'espace entreprise.
 *
 * Séparé : sa propre navigation latérale, son propre accent chromatique, et une
 * barre supérieure pour revenir à l'espace habitant. Le lecteur doit sentir
 * qu'il a changé de produit, pas de page.
 *
 * Il conserve en revanche les jetons, la typographie et la grammaire de
 * l'application : c'est une extension, pas une seconde application.
 */
export default async function LayoutEntreprise({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!estLocale(locale)) notFound();
  const l = locale as Locale;
  const d = dictionnaire(l);

  return (
    <div className="espace-entreprise">
      {/* --- La barre de bascule ---------------------------------------- */}
      <div className="border-b border-[var(--pc-trait)] bg-[var(--pc-fond-enfonce)]">
        <div className="contenu flex flex-wrap items-center justify-between gap-3 py-2.5">
          <p className="flex items-center gap-2 text-[13px]">
            <span
              aria-hidden
              className="grid h-5 w-5 place-items-center rounded-[5px] text-[10px] font-bold text-white"
              style={{ background: 'var(--pc-accent)' }}
            >
              E
            </span>
            <span className="font-semibold">{d.nav.espaceEntreprise}</span>
            <span className="text-[var(--pc-encre-tenue)]">· {ENTREPRISE.denomination}</span>
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/${l}/coulisses`}
              className="text-[13px] text-[var(--pc-encre-douce)] underline-offset-4 hover:underline"
            >
              {d.nav.coulisses}
            </Link>
            <Link
              href={`/${l}/impact`}
              className="inline-flex items-center gap-1.5 rounded-[var(--pc-rayon)] border border-[var(--pc-trait-fort)] px-3 py-1.5 text-[13px] hover:bg-[var(--pc-fond-eleve)]"
            >
              <ArrowLeftRight className="h-3.5 w-3.5" aria-hidden />
              {d.nav.retourHabitant}
            </Link>
          </div>
        </div>
      </div>

      {/* --- L'avertissement, permanent --------------------------------- */}
      <div
        className="border-b px-4 py-2 text-center text-[12.5px]"
        style={{ borderColor: 'var(--pc-retard)', backgroundColor: 'var(--pc-retard-fond)', color: 'var(--pc-retard)' }}
      >
        <TriangleAlert className="mr-1.5 inline h-3.5 w-3.5" aria-hidden />
        Espace de démonstration. L’entreprise, ses marchés et ses déclarations sont fictifs — aucune donnée réelle
        n’est attachée à un établissement de la commune.
      </div>

      <div className="contenu grid gap-8 py-7 md:grid-cols-[13rem_1fr]">
        <NavEntreprise d={d} locale={l} />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
