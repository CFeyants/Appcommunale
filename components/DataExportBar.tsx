"use client";

import { Download, ShieldCheck } from "lucide-react";

/**
 * Bandeau « données ouvertes » présent sur chaque écran.
 *
 * Principe du document : tout ce que l'application affiche doit être exportable
 * et vérifiable par quiconque. Sans cela, ce n'est pas un commun de transparence,
 * juste une plaquette de communication. Ici, l'export génère le JSON brut de la
 * donnée affichée, côté navigateur (aucune donnée personnelle).
 */
export function DataExportBar({
  nomFichier,
  data,
  libelle,
}: {
  nomFichier: string;
  data: unknown;
  libelle: string;
}) {
  function telecharger() {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = nomFichier;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-2.5 text-sm text-slate-600">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
        <p>
          {libelle}{" "}
          <span className="text-slate-400">
            Données brutes, réutilisables librement — transparence des institutions,
            protection des personnes.
          </span>
        </p>
      </div>
      <button
        onClick={telecharger}
        className="inline-flex shrink-0 items-center gap-2 self-start rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700 sm:self-auto"
      >
        <Download className="h-4 w-4" />
        Télécharger (JSON)
      </button>
    </div>
  );
}
