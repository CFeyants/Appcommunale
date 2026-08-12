import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { BadgeStatut, EtiquetteCategorie, LigneSource, PuceNiveau, Separator } from '@pc/ui';
import { EXPLICATION_MOTIF } from '@pc/core';
import { dictionnaire, estLocale, formaterDate, type Locale } from '@/i18n';
import { chargerActe } from '@/lib/donnees';
import { OBJECTIFS } from '@/contenu/objectifs';
import { NoterConsultation } from '@/components/fil/noter-consultation';

export const dynamic = 'force-dynamic';

/**
 * La fiche complète d'un acte.
 *
 * « Rien n'est caché » : le texte intégral publié par l'autorité dans sa
 * langue, toutes les dates avec leur signification, la licence, les objectifs
 * rattachés, le JSON de l'item, et le lien direct vers le document original.
 *
 * Une seule réserve, assumée : le texte d'origine n'est affiché que pour les
 * actes qu'un humain a relus. Un acte non relu peut nommer des personnes
 * privées — la commune publie par exemple les noms des couples fêtant leurs
 * noces d'or. Le republier sans relecture serait une diffusion que personne
 * n'a validée.
 */
export default async function PageActe({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  if (!estLocale(locale)) notFound();
  const l = locale as Locale;
  const d = dictionnaire(l);

  const item = await chargerActe(id);
  if (!item) notFound();

  const objectifs = OBJECTIFS.filter((o) => item.objectifsLies.includes(o.id));
  const relu = Boolean(item.reformulation);
  const datesIncoherentes =
    Boolean(item.echeance && item.entreeEnVigueur && item.echeance < item.entreeEnVigueur);

  return (
    <div className="contenu max-w-3xl py-8 md:py-12">
      {relu && <NoterConsultation themes={item.themes} titre={item.titre} />}

      <Link
        href={`/${l}`}
        className="inline-flex items-center gap-1.5 text-[13px] text-[var(--pc-encre-douce)] underline-offset-4 hover:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {d.nav.fil}
      </Link>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <EtiquetteCategorie categorie={item.categorie} libelle={d.categories[item.categorie]} />
        <PuceNiveau libelle={`${d.niveaux[item.niveau]} · Kraainem`} />
        {!item.admission.publie && item.admission.motif && (
          <BadgeStatut statut="non-mesure" mot={d.accueil.ongletEcartes} />
        )}
      </div>

      <h1 className="mt-3 text-[26px] font-semibold leading-tight tracking-tight md:text-[32px]">
        {relu ? item.titre : item.titreOrigine}
      </h1>

      {/* § 11 — on ne traduit jamais un intitulé juridique sans afficher
          l'original à côté. Le nom d'un règlement est un objet juridique. */}
      <p className="mt-3 rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] bg-[var(--pc-fond-enfonce)] px-4 py-3 text-[13px]">
        <span className="etiquette block text-[var(--pc-encre-tenue)]">
          Intitulé d’origine — {d.commun.langueDeLActe} : néerlandais
        </span>
        <span className="mt-1.5 block font-medium">{item.titreOrigine}</span>
      </p>

      {!item.admission.publie && item.admission.motif && (
        <p className="mt-4 rounded-[var(--pc-rayon)] border border-dashed border-[var(--pc-trait-fort)] px-4 py-3 text-[13px] text-[var(--pc-encre-douce)]">
          <strong className="font-semibold text-[var(--pc-encre)]">Cet acte n’entre pas dans le fil.</strong>{' '}
          {EXPLICATION_MOTIF[item.admission.motif]}
        </p>
      )}

      {relu && (
        <>
          <h2 className="etiquette mt-8 text-[var(--pc-encre-tenue)]">{d.fiche.ceQuiChange}</h2>
          <p className="mt-2 max-w-prose text-[15.5px] leading-relaxed">{item.impact}</p>

          <h2 className="etiquette mt-7 text-[var(--pc-encre-tenue)]">{d.fiche.aFaire}</h2>
          <div className="mt-2">
            {item.action.kind === 'aucune_action' ? (
              <p className="rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] px-4 py-3.5 text-[14px]">
                <strong className="font-semibold">{d.fiche.aucuneAction}.</strong>{' '}
                <span className="text-[var(--pc-encre-douce)]">{item.action.explication}</span>
              </p>
            ) : item.action.kind === 'demarche' ? (
              <p className="text-[14.5px]">
                {item.action.libelle}
                {item.action.delaiLegalJours ? (
                  <span className="chiffre text-[var(--pc-encre-douce)]">
                    {' '}
                    — {d.budget.delaiLegal} : {item.action.delaiLegalJours} {d.budget.jours}
                  </span>
                ) : null}
                <a
                  href={item.action.url}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-2 inline-flex items-center gap-1 text-[var(--pc-accent)] underline underline-offset-2"
                >
                  ouvrir <ExternalLink className="h-3 w-3" />
                </a>
              </p>
            ) : item.action.kind === 'seance' ? (
              <p className="text-[14.5px]">
                {item.action.libelle} — <span className="chiffre">{formaterDate(item.action.date, l)}</span>,{' '}
                {item.action.lieu}
              </p>
            ) : item.action.kind === 'consultation' ? (
              <p className="text-[14.5px]">
                {item.action.libelle} — clôture le{' '}
                <span className="chiffre">{formaterDate(item.action.clotureLe, l)}</span>
                <a
                  href={item.action.url}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-2 text-[var(--pc-accent)] underline underline-offset-2"
                >
                  participer
                </a>
              </p>
            ) : (
              <p className="text-[14.5px]">Demande à adresser à : {item.action.destinataireId}</p>
            )}
          </div>
        </>
      )}

      <Separator className="mt-8" />

      <h2 className="etiquette mt-6 text-[var(--pc-encre-tenue)]">{d.fiche.dates}</h2>
      <dl className="mt-2 grid gap-x-8 gap-y-2 sm:grid-cols-2">
        <Ligne terme={d.fiche.dateActe} valeur={formaterDate(item.dateActe, l)} />
        {item.dateSeance && <Ligne terme="Séance" valeur={formaterDate(item.dateSeance, l)} />}
        {item.entreeEnVigueur && (
          <Ligne terme={d.fiche.entreeEnVigueur} valeur={formaterDate(item.entreeEnVigueur, l)} />
        )}
        {item.echeance && <Ligne terme={d.fiche.echeance} valeur={formaterDate(item.echeance, l)} />}
        <Ligne terme="Collecté le" valeur={formaterDate(item.source.consulteLe, l)} />
      </dl>
      {datesIncoherentes && (
        <p className="mt-2 text-[12.5px]" style={{ color: 'var(--pc-serieux)' }}>
          {d.fiche.datesIncoherentes} — aucun délai n’est calculé à partir de ces dates.
        </p>
      )}

      <h2 className="etiquette mt-7 text-[var(--pc-encre-tenue)]">{d.fiche.texteIntegral}</h2>
      {relu && item.texteOrigine ? (
        <div className="mt-2 whitespace-pre-line rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] bg-[var(--pc-fond-eleve)] px-4 py-4 text-[13.5px] leading-relaxed" lang="nl">
          {item.texteOrigine}
        </div>
      ) : (
        <p className="mt-2 rounded-[var(--pc-rayon)] border border-dashed border-[var(--pc-trait-fort)] px-4 py-3.5 text-[13.5px] text-[var(--pc-encre-douce)]">
          {relu
            ? d.fiche.texteAbsent
            : 'Le texte publié par l’autorité n’est affiché qu’après relecture humaine : une délibération non relue peut nommer des personnes privées. Le lien ci-dessous mène à ce que l’autorité publie elle-même.'}
        </p>
      )}

      {objectifs.length > 0 && (
        <>
          <h2 className="etiquette mt-7 text-[var(--pc-encre-tenue)]">{d.fiche.objectifsLies}</h2>
          <ul className="mt-2 space-y-1.5">
            {objectifs.map((o) => (
              <li key={o.id} className="text-[14px]">
                <Link href={`/${l}/vision#${o.id}`} className="text-[var(--pc-accent)] underline underline-offset-2">
                  {o.intitule}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      <h2 className="etiquette mt-7 text-[var(--pc-encre-tenue)]">{d.commun.source}</h2>
      <div className="mt-2 rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] px-4 py-3">
        <LigneSource source={item.source} />
        <p className="chiffre mt-2 text-[11.5px] text-[var(--pc-encre-tenue)]">
          Identifiant amont : {item.source.identifiantAmont}
        </p>
      </div>

      {item.reformulation && (
        <p className="mt-4 text-[12.5px] text-[var(--pc-encre-tenue)]">
          {d.fiche.reformulePar} {item.reformulation.validePar} {d.fiche.le}{' '}
          {formaterDate(item.reformulation.valideLe, l)}
          {item.reformulation.assisteeParModele ? ` — ${d.fiche.assisteeParModele}` : ''}.
        </p>
      )}

      <p className="mt-6 text-[13px]">
        <Link
          href={`/api/${l}/acte/${item.id}.json`}
          className="text-[var(--pc-accent)] underline underline-offset-2"
        >
          {d.fiche.jsonItem}
        </Link>
      </p>
    </div>
  );
}

function Ligne({ terme, valeur }: { terme: string; valeur: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-[var(--pc-trait)] py-1.5 text-[13.5px]">
      <dt className="text-[var(--pc-encre-douce)]">{terme}</dt>
      <dd className="chiffre">{valeur}</dd>
    </div>
  );
}
