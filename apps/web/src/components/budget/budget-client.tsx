'use client';

import * as React from 'react';
import { RotateCcw, X } from 'lucide-react';
import { BarreUnique, CadreGraphique, Button, cn, type Part } from '@pc/ui';
import type { Dictionnaire, Locale } from '@/i18n';
import { formaterEuros, formaterNombre } from '@/i18n';
import { EXPLICATIONS_COFOG } from '@/contenu/budget';

/**
 * Le budget, rendu manipulable.
 *
 * Quatre manipulations, toutes réversibles d'un seul bouton :
 *   — changer d'exercice ;
 *   — basculer entre montant absolu et montant par habitant ;
 *   — changer de niveau de pouvoir (les sous-secteurs d'Eurostat se lisent
 *     exactement comme nos cinq niveaux) ;
 *   — dérouler une fonction en ses sous-lignes.
 *
 * Et surtout : tout chiffre est cliquable, et le clic explique.
 */

export interface Fonction {
  code: string;
  libelle: string;
  principale: boolean;
  montantMillionsEur: number;
}
export interface Secteur {
  code: string;
  libelle: string;
  total: number;
  fonctions: Fonction[];
}
export interface Exercice {
  annee: number;
  secteurs: Secteur[];
}

const COULEURS = [
  'var(--pc-serie-1)',
  'var(--pc-serie-2)',
  'var(--pc-serie-3)',
  'var(--pc-serie-4)',
  'var(--pc-serie-5)',
  'var(--pc-serie-6)',
  'var(--pc-serie-7)',
  'var(--pc-serie-8)',
  'var(--pc-cat-budget)',
  'var(--pc-cat-evenement)',
];

const LIBELLE_NIVEAU: Record<string, string> = {
  S13: 'Tous niveaux confondus',
  S1311: 'Belgique — administration centrale',
  S1312: 'Communautés et Régions',
  S1313: 'Communes, provinces et CPAS',
};

