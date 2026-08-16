import { notFound } from 'next/navigation';
import { CircleCheck, FileCheck2, TriangleAlert } from 'lucide-react';
import { estLocale, formaterDate, type Locale } from '@/i18n';
import { PIECES, RUBRIQUES } from '@/contenu/entreprise';
import { BadgeFictif } from '@/components/achats/puce-statut';

/**
 * Mes pièces.
 *
 * Chaque justificatif porte son objet, sa date, sa validité et les rubriques
 * qu'il appuie. Une pièce périmée fait retomber la rubrique au forfait, et
 * l'écran l'annonce **avant** l'échéance — pas après.
 */
export default async function PagePieces({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!estLocale(locale)) notFound();
  const l = locale as Locale;

  const maintenant = Date.now();
  const pieces = PIECES.map((p) => {
    const jours = Math.ceil((new Date(p.valideJusquau).getTime() - maintenant) / 86_400_000);
    return {
      ...p,
      jours,
      etat: jours < 0 ? ('perimee' as const) : jours < 90 ? ('bientot' as const) : ('valide' as const),
    };
  });

  const libelleRubrique = (cle: string) => {
    const r = RUBRIQUES.find((x) => x.cle === cle);
    return r ? `${r.code} · ${r.intitule}` : cle;
  };

  return (
    <div className="space-y-7">
      <header>
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h1 className="text-[24px] font-semibold tracking-tight md:text-[28px]">Mes pièces</h1>
          <BadgeFictif />
        </div>
        <p className="mt-1.5 max-w-prose text-[13.5px] text-[var(--pc-encre-douce)]">
          Une pièce périmée fait retomber sa rubrique au forfait. L’écran l’annonce avant l’échéance : découvrir la
          chose après coup, en perdant un marché, serait un mauvais service.
        </p>
      </header>

      <ul className="space-y-3">
        {pieces.map((p) => (
          <li
            key={p.id}
            className="carte px-5 py-4"
            style={p.etat === 'bientot' ? { borderColor: 'var(--pc-retard)' } : undefined}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="flex items-start gap-2 text-[14px] font-medium">
                  <FileCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--pc-encre-tenue)]" aria-hidden />
                  {p.objet}
                </p>
                <p className="chiffre mt-1 pl-6 text-[12px] text-[var(--pc-encre-tenue)]">
                  Émise le {formaterDate(p.emiseLe, l)} · valide jusqu’au {formaterDate(p.valideJusquau, l)}
                </p>
              </div>
              <span
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-medium"
                style={{
                  color: p.etat === 'valide' ? 'var(--pc-conforme)' : 'var(--pc-retard)',
                  backgroundColor: p.etat === 'valide' ? 'var(--pc-conforme-fond)' : 'var(--pc-retard-fond)',
                }}
              >
                {p.etat === 'valide' ? (
                  <CircleCheck className="h-3.5 w-3.5" aria-hidden />
                ) : (
                  <TriangleAlert className="h-3.5 w-3.5" aria-hidden />
                )}
                {p.etat === 'valide' ? 'Valide' : p.etat === 'bientot' ? `Expire dans ${p.jours} jours` : 'Périmée'}
              </span>
            </div>

            <p className="mt-3 pl-6 text-[12.5px] text-[var(--pc-encre-douce)]">
              Appuie : {p.rubriques.map(libelleRubrique).join(' · ')}
            </p>

            {p.etat === 'bientot' && (
              <p
                className="mt-2 ml-6 rounded-[var(--pc-rayon)] px-3 py-2 text-[12.5px]"
                style={{ background: 'var(--pc-retard-fond)', color: 'var(--pc-retard)' }}
              >
                Sans renouvellement avant le {formaterDate(p.valideJusquau, l)}, la rubrique{' '}
                {p.rubriques.map(libelleRubrique).join(' et ')} retombe au forfait sur vos marchés en cours.
              </p>
            )}
          </li>
        ))}
      </ul>

      <p className="text-[12.5px] text-[var(--pc-encre-tenue)]">
        Pour une performance matériau, la preuve est la déclaration environnementale de produit vérifiée par tierce
        partie, conforme à la norme européenne applicable, avec des données propres au site de production et non des
        valeurs génériques. Pour les produits de construction, l’enregistrement dans la base fédérale belge des
        déclarations environnementales est obligatoire dès qu’un produit porte un message environnemental : c’est le
        mécanisme de vérification, et il est public.
      </p>
    </div>
  );
}
