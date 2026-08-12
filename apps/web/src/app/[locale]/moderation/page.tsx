import { notFound } from 'next/navigation';
import { dictionnaire, estLocale, type Locale } from '@/i18n';
import { QUESTIONS } from '@/contenu/commune';

/**
 * « Comment la modération décide ».
 *
 * Quatre obligations, implémentées et affichées : critères publiés et
 * versionnés, aucun refus automatique définitif, tout refus motivé et
 * susceptible de recours, registre public mensuel.
 *
 * Inspiration assumée : Decidim et CONSUL Democracy, dont la logique de
 * modération est éprouvée en mairie réelle. On reprend le modèle, pas le
 * produit.
 */

const VERSION_CRITERES = '2026-08-12';

const CRITERES = [
  {
    critere: 'La question porte sur un acte, une initiative ou un budget identifié',
    pourquoi:
      'La plateforme n’est pas un forum. Une question sans objet public identifiable n’a pas de destinataire, et donc pas de réponse possible.',
  },
  {
    critere: 'La question ne vise aucune personne nommément',
    pourquoi:
      'On mesure des dispositifs, des budgets, des délais — jamais un agent, jamais un élu. Une question peut viser une fonction, jamais un nom.',
  },
  {
    critere: 'La question ne contient aucune donnée personnelle d’un tiers',
    pourquoi: 'Adresse, situation familiale, santé : publier une question, c’est publier ce qu’elle contient.',
  },
  {
    critere: 'La question est formulée sans injure ni imputation diffamatoire',
    pourquoi: 'Un fait établi peut être rappelé avec sa source ; une accusation sans source ne se publie pas.',
  },
  {
    critere: 'La question n’est pas un doublon d’une question déjà publiée',
    pourquoi:
      'Les questions quasi identiques sont regroupées : la similarité propose, un humain confirme. Le compteur « j’ai la même question » sert exactement à cela.',
  },
];

export default async function PageModeration({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!estLocale(locale)) notFound();
  const l = locale as Locale;
  const d = dictionnaire(l);

  const recues = QUESTIONS.length;
  const publiees = QUESTIONS.filter((q) => q.etatModeration === 'publiee').length;
  const ecartees = QUESTIONS.filter((q) => q.etatModeration === 'ecartee').length;

  return (
    <div className="contenu max-w-2xl py-10 md:py-14">
      <h1 className="text-[28px] font-semibold tracking-tight md:text-[32px]">{d.moderationPage.titre}</h1>
      <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-[var(--pc-encre-douce)]">
        {d.moderationPage.intro}
      </p>
      <p className="chiffre mt-2 text-[12.5px] text-[var(--pc-encre-tenue)]">
        Version des critères : {VERSION_CRITERES}
      </p>

      <h2 className="mt-9 text-[19px] font-semibold tracking-tight">Les critères</h2>
      <ol className="mt-4 space-y-3">
        {CRITERES.map((c, i) => (
          <li key={c.critere} className="rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] px-4 py-3.5">
            <p className="flex gap-2.5 text-[14.5px] font-medium">
              <span
                aria-hidden
                className="chiffre mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--pc-fond-enfonce)] text-[11px] font-semibold"
              >
                {i + 1}
              </span>
              {c.critere}
            </p>
            <p className="mt-1.5 pl-[30px] text-[13px] text-[var(--pc-encre-douce)]">{c.pourquoi}</p>
          </li>
        ))}
      </ol>

      <h2 className="mt-10 text-[19px] font-semibold tracking-tight">Les quatre garanties</h2>
      <ul className="mt-4 space-y-2.5 text-[14px] leading-relaxed text-[var(--pc-encre-douce)]">
        <li>
          <strong className="font-semibold text-[var(--pc-encre)]">Les critères sont publiés et versionnés.</strong>{' '}
          Cette page en est la publication ; chaque modification est datée et l’ancienne version reste consultable dans
          l’historique du dépôt.
        </li>
        <li>
          <strong className="font-semibold text-[var(--pc-encre)]">{d.moderationPage.aucunRefusAutomatique}</strong> Un
          filtre automatique peut mettre une question en attente ; il ne peut pas la refuser.
        </li>
        <li>
          <strong className="font-semibold text-[var(--pc-encre)]">{d.moderationPage.recours}.</strong> Le motif est
          communiqué à l’auteur, et le recours est ouvert pendant trente jours à compter de la décision.
        </li>
        <li>
          <strong className="font-semibold text-[var(--pc-encre)]">Un registre public mensuel.</strong> Les motifs sont
          publiés ; le texte des questions refusées ne l’est pas — le publier reviendrait à diffuser ce qu’on a refusé
          de diffuser.
        </li>
      </ul>

      <h2 className="mt-10 text-[19px] font-semibold tracking-tight">{d.moderationPage.registreMensuel}</h2>
      <table className="mt-3 w-full text-[13.5px]">
        <thead>
          <tr className="border-b border-[var(--pc-trait)] text-left">
            <th scope="col" className="py-2 font-medium">Mois</th>
            <th scope="col" className="py-2 text-right font-medium">{d.moderationPage.recues}</th>
            <th scope="col" className="py-2 text-right font-medium">{d.moderationPage.publiees}</th>
            <th scope="col" className="py-2 text-right font-medium">{d.moderationPage.ecartees}</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-[var(--pc-trait)]">
            <td className="py-2.5">Cumul (démonstration)</td>
            <td className="chiffre py-2.5 text-right">{recues}</td>
            <td className="chiffre py-2.5 text-right">{publiees}</td>
            <td className="chiffre py-2.5 text-right">{ecartees}</td>
          </tr>
        </tbody>
      </table>
      <p className="mt-2 text-[12.5px] text-[var(--pc-encre-tenue)]">
        {d.moderationPage.registreNote} Ces chiffres portent sur les questions de démonstration : le dépôt de
        questions n’est pas ouvert, faute d’une modération humaine dotée. Un service de modération qu’on ne peut pas
        assurer ne s’ouvre pas.
      </p>
    </div>
  );
}