export function BudgetClient({
  exercices,
  population,
  d,
  locale,
}: {
  exercices: Exercice[];
  population: { valeur: number; annee: number } | null;
  d: Dictionnaire;
  locale: Locale;
}) {
  const INITIAL = { annee: exercices.at(-1)?.annee ?? 0, secteur: 'S13', parHabitant: false, deroule: null as string | null };
  const [vue, setVue] = React.useState(INITIAL);
  const [explique, setExplique] = React.useState<string | null>(null);

  const exercice = exercices.find((e) => e.annee === vue.annee) ?? exercices.at(-1)!;
  const secteur = exercice.secteurs.find((s) => s.code === vue.secteur) ?? exercice.secteurs[0]!;

  const diviseur = vue.parHabitant && population ? population.valeur / 1e6 : 1;
  const unite = vue.parHabitant ? '€ par habitant' : 'millions d’euros';
  const format = (n: number) =>
    vue.parHabitant ? formaterEuros(n / diviseur, locale, 0) : `${formaterNombre(n, locale, 0)} M€`;

  const principales = secteur.fonctions.filter((f) => f.principale);
  const sousLignes = vue.deroule
    ? secteur.fonctions.filter((f) => !f.principale && f.code.startsWith(vue.deroule!) && f.code.length === 6)
    : [];

  const affichees = sousLignes.length > 0 ? sousLignes : principales;

  const parts: Part[] = affichees.map((f, i) => ({
    cle: f.code,
    libelle: f.libelle,
    valeur: Math.max(0, f.montantMillionsEur),
    couleur: COULEURS[i % COULEURS.length]!,
  }));

  const modifiee =
    vue.annee !== INITIAL.annee || vue.secteur !== INITIAL.secteur || vue.parHabitant || vue.deroule !== null;

  const fonctionExpliquee = explique ? secteur.fonctions.find((f) => f.code === explique) : null;
  const explication = fonctionExpliquee ? EXPLICATIONS_COFOG[fonctionExpliquee.code.slice(0, 4)] : null;

  return (
    <>
      {/* --- Les manipulations ------------------------------------------- */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Groupe label={d.budget.exercice}>
          {exercices.map((e) => (
            <Choix key={e.annee} actif={e.annee === vue.annee} onClick={() => setVue((v) => ({ ...v, annee: e.annee }))}>
              {e.annee}
            </Choix>
          ))}
        </Groupe>

        <Groupe label="Niveau">
          {exercice.secteurs.map((s) => (
            <Choix
              key={s.code}
              actif={s.code === vue.secteur}
              onClick={() => setVue((v) => ({ ...v, secteur: s.code, deroule: null }))}
            >
              {LIBELLE_NIVEAU[s.code] ?? s.libelle}
            </Choix>
          ))}
        </Groupe>

        <Groupe label="Unité">
          <Choix actif={!vue.parHabitant} onClick={() => setVue((v) => ({ ...v, parHabitant: false }))}>
            {d.commun.montantTotal}
          </Choix>
          <Choix actif={vue.parHabitant} onClick={() => setVue((v) => ({ ...v, parHabitant: true }))}>
            {d.commun.parHabitant}
          </Choix>
        </Groupe>

        {modifiee && (
          <Button variant="contour" taille="sm" onClick={() => setVue(INITIAL)}>
            <RotateCcw className="h-3.5 w-3.5" />
            {d.commun.revenirVueInitiale}
          </Button>
        )}
      </div>

      {vue.deroule && (
        <p className="mt-3 text-[13px]">
          Vous regardez le détail de{' '}
          <strong>{secteur.fonctions.find((f) => f.code === vue.deroule)?.libelle}</strong>.{' '}
          <button
            type="button"
            onClick={() => setVue((v) => ({ ...v, deroule: null }))}
            className="text-[var(--pc-accent)] underline underline-offset-2"
          >
            revenir aux dix fonctions
          </button>
        </p>
      )}

      {/* --- La barre unique en parties du tout ---------------------------- */}
      <div className="mt-5">
        <CadreGraphique
          titre={`${d.budget.decomposition} — ${LIBELLE_NIVEAU[secteur.code] ?? secteur.libelle}, ${exercice.annee}`}
          explication={{
            montre: `La dépense totale de ${LIBELLE_NIVEAU[secteur.code]?.toLowerCase() ?? secteur.libelle} en ${exercice.annee}, répartie entre les fonctions de la classification CFAP, en ${unite}.`,
            neMontrePas:
              'Ni le budget voté, ni le budget engagé : Eurostat publie l’exécuté. Ni le budget de votre commune, qui n’est publié dans aucun format ouvert.',
            decisionLocale:
              'À l’échelle d’une commune, l’essentiel de ces montants est imposé par les niveaux supérieurs. Cliquez une fonction : chacune dit ce qui s’y décide localement.',
            prochaineMesure:
              'Les comptes publics sont arrêtés avec environ dix-huit mois de décalage. Le prochain exercice paraîtra à l’automne suivant.',
          }}
          colonnes={[
            { cle: 'fonction', titre: 'Fonction CFAP' },
            { cle: 'code', titre: 'Code' },
            { cle: 'montant', titre: vue.parHabitant ? '€ par habitant' : 'Millions d’euros' },
            { cle: 'part', titre: 'Part du total' },
          ]}
          lignes={affichees.map((f) => ({
            fonction: f.libelle,
            code: f.code,
            montant: vue.parHabitant
              ? Math.round(f.montantMillionsEur / diviseur)
              : Math.round(f.montantMillionsEur),
            part: `${((f.montantMillionsEur / (secteur.total || 1)) * 100).toFixed(1)} %`,
          }))}
          nomFichier={`depenses-${secteur.code}-${exercice.annee}`}
        >
          <BarreUnique
            parts={parts}
            format={format}
            partActive={explique}
            onPartClick={(cle) => setExplique(cle === explique ? null : cle)}
          />
          <p className="mt-4 text-[12.5px] text-[var(--pc-encre-tenue)]">{d.budget.cliquezChiffre}</p>
        </CadreGraphique>
      </div>

      {/* --- Le panneau d'explication -------------------------------------- */}
      {fonctionExpliquee && (
        <div className="mt-4 rounded-[var(--pc-rayon)] border border-[var(--pc-accent)] bg-[var(--pc-fond-eleve)] px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="etiquette text-[var(--pc-encre-tenue)]">
                {fonctionExpliquee.code} · {d.budget.exercice} {exercice.annee}
              </p>
              <p className="chiffre mt-1 text-[22px] font-semibold">{format(fonctionExpliquee.montantMillionsEur)}</p>
            </div>
            <button
              type="button"
              onClick={() => setExplique(null)}
              aria-label={d.commun.fermer}
              className="rounded p-1 text-[var(--pc-encre-tenue)] hover:bg-[var(--pc-fond-enfonce)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <dl className="mt-4 space-y-3 text-[13.5px]">
            <div>
              <dt className="font-semibold">{d.budget.recouvre}</dt>
              <dd className="mt-0.5 text-[var(--pc-encre-douce)]">
                {explication?.recouvre ?? 'Sous-ligne de la fonction principale : voir l’explication de celle-ci.'}
              </dd>
            </div>
            <div>
              <dt className="font-semibold">{d.budget.nomenclature}</dt>
              <dd className="mt-0.5 font-mono text-[12.5px] text-[var(--pc-encre-douce)]">
                {fonctionExpliquee.code} — {fonctionExpliquee.libelle}
              </dd>
            </div>
            <div>
              <dt className="font-semibold">{d.budget.neDitPas}</dt>
              <dd className="mt-0.5 text-[var(--pc-encre-douce)]">{explication?.neDitPas ?? '—'}</dd>
            </div>
            <div>
              <dt className="font-semibold">Ce qui relève de la décision locale</dt>
              <dd className="mt-0.5 text-[var(--pc-encre-douce)]">{explication?.decisionLocale ?? '—'}</dd>
            </div>
            <div>
              <dt className="font-semibold">{d.commun.source}</dt>
              <dd className="mt-0.5 text-[var(--pc-encre-douce)]">
                Eurostat, jeu <code className="font-mono text-[12px]">gov_10a_exp</code>, secteur {secteur.code},
                exercice {exercice.annee}. Réutilisation autorisée — décision 2011/833/UE.
              </dd>
            </div>
          </dl>

          {fonctionExpliquee.principale && (
            <Button
              variant="contour"
              taille="sm"
              className="mt-4"
              onClick={() => {
                setVue((v) => ({ ...v, deroule: fonctionExpliquee.code }));
                setExplique(null);
              }}
            >
              Dérouler cette fonction en sous-lignes
            </Button>
          )}
        </div>
      )}
    </>
  );
}

function Groupe({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="etiquette text-[var(--pc-encre-tenue)]">{label}</span>
      <div className="flex flex-wrap gap-0.5 rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] p-0.5">
        {children}
      </div>
    </div>
  );
}

function Choix({ actif, onClick, children }: { actif: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={actif}
      className={cn(
        'rounded-[6px] px-2.5 py-1 text-[12.5px] transition-colors',
        actif ? 'bg-[var(--pc-accent)] text-white' : 'text-[var(--pc-encre-douce)] hover:bg-[var(--pc-fond-enfonce)]',
      )}
    >
      {children}
    </button>
  );
}
