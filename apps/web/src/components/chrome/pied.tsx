import Link from 'next/link';
import type { Dictionnaire } from '@/i18n';
import type { Locale } from '@/i18n';

/**
 * Le pied de page porte ce qui doit rester atteignable depuis n'importe quel
 * écran : l'état des sources, la page de classement, la modération, le
 * vocabulaire, et l'attribution des licences.
 */
export function PiedDePage({ d, locale }: { d: Dictionnaire; locale: Locale }) {
  const liens = [
    { href: '/sources', mot: d.nav.sources },
    { href: '/classement', mot: d.nav.classement },
    // Sœur de « comment le classement fonctionne » : une règle, ses paramètres
    // tels qu'ils sont dans le code, et le fichier où on les lit.
    { href: '/bareme', mot: d.nav.bareme },
    { href: '/admission', mot: d.nav.admission },
    { href: '/moderation', mot: d.nav.moderation },
    { href: '/preferences/deduit', mot: d.nav.croitSavoir },
    { href: '/vie-privee', mot: d.nav.vieePrivee },
  ];

  return (
    <footer className="mt-16 border-t border-[var(--pc-trait)] bg-[var(--pc-fond-enfonce)]">
      <div className="contenu py-8">
        <nav aria-label={d.nav.menu}>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[13px]">
            {liens.map((l) => (
              <li key={l.href}>
                <Link href={`/${locale}${l.href}`} className="text-[var(--pc-encre-douce)] underline-offset-4 hover:underline">
                  {l.mot}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="mt-5 max-w-prose text-[12px] leading-relaxed text-[var(--pc-encre-tenue)]">
          Décisions locales : Lokaal Beslist, Agentschap Binnenlands Bestuur, Modellicentie Gratis Hergebruik.
          Établissements : © les contributeurs d’OpenStreetMap, ODbL 1.0. Énergie : Fluvius. Qualité de l’air :
          IRCEL-CELINE, CC BY 4.0. Actes européens : Office des publications de l’Union européenne.
        </p>
        <p className="mt-3 text-[12px] text-[var(--pc-encre-tenue)]">
          Code sous licence AGPL-3.0. Données brutes exportables sur chaque écran. Ce projet ne dépend
          financièrement d’aucune des institutions qu’il mesure.
        </p>
      </div>
    </footer>
  );
}
