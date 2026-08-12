'use client';

import * as React from 'react';
import { WifiOff } from 'lucide-react';

/**
 * Mode hors ligne : quand le réseau tombe, on le dit.
 *
 * « Un mode dégradé explicite » — mieux vaut afficher que la donnée n'est pas
 * fraîche que montrer une valeur périmée sans le signaler.
 */
export function IndicateurHorsLigne({ texte }: { texte: string }) {
  const [horsLigne, setHorsLigne] = React.useState(false);

  React.useEffect(() => {
    const maj = () => setHorsLigne(!navigator.onLine);
    maj();
    addEventListener('online', maj);
    addEventListener('offline', maj);
    return () => {
      removeEventListener('online', maj);
      removeEventListener('offline', maj);
    };
  }, []);

  React.useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        /* le mode hors ligne est un confort, pas une condition de lecture */
      });
    }
  }, []);

  if (!horsLigne) return null;

  return (
    <div
      role="status"
      className="border-b border-[var(--pc-trait)] bg-[var(--pc-retard-fond)] px-4 py-2 text-center text-[12.5px]"
      style={{ color: 'var(--pc-retard)' }}
    >
      <WifiOff className="mr-1.5 inline h-3.5 w-3.5" aria-hidden />
      {texte}
    </div>
  );
}
