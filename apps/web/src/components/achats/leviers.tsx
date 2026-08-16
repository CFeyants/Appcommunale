'use client';

import * as React from 'react';
import { CircleDot, Layers, RefreshCw } from 'lucide-react';
import { CadreGraphique, cn } from '@pc/ui';
import type { Dictionnaire, Locale } from '@/i18n';
import { formaterEuros, formaterNombre } from '@/i18n';
import type { Levier } from '@/contenu/achats';
import { BadgeFictif } from './puce-statut';

/**
 * Le classement des leviers.
 *
 * Tous calculés à la même valeur du carbone, rangés par ordre décroissant, en
 * distinguant ce qui se remet à zéro chaque année de ce qui s'accumule.
 *
 * C'est un classement de **gisements**, pas d'entités : il range des postes de
 * la commune et de son territoire, jamais des entreprises ni des personnes.
 * L'interdit du classement porte sur celles-là.
 *
 * Il est affiché avant la liste des marchés, et déplié par défaut. Sans lui, on
 * discute des sacs poubelle pendant que le chauffage tourne.
 */

export interface LevierCalcule {
  levier: Levier;
  montantEur: number;
  tonnes: number;
  chaine: string[];
}

export function ClassementLeviers({
  leviers,
  annee,
  d,
  locale,
}: {
  leviers: LevierCalcule[];
  annee: number;
  d: Dictionnaire;
  locale: Locale;
}) {
  const [perimetre, setPerimetre] = React.useState<'tous' | 'commune'>('tous');
  const [ouvert, setOuvert] = React.useState<string | null>(null);

  const visibles = React.useMemo(() => {
    const filtres = perimetre === 'commune' ? leviers.filter((x) => x.levier.perimetre === 'commune') : leviers;
    // Tri sur des gisements, pas sur des entités : c'est le sens même du bloc.
    return [...filtres].sort((a, b) => b.montantEur - a.montantEur);
  }, [leviers, perimetre]);

  const max = Math.max(...visibles.map((x) => x.montantEur), 1);
  const totalFlux = visibles.filter((x) => x.levier.nature === 'flux').reduce((s, x) => s + x.montantEur, 0);
  const totalStock = visibles.filter((x) => x.levier.nature === 'stock').reduce((s, x) => s + x.montantEur, 0);

  // Le résultat que le bloc existe pour montrer.
  const chauffageCommunal = leviers.find((x) => x.levier.cle === 'gaz-patrimoine');
  const troisAutres = ['voirie', 'repas', 'nettoyage']
    .map((c) => leviers.find((x) => x.levier.cle === c))
    .filter(Boolean) as LevierCalcule[];
  const sommeTroisAutres = troisAutres.reduce((s, x) => s + x.montantEur, 0);

  return (
    <section className="mt-10" aria-labelledby="leviers">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="leviers" className="text-[19px] font-semibold tracking-tight">
          Le classement des leviers
        </h2>
        <div className="flex gap-0.5 rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] p-0.5">
          {(
            [
              { cle: 'tous', mot: 'Commune et territoire' },
              { cle: 'commune', mot: 'Ce que la commune décide' },
            ] as const
          ).map((o) => (
            <button
              key={o.cle}
              type="button"
              onClick={() => setPerimetre(o.cle)}
              aria-pressed={perimetre === o.cle}
              className={cn(
                'rounded-[6px] px-2.5 py-1 text-[12.5px]',
                perimetre === o.cle
                  ? 'bg-[var(--pc-accent)] text-white'
                  : 'text-[var(--pc-encre-douce)] hover:bg-[var(--pc-fond-enfonce)]',
              )}
            >
              {o.mot}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-1.5 max-w-prose text-[13.5px] text-[var(--pc-encre-douce)]">
        Les marchés de la commune, son patrimoine, sa flotte, ses déchets et le parc résidentiel de son territoire,
        tous calculés à la même valeur du carbone et rangés par ordre décroissant. Sans ce classement, on discute des
        sacs poubelle pendant que le chauffage tourne.
      </p>

      {/* --- Le résultat, dit avant le graphique -------------------------- */}
      {chauffageCommunal && sommeTroisAutres > 0 && (
        <p className="mt-4 rounded-[var(--pc-rayon)] border border-[var(--pc-accent)] bg-[var(--pc-accent-doux)] px-4 py-3 text-[13.5px]">
          <strong className="font-semibold">Le résultat, avant tout commentaire.</strong> Le chauffage des bâtiments
          communaux pèse <span className="chiffre font-semibold">{formaterEuros(chauffageCommunal.montantEur, locale)}</span>,
          soit plus que la voirie, les repas et le nettoyage réunis —{' '}
          <span className="chiffre font-semibold">{formaterEuros(sommeTroisAutres, locale)}</span>. Ce n’est pas une
          opinion : c’est le même calcul appliqué aux cinq postes.
        </p>
      )}

      <CadreGraphique
        className="mt-5"
        titre={`Leviers rangés par coût complet, exercice ${annee}`}
        explication={{
          montre: `Chaque gisement, valorisé au même barème et au résidu, en euros par an. Le tri est décroissant sur le montant : ce sont des gisements qui sont classés, jamais des entreprises ni des personnes.`,
          neMontrePas:
            'Le coût de la réduction. Un levier gros et cher à réduire peut être un moins bon point de départ qu’un levier moyen et gratuit — la colonne « prise » dit ce que la commune décide réellement, pas ce que ça coûterait.',
          decisionLocale:
            'Variable selon les lignes, et c’est le point : les deux premiers postes du territoire échappent largement à la commune, tandis que le troisième lui appartient de bout en bout.',
          prochaineMesure:
            'Relevé mensuel de Fluvius pour les deux premières lignes. Les autres attendent que la commune publie ses données.',
        }}
        colonnes={[
          { cle: 'levier', titre: 'Levier' },
          { cle: 'nature', titre: 'Nature' },
          { cle: 'perimetre', titre: 'Périmètre' },
          { cle: 'tonnes', titre: 'tCO₂e par an' },
          { cle: 'montant', titre: '€ par an' },
          { cle: 'source', titre: 'Source' },
        ]}
        lignes={visibles.map((x) => ({
          levier: x.levier.libelle,
          nature: x.levier.nature === 'stock' ? 'stock (s’accumule)' : 'flux (se remet à zéro)',
          perimetre: x.levier.perimetre,
          tonnes: Math.round(x.tonnes),
          montant: Math.round(x.montantEur),
          source: x.levier.source,
        }))}
        nomFichier={`leviers-${annee}`}
      >
        <ul className="space-y-2.5">
          {visibles.map((x) => {
            const actif = ouvert === x.levier.cle;
            return (
              <li key={x.levier.cle}>
                <button
                  type="button"
                  onClick={() => setOuvert(actif ? null : x.levier.cle)}
                  aria-expanded={actif}
                  className="w-full text-left"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-[13px]">
                    <span className="flex min-w-0 items-center gap-2">
                      {x.levier.nature === 'stock' ? (
                        <Layers className="h-3.5 w-3.5 shrink-0 text-[var(--pc-encre-tenue)]" aria-hidden />
                      ) : (
                        <RefreshCw className="h-3.5 w-3.5 shrink-0 text-[var(--pc-encre-tenue)]" aria-hidden />
                      )}
                      <span className="truncate">{x.levier.libelle}</span>
                      {!x.levier.reel && <BadgeFictif />}
                    </span>
                    <span className="chiffre shrink-0 font-medium">{formaterEuros(x.montantEur, locale)}</span>
                  </div>
                  <span
                    className="mt-1 block h-2.5 bg-[var(--pc-fond-enfonce)]"
                    style={{ borderRadius: 'var(--pc-marque-rayon)' }}
                  >
                    <span
                      className="block h-full"
                      style={{
                        width: `${(x.montantEur / max) * 100}%`,
                        backgroundColor:
                          x.levier.perimetre === 'commune' ? 'var(--pc-accent)' : 'var(--pc-serie-8)',
                        borderRadius: 'var(--pc-marque-rayon)',
                      }}
                    />
                  </span>
                </button>

                {actif && (
                  <div className="mt-2 rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] bg-[var(--pc-fond-enfonce)] px-4 py-3 text-[12.5px]">
                    <p className="text-[var(--pc-encre-douce)]">
                      <span className="font-medium text-[var(--pc-encre)]">Ce que la commune peut décider dessus.</span>{' '}
                      {x.levier.prise}
                    </p>
                    <ol className="mt-2 space-y-1 text-[var(--pc-encre-tenue)]">
                      {x.chaine.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ol>
                    <p className="mt-2 text-[var(--pc-encre-tenue)]">
                      {formaterNombre(x.levier.quantite, locale)} {x.levier.unite} · {x.levier.source}
                    </p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </CadreGraphique>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] px-4 py-3">
          <p className="flex items-center gap-2 text-[13px] font-medium">
            <RefreshCw className="h-3.5 w-3.5 text-[var(--pc-encre-tenue)]" aria-hidden />
            Flux — se remet à zéro chaque année
          </p>
          <p className="chiffre mt-1 text-[17px] font-semibold">{formaterEuros(totalFlux, locale)}</p>
          <p className="mt-1 text-[12px] text-[var(--pc-encre-tenue)]">
            Un gain sur un marché est à refaire l’année suivante.
          </p>
        </div>
        <div className="rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] px-4 py-3">
          <p className="flex items-center gap-2 text-[13px] font-medium">
            <Layers className="h-3.5 w-3.5 text-[var(--pc-encre-tenue)]" aria-hidden />
            Stock — s’accumule
          </p>
          <p className="chiffre mt-1 text-[17px] font-semibold">{formaterEuros(totalStock, locale)}</p>
          <p className="mt-1 text-[12px] text-[var(--pc-encre-tenue)]">
            Un gain sur le bâti se répète chaque année sans être refait. Sur vingt ans, l’écart devient un facteur
            vingt.
          </p>
        </div>
      </div>

      <p className="mt-3 flex items-start gap-2 text-[12.5px] text-[var(--pc-encre-tenue)]">
        <CircleDot className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
        Les deux premières lignes du territoire viennent de données réelles — les volumes prélevés relevés chez
        Fluvius. Les autres sont fictives, faute de publication. Le contraste est le résultat : le poste que la
        commune ne maîtrise pas directement écrase tous ceux qu’elle maîtrise.
      </p>
    </section>
  );
}
