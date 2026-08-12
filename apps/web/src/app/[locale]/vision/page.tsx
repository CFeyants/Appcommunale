import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { AbsenceDeDonnee, BadgeStatut, CadreGraphique, NombreHeroique, Separator, Trajectoire } from '@pc/ui';
import { dictionnaire, estLocale, formaterDate, formaterNombre, type Locale } from '@/i18n';
import { chargerGes } from '@/lib/donnees';
import { COUVERTURE_VISION, OBJECTIFS, SCRUTIN_EN_COURS } from '@/contenu/objectifs';
import { MarquerObjectif } from '@/components/vision/marquer';

export default async function PageVision({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!estLocale(locale)) notFound();
  const l = locale as Locale;
  const d = dictionnaire(l);

  const ges = await chargerGes();
  const totalObjectifs = COUVERTURE_VISION.reduce((s, c) => s + c.objectifsDatesEtChiffres, 0);
  const totalDomaines = COUVERTURE_VISION.reduce((s, c) => s + c.domainesDeCompetence, 0);

  return (
    <div className="contenu py-8 md:py-12">
      <h1 className="sr-only">{d.nav.visionLong}</h1>

      {/* Le nombre héroïque de cet écran est un constat, pas une performance. */}
      <NombreHeroique
        valeur={`${totalObjectifs} / ${totalDomaines}`}
        legende="Objectifs chiffrés et datés, publiés dans un format vérifiable"
        precision={`Sur les cinq niveaux de pouvoir et ${totalDomaines} domaines de compétence, ${totalObjectifs} objectifs seulement sont publiés avec une cible chiffrée, une échéance et une source citable. C’est le résultat principal de cet écran.`}
      />

      {/* --- Ce que chaque niveau publie réellement ------------------------ */}
      <section className="mt-8" aria-labelledby="couverture">
        <h2 id="couverture" className="text-[19px] font-semibold tracking-tight">
          {d.vision.couvertureTitre}
        </h2>
        <ul className="mt-4 space-y-2">
          {COUVERTURE_VISION.map((c) => (
            <li
              key={c.niveau}
              className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] px-4 py-3"
            >
              <span className="text-[14px] font-medium">{c.autorite}</span>
              <span className="chiffre text-[13px] text-[var(--pc-encre-douce)]">
                {c.objectifsDatesEtChiffres} objectif{c.objectifsDatesEtChiffres > 1 ? 's' : ''} daté
                {c.objectifsDatesEtChiffres > 1 ? 's' : ''} et chiffré{c.objectifsDatesEtChiffres > 1 ? 's' : ''} sur{' '}
                {c.domainesDeCompetence} domaines de compétence
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-4 space-y-3">
          {COUVERTURE_VISION.filter((c) => c.absence).map((c) => (
            <AbsenceDeDonnee
              key={c.niveau}
              organismeAttendu={c.absence!.organismeAttendu}
              depuis={c.absence!.depuis}
              explication={`${c.autorite} — ${c.absence!.explication}`}
            />
          ))}
        </div>
      </section>

      <Separator className="mt-10" />

      {/* --- Les objectifs, par horizon ------------------------------------ */}
      {(['long', 'mandature'] as const).map((horizon) => {
        const liste = OBJECTIFS.filter((o) => o.horizon === horizon);
        return (
          <section key={horizon} className="mt-10" aria-labelledby={`h-${horizon}`}>
            <h2 id={`h-${horizon}`} className="text-[19px] font-semibold tracking-tight">
              {horizon === 'long' ? d.vision.horizonLong : d.vision.horizonMandature}
            </h2>
            <p className="mt-1.5 max-w-prose text-[13.5px] text-[var(--pc-encre-douce)]">
              {horizon === 'long'
                ? 'Dix à trente ans. Peu d’objectifs, des cibles chiffrées et datées. Les deux horizons ne sont jamais mélangés.'
                : 'La mandature en cours. Aucun objectif de mandature n’est publié dans un format vérifiable, à aucun des cinq niveaux.'}
            </p>

            {liste.length === 0 ? (
              <p className="mt-4 rounded-[var(--pc-rayon)] border border-dashed border-[var(--pc-trait-fort)] px-4 py-8 text-center text-[13.5px] text-[var(--pc-encre-tenue)]">
                Aucun objectif de mandature n’a pu être trouvé sous une forme citable — ni chez la commune, ni chez la
                Région, ni au fédéral.
              </p>
            ) : (
              <div className="mt-5 space-y-4">
                {liste.map((o) => {
                  const rattaches = OBJECTIFS.filter((x) => o.rattachements.includes(x.id));
                  const trajectoire = o.serieMesuree === 'ges-belgique' && ges ? ges : null;
                  const cibleAbsolue =
                    trajectoire && ges?.reference1990 && o.cible.unite.includes('%')
                      ? ges.reference1990 * (1 + o.cible.valeur / 100)
                      : null;
                  const derniere = trajectoire?.derniereMesure ?? null;
                  const ecart =
                    derniere && cibleAbsolue ? Math.round(((derniere.valeur - cibleAbsolue) / cibleAbsolue) * 100) : null;

                  return (
                    <article key={o.id} id={o.id} className="carte scroll-mt-20 px-5 py-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <span className="etiquette text-[var(--pc-encre-tenue)]">{d.niveaux[o.niveau]}</span>
                          <h3 className="mt-1 text-[18px] font-semibold leading-snug tracking-tight">{o.intitule}</h3>
                        </div>
                        <BadgeStatut statut={o.statut} />
                      </div>

                      <p className="mt-2 rounded-[var(--pc-rayon)] bg-[var(--pc-fond-enfonce)] px-3 py-2 text-[12.5px]" lang={o.langueOrigine}>
                        <span className="etiquette block text-[var(--pc-encre-tenue)]">Formulation d’origine</span>
                        <span className="mt-1 block">{o.intituleOrigine}</span>
                      </p>

                      <p className="chiffre mt-3 text-[15px]">
                        Cible : <strong className="font-semibold">{o.cible.valeur}</strong> {o.cible.unite} — échéance{' '}
                        {formaterDate(o.cible.echeance, l)}
                      </p>

                      {/* --- L'emboîtement rendu visible --------------------- */}
                      <p className="mt-2.5 text-[13px]">
                        {rattaches.length > 0 ? (
                          <>
                            <span className="text-[var(--pc-encre-douce)]">{d.vision.rattachement} : </span>
                            {rattaches.map((r, i) => (
                              <span key={r.id}>
                                {i > 0 && ', '}
                                <a href={`#${r.id}`} className="text-[var(--pc-accent)] underline underline-offset-2">
                                  {r.intitule}
                                </a>
                              </span>
                            ))}
                          </>
                        ) : (
                          <span className="text-[var(--pc-encre-douce)]">
                            {d.vision.sansRattachement} {d.vision.sansRattachementAide}
                          </span>
                        )}
                      </p>

                      {/* --- La trajectoire, pas seulement la cible ---------- */}
                      {trajectoire && (
                        <div className="mt-5">
                          <CadreGraphique
                            titre={`${d.vision.trajectoire} — émissions belges de gaz à effet de serre`}
                            explication={{
                              montre: `La série mesurée des émissions belges de gaz à effet de serre de 1990 à ${derniere?.periode ?? ''}, en ${trajectoire.unite}, face à la cible européenne.`,
                              neMontrePas: `Le périmètre exact de la cible européenne, qui porte sur l’ensemble de l’Union et non sur la Belgique seule. La comparaison est indicative : ${trajectoire.perimetre}.`,
                              decisionLocale:
                                'Rien à ce niveau ne se décide localement. Une commune agit sur son patrimoine et sa mobilité, dont l’effet n’est pas isolable dans cette série.',
                              prochaineMesure:
                                'Inventaire national publié chaque année en mai, avec environ dix-huit mois de décalage.',
                            }}
                            colonnes={[
                              { cle: 'periode', titre: 'Année' },
                              { cle: 'valeur', titre: trajectoire.unite },
                            ]}
                            lignes={trajectoire.serie.map((p) => ({ periode: p.periode, valeur: p.valeur }))}
                            nomFichier={`trajectoire-${o.id}`}
                          >
                            <Trajectoire
                              points={trajectoire.serie.filter((_, i) => i % 2 === 0 || i === trajectoire.serie.length - 1)}
                              cible={cibleAbsolue ? { valeur: Math.round(cibleAbsolue), echeance: o.cible.echeance } : undefined}
                              unite="Mt"
                            />
                          </CadreGraphique>

                          <dl className="mt-3 flex flex-wrap gap-x-8 gap-y-2 text-[13px]">
                            <div>
                              <dt className="text-[var(--pc-encre-douce)]">Dernière mesure</dt>
                              <dd className="chiffre font-medium">
                                {derniere ? `${formaterNombre(derniere.valeur, l, 1)} Mt (${derniere.periode})` : '—'}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-[var(--pc-encre-douce)]">{d.vision.ecartCible}</dt>
                              <dd className="chiffre font-medium" style={{ color: 'var(--pc-retard)' }}>
                                {ecart !== null ? `+${ecart} % au-dessus de la cible 2030` : '—'}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-[var(--pc-encre-douce)]">{d.vision.prochaineMesure}</dt>
                              <dd className="chiffre font-medium">{o.prochaineMesure}</dd>
                            </div>
                          </dl>
                        </div>
                      )}

                      {!trajectoire && (
                        <p className="mt-3 rounded-[var(--pc-rayon)] border border-dashed border-[var(--pc-trait-fort)] px-4 py-3 text-[13px] text-[var(--pc-encre-douce)]">
                          Aucune série de mesures n’est publiée pour cet objectif dans un format exploitable. La cible
                          existe, la trajectoire non. {d.vision.prochaineMesure} : {o.prochaineMesure}
                        </p>
                      )}

                      {/* --- Comment cette vision a été définie -------------- */}
                      <details className="mt-4">
                        <summary className="cursor-pointer text-[13px] font-medium text-[var(--pc-accent)] underline-offset-2 hover:underline">
                          {d.vision.commentDefinie}
                        </summary>
                        <dl className="mt-2.5 space-y-1.5 text-[12.5px] text-[var(--pc-encre-douce)]">
                          <Ligne terme={d.vision.proposePar} valeur={o.genese.proposePar} />
                          <Ligne terme={d.vision.procedure} valeur={o.genese.procedure} />
                          <Ligne terme={d.vision.consultes} valeur={o.genese.consultes?.join(' · ')} />
                          <Ligne terme={d.vision.votePar} valeur={o.genese.votePar} />
                          <Ligne
                            terme="Adopté le"
                            valeur={o.genese.voteLe ? formaterDate(o.genese.voteLe, l) : undefined}
                          />
                          <Ligne terme="Article" valeur={o.source.article} />
                          {o.genese.deliberationUrl && (
                            <div className="flex flex-wrap gap-x-2">
                              <dt className="font-medium text-[var(--pc-encre)]">{d.vision.deliberation}</dt>
                              <dd>
                                <a
                                  href={o.genese.deliberationUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-[var(--pc-accent)] underline underline-offset-2"
                                >
                                  texte intégral <ExternalLink className="h-3 w-3" />
                                </a>
                              </dd>
                            </div>
                          )}
                        </dl>
                      </details>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--pc-trait)] pt-3">
                        <p className="text-[11.5px] text-[var(--pc-encre-tenue)]">
                          {o.source.organisme} · {formaterDate(o.source.dateDonnee, l)} · {o.source.licence} ·{' '}
                          <a href={o.source.url} target="_blank" rel="noreferrer" className="text-[var(--pc-accent)] underline underline-offset-2">
                            {o.source.url.replace('http://data.europa.eu/eli/', 'ELI ')}
                          </a>
                        </p>
                        <MarquerObjectif id={o.id} libelle={d.vision.marquerCompte} aide={d.vision.marquerAide} />
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}

      <Separator className="mt-10" />

      {/* --- Ce qui se décide --------------------------------------------- */}
      <section className="mt-10" aria-labelledby="scrutin">
        <h2 id="scrutin" className="text-[19px] font-semibold tracking-tight">
          {d.vision.ceQuiSeDecide}
        </h2>
        <p className="mt-2 max-w-prose text-[13.5px] text-[var(--pc-encre-douce)]">
          {SCRUTIN_EN_COURS.actif
            ? SCRUTIN_EN_COURS.intitule
            : 'Aucun scrutin n’est en cours. Cette page s’active avant chaque élection : elle affichera alors les objectifs longs soumis au débat et la position déclarée de chaque liste sur chacun, citée telle quelle avec sa source.'}
        </p>
        <p className="mt-3 max-w-prose rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] bg-[var(--pc-fond-enfonce)] px-4 py-3 text-[13px] text-[var(--pc-encre-douce)]">
          {d.vision.limiteSondage}
        </p>
        <p className="mt-3 text-[12.5px] text-[var(--pc-encre-tenue)]">
          Les objectifs que vous marquez restent sur votre appareil : ils ne sont ni envoyés, ni agrégés, ni publiés.
        </p>
      </section>

      <p className="mt-10 text-[12.5px] text-[var(--pc-encre-tenue)]">
        Données brutes de cet écran :{' '}
        <Link href={`/${l}/vision.json`} className="text-[var(--pc-accent)] underline underline-offset-2">
          /{l}/vision.json
        </Link>
      </p>
    </div>
  );
}

function Ligne({ terme, valeur }: { terme: string; valeur?: string }) {
  if (!valeur) return null;
  return (
    <div className="flex flex-wrap gap-x-2">
      <dt className="font-medium text-[var(--pc-encre)]">{terme}</dt>
      <dd>{valeur}</dd>
    </div>
  );
}
