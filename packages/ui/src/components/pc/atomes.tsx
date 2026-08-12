'use client';

/*
 * Les atomes propres au produit.
 *
 * Deux règles y sont matérialisées plutôt que recommandées :
 *   — un statut porte toujours une icône ET un mot (§ 3.3) ;
 *   — une information affiche toujours sa source, sans clic (§ 4.1).
 */

import * as React from 'react';
import {
  CircleCheck,
  CircleDashed,
  Clock,
  ExternalLink,
  OctagonX,
  TriangleAlert,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '../../lib/cn';

// --- Statut ----------------------------------------------------------------

export type Statut = 'conforme' | 'en-retard' | 'serieux' | 'hors-seuil' | 'non-mesure';

const STATUTS: Record<Statut, { icone: LucideIcon; mot: string; teinte: string; fond: string }> = {
  conforme: { icone: CircleCheck, mot: 'Conforme', teinte: 'var(--pc-conforme)', fond: 'var(--pc-conforme-fond)' },
  'en-retard': { icone: Clock, mot: 'En retard', teinte: 'var(--pc-retard)', fond: 'var(--pc-retard-fond)' },
  serieux: { icone: TriangleAlert, mot: 'Sérieux', teinte: 'var(--pc-serieux)', fond: 'var(--pc-serieux-fond)' },
  'hors-seuil': { icone: OctagonX, mot: 'Hors seuil', teinte: 'var(--pc-hors-seuil)', fond: 'var(--pc-hors-seuil-fond)' },
  'non-mesure': { icone: CircleDashed, mot: 'Non mesuré', teinte: 'var(--pc-non-mesure)', fond: 'var(--pc-non-mesure-fond)' },
};

export function BadgeStatut({ statut, mot, className }: { statut: Statut; mot?: string; className?: string }) {
  const s = STATUTS[statut];
  const Icone = s.icone;
  return (
    <span
      className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium', className)}
      style={{ color: s.teinte, backgroundColor: s.fond }}
    >
      <Icone className="h-3.5 w-3.5 shrink-0" aria-hidden />
      {mot ?? s.mot}
    </span>
  );
}

// --- Étiquette de catégorie ------------------------------------------------

export type Categorie =
  | 'decision'
  | 'reglement-taxe'
  | 'budget'
  | 'consultation-ouverte'
  | 'droit-aide'
  | 'evenement'
  | 'travaux-voirie'
  | 'alerte'
  | 'avancement-initiative'
  | 'reponse-institution';

export function EtiquetteCategorie({
  categorie,
  libelle,
  className,
}: {
  categorie: Categorie;
  libelle: string;
  className?: string;
}) {
  return (
    <span
      className={cn('etiquette inline-flex items-center', className)}
      style={{ color: `var(--pc-cat-${categorie})` }}
    >
      <span
        aria-hidden
        className="mr-2 inline-block h-2.5 w-2.5 shrink-0"
        style={{ backgroundColor: `var(--pc-cat-${categorie})`, borderRadius: 'var(--pc-marque-rayon)' }}
      />
      {libelle}
    </span>
  );
}

// --- Puce de niveau de pouvoir ---------------------------------------------

export function PuceNiveau({ libelle, className }: { libelle: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-[var(--pc-trait)] bg-[var(--pc-fond-enfonce)] px-2 py-0.5 text-[11px] font-medium text-[var(--pc-encre-douce)]',
        className,
      )}
    >
      {libelle}
    </span>
  );
}

// --- Pastille de pertinence ------------------------------------------------

/**
 * Le score n'est jamais caché : il s'affiche, et l'infobulle donne la phrase
 * exacte qui l'explique. Un score invisible serait un classement déguisé.
 */
export function PastillePertinence({ score, raison }: { score: number; raison: string }) {
  return (
    <span
      title={raison}
      aria-label={`Pertinence ${score} sur 100. ${raison}`}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--pc-trait)] px-2 py-0.5 text-[11px] text-[var(--pc-encre-douce)]"
    >
      <span aria-hidden className="relative inline-block h-2.5 w-2.5 rounded-full bg-[var(--pc-trait-fort)]">
        <span
          className="absolute inset-0 rounded-full bg-[var(--pc-accent)]"
          style={{ clipPath: `inset(${100 - Math.min(100, score)}% 0 0 0)` }}
        />
      </span>
      <span className="chiffre">{score}</span>
    </span>
  );
}

