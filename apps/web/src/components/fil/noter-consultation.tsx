'use client';

import * as React from 'react';
import type { Theme } from '@pc/core';
import { usePreferences } from '@/lib/preferences';

/**
 * L'unique endroit où une consultation est observée.
 *
 * Le composant ne rend rien. Il appelle `noterConsultation`, qui ne fait rien
 * du tout tant que le consentement B n'est pas accordé — et qui refuse par
 * construction tout ce qui touche une catégorie sensible.
 *
 * Le concentrer en un seul composant est délibéré : c'est ce qui permet de
 * vérifier, en une recherche, qu'il n'existe aucun autre point de collecte
 * dans l'application.
 */
export function NoterConsultation({ themes, titre }: { themes: Theme[]; titre: string }) {
  const { noterConsultation } = usePreferences();

  React.useEffect(() => {
    for (const theme of themes) {
      noterConsultation(theme, titre, 'une fiche consultée sur ce thème');
    }
  }, [themes, titre, noterConsultation]);

  return null;
}
