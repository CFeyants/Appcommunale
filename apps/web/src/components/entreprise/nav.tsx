'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ClipboardList, FileCheck2, FlaskConical, Gauge, LayoutDashboard, Scale } from 'lucide-react';
import { cn } from '@pc/ui';
import type { Dictionnaire, Locale } from '@/i18n';

/**
 * La navigation latérale de l'espace entreprise.
 *
 * Elle n'ajoute rien à la barre citoyenne, qui reste à cinq entrées : c'est une
 * navigation propre à un autre espace, pas un sixième onglet.
 */
const ENTREES = [
  { href: '', libelle: 'Tableau de bord', icone: LayoutDashboard },
  { href: '/declaration', libelle: 'Ma déclaration', icone: ClipboardList },
  { href: '/marches', libelle: 'Mes marchés', icone: Gauge },
  { href: '/simulateur', libelle: 'Le simulateur', icone: FlaskConical },
  { href: '/pieces', libelle: 'Mes pièces', icone: FileCheck2 },
  { href: '/bonus-malus', libelle: 'Bonus-malus', icone: Scale, nonBranche: true },
] as const;

export function NavEntreprise({ d, locale }: { d: Dictionnaire; locale: Locale }) {
  const pathname = usePathname();
  const base = `/${locale}/entreprise`;

  return (
    <nav aria-label={d.nav.espaceEntreprise}>
      <ul className="flex gap-1 overflow-x-auto md:flex-col md:gap-0.5 md:overflow-visible">
        {ENTREES.map(({ href, libelle, icone: Icone, ...reste }) => {
          const cible = base + href;
          const actif = href === '' ? pathname === base : pathname.startsWith(cible);
          return (
            <li key={href}>
              <Link
                href={cible}
                aria-current={actif ? 'page' : undefined}
                className={cn(
                  'flex shrink-0 items-center gap-2 whitespace-nowrap rounded-[var(--pc-rayon)] px-3 py-2 text-[13.5px] transition-colors',
                  actif
                    ? 'bg-[var(--pc-accent-doux)] font-medium text-[var(--pc-accent-encre)]'
                    : 'text-[var(--pc-encre-douce)] hover:bg-[var(--pc-fond-enfonce)]',
                )}
              >
                <Icone className="h-4 w-4 shrink-0" aria-hidden />
                {libelle}
                {'nonBranche' in reste && reste.nonBranche && (
                  <span
                    className="ml-auto hidden rounded-full border border-dashed px-1.5 text-[9.5px] uppercase md:inline"
                    style={{ color: 'var(--pc-retard)', borderColor: 'var(--pc-retard)' }}
                  >
                    non branché
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
