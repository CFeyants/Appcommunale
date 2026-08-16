import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BandeauMaquette, NombreHeroique, Separator } from '@pc/ui';
import { dictionnaire, estLocale, formaterNombre, type Locale } from '@/i18n';
import { chargerEtablissements } from '@/lib/donnees';
import { MesIndicateurs } from '@/components/impact/mes-indicateurs';
import { ListeEntreprises } from '@/components/impact/entreprises';

export default async function PageImpact({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!estLocale(locale)) notFound();
  const l = locale as Locale;
  const d = dictionnaire(l);

  const etabs = await chargerEtablissements();
  const total = etabs?.etablissements.length ?? 0;
  // Aucune entreprise n'a publié : le point d'accès unique européen aux
  // informations de durabilité n'ouvre que le 10 juillet 2027, et il ne
  // couvrira pas les petites entreprises d'une commune de dix mille habitants.
  const declarantes = 0;

  return (
    <div className="contenu py-8 md:py-12">
      <h1 className="sr-only">{d.nav.impactLong}</h1>

      {/* Le nombre héroïque est le compteur de déclarations. Son vide est le
          message de l'écran. */}
      <NombreHeroique
        valeur={`${declarantes} / ${formaterNombre(total, l)}`}
        // La légende était composée de trois fragments et donnait une phrase
        // cassée — « entreprises sur 179 ont publié leurs données ». Le nombre
        // héroïque porte déjà le rapport ; la légende n'a qu'à le nommer.
        legende={d.impact.ontPublie}
        precision={`Aucune entreprise de Kraainem ne publie ses données environnementales. Ce n’est pas un défaut de collecte : ces chiffres n’existent nulle part. Le point d’accès unique européen aux informations de durabilité ouvre le 10 juillet 2027, par vagues, et ne couvrira pas les entreprises d’une commune de dix mille habitants.`}
      />

      {/* Sous-écran, pas un sixième onglet. */}
      <section className="mt-9" aria-labelledby="ce-qui-pese">
        <h2 id="ce-qui-pese" className="text-[19px] font-semibold tracking-tight">
          {d.nav.cePese}
        </h2>
        <p className="mt-1.5 max-w-prose text-[13.5px] text-[var(--pc-encre-douce)]">
          Cet écran laisse une question entière : par quoi commencer ? Un second écran range les gestes par ordre de
          grandeur, dit qui peut réellement les faire, et renvoie vers ce qui les empêche. Il ne calcule rien sur
          vous — il publie ce que disent les études.
        </p>
        <p className="mt-3 text-[13.5px]">
          <Link
            href={`/${l}/impact/ce-qui-pese`}
            className="inline-flex items-center gap-1.5 rounded-[var(--pc-rayon)] border border-[var(--pc-trait-fort)] px-3.5 py-2 hover:bg-[var(--pc-fond-enfonce)]"
          >
            {d.nav.cePese}
          </Link>
        </p>
      </section>

      <MesIndicateurs d={d} locale={l} />

      <Separator className="mt-10" />

      <section className="mt-10" aria-labelledby="entreprises">
        <h2 id="entreprises" className="text-[19px] font-semibold tracking-tight">
          {d.impact.entreprises}
        </h2>

        <div className="mt-3 space-y-2 text-[13.5px] text-[var(--pc-encre-douce)]">
          <p className="max-w-prose">
            <strong className="font-semibold text-[var(--pc-encre)]">L’entreprise est la source, la plateforme est
            le porte-voix.</strong>{' '}
            Une entreprise publie elle-même, contre un schéma ouvert : déclaration signée, périmètre — scopes 1, 2 et
            si possible 3 —, méthode, date, total d’émissions, unités vendues. La plateforme calcule l’intensité par
            produit, un simple quotient présenté comme tel, et n’estime jamais à la place de l’entreprise.
          </p>
          <p className="max-w-prose">
            <strong className="font-semibold text-[var(--pc-encre)]">{d.impact.aucunClassement}</strong> Un classement
            transformerait l’indicateur en cible, et une cible cesse d’être une bonne mesure. La liste ci-dessous est
            en ordre alphabétique.
          </p>
        </div>

        <div className="mt-4 rounded-[var(--pc-rayon)] border border-dashed border-[var(--pc-trait-fort)] bg-[var(--pc-fond-enfonce)] px-4 py-3.5 text-[13px] text-[var(--pc-encre-douce)]">
          <p>
            <strong className="font-semibold text-[var(--pc-encre)]">Sur l’origine de cette liste.</strong> Elle
            devrait venir de la Banque-Carrefour des Entreprises, dont l’extrait ouvert est le seul registre officiel.
            Le téléchargement exige une inscription nominative et un identifiant : le service redirige vers une page
            d’authentification (HTTP 302, vérifié le 12 août 2026). En attendant cet accès, la liste vient
            d’OpenStreetMap, contributive et donc incomplète — {formaterNombre(etabs?.completude.avecAdresse ?? 0, l)}{' '}
            fiches sur {formaterNombre(total, l)} portent une adresse complète.
          </p>
        </div>

        {etabs ? (
          <ListeEntreprises etablissements={etabs.etablissements} completude={etabs.completude} d={d} locale={l} />
        ) : (
          <p className="mt-4 text-[13.5px] text-[var(--pc-encre-tenue)]">La collecte n’a pas encore abouti.</p>
        )}
      </section>

      <Separator className="mt-10" />

      {/* --- L'écran de paiement enrichi, en maquette étiquetée ------------- */}
      <section className="mt-10" aria-labelledby="paiement">
        <h2 id="paiement" className="text-[19px] font-semibold tracking-tight">
          {d.impact.paiementTitre}
        </h2>
        <div className="mt-3">
          <BandeauMaquette
            texte="Cet écran illustre une piste non tranchée : l’entreprise communiquerait le CO₂ dans le message de paiement, et la banque restituerait le rapport. Aucune donnée bancaire n’est lue, aucun appel réseau n’est fait, et cette fonction n’est annoncée nulle part ailleurs dans l’application."
          />
        </div>

        <div className="mt-4 carte px-5 py-4">
          <p className="etiquette text-[var(--pc-encre-tenue)]">Schéma du message de paiement enrichi</p>
          <pre className="mt-2 overflow-x-auto rounded-[var(--pc-rayon)] bg-[var(--pc-fond-enfonce)] p-4 text-[12px] leading-relaxed">
{`{
  "schema": "https://plateforme-citoyenne.be/ns/paiement-enrichi/1",
  "transaction": { "reference": "…", "montantEur": 0, "date": "AAAA-MM-JJ" },
  "empreinte": {
    "co2eGrammes": 0,
    "perimetre": ["scope1", "scope2", "scope3"],
    "methode": "identifiant du référentiel utilisé",
    "declarePar": "numéro d'entreprise BCE",
    "verifiePar": null
  }
}`}
          </pre>
          <p className="mt-3 max-w-prose text-[12.5px] text-[var(--pc-encre-douce)]">
            Le schéma complet est documenté dans <code className="font-mono">/docs/paiement-enrichi.md</code>. Il n’est
            branché à aucune banque : aucune norme de messagerie de paiement ne transporte aujourd’hui un champ
            d’empreinte carbone, et aucun établissement belge ne l’expose.
          </p>
        </div>
      </section>

      <p className="mt-10 text-[12.5px] text-[var(--pc-encre-tenue)]">
        Données brutes de cet écran :{' '}
        <Link href={`/${l}/impact.json`} className="text-[var(--pc-accent)] underline underline-offset-2">
          /{l}/impact.json
        </Link>
        {' · '}© les contributeurs d’OpenStreetMap, ODbL 1.0.
      </p>
    </div>
  );
}
