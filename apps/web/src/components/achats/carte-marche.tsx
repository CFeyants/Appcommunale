'use client';

import * as React from 'react';
import { ChevronDown, Flag, Hammer } from 'lucide-react';
import { Button, cn } from '@pc/ui';
import type { ImpactMarche } from '@pc/core';
import type { Dictionnaire, Locale } from '@/i18n';
import { formaterEuros, formaterNombre } from '@/i18n';
import type { MarcheDemonstration } from '@/contenu/achats';
import { BadgeFictif, PuceStatut } from './puce-statut';
import { Contestation } from './contestation';

/**
 * Un marché : le prix payé, le coût complet, et la chaîne qui va de l'un à
 * l'autre.
 *
 * La mention « déjà tarifé ailleurs » est indispensable : l'énergie est
 * couverte par le système européen de quotas, et l'afficher sans le dire
 * laisserait croire à un double comptage. La ligne reste au calcul pour son
 * seul résidu — elle n'est jamais retirée.
 */
export function CarteMarche({
  marche,
  impact,
  d,
  locale,
}: {
  marche: MarcheDemonstration;
  impact: ImpactMarche;
  d: Dictionnaire;
  locale: Locale;
}) {
  const [ouvert, setOuvert] = React.useState(false);
  const part = impact.partDuMontant ?? 0;

  return (
    <article className="carte overflow-hidden">
      <div className="px-5 pt-4 pb-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="etiquette text-[var(--pc-encre-tenue)]">{marche.famille}</span>
            <h3 className="mt-1 text-[17px] font-semibold tracking-tight">{marche.objet}</h3>
          </div>
          <BadgeFictif />
        </div>

        {/* --- Prix payé et coût complet, côte à côte -------------------- */}
        <dl className="mt-4 grid gap-px overflow-hidden rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] bg-[var(--pc-trait)] sm:grid-cols-3">
          <div className="bg-[var(--pc-fond-eleve)] px-4 py-3">
            <dt className="text-[12px] text-[var(--pc-encre-tenue)]">Montant annuel payé</dt>
            <dd className="chiffre mt-0.5 text-[17px] font-semibold">
              {formaterEuros(marche.montantAnnuelEur, locale)}
            </dd>
          </div>
          <div className="bg-[var(--pc-fond-eleve)] px-4 py-3">
            <dt className="text-[12px] text-[var(--pc-encre-tenue)]">Impact monétisé</dt>
            <dd className="chiffre mt-0.5 text-[17px] font-semibold">{formaterEuros(impact.totalEur, locale)}</dd>
            <dd className="chiffre mt-0.5 text-[12px] text-[var(--pc-encre-tenue)]">
              {(part * 100).toFixed(1)} % du montant
            </dd>
          </div>
          <div className="bg-[var(--pc-fond-eleve)] px-4 py-3">
            <dt className="text-[12px] text-[var(--pc-encre-tenue)]">Déjà tarifé ailleurs</dt>
            <dd className="chiffre mt-0.5 text-[17px] font-semibold">{formaterEuros(impact.dejaTarifeEur, locale)}</dd>
            <dd className="mt-0.5 text-[12px] text-[var(--pc-encre-tenue)]">
              {impact.dejaTarifeEur > 0
                ? 'déjà acquitté par le système de quotas, retranché du calcul'
                : 'aucun prix carbone ne couvre ce marché'}
            </dd>
          </div>
        </dl>

        {/* --- La grammaire des rubriques, reprise mot pour mot ---------- */}
        <dl className="mt-4 space-y-2 text-[12.5px]">
          <Rubrique terme="Ce qu’il montre" valeur={marche.explication.montre} />
          <Rubrique terme="Ce qu’il ne montre pas" valeur={marche.explication.neMontrePas} />
          <Rubrique terme="Ce qui relève de la décision locale" valeur={marche.explication.decisionLocale} />
          <Rubrique terme="Prochaine mesure" valeur={marche.explication.prochaineMesure} />
        </dl>

        {marche.instrumentsDisponibles && marche.instrumentsDisponibles.length > 0 && (
          <div className="mt-4 rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] bg-[var(--pc-fond-enfonce)] px-4 py-3">
            <p className="flex items-center gap-2 text-[13px] font-medium">
              <Hammer className="h-3.5 w-3.5 text-[var(--pc-encre-tenue)]" aria-hidden />
              Des instruments plus puissants que la pondération
            </p>
            <ul className="mt-2 list-disc space-y-1.5 pl-4 text-[12.5px] text-[var(--pc-encre-douce)]">
              {marche.instrumentsDisponibles.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
            <p className="mt-2 text-[12px] text-[var(--pc-encre-tenue)]">
              Le critère d’attribution pondère et déplace un classement à la marge : une entreprise médiocre qui casse
              son prix de sept pour cent l’emporte quand même. La spécification technique, elle, élimine.
            </p>
          </div>
        )}
      </div>

      {/* --- La chaîne de calcul ---------------------------------------- */}
      <div className="border-t border-[var(--pc-trait)] bg-[var(--pc-fond-enfonce)]">
        <button
          type="button"
          onClick={() => setOuvert((v) => !v)}
          aria-expanded={ouvert}
          className="flex w-full items-center justify-between gap-3 px-5 py-3 text-left text-[13px] font-medium"
        >
          La chaîne de calcul, poste par poste
          <ChevronDown className={cn('h-4 w-4 shrink-0 transition-transform', ouvert && 'rotate-180')} aria-hidden />
        </button>

        {ouvert && (
          <div className="border-t border-[var(--pc-trait)] px-5 py-4">
            <p className="mb-3 text-[12.5px] text-[var(--pc-encre-tenue)]">
              Usage de ce calcul :{' '}
              <span className="font-medium text-[var(--pc-encre-douce)]">
                {impact.usage === 'attribuer' ? 'départager des offres' : 'ranger des gisements entre eux'}
              </span>
              . Valeur du carbone de l’exercice {impact.annee}.
            </p>

            <ol className="space-y-4">
              {impact.lignes.map((ligne) => (
                <li key={ligne.cle} className="rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] bg-[var(--pc-fond-eleve)] px-4 py-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <span className="text-[13.5px] font-medium">{ligne.libelle}</span>
                    <span className="flex items-center gap-2">
                      <PuceStatut statut={ligne.statutQuantite} />
                      <span className="chiffre text-[13.5px] font-semibold">
                        {formaterEuros(ligne.montantEur, locale)}
                      </span>
                    </span>
                  </div>

                  <p className="chiffre mt-1 text-[12px] text-[var(--pc-encre-tenue)]">
                    {formaterNombre(ligne.quantite, locale)} {ligne.unite} × {ligne.facteurEmission} ={' '}
                    {formaterNombre(ligne.tonnesCo2e, locale, 1)} tCO₂e · résidu {ligne.euroParTonne} €/t
                    {ligne.dejaAcquitteEuroParTonne > 0 && ` · ${ligne.dejaAcquitteEuroParTonne} €/t déjà acquittés`}
                  </p>

                  <ol className="mt-2 space-y-1 text-[12px] text-[var(--pc-encre-douce)]">
                    {ligne.chaine.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ol>
                </li>
              ))}
            </ol>

            <Contestation marcheId={marche.id} lignes={impact.lignes.map((x) => ({ cle: x.cle, libelle: x.libelle }))} />
          </div>
        )}
      </div>
    </article>
  );
}

function Rubrique({ terme, valeur }: { terme: string; valeur: string }) {
  return (
    <div>
      <dt className="font-semibold">{terme}</dt>
      <dd className="text-[var(--pc-encre-douce)]">{valeur}</dd>
    </div>
  );
}
