import Link from "next/link";
import { ArrowUp, ArrowRight, Target } from "lucide-react";
import { orientations, commune, decisions } from "@/lib/data";
import { DataExportBar } from "@/components/DataExportBar";

export default function Page() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="space-y-4">
        <p className="text-sm font-medium text-slate-500">
          Commune de {commune.nom} · Législature {commune.legislature}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
          Le cap communal
        </h1>
        <p className="max-w-3xl text-lg text-slate-600">
          Trois orientations de long terme donnent une direction à laquelle chaque
          décision et chaque euro dépensé se rattachent. Ici, aucune décision n'est
          orpheline : vous voyez toujours <strong>pourquoi</strong> elle existe et{" "}
          <strong>à quoi</strong> elle contribue.
        </p>
      </section>

      {/* Les trois orientations */}
      <section className="space-y-6">
        {orientations.map((o) => {
          const nbDecisions = decisions.filter((d) => d.orientation === o.id).length;
          return (
            <article
              key={o.id}
              id={o.id}
              className={`scroll-mt-32 rounded-2xl border ${o.couleur.bordure} bg-white overflow-hidden`}
            >
              <div className={`${o.couleur.fond} px-6 py-5`}>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className={`h-3 w-3 rounded-full ${o.couleur.point}`} aria-hidden />
                  <h2 className={`text-xl font-semibold ${o.couleur.texte}`}>
                    {o.titre}
                  </h2>
                  <span className="rounded-full bg-white/70 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                    Horizon {o.horizon}
                  </span>
                </div>
                <p className="mt-2 max-w-3xl text-slate-700">{o.resume}</p>
              </div>

              <div className="px-6 py-5 space-y-5">
                {/* La cible chiffrée */}
                <div className="flex items-start gap-3">
                  <Target className={`mt-0.5 h-5 w-5 shrink-0 ${o.couleur.texte}`} />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Cible mesurable
                    </p>
                    <p className="text-slate-800">{o.cible}</p>
                  </div>
                </div>

                {/* Le lien montant */}
                <div>
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
                    <ArrowUp className="h-3.5 w-3.5" />
                    Ce à quoi cette orientation se rattache, au-dessus
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
                    {[
                      { niveau: "Régional", texte: o.rattachement.regional },
                      { niveau: "National", texte: o.rattachement.national },
                      { niveau: "Européen", texte: o.rattachement.europeen },
                    ].map((r, i) => (
                      <div key={r.niveau} className="flex flex-1 items-center gap-2">
                        <div className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                          <p className="text-xs font-semibold text-slate-500">{r.niveau}</p>
                          <p className="text-sm text-slate-700">{r.texte}</p>
                        </div>
                        {i < 2 && (
                          <ArrowRight className="hidden h-4 w-4 shrink-0 text-slate-300 sm:block" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href="/decisions"
                  className={`inline-flex items-center gap-1.5 text-sm font-medium ${o.couleur.texte} hover:underline`}
                >
                  Voir les {nbDecisions} décisions rattachées
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          );
        })}
      </section>

      {/* Ce que l'app ne fait pas — fidèle au document */}
      <section className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-5">
        <h2 className="text-sm font-semibold text-slate-900">
          Ce que cette application ne fait pas
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Pas de score agrégé, pas de note unique, pas de classement des élus. On
          publie des faits reliés à des orientations, et l'on laisse chacun juger.
          Un chiffre agrégé transformerait un outil de transparence en arme
          partisane.
        </p>
      </section>

      <DataExportBar
        nomFichier="cap-communal.json"
        libelle="Le cap communal et ses rattachements sont ouverts."
        data={orientations}
      />
    </div>
  );
}
