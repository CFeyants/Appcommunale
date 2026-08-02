import { CheckCircle2, Circle, Loader2, AlertTriangle } from "lucide-react";
import {
  projets,
  euros,
  pct,
  type EtatJalon,
} from "@/lib/data";
import { TrajectoryLabel } from "@/components/TrajectoryLabel";
import { DataExportBar } from "@/components/DataExportBar";

const jalonIcon: Record<EtatJalon, React.ReactNode> = {
  fait: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
  "en cours": <Loader2 className="h-4 w-4 text-sky-600" />,
  "à venir": <Circle className="h-4 w-4 text-slate-300" />,
  "en retard": <AlertTriangle className="h-4 w-4 text-amber-600" />,
};

function ecartLabel(semaines: number): { texte: string; classe: string } {
  if (semaines === 0)
    return { texte: "Dans les temps", classe: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  if (semaines < 0)
    return {
      texte: `${Math.abs(semaines)} sem. d'avance`,
      classe: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
  if (semaines <= 4)
    return {
      texte: `${semaines} sem. de retard`,
      classe: "bg-amber-50 text-amber-700 border-amber-200",
    };
  return {
    texte: `${semaines} sem. de retard`,
    classe: "bg-red-50 text-red-700 border-red-200",
  };
}

export default function Page() {
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Projets en cours
        </h1>
        <p className="max-w-3xl text-slate-600">
          L'avancement réel des projets, leurs jalons, leurs retards et leurs écarts
          au plan initial — chacun rattaché à l'orientation qu'il sert.
        </p>
      </header>

      <div className="space-y-5">
        {projets.map((p) => {
          const ecart = ecartLabel(p.ecartSemaines);
          return (
            <article
              key={p.id}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-400">{p.id}</span>
                    <TrajectoryLabel orientation={p.orientation} size="sm" />
                  </div>
                  <h2 className="mt-1.5 text-lg font-semibold text-slate-900">
                    {p.titre}
                  </h2>
                </div>
                <span
                  className={`rounded-full border px-2.5 py-1 text-xs font-medium ${ecart.classe}`}
                >
                  {ecart.texte}
                </span>
              </div>

              {/* Avancement + budget */}
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Avancement</span>
                    <span className="font-medium text-slate-900">
                      {pct(p.avancementPct)}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-slate-900"
                      style={{ width: `${p.avancementPct}%` }}
                    />
                  </div>
                </div>
                <div className="text-sm">
                  <span className="text-slate-500">Dépensé / budget</span>
                  <p className="font-medium text-slate-900">
                    {euros(p.depenseEuros)}{" "}
                    <span className="text-slate-400">/ {euros(p.budgetEuros)}</span>
                  </p>
                </div>
              </div>

              {/* Jalons */}
              <div className="mt-5">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                  Jalons
                </p>
                <ol className="space-y-2">
                  {p.jalons.map((j, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm">
                      <span className="shrink-0">{jalonIcon[j.etat]}</span>
                      <span
                        className={
                          j.etat === "fait"
                            ? "text-slate-500 line-through"
                            : j.etat === "en retard"
                              ? "font-medium text-amber-700"
                              : "text-slate-700"
                        }
                      >
                        {j.libelle}
                      </span>
                      <span className="ml-auto shrink-0 font-mono text-xs text-slate-400">
                        {j.echeance}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </article>
          );
        })}
      </div>

      <DataExportBar
        nomFichier="projets.json"
        libelle="Le suivi des projets communaux est ouvert."
        data={projets}
      />
    </div>
  );
}
