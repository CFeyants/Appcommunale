'use client';

/**
 * Les préférences vivent côté client tant qu'aucun compte n'existe.
 *
 * Rien n'est envoyé au serveur : ni les thèmes suivis, ni la situation
 * déclarée, ni les objectifs marqués. C'est ce qui permet de dire, sans
 * asterisque, qu'aucun compte n'est requis pour lire.
 */

import * as React from 'react';
import {
  PREFERENCES_PAR_DEFAUT,
  observer,
  purgerTraces,
  type AttributDeduit,
  type Preferences,
  type SessionCitoyen,
} from '@pc/core';
import type { Theme } from '@pc/core';

const CLE_PREFERENCES = 'pc-preferences';
const CLE_SESSION = 'pc-session';
const CLE_ATTRIBUTS = 'pc-attributs-deduits';

interface Contexte {
  preferences: Preferences;
  session: SessionCitoyen | null;
  attributs: AttributDeduit[];
  pret: boolean;
  majPreferences: (maj: (p: Preferences) => Preferences) => void;
  ouvrirSession: (s: SessionCitoyen) => void;
  fermerSession: () => void;
  /** Appelée à la consultation d'une fiche. Ne fait rien sans consentement B. */
  noterConsultation: (theme: Theme, libelle: string, produitPar: string) => void;
  supprimerAttribut: (id: string) => void;
  toutOublier: () => void;
}

const Ctx = React.createContext<Contexte | null>(null);

function lire<T>(cle: string, defaut: T): T {
  if (typeof window === 'undefined') return defaut;
  try {
    const brut = window.localStorage.getItem(cle);
    return brut ? (JSON.parse(brut) as T) : defaut;
  } catch {
    return defaut;
  }
}

export function FournisseurPreferences({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = React.useState<Preferences>(PREFERENCES_PAR_DEFAUT);
  const [session, setSession] = React.useState<SessionCitoyen | null>(null);
  const [attributs, setAttributs] = React.useState<AttributDeduit[]>([]);
  const [pret, setPret] = React.useState(false);

  React.useEffect(() => {
    setPreferences(lire(CLE_PREFERENCES, PREFERENCES_PAR_DEFAUT));
    setSession(lire<SessionCitoyen | null>(CLE_SESSION, null));
    // La purge des quatre-vingt-dix jours s'exécute à chaque ouverture, pas
    // seulement à l'écriture : sinon un utilisateur absent trois mois
    // retrouverait ses traces intactes.
    setAttributs(purgerTraces(lire<AttributDeduit[]>(CLE_ATTRIBUTS, [])));
    setPret(true);
  }, []);

  const ecrire = React.useCallback((cle: string, valeur: unknown) => {
    try {
      window.localStorage.setItem(cle, JSON.stringify(valeur));
    } catch {
      /* stockage plein ou refusé : les préférences restent en mémoire de session */
    }
  }, []);

  const majPreferences = React.useCallback(
    (maj: (p: Preferences) => Preferences) => {
      setPreferences((p) => {
        const suivant = maj(p);
        ecrire(CLE_PREFERENCES, suivant);
        // Retirer le consentement B efface immédiatement ce qu'il avait produit.
        if (!suivant.consentements.deduction.accorde) {
          setAttributs([]);
          ecrire(CLE_ATTRIBUTS, []);
        }
        return suivant;
      });
    },
    [ecrire],
  );

  const ouvrirSession = React.useCallback(
    (s: SessionCitoyen) => {
      setSession(s);
      ecrire(CLE_SESSION, s);
    },
    [ecrire],
  );

  const fermerSession = React.useCallback(() => {
    setSession(null);
    try {
      window.localStorage.removeItem(CLE_SESSION);
    } catch {
      /* ignoré */
    }
  }, []);

  const noterConsultation = React.useCallback(
    (theme: Theme, libelle: string, produitPar: string) => {
      if (!preferences.consentements.deduction.accorde) return;
      setAttributs((a) => {
        const suivant = purgerTraces(
          observer(a, { theme, libelle, produitPar, date: new Date().toISOString() }),
        );
        ecrire(CLE_ATTRIBUTS, suivant);
        return suivant;
      });
    },
    [preferences.consentements.deduction.accorde, ecrire],
  );

  const supprimerAttribut = React.useCallback(
    (id: string) => {
      setAttributs((a) => {
        const suivant = a.filter((x) => x.id !== id);
        ecrire(CLE_ATTRIBUTS, suivant);
        return suivant;
      });
    },
    [ecrire],
  );

  const toutOublier = React.useCallback(() => {
    setPreferences(PREFERENCES_PAR_DEFAUT);
    setAttributs([]);
    setSession(null);
    try {
      [CLE_PREFERENCES, CLE_SESSION, CLE_ATTRIBUTS].forEach((c) => window.localStorage.removeItem(c));
    } catch {
      /* ignoré */
    }
  }, []);

  const valeur = React.useMemo<Contexte>(
    () => ({
      preferences,
      session,
      attributs,
      pret,
      majPreferences,
      ouvrirSession,
      fermerSession,
      noterConsultation,
      supprimerAttribut,
      toutOublier,
    }),
    [preferences, session, attributs, pret, majPreferences, ouvrirSession, fermerSession, noterConsultation, supprimerAttribut, toutOublier],
  );

  return <Ctx.Provider value={valeur}>{children}</Ctx.Provider>;
}

export function usePreferences(): Contexte {
  const c = React.useContext(Ctx);
  if (!c) throw new Error('usePreferences doit être appelé sous FournisseurPreferences');
  return c;
}
