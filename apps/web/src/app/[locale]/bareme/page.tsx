import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink, TriangleAlert } from 'lucide-react';
import {
  ANCRAGES_CARBONE,
  CE_QUE_LE_BAREME_NE_FAIT_PAS,
  FORFAITS_SECTORIELS,
  HISTORIQUE_BAREME,
  LIBELLE_STATUT,
  ORIGINE_CARBONE,
  PARAMETRES_SEUIL,
  PLAFOND_JOURS_ACCIDENT,
  POIDS_ACCIDENT,
  PRIX_QUOTA_ETS,
  seuilDeclaration,
  trajectoireCarbone,
  VERSION_BAREME,
  type OrigineValeur,
} from '@pc/core';
import { dictionnaire, estLocale, formaterDate, formaterEuros, formaterNombre, type Locale } from '@/i18n';
import { PuceStatut } from '@/components/achats/puce-statut';

/**
 * « Le barème du coût complet ».
 *
 * Sœur de /fr/classement, dans la couche de transparence du pied de page, et
 * dans le même format : une règle, ses paramètres tels qu'ils sont dans le
 * code, et le fichier où on les lit.
 */
export default async function PageBareme({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!estLocale(locale)) notFound();
  const l = locale as Locale;
  const d = dictionnaire(l);

  const annee = new Date().getFullYear();
  const trajectoire = trajectoireCarbone(annee, 3);
  const seuil = seuilDeclaration(PARAMETRES_SEUIL.coutAnnualiseDeclarationEur, PARAMETRES_SEUIL.tauxImpactMoyen);

  return (
    <div className="contenu max-w-2xl py-10 md:py-14">
      <h1 className="text-[28px] font-semibold tracking-tight md:text-[32px]">{d.nav.bareme}</h1>
      <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-[var(--pc-encre-douce)]">
        Le barème applique une règle publiée à des quantités déclarées ou forfaitaires, pour chiffrer en euros ce
        qu’un marché coûte au-delà de son prix. Comme pour le classement du fil, ses paramètres sont ici, tels qu’ils
        sont dans le code.
      </p>
      <p className="chiffre mt-2 text-[12.5px] text-[var(--pc-encre-tenue)]">
        Version {VERSION_BAREME} · lu dans <code className="font-mono">packages/core/src/bareme.ts</code>
      </p>

      {/* --- Ce que le barème ne fait pas ---------------------------------- */}
      <div className="mt-7 rounded-[var(--pc-rayon)] border border-[var(--pc-accent)] bg-[var(--pc-accent-doux)] px-5 py-4">
        <h2 className="text-[15px] font-semibold">Ce que le barème ne fait pas</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-[13.5px] text-[var(--pc-encre-douce)]">
          {CE_QUE_LE_BAREME_NE_FAIT_PAS.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <p className="mt-3 text-[13px] text-[var(--pc-encre-douce)]">
          <strong className="font-semibold text-[var(--pc-encre)]">Le forfait porte sur un contrat, jamais sur une
          personne morale.</strong>{' '}
          Ce n’est pas une estimation de ce que fait telle entreprise : c’est le prix qu’un acheteur applique à un
          marché en l’absence de déclaration. Sur la fiche publique d’une entreprise, « n’a rien déclaré » reste
          « n’a rien déclaré » — aucun chiffre forfaitaire n’y figure, ni en gris, ni entre parenthèses.
        </p>
      </div>

      {/* --- La valeur du carbone ------------------------------------------ */}
      <h2 className="mt-10 text-[19px] font-semibold tracking-tight">La valeur publique du carbone</h2>
      <p className="mt-2 max-w-prose text-[14px] text-[var(--pc-encre-douce)]">
        C’est une valeur de politique publique servant à l’analyse coûts-bénéfices, pas un prix de marché. Les années
        d’ancrage sont publiées ; les années intercalaires sont interpolées linéairement, et l’interpolation est
        marquée <em>calculé</em> — le nombre affiché pour {annee} n’a été publié par personne, seule la droite qui le
        produit l’a été.
      </p>

      <table className="mt-4 w-full text-[13.5px]">
        <caption className="sr-only">Valeurs d’ancrage de la valeur publique du carbone</caption>
        <thead>
          <tr className="border-b border-[var(--pc-trait)] text-left">
            <th scope="col" className="py-2 font-medium">Année d’ancrage</th>
            <th scope="col" className="py-2 text-right font-medium">€ / tCO₂e</th>
            <th scope="col" className="py-2 pl-4 font-medium">Statut</th>
          </tr>
        </thead>
        <tbody>
          {ANCRAGES_CARBONE.map((a) => (
            <tr key={a.annee} className="border-b border-[var(--pc-trait)]">
              <td className="chiffre py-2">{a.annee}</td>
              <td className="chiffre py-2 text-right font-medium">{formaterNombre(a.euroParTonne, l)}</td>
              <td className="py-2 pl-4"><PuceStatut statut="publie" /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <Origine origine={ORIGINE_CARBONE} locale={l} />

      <h3 className="mt-6 text-[15px] font-semibold">La trajectoire annoncée à trois ans</h3>
      <p className="mt-1.5 max-w-prose text-[13.5px] text-[var(--pc-encre-douce)]">
        Elle est affichée partout où un investissement se décide : une mesure rentable contre la valeur d’aujourd’hui
        peut ne plus l’être contre celle de {annee + 3}.
      </p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {trajectoire.map((v) => (
          <li
            key={v.annee}
            className="rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] px-3 py-2 text-[13px]"
          >
            <span className="chiffre block font-semibold">{v.euroParTonne} €/t</span>
            <span className="chiffre block text-[11.5px] text-[var(--pc-encre-tenue)]">{v.annee}</span>
            <PuceStatut statut={v.statut} className="mt-1" />
          </li>
        ))}
      </ul>

      {/* --- Le résidu ------------------------------------------------------ */}
      <h2 className="mt-10 text-[19px] font-semibold tracking-tight">Le carbone déjà tarifé ailleurs</h2>
      <div className="mt-2 space-y-3 text-[14px] leading-relaxed text-[var(--pc-encre-douce)]">
        <p>
          Une partie du carbone d’un marché a déjà été payée : l’électricité est couverte par le système européen de
          quotas. L’afficher sans le dire laisserait croire à un double comptage.
        </p>
        <p className="rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] bg-[var(--pc-fond-enfonce)] px-4 py-3">
          <strong className="font-semibold text-[var(--pc-encre)]">La règle : on soustrait le prix acquitté, on ne
          retire jamais la ligne.</strong>{' '}
          La valeur applicable à un poste vaut la valeur publique <em>moins</em> le prix carbone déjà payé sur ce
          poste — et rien d’autre. Retirer un poste entier du total parce qu’il serait « déjà tarifé » ferait
          disparaître le plus gros gisement de la commune du classement des leviers. Une ligne totalement couverte
          s’affiche avec un résidu nul et le prix déjà payé en regard, jamais avec une absence.
        </p>
        <p>
          Le gaz de chauffage des bâtiments n’est couvert par rien avant 2028 : son résidu est la valeur publique
          entière. C’est ce qui en fait le premier poste de la commune.
        </p>
      </div>

      <dl className="mt-4 rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] px-4 py-3 text-[13.5px]">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <dt className="font-medium">{PRIX_QUOTA_ETS.libelle}</dt>
          <dd className="chiffre font-semibold">
            {formaterNombre(PRIX_QUOTA_ETS.montant, l)} {PRIX_QUOTA_ETS.unite}
          </dd>
        </div>
        <dd className="mt-1"><PuceStatut statut={PRIX_QUOTA_ETS.statut} /></dd>
      </dl>
      <Origine origine={PRIX_QUOTA_ETS.origine} locale={l} />

      {/* --- Les forfaits --------------------------------------------------- */}
      <h2 className="mt-10 text-[19px] font-semibold tracking-tight">Les forfaits sectoriels</h2>
      <p className="mt-2 max-w-prose text-[14px] text-[var(--pc-encre-douce)]">
        En l’absence de quantité déclarée, le forfait s’applique. Il est <strong>toujours défavorable par
        construction</strong> — au quantile haut de la branche, jamais à la moyenne — sinon le silence deviendrait une
        stratégie. Et il est toujours tiré d’une source publiée et datée, jamais calculé par la plateforme.
      </p>

      <div
        className="mt-3 flex items-start gap-2.5 rounded-[var(--pc-rayon)] border border-dashed px-4 py-3 text-[13px]"
        style={{ borderColor: 'var(--pc-retard)', color: 'var(--pc-retard)' }}
      >
        <TriangleAlert className="mt-px h-4 w-4 shrink-0" aria-hidden />
        <span>
          <strong className="font-semibold">Les quatre forfaits ci-dessous sont fictifs.</strong> Aucune
          administration belge ne publie de forfait sectoriel par poste au quantile haut de la branche. Le barème
          publie la règle ; les valeurs restent des valeurs de démonstration tant que la source n’existe pas.
        </span>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[30rem] text-[13px]">
          <thead>
            <tr className="border-b border-[var(--pc-trait)] text-left">
              <th scope="col" className="py-2 pr-3 font-medium">Secteur</th>
              <th scope="col" className="py-2 pr-3 font-medium">Poste</th>
              <th scope="col" className="py-2 pr-3 text-right font-medium">Forfait</th>
              <th scope="col" className="py-2 font-medium">Quantile</th>
            </tr>
          </thead>
          <tbody>
            {FORFAITS_SECTORIELS.map((f) => (
              <tr key={f.cle} className="border-b border-[var(--pc-trait)] align-top">
                <td className="py-2 pr-3">{f.secteur}</td>
                <td className="py-2 pr-3 text-[var(--pc-encre-douce)]">{f.poste}</td>
                <td className="chiffre py-2 pr-3 text-right whitespace-nowrap">
                  {formaterNombre(f.quantite, l, f.quantite < 10 ? 1 : 0)}{' '}
                  <span className="text-[11px] text-[var(--pc-encre-tenue)]">{f.unite}</span>
                </td>
                <td className="py-2 text-[12px] text-[var(--pc-encre-tenue)]">{f.quantile}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Le seuil ------------------------------------------------------- */}
      <h2 className="mt-10 text-[19px] font-semibold tracking-tight">Le seuil de déclaration</h2>
      <p className="mt-2 max-w-prose text-[14px] text-[var(--pc-encre-douce)]">
        <strong className="font-semibold text-[var(--pc-encre)]">Le seuil se calcule, il ne se décide pas.</strong>{' '}
        Sous ce montant, exiger une déclaration coûterait à l’entreprise plus que l’impact qu’on cherche à réduire.
        Voici le calcul, pas seulement le nombre.
      </p>
      <ol className="mt-3 space-y-1.5 rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] bg-[var(--pc-fond-enfonce)] px-4 py-3 text-[13px] text-[var(--pc-encre-douce)]">
        {seuil.chaine.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ol>
      <p className="chiffre mt-3 text-[15px] font-semibold">
        Seuil retenu : {formaterEuros(Math.round(seuil.seuilEur / 1000) * 1000, l)} de marché annuel
      </p>
      <p className="mt-1 text-[12.5px] text-[var(--pc-encre-tenue)]">
        Les deux entrées du calcul sont des paramètres du barème. Le coût annualisé d’une déclaration est une valeur
        de démonstration : aucune source publiée ne le chiffre pour la Belgique.
      </p>

      {/* --- L'indice d'accident -------------------------------------------- */}
      <h2 className="mt-10 text-[19px] font-semibold tracking-tight">L’indice d’accident</h2>
      <p className="mt-2 max-w-prose text-[14px] text-[var(--pc-encre-douce)]">
        (nombre d’accidents × {POIDS_ACCIDENT} + jours d’incapacité, chaque accident plafonné à{' '}
        {PLAFOND_JOURS_ACCIDENT} jours) ÷ équivalents temps plein, sur une <strong>moyenne de trois ans</strong>.
        Une seule année de sinistralité est du bruit, pas une mesure : sous trois ans, aucun indice n’est calculé.
        Les intérimaires et les sous-traitants présents sur site comptent au dénominateur, sinon externaliser le
        risque améliorerait l’indice.
      </p>

      {/* --- L'historique ---------------------------------------------------- */}
      <h2 className="mt-10 text-[19px] font-semibold tracking-tight">Historique des versions</h2>
      <ul className="mt-3 space-y-2">
        {HISTORIQUE_BAREME.map((h) => (
          <li key={h.version} className="rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] px-4 py-3 text-[13px]">
            <p className="chiffre font-semibold">
              {h.version} — {formaterDate(h.le, l)}
            </p>
            <p className="mt-1 text-[var(--pc-encre-douce)]">{h.quoi}</p>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-[13px]">
        <Link href={`/${l}/budget/achats`} className="text-[var(--pc-accent)] underline underline-offset-2">
          Voir le barème appliqué aux marchés de la commune
        </Link>
        {' · '}
        <Link href={`/${l}/bareme.json`} className="text-[var(--pc-accent)] underline underline-offset-2">
          Données brutes de cet écran
        </Link>
      </p>
    </div>
  );
}

function Origine({ origine, locale }: { origine: OrigineValeur; locale: Locale }) {
  return (
    <div className="mt-2.5 rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] bg-[var(--pc-fond-enfonce)] px-4 py-3 text-[12.5px] text-[var(--pc-encre-douce)]">
      <p>
        <span className="font-medium text-[var(--pc-encre)]">{origine.organisme}</span> — {origine.reference}
      </p>
      <p className="chiffre mt-1 text-[var(--pc-encre-tenue)]">
        Relevé le {formaterDate(origine.releveLe, locale)} ·{' '}
        {origine.verifieParAppel ? 'vérifié par appel automatisé' : 'relevé manuel, non vérifié par appel'}
      </p>
      {origine.pourquoi && <p className="mt-1 text-[var(--pc-encre-tenue)]">{origine.pourquoi}</p>}
      {origine.url && (
        <p className="mt-1">
          <a
            href={origine.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[var(--pc-accent)] underline underline-offset-2"
          >
            vérifier à la source <ExternalLink className="h-3 w-3" aria-hidden />
          </a>
        </p>
      )}
    </div>
  );
}
