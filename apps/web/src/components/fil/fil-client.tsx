'use client';

import * as React from 'react';
import Link from 'next/link';
import { Switch } from '@pc/ui';
import { ordonner, PHRASE_DE_TRI, type ProfilPertinence } from '@pc/core';
import type { Dictionnaire, Locale } from '@/i18n';
import { usePreferences } from '@/lib/preferences';
import type { ItemLeger } from '@/lib/donnees';
import { CarteFil } from './carte';

/**
 * Le fil.
 *
 * Sept cartes au maximum, tous niveaux confondus. La liste est finie, datée,
 * et se termine par « vous avez tout vu pour cette période ». Aucun défilement
 * infini, aucun classement par engagement, aucun compteur de vues.
 *
 * Seuls les items publiés traversent vers le client : ils sont peu nombreux,
 * et c'est ce qui permet au tri déclaré de s'exécuter sur l'appareil sans que
 * la moindre préférence ne parte vers un serveur.
 */
const MAX_CARTES = 7;

export function FilClient({
  items,
  d,
  locale,
}: {
  items: ItemLeger[];
  d: Dictionnaire;
  locale: Locale;
}) {
  const { preferences, majPreferences, attributs } = usePreferences();

  const profil: ProfilPertinence = React.useMemo(
    () => ({
      abonnements: preferences.abonnements,
      publics: preferences.situation
        ? [
            ...(preferences.situation.enfants.length > 0 ? ['parents'] : []),
            ...(preferences.situation.parentsDependants ? ['aidants'] : []),
            ...(preferences.situation.locataire ? ['locataires'] : []),
            ...(preferences.situation.statut === 'independant' ? ['indépendants'] : []),
            ...(preferences.situation.statut === 'pensionne' ? ['aînés'] : []),
          ]
        : [],
      niveauResidence: 'commune',
      // Vide tant que le consentement B n'est pas donné : la déduction ne peut
      // pas peser sur l'ordre sans consentement explicite.
      interetsDeduits: preferences.consentements.deduction.accorde ? attributs.map((a) => a.theme) : [],
    }),
    [preferences, attributs],
  );

  const classes = React.useMemo(() => ordonner(items, profil), [items, profil]);

  const aDesAbonnements = Object.values(preferences.abonnements).some((t) => (t?.length ?? 0) > 0);
  // Sans abonnement déclaré, on montre tout ce qui passe le test d'admission :
  // c'est le comportement par défaut d'un citoyen qui ne configure rien.
  const retenus = preferences.toutVoir || !aDesAbonnements ? classes : classes.filter((c) => c.score.total > 25);
  const masques = classes.length - retenus.length;
  const tete = retenus.slice(0, MAX_CARTES);

  const repartition = React.useMemo(() => {
    const parNiveau = new Map<string, number>();
    for (const { item } of tete) parNiveau.set(item.niveau, (parNiveau.get(item.niveau) ?? 0) + 1);
    // « Commune : 3 · Union européenne : 1 » plutôt qu'un accord grammatical
    // à construire dans trois langues.
    return [...parNiveau.entries()]
      .map(([n, c]) => `${d.niveaux[n as keyof typeof d.niveaux]} : ${c}`)
      .join(' · ');
  }, [tete, d]);

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12.5px] text-[var(--pc-encre-tenue)]">
        <span>{repartition || '—'}</span>
        <span aria-hidden>·</span>
        <span>
          <span className="chiffre">{tete.length}</span> {d.accueil.actesRetenus}
        </span>
        {masques > 0 && (
          <>
            <span aria-hidden>·</span>
            <span className="chiffre">{masques} masqués par votre filtre</span>
          </>
        )}
        <span aria-hidden>·</span>
        <Link href={`/${locale}/admission`} className="text-[var(--pc-accent)] underline underline-offset-2">
          {d.nav.admission}
        </Link>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] bg-[var(--pc-fond-enfonce)] px-4 py-2.5">
        <p className="max-w-prose text-[12.5px] text-[var(--pc-encre-douce)]">{PHRASE_DE_TRI}</p>
        <label className="flex shrink-0 items-center gap-2 text-[13px]">
          <Switch
            checked={preferences.toutVoir}
            onCheckedChange={(v) => majPreferences((p) => ({ ...p, toutVoir: v }))}
            aria-label={d.commun.toutVoir}
          />
          {d.commun.toutVoir}
        </label>
      </div>

      <div className="mt-5 space-y-3.5">
        {tete.map(({ item, score }) => (
          <CarteFil key={item.id} item={item} score={score.total} raison={score.raison} d={d} locale={locale} />
        ))}
      </div>

      {tete.length === 0 && (
        <p className="mt-6 rounded-[var(--pc-rayon)] border border-dashed border-[var(--pc-trait-fort)] px-4 py-8 text-center text-[14px] text-[var(--pc-encre-tenue)]">
          {d.commun.aucunResultat}
        </p>
      )}

      {tete.length > 0 && (
        <p className="mt-5 border-t border-[var(--pc-trait)] pt-5 text-center text-[13px] text-[var(--pc-encre-tenue)]">
          {d.accueil.finDeListe}
        </p>
      )}
    </>
  );
}
