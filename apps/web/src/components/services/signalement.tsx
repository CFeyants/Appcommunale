'use client';

import * as React from 'react';
import { Download, MapPin, TriangleAlert } from 'lucide-react';
import { Button } from '@pc/ui';
import type { Dictionnaire, Locale } from '@/i18n';
import { formaterDate } from '@/i18n';
import { INSTITUTIONS } from '@pc/core';

/**
 * Le signalement.
 *
 * Décision assumée : on l'inclut, mais **jamais comme un guichet**. La
 * plateforme ne prétend nulle part acheminer ce qu'elle n'achemine pas. Elle
 * produit un document daté, prêt à envoyer par le canal officiel de la
 * commune, et elle fait la seule chose que personne ne fait : elle demande
 * trente jours plus tard si le problème a été traité, et publie le délai
 * réellement observé.
 *
 * Le document est fabriqué dans le navigateur et téléchargé. Rien n'est
 * envoyé, rien n'est stocké côté serveur : c'est ce qui rend la promesse
 * tenable.
 */

const QUALIFICATIONS = [
  { cle: 'voirie', libelle: 'Voirie — trou, revêtement, marquage' },
  { cle: 'eclairage', libelle: 'Éclairage public' },
  { cle: 'proprete', libelle: 'Propreté — dépôt, poubelle' },
  { cle: 'espaces-verts', libelle: 'Espaces verts — arbre, taille' },
  { cle: 'mobilier', libelle: 'Mobilier urbain — banc, panneau' },
  { cle: 'autre', libelle: 'Autre' },
] as const;

const CLE = 'pc-signalements';

interface Enregistre {
  id: string;
  qualification: string;
  description: string;
  creeLe: string;
  relanceLe: string;
  traite?: boolean;
  constateLe?: string;
}

