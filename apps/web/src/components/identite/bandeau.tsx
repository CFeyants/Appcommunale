'use client';

import Link from 'next/link';
import { LogIn, MapPin, ShieldCheck, UserRound } from 'lucide-react';
import { Button } from '@pc/ui';
import type { Dictionnaire, Locale } from '@/i18n';
import { usePreferences } from '@/lib/preferences';

/**
 * Le bandeau d'identité.
 *
 * Sans session, il propose de s'identifier et rappelle que ce n'est pas
 * nécessaire pour lire. Avec une session de démonstration, il l'affiche en
 * permanence : personne ne doit croire un instant que ces données sont réelles.
 */
export function BandeauIdentite({ d, locale }: { d: Dictionnaire; locale: Locale }) {
  const { session, pret } = usePreferences();

  if (!pret) return <div className="h-[52px]" aria-hidden />;

  if (!session) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] bg-[var(--pc-fond-eleve)] px-4 py-3">
        <p className="flex items-center gap-2 text-[13px] text-[var(--pc-encre-douce)]">
          <ShieldCheck className="h-4 w-4 shrink-0 text-[var(--pc-accent)]" aria-hidden />
          {d.identite.intro}
        </p>
        <Button variant="primaire" taille="sm" asChild>
          <Link href={`/${locale}/identite`}>
            <LogIn className="h-3.5 w-3.5" />
            {d.accueil.seConnecter}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] bg-[var(--pc-fond-eleve)] px-4 py-3">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px]">
        <span className="flex items-center gap-1.5 font-medium">
          <UserRound className="h-4 w-4 text-[var(--pc-accent)]" aria-hidden />
          {session.prenom ?? 'Vous'}
        </span>
        {session.localite && (
          <span className="flex items-center gap-1.5 text-[var(--pc-encre-douce)]">
            <MapPin className="h-3.5 w-3.5" aria-hidden />
            {session.codePostal} {session.localite}
          </span>
        )}
        {session.demonstration && (
          <span
            className="rounded-full border border-dashed px-2 py-0.5 text-[11px] font-medium"
            style={{ color: 'var(--pc-retard)', borderColor: 'var(--pc-retard)' }}
          >
            {d.identite.simulation}
          </span>
        )}
      </div>
      <Link
        href={`/${locale}/preferences`}
        className="text-[13px] text-[var(--pc-accent)] underline underline-offset-2"
      >
        {d.nav.preferences}
      </Link>
    </div>
  );
}
