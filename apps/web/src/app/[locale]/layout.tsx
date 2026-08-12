import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { dictionnaire, estLocale, LOCALES, type Locale } from '@/i18n';
import { FournisseurPreferences } from '@/lib/preferences';
import { BarreBasse, EnTete } from '@/components/chrome/navigation';
import { PiedDePage } from '@/components/chrome/pied';
import { IndicateurHorsLigne } from '@/components/chrome/hors-ligne';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!estLocale(locale)) return {};
  const d = dictionnaire(locale);
  return {
    title: { default: d.meta.titreSite, template: `%s — ${d.meta.titreSite}` },
    description: d.meta.description,
    alternates: {
      languages: Object.fromEntries(LOCALES.map((l) => [l, `/${l}`])),
    },
  };
}

export default async function LayoutLocale({
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
    <FournisseurPreferences>
      <a href="#contenu" className="saut-contenu">
        {d.nav.aller}
      </a>
      <div className="fond-page flex min-h-dvh flex-col">
        <EnTete d={d} locale={l} />
        <IndicateurHorsLigne texte={d.commun.horsLigne} />
        <main id="contenu" className="flex-1">
          {children}
        </main>
        <PiedDePage d={d} locale={l} />
        <BarreBasse d={d} locale={l} />
      </div>
    </FournisseurPreferences>
  );
}
