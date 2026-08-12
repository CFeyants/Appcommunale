import { notFound } from 'next/navigation';
import { dictionnaire, estLocale, type Locale } from '@/i18n';
import { EcranIdentification } from '@/components/identite/ecran';

export default async function PageIdentite({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!estLocale(locale)) notFound();
  const l = locale as Locale;
  return <EcranIdentification d={dictionnaire(l)} locale={l} />;
}
