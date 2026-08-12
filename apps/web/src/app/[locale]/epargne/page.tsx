import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink, TriangleAlert } from 'lucide-react';
import { AbsenceDeDonnee, NombreHeroique, Separator } from '@pc/ui';
import { dictionnaire, estLocale, formaterNombre, type Locale } from '@/i18n';
import { chargerEtablissements } from '@/lib/donnees';
import { AVERTISSEMENT_RISQUE, INSCRIPTIONS, INTEGRATION_FINANCIERE, PROJETS_EPARGNE, SERVICES } from '@/contenu/epargne';
import { DECHETS, DEMARCHES, TRAVAUX } from '@/contenu/commune';
import { OBJECTIFS } from '@/contenu/objectifs';
import { FicheServiceCarte } from '@/components/services/fiche-service';
import { Annuaire } from '@/components/services/annuaire';
import { Signalement } from '@/components/services/signalement';

export default async function PageEpargne({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!estLocale(locale)) notFound();
  const l = locale as Locale;
  const d = dictionnaire(l);

  const etabs = await chargerEtablissements();

  return (
    <div className="contenu py-8 md:py-12">
      <h1 className="sr-only">{d.nav.epargneLong}</h1>

      <NombreHeroique
        valeur={String(PROJETS_EPARGNE.length)}
        legende="Projets de long terme rattachés à un objectif public"
        unite="fiches"
        precision="Chaque fiche renvoie vers l’acteur ; la plateforme n’encaisse rien, ne conseille rien, et ne classe rien par rendement. L’ordre ci-dessous est alphabétique."
      />

      {/* --- Où placer ----------------------------------------------------- */}
      <section className="mt-8" aria-labelledby="projets">
        <h2 id="projets" className="text-[19px] font-semibold tracking-tight">
          {d.epargne.projets}
        </h2>

        <div
          className="mt-3 flex items-start gap-2.5 rounded-[var(--pc-rayon)] border px-4 py-3.5 text-[13px]"
          style={{ borderColor: 'var(--pc-serieux)', color: 'var(--pc-serieux)' }}
        >
          <TriangleAlert className="mt-px h-4 w-4 shrink-0" aria-hidden />
          <span>{AVERTISSEMENT_RISQUE}</span>
        </div>

        <ul className="mt-4 space-y-3">
          {PROJETS_EPARGNE.map((p) => {
            const objectif = OBJECTIFS.find((o) => o.id === p.objectifServiId);
            return (
              <li key={p.id} className="carte px-5 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="etiquette text-[var(--pc-encre-tenue)]">{p.porteur}</span>
                    <h3 className="mt-1 text-[17px] font-semibold tracking-tight">{p.intitule}</h3>
                  </div>
                  <span className="chiffre shrink-0 rounded-full border border-[var(--pc-trait)] px-2.5 py-1 text-[12px] text-[var(--pc-encre-douce)]">
                    {d.epargne.horizon} ≥ {p.horizonAnneesMin} {d.epargne.ans}
                  </span>
                </div>

                <p className="mt-2.5 text-[13px]">
                  <span className="text-[var(--pc-encre-douce)]">{d.epargne.objectifServi} : </span>
                  {objectif ? (
                    <Link href={`/${l}/vision#${objectif.id}`} className="text-[var(--pc-accent)] underline underline-offset-2">
                      {objectif.intitule}
                    </Link>
                  ) : (
                    p.objectifServiId
                  )}
                  <span className="chiffre ml-1.5 text-[11.5px] text-[var(--pc-encre-tenue)]">({p.objectifServiId})</span>
                </p>

                <p className="mt-2 text-[13px]">
                  <span className="text-[var(--pc-encre-douce)]">{d.epargne.agrement} : </span>
                  {p.agrement.reference}
                </p>

                {/* Rendement observé, jamais plafond légal. */}
                <div className="mt-3 rounded-[var(--pc-rayon)] border border-dashed border-[var(--pc-trait-fort)] px-4 py-3">
                  <p className="etiquette text-[var(--pc-encre-tenue)]">{d.epargne.rendementObserve}</p>
                  {p.rendementObserve.length > 0 ? (
                    <ul className="mt-1.5 flex flex-wrap gap-x-5 gap-y-1 text-[13px]">
                      {p.rendementObserve.map((r) => (
                        <li key={r.annee} className="chiffre">
                          {r.annee} : {r.tauxPct} %
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-1.5 text-[12.5px] text-[var(--pc-encre-douce)]">
                      Non publié en données ouvertes. {p.rendementNonPublie?.raison} Le chiffre existe :{' '}
                      {p.rendementNonPublie?.ouEstLeChiffre}
                    </p>
                  )}
                  <p className="mt-2 text-[12px] text-[var(--pc-encre-tenue)]">{d.epargne.rendementAide}</p>
                </div>

                <dl className="mt-3 grid gap-2.5 text-[12.5px] sm:grid-cols-3">
                  <div>
                    <dt className="font-medium">{d.epargne.economique}</dt>
                    <dd className="text-[var(--pc-encre-douce)]">{p.tripleComptabilite.economique}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">{d.epargne.socialCompta}</dt>
                    <dd className="text-[var(--pc-encre-douce)]">{p.tripleComptabilite.social}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">{d.epargne.environnementalCompta}</dt>
                    <dd className="text-[var(--pc-encre-douce)]">{p.tripleComptabilite.environnemental}</dd>
                  </div>
                </dl>

                <p className="mt-3">
                  <a
                    href={p.urlSortante}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[13px] text-[var(--pc-accent)] underline underline-offset-2"
                  >
                    Site de l’acteur <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </p>
              </li>
            );
          })}
        </ul>

        <p className="mt-4 max-w-prose text-[12.5px] text-[var(--pc-encre-tenue)]">
          {INTEGRATION_FINANCIERE.explication}{' '}
          <a
            href={INTEGRATION_FINANCIERE.listeFsma}
            target="_blank"
            rel="noreferrer"
            className="text-[var(--pc-accent)] underline underline-offset-2"
          >
            Liste FSMA des prestataires agréés
          </a>
          .
        </p>
      </section>

      <Separator className="mt-10" />

      {/* --- Services au citoyen, gabarit bornin.brussels ------------------ */}
      <section className="mt-10" aria-labelledby="services">
        <h2 id="services" className="text-[19px] font-semibold tracking-tight">
          {d.epargne.services}
        </h2>
        <p className="mt-1.5 max-w-prose text-[13.5px] text-[var(--pc-encre-douce)]">
          Quatre catégories, une fiche qu’on peut lire debout dans un couloir : coordonnées, à propos, pour qui,
          permanence. Les horaires exacts ne sont publiés dans aucun format ouvert et le site communal interdit les
          outils automatisés — chaque fiche le dit plutôt que d’inventer un horaire.
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {SERVICES.map((s) => (
            <FicheServiceCarte key={s.id} service={s} d={d} locale={l} />
          ))}
        </div>
      </section>

      <Separator className="mt-10" />

      {/* --- Les services utiles ------------------------------------------- */}
      <section className="mt-10" aria-labelledby="utiles">
        <h2 id="utiles" className="text-[19px] font-semibold tracking-tight">
          {d.epargne.servicesUtiles}
        </h2>
        <p className="mt-1.5 max-w-prose text-[13.5px] text-[var(--pc-encre-douce)]">
          Ce qui fait revenir n’est pas la transparence, c’est l’utilité quotidienne. Quatre fonctions dominent tous
          les classements d’ouverture des applications communales. Deux d’entre elles n’ont aucune source ouverte en
          Belgique : c’est dit ici plutôt que contourné.
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <div className="carte px-5 py-4">
            <h3 className="text-[15px] font-semibold">{d.epargne.dechets}</h3>
            <div className="mt-3">
              <AbsenceDeDonnee
                organismeAttendu={`${DECHETS.intercommunale} — intercommunale de collecte`}
                depuis="toujours"
                explication={DECHETS.raisonAbsence}
              />
            </div>
            <p className="mt-3 text-[13px]">
              <a
                href={DECHETS.urlOfficiel}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[var(--pc-accent)] underline underline-offset-2"
              >
                Calendrier officiel d’{DECHETS.intercommunale} <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </p>
            <p className="mt-2 text-[12px] text-[var(--pc-encre-tenue)]">{DECHETS.demarcheEngagee}</p>
          </div>

          <div className="carte px-5 py-4">
            <h3 className="text-[15px] font-semibold">{d.epargne.travaux}</h3>
            <div className="mt-3">
              <AbsenceDeDonnee
                organismeAttendu={TRAVAUX.organismeAttendu}
                depuis="toujours"
                explication={TRAVAUX.raisonAbsence}
              />
            </div>
            <p className="mt-3 text-[12.5px] text-[var(--pc-encre-douce)]">
              Les fermetures de rue décidées par le collège apparaissent, elles, dans le fil : elles passent par un
              règlement de police temporaire, publié sur Lokaal Beslist.
            </p>
          </div>
        </div>

        {/* --- Les démarches, avec leur délai légal ------------------------ */}
        <h3 className="mt-8 text-[16px] font-semibold tracking-tight">{d.epargne.demarches}</h3>
        <ul className="mt-3 divide-y divide-[var(--pc-trait)] rounded-[var(--pc-rayon)] border border-[var(--pc-trait)]">
          {DEMARCHES.map((dm) => (
            <li key={dm.id} className="px-4 py-3.5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <a
                  href={dm.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[14px] font-medium text-[var(--pc-accent)] underline underline-offset-2"
                >
                  {dm.intitule}
                </a>
                <span className="chiffre text-[12.5px] text-[var(--pc-encre-douce)]">
                  {dm.delaiLegalJours
                    ? `${d.budget.delaiLegal} : ${dm.delaiLegalJours} ${d.budget.jours}`
                    : d.budget.aucunDelaiLegal}
                </span>
              </div>
              <p className="mt-0.5 text-[12px] text-[var(--pc-encre-tenue)]" lang="nl">
                {dm.intituleOrigine}
              </p>
              <p className="mt-1.5 text-[12.5px] text-[var(--pc-encre-douce)]">
                {dm.aQuiSAdresser} · pièces : {dm.piecesAFournir.join(', ')} ·{' '}
                {dm.coutEur === null ? 'coût variable' : dm.coutEur === 0 ? 'gratuit' : `${dm.coutEur} €`}
              </p>
              {dm.delaiSource && (
                <p className="mt-1 text-[11.5px] text-[var(--pc-encre-tenue)]">{dm.delaiSource}</p>
              )}
            </li>
          ))}
        </ul>

        {/* --- L'annuaire local -------------------------------------------- */}
        <h3 className="mt-8 text-[16px] font-semibold tracking-tight">{d.epargne.annuaire}</h3>
        {etabs ? (
          <Annuaire etablissements={etabs.etablissements} d={d} locale={l} />
        ) : (
          <p className="mt-3 text-[13px] text-[var(--pc-encre-tenue)]">La collecte n’a pas encore abouti.</p>
        )}

        {/* --- Le signalement ---------------------------------------------- */}
        <Signalement d={d} locale={l} />
      </section>

      <Separator className="mt-10" />

      {/* --- Les inscriptions ---------------------------------------------- */}
      <section className="mt-10" aria-labelledby="inscriptions">
        <h2 id="inscriptions" className="text-[19px] font-semibold tracking-tight">
          {d.epargne.inscriptions}
        </h2>
        <div className="mt-3">
          <AbsenceDeDonnee
            organismeAttendu="Aucun — il n’existe pas d’organisme chargé d’agréger ces séances"
            depuis="toujours"
            explication={INSCRIPTIONS.explication}
          />
        </div>
        <p className="mt-3 max-w-prose text-[13px] text-[var(--pc-encre-douce)]">
          Couverture réelle : <span className="chiffre font-medium">{formaterNombre(INSCRIPTIONS.couvertureReelle, l)}</span>{' '}
          séance sur un nombre inconnu. {d.epargne.inscriptionExterne} Aucun faux bouton d’inscription n’est affiché.
        </p>
      </section>

      <p className="mt-10 text-[12.5px] text-[var(--pc-encre-tenue)]">
        Données brutes de cet écran :{' '}
        <Link href={`/${l}/epargne.json`} className="text-[var(--pc-accent)] underline underline-offset-2">
          /{l}/epargne.json
        </Link>
        {' · '}© les contributeurs d’OpenStreetMap, ODbL 1.0.
      </p>
    </div>
  );
}
