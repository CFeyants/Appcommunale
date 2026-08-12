'use client';

import * as React from 'react';
import { AbsenceDeDonnee, BadgeStatut, CadreGraphique, Trajectoire, cn } from '@pc/ui';
import type { Dictionnaire, Locale } from '@/i18n';
import { formaterNombre } from '@/i18n';
import { INDICATEURS_ENVIRONNEMENT, INDICATEURS_SOCIAUX, type IndicateurAffiche } from '@/contenu/indicateurs';
import type { Energie } from '@/lib/donnees';

/**
 * Les indicateurs.
 *
 * L'ordre n'est pas neutre : le **non-recours vient en premier**. C'est le seul
 * des quatorze qui mesure un échec de l'institution plutôt qu'un effort, et
 * c'est celui dont l'absence de donnée est la plus parlante.
 *
 * Le social est présenté en infographie — une histoire visuelle par indicateur
 * —, l'environnement en rapport : chiffres, séries, seuils. Douze des quatorze
 * n'ont aucune donnée, et l'affichent avec le nom de l'organisme qui devrait
 * la produire.
 */
export function Indicateurs({
  d,
  locale,
  energie,
}: {
  d: Dictionnaire;
  locale: Locale;
  energie: Energie | null;
}) {
  const [famille, setFamille] = React.useState<'social' | 'environnement'>('social');
  const liste = famille === 'social' ? INDICATEURS_SOCIAUX : INDICATEURS_ENVIRONNEMENT;
  const mesures = liste.filter((i) => !i.absence).length;

  return (
    <section className="mt-10" aria-labelledby="indicateurs">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="indicateurs" className="text-[19px] font-semibold tracking-tight">
            {d.budget.indicateurs}
          </h2>
          <p className="mt-1 text-[13px] text-[var(--pc-encre-douce)]">
            <span className="chiffre">{mesures}</span> mesurés sur <span className="chiffre">{liste.length}</span>.
            Tous portent l’étiquette « indicateur proposé » : {d.budget.indicateurProposeAide.toLowerCase()}
          </p>
        </div>
        <div className="flex gap-0.5 rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] p-0.5">
          {(['social', 'environnement'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFamille(f)}
              aria-pressed={famille === f}
              className={cn(
                'rounded-[6px] px-3 py-1 text-[12.5px]',
                famille === f
                  ? 'bg-[var(--pc-accent)] text-white'
                  : 'text-[var(--pc-encre-douce)] hover:bg-[var(--pc-fond-enfonce)]',
              )}
            >
              {f === 'social' ? d.budget.social : d.budget.environnement}
            </button>
          ))}
        </div>
      </div>

      <div className={cn('mt-5', famille === 'social' ? 'space-y-3' : 'space-y-4')}>
        {liste.map((ind, i) => (
          <FicheIndicateur
            key={ind.id}
            indicateur={ind}
            premier={i === 0 && famille === 'social'}
            energie={energie}
            d={d}
            locale={locale}
          />
        ))}
      </div>
    </section>
  );
}

