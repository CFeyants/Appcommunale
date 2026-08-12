import { notFound } from 'next/navigation';
import { BadgeStatut, NombreHeroique } from '@pc/ui';
import { dictionnaire, estLocale, formaterDate, formaterNombre, type Locale } from '@/i18n';
import { chargerEtatSources } from '@/lib/donnees';
import { KRAAINEM } from '@pc/core';

export const dynamic = 'force-dynamic';

/**
 * L'état des sources.
 *
 * « Une plateforme de transparence qui cache ses propres pannes est une
 * contradiction. » Cette page dit la vérité, pannes comprises, et elle est
 * liée depuis le pied de chaque écran.
 */
export default async function PageSources({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!estLocale(locale)) notFound();
  const l = locale as Locale;
  const d = dictionnaire(l);

  const etats = await chargerEtatSources();
  const ok = etats.filter((e) => e.etat === 'ok').length;
  const items = etats.reduce((s, e) => s + e.nombreItems, 0);

  const statut = (e: string) =>
    e === 'ok' ? ('conforme' as const) : e === 'degrade' ? ('en-retard' as const) : e === 'panne' ? ('hors-seuil' as const) : ('non-mesure' as const);
  const mot = (e: string) =>
    e === 'ok' ? d.sources.etatOk : e === 'degrade' ? d.sources.etatDegrade : e === 'panne' ? d.sources.etatPanne : d.sources.etatNonBranche;

  return (
    <div className="contenu py-8 md:py-12">
      <h1 className="sr-only">{d.sources.titre}</h1>
      <NombreHeroique
        valeur={`${ok} / ${etats.length}`}
        legende={d.sources.titre}
        unite="connecteurs opérationnels"
        precision={`${formaterNombre(items, l)} objets collectés au total. ${d.sources.intro}`}
      />

      <ul className="mt-8 space-y-3">
        {etats.map((e) => (
          <li key={e.connecteur} className="carte px-5 py-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-[16px] font-semibold tracking-tight">{e.libelle}</h2>
                <p className="mt-0.5 text-[12.5px] text-[var(--pc-encre-tenue)]">
                  {e.organisme} · {e.licence}
                </p>
              </div>
              <BadgeStatut statut={statut(e.etat)} mot={mot(e.etat)} />
            </div>

            <dl className="mt-3 grid gap-x-8 gap-y-1.5 text-[12.5px] sm:grid-cols-2">
              <Ligne terme={d.sources.derniereCollecte} valeur={e.derniereCollecteReussie ? formaterDate(e.derniereCollecteReussie, l) : 'jamais'} />
              <Ligne terme={d.sources.derniereTentative} valeur={e.derniereTentative ? formaterDate(e.derniereTentative, l) : '—'} />
              <Ligne terme={d.sources.nombreItems} valeur={formaterNombre(e.nombreItems, l)} />
              <Ligne terme={d.sources.cadence} valeur={e.cadence} />
            </dl>

            <p className="mt-2 break-all font-mono text-[11.5px] text-[var(--pc-encre-tenue)]">{e.endpoint}</p>

            {e.raison && (
              <p className="mt-2 text-[12.5px]" style={{ color: 'var(--pc-serieux)' }}>
                {d.sources.raison} : {e.raison}
              </p>
            )}

            {e.limitesConnues.length > 0 && (
              <details className="mt-3">
                <summary className="cursor-pointer text-[12.5px] text-[var(--pc-accent)] underline-offset-2 hover:underline">
                  {d.sources.limites} ({e.limitesConnues.length})
                </summary>
                <ul className="mt-1.5 list-disc space-y-1 pl-4 text-[12.5px] text-[var(--pc-encre-douce)]">
                  {e.limitesConnues.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </details>
            )}
          </li>
        ))}
      </ul>

      {/* --- La couverture déclarée, niveau par niveau --------------------- */}
      <section className="mt-12" aria-labelledby="couverture">
        <h2 id="couverture" className="text-[19px] font-semibold tracking-tight">
          Couverture déclarée pour {KRAAINEM.nom}
        </h2>
        <p className="mt-1.5 max-w-prose text-[13.5px] text-[var(--pc-encre-douce)]">
          Ce que l’utilisateur obtient à chaque niveau, et ce qu’il n’obtient pas. Une lacune se déclare, elle ne se
          contourne pas.
        </p>
        <ul className="mt-4 space-y-2">
          {KRAAINEM.couverture.map((c) => (
            <li key={c.niveau} className="rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-[14px] font-medium">{c.autorite}</span>
                <BadgeStatut
                  statut={c.etat === 'branche' ? 'conforme' : c.etat === 'partiel' ? 'en-retard' : 'non-mesure'}
                  mot={c.etat === 'branche' ? 'Branché' : c.etat === 'partiel' ? 'Partiel' : 'Non branché'}
                />
              </div>
              <p className="mt-1.5 max-w-prose text-[12.5px] text-[var(--pc-encre-douce)]">{c.precision}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Ligne({ terme, valeur }: { terme: string; valeur: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-[var(--pc-trait)] py-1">
      <dt className="text-[var(--pc-encre-douce)]">{terme}</dt>
      <dd className="chiffre">{valeur}</dd>
    </div>
  );
}
