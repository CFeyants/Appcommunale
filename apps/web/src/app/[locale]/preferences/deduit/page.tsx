import { notFound } from 'next/navigation';
import { dictionnaire, estLocale, type Locale } from '@/i18n';
import { EcranDeduit } from '@/components/identite/deduit';

export default async function PageDeduit({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!estLocale(locale)) notFound();
  const l = locale as Locale;
  return <EcranDeduit d={dictionnaire(l)} locale={l} />;
}
