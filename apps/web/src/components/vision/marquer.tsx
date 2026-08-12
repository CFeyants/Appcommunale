'use client';

import { Star } from 'lucide-react';
import { cn } from '@pc/ui';
import { usePreferences } from '@/lib/preferences';

/**
 * « Cet objectif compte pour moi ».
 *
 * Le marquage vit dans le stockage local, et nulle part ailleurs. Il n'est pas
 * envoyé, pas agrégé, pas publié — c'est ce qui distingue ce bouton d'un
 * sondage. La plateforme ne mesure pas l'opinion.
 */
export function MarquerObjectif({ id, libelle, aide }: { id: string; libelle: string; aide: string }) {
  const { preferences, majPreferences, pret } = usePreferences();
  if (!pret) return null;
  const marque = preferences.objectifsQuiComptent.includes(id);

  return (
    <button
      type="button"
      title={aide}
      aria-pressed={marque}
      onClick={() =>
        majPreferences((p) => ({
          ...p,
          objectifsQuiComptent: marque
            ? p.objectifsQuiComptent.filter((x) => x !== id)
            : [...p.objectifsQuiComptent, id],
        }))
      }
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px]',
        marque
          ? 'border-[var(--pc-accent)] text-[var(--pc-accent)]'
          : 'border-[var(--pc-trait)] text-[var(--pc-encre-tenue)] hover:border-[var(--pc-trait-fort)]',
      )}
    >
      <Star className="h-3.5 w-3.5" fill={marque ? 'currentColor' : 'none'} aria-hidden />
      {libelle}
    </button>
  );
}