// --- Ligne de source -------------------------------------------------------

export interface SourceAffichee {
  organisme: string;
  url: string;
  dateDonnee: string;
  licence: string;
}

/** Visible sans clic. Règle 1 : aucune information sans source. */
export function LigneSource({ source, className }: { source: SourceAffichee; className?: string }) {
  return (
    <p className={cn('flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11.5px] text-[var(--pc-encre-tenue)]', className)}>
      <span className="font-medium text-[var(--pc-encre-douce)]">{source.organisme}</span>
      <span aria-hidden>·</span>
      <span className="chiffre">{source.dateDonnee}</span>
      <span aria-hidden>·</span>
      <span>{source.licence}</span>
      <span aria-hidden>·</span>
      <a
        href={source.url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 text-[var(--pc-accent)] underline underline-offset-2"
      >
        acte d’origine
        <ExternalLink className="h-3 w-3" aria-hidden />
      </a>
    </p>
  );
}

// --- Nombre héroïque -------------------------------------------------------

/** Un seul par écran. Tout le reste en retrait (§ 3.3). */
export function NombreHeroique({
  valeur,
  unite,
  legende,
  precision,
}: {
  valeur: string;
  unite?: string;
  legende: string;
  precision?: string;
}) {
  return (
    <div>
      <p className="etiquette text-[var(--pc-encre-tenue)]">{legende}</p>
      {/*
        La taille est posée en style en ligne plutôt qu'en classe utilitaire :
        `clamp()` n'est pas reconnu comme une taille de police par le moteur de
        classes, et le nombre héroïque retombait silencieusement à la taille du
        texte courant. Un seul nombre par écran mérite d'être sûr.
      */}
      <p className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="nombre-heroique" style={{ fontSize: 'clamp(2.75rem, 9vw, 4.75rem)' }}>
          {valeur}
        </span>
        {unite ? (
          <span className="text-[15px] font-medium text-[var(--pc-encre-douce)] sm:text-[17px]">{unite}</span>
        ) : null}
      </p>
      {precision ? <p className="mt-2 max-w-prose text-[13px] text-[var(--pc-encre-douce)]">{precision}</p> : null}
    </div>
  );
}

// --- Bandeaux d'honnêteté --------------------------------------------------

/** Écran non branché : le bandeau reste tant que la donnée n'est pas réelle. */
export function BandeauMaquette({ texte }: { texte: string }) {
  return (
    <div
      role="note"
      className="flex items-start gap-2.5 rounded-[var(--pc-rayon)] border border-dashed border-[var(--pc-retard)] bg-[var(--pc-retard-fond)] px-4 py-3 text-[13px]"
      style={{ color: 'var(--pc-retard)' }}
    >
      <TriangleAlert className="mt-px h-4 w-4 shrink-0" aria-hidden />
      <span>
        <strong className="font-semibold">Maquette — non branché.</strong> {texte}
      </span>
    </div>
  );
}

/** Mode dégradé explicite : « donnée non rafraîchie depuis le … ». */
export function BandeauDegrade({ texte }: { texte: string }) {
  return (
    <div
      role="status"
      className="flex items-start gap-2.5 rounded-[var(--pc-rayon)] border border-[var(--pc-serieux)] bg-[var(--pc-serieux-fond)] px-4 py-3 text-[13px]"
      style={{ color: 'var(--pc-serieux)' }}
    >
      <OctagonX className="mt-px h-4 w-4 shrink-0" aria-hidden />
      <span>{texte}</span>
    </div>
  );
}

/** Quand la donnée n'existe pas : on publie l'absence, avec qui la doit. */
export function AbsenceDeDonnee({
  organismeAttendu,
  depuis,
  explication,
}: {
  organismeAttendu: string;
  depuis: string;
  explication: string;
}) {
  return (
    <div className="rounded-[var(--pc-rayon)] border border-dashed border-[var(--pc-trait-fort)] bg-[var(--pc-fond-enfonce)] px-4 py-4">
      <BadgeStatut statut="non-mesure" mot={`Non mesuré depuis ${depuis}`} />
      <p className="mt-2.5 text-[13px] text-[var(--pc-encre-douce)]">{explication}</p>
      <p className="mt-1.5 text-[12px] text-[var(--pc-encre-tenue)]">
        Organisme qui devrait produire cette donnée : <span className="font-medium">{organismeAttendu}</span>.
      </p>
    </div>
  );
}
