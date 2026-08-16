import { notFound } from 'next/navigation';
import { bonusMalus } from '@pc/core';
import { BandeauMaquette } from '@pc/ui';
import { estLocale, formaterEuros, formaterNombre, type Locale } from '@/i18n';
import { ENTREPRISE, ID_ENTREPRISE_DANS_SECTEUR, SECTEUR_DEMONSTRATION } from '@/contenu/entreprise';

/**
 * Le bonus-malus sectoriel — **non branché**.
 *
 * Ce dispositif n'est pas communal : une commune n'a ni le périmètre, ni la
 * base légale, ni la légitimité pour redistribuer entre entreprises. L'échelon
 * est le secteur, et la caisse naturelle est le fonds de sécurité d'existence.
 *
 * Il est donc implémenté exactement comme l'écran du message de paiement
 * enrichi de /fr/impact : une maquette qui illustre une piste non tranchée,
 * marquée « non branché », sans appel réseau, et **non annoncée ailleurs dans
 * l'application** — seule la navigation latérale de cet espace y mène.
 */
export default async function PageBonusMalus({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!estLocale(locale)) notFound();
  const l = locale as Locale;

  const valeurUnitaire = 250;
  const resultat = bonusMalus([...SECTEUR_DEMONSTRATION], valeurUnitaire);
  const moi = resultat.soldes.find((s) => s.id === ID_ENTREPRISE_DANS_SECTEUR)!;
  const partDuChiffreAffaires = Math.abs(moi.soldeEur) / ENTREPRISE.chiffreAffairesEur;
  const ecartRelatif = (moi.ecartALaReference / resultat.reference) * 100;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-[24px] font-semibold tracking-tight md:text-[28px]">Le bonus-malus sectoriel</h1>
        <div className="mt-3">
          <BandeauMaquette
            texte="Ce dispositif n’est pas communal : une commune n’a ni le périmètre, ni la base légale, ni la légitimité pour redistribuer entre entreprises. L’échelon est le secteur, et la caisse naturelle est le fonds de sécurité d’existence. Cette page montre le calcul et sa propriété ; elle n’est branchée à rien, et n’est annoncée nulle part ailleurs dans l’application."
          />
        </div>
      </header>

      {/* --- La propriété qui définit le dispositif ----------------------- */}
      <section
        className="rounded-[var(--pc-rayon)] border px-5 py-4"
        style={{ borderColor: 'var(--pc-accent)', background: 'var(--pc-accent-doux)' }}
        aria-labelledby="somme-nulle"
      >
        <h2 id="somme-nulle" className="text-[15px] font-semibold">
          La somme est nulle, et c’est ce qui en fait une redistribution
        </h2>
        <p className="mt-2 text-[13px] text-[var(--pc-encre-douce)]">
          Ce que versent les uns est reçu par les autres, à l’euro comme au centime. Le dispositif redistribue à
          l’intérieur d’un secteur : il ne prélève rien. Cette propriété n’est pas une intention, c’est un test —
          il vérifie que la somme des soldes vaut exactement zéro, sur des valeurs choisies pour tomber mal.
        </p>
        <p className="chiffre mt-3 text-[15px] font-semibold">
          Somme des huit soldes : {formaterEuros(resultat.soldes.reduce((s, x) => s + x.soldeEur, 0), l)}
        </p>
        <p className="mt-1 text-[12px] text-[var(--pc-encre-tenue)]">
          Elle est nulle parce que la référence du secteur est la moyenne des intensités <strong>pondérée par les
          volumes</strong>. Toute autre définition de la référence ferait du dispositif un impôt déguisé.
        </p>
      </section>

      {/* --- L'effet sur une entreprise type ------------------------------ */}
      <section aria-labelledby="effet">
        <h2 id="effet" className="text-[18px] font-semibold tracking-tight">
          L’effet sur cette entreprise
        </h2>
        <dl className="mt-3 grid gap-px overflow-hidden rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] bg-[var(--pc-trait)] sm:grid-cols-3">
          <div className="bg-[var(--pc-fond-eleve)] px-4 py-3">
            <dt className="text-[11.5px] text-[var(--pc-encre-tenue)]">Écart à la référence</dt>
            <dd className="chiffre mt-0.5 text-[18px] font-semibold">
              {ecartRelatif > 0 ? '+' : ''}
              {formaterNombre(ecartRelatif, l, 1)} %
            </dd>
          </div>
          <div className="bg-[var(--pc-fond-eleve)] px-4 py-3">
            <dt className="text-[11.5px] text-[var(--pc-encre-tenue)]">Solde annuel</dt>
            <dd
              className="chiffre mt-0.5 text-[18px] font-semibold"
              style={{ color: moi.soldeEur < 0 ? 'var(--pc-conforme)' : 'var(--pc-retard)' }}
            >
              {formaterEuros(moi.soldeEur, l)}
            </dd>
          </div>
          <div className="bg-[var(--pc-fond-eleve)] px-4 py-3">
            <dt className="text-[11.5px] text-[var(--pc-encre-tenue)]">Part du chiffre d’affaires</dt>
            <dd className="chiffre mt-0.5 text-[18px] font-semibold">
              {formaterNombre(partDuChiffreAffaires * 100, l, 2)} %
            </dd>
          </div>
        </dl>

        <ol className="mt-3 space-y-1 rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] bg-[var(--pc-fond-enfonce)] px-4 py-3 text-[12.5px] text-[var(--pc-encre-douce)]">
          {moi.chaine.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ol>
      </section>

      {/* --- Le secteur entier, sans rang ni nom -------------------------- */}
      <section aria-labelledby="secteur">
        <h2 id="secteur" className="text-[18px] font-semibold tracking-tight">
          Le secteur entier
        </h2>
        <p className="mt-1.5 text-[13px] text-[var(--pc-encre-douce)]">
          Huit entreprises, identifiants opaques, **aucun rang, aucun nom**. L’ordre d’affichage est celui des
          identifiants, pas celui des soldes : un classement transformerait l’indicateur en cible.
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[26rem] text-[13px]">
            <thead>
              <tr className="border-b border-[var(--pc-trait)] text-left">
                <th scope="col" className="py-2 font-medium">Entreprise</th>
                <th scope="col" className="py-2 text-right font-medium">Intensité</th>
                <th scope="col" className="py-2 text-right font-medium">Écart</th>
                <th scope="col" className="py-2 text-right font-medium">Solde</th>
              </tr>
            </thead>
            <tbody>
              {resultat.soldes.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-[var(--pc-trait)]"
                  style={s.id === ID_ENTREPRISE_DANS_SECTEUR ? { fontWeight: 600 } : undefined}
                >
                  <td className="py-2">
                    {s.id}
                    {s.id === ID_ENTREPRISE_DANS_SECTEUR && (
                      <span className="ml-2 text-[11px] font-normal text-[var(--pc-encre-tenue)]">vous</span>
                    )}
                  </td>
                  <td className="chiffre py-2 text-right">
                    {formaterNombre(SECTEUR_DEMONSTRATION.find((e) => e.id === s.id)!.intensite, l, 3)}
                  </td>
                  <td className="chiffre py-2 text-right">{formaterNombre(s.ecartALaReference, l, 3)}</td>
                  <td
                    className="chiffre py-2 text-right"
                    style={{ color: s.soldeEur < 0 ? 'var(--pc-conforme)' : 'var(--pc-retard)' }}
                  >
                    {formaterEuros(s.soldeEur, l)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="py-2 font-medium" colSpan={3}>
                  Somme
                </td>
                <td className="chiffre py-2 text-right font-semibold">
                  {formaterEuros(resultat.soldes.reduce((s, x) => s + x.soldeEur, 0), l)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <p className="chiffre mt-2 text-[12px] text-[var(--pc-encre-tenue)]">
          Référence du secteur : {formaterNombre(resultat.reference, l, 4)} · valeur unitaire{' '}
          {formaterEuros(valeurUnitaire, l)} par point d’écart et par unité de volume.
        </p>
      </section>
    </div>
  );
}
