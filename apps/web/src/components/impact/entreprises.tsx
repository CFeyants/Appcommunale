'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Building2, Search } from 'lucide-react';
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

const LIBELLE_CATEGORIE: Record<string, string> = {
  commerce: 'Commerce',
  restauration: 'Restauration',
  sante: 'Santé',
  transport: 'Transport',
  'culture-sport': 'Culture et sport',
  service: 'Service',
};

/**
 * La liste des établissements.
 *
 * Ordre alphabétique strict, imposé par le tri de collecte et jamais modifiable
 * par l'utilisateur : offrir un tri, ce serait offrir un classement. La
 * recherche filtre, elle ne réordonne pas.
 *
 * La plupart des fiches affichent « n’a rien déclaré ». C’est l’information la
 * plus utile de l’écran, et elle ne doit pas être adoucie.
 */
export function ListeEntreprises({
  etablissements,
  completude,
  d,
  locale,
}: {
  etablissements: Etab[];
  completude: { total: number; avecAdresse: number; avecHoraires: number; avecTelephone: number };
  d: Dictionnaire;
  locale: Locale;
}) {
  const [q, setQ] = React.useState('');
  const [limite, setLimite] = React.useState(24);

  const filtres = React.useMemo(() => {
    const t = q.trim().toLowerCase();
    return t ? etablissements.filter((e) => e.nom.toLowerCase().includes(t)) : etablissements;
  }, [etablissements, q]);

  return (
    <>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <label className="relative flex-1 sm:max-w-xs">
          <span className="sr-only">{d.commun.recherche}</span>
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--pc-encre-tenue)]"
            aria-hidden
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={d.commun.recherche}
            className="h-9 w-full rounded-[var(--pc-rayon)] border border-[var(--pc-trait-fort)] bg-[var(--pc-fond-eleve)] pl-8 pr-3 text-[13px]"
          />
        </label>
        <p className="chiffre text-[12.5px] text-[var(--pc-encre-tenue)]">
          {formaterNombre(filtres.length, locale)} établissements · {formaterNombre(completude.avecAdresse, locale)}{' '}
          avec adresse · {formaterNombre(completude.avecHoraires, locale)} avec horaires
        </p>
      </div>

      <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {filtres.slice(0, limite).map((e) => (
          <li key={e.id} className="carte px-4 py-3.5">
            <div className="flex items-start gap-2.5">
              <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--pc-encre-tenue)]" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14.5px] font-medium">{e.nom}</p>
                <p className="text-[12px] text-[var(--pc-encre-tenue)]">
                  {LIBELLE_CATEGORIE[e.categorie] ?? e.categorie} · {e.typeOsm}
                </p>
                {e.adresse ? (
                  <p className="mt-1 text-[12.5px] text-[var(--pc-encre-douce)]">{e.adresse}</p>
                ) : (
                  <p className="mt-1 text-[12px] text-[var(--pc-encre-tenue)]">Adresse non renseignée dans la source.</p>
                )}
              </div>
            </div>

            {/* Le cœur de l'écran : la case vide, sourcée.
                Aucun montant n'y figure jamais — un test le vérifie. */}
            <p
              className={cn(
                'mt-3 rounded-[var(--pc-rayon)] border border-dashed px-3 py-2 text-[12px]',
                'border-[var(--pc-trait-fort)] text-[var(--pc-encre-tenue)]',
              )}
            >
              {d.impact.rienDeclare} — aucune déclaration environnementale ni sociale reçue.
            </p>

            {/* L'entrée dans l'autre espace. Une entreprise arrive toujours
                par sa fiche publique : le lien entre les deux est ainsi évident. */}
            <p className="mt-2 text-[12px]">
              <Link
                href={`/${locale}/entreprise`}
                className="inline-flex items-center gap-1 text-[var(--pc-accent)] underline underline-offset-2"
              >
                Vous êtes cette entreprise ? Déclarez ici
                <ArrowUpRight className="h-3 w-3" aria-hidden />
              </Link>
            </p>
          </li>
        ))}
      </ul>

      {limite < filtres.length && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setLimite((n) => n + 48)}
            className="rounded-[var(--pc-rayon)] border border-[var(--pc-trait-fort)] px-4 py-2 text-[13px] hover:bg-[var(--pc-fond-enfonce)]"
          >
            Afficher 48 de plus — {formaterNombre(filtres.length - limite, locale)} restants
          </button>
        </div>
      )}

      <p className="mt-5 max-w-prose text-[12.5px] text-[var(--pc-encre-tenue)]">
        {d.impact.divergenceMethodes} — la question ne se pose pas encore ici : aucune valeur n’a été déclarée. Le
        volet social ne passera que par des faits établis, études publiées ou décisions de justice définitives, citées
        avec leur source. La plateforme ne produit aucune appréciation.
      </p>
    </>
  );
}
