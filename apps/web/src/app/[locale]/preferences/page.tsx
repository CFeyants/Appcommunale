import { notFound } from 'next/navigation';
import { dictionnaire, estLocale, type Locale } from '@/i18n';
import { EcranPreferences } from '@/components/identite/preferences';

export default async function PagePreferences({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!estLocale(locale)) notFound();
  const l = locale as Locale;
  return <EcranPreferences d={dictionnaire(l)} locale={l} />;
}
