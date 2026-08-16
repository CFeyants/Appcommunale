'use client';

import * as React from 'react';
import { Layers, RefreshCw, Save, Trash2 } from 'lucide-react';
import { Button, cn } from '@pc/ui';
import type { ValeurCarbone } from '@pc/core';
import { formaterEuros, formaterNombre, type Locale } from '@/i18n';
import { MARCHES_ENTREPRISE } from '@/contenu/entreprise';
import { BadgeFictif } from '@/components/achats/puce-statut';

/**
 * Le simulateur — l'écran qui décide des investissements.
 *
 * Il ne modélise pas un seul instrument, mais quatre, **dans l'ordre de
 * puissance croissante**, et l'interface rend cet ordre visible : c'est le
 * résultat le plus utile du dispositif.
 *
 *   1. Le critère d'attribution pondère — il déplace un classement à la marge.
 *   2. La spécification technique élimine — le prix marchande, la norme tranche.
 *   3. La demande décide avant l'achat — quand le cahier des charges s'écrit,
 *      l'essentiel de l'impact est déjà fixé.
 *   4. Le stock bat le flux — un gain sur un marché se remet à zéro chaque
 *      année, un gain sur le bâti s'accumule.
 */

type CleInstrument = 'ponderation' | 'specification' | 'demande' | 'stock';

const INSTRUMENTS: Array<{ cle: CleInstrument; rang: number; titre: string; ceQueCaFait: string }> = [
  {
    cle: 'ponderation',
    rang: 1,
    titre: 'Le critère d’attribution pondère',
    ceQueCaFait:
      'Il déplace un classement à la marge. Une entreprise médiocre qui casse son prix de sept pour cent l’emporte quand même.',
  },
  {
    cle: 'specification',
    rang: 2,
    titre: 'La spécification technique élimine',
    ceQueCaFait:
      'Écrire « enrobé tiède » retire cent pour cent de l’enrobé chaud du champ ; le pondérer à six pour cent en retire peut-être vingt. Le prix marchande, la norme tranche.',
  },
  {
    cle: 'demande',
    rang: 3,
    titre: 'La demande décide avant l’achat',
    ceQueCaFait:
      'Rénover plutôt que reconstruire, prolonger plutôt que remplacer. Quand le cahier des charges s’écrit, l’essentiel de l’impact est déjà fixé.',
  },
  {
    cle: 'stock',
    rang: 4,
    titre: 'Le stock bat le flux',
    ceQueCaFait:
      'Un gain sur un marché se remet à zéro chaque année ; un gain sur le bâti s’accumule. Sur vingt ans, l’écart devient un facteur vingt.',
  },
];

interface Levier {
  cle: string;
  libelle: string;
  instrument: CleInstrument;
  /** Réduction de l'impact annuel, en euros. */
  gainAnnuelEur: number;
  /** Coût de la mesure, pour le délai de retour. Zéro quand le levier est gratuit. */
  coutEur: number;
  detail: string;
  limites?: string;
}

