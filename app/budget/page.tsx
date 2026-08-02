"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  budget,
  getOrientation,
  euros,
  pct,
} from "@/lib/data";
import { TrajectoryLabel } from "@/components/TrajectoryLabel";
import { DataExportBar } from "@/components/DataExportBar";

export default function Page() {
  const totalVote = budget.lignes.reduce((s, l) => s + l.voteEuros, 0);
  const totalExecute = budget.lignes.reduce((s, l) => s + l.executeEuros, 0);

  const chartData = budget.lignes.map((l) => ({
    nom: getOrientation(l.orientation).titre.split(" ")[0].replace("&", ""),
    Voté: l.voteEuros,
    Exécuté: l.executeEuros,
  }));

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Budget {budget.annee}
        </h1>
        <p className="max-w-3xl text-slate-600">
          Du budget voté à la dépense réellement exécutée, orientation par
          orientation. On suit où va l'argent — sans note ni classement, juste les
          faits.
        </p>
      </header>

      {/* Chiffres clés */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Budget total de la commune</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {euros(budget.totalCommuneEuros)}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Voté sur les 3 orientations</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{euros(totalVote)}</p>
          <p className="text-xs text-slate-400">
            {pct((totalVote / budget.totalCommuneEuros) * 100)} du budget communal
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Exécuté à ce jour</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {euros(totalExecute)}
          </p>
          <p className="text-xs text-slate-400">
            {pct((totalExecute / totalVote) * 100)} du voté
          </p>
        </div>
      </div>

      {/* Graphique */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Voté vs exécuté, par orientation
        </h2>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="nom" tick={{ fontSize: 12, fill: "#64748b" }} />
              <YAxis
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickFormatter={(v) => `${(v as number) / 1000}k`}
              />
              <Tooltip
                formatter={(v) => euros(v as number)}
                contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
              />
              <Legend />
              <Bar dataKey="Voté" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Exécuté" fill="#0f172a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Détail par ligne */}
      <div className="space-y-4">
        {budget.lignes.map((l) => {
          const o = getOrientation(l.orientation);
          const tauxExec = (l.executeEuros / l.voteEuros) * 100;
          return (
            <div
              key={l.orientation}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-900">{l.intitule}</h3>
                  <div className="mt-1.5">
                    <TrajectoryLabel orientation={l.orientation} size="sm" />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Exécuté / voté</p>
                  <p className="font-semibold text-slate-900">
                    {euros(l.executeEuros)}{" "}
                    <span className="text-slate-400">/ {euros(l.voteEuros)}</span>
                  </p>
                </div>
              </div>
              {/* Barre d'exécution */}
              <div className="mt-3">
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${o.couleur.point}`}
                    style={{ width: `${tauxExec}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {pct(tauxExec)} du budget voté engagé
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <DataExportBar
        nomFichier="budget-2026.json"
        libelle="Le détail du budget voté et exécuté est ouvert."
        data={budget}
      />
    </div>
  );
}