export function Signalement({ d, locale }: { d: Dictionnaire; locale: Locale }) {
  const [qualification, setQualification] = React.useState<string>('voirie');
  const [description, setDescription] = React.useState('');
  const [position, setPosition] = React.useState<{ lat: number; lon: number } | null>(null);
  const [mesSignalements, setMes] = React.useState<Enregistre[]>([]);

  React.useEffect(() => {
    try {
      setMes(JSON.parse(localStorage.getItem(CLE) ?? '[]'));
    } catch {
      /* stockage indisponible */
    }
  }, []);

  const institution = INSTITUTIONS['kraainem-college']!;

  const localiser = () => {
    navigator.geolocation?.getCurrentPosition(
      (p) => setPosition({ lat: p.coords.latitude, lon: p.coords.longitude }),
      () => setPosition(null),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const produireDocument = () => {
    const maintenant = new Date();
    const texte = [
      'SIGNALEMENT — DOCUMENT PRÊT À ENVOYER',
      '',
      `Date du signalement : ${maintenant.toISOString().slice(0, 10)}`,
      `Type : ${QUALIFICATIONS.find((q) => q.cle === qualification)?.libelle}`,
      `Localisation : ${position ? `${position.lat.toFixed(6)}, ${position.lon.toFixed(6)}` : 'non renseignée'}`,
      '',
      'Description :',
      description || '(à compléter)',
      '',
      '— Destinataire suggéré —',
      institution.nom,
      institution.canal.libelle,
      institution.canal.adresse ?? '',
      institution.canal.courriel ?? '',
      '',
      `Délai légal de réponse : ${institution.delaiLegalJours ? `${institution.delaiLegalJours} jours` : 'aucun texte n’en fixe un pour ce type de signalement'}`,
      '',
      'Ce document a été produit par la plateforme citoyenne. La plateforme',
      'ne l’achemine pas : il doit être envoyé par le canal officiel ci-dessus.',
    ].join('\n');

    const blob = new Blob(['﻿' + texte], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `signalement-${maintenant.toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    const relance = new Date(maintenant.getTime() + 30 * 86_400_000);
    const suivant: Enregistre[] = [
      ...mesSignalements,
      {
        id: `${maintenant.getTime()}`,
        qualification,
        description,
        creeLe: maintenant.toISOString(),
        relanceLe: relance.toISOString(),
      },
    ];
    setMes(suivant);
    try {
      localStorage.setItem(CLE, JSON.stringify(suivant));
    } catch {
      /* ignoré */
    }
    setDescription('');
  };

  const repondre = (id: string, traite: boolean) => {
    const suivant = mesSignalements.map((s) =>
      s.id === id ? { ...s, traite, constateLe: new Date().toISOString() } : s,
    );
    setMes(suivant);
    try {
      localStorage.setItem(CLE, JSON.stringify(suivant));
    } catch {
      /* ignoré */
    }
  };

  const aRelancer = mesSignalements.filter((s) => s.traite === undefined && new Date(s.relanceLe) <= new Date());
  const constates = mesSignalements.filter((s) => s.traite !== undefined);
  const delais = constates
    .filter((s) => s.traite && s.constateLe)
    .map((s) => Math.round((new Date(s.constateLe!).getTime() - new Date(s.creeLe).getTime()) / 86_400_000));
  const delaiMedian = delais.length > 0 ? [...delais].sort((a, b) => a - b)[Math.floor(delais.length / 2)]! : null;

  return (
    <section className="mt-8" aria-labelledby="signalement">
      <h3 id="signalement" className="text-[16px] font-semibold tracking-tight">
        {d.epargne.signalement}
      </h3>

      <div
        className="mt-3 flex items-start gap-2.5 rounded-[var(--pc-rayon)] border px-4 py-3.5 text-[13px]"
        style={{ borderColor: 'var(--pc-serieux)', color: 'var(--pc-serieux)' }}
      >
        <TriangleAlert className="mt-px h-4 w-4 shrink-0" aria-hidden />
        <span>{d.epargne.signalementAvertissement}</span>
      </div>

      <div className="mt-4 carte px-5 py-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-[13px]">
            <span className="font-medium">Type</span>
            <select
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
              className="mt-1.5 h-9 w-full rounded-[var(--pc-rayon)] border border-[var(--pc-trait-fort)] bg-[var(--pc-fond-eleve)] px-2.5 text-[13px]"
            >
              {QUALIFICATIONS.map((q) => (
                <option key={q.cle} value={q.cle}>
                  {q.libelle}
                </option>
              ))}
            </select>
          </label>

          <div className="text-[13px]">
            <span className="font-medium">Localisation</span>
            <div className="mt-1.5 flex items-center gap-2">
              <Button variant="contour" taille="sm" onClick={localiser}>
                <MapPin className="h-3.5 w-3.5" />
                Utiliser ma position
              </Button>
              <span className="chiffre text-[12px] text-[var(--pc-encre-tenue)]">
                {position ? `${position.lat.toFixed(4)}, ${position.lon.toFixed(4)}` : 'non renseignée'}
              </span>
            </div>
          </div>
        </div>

        <label className="mt-3 block text-[13px]">
          <span className="font-medium">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            maxLength={600}
            placeholder="Ce que vous constatez, à quel endroit précis."
            className="mt-1.5 w-full rounded-[var(--pc-rayon)] border border-[var(--pc-trait-fort)] bg-[var(--pc-fond-eleve)] px-3 py-2 text-[13px]"
          />
        </label>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Button variant="primaire" taille="sm" onClick={produireDocument} disabled={description.trim().length < 10}>
            <Download className="h-3.5 w-3.5" />
            Produire le document daté
          </Button>
          <span className="text-[12.5px] text-[var(--pc-encre-douce)]">
            À envoyer à : {institution.canal.courriel ?? institution.canal.libelle}
          </span>
        </div>

        <p className="mt-3 text-[12px] text-[var(--pc-encre-tenue)]">
          Aucune photo n’est envoyée nulle part : le document est produit sur votre appareil. Trente jours après,
          cette page vous demandera si le problème a été traité — c’est cette réponse, et elle seule, qui alimente le
          délai observé ci-dessous.
        </p>
      </div>

      {/* --- La relance à J+30 -------------------------------------------- */}
      {aRelancer.length > 0 && (
        <div className="mt-4 rounded-[var(--pc-rayon)] border border-[var(--pc-accent)] bg-[var(--pc-accent-doux)] px-4 py-3.5">
          <p className="text-[13.5px] font-medium">Trente jours ont passé. Le problème a-t-il été traité ?</p>
          <ul className="mt-2 space-y-2">
            {aRelancer.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 text-[13px]">
                <span className="truncate">
                  {QUALIFICATIONS.find((q) => q.cle === s.qualification)?.libelle} —{' '}
                  <span className="chiffre">{formaterDate(s.creeLe, locale)}</span>
                </span>
                <span className="flex gap-2">
                  <Button variant="contour" taille="sm" onClick={() => repondre(s.id, true)}>
                    Oui
                  </Button>
                  <Button variant="contour" taille="sm" onClick={() => repondre(s.id, false)}>
                    Non
                  </Button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* --- Le délai réellement observé ---------------------------------- */}
      <div className="mt-4 carte px-5 py-4">
        <h4 className="text-[14px] font-semibold">{d.epargne.delaiObserve}</h4>
        <p className="mt-1 text-[12.5px] text-[var(--pc-encre-douce)]">{d.epargne.delaiObserveAide}</p>
        {constates.length === 0 ? (
          <p className="mt-3 text-[13px] text-[var(--pc-encre-tenue)]">
            Aucune matière encore : le délai observé sera publié dès qu’il y aura des retours. C’est la donnée la plus
            inconfortable et la plus utile que cette plateforme puisse produire, et personne d’autre ne peut la
            produire.
          </p>
        ) : (
          <dl className="mt-3 flex flex-wrap gap-x-8 gap-y-2 text-[13px]">
            <div>
              <dt className="text-[var(--pc-encre-douce)]">Signalements suivis</dt>
              <dd className="chiffre font-semibold">{constates.length}</dd>
            </div>
            <div>
              <dt className="text-[var(--pc-encre-douce)]">Traités dans les 30 jours</dt>
              <dd className="chiffre font-semibold">{constates.filter((s) => s.traite).length}</dd>
            </div>
            <div>
              <dt className="text-[var(--pc-encre-douce)]">Délai médian constaté</dt>
              <dd className="chiffre font-semibold">{delaiMedian !== null ? `${delaiMedian} jours` : '—'}</dd>
            </div>
          </dl>
        )}
        <p className="mt-3 text-[12px] text-[var(--pc-encre-tenue)]">
          Ces chiffres ne sont pour l’instant calculés que sur vos propres signalements, stockés sur votre appareil.
          Leur agrégation publique par commune suppose un envoi volontaire, qui n’est pas encore ouvert.
        </p>
      </div>
    </section>
  );
}
