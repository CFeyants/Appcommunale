import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { commune } from "@/lib/data";

export const metadata: Metadata = {
  title: `Commune de ${commune.nom} — Transparence`,
  description:
    "Pilote communal — application de transparence : le cap, les décisions, le budget et les projets, chacun relié à une orientation de long terme.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 py-8">
          {children}
        </main>
        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 text-sm text-slate-500 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
            <p>
              Commune de {commune.nom} · {commune.habitants.toLocaleString("fr-BE")} habitants ·
              données mises à jour le {commune.miseAJour}
            </p>
            <p className="text-slate-400">
              Maquette de démonstration — données fictives · Brique 1 du pilote communal
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