const LEVIERS: Levier[] = [
  {
    cle: 'ponderation-offre',
    libelle: 'Améliorer son offre de 5 % sur le critère environnemental',
    instrument: 'ponderation',
    gainAnnuelEur: 3_900,
    coutEur: 0,
    detail:
      'Le critère pèse six pour cent de la note. Cinq pour cent de mieux dessus déplacent l’offre de trois dixièmes de point.',
  },
  {
    cle: 'enrobe-tiede',
    libelle: 'Spécifier un enrobé tiède au lieu d’un enrobé chaud',
    instrument: 'specification',
    gainAnnuelEur: 21_600,
    coutEur: 34_000,
    detail:
      'Le facteur passe de 58 à 44 kg CO₂e par tonne. La spécification retire l’enrobé chaud du champ : elle ne se marchande pas.',
  },
  {
    cle: 'beton-plafond',
    libelle: 'Plafond d’empreinte par mètre cube de béton, par classe d’exposition',
    instrument: 'specification',
    gainAnnuelEur: 14_200,
    coutEur: 9_000,
    detail:
      'Sur le modèle de l’accord béton néerlandais : 157, 169, 183 et 202 kg CO₂e/m³ en 2025 selon l’exposition, et 133, 143, 155 et 171 en 2027. Aucun équivalent n’existe dans la commande publique belge.',
    limites:
      'Un gain obtenu par substitution de liant est fragile : deux tiers des émissions du clinker sont chimiques et ne dépendent ni du combustible ni du réseau électrique, le facteur clinker belge est déjà bas parce que le marché est majoritairement en ciment de haut fourneau, et la ressource qui le permet — le laitier sidérurgique — décline. Un plafond par mètre cube tient là où un choix de type de ciment ne tient pas.',
  },
  {
    cle: 'age-resistance',
    libelle: 'Clause d’âge de résistance à 56 jours au lieu de 28',
    instrument: 'specification',
    gainAnnuelEur: 4_700,
    coutEur: 0,
    detail:
      'La norme béton européenne fixe vingt-huit jours par défaut mais permet expressément un autre âge. Passer à cinquante-six laisse aux liants substitués le temps de réagir : quinze à vingt kilos de ciment en moins par mètre cube, soit cinq à dix kilos de carbone. Levier gratuit, contractuel, disponible aujourd’hui.',
    limites:
      'Inadapté au décoffrage précoce, aux charges de construction élevées et aux éléments minces à séchage rapide. Recommander la clause sans ces limites serait faux.',
  },
  {
    cle: 'camions',
    libelle: 'Remplacer deux camions par des modèles récents',
    instrument: 'ponderation',
    gainAnnuelEur: 8_100,
    coutEur: 190_000,
    detail: 'Réduction de la consommation des engins de chantier sur l’ensemble des marchés.',
  },
  {
    cle: 'reparer',
    libelle: 'Réparer la chaussée plutôt que la refaire, sur un tiers des interventions',
    instrument: 'demande',
    gainAnnuelEur: 47_300,
    coutEur: 0,
    detail:
      'Le plus gros gain de la liste, et le seul qui ne s’achète pas : il s’écrit dans le cahier des charges, avant l’appel d’offres. Ne pas faire le marché de la même façon bat le faire mieux.',
  },
  {
    cle: 'atelier',
    libelle: 'Isoler l’atelier et le dépôt',
    instrument: 'stock',
    gainAnnuelEur: 6_400,
    coutEur: 78_000,
    detail:
      'Gain modeste la première année, mais il se répète sans être refait. C’est la différence entre un stock et un flux.',
  },
];

interface Scenario {
  nom: string;
  leviers: string[];
}

