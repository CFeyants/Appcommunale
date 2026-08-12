'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Check, Fingerprint, ShieldOff, TriangleAlert, X } from 'lucide-react';
import { Button, Card, CardContent } from '@pc/ui';
import { NON_FOURNIS_PAR_ITSME, SCOPES_DEMANDES } from '@pc/core';
import type { Dictionnaire, Locale } from '@/i18n';
import { usePreferences } from '@/lib/preferences';
import { FOURNISSEUR_DEMONSTRATION, SCOPES_ECARTES, versSession } from '@/contenu/itsme-demo';

const EXPLICATION_SCOPE: Record<string, string> = {
  openid: 'Obligatoire. Ouvre la session OpenID Connect.',
  service: 'Obligatoire chez itsme. Identifie le service demandeur.',
  profile: 'Prénom et langue. Sert à s’adresser à vous, rien d’autre.',
  address: 'Code postal et localité. Sert uniquement à savoir de quelle commune il s’agit.',
};

export function EcranIdentification({ d, locale }: { d: Dictionnaire; locale: Locale }) {
  const { ouvrirSession, session } = usePreferences();
  const router = useRouter();
  const [enCours, setEnCours] = React.useState(false);

  const connecter = async () => {
    setEnCours(true);
    const revendications = await FOURNISSEUR_DEMONSTRATION.authentifier();
    ouvrirSession(versSession(revendications, FOURNISSEUR_DEMONSTRATION.demonstration));
    router.push(`/${locale}/preferences?bienvenue=1`);
  };

  return (
    <div className="contenu max-w-2xl py-10 md:py-16">
      <h1 className="text-[28px] font-semibold tracking-tight md:text-[34px]">{d.identite.titre}</h1>
      <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-[var(--pc-encre-douce)]">{d.identite.intro}</p>

      {/* Le bandeau de simulation vient AVANT le bouton, pas après. */}
      <div
        className="mt-7 flex items-start gap-3 rounded-[var(--pc-rayon)] border border-dashed px-4 py-3.5 text-[13px]"
        style={{ borderColor: 'var(--pc-retard)', color: 'var(--pc-retard)' }}
      >
        <TriangleAlert className="mt-px h-4 w-4 shrink-0" aria-hidden />
        <span>
          <strong className="font-semibold">{d.identite.simulation}.</strong> {d.identite.simulationTexte}
        </span>
      </div>

      <div className="mt-6">
        {session ? (
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-[14px]">
              Session ouverte pour <strong>{session.prenom}</strong>
              {session.localite ? `, ${session.codePostal} ${session.localite}` : ''}.
            </p>
            <Button variant="contour" taille="sm" asChild>
              <Link href={`/${locale}/preferences`}>{d.nav.preferences}</Link>
            </Button>
          </div>
        ) : (
          <Button variant="primaire" taille="lg" onClick={connecter} disabled={enCours}>
            <Fingerprint className="h-4 w-4" />
            {d.identite.boutonItsme}
          </Button>
        )}
      </div>

      {/* --- Ce qui est demandé, et ce qui ne l'est pas --------------------- */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="pt-5">
            <h2 className="etiquette text-[var(--pc-encre-tenue)]">{d.identite.portees}</h2>
            <ul className="mt-3 space-y-2.5">
              {SCOPES_DEMANDES.map((s) => (
                <li key={s} className="flex gap-2.5 text-[13px]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: 'var(--pc-conforme)' }} aria-hidden />
                  <span>
                    <code className="font-mono text-[12px] font-semibold">{s}</code>
                    <span className="block text-[var(--pc-encre-douce)]">{EXPLICATION_SCOPE[s]}</span>
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5">
            <h2 className="etiquette text-[var(--pc-encre-tenue)]">{d.identite.porteesNonDemandees}</h2>
            <ul className="mt-3 space-y-2.5">
              {SCOPES_ECARTES.map((s) => (
                <li key={s.scope} className="flex gap-2.5 text-[13px]">
                  <X className="mt-0.5 h-4 w-4 shrink-0" style={{ color: 'var(--pc-hors-seuil)' }} aria-hidden />
                  <span>
                    <code className="font-mono text-[12px] font-semibold">{s.scope}</code>
                    <span className="block text-[var(--pc-encre-douce)]">{s.pourquoi}</span>
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div
        className="mt-4 flex items-start gap-3 rounded-[var(--pc-rayon)] border px-4 py-3.5 text-[13px]"
        style={{ borderColor: 'var(--pc-trait-fort)' }}
      >
        <ShieldOff className="mt-px h-4 w-4 shrink-0 text-[var(--pc-accent)]" aria-hidden />
        <span className="text-[var(--pc-encre-douce)]">{d.identite.pasDeNumeroNational}</span>
      </div>

      {/* --- Ce qu'itsme ne fournit pas ------------------------------------ */}
      <section className="mt-10">
        <h2 className="text-[17px] font-semibold tracking-tight">Ce qu’itsme ne fournit pas</h2>
        <p className="mt-2 max-w-prose text-[13.5px] text-[var(--pc-encre-douce)]">
          Ces informations ne sont ni renvoyées par itsme, ni cherchées ailleurs. Si vous voulez qu’elles comptent
          dans le tri, vous les saisirez vous-même, et vous pourrez les effacer d’un bouton.
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {NON_FOURNIS_PAR_ITSME.map((x) => (
            <li
              key={x}
              className="rounded-full border border-dashed border-[var(--pc-trait-fort)] px-2.5 py-1 text-[12px] text-[var(--pc-encre-tenue)]"
            >
              {x}
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-10 text-[13px]">
        <Link href={`/${locale}`} className="text-[var(--pc-accent)] underline underline-offset-2">
          {d.accueil.lireSansCompte}
        </Link>
      </p>
    </div>
  );
}