function FicheIndicateur({
  indicateur,
  premier,
  energie,
  d,
  locale,
}: {
  indicateur: IndicateurAffiche;
  premier: boolean;
  energie: Energie | null;
  d: Dictionnaire;
  locale: Locale;
}) {
  const serie = indicateur.serie ? serieEnergie(indicateur.serie, energie) : null;

  if (indicateur.absence) {
    return (
      <article
        className={cn(
          'carte px-5 py-4',
          // Le non-recours est mis en avant visuellement, sans couleur d'alerte :
          // c'est une absence, pas une panne.
          premier && 'border-[var(--pc-accent)] ring-1 ring-[var(--pc-accent)]/20',
        )}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h3 className="text-[16px] font-semibold tracking-tight">{indicateur.intitule}</h3>
          <span className="rounded-full border border-dashed border-[var(--pc-trait-fort)] px-2 py-0.5 text-[10.5px] uppercase tracking-wide text-[var(--pc-encre-tenue)]">
            {d.budget.indicateurPropose}
          </span>
        </div>

        {premier && (
          <p className="mt-2 max-w-prose text-[13px] font-medium text-[var(--pc-accent-encre)]">
            Placé en premier délibérément : c’est le seul indicateur de cette page qui mesure un échec de
            l’institution plutôt qu’un effort.
          </p>
        )}

        <div className="mt-3">
          <AbsenceDeDonnee
            organismeAttendu={indicateur.absence.organismeAttendu}
            depuis={indicateur.absence.nonMesureDepuis}
            explication={indicateur.absence.explication}
          />
        </div>

        <dl className="mt-3 space-y-1.5 text-[12.5px] text-[var(--pc-encre-douce)]">
          <Bloc terme="Ce qu’il montrerait" valeur={indicateur.explication.montre} />
          <Bloc terme="Ce qu’il ne montrerait pas" valeur={indicateur.explication.neMontrePas} />
          <Bloc terme="Ce qui relève de la décision locale" valeur={indicateur.explication.decisionLocale} />
        </dl>
      </article>
    );
  }

  if (!serie || serie.points.length === 0) {
    return (
      <article className="carte px-5 py-4">
        <h3 className="text-[16px] font-semibold tracking-tight">{indicateur.intitule}</h3>
        <p className="mt-2 text-[13px] text-[var(--pc-encre-tenue)]">
          La collecte n’a pas encore abouti pour cette série.
        </p>
      </article>
    );
  }

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <BadgeStatut statut={indicateur.statut} />
        <span className="rounded-full border border-dashed border-[var(--pc-trait-fort)] px-2 py-0.5 text-[10.5px] uppercase tracking-wide text-[var(--pc-encre-tenue)]">
          {d.budget.indicateurPropose}
        </span>
        {indicateur.source && (
          <span className="text-[11.5px] text-[var(--pc-encre-tenue)]">
            {indicateur.source.organisme} · {indicateur.source.licence}
          </span>
        )}
      </div>
      <CadreGraphique
        titre={`${indicateur.intitule} (${indicateur.unite})`}
        explication={indicateur.explication}
        colonnes={[
          { cle: 'periode', titre: 'Mois' },
          { cle: 'valeur', titre: indicateur.unite },
        ]}
        lignes={serie.points.map((p) => ({ periode: p.periode, valeur: p.valeur }))}
        nomFichier={`indicateur-${indicateur.id}`}
      >
        <Trajectoire points={serie.points} unite="GWh" />
        <p className="mt-3 text-[12.5px] text-[var(--pc-encre-douce)]">
          Total sur la période&nbsp;: <span className="chiffre font-medium">{formaterNombre(serie.total, locale, 1)}</span>{' '}
          GWh.
        </p>
      </CadreGraphique>
    </div>
  );
}

function Bloc({ terme, valeur }: { terme: string; valeur: string }) {
  return (
    <div>
      <dt className="font-medium text-[var(--pc-encre)]">{terme}</dt>
      <dd>{valeur}</dd>
    </div>
  );
}

/** Agrège les relevés mensuels de Fluvius en série trimestrielle lisible. */
function serieEnergie(cle: 'fluvius-electricite' | 'fluvius-gaz' | 'fluvius-injection', energie: Energie | null) {
  if (!energie) return null;
  const secteur = cle === 'fluvius-gaz' ? 'Gas' : 'Elektriciteit';
  const champ = cle === 'fluvius-injection' ? 'injectionKwh' : 'prelevementKwh';

  const parMois = new Map<string, number>();
  for (const m of energie.mensuel) {
    if (m.secteur !== secteur) continue;
    const v = m[champ] ?? 0;
    parMois.set(m.mois, (parMois.get(m.mois) ?? 0) + v);
  }

  const points = [...parMois.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-24)
    .map(([periode, kwh]) => ({ periode, valeur: Math.round((kwh / 1e6) * 10) / 10 }));

  return { points, total: points.reduce((s, p) => s + p.valeur, 0) };
}
