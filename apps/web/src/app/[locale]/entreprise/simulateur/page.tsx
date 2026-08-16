import { notFound } from 'next/navigation';
import { trajectoireCarbone } from '@pc/core';
import { estLocale, type Locale } from '@/i18n';
import { Simulateur } from '@/components/entreprise/simulateur';

export default async function PageSimulateur({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!estLocale(locale)) notFound();
  const annee = new Date().getFullYear();
  return <Simulateur locale={locale as Locale} trajectoire={trajectoireCarbone(annee, 3)} annee={annee} />;
}
