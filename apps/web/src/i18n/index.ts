import { fr, type Dictionnaire } from './fr';
import { nl } from './nl';
import { en } from './en';

export const LOCALES = ['fr', 'nl', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const LOCALE_PAR_DEFAUT: Locale = 'fr';

const DICTIONNAIRES: Record<Locale, Dictionnaire> = { fr, nl, en };

export function estLocale(v: string): v is Locale {
  return (LOCALES as readonly string[]).includes(v);
}

export function dictionnaire(locale: Locale): Dictionnaire {
  return DICTIONNAIRES[locale];
}

export type { Dictionnaire };

/** Étiquettes de langue, dans leur propre langue. */
export const NOM_LOCALE: Record<Locale, string> = { fr: 'Français', nl: 'Nederlands', en: 'English' };

/**
 * Formatage des montants. Le séparateur de milliers change de langue ; les
 * chiffres, non — d'où `font-variant-numeric: tabular-nums` partout.
 */
export function formaterEuros(n: number, locale: Locale, decimales = 0): string {
  return new Intl.NumberFormat(locale === 'en' ? 'en-GB' : locale === 'nl' ? 'nl-BE' : 'fr-BE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: decimales,
    minimumFractionDigits: decimales,
  }).format(n);
}

export function formaterNombre(n: number, locale: Locale, decimales = 0): string {
  return new Intl.NumberFormat(locale === 'en' ? 'en-GB' : locale === 'nl' ? 'nl-BE' : 'fr-BE', {
    maximumFractionDigits: decimales,
    minimumFractionDigits: decimales,
  }).format(n);
}

export function formaterDate(iso: string, locale: Locale): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : locale === 'nl' ? 'nl-BE' : 'fr-BE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}