export function Simulateur({
  locale,
  trajectoire,
  annee,
}: {
  locale: Locale;
  trajectoire: ValeurCarbone[];
  annee: number;
}) {
  const [actifs, setActifs] = React.useState<string[]>([]);
  const [scenarios, setScenarios] = React.useState<Scenario[]>([]);

  const basculer = (cle: string) =>
    setActifs((a) => (a.includes(cle) ? a.filter((x) => x !== cle) : [...a, cle]));

  const retenus = LEVIERS.filter((x) => actifs.includes(x.cle));
  const gain = retenus.reduce((s, x) => s + x.gainAnnuelEur, 0);
  const cout = retenus.reduce((s, x) => s + x.coutEur, 0);
  const retourAnnees = gain > 0 ? cout / gain : null;

  const impactActuel = MARCHES_ENTREPRISE.filter((m) => !m.sousLeSeuil).reduce(
    (s, m) => s + m.impactAvecValeursDeclarees,
    0,
  );
  const impactApres = Math.max(0, impactActuel - gain);

  // La trajectoire de la référence : ce qui est rentable aujourd'hui peut ne
  // plus l'être dans trois ans, et l'inverse.
  const facteurTrajectoire = trajectoire.at(-1)!.euroParTonne / trajectoire[0]!.euroParTonne;

  const enregistrer = () => {
    if (actifs.length === 0 || scenarios.length >= 3) return;
    setScenarios((s) => [...s, { nom: `Scénario ${s.length + 1}`, leviers: [...actifs] }]);
  };

  return (
    <div className="space-y-8">
      <header>
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h1 className="text-[24px] font-semibold tracking-tight md:text-[28px]">Le simulateur</h1>
          <BadgeFictif />
        </div>
        <p className="mt-1.5 max-w-prose text-[13.5px] text-[var(--pc-encre-douce)]">
          Modifiez un paramètre et voyez le nouveau solde, l’effet sur vos offres en cours, et le délai de retour sur
          investissement. Les leviers sont rangés par <strong>puissance de l’instrument</strong>, pas par taille du
          gain — c’est le résultat le plus utile de ce dispositif.
        </p>
      </header>

      {/* --- Les quatre instruments, dans l'ordre --------------------------- */}
      <ol className="grid gap-2 sm:grid-cols-2">
        {INSTRUMENTS.map((i) => (
          <li key={i.cle} className="rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] px-4 py-3">
            <p className="flex items-baseline gap-2 text-[13.5px] font-medium">
              <span
                aria-hidden
                className="chiffre grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10.5px] font-bold text-white"
                style={{ background: `color-mix(in oklch, var(--pc-accent) ${25 * i.rang}%, var(--pc-trait-fort))` }}
              >
                {i.rang}
              </span>
              {i.titre}
            </p>
            <p className="mt-1 text-[12.5px] text-[var(--pc-encre-douce)]">{i.ceQueCaFait}</p>
          </li>
        ))}
      </ol>

      {/* --- Le solde ------------------------------------------------------- */}
      <section
        className="rounded-[var(--pc-rayon)] border px-5 py-4"
        style={{ borderColor: 'var(--pc-accent)', background: 'var(--pc-accent-doux)' }}
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-[11.5px] text-[var(--pc-encre-tenue)]">Impact actuel, marchés au-dessus du seuil</p>
            <p className="chiffre mt-0.5 text-[20px] font-semibold">{formaterEuros(impactActuel, locale)}</p>
          </div>
          <div>
            <p className="text-[11.5px] text-[var(--pc-encre-tenue)]">Avec les leviers retenus</p>
            <p className="chiffre mt-0.5 text-[20px] font-semibold" style={{ color: 'var(--pc-conforme)' }}>
              {formaterEuros(impactApres, locale)}
            </p>
          </div>
          <div>
            <p className="text-[11.5px] text-[var(--pc-encre-tenue)]">Délai de retour</p>
            <p className="chiffre mt-0.5 text-[20px] font-semibold">
              {retourAnnees === null
                ? '—'
                : retourAnnees === 0
                  ? 'immédiat'
                  : `${formaterNombre(retourAnnees, locale, 1)} ans`}
            </p>
          </div>
        </div>
        {cout > 0 && (
          <p className="mt-3 text-[12.5px] text-[var(--pc-encre-douce)]">
            {formaterEuros(cout, locale)} d’investissement pour {formaterEuros(gain, locale)} de gain annuel.
          </p>
        )}
        <p className="mt-2 text-[12px] text-[var(--pc-encre-tenue)]">
          La valeur du carbone passe de {trajectoire[0]!.euroParTonne} €/t en {annee} à{' '}
          {trajectoire.at(-1)!.euroParTonne} €/t en {trajectoire.at(-1)!.annee}, soit un facteur{' '}
          {formaterNombre(facteurTrajectoire, locale, 2)}. Un investissement rentable contre la référence
          d’aujourd’hui peut ne plus l’être contre celle de {trajectoire.at(-1)!.annee} — et l’inverse est vrai aussi.
        </p>
      </section>

      {/* --- Les leviers ---------------------------------------------------- */}
      <section aria-labelledby="leviers">
        <h2 id="leviers" className="text-[18px] font-semibold tracking-tight">
          Les leviers
        </h2>
        <ul className="mt-3 space-y-2.5">
          {[...LEVIERS]
            .sort(
              (a, b) =>
                INSTRUMENTS.find((i) => i.cle === a.instrument)!.rang -
                INSTRUMENTS.find((i) => i.cle === b.instrument)!.rang,
            )
            .map((levier) => {
              const instrument = INSTRUMENTS.find((i) => i.cle === levier.instrument)!;
              const actif = actifs.includes(levier.cle);
              return (
                <li key={levier.cle}>
                  <label
                    className={cn(
                      'block cursor-pointer rounded-[var(--pc-rayon)] border px-4 py-3 transition-colors',
                      actif ? 'border-[var(--pc-accent)] bg-[var(--pc-accent-doux)]' : 'border-[var(--pc-trait)]',
                    )}
                  >
                    <div className="flex flex-wrap items-start gap-3">
                      <input
                        type="checkbox"
                        checked={actif}
                        onChange={() => basculer(levier.cle)}
                        className="mt-1 h-4 w-4 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="flex flex-wrap items-baseline gap-x-2 text-[13.5px] font-medium">
                          {levier.libelle}
                          <span
                            className="chiffre rounded-full px-1.5 text-[10px] font-semibold text-white"
                            style={{
                              background: `color-mix(in oklch, var(--pc-accent) ${25 * instrument.rang}%, var(--pc-trait-fort))`,
                            }}
                          >
                            instrument {instrument.rang}
                          </span>
                        </p>
                        <p className="mt-1 text-[12.5px] text-[var(--pc-encre-douce)]">{levier.detail}</p>
                        {levier.limites && (
                          <p className="mt-1.5 text-[12px]" style={{ color: 'var(--pc-serieux)' }}>
                            <span className="font-medium">Limites.</span> {levier.limites}
                          </p>
                        )}
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="chiffre text-[14px] font-semibold" style={{ color: 'var(--pc-conforme)' }}>
                          −{formaterEuros(levier.gainAnnuelEur, locale)}
                        </p>
                        <p className="chiffre text-[11.5px] text-[var(--pc-encre-tenue)]">
                          {levier.coutEur === 0 ? 'gratuit' : formaterEuros(levier.coutEur, locale)}
                        </p>
                      </div>
                    </div>
                  </label>
                </li>
              );
            })}
        </ul>
      </section>

      {/* --- Trois scénarios conservables ----------------------------------- */}
      <section aria-labelledby="scenarios">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="scenarios" className="text-[18px] font-semibold tracking-tight">
            Scénarios conservés
          </h2>
          <div className="flex gap-2">
            <Button variant="contour" taille="sm" onClick={enregistrer} disabled={actifs.length === 0 || scenarios.length >= 3}>
              <Save className="h-3.5 w-3.5" />
              Conserver ce scénario
            </Button>
            {scenarios.length > 0 && (
              <Button variant="contour" taille="sm" onClick={() => setScenarios([])}>
                <Trash2 className="h-3.5 w-3.5" />
                Effacer
              </Button>
            )}
          </div>
        </div>

        {scenarios.length === 0 ? (
          <p className="mt-3 rounded-[var(--pc-rayon)] border border-dashed border-[var(--pc-trait-fort)] px-4 py-6 text-center text-[13px] text-[var(--pc-encre-tenue)]">
            Aucun scénario conservé. Cochez des leviers, puis conservez — jusqu’à trois, côte à côte.
          </p>
        ) : (
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {scenarios.map((s) => {
              const l = LEVIERS.filter((x) => s.leviers.includes(x.cle));
              const g = l.reduce((a, x) => a + x.gainAnnuelEur, 0);
              const c = l.reduce((a, x) => a + x.coutEur, 0);
              return (
                <div key={s.nom} className="rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] px-4 py-3">
                  <p className="text-[13.5px] font-medium">{s.nom}</p>
                  <p className="chiffre mt-1 text-[16px] font-semibold" style={{ color: 'var(--pc-conforme)' }}>
                    −{formaterEuros(g, locale)}
                  </p>
                  <p className="chiffre text-[11.5px] text-[var(--pc-encre-tenue)]">
                    {c === 0 ? 'gratuit' : `${formaterEuros(c, locale)} · retour ${formaterNombre(c / g, locale, 1)} ans`}
                  </p>
                  <ul className="mt-2 space-y-0.5 text-[11.5px] text-[var(--pc-encre-douce)]">
                    {l.map((x) => (
                      <li key={x.cle}>· {x.libelle}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* --- Stock contre flux, sur vingt ans -------------------------------- */}
      <section aria-labelledby="vingt-ans">
        <h2 id="vingt-ans" className="text-[18px] font-semibold tracking-tight">
          Sur vingt ans, le stock bat le flux
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] px-4 py-3">
            <p className="flex items-center gap-2 text-[13px] font-medium">
              <RefreshCw className="h-3.5 w-3.5 text-[var(--pc-encre-tenue)]" aria-hidden />
              Gain sur un marché
            </p>
            <p className="mt-1 text-[12.5px] text-[var(--pc-encre-douce)]">
              À refaire à chaque renouvellement. Si le marché change de titulaire ou de cahier des charges, le gain
              disparaît.
            </p>
          </div>
          <div className="rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] px-4 py-3">
            <p className="flex items-center gap-2 text-[13px] font-medium">
              <Layers className="h-3.5 w-3.5 text-[var(--pc-encre-tenue)]" aria-hidden />
              Gain sur le bâti
            </p>
            <p className="mt-1 text-[12.5px] text-[var(--pc-encre-douce)]">
              Acquis une fois, il se répète chaque année sans être refait. Sur vingt ans, l’écart devient un facteur
              vingt.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
