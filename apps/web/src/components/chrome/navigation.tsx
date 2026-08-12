'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Banknote,
  Compass,
  Landmark,
  Leaf,
  Newspaper,
  Menu,
  Monitor,
  Moon,
  Sun,
  X,
} from 'lucide-react';
import { cn } from '@pc/ui';
import type { Dictionnaire } from '@/i18n';
import { LOCALES, NOM_LOCALE, type Locale } from '@/i18n';

export const ECRANS = [
  { cle: 'fil', href: '', icone: Newspaper },
  { cle: 'budget', href: '/budget', icone: Banknote },
  { cle: 'vision', href: '/vision', icone: Compass },
  { cle: 'impact', href: '/impact', icone: Leaf },
  { cle: 'epargne', href: '/epargne', icone: Landmark },
] as const;

function racine(pathname: string, locale: Locale) {
  const reste = pathname.replace(`/${locale}`, '') || '/';
  return reste;
}

/** Les cinq écrans, toujours dans le même ordre : c'est la grammaire du produit. */
export function BarreBasse({ d, locale }: { d: Dictionnaire; locale: Locale }) {
  const pathname = usePathname();
  const chemin = racine(pathname, locale);

  return (
    <nav
      aria-label={d.nav.menu}
      className="barre-basse fixed inset-x-0 bottom-0 z-40 border-t border-[var(--pc-trait)] bg-[var(--pc-fond-eleve)]/95 backdrop-blur md:hidden"
    >
      <ul className="grid grid-cols-5">
        {ECRANS.map(({ cle, href, icone: Icone }) => {
          const cible = `/${locale}${href}`;
          const actif = href === '' ? chemin === '/' : chemin.startsWith(href);
          return (
            <li key={cle}>
              <Link
                href={cible}
                aria-current={actif ? 'page' : undefined}
                className={cn(
                  'flex flex-col items-center gap-1 px-1 py-2.5 text-[10.5px] font-medium',
                  actif ? 'text-[var(--pc-accent)]' : 'text-[var(--pc-encre-tenue)]',
                )}
              >
                <Icone className="h-[18px] w-[18px]" aria-hidden strokeWidth={actif ? 2.25 : 1.75} />
                <span className="truncate">{d.nav[cle]}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function EnTete({ d, locale }: { d: Dictionnaire; locale: Locale }) {
  const pathname = usePathname();
  const chemin = racine(pathname, locale);
  const [menuOuvert, setMenuOuvert] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--pc-trait)] bg-[var(--pc-fond)]/92 backdrop-blur">
      <div className="contenu flex h-14 items-center justify-between gap-4">
        <Link href={`/${locale}`} className="flex shrink-0 items-center gap-2">
          <span
            aria-hidden
            className="grid h-6 w-6 place-items-center rounded-[6px] bg-[var(--pc-accent)] text-[11px] font-bold text-white"
          >
            5
          </span>
          <span className="text-[15px] font-semibold tracking-tight">{d.meta.titreSite}</span>
        </Link>

        <nav aria-label={d.nav.menu} className="hidden md:block">
          <ul className="flex items-center gap-0.5">
            {ECRANS.map(({ cle, href }) => {
              const actif = href === '' ? chemin === '/' : chemin.startsWith(href);
              return (
                <li key={cle}>
                  <Link
                    href={`/${locale}${href}`}
                    aria-current={actif ? 'page' : undefined}
                    className={cn(
                      'rounded-[7px] px-3 py-1.5 text-[13.5px] font-medium transition-colors',
                      actif
                        ? 'bg-[var(--pc-fond-enfonce)] text-[var(--pc-encre)]'
                        : 'text-[var(--pc-encre-douce)] hover:text-[var(--pc-encre)]',
                    )}
                  >
                    {d.nav[cle]}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <SelecteurLangue locale={locale} />
          <SelecteurTheme d={d} />
          <button
            type="button"
            onClick={() => setMenuOuvert((v) => !v)}
            aria-expanded={menuOuvert}
            aria-label={d.nav.menu}
            className="rounded-[7px] p-2 text-[var(--pc-encre-douce)] hover:bg-[var(--pc-fond-enfonce)]"
          >
            {menuOuvert ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {menuOuvert && (
        <div className="border-t border-[var(--pc-trait)] bg-[var(--pc-fond-eleve)]">
          <ul className="contenu grid gap-0.5 py-3 sm:grid-cols-2">
            {[
              { href: '/preferences', mot: d.nav.preferences },
              { href: '/preferences/deduit', mot: d.nav.croitSavoir },
              { href: '/sources', mot: d.nav.sources },
              { href: '/classement', mot: d.nav.classement },
              { href: '/admission', mot: d.nav.admission },
              { href: '/moderation', mot: d.nav.moderation },
              { href: '/vie-privee', mot: d.nav.vieePrivee },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={`/${locale}${l.href}`}
                  onClick={() => setMenuOuvert(false)}
                  className="block rounded-[7px] px-3 py-2 text-[13.5px] text-[var(--pc-encre-douce)] hover:bg-[var(--pc-fond-enfonce)] hover:text-[var(--pc-encre)]"
                >
                  {l.mot}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

function SelecteurLangue({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const reste = pathname.replace(`/${locale}`, '');
  return (
    <div className="flex items-center rounded-[7px] border border-[var(--pc-trait)] p-0.5" role="group" aria-label="Langue">
      {LOCALES.map((l) => (
        <Link
          key={l}
          href={`/${l}${reste}`}
          hrefLang={l}
          aria-label={NOM_LOCALE[l]}
          aria-current={l === locale ? 'true' : undefined}
          className={cn(
            'rounded-[5px] px-1.5 py-0.5 text-[11px] font-semibold uppercase',
            l === locale ? 'bg-[var(--pc-fond-enfonce)] text-[var(--pc-encre)]' : 'text-[var(--pc-encre-tenue)]',
          )}
        >
          {l}
        </Link>
      ))}
    </div>
  );
}

type Choix = 'clair' | 'sombre' | 'systeme';

function SelecteurTheme({ d }: { d: Dictionnaire }) {
  const [choix, setChoix] = React.useState<Choix>('systeme');

  React.useEffect(() => {
    setChoix((localStorage.getItem('pc-theme') as Choix) ?? 'systeme');
  }, []);

  const appliquer = (c: Choix) => {
    setChoix(c);
    localStorage.setItem('pc-theme', c);
    const sombre = c === 'sombre' || (c === 'systeme' && matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', sombre);
  };

  const suivant: Record<Choix, Choix> = { clair: 'sombre', sombre: 'systeme', systeme: 'clair' };
  const Icone = choix === 'clair' ? Sun : choix === 'sombre' ? Moon : Monitor;
  const mot = choix === 'clair' ? d.nav.themeClair : choix === 'sombre' ? d.nav.themeSombre : d.nav.themeSysteme;

  return (
    <button
      type="button"
      onClick={() => appliquer(suivant[choix])}
      className="rounded-[7px] p-2 text-[var(--pc-encre-douce)] hover:bg-[var(--pc-fond-enfonce)]"
      aria-label={`${d.nav.theme} : ${mot}`}
      title={`${d.nav.theme} : ${mot}`}
    >
      <Icone className="h-4 w-4" />
    </button>
  );
}
