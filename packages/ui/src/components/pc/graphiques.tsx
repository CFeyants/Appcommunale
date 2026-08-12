'use client';

/*
 * Les graphiques.
 *
 * Tracés à la main en SVG plutôt qu'avec une bibliothèque : les règles du § 3
 * — marques fines, extrémités arrondies de 4 px, séparateurs de 2 px dans la
 * couleur du fond, grilles en filet, étiquettes directes — ne sont pas
 * paramétrables dans les bibliothèques courantes, et une dépendance de plus
 * serait une dépendance de plus à maintenir.
 *
 * Règle imposée par le code, pas par la revue : `CadreGraphique` refuse de
 * rendre un graphique dont l'explication est vide. Un test le vérifie.
 */

import * as React from 'react';
import { Download, Table2, LineChart } from 'lucide-react';
import { cn } from '../../lib/cn';

export interface Explication {
  montre: string;
  neMontrePas: string;
  decisionLocale: string;
  prochaineMesure: string;
}

export interface Colonne {
  cle: string;
  titre: string;
}

export interface CadreProps {
  titre: string;
  /** Obligatoire et non vide. Aucun graphique ne part en production sans elle. */
  explication: Explication;
  /** La vue tableau, accessible en un clic, et la matière de l'export CSV. */
  colonnes: Colonne[];
  lignes: Array<Record<string, string | number | null>>;
  nomFichier: string;
  children: React.ReactNode;
  className?: string;
}

function explicationVide(e: Explication | undefined): boolean {
  if (!e) return true;
  return [e.montre, e.neMontrePas, e.decisionLocale, e.prochaineMesure].some((s) => !s || s.trim().length === 0);
}

