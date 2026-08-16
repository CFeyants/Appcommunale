import { notFound } from 'next/navigation';
import { estLocale, type Locale } from '@/i18n';
import { FormulaireDeclaration } from '@/components/entreprise/declaration';

export default async function PageDeclaration({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!estLocale(locale)) notFound();
  return <FormulaireDeclaration locale={locale as Locale} />;
}
