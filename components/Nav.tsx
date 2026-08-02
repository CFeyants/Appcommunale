"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, ListChecks, Wallet, HardHat, Database } from "lucide-react";
import { commune } from "@/lib/data";

const liens = [
  { href: "/", label: "Le cap", icon: Compass },
  { href: "/decisions", label: "Décisions", icon: ListChecks },
  { href: "/budget", label: "Budget", icon: Wallet },
  { href: "/projets", label: "Projets", icon: HardHat },
  { href: "/donnees", label: "Données ouvertes", icon: Database },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white font-semibold">
              {commune.nom.charAt(0)}
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-slate-900 group-hover:text-slate-700">
                {commune.nom}
              </span>
              <span className="text-xs text-slate-500">Transparence communale</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {liens.map(({ href, label, icon: Icon }) => {
              const actif = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    actif
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Navigation mobile */}
        <nav className="md:hidden flex items-center gap-1 overflow-x-auto pb-2 -mx-1 px-1">
          {liens.map(({ href, label, icon: Icon }) => {
            const actif = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  actif
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
