import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Lock, TriangleAlert } from 'lucide-react';
import { NombreHeroique, Separator } from '@pc/ui';
import { dictionnaire, estLocale, formaterNombre, type Locale } from '@/i18n';
import { chargerDepenses, chargerGes } from '@/lib/donnees';
import {
  CE_QUE_CET_ECRAN_NE_FAIT_PAS,
  GESTES,
  PALIERS,
  PART_COLLECTIVE,
  SUR_LE_BAS_DU_CLASSEMENT,
  type ClePalier,
  type Geste,
} from '@/contenu/ce-qui-pese';

/**
 * « Ce qui pèse » — sous-écran de Mon impact.
 *
 * Il répond à la question que /fr/impact laisse entière : par quoi commencer ?
 *
 * Il ne calcule rien sur personne. Il publie un contenu de référence ordonné,
 * sourcé, identique pour tout le monde — exactement comme /fr/classement publie
 * ses poids.
 */
export default async function PageCeQuiPese({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!estLocale(locale)) notFound();
  const l = locale as Locale;
  const d = dictionnaire(l);

  // Ancrage sur des données réelles déjà collectées, plutôt qu'un chiffre cité.
  const [ges, depenses] = await Promise.all([chargerGes(), chargerDepenses()]);
  const derniere = ges?.derniereMesure ?? null;
  const population = depenses?.populationBelgique ?? null;
  const territorialParHabitant =
    derniere && population ? (derniere.valeur * 1e6) / population.valeur : null;

  const parPalier = (p: ClePalier) => GESTES.filter((g) => g.palier === p);

  return (
    <div className="contenu py-8 md:py-12">
      <Link
        href={`/${l}/impact`}
        className="inline-flex items-center gap-1.5 text-[13px] text-[var(--pc-encre-douce)] underline-offset-4 hover:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {d.nav.impactLong}
      </Link>

      <h1 className="sr-only">{d.nav.cePese}</h1>

      <div className="mt-5">
        <NombreHeroique
          valeur={PART_COLLECTIVE.partCollectiveTonnes.toString()}
          legende="Tonnes, sur seize, qu’aucun choix personnel ne touche"
          unite="tCO₂e par personne et par an"
          precision={PART_COLLECTIVE.explication}
        />
      </div>

      {/* --- La distinction, en tête d'écran ------------------------------- */}
      <div className="mt-7 rounded-[var(--pc-rayon)] border border-[var(--pc-accent)] bg-[var(--pc-accent-doux)] px-5 py-4">
        <p className="flex items-start gap-2.5 text-[14px]">
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-[var(--pc-accent)]" aria-hidden />
          <span>
            <strong className="font-semibold">Ce tableau ne calcule rien sur vous.</strong> Il publie ce que disent les
            études, et vous en faites ce que vous voulez. L’écran{' '}
            <Link href={`/${l}/impact`} className="underline underline-offset-2">
              Mon impact
            </Link>{' '}
            continue de ne convertir aucune de vos saisies en équivalent carbone : les facteurs varient d’un
            référentiel à l’autre, et la plateforme n’en impose aucun.
          </span>
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-[12.5px] text-[var(--pc-encre-douce)]">
          {CE_QUE_CET_ECRAN_NE_FAIT_PAS.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </div>

      {/* --- L'ancrage réel ------------------------------------------------ */}
      {territorialParHabitant && derniere && population && (
        <p className="mt-4 rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] px-4 py-3 text-[13px] text-[var(--pc-encre-douce)]">
          <span className="font-medium text-[var(--pc-encre)]">Le seul chiffre réellement mesuré de cet écran.</span>{' '}
          L’inventaire national situe les émissions territoriales belges à{' '}
          <span className="chiffre font-semibold">{formaterNombre(territorialParHabitant, l, 1)} tCO₂e</span> par
          habitant en {derniere.periode} — {formaterNombre(derniere.valeur, l, 1)} Mt pour{' '}
          {formaterNombre(population.valeur / 1e6, l, 1)} millions de personnes, données Eurostat déjà collectées.
          L’empreinte de consommation, qui compte aussi ce qui est importé, est plus élevée : les travaux la situent
          autour de {PART_COLLECTIVE.empreinteConsommationTonnes} tonnes. Les paliers ci-dessous se lisent contre ce
          second ordre de grandeur.
        </p>
      )}

      <Separator className="mt-9" />

      {/* --- Le classement -------------------------------------------------- */}
      <section className="mt-9" aria-labelledby="classement">
        <h2 id="classement" className="text-[19px] font-semibold tracking-tight">
          Les gestes, par ordre de grandeur
        </h2>
        <p className="mt-1.5 max-w-prose text-[13.5px] text-[var(--pc-encre-douce)]">
          En paliers, jamais en valeurs précises : un palier survit au désaccord entre référentiels, une décimale non.
          La troisième colonne est celle que les classements ne mettent pas — <strong>qui peut réellement le
          faire</strong>. Un classement qui l’ignore prescrit aux gens ce qu’ils ne peuvent pas faire.
        </p>

        <div className="mt-6 space-y-8">
          {PALIERS.map((palier) => {
            const gestes = parPalier(palier.cle);
            if (gestes.length === 0) return null;
            return (
              <div key={palier.cle}>
                <div className="flex items-baseline gap-3">
                  <h3 className="text-[15px] font-semibold">{palier.libelle}</h3>
                  <span
                    aria-hidden
                    className="h-1.5 flex-1"
                    style={{
                      background: `linear-gradient(90deg, var(--pc-accent) 0%, var(--pc-accent) ${palier.rang * 25}%, var(--pc-trait) ${palier.rang * 25}%)`,
                      borderRadius: 'var(--pc-marque-rayon)',
                    }}
                  />
                </div>

                <ul className="mt-3 space-y-2.5">
                  {gestes.map((g) => (
                    <LigneGeste key={g.cle} geste={g} locale={l} />
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* --- Le bas du classement vaut le haut ---------------------------- */}
      <section className="mt-10" aria-labelledby="bas">
        <h2 id="bas" className="text-[19px] font-semibold tracking-tight">
          Pourquoi le bas du classement vaut le haut
        </h2>
        <div className="mt-3 space-y-3 rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] bg-[var(--pc-fond-enfonce)] px-5 py-4 text-[13.5px]">
          <p>{SUR_LE_BAS_DU_CLASSEMENT.constat}</p>
          <p className="text-[var(--pc-encre-douce)]">{SUR_LE_BAS_DU_CLASSEMENT.precision}</p>
          <p className="text-[12px] text-[var(--pc-encre-tenue)]">
            {SUR_LE_BAS_DU_CLASSEMENT.source.organisme} — {SUR_LE_BAS_DU_CLASSEMENT.source.reference}
          </p>
        </div>
        <p className="mt-3 max-w-prose text-[13px] text-[var(--pc-encre-douce)]">
          C’est le même principe que l’onglet des actes écartés du registre : ce qu’on retire est aussi informatif que
          ce qu’on garde.{' '}
          <Link href={`/${l}/admission`} className="text-[var(--pc-accent)] underline underline-offset-2">
            {d.nav.admission}
          </Link>
        </p>
      </section>

      <p className="mt-10 text-[12.5px] text-[var(--pc-encre-tenue)]">
        Données brutes de cet écran :{' '}
        <Link href={`/${l}/impact/ce-qui-pese.json`} className="text-[var(--pc-accent)] underline underline-offset-2">
          /{l}/impact/ce-qui-pese.json
        </Link>
      </p>
    </div>
  );
}

function LigneGeste({ geste, locale }: { geste: Geste; locale: Locale }) {
  return (
    <li className="carte px-4 py-3.5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="text-[14.5px] font-medium">{geste.libelle}</p>
        {geste.surestime && (
          <span
            className="shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide"
            style={{ color: 'var(--pc-retard)', backgroundColor: 'var(--pc-retard-fond)' }}
          >
            souvent surestimé
          </span>
        )}
      </div>

      <p className="mt-1.5 text-[13px] text-[var(--pc-encre-douce)]">
        <span className="font-medium text-[var(--pc-encre)]">Qui peut le faire.</span> {geste.quiPeutLeFaire}
      </p>

      {geste.empeche && (
        <div
          className="mt-2.5 rounded-[var(--pc-rayon)] border-l-2 px-3 py-2 text-[12.5px]"
          style={{ borderColor: 'var(--pc-accent)', backgroundColor: 'var(--pc-fond-enfonce)' }}
        >
          <p className="text-[var(--pc-encre-douce)]">
            <span className="font-medium text-[var(--pc-encre)]">Ce qui l’empêche.</span> {geste.empeche.quoi}
          </p>
          <p className="mt-1 text-[11.5px] text-[var(--pc-encre-tenue)]">
            Niveau qui décide : {geste.empeche.niveau}
            {geste.empeche.lien && (
              <>
                {' · '}
                <Link
                  href={`/${locale}${geste.empeche.lien}`}
                  className="text-[var(--pc-accent)] underline underline-offset-2"
                >
                  {geste.empeche.libelleLien ?? 'voir la décision'}
                </Link>
              </>
            )}
          </p>
        </div>
      )}

      {geste.particulariteBelge && (
        <p className="mt-2 flex items-start gap-2 text-[12.5px] text-[var(--pc-encre-douce)]">
          <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--pc-encre-tenue)]" aria-hidden />
          <span>
            <span className="font-medium text-[var(--pc-encre)]">Particularité belge.</span> {geste.particulariteBelge}
          </span>
        </p>
      )}

      <p className="mt-2 text-[11.5px] text-[var(--pc-encre-tenue)]">
        {geste.source.organisme} — {geste.source.reference} · relevé le {geste.source.releveLe}
      </p>
    </li>
  );
}
