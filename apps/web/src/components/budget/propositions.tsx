'use client';

import { ExternalLink, Scale, ThumbsUp } from 'lucide-react';
import { Button, Separator } from '@pc/ui';
import type { Dictionnaire, Locale } from '@/i18n';
import { formaterDate, formaterNombre } from '@/i18n';
import { FORMULE_SOUTIEN, PROPOSITIONS, REGLEMENT_PARTICIPATION } from '@/contenu/commune';
import { BadgeDemonstration, InterrupteurDemonstration, useDemonstration } from './demonstration';

/**
 * Les propositions citoyennes.
 *
 * Le point le plus important de cet écran n'est pas la liste : c'est le bloc
 * juridique au-dessus. En Flandre, le droit d'initiative citoyenne passe par
 * le règlement de participation que la commune **doit** adopter en application
 * de l'article 304 § 5 du Decreet Lokaal Bestuur. C'est ce règlement, et non
 * la plateforme, qui fixe le seuil.
 *
 * Kraainem ne l'a pas adopté — vérifié sur cinq ans de séances du conseil. La
 * plateforme l'écrit, et présente le soutien pour ce qu'il est : un signal
 * public non contraignant.
 */
export function Propositions({ d, locale }: { d: Dictionnaire; locale: Locale }) {
  const [visible, setVisible] = useDemonstration();
  const r = REGLEMENT_PARTICIPATION;

  return (
    <section className="mt-10" aria-labelledby="propositions">
      <h2 id="propositions" className="text-[19px] font-semibold tracking-tight">
        {d.budget.propositions}
      </h2>

      {/* --- Le traitement juridique, avant toute liste ------------------- */}
      <div
        className="mt-3 rounded-[var(--pc-rayon)] border px-5 py-4"
        style={{
          borderColor: r.adopte ? 'var(--pc-conforme)' : 'var(--pc-serieux)',
          backgroundColor: r.adopte ? 'var(--pc-conforme-fond)' : 'var(--pc-serieux-fond)',
        }}
      >
        <p
          className="flex items-start gap-2.5 text-[14px] font-semibold"
          style={{ color: r.adopte ? 'var(--pc-conforme)' : 'var(--pc-serieux)' }}
        >
          <Scale className="mt-px h-4 w-4 shrink-0" aria-hidden />
          {r.adopte ? d.budget.reglementAdopte : d.budget.reglementAbsent}
        </p>

        <p className="mt-2.5 max-w-prose text-[13px] text-[var(--pc-encre-douce)]">{r.fondement.resume}</p>

        <dl className="mt-3 space-y-1.5 text-[12.5px] text-[var(--pc-encre-douce)]">
          <div className="flex flex-wrap gap-x-2">
            <dt className="font-medium">Fondement</dt>
            <dd>
              {r.fondement.texte} —{' '}
              <a
                href={r.fondement.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[var(--pc-accent)] underline underline-offset-2"
              >
                texte <ExternalLink className="h-3 w-3" />
              </a>
            </dd>
          </div>
          <div className="flex flex-wrap gap-x-2">
            <dt className="font-medium">{d.budget.seuilReel}</dt>
            <dd>{r.seuilSignatures ?? 'aucun — la commune n’a pas adopté son règlement'}</dd>
          </div>
          <div className="flex flex-wrap gap-x-2">
            <dt className="font-medium">Canal de dépôt officiel</dt>
            <dd>{r.canalDepot}</dd>
          </div>
          <div className="flex flex-wrap gap-x-2">
            <dt className="font-medium">Méthode de vérification</dt>
            <dd>
              {r.methodeVerification} Vérifié le <span className="chiffre">{r.verifieLe}</span>.
            </dd>
          </div>
        </dl>
      </div>

      <p className="mt-3 max-w-prose rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] px-4 py-3 text-[13px] italic text-[var(--pc-encre-douce)]">
        « {FORMULE_SOUTIEN} »
      </p>

      <div className="mt-4">
        <InterrupteurDemonstration visible={visible} onChange={setVisible} quoi="Propositions citoyennes" />
      </div>

      {!visible ? (
        <p className="mt-4 rounded-[var(--pc-rayon)] border border-dashed border-[var(--pc-trait-fort)] px-4 py-8 text-center text-[13.5px] text-[var(--pc-encre-tenue)]">
          Aucune proposition réelle : la plateforme n’est pas encore ouverte au dépôt.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {PROPOSITIONS.map((p) => (
            <li key={p.id} className="carte px-5 py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="text-[16px] font-semibold tracking-tight">{p.titre}</h3>
                <BadgeDemonstration />
              </div>
              <p className="mt-1.5 max-w-prose text-[13.5px] text-[var(--pc-encre-douce)]">{p.expose}</p>
              <ul className="mt-2.5 flex flex-wrap gap-1.5">
                {p.themes.map((t) => (
                  <li
                    key={t}
                    className="rounded-full bg-[var(--pc-fond-enfonce)] px-2 py-0.5 text-[11px] text-[var(--pc-encre-douce)]"
                  >
                    {d.themes[t]}
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button variant="contour" taille="sm" disabled title="Ouvert le jour où le dépôt est possible">
                  <ThumbsUp className="h-3.5 w-3.5" />
                  {d.budget.soutenir}
                </Button>
                <span className="chiffre text-[13px] text-[var(--pc-encre-douce)]">
                  {formaterNombre(p.soutiens, locale)} {d.budget.soutiens}
                </span>
                <span className="chiffre text-[12px] text-[var(--pc-encre-tenue)]">
                  déposée le {formaterDate(p.deposeeLe, locale)}
                </span>
              </div>

              {/* Aucun seuil affiché : il n'en existe pas. On ne fabrique pas
                  une jauge vers un seuil que la commune n'a jamais fixé. */}
              <p className="mt-3 text-[12px] text-[var(--pc-encre-tenue)]">
                Aucun seuil ne s’applique : la commune n’a pas adopté son règlement de participation. Ce compteur ne
                déclenche aucune obligation d’inscrire un point à l’ordre du jour.
              </p>

              <Button variant="lien" taille="sm" className="mt-2 px-0" disabled>
                {d.budget.preparerDepot}
              </Button>
            </li>
          ))}
        </ul>
      )}

      <Separator className="mt-10" />
    </section>
  );
}
