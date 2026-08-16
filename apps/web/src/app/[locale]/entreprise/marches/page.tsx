import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CircleCheck, Info } from 'lucide-react';
import { PARAMETRES_SEUIL, seuilDeclaration } from '@pc/core';
import { dictionnaire, estLocale, formaterEuros, type Locale } from '@/i18n';
import { MARCHES_ENTREPRISE } from '@/contenu/entreprise';
import { BadgeFictif } from '@/components/achats/puce-statut';

/**
 * Mes marchés.
 *
 * Pour chaque marché : le montant, l'impact avec les valeurs déclarées, ce
 * qu'il serait au forfait, et la différence. Et une colonne qui dit si le
 * marché est **au-dessus ou en dessous du seuil** — en dessous, l'entreprise
 * n'a rien à fournir, et l'écran le dit clairement plutôt que de laisser planer
 * une obligation.
 */
export default async function PageMarches({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!estLocale(locale)) notFound();
  const l = locale as Locale;
  const d = dictionnaire(l);

  const seuil = seuilDeclaration(PARAMETRES_SEUIL.coutAnnualiseDeclarationEur, PARAMETRES_SEUIL.tauxImpactMoyen);
  const enCours = MARCHES_ENTREPRISE.filter((m) => m.etat === 'en-cours');
  const aVenir = MARCHES_ENTREPRISE.filter((m) => m.etat === 'a-venir');

  return (
    <div className="space-y-8">
      <header>
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h1 className="text-[24px] font-semibold tracking-tight md:text-[28px]">Mes marchés</h1>
          <BadgeFictif />
        </div>
        <p className="mt-1.5 max-w-prose text-[13.5px] text-[var(--pc-encre-douce)]">
          Ce que vos valeurs déclarées changent, marché par marché. Le seuil de déclaration est de{' '}
          <span className="chiffre font-medium">
            {formaterEuros(Math.round(seuil.seuilEur / 1000) * 1000, l)}
          </span>{' '}
          de marché annuel —{' '}
          <Link href={`/${l}/bareme`} className="text-[var(--pc-accent)] underline underline-offset-2">
            il se calcule, il ne se décide pas
          </Link>
          .
        </p>
      </header>

      <section aria-labelledby="en-cours">
        <h2 id="en-cours" className="text-[18px] font-semibold tracking-tight">
          En cours
        </h2>
        <div className="mt-3 space-y-3">
          {enCours.map((m) => (
            <CarteMarcheEntreprise key={m.id} marche={m} locale={l} />
          ))}
        </div>
      </section>

      <section aria-labelledby="a-venir">
        <h2 id="a-venir" className="text-[18px] font-semibold tracking-tight">
          À venir
        </h2>
        <div className="mt-3 space-y-3">
          {aVenir.map((m) => (
            <CarteMarcheEntreprise key={m.id} marche={m} locale={l} aVenir />
          ))}
        </div>
      </section>

      <section
        className="rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] bg-[var(--pc-fond-enfonce)] px-5 py-4"
        aria-labelledby="instruments"
      >
        <h2 id="instruments" className="text-[15px] font-semibold">
          Ce que cet écran modélise, et ce qu’il ne modélise pas
        </h2>
        <p className="mt-2 text-[13px] text-[var(--pc-encre-douce)]">
          Cet écran modélise le <strong>critère d’attribution</strong>, qui pondère et déplace un classement à la
          marge : une entreprise médiocre qui casse son prix de sept pour cent l’emporte quand même. Trois
          instruments plus puissants existent, et le simulateur les montre — la spécification technique, qui élimine
          au lieu de marchander ; la décision de demande, qui fixe l’essentiel avant l’achat ; et le stock, qui bat le
          flux.
        </p>
        <p className="mt-2 text-[13px]">
          <Link href={`/${l}/entreprise/simulateur`} className="text-[var(--pc-accent)] underline underline-offset-2">
            Ouvrir le simulateur
          </Link>
        </p>
      </section>
    </div>
  );
}

function CarteMarcheEntreprise({
  marche,
  locale,
  aVenir,
}: {
  marche: (typeof MARCHES_ENTREPRISE)[number];
  locale: Locale;
  aVenir?: boolean;
}) {
  const difference = marche.impactAuForfait - marche.impactAvecValeursDeclarees;

  return (
    <article className="carte px-5 py-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[15.5px] font-semibold tracking-tight">{marche.objet}</h3>
          <p className="mt-0.5 text-[12.5px] text-[var(--pc-encre-tenue)]">
            {marche.pouvoirAdjudicateur} · {formaterEuros(marche.montantEur, locale)}
          </p>
        </div>
        {marche.sousLeSeuil ? (
          <span
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-medium"
            style={{ color: 'var(--pc-conforme)', backgroundColor: 'var(--pc-conforme-fond)' }}
          >
            <CircleCheck className="h-3.5 w-3.5" aria-hidden />
            Sous le seuil
          </span>
        ) : (
          <span
            className="inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[11.5px] font-medium"
            style={{ color: 'var(--pc-encre-douce)', backgroundColor: 'var(--pc-fond-enfonce)' }}
          >
            Au-dessus du seuil
          </span>
        )}
      </div>

      {marche.sousLeSeuil ? (
        <p className="mt-3 flex items-start gap-2 rounded-[var(--pc-rayon)] bg-[var(--pc-fond-enfonce)] px-3 py-2.5 text-[13px]">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--pc-encre-tenue)]" aria-hidden />
          <span>
            <strong className="font-medium">Vous n’avez rien à fournir pour ce marché.</strong> Il est sous le seuil de
            déclaration : la déclaration coûterait plus cher que l’impact qu’elle permettrait de réduire. Aucun
            forfait ne s’applique, et aucune pièce ne vous sera demandée.
          </span>
        </p>
      ) : (
        <>
          <dl className="mt-3 grid gap-px overflow-hidden rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] bg-[var(--pc-trait)] sm:grid-cols-3">
            <div className="bg-[var(--pc-fond-eleve)] px-4 py-3">
              <dt className="text-[11.5px] text-[var(--pc-encre-tenue)]">Avec vos valeurs déclarées</dt>
              <dd className="chiffre mt-0.5 text-[16px] font-semibold">
                {formaterEuros(marche.impactAvecValeursDeclarees, locale)}
              </dd>
            </div>
            <div className="bg-[var(--pc-fond-eleve)] px-4 py-3">
              <dt className="text-[11.5px] text-[var(--pc-encre-tenue)]">Au forfait</dt>
              <dd className="chiffre mt-0.5 text-[16px] font-semibold" style={{ color: 'var(--pc-retard)' }}>
                {formaterEuros(marche.impactAuForfait, locale)}
              </dd>
            </div>
            <div className="bg-[var(--pc-fond-eleve)] px-4 py-3">
              <dt className="text-[11.5px] text-[var(--pc-encre-tenue)]">Différence</dt>
              <dd className="chiffre mt-0.5 text-[16px] font-semibold" style={{ color: 'var(--pc-conforme)' }}>
                {formaterEuros(difference, locale)}
              </dd>
            </div>
          </dl>

          {aVenir && (
            <p className="mt-3 rounded-[var(--pc-rayon)] px-3 py-2.5 text-[13px]" style={{ background: 'var(--pc-accent-doux)' }}>
              Avec vos valeurs actuelles, votre offre serait pénalisée de{' '}
              <span className="chiffre font-semibold">{formaterEuros(difference, locale)}</span> par rapport à une
              entreprise à la référence de son secteur — si vous ne déclarez rien d’ici la remise.
            </p>
          )}
        </>
      )}
    </article>
  );
}
