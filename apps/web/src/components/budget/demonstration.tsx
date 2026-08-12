'use client';

import * as React from 'react';
import { FlaskConical } from 'lucide-react';
import { Switch } from '@pc/ui';

/**
 * L'interrupteur des données de démonstration.
 *
 * « Ne mets pas de données de démonstration dans un filtre : interrupteur
 * dédié et badge. » C'est exactement ce que fait ce composant — un
 * interrupteur qui ne partage rien avec le filtrage thématique, et un badge
 * sur chaque objet concerné.
 *
 * Par défaut, la démonstration est **visible** : une section vide sans
 * explication serait moins honnête qu'une section pleine et étiquetée. Mais on
 * peut la masquer d'un clic, et alors l'écran montre ce que la plateforme
 * possède réellement, c'est-à-dire rien.
 */
export function InterrupteurDemonstration({
  visible,
  onChange,
  quoi,
}: {
  visible: boolean;
  onChange: (v: boolean) => void;
  quoi: string;
}) {
  return (
    <label className="flex flex-wrap items-center gap-2.5 rounded-[var(--pc-rayon)] border border-dashed border-[var(--pc-trait-fort)] bg-[var(--pc-fond-enfonce)] px-3.5 py-2.5 text-[12.5px]">
      <FlaskConical className="h-4 w-4 shrink-0 text-[var(--pc-encre-tenue)]" aria-hidden />
      <span className="flex-1 text-[var(--pc-encre-douce)]">
        {quoi} — aucune source publique ne fournit ces données. Interrupteur dédié : ce réglage ne touche à aucun
        autre filtre.
      </span>
      <Switch checked={visible} onCheckedChange={onChange} aria-label="Afficher les données de démonstration" />
    </label>
  );
}

/** Le badge porté par chaque objet de démonstration. */
export function BadgeDemonstration() {
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1 rounded-full border border-dashed px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide"
      style={{ color: 'var(--pc-retard)', borderColor: 'var(--pc-retard)' }}
    >
      <FlaskConical className="h-3 w-3" aria-hidden />
      démonstration
    </span>
  );
}

export function useDemonstration(): [boolean, (v: boolean) => void] {
  return React.useState(true);
}
