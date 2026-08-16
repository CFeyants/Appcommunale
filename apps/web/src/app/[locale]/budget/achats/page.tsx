import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AbsenceDeDonnee, NombreHeroique, Separator } from '@pc/ui';
import { impactMonetise, residuCarbone, valeurCarbone, type Couverture } from '@pc/core';
import { dictionnaire, estLocale, formaterEuros, formaterNombre, type Locale } from '@/i18n';
import { AUTO_APPLICATION, LACUNE_MARCHES, LEVIERS, MARCHES } from '@/contenu/achats';
import { CarteMarche } from '@/components/achats/carte-marche';
import { ClassementLeviers } from '@/components/achats/leviers';
import { BadgeFictif } from '@/components/achats/puce-statut';

/**
 * « Ce que la commune achète » — sous-écran de Budget, pas un sixième onglet.
 *
 * Il met côte à côte le prix payé et le coût complet. Et il ouvre par le
 * classement des leviers plutôt que par la liste des marchés : sans ce
 * classement, on discute des sacs poubelle pendant que le chauffage tourne.
 */
export default async function PageAchats({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!estLocale(locale)) notFound();
  const l = locale as Locale;
  const d = dictionnaire(l);

  const annee = new Date().getFullYear();

  // --- Les marchés ---------------------------------------------------------
  const marchesCalcules = MARCHES.map((m) => ({
    marche: m,
    impact: impactMonetise(m.postes, {
      annee,
      usage: m.usage,
      montantMarcheEur: m.montantAnnuelEur,
    }),
  }));

  const montantTotal = MARCHES.reduce((s, m) => s + m.montantAnnuelEur, 0);
  const impactTotal = marchesCalcules.reduce((s, x) => s + x.impact.totalEur, 0);
  const dejaTarifeTotal = marchesCalcules.reduce((s, x) => s + x.impact.dejaTarifeEur, 0);

  // --- Les leviers, tous à la même valeur ---------------------------------
  const leviers = LEVIERS.map((levier) => {
    const impact = impactMonetise(
      [
        {
          cle: levier.cle,
          libelle: levier.libelle,
          quantite: levier.quantite,
          unite: levier.unite,
          facteurEmission: levier.facteurEmission,
          uniteFacteur: levier.uniteFacteur,
          origineFacteur: {
            organisme: levier.source,
            reference: levier.source,
            releveLe: '2026-08-16',
            verifieParAppel: levier.reel,
          },
          couverture: levier.couverture as Couverture,
        },
      ],
      { annee, usage: 'classer-les-leviers' },
    );
    return { levier, montantEur: impact.totalEur, tonnes: impact.lignes[0]!.tonnesCo2e, chaine: impact.lignes[0]!.chaine };
  });

  const valeur = valeurCarbone(annee);

  return (
    <div className="contenu py-8 md:py-12">
      <Link
        href={`/${l}/budget`}
        className="inline-flex items-center gap-1.5 text-[13px] text-[var(--pc-encre-douce)] underline-offset-4 hover:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {d.nav.budgetLong}
      </Link>

      <h1 className="sr-only">{d.nav.achats}</h1>

      <div className="mt-5">
        <NombreHeroique
          valeur={formaterEuros(impactTotal, l)}
          legende={`Coût complet des marchés reconstitués, exercice ${annee}`}
          unite={`soit ${((impactTotal / montantTotal) * 100).toFixed(0)} % de leur montant`}
          precision={`Ce que ces marchés coûtent au-delà de leur prix, une fois le carbone valorisé à ${valeur.euroParTonne} €/tCO₂e et le carbone déjà tarifé ailleurs retranché. ${formaterEuros(dejaTarifeTotal, l)} ont déjà été acquittés par le système européen de quotas : ils sont retranchés du calcul, mais les lignes correspondantes restent affichées.`}
        />
      </div>

      {/* --- La lacune, déclarée en tête --------------------------------- */}
      <section className="mt-8" aria-labelledby="lacune">
        <h2 id="lacune" className="sr-only">
          Ce qui manque
        </h2>
        <AbsenceDeDonnee
          organismeAttendu={LACUNE_MARCHES.organismeAttendu}
          depuis="toujours"
          explication={LACUNE_MARCHES.explication}
        />
        <p className="mt-3 text-[13px] text-[var(--pc-encre-douce)]">
          <span className="chiffre font-semibold">{LACUNE_MARCHES.marchesReconstitues}</span> marchés reconstitués sur{' '}
          <span className="chiffre font-semibold">{LACUNE_MARCHES.decisionsAttributionCollectees}</span> décisions
          d’attribution collectées. Vérifié le {LACUNE_MARCHES.verifieLe}.{' '}
          <Link href={`/${l}/bareme`} className="text-[var(--pc-accent)] underline underline-offset-2">
            Le barème appliqué
          </Link>
          .
        </p>
      </section>

      <Separator className="mt-9" />

      {/* --- Le classement des leviers, avant les marchés ----------------- */}
      <ClassementLeviers leviers={leviers} annee={annee} d={d} locale={l} />

      <Separator className="mt-10" />

      {/* --- Les marchés --------------------------------------------------- */}
      <section className="mt-10" aria-labelledby="marches">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="marches" className="text-[19px] font-semibold tracking-tight">
            Les marchés, prix payé et coût complet
          </h2>
          <BadgeFictif />
        </div>
        <p className="mt-1.5 max-w-prose text-[13.5px] text-[var(--pc-encre-douce)]">
          Pour chaque marché : le montant annuel, l’impact monétisé, sa part du montant, et ce qui est déjà tarifé
          ailleurs. Le détail ouvre la chaîne de calcul complète, poste par poste, chaque facteur avec son origine et
          son statut.
        </p>

        <div className="mt-5 space-y-4">
          {marchesCalcules.map(({ marche, impact }) => (
            <CarteMarche key={marche.id} marche={marche} impact={impact} d={d} locale={l} />
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-baseline justify-between gap-3 rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] bg-[var(--pc-fond-enfonce)] px-4 py-3 text-[13.5px]">
          <span className="font-medium">Total des quatre marchés</span>
          <span className="chiffre">
            {formaterEuros(montantTotal, l)} payés · {formaterEuros(impactTotal, l)} de coût complet ·{' '}
            {((impactTotal / montantTotal) * 100).toFixed(1)} %
          </span>
        </div>
      </section>

      <Separator className="mt-10" />

      {/* --- Ce que la commune s'applique à elle-même --------------------- */}
      <section className="mt-10" aria-labelledby="auto">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="auto" className="text-[19px] font-semibold tracking-tight">
            {AUTO_APPLICATION.intitule}
          </h2>
          <BadgeFictif />
        </div>
        <p className="mt-1.5 max-w-prose text-[13.5px] text-[var(--pc-encre-douce)]">
          {AUTO_APPLICATION.explication}
        </p>

        <ul className="mt-4 divide-y divide-[var(--pc-trait)] rounded-[var(--pc-rayon)] border border-[var(--pc-trait)]">
          {leviers
            .filter((x) => AUTO_APPLICATION.leviersCommunaux.includes(x.levier.cle as never))
            .map((x) => (
              <li key={x.levier.cle} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 py-3">
                <span className="text-[13.5px]">{x.levier.libelle}</span>
                <span className="chiffre text-[13.5px] text-[var(--pc-encre-douce)]">
                  {formaterNombre(x.tonnes, l, 0)} tCO₂e · {formaterEuros(x.montantEur, l)}
                </span>
              </li>
            ))}
        </ul>
        <p className="mt-2 text-[12.5px] text-[var(--pc-encre-tenue)]">
          Même méthode, même valeur du carbone, même règle de résidu que pour les marchés attribués à des tiers.
        </p>
      </section>

      <p className="mt-10 text-[12.5px] text-[var(--pc-encre-tenue)]">
        Données brutes de cet écran :{' '}
        <Link href={`/${l}/budget/achats.json`} className="text-[var(--pc-accent)] underline underline-offset-2">
          /{l}/budget/achats.json
        </Link>
      </p>
    </div>
  );
}
