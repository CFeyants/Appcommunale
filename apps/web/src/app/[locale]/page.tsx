import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BandeauDegrade, NombreHeroique } from '@pc/ui';
import { dictionnaire, estLocale, formaterDate, formaterNombre, type Locale } from '@/i18n';
import { alleger, chargerFil, versRegistre } from '@/lib/donnees';
import { FilClient } from '@/components/fil/fil-client';
import { lireEtatRegistre, Registre } from '@/components/fil/registre';
import { BandeauIdentite } from '@/components/identite/bandeau';

export default async function PageFil({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  const etatRegistre = lireEtatRegistre(await searchParams);
  if (!estLocale(locale)) notFound();
  const l = locale as Locale;
  const d = dictionnaire(l);

  const { disponible, items, seances, fenetre, statistiques, depassements } = await chargerFil();
  const publies = items.filter((i) => i.admission.publie);
  const ecartes = items.filter((i) => !i.admission.publie);

  return (
    <div className="contenu py-8 md:py-12">
      <BandeauIdentite d={d} locale={l} />

      <header className="mt-8">
        <h1 className="sr-only">{d.nav.filLong}</h1>
        {/* Un seul nombre héroïque par écran. Ici : ce que la source contient
            réellement, et ce que le test d'admission en retient. */}
        <NombreHeroique
          valeur={statistiques ? formaterNombre(statistiques.points, l) : '—'}
          legende={`${d.accueil.contexteAvant} : ${
            fenetre ? `${formaterDate(fenetre.depuis, l)} → ${formaterDate(fenetre.jusqua, l)}` : '—'
          }`}
          unite={d.accueil.actesExamines}
          precision={
            statistiques
              ? `Sur ${formaterNombre(statistiques.points, l)} points d’agenda collectés, ${formaterNombre(
                  statistiques.besluitenResolus,
                  l,
                )} portent un acte, et ${formaterNombre(
                  publies.length,
                  l,
                )} passent le test d’admission. Le reste reste consultable au registre, avec son motif.`
              : undefined
          }
        />
      </header>

      {!disponible && (
        <div className="mt-6">
          <BandeauDegrade
            texte={
              'Aucune collecte n’a encore abouti pour ce territoire. Cet écran n’affiche donc rien plutôt qu’un contenu de remplacement. ' +
              'La page « État des sources » dit où en est chaque connecteur.'
            }
          />
        </div>
      )}

      {depassements.length > 0 && (
        <div
          className="mt-6 rounded-[var(--pc-rayon)] border border-[var(--pc-serieux)] bg-[var(--pc-serieux-fond)] px-4 py-3 text-[13px]"
          style={{ color: 'var(--pc-serieux)' }}
        >
          <strong className="font-semibold">Plafond de publication dépassé.</strong>{' '}
          {depassements.map((x) => `${x.mois} : ${x.retenus} items retenus pour un plafond de ${x.plafond}`).join(' · ')}.
          Au-delà du plafond, le filtre est trop permissif. Le dépassement est signalé ici plutôt qu’absorbé en
          silence ; les items excédentaires restent au registre.
        </div>
      )}

      {disponible && (
        <>
          <FilClient items={publies.map(alleger)} d={d} locale={l} />
          <Registre
            retenus={publies.map(versRegistre)}
            ecartes={ecartes.map(versRegistre)}
            seances={seances}
            etat={etatRegistre}
            d={d}
            locale={l}
          />
        </>
      )}

      <p className="mt-10 text-[12.5px] text-[var(--pc-encre-tenue)]">
        Cette page expose ses données brutes :{' '}
        <Link href={`/${l}.json`} className="text-[var(--pc-accent)] underline underline-offset-2">
          /{l}.json
        </Link>
      </p>
    </div>
  );
}
