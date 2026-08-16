import { LIBELLE_STATUT, type StatutValeur } from '@pc/core';
import { cn } from '@pc/ui';

/**
 * Le statut d'une valeur, visible sans survol.
 *
 * Règle du dispositif : toute valeur affichée porte son statut — déclaré,
 * calculé, forfait, publié, hypothèse. Un nombre sans statut ne se rend pas.
 *
 * Le forfait est en teinte d'alerte parce qu'il signale une absence de
 * déclaration, et l'hypothèse en pointillé parce qu'elle n'engage personne.
 */

const TEINTE: Record<StatutValeur, { couleur: string; fond: string; tirets?: boolean }> = {
  declare: { couleur: 'var(--pc-conforme)', fond: 'var(--pc-conforme-fond)' },
  calcule: { couleur: 'var(--pc-accent)', fond: 'var(--pc-accent-doux)' },
  forfait: { couleur: 'var(--pc-retard)', fond: 'var(--pc-retard-fond)' },
  publie: { couleur: 'var(--pc-encre-douce)', fond: 'var(--pc-fond-enfonce)' },
  hypothese: { couleur: 'var(--pc-serieux)', fond: 'var(--pc-serieux-fond)', tirets: true },
};

export function PuceStatut({ statut, className }: { statut: StatutValeur; className?: string }) {
  const t = TEINTE[statut];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide',
        t.tirets && 'border border-dashed',
        className,
      )}
      style={{ color: t.couleur, backgroundColor: t.fond, borderColor: t.couleur }}
    >
      {LIBELLE_STATUT[statut]}
    </span>
  );
}

/** Étiquette d'une donnée inventée. Le code la porte, l'écran aussi. */
export function BadgeFictif({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-dashed px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide',
        className,
      )}
      style={{ color: 'var(--pc-retard)', borderColor: 'var(--pc-retard)' }}
    >
      donnée fictive
    </span>
  );
}
