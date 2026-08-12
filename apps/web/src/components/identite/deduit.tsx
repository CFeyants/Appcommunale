'use client';

import Link from 'next/link';
import { Eye, ShieldOff, Trash2 } from 'lucide-react';
import { Button } from '@pc/ui';
import { LIBELLES_THEMES_FR, RETENTION_TRACES_JOURS, THEMES_SENSIBLES } from '@pc/core';
import type { Dictionnaire, Locale } from '@/i18n';
import { formaterDate } from '@/i18n';
import { usePreferences } from '@/lib/preferences';

/**
 * « Ce que la plateforme croit savoir de vous ».
 *
 * Accessible en deux clics depuis n'importe quel écran : le pied de page y
 * mène directement. Chaque attribut affiche ce qui l'a produit et se supprime
 * un par un.
 */
export function EcranDeduit({ d, locale }: { d: Dictionnaire; locale: Locale }) {
  const { attributs, preferences, supprimerAttribut, majPreferences, pret } = usePreferences();
  const actif = preferences.consentements.deduction.accorde;

  if (!pret) return <div className="contenu py-16" aria-busy />;

  return (
    <div className="contenu max-w-2xl py-10 md:py-14">
      <h1 className="text-[27px] font-semibold tracking-tight md:text-[32px]">{d.identite.croitSavoirTitre}</h1>

      <div className="mt-5 flex flex-wrap items-center gap-3 rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] px-4 py-3 text-[13.5px]">
        <Eye className="h-4 w-4 shrink-0 text-[var(--pc-accent)]" aria-hidden />
        <span className="flex-1">
          Consentement à la déduction :{' '}
          <strong className="font-semibold">{actif ? 'accordé' : 'désactivé'}</strong>
          {actif && preferences.consentements.deduction.accordeLe
            ? ` le ${formaterDate(preferences.consentements.deduction.accordeLe, locale)}`
            : ''}
          .
        </span>
        {actif && (
          <Button
            variant="contour"
            taille="sm"
            onClick={() =>
              majPreferences((p) => ({
                ...p,
                consentements: { ...p.consentements, deduction: { accorde: false } },
              }))
            }
          >
            {d.identite.retirer}
          </Button>
        )}
      </div>

      {!actif || attributs.length === 0 ? (
        <p className="mt-6 rounded-[var(--pc-rayon)] border border-dashed border-[var(--pc-trait-fort)] px-4 py-8 text-center text-[14px] text-[var(--pc-encre-douce)]">
          {actif
            ? 'Rien pour l’instant : aucune fiche thématique n’a encore été consultée depuis que vous avez accordé ce consentement.'
            : d.identite.croitSavoirVide}
        </p>
      ) : (
        <ul className="mt-6 space-y-2.5">
          {attributs.map((a) => (
            <li
              key={a.id}
              className="flex flex-wrap items-start justify-between gap-3 rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] px-4 py-3.5"
            >
              <div className="min-w-0">
                <p className="text-[14.5px] font-medium">{LIBELLES_THEMES_FR[a.theme]}</p>
                <p className="mt-1 text-[12.5px] text-[var(--pc-encre-douce)]">
                  {d.identite.produitPar} : {a.produitPar} — {a.occurrences} fois.
                </p>
                <p className="chiffre mt-0.5 text-[11.5px] text-[var(--pc-encre-tenue)]">
                  {d.identite.observeDepuis} {formaterDate(a.premiereObservation, locale)}, dernière fois{' '}
                  {formaterDate(a.derniereObservation, locale)}
                </p>
              </div>
              <Button variant="contour" taille="sm" onClick={() => supprimerAttribut(a.id)}>
                <Trash2 className="h-3.5 w-3.5" />
                {d.identite.supprimerAttribut}
              </Button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8 space-y-3 text-[13px] text-[var(--pc-encre-douce)]">
        <p className="flex gap-2.5">
          <ShieldOff className="mt-px h-4 w-4 shrink-0 text-[var(--pc-accent)]" aria-hidden />
          <span>
            Aucune donnée de comportement ne sort de la plateforme : aucune régie, aucun courtier, aucun pixel tiers,
            aucune revente, jamais.
          </span>
        </p>
        <p className="pl-[26px]">{d.identite.purge.replace('quatre-vingt-dix', String(RETENTION_TRACES_JOURS))}</p>
        <p className="pl-[26px]">
          Aucune déduction ne porte sur les opinions politiques, la religion, la santé, l’orientation sexuelle ou
          l’origine. Le thème «&nbsp;{LIBELLES_THEMES_FR[THEMES_SENSIBLES[0]!]}&nbsp;» est exclu de la déduction par le
          code lui-même, pas par une consigne.
        </p>
      </div>

      <p className="mt-8 text-[13px]">
        <Link href={`/${locale}/preferences`} className="text-[var(--pc-accent)] underline underline-offset-2">
          {d.identite.modifierTout}
        </Link>
      </p>
    </div>
  );
}
