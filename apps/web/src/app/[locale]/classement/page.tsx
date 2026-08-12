import { notFound } from 'next/navigation';
import { POIDS, PHRASE_DE_TRI } from '@pc/core';
import { dictionnaire, estLocale, type Locale } from '@/i18n';

const EXPLICATION_POIDS: Record<keyof typeof POIDS, string> = {
  theme: 'Recouvrement entre les thèmes de l’item et ceux que vous avez déclarés suivre, au niveau de pouvoir concerné.',
  public: 'Recouvrement entre les publics visés par l’item et ceux qui découlent de la situation que vous avez saisie — et seulement si vous avez accordé le consentement A.',
  territoire: 'Proximité du niveau de pouvoir : votre commune passe avant votre Région, qui passe avant l’Union.',
  action: 'Un point s’ajoute quand il y a quelque chose à faire. « Aucune action » ne rapporte rien — mais l’item reste affiché.',
  echeance: 'Urgence, en décroissance linéaire sur trente jours. Une échéance passée ne vaut plus rien.',
};

export default async function PageClassement({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!estLocale(locale)) notFound();
  const l = locale as Locale;
  const d = dictionnaire(l);
  const total = Object.values(POIDS).reduce((s, p) => s + p, 0);

  return (
    <div className="contenu max-w-2xl py-10 md:py-14">
      <h1 className="text-[28px] font-semibold tracking-tight md:text-[32px]">{d.classement.titre}</h1>
      <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-[var(--pc-encre-douce)]">{d.classement.intro}</p>

      <h2 className="etiquette mt-9 text-[var(--pc-encre-tenue)]">{d.classement.phrase}</h2>
      <p className="mt-2 rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] bg-[var(--pc-fond-enfonce)] px-4 py-3 text-[14px]">
        {PHRASE_DE_TRI}
      </p>

      <h2 className="etiquette mt-8 text-[var(--pc-encre-tenue)]">{d.classement.poids}</h2>
      <table className="mt-3 w-full text-[13.5px]">
        <thead>
          <tr className="border-b border-[var(--pc-trait)] text-left">
            <th scope="col" className="py-2 pr-4 font-medium">Terme</th>
            <th scope="col" className="py-2 pr-4 text-right font-medium">Poids</th>
            <th scope="col" className="py-2 font-medium">Ce qu’il mesure</th>
          </tr>
        </thead>
        <tbody>
          {(Object.keys(POIDS) as Array<keyof typeof POIDS>).map((k) => (
            <tr key={k} className="border-b border-[var(--pc-trait)] align-top">
              <td className="py-2.5 pr-4 font-mono text-[12.5px]">{k}</td>
              <td className="chiffre py-2.5 pr-4 text-right font-medium">{POIDS[k]}</td>
              <td className="py-2.5 text-[var(--pc-encre-douce)]">{EXPLICATION_POIDS[k]}</td>
            </tr>
          ))}
          <tr>
            <td className="py-2.5 pr-4 font-medium">Score maximal</td>
            <td className="chiffre py-2.5 pr-4 text-right font-semibold">{total}</td>
            <td className="py-2.5 text-[var(--pc-encre-douce)]">
              La pastille affichée sur chaque carte est ce total, ramené sur 100.
            </td>
          </tr>
        </tbody>
      </table>

      <div className="mt-8 space-y-3 text-[14px] leading-relaxed text-[var(--pc-encre-douce)]">
        <p>{d.classement.jamaisCache}</p>
        <p>{d.classement.toutVoirTexte}</p>
        <p>
          <strong className="font-semibold text-[var(--pc-encre)]">Aucune personnalisation implicite.</strong> Deux
          personnes ayant déclaré exactement la même chose voient exactement la même liste, dans le même ordre. À
          score égal, l’acte le plus récent passe devant ; à date égale, l’identifiant tranche. Le tri est donc
          reproductible d’une exécution à l’autre.
        </p>
        <p>
          <strong className="font-semibold text-[var(--pc-encre)]">Sur les intérêts déduits.</strong> Si vous avez
          accordé le consentement B, un centre d’intérêt déduit de vos consultations peut compter — mais il vaut la
          moitié d’un thème que vous avez déclaré. La déclaration reste souveraine, et la carte indique quand un
          intérêt déduit a joué.
        </p>
        <p>
          <strong className="font-semibold text-[var(--pc-encre)]">Ce qui n’entre jamais dans le calcul.</strong> Ni
          le nombre de lectures, ni le nombre de pouces, ni la popularité, ni l’heure à laquelle vous consultez, ni
          quoi que ce soit qu’une autre personne aurait fait. Le code de cette fonction tient en soixante lignes et se
          lit dans <code className="font-mono text-[12.5px]">packages/core/src/pertinence.ts</code>.
        </p>
      </div>
    </div>
  );
}
