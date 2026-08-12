'use client';

import * as React from 'react';
import { Lock, Trash2 } from 'lucide-react';
import { Button, Separator } from '@pc/ui';
import type { Dictionnaire, Locale } from '@/i18n';
import { formaterNombre } from '@/i18n';

/**
 * Mes indicateurs personnels.
 *
 * Privés, locaux, non comparatifs, non partagés. Ils vivent dans le stockage
 * du navigateur, ne sont jamais envoyés, et ne sont comparés à personne.
 *
 * Ce qui est délibérément absent : pas de score, pas de série de jours, pas de
 * badge, pas de classement entre citoyens, pas de synchronisation par défaut.
 * Un indicateur personnel qui se compare devient un jeu, et un jeu capte du
 * temps au lieu d'en rendre.
 */

const CLE = 'pc-mes-indicateurs';

interface Saisie {
  chauffageKwhAn?: number;
  electriciteKwhAn?: number;
  kmVoitureAn?: number;
  volsCourtsAn?: number;
}

const CHAMPS: Array<{ cle: keyof Saisie; libelle: string; unite: string; aide: string }> = [
  {
    cle: 'chauffageKwhAn',
    libelle: 'Chauffage',
    unite: 'kWh par an',
    aide: 'Le chiffre figure sur votre décompte annuel de gaz ou de mazout.',
  },
  {
    cle: 'electriciteKwhAn',
    libelle: 'Électricité',
    unite: 'kWh par an',
    aide: 'Relevé annuel de votre fournisseur.',
  },
  { cle: 'kmVoitureAn', libelle: 'Voiture', unite: 'km par an', aide: 'Différence entre deux contrôles techniques.' },
  { cle: 'volsCourtsAn', libelle: 'Vols', unite: 'trajets par an', aide: 'Nombre de vols aller-retour.' },
];

export function MesIndicateurs({ d, locale }: { d: Dictionnaire; locale: Locale }) {
  const [saisie, setSaisie] = React.useState<Saisie>({});
  const [pret, setPret] = React.useState(false);

  React.useEffect(() => {
    try {
      setSaisie(JSON.parse(localStorage.getItem(CLE) ?? '{}'));
    } catch {
      /* stockage indisponible : la saisie reste en mémoire */
    }
    setPret(true);
  }, []);

  const enregistrer = (s: Saisie) => {
    setSaisie(s);
    try {
      localStorage.setItem(CLE, JSON.stringify(s));
    } catch {
      /* ignoré */
    }
  };

  const renseignes = Object.values(saisie).filter((v) => typeof v === 'number' && v > 0).length;

  return (
    <section className="mt-10" aria-labelledby="mes-indicateurs">
      <h2 id="mes-indicateurs" className="text-[19px] font-semibold tracking-tight">
        {d.impact.mesIndicateurs}
      </h2>
      <p className="mt-1.5 flex max-w-prose items-start gap-2 text-[13.5px] text-[var(--pc-encre-douce)]">
        <Lock className="mt-0.5 h-4 w-4 shrink-0 text-[var(--pc-accent)]" aria-hidden />
        {d.impact.privesLocaux}
      </p>

      {pret && (
        <>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {CHAMPS.map((c) => (
              <label key={c.cle} className="carte block px-4 py-3.5">
                <span className="text-[13.5px] font-medium">{c.libelle}</span>
                <span className="mt-2 flex items-baseline gap-2">
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={saisie[c.cle] ?? ''}
                    onChange={(e) =>
                      enregistrer({ ...saisie, [c.cle]: e.target.value === '' ? undefined : Number(e.target.value) })
                    }
                    className="chiffre h-9 w-32 rounded-[var(--pc-rayon)] border border-[var(--pc-trait-fort)] bg-[var(--pc-fond-eleve)] px-2.5 text-[14px]"
                  />
                  <span className="text-[12.5px] text-[var(--pc-encre-tenue)]">{c.unite}</span>
                </span>
                <span className="mt-1.5 block text-[12px] text-[var(--pc-encre-tenue)]">{c.aide}</span>
              </label>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <p className="chiffre text-[13px] text-[var(--pc-encre-douce)]">
              {formaterNombre(renseignes, locale)} indicateur{renseignes > 1 ? 's' : ''} renseigné
              {renseignes > 1 ? 's' : ''} sur {CHAMPS.length}.
            </p>
            {renseignes > 0 && (
              <Button variant="contour" taille="sm" onClick={() => enregistrer({})}>
                <Trash2 className="h-3.5 w-3.5" />
                Tout effacer
              </Button>
            )}
          </div>

          <p className="mt-4 max-w-prose text-[12.5px] text-[var(--pc-encre-tenue)]">
            Aucun total, aucun score, aucune conversion en équivalent carbone n’est affiché. Les facteurs d’émission
            varient d’un référentiel à l’autre et la plateforme n’en impose aucun : ce que vous saisissez reste ce que
            vous avez saisi. Rien n’est envoyé, rien n’est comparé à d’autres citoyens.
          </p>
        </>
      )}

      <Separator className="mt-8" />
    </section>
  );
}
