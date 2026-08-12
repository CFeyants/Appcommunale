'use client';

import * as React from 'react';
import { CalendarClock, CircleCheck, CircleDashed, MessageSquare, ThumbsUp } from 'lucide-react';
import { Button, Jauge, Separator, cn } from '@pc/ui';
import type { Dictionnaire, Locale } from '@/i18n';
import { formaterDate, formaterEuros, formaterNombre } from '@/i18n';
import { INITIATIVES, QUESTIONS } from '@/contenu/commune';
import { BadgeDemonstration, InterrupteurDemonstration, useDemonstration } from './demonstration';

const LIBELLE_ETAT: Record<string, string> = {
  annoncee: 'Annoncée',
  engagee: 'Engagée',
  'en-cours': 'En cours',
  livree: 'Livrée',
  abandonnee: 'Abandonnée',
};

/**
 * Les initiatives et les questions publiques.
 *
 * Deux règles y sont visibles à l'œil nu :
 *   — on nomme une **fonction** responsable, jamais une personne ; il n'existe
 *     nulle part dans ce composant de nom d'agent ni d'élu ;
 *   — l'avancement se lit en jalons datés, jamais en pourcentage : un
 *     pourcentage d'avancement est une opinion déguisée en mesure.
 */
export function Initiatives({ d, locale }: { d: Dictionnaire; locale: Locale }) {
  const [visible, setVisible] = useDemonstration();
  const [ouverte, setOuverte] = React.useState<string | null>(null);

  return (
    <section className="mt-10" aria-labelledby="initiatives">
      <h2 id="initiatives" className="text-[19px] font-semibold tracking-tight">
        {d.budget.initiatives}
      </h2>
      <p className="mt-1.5 max-w-prose text-[13.5px] text-[var(--pc-encre-douce)]">
        Aucune commune belge ne publie ses projets sous forme de jalons datés avec leur budget consommé. Ce que
        Lokaal Beslist expose, ce sont des décisions isolées, sans fil conducteur. Les fiches ci-dessous montrent le
        gabarit que la structure est prête à recevoir.
      </p>

      <div className="mt-4">
        <InterrupteurDemonstration
          visible={visible}
          onChange={setVisible}
          quoi="Initiatives et questions publiques"
        />
      </div>

      {!visible ? (
        <p className="mt-4 rounded-[var(--pc-rayon)] border border-dashed border-[var(--pc-trait-fort)] px-4 py-8 text-center text-[13.5px] text-[var(--pc-encre-tenue)]">
          Aucune initiative réelle n’est disponible pour cette commune. C’est l’état exact des sources.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {INITIATIVES.map((ini) => {
            const questions = QUESTIONS.filter((q) => q.initiativeId === ini.id && q.etatModeration === 'publiee');
            const ouvert = ouverte === ini.id;
            return (
              <article key={ini.id} className="carte overflow-hidden">
                <div className="px-5 pt-4 pb-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="etiquette text-[var(--pc-encre-tenue)]">{LIBELLE_ETAT[ini.etat]}</span>
                        <BadgeDemonstration />
                      </div>
                      <h3 className="mt-1.5 text-[17px] font-semibold tracking-tight">{ini.intitule}</h3>
                      <p className="mt-1 text-[12.5px] text-[var(--pc-encre-tenue)]">
                        {d.budget.serviceResponsable} : {ini.serviceResponsable} · {d.budget.fonctionResponsable} :{' '}
                        {ini.fonctionResponsable}
                      </p>
                    </div>
                  </div>

                  {ini.budgetVoteEur !== undefined && ini.budgetVoteEur > 0 && (
                    <div className="mt-4 max-w-md">
                      <Jauge
                        libelle={d.budget.budgetVote}
                        vote={ini.budgetVoteEur}
                        execute={ini.budgetConsommeEur}
                        format={(n) => formaterEuros(n, locale, 0)}
                      />
                    </div>
                  )}

                  <h4 className="etiquette mt-5 text-[var(--pc-encre-tenue)]">{d.budget.jalons}</h4>
                  <ol className="mt-2 space-y-1.5">
                    {ini.jalons.map((j) => (
                      <li key={j.libelle} className="flex flex-wrap items-baseline gap-2 text-[13px]">
                        {j.dateReelle ? (
                          <CircleCheck
                            className="h-3.5 w-3.5 shrink-0 translate-y-0.5"
                            style={{ color: 'var(--pc-conforme)' }}
                            aria-hidden
                          />
                        ) : (
                          <CircleDashed
                            className="h-3.5 w-3.5 shrink-0 translate-y-0.5"
                            style={{ color: 'var(--pc-non-mesure)' }}
                            aria-hidden
                          />
                        )}
                        <span className="flex-1">{j.libelle}</span>
                        {j.datePrevue && (
                          <span className="chiffre text-[12px] text-[var(--pc-encre-tenue)]">
                            prévu {formaterDate(j.datePrevue, locale)}
                          </span>
                        )}
                        {j.dateReelle && (
                          <span className="chiffre text-[12px]" style={{ color: 'var(--pc-conforme)' }}>
                            fait {formaterDate(j.dateReelle, locale)}
                          </span>
                        )}
                      </li>
                    ))}
                  </ol>
                  <p className="mt-2 text-[12px] text-[var(--pc-encre-tenue)]">
                    Aucun pourcentage d’avancement n’est affiché : il serait inventé. Seules les dates le sont.
                  </p>

                  {ini.prochaineEcheance && (
                    <p className="mt-3 flex items-center gap-1.5 text-[13px]">
                      <CalendarClock className="h-3.5 w-3.5 text-[var(--pc-encre-tenue)]" aria-hidden />
                      {d.budget.prochaineEcheance} :{' '}
                      <span className="chiffre">{formaterDate(ini.prochaineEcheance, locale)}</span>
                    </p>
                  )}
                </div>

                <div className="border-t border-[var(--pc-trait)] bg-[var(--pc-fond-enfonce)] px-5 py-3">
                  <button
                    type="button"
                    onClick={() => setOuverte(ouvert ? null : ini.id)}
                    className="flex items-center gap-2 text-[13px] font-medium"
                    aria-expanded={ouvert}
                  >
                    <MessageSquare className="h-3.5 w-3.5" aria-hidden />
                    {d.budget.questions}
                    <span className="chiffre text-[var(--pc-encre-tenue)]">{questions.length}</span>
                  </button>

                  {ouvert && (
                    <div className="mt-3 space-y-3">
                      {questions.map((q) => {
                        const jours = Math.floor(
                          (Date.now() - new Date(q.poseesLe).getTime()) / 86_400_000,
                        );
                        return (
                          <div key={q.id} className="rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] bg-[var(--pc-fond-eleve)] px-4 py-3">
                            <p className="text-[13.5px]">{q.texte}</p>
                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-[var(--pc-encre-tenue)]">
                              <span className="inline-flex items-center gap-1.5">
                                <ThumbsUp className="h-3.5 w-3.5" aria-hidden />
                                <span className="chiffre">{formaterNombre(q.memeQuestion, locale)}</span>{' '}
                                {d.budget.personnes} — {d.budget.memeQuestion.toLowerCase()}
                              </span>
                              <span className="chiffre">posée le {formaterDate(q.poseesLe, locale)}</span>
                            </div>

                            {q.reponse ? (
                              <div className="mt-3 border-l-2 border-[var(--pc-accent)] pl-3">
                                <p className="text-[13px]">{q.reponse.texte}</p>
                                <p className="mt-1 text-[12px] text-[var(--pc-encre-tenue)]">
                                  {q.reponse.fonctionSignataire} — {d.budget.reponduLe}{' '}
                                  {formaterDate(q.reponse.publieeLe, locale)}
                                </p>
                              </div>
                            ) : (
                              <p
                                className="mt-2.5 text-[12.5px] font-medium"
                                style={{ color: jours > 60 ? 'var(--pc-serieux)' : 'var(--pc-retard)' }}
                              >
                                {d.budget.enAttenteDepuis} <span className="chiffre">{jours}</span> {d.budget.jours}.{' '}
                                {q.delaiLegalJours
                                  ? `${d.budget.delaiLegal} : ${q.delaiLegalJours} jours.`
                                  : d.budget.aucunDelaiLegal + '.'}
                              </p>
                            )}
                          </div>
                        );
                      })}

                      <p className="text-[12px] text-[var(--pc-encre-tenue)]">
                        Question et réponse sont publiques. Le pouce compte des personnes, jamais un score : il ne
                        change pas l’ordre d’affichage.{' '}
                        <a href={`/${locale}/moderation`} className="text-[var(--pc-accent)] underline underline-offset-2">
                          {d.nav.moderation}
                        </a>
                      </p>
                      <Button variant="contour" taille="sm" disabled title="Ouvert le jour où la modération est dotée">
                        {d.budget.poserQuestion}
                      </Button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Separator className="mt-10" />
    </section>
  );
}
