"use client";

import { Download, Database, ShieldCheck, Eye } from "lucide-react";
import {
  orientations,
  decisions,
  budget,
  projets,
  commune,
} from "@/lib/data";

const jeux = [
  {
    nom: "Cap communal (orientations)",
    fichier: "cap-communal.json",
    data: orientations as unknown,
    nb: `${orientations.length} orientations`,
  },
  {
    nom: "Décisions du conseil",
    fichier: "decisions.json",
    data: decisions as unknown,
    nb: `${decisions.length} décisions`,
  },
  {
    nom: "Budget voté & exécuté",
    fichier: "budget-2026.json",
    data: budget as unknown,
    nb: `exercice ${budget.annee}`,
  },
  {
    nom: "Suivi des projets",
    fichier: "projets.json",
    data: projets as unknown,
    nb: `${projets.length} projets`,
  },
];

function telecharger(fichier: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fichier;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Page() {
  function toutTelecharger() {
    telecharger(`donnees-${commune.nom.toLowerCase()}.json`, {
      commune,
      orientations,
      decisions,
      budget,
      projets,
    });
  }

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Données ouvertes
        </h1>
        <p className="max-w-3xl text-slate-600">
          Tout ce que cette application affiche est exportable et vérifiable par
          quiconque. C'est ce qui la distingue d'une plaquette de communication :
          les données brutes sont un commun, séparé de leur présentation.
        </p>
      </header>

      {/* Doctrine des données */}
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <ShieldCheck className="h-6 w-6 text-emerald-600" />
          <h2 className="mt-2 font-semibold text-slate-900">
            Transparence des institutions
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Budgets, décisions et projets sont publics, détaillés et réutilisables
            sans restriction.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <Eye className="h-6 w-6 text-slate-700" />
          <h2 className="mt-2 font-semibold text-slate-900">
            Protection des personnes
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Aucune donnée individuelle n'est publiée. Seules les données
            institutionnelles et agrégées sont ouvertes.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <Database className="h-6 w-6 text-sky-700" />
          <h2 className="mt-2 font-semibold text-slate-900">Format ouvert</h2>
          <p className="mt-1 text-sm text-slate-600">
            Export JSON, structure documentée et stable — pensée pour être reprise
            par une autre commune.
          </p>
        </div>
      </section>

      {/* Jeux de données */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">
            Jeux de données disponibles
          </h2>
          <button
            onClick={toutTelecharger}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
          >
            <Download className="h-4 w-4" />
            Tout télécharger
          </button>
        </div>

        <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
          {jeux.map((j) => (
            <li
              key={j.fichier}
              className="flex items-center justify-between gap-4 px-5 py-4"
            >
              <div className="min-w-0">
                <p className="font-medium text-slate-900">{j.nom}</p>
                <p className="truncate text-sm text-slate-400">
                  {j.fichier} · {j.nb}
                </p>
              </div>
              <button
                onClick={() => telecharger(j.fichier, j.data)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                <Download className="h-4 w-4" />
                JSON
              </button>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-sm text-slate-400">
        Réutilisation libre. Toute commune peut reprendre ce socle et l'adapter à
        ses propres orientations — le dispositif est conçu comme un bien commun
        réutilisable.
      </p>
    </div>
  );
}
