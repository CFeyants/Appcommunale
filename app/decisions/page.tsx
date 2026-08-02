"use client";

import { useState } from "react";
import { CalendarDays, Euro } from "lucide-react";
import {
  decisions,
  orientations,
  euros,
  type OrientationId,
  type EtatDecision,
} from "@/lib/data";
import { TrajectoryLabel } from "@/components/TrajectoryLabel";
import { DataExportBar } from "@/components/DataExportBar";

const etatStyle: Record<EtatDecision, string> = {
  adoptée: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "en cours": "bg-sky-50 text-sky-700 border-sky-200",
  "en projet": "bg-slate-100 text-slate-600 border-slate-200",
};

export default function Page() {
  const [filtre, setFiltre] = useState<OrientationId | "toutes">("toutes");

  const liste =
    filtre === "toutes"
      ? decisions
      : decisions.filter((d) => d.orientation === filtre);

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Décisions du conseil communal
        </h1>
        <p className="max-w-3xl text-slate-600">
          Chaque décision porte son coût, son état, et l'orientation de long terme
          qu'elle sert. Cliquez une étiquette de trajectoire pour remonter au cap.
        </p>
      </header>

      {/* Filtres par orientation */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFiltre("toutes")}
          className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
            filtre === "toutes"
              ? "border-slate-900 bg-slate-900 text-white"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          Toutes ({decisions.length})
        </button>
        {orientations.map((o) => {
          const n = decisions.filter((d) => d.orientation === o.id).length;
          const actif = filtre === o.id;
          return (
            <button
              key={o.id}
              onClick={() => setFiltre(o.id)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                actif
                  ? `${o.couleur.bordure} ${o.couleur.fond} ${o.couleur.texte}`
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${o.couleur.point}`} aria-hidden />
              {o.titre.split(" ")[0].replace("&", "")} ({n})
            </button>
          );
        })}
      </div>

      {/* Liste des décisions */}
      <ul className="space-y-4">
        {liste.map((d) => (
          <li
            key={d.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-sm"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-slate-400">{d.id}</span>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${etatStyle[d.etat]}`}
              >
                {d.etat}
              </span>
              <TrajectoryLabel orientation={d.orientation} size="sm" />
            </div>

            <h2 className="mt-2 text-lg font-semibold text-slate-900">{d.titre}</h2>
            <p className="mt-1 text-slate-600">{d.description}</p>

            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                {new Date(d.date).toLocaleDateString("fr-BE", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                <Euro className="h-4 w-4" />
                {euros(d.coutEuros)}
              </span>
              <span className="text-slate-400">{d.seance}</span>
            </div>
          </li>
        ))}
      </ul>

      <DataExportBar
        nomFichier="decisions.json"
        libelle="La liste des décisions du conseil est ouverte."
        data={liste}
      />
    </div>
  );
}
