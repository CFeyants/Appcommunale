'use client';

import * as React from 'react';
import { Clock, ExternalLink, MapPin, Phone } from 'lucide-react';
import { cn } from '@pc/ui';
import type { Dictionnaire, Locale } from '@/i18n';
import { formaterNombre } from '@/i18n';

interface Etab {
  id: string;
  nom: string;
  categorie: string;
  typeOsm: string;
  adresse: string | null;
  telephone: string | null;
  site: string | null;
  horaires: string | null;
}

const CATEGORIES = [
  { cle: 'sante', libelle: 'Santé' },
  { cle: 'commerce', libelle: 'Commerces' },
  { cle: 'restauration', libelle: 'Restauration' },
  { cle: 'transport', libelle: 'Transport' },
  { cle: 'culture-sport', libelle: 'Culture et sport' },
  { cle: 'service', libelle: 'Services' },
] as const;

/**
 * L'annuaire local.
 *
 * Ordre alphabétique, filtres par catégorie, pas de tri par « popularité » ni
 * par note : la plateforme ne classe pas les commerces.
 */
export function Annuaire({
  etablissements,
  d,
  locale,
}: {
  etablissements: Etab[];
  d: Dictionnaire;
  locale: Locale;
}) {
  const [categorie, setCategorie] = React.useState<string>('sante');
  const [limite, setLimite] = React.useState(12);

  const liste = etablissements.filter((e) => e.categorie === categorie);
  const visibles = liste.slice(0, limite);

  return (
    <>
      <div className="mt-3 flex flex-wrap gap-1">
        {CATEGORIES.map((c) => {
          const n = etablissements.filter((e) => e.categorie === c.cle).length;
          return (
            <button
              key={c.cle}
              type="button"
              onClick={() => {
                setCategorie(c.cle);
                setLimite(12);
              }}
              aria-pressed={categorie === c.cle}
              className={cn(
                'rounded-full border px-3 py-1 text-[12.5px]',
                categorie === c.cle
                  ? 'border-[var(--pc-accent)] bg-[var(--pc-accent)] text-white'
                  : 'border-[var(--pc-trait)] text-[var(--pc-encre-douce)] hover:border-[var(--pc-trait-fort)]',
              )}
            >
              {c.libelle} <span className="chiffre opacity-70">{n}</span>
            </button>
          );
        })}
      </div>

      <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {visibles.map((e) => (
          <li key={e.id} className="carte px-4 py-3">
            <p className="text-[14px] font-medium">{e.nom}</p>
            <p className="text-[11.5px] text-[var(--pc-encre-tenue)]">{e.typeOsm}</p>
            <ul className="mt-2 space-y-1 text-[12.5px] text-[var(--pc-encre-douce)]">
              {e.adresse && (
                <li className="flex items-start gap-1.5">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--pc-encre-tenue)]" aria-hidden />
                  {e.adresse}
                </li>
              )}
              {e.telephone && (
                <li className="flex items-start gap-1.5">
                  <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--pc-encre-tenue)]" aria-hidden />
                  {e.telephone}
                </li>
              )}
              {e.horaires && (
                <li className="flex items-start gap-1.5">
                  <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--pc-encre-tenue)]" aria-hidden />
                  <span className="font-mono text-[11.5px]">{e.horaires}</span>
                </li>
              )}
              {e.site && (
                <li>
                  <a
                    href={e.site}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[var(--pc-accent)] underline underline-offset-2"
                  >
                    site <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              )}
            </ul>
          </li>
        ))}
      </ul>

      {limite < liste.length && (
        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={() => setLimite((n) => n + 24)}
            className="rounded-[var(--pc-rayon)] border border-[var(--pc-trait-fort)] px-4 py-2 text-[13px] hover:bg-[var(--pc-fond-enfonce)]"
          >
            Afficher 24 de plus — {formaterNombre(liste.length - limite, locale)} restants
          </button>
        </div>
      )}

      <p className="mt-3 text-[12px] text-[var(--pc-encre-tenue)]">
        Aucune source publique n’existe pour la liste des commerçants d’une commune belge. Ces fiches viennent
        d’OpenStreetMap : contributives, donc incomplètes, et rien ne garantit qu’un établissement fermé en ait été
        retiré. Aucune pharmacie de garde n’est affichée : le rôle de garde n’est publié dans aucun flux ouvert.
      </p>
    </>
  );
}
