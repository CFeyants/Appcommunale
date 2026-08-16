import { notFound } from 'next/navigation';
import { estLocale, type Locale } from '@/i18n';
import { dictionnaire } from '@/i18n';
import { Coulisses } from '@/components/coulisses/coulisses';

/**
 * Les coulisses — le même objet vu des deux côtés.
 *
 * À gauche l'habitant, à droite l'entreprise, au centre la donnée commune et
 * son trajet. C'est ce mode qui justifie une maquette unique plutôt que deux :
 * il montre que les deux espaces manipulent le même objet, et où passe
 * l'asymétrie entre eux.
 */
export default async function PageCoulisses({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!estLocale(locale)) notFound();
  const l = locale as Locale;
  return <Coulisses d={dictionnaire(l)} locale={l} />;
}
