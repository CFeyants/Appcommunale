import { notFound } from 'next/navigation';
import { EXPLICATION_MOTIF, MOTIFS_EXCLUSION, PLAFOND_MENSUEL, type MotifExclusion } from '@pc/core';
import { NombreHeroique } from '@pc/ui';
import { dictionnaire, estLocale, formaterNombre, type Locale } from '@/i18n';
import { chargerFil } from '@/lib/donnees';
import { NOMBRE_REFORMULATIONS } from '@/contenu/reformulations';

export const dynamic = 'force-dynamic';

/**
 * « Ce qui entre et ce qui n'entre pas ».
 *
 * La page montre le test d'admission appliqué aux actes réellement collectés,
 * avec le décompte par motif. C'est la garantie que le filtre est une
 * validation exécutée, et non une consigne éditoriale.
 */
export default async function PageAdmission({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!estLocale(locale)) notFound();
  const l = locale as Locale;
  const d = dictionnaire(l);

  const { items, statistiques } = await chargerFil();
  const publies = items.filter((i) => i.admission.publie).length;

  const parMotif = new Map<MotifExclusion, number>();
  for (const i of items) {
    if (i.admission.publie || !i.admission.motif) continue;
    parMotif.set(i.admission.motif, (parMotif.get(i.admission.motif) ?? 0) + 1);
  }

  const parMois = new Map<string, number>();
  for (const i of items) {
    if (!i.admission.publie) continue;
    const m = i.dateActe.slice(0, 7);
    parMois.set(m, (parMois.get(m) ?? 0) + 1);
  }
  const maxMois = Math.max(0, ...parMois.values());

  return (
    <div className="contenu max-w-3xl py-10 md:py-14">
      <h1 className="sr-only">{d.admissionPage.titre}</h1>
      <NombreHeroique
        valeur={`${formaterNombre(publies, l)} / ${formaterNombre(items.length, l)}`}
        legende={d.admissionPage.titre}
        unite="actes retenus"
        precision={d.admissionPage.intro}
      />

      <ol className="mt-8 space-y-3">
        {[d.admissionPage.q1, d.admissionPage.q2, d.admissionPage.q3].map((q, i) => (
          <li key={q} className="flex gap-3 rounded-[var(--pc-rayon)] border border-[var(--pc-trait)] px-4 py-3.5">
            <span
              aria-hidden
              className="chiffre grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--pc-accent)] text-[12px] font-semibold text-white"
            >
              {i + 1}
            </span>
            <span className="text-[14.5px] font-medium">{q}</span>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-[13px] text-[var(--pc-encre-douce)]">
        Un « non » à l’une des trois suffit. Rien n’est supprimé pour autant : l’acte reste au registre avec son motif,
        et dans l’export.
      </p>

      {/* --- Le décompte par motif --------------------------------------- */}
      <h2 className="mt-10 text-[19px] font-semibold tracking-tight">{d.admissionPage.motifs}</h2>
      <table className="mt-4 w-full text-[13.5px]">
        <thead>
          <tr className="border-b border-[var(--pc-trait)] text-left">
            <th scope="col" className="py-2 pr-4 font-medium">Motif</th>
            <th scope="col" className="py-2 pr-4 text-right font-medium">Actes</th>
            <th scope="col" className="py-2 font-medium">Ce qu’il recouvre</th>
          </tr>
        </thead>
        <tbody>
          {MOTIFS_EXCLUSION.map((m) => (
            <tr key={m} className="border-b border-[var(--pc-trait)] align-top">
              <td className="py-2.5 pr-4 font-mono text-[12px]">{m}</td>
              <td className="chiffre py-2.5 pr-4 text-right font-medium">{formaterNombre(parMotif.get(m) ?? 0, l)}</td>
              <td className="py-2.5 text-[12.5px] text-[var(--pc-encre-douce)]">{EXPLICATION_MOTIF[m]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- Les plafonds -------------------------------------------------- */}
      <h2 className="mt-10 text-[19px] font-semibold tracking-tight">{d.admissionPage.plafonds}</h2>
      <p className="mt-2 max-w-prose text-[13.5px] text-[var(--pc-encre-douce)]">{d.admissionPage.plafondsTexte}</p>
      <p className="mt-3 text-[13.5px]">
        Plafond communal : <span className="chiffre font-semibold">{PLAFOND_MENSUEL.commune}</span> items publiés par
        mois. Mois le plus chargé observé : <span className="chiffre font-semibold">{maxMois}</span>. Le plafond n’est
        donc pas atteint — le test d’admission est, à ce jour, plus restrictif que lui.
      </p>

      {/* --- Le coût réel de la reformulation ------------------------------ */}
      <h2 className="mt-10 text-[19px] font-semibold tracking-tight">Le vrai coût, dit sans détour</h2>
      <div className="mt-3 space-y-3 text-[14px] leading-relaxed text-[var(--pc-encre-douce)]">
        <p>
          Sur {formaterNombre(statistiques?.points ?? items.length, l)} points d’agenda collectés en deux ans,{' '}
          {formaterNombre(statistiques?.besluitenResolus ?? 0, l)} portent un acte, et{' '}
          <strong className="font-semibold text-[var(--pc-encre)]">{NOMBRE_REFORMULATIONS}</strong> ont été reformulés
          à la main. Le champ <code className="font-mono text-[12.5px]">impact</code> est rédigé par un humain, contre
          le gabarit « ce qui change · pour qui · à partir de quand ». Un modèle de langage peut proposer ; il ne
          publie jamais.
        </p>
        <p>
          Un acte non reformulé vit dans le registre avec la mention « texte original seulement » et n’apparaît jamais
          dans le fil. C’est ce qui rend le fil court, et c’est voulu : reformuler l’ensemble d’une commune demande une
          personne à temps partiel, pas un algorithme. Le rapport {NOMBRE_REFORMULATIONS} sur{' '}
          {formaterNombre(items.length, l)} est le vrai coût du produit, et il ne faut pas le cacher.
        </p>
        <p>
          Ce que la source ne contient pas et qu’aucune automatisation ne peut deviner : ce qui change, pour qui, et à
          partir de quand. Un intitulé comme « Mobiliteit - Aanvullend reglement » revient six fois le même mois pour
          six décisions différentes.
        </p>
      </div>
    </div>
  );
}