function versCsv(colonnes: Colonne[], lignes: CadreProps['lignes']): string {
  const echapper = (v: unknown) => {
    const s = v === null || v === undefined ? '' : String(v);
    return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const entete = colonnes.map((c) => echapper(c.titre)).join(';');
  const corps = lignes.map((l) => colonnes.map((c) => echapper(l[c.cle])).join(';'));
  return [entete, ...corps].join('\n');
}

export function CadreGraphique({
  titre,
  explication,
  colonnes,
  lignes,
  nomFichier,
  children,
  className,
}: CadreProps) {
  const [vue, setVue] = React.useState<'graphique' | 'tableau'>('graphique');

  if (explicationVide(explication)) {
    // Volontairement bruyant : c'est le seul moyen que la règle tienne dans le
    // temps. Le rendu échoue au lieu de publier un graphique muet.
    throw new Error(
      `Graphique « ${titre} » : la propriété « explication » est vide. ` +
        'Aucun graphique ne part en production sans son texte d’explication (§ 5.1).',
    );
  }

  const telecharger = () => {
    const blob = new Blob(['﻿' + versCsv(colonnes, lignes)], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${nomFichier}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <figure className={cn('carte overflow-hidden', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--pc-trait)] px-4 py-3">
        <h3 className="text-[14px] font-semibold tracking-tight">{titre}</h3>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setVue(vue === 'graphique' ? 'tableau' : 'graphique')}
            className="inline-flex items-center gap-1.5 rounded-[6px] border border-[var(--pc-trait)] px-2.5 py-1 text-[12px] text-[var(--pc-encre-douce)] hover:bg-[var(--pc-fond-enfonce)]"
          >
            {vue === 'graphique' ? <Table2 className="h-3.5 w-3.5" /> : <LineChart className="h-3.5 w-3.5" />}
            {vue === 'graphique' ? 'Vue tableau' : 'Vue graphique'}
          </button>
          <button
            type="button"
            onClick={telecharger}
            className="inline-flex items-center gap-1.5 rounded-[6px] border border-[var(--pc-trait)] px-2.5 py-1 text-[12px] text-[var(--pc-encre-douce)] hover:bg-[var(--pc-fond-enfonce)]"
          >
            <Download className="h-3.5 w-3.5" />
            CSV
          </button>
        </div>
      </div>

      <div className="px-4 py-5">
        {vue === 'graphique' ? (
          children
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[22rem] text-[13px]">
              <thead>
                <tr className="border-b border-[var(--pc-trait)] text-left">
                  {colonnes.map((c) => (
                    <th key={c.cle} scope="col" className="py-2 pr-4 font-medium text-[var(--pc-encre-douce)]">
                      {c.titre}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lignes.map((l, i) => (
                  <tr key={i} className="border-b border-[var(--pc-trait)] last:border-0">
                    {colonnes.map((c, j) => (
                      <td key={c.cle} className={cn('py-2 pr-4', j > 0 && 'chiffre')}>
                        {l[c.cle] ?? <span className="text-[var(--pc-encre-tenue)]">non mesuré</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <figcaption className="border-t border-[var(--pc-trait)] bg-[var(--pc-fond-enfonce)] px-4 py-3.5 text-[12.5px] leading-relaxed text-[var(--pc-encre-douce)]">
        <p>
          <strong className="font-semibold text-[var(--pc-encre)]">Ce qu’il montre.</strong> {explication.montre}
        </p>
        <p className="mt-1.5">
          <strong className="font-semibold text-[var(--pc-encre)]">Ce qu’il ne montre pas.</strong> {explication.neMontrePas}
        </p>
        <p className="mt-1.5">
          <strong className="font-semibold text-[var(--pc-encre)]">Ce qui relève de la décision locale.</strong>{' '}
          {explication.decisionLocale}
        </p>
        <p className="mt-1.5">
          <strong className="font-semibold text-[var(--pc-encre)]">Prochaine mesure.</strong> {explication.prochaineMesure}
        </p>
      </figcaption>
    </figure>
  );
}

// ---------------------------------------------------------------------------
// Barre unique en parties du tout.
// ---------------------------------------------------------------------------

export interface Part {
  cle: string;
  libelle: string;
  valeur: number;
  couleur: string;
}

export function BarreUnique({
  parts,
  format,
  onPartClick,
  partActive,
}: {
  parts: Part[];
  format: (n: number) => string;
  onPartClick?: (cle: string) => void;
  partActive?: string | null;
}) {
  const total = parts.reduce((s, p) => s + p.valeur, 0) || 1;
  return (
    <div>
      <div className="flex h-11 w-full gap-[2px] overflow-hidden" role="img" aria-label="Décomposition en parties du tout">
        {parts.map((p) => {
          const pct = (p.valeur / total) * 100;
          const actif = partActive === p.cle;
          return (
            <button
              key={p.cle}
              type="button"
              onClick={() => onPartClick?.(p.cle)}
              title={`${p.libelle} — ${format(p.valeur)} (${pct.toFixed(1)} %)`}
              aria-label={`${p.libelle}, ${format(p.valeur)}, ${pct.toFixed(1)} pour cent. Cliquer pour l’explication.`}
              className="h-full min-w-[3px] transition-opacity"
              style={{
                width: `${pct}%`,
                backgroundColor: p.couleur,
                borderRadius: 'var(--pc-marque-rayon)',
                opacity: partActive && !actif ? 0.4 : 1,
                cursor: onPartClick ? 'pointer' : 'default',
              }}
            />
          );
        })}
      </div>
      {/* Étiquettes directes plutôt qu'une légende à décoder. */}
      <ul className="mt-4 grid gap-x-5 gap-y-2 sm:grid-cols-2">
        {parts.map((p) => {
          const pct = (p.valeur / total) * 100;
          return (
            <li key={p.cle}>
              <button
                type="button"
                onClick={() => onPartClick?.(p.cle)}
                className={cn(
                  'flex w-full items-baseline gap-2 rounded px-1 py-0.5 text-left text-[13px]',
                  onPartClick && 'hover:bg-[var(--pc-fond-enfonce)]',
                )}
              >
                <span
                  aria-hidden
                  className="mt-1 h-2.5 w-2.5 shrink-0"
                  style={{ backgroundColor: p.couleur, borderRadius: 'var(--pc-marque-rayon)' }}
                />
                <span className="flex-1 truncate">{p.libelle}</span>
                <span className="chiffre tabular-nums text-[var(--pc-encre-douce)]">{format(p.valeur)}</span>
                <span className="chiffre w-12 text-right text-[12px] text-[var(--pc-encre-tenue)]">{pct.toFixed(1)} %</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Jauge voté / engagé / exécuté.
// ---------------------------------------------------------------------------

export function Jauge({
  libelle,
  vote,
  engage,
  execute,
  format,
}: {
  libelle: string;
  vote: number;
  engage?: number;
  execute?: number;
  format: (n: number) => string;
}) {
  const base = vote || 1;
  const pct = (v?: number) => (v === undefined ? 0 : Math.min(100, (v / base) * 100));
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[13px] font-medium">{libelle}</span>
        <span className="chiffre text-[13px] text-[var(--pc-encre-douce)]">voté {format(vote)}</span>
      </div>
      <div className="relative mt-2 h-3 w-full bg-[var(--pc-fond-enfonce)]" style={{ borderRadius: 'var(--pc-marque-rayon)' }}>
        {engage !== undefined && (
          <div
            className="absolute inset-y-0 left-0"
            style={{ width: `${pct(engage)}%`, backgroundColor: 'var(--pc-serie-6)', borderRadius: 'var(--pc-marque-rayon)' }}
          />
        )}
        {execute !== undefined && (
          <div
            className="absolute inset-y-0 left-0"
            style={{ width: `${pct(execute)}%`, backgroundColor: 'var(--pc-serie-1)', borderRadius: 'var(--pc-marque-rayon)' }}
          />
        )}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-[var(--pc-encre-douce)]">
        {engage !== undefined && (
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden className="h-2 w-2" style={{ background: 'var(--pc-serie-6)', borderRadius: 3 }} />
            engagé <span className="chiffre">{format(engage)}</span>
            <span className="chiffre text-[var(--pc-encre-tenue)]">({pct(engage).toFixed(0)} %)</span>
          </span>
        )}
        {execute !== undefined && (
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden className="h-2 w-2" style={{ background: 'var(--pc-serie-1)', borderRadius: 3 }} />
            exécuté <span className="chiffre">{format(execute)}</span>
            <span className="chiffre text-[var(--pc-encre-tenue)]">({pct(execute).toFixed(0)} %)</span>
          </span>
        )}
        {engage === undefined && execute === undefined && (
          <span className="text-[var(--pc-encre-tenue)]">Exécution non publiée pour cet exercice.</span>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Barres horizontales comparatives. Ordre alphabétique ou d'origine — jamais
// un tri par valeur, qui produirait un classement (§ 16).
// ---------------------------------------------------------------------------

export function BarresComparaison({
  donnees,
  format,
  unite,
  surligne,
}: {
  donnees: Array<{ cle: string; libelle: string; valeur: number | null }>;
  format: (n: number) => string;
  unite: string;
  surligne?: string;
}) {
  const max = Math.max(...donnees.map((d) => d.valeur ?? 0), 1);
  return (
    <ul className="space-y-2.5">
      {donnees.map((d) => {
        const actif = d.cle === surligne;
        return (
          <li key={d.cle} className="grid grid-cols-[minmax(6.5rem,1fr)_2fr_auto] items-center gap-3 text-[13px]">
            <span className={cn('truncate', actif && 'font-semibold')}>{d.libelle}</span>
            <span className="h-2.5 w-full bg-[var(--pc-fond-enfonce)]" style={{ borderRadius: 'var(--pc-marque-rayon)' }}>
              {d.valeur !== null && (
                <span
                  className="block h-full"
                  style={{
                    width: `${(d.valeur / max) * 100}%`,
                    backgroundColor: actif ? 'var(--pc-accent)' : 'var(--pc-serie-8)',
                    borderRadius: 'var(--pc-marque-rayon)',
                  }}
                />
              )}
            </span>
            <span className="chiffre whitespace-nowrap text-right text-[var(--pc-encre-douce)]">
              {d.valeur === null ? <span className="text-[var(--pc-encre-tenue)]">non mesuré</span> : `${format(d.valeur)} ${unite}`}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

// ---------------------------------------------------------------------------
// Trajectoire : la série des mesures, l'écart à la cible, la prochaine mesure.
// ---------------------------------------------------------------------------

export function Trajectoire({
  points,
  cible,
  unite,
  hauteur = 180,
}: {
  points: Array<{ periode: string; valeur: number | null }>;
  cible?: { valeur: number; echeance: string };
  unite: string;
  hauteur?: number;
}) {
  const L = 520;
  const H = hauteur;
  const m = { haut: 16, bas: 26, gauche: 8, droite: 58 };
  const mesures = points.filter((p) => p.valeur !== null) as Array<{ periode: string; valeur: number }>;

  if (mesures.length === 0) {
    return (
      <p className="py-6 text-center text-[13px] text-[var(--pc-encre-tenue)]">
        Aucune mesure publiée : la trajectoire ne peut pas être tracée.
      </p>
    );
  }

  const valeurs = [...mesures.map((p) => p.valeur), ...(cible ? [cible.valeur] : [])];
  const min = Math.min(...valeurs, 0);
  const max = Math.max(...valeurs) * 1.08 || 1;
  const x = (i: number) => m.gauche + (i / Math.max(1, points.length - 1)) * (L - m.gauche - m.droite);
  const y = (v: number) => m.haut + (1 - (v - min) / (max - min || 1)) * (H - m.haut - m.bas);

  const chemin = mesures
    .map((p, k) => `${k === 0 ? 'M' : 'L'} ${x(points.indexOf(p))} ${y(p.valeur)}`)
    .join(' ');
  const dernier = mesures[mesures.length - 1]!;

  return (
    <svg viewBox={`0 0 ${L} ${H}`} className="w-full" role="img" aria-label="Trajectoire des mesures dans le temps">
      {/* Grille en filet : trois traits, pas un quadrillage. */}
      {[0, 0.5, 1].map((t) => (
        <line key={t} className="filet" x1={m.gauche} x2={L - m.droite} y1={y(min + t * (max - min))} y2={y(min + t * (max - min))} />
      ))}
      {cible && (
        <>
          <line
            x1={m.gauche}
            x2={L - m.droite}
            y1={y(cible.valeur)}
            y2={y(cible.valeur)}
            stroke="var(--pc-serie-4)"
            strokeWidth={1.5}
            strokeDasharray="5 4"
          />
          <text x={L - m.droite + 6} y={y(cible.valeur) + 4} fontSize={11} fill="var(--pc-serie-4)">
            cible {cible.valeur} {unite}
          </text>
        </>
      )}
      <path d={chemin} fill="none" stroke="var(--pc-serie-1)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {mesures.map((p) => (
        <circle key={p.periode} cx={x(points.indexOf(p))} cy={y(p.valeur)} r={3} fill="var(--pc-serie-1)" />
      ))}
      {/* Étiquette directe sur le dernier point, plutôt qu'une valeur partout. */}
      <text x={x(points.indexOf(dernier)) + 7} y={y(dernier.valeur) - 7} fontSize={11.5} fontWeight={600} fill="var(--pc-encre)">
        {dernier.valeur} {unite}
      </text>
      {points.map((p, i) =>
        i === 0 || i === points.length - 1 ? (
          <text
            key={p.periode}
            x={x(i)}
            y={H - 6}
            fontSize={11}
            fill="var(--pc-encre-tenue)"
            textAnchor={i === 0 ? 'start' : 'end'}
          >
            {p.periode}
          </text>
        ) : null,
      )}
    </svg>
  );
}
