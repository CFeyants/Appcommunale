import { notFound } from 'next/navigation';
import Link from 'next/link';
import { AbsenceDeDonnee, NombreHeroique, Separator } from '@pc/ui';
import { dictionnaire, estLocale, formaterEuros, type Locale } from '@/i18n';
import { chargerDepenses, chargerEnergie } from '@/lib/donnees';
import { BUDGET_COMMUNAL } from '@/contenu/budget';
import { BudgetClient } from '@/components/budget/budget-client';
import { Initiatives } from '@/components/budget/initiatives';
import { Propositions } from '@/components/budget/propositions';
import { Indicateurs } from '@/components/budget/indicateurs';

export default async function PageBudget({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!estLocale(locale)) notFound();
  const l = locale as Locale;
  const d = dictionnaire(l);

  const depenses = await chargerDepenses();
  const energie = await chargerEnergie();

  const dernier = depenses?.exercices.at(-1);
  const tous = dernier?.secteurs.find((s) => s.code === 'S13');
  const population = depenses?.populationBelgique ?? null;
  const parHabitant = tous && population ? (tous.total * 1e6) / population.valeur : null;

  return (
    <div className="contenu py-8 md:py-12">
      <h1 className="sr-only">{d.nav.budgetLong}</h1>

      <NombreHeroique
        valeur={parHabitant ? formaterEuros(parHabitant, l, 0) : '—'}
        legende={`${d.budget.heroLegende} ${dernier?.annee ?? '—'} — Belgique, tous niveaux`}
        unite="par habitant"
        precision={
          parHabitant
            ? `C’est ce que l’ensemble des administrations publiques belges dépensent par habitant et par an. Le chiffre est réel et vérifiable ligne à ligne. Celui de votre commune, lui, n’est publié nulle part en données ouvertes — voir ci-dessous.`
            : undefined
        }
      />

      {depenses ? (
        <BudgetClient exercices={depenses.exercices} population={population} d={d} locale={l} />
      ) : (
        <p className="mt-6 text-[14px] text-[var(--pc-encre-tenue)]">
          Les dépenses publiques n’ont pas encore été collectées. Voir{' '}
          <Link href={`/${l}/sources`} className="text-[var(--pc-accent)] underline underline-offset-2">
            {d.nav.sources}
          </Link>
          .
        </p>
      )}

      {/* --- L'absence du budget communal, affichée comme un fait ---------- */}
      <section className="mt-10" aria-labelledby="budget-communal">
        <h2 id="budget-communal" className="text-[19px] font-semibold tracking-tight">
          Et le budget de Kraainem ?
        </h2>
        <div className="mt-3">
          <AbsenceDeDonnee
            organismeAttendu={BUDGET_COMMUNAL.organismeAttendu}
            depuis="toujours"
            explication={`Le budget communal n’est publié dans aucun format ouvert et réutilisable. ${BUDGET_COMMUNAL.ceQuiExiste}`}
          />
        </div>
        <details className="mt-3">
          <summary className="cursor-pointer text-[13px] text-[var(--pc-accent)] underline underline-offset-2">
            Ce qui a été tenté, et ce que chaque tentative a renvoyé
          </summary>
          <ul className="mt-2 space-y-1.5 text-[12.5px] text-[var(--pc-encre-douce)]">
            {BUDGET_COMMUNAL.tentatives.map((t) => (
              <li key={t.source} className="flex flex-wrap gap-x-2">
                <span className="font-medium">{t.source}</span>
                <span aria-hidden>→</span>
                <span className="chiffre">{t.resultat}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[12px] text-[var(--pc-encre-tenue)]">Vérifié le {BUDGET_COMMUNAL.verifieLe}.</p>
        </details>
        <p className="mt-4 max-w-prose text-[13.5px] text-[var(--pc-encre-douce)]">
          Un fournisseur payé par la commune n’écrirait pas cette section. C’est précisément pourquoi cette
          plateforme ne doit dépendre financièrement d’aucune des institutions qu’elle mesure.
        </p>
      </section>

      {/* Sous-écran, pas un sixième onglet. */}
      <section className="mt-10" aria-labelledby="achats">
        <h2 id="achats" className="text-[19px] font-semibold tracking-tight">
          {d.nav.achats}
        </h2>
        <p className="mt-1.5 max-w-prose text-[13.5px] text-[var(--pc-encre-douce)]">
          Le budget dit ce que la commune dépense. Un second écran met à côté du prix payé le coût complet, et range
          les leviers par ordre de grandeur — parce que sans ce classement, on discute des sacs poubelle pendant que
          le chauffage tourne.
        </p>
        <p className="mt-3 text-[13.5px]">
          <Link
            href={`/${l}/budget/achats`}
            className="inline-flex items-center gap-1.5 rounded-[var(--pc-rayon)] border border-[var(--pc-trait-fort)] px-3.5 py-2 hover:bg-[var(--pc-fond-enfonce)]"
          >
            {d.nav.achats}
          </Link>
        </p>
      </section>

      <Separator className="mt-10" />

      <Initiatives d={d} locale={l} />
      <Propositions d={d} locale={l} />
      <Indicateurs d={d} locale={l} energie={energie} />

      <p className="mt-10 text-[12.5px] text-[var(--pc-encre-tenue)]">
        Données brutes de cet écran :{' '}
        <Link href={`/${l}/budget.json`} className="text-[var(--pc-accent)] underline underline-offset-2">
          /{l}/budget.json
        </Link>
      </p>
    </div>
  );
}
