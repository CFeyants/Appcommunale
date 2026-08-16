import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CalendarClock, CircleCheck, CircleDashed, TrendingDown, TrendingUp } from 'lucide-react';
import { dictionnaire, estLocale, formaterDate, formaterEuros, formaterNombre, type Locale } from '@/i18n';
import { ECHEANCES, ENTREPRISE, POSITIONS, RUBRIQUES } from '@/contenu/entreprise';
import { PuceStatut } from '@/components/achats/puce-statut';

/**
 * Le tableau de bord — quatre blocs.
 *
 * Le second, « Ce que le silence me coûte », est le bloc décisif du produit :
 * il transforme une obligation administrative en arbitrage économique.
 * L'entreprise choisit entre payer le forfait et payer la mesure.
 */
export default async function TableauDeBord({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!estLocale(locale)) notFound();
  const l = locale as Locale;

  const declarees = RUBRIQUES.filter((r) => r.valeurDeclaree);
  const auForfait = RUBRIQUES.filter((r) => r.forfait && !r.valeurDeclaree);
  const sansEffet = RUBRIQUES.filter((r) => !r.valeurDeclaree && !r.forfait);
  const coutDuSilence = auForfait.reduce((s, r) => s + (r.forfait?.coutAnnuelEur ?? 0), 0);
  const derniereMaj = declarees
    .map((r) => r.valeurDeclaree!.declareeLe)
    .sort()
    .at(-1);

  return (
    <div className="space-y-9">
      <header>
        <h1 className="text-[24px] font-semibold tracking-tight md:text-[28px]">Tableau de bord</h1>
        <p className="mt-1.5 max-w-prose text-[13.5px] text-[var(--pc-encre-douce)]">
          {ENTREPRISE.denomination} · {ENTREPRISE.numeroEntreprise} · {ENTREPRISE.equivalentsTempsPlein} équivalents
          temps plein
        </p>
      </header>

      {/* --- Ce que le silence coûte, en premier ------------------------- */}
      <section aria-labelledby="silence">
        <h2 id="silence" className="text-[18px] font-semibold tracking-tight">
          Ce que le silence me coûte
        </h2>
        <p className="mt-1.5 max-w-prose text-[13.5px] text-[var(--pc-encre-douce)]">
          Ne rien déclarer est autorisé, et a un prix. Tant qu’une ligne n’est pas déclarée, le forfait s’applique sur
          les marchés auxquels vous soumissionnez.
        </p>

        <p className="chiffre mt-4 text-[34px] font-semibold leading-none" style={{ color: 'var(--pc-retard)' }}>
          {formaterEuros(coutDuSilence, l)}
        </p>
        <p className="mt-1 text-[13px] text-[var(--pc-encre-douce)]">
          par an, sur l’ensemble de vos marchés au-dessus du seuil.
        </p>

        <ul className="mt-4 space-y-2">
          {auForfait.map((r) => (
            <li
              key={r.cle}
              className="flex flex-wrap items-start justify-between gap-3 rounded-[var(--pc-rayon)] border px-4 py-3"
              style={{ borderColor: 'var(--pc-retard)' }}
            >
              <div className="min-w-0">
                <p className="text-[13.5px] font-medium">
                  <span className="chiffre text-[var(--pc-encre-tenue)]">{r.code}</span> · {r.intitule}
                </p>
                <p className="mt-0.5 text-[12.5px] text-[var(--pc-encre-douce)]">
                  Forfait appliqué : {r.forfait!.valeur}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="chiffre text-[15px] font-semibold" style={{ color: 'var(--pc-retard)' }}>
                  {formaterEuros(r.forfait!.coutAnnuelEur, l)}
                </p>
                <PuceStatut statut="forfait" className="mt-1" />
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-3 text-[12.5px] text-[var(--pc-encre-tenue)]">
          Le forfait est défavorable par construction — au quantile haut de la branche, jamais à la moyenne — sinon le
          silence deviendrait une stratégie. Il porte sur ces contrats, pas sur votre entreprise : sur votre fiche
          publique,{' '}
          <Link href={`/${l}/impact`} className="text-[var(--pc-accent)] underline underline-offset-2">
            « n’a rien déclaré » reste « n’a rien déclaré »
          </Link>
          , et aucun de ces montants n’y figure.
        </p>

        <p className="mt-4 text-[13.5px]">
          <Link
            href={`/${l}/entreprise/declaration`}
            className="inline-flex items-center gap-1.5 rounded-[var(--pc-rayon)] px-3.5 py-2 font-medium text-white"
            style={{ background: 'var(--pc-accent)' }}
          >
            Déclarer et faire baisser ce montant
          </Link>
        </p>
      </section>

      {/* --- Ma déclaration ---------------------------------------------- */}
      <section aria-labelledby="declaration">
        <h2 id="declaration" className="text-[18px] font-semibold tracking-tight">
          Ma déclaration
        </h2>
        <div className="mt-3 grid gap-px overflow-hidden rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] bg-[var(--pc-trait)] sm:grid-cols-4">
          <Case titre="Déclarées" valeur={`${declarees.length} / ${RUBRIQUES.length}`} />
          <Case titre="Au forfait" valeur={String(auForfait.length)} accent="var(--pc-retard)" />
          <Case titre="Sans effet sur les marchés" valeur={String(sansEffet.length)} />
          <Case titre="Dernière mise à jour" valeur={derniereMaj ? formaterDate(derniereMaj, l) : '—'} />
        </div>

        <p className="mt-3 rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] bg-[var(--pc-fond-enfonce)] px-4 py-3 text-[13px]">
          <span className="font-medium">État sur votre fiche publique :</span>{' '}
          <span style={{ color: 'var(--pc-encre-tenue)' }}>« n’a rien déclaré »</span> — tant que la rubrique B3,
          énergie et émissions, n’est pas publiée, la fiche reste en l’état. C’est elle, et elle seule, qui fait
          passer le compteur public de la commune.
        </p>
      </section>

      {/* --- Ma position, par écart et jamais par rang -------------------- */}
      <section aria-labelledby="position">
        <h2 id="position" className="text-[18px] font-semibold tracking-tight">
          Ma position
        </h2>
        <p className="mt-1.5 max-w-prose text-[13.5px] text-[var(--pc-encre-douce)]">
          Écart à la référence de votre secteur, indicateur par indicateur. <strong>Par écart, jamais par rang</strong>,
          et sans qu’aucune entreprise ne soit nommée en comparaison.
        </p>

        <ul className="mt-4 space-y-2.5">
          {POSITIONS.map((p) => {
            const ecart = p.valeurEntreprise - p.reference;
            // « Mieux » dépend de l'indicateur : moins de carburant, plus de recyclé.
            const plusEstMieux = p.indicateur.includes('Part');
            const favorable = plusEstMieux ? ecart > 0 : ecart < 0;
            const Fleche = favorable ? TrendingDown : TrendingUp;
            return (
              <li key={p.indicateur} className="rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] px-4 py-3">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <span className="text-[13.5px]">{p.indicateur}</span>
                  <span className="flex items-center gap-2">
                    <PuceStatut statut={p.statut} />
                    <span
                      className="chiffre inline-flex items-center gap-1 text-[13.5px] font-semibold"
                      style={{ color: favorable ? 'var(--pc-conforme)' : 'var(--pc-retard)' }}
                    >
                      <Fleche className="h-3.5 w-3.5" aria-hidden />
                      {ecart > 0 ? '+' : ''}
                      {formaterNombre(ecart, l, 1)} {p.unite}
                    </span>
                  </span>
                </div>
                <p className="chiffre mt-1 text-[12px] text-[var(--pc-encre-tenue)]">
                  Vous : {formaterNombre(p.valeurEntreprise, l, 1)} {p.unite} · référence du secteur :{' '}
                  {formaterNombre(p.reference, l, 1)} {p.unite}
                  {p.statut === 'forfait' && ' — vous n’avez rien déclaré sur cette ligne'}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      {/* --- Mes échéances ------------------------------------------------ */}
      <section aria-labelledby="echeances">
        <h2 id="echeances" className="text-[18px] font-semibold tracking-tight">
          Mes échéances
        </h2>
        <ul className="mt-3 divide-y divide-[var(--pc-trait)] rounded-[var(--pc-rayon)] border border-[var(--pc-trait)]">
          {ECHEANCES.map((e) => {
            const jours = Math.ceil((new Date(e.le).getTime() - Date.now()) / 86_400_000);
            return (
              <li key={e.quoi} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-3">
                <span className="flex items-center gap-2 text-[13.5px]">
                  <CalendarClock className="h-3.5 w-3.5 shrink-0 text-[var(--pc-encre-tenue)]" aria-hidden />
                  {e.quoi}
                </span>
                <span
                  className="chiffre text-[13px] font-medium"
                  style={{ color: jours < 60 ? 'var(--pc-retard)' : 'var(--pc-encre-douce)' }}
                >
                  {formaterDate(e.le, l)} · dans {jours} jours
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

function Case({ titre, valeur, accent }: { titre: string; valeur: string; accent?: string }) {
  return (
    <div className="bg-[var(--pc-fond-eleve)] px-4 py-3">
      <p className="text-[11.5px] text-[var(--pc-encre-tenue)]">{titre}</p>
      <p className="chiffre mt-0.5 text-[18px] font-semibold" style={accent ? { color: accent } : undefined}>
        {valeur}
      </p>
    </div>
  );
}
