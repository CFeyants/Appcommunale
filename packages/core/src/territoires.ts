/**
 * Les territoires branchés, et la couverture réellement déclarée pour chacun.
 *
 * La couverture est une donnée du produit, pas une note de bas de page : un
 * utilisateur de Bruxelles doit savoir en arrivant qu'aucun agrégateur
 * régional n'existe pour les décisions de sa commune (§ 10).
 */

import type { Niveau } from './vocabulaires';

export interface CouvertureNiveau {
  niveau: Niveau;
  /** Nom affiché du pouvoir à ce niveau pour ce territoire. */
  autorite: string;
  /** Le connecteur qui alimente ce niveau, ou null si rien n'est branché. */
  connecteur: string | null;
  etat: 'branche' | 'partiel' | 'non-branche';
  /** Dit en une phrase ce que l'utilisateur obtient, et ce qu'il n'obtient pas. */
  precision: string;
}

export interface TerritoirePilote {
  code: string;
  nom: string;
  nomNl: string;
  codePostal: string;
  region: 'flandre' | 'wallonie' | 'bruxelles';
  /** Commune à facilités : la langue des actes n'est pas celle de la majorité des habitants. */
  facilites: boolean;
  langueDesActes: 'nl' | 'fr';
  population: number;
  populationSource: { organisme: string; annee: number; url: string };
  couverture: CouvertureNiveau[];
}

export const KRAAINEM: TerritoirePilote = {
  code: '23099',
  nom: 'Kraainem',
  nomNl: 'Kraainem',
  codePostal: '1950',
  region: 'flandre',
  facilites: true,
  langueDesActes: 'nl',
  population: 14_078,
  populationSource: {
    organisme: 'Statbel',
    annee: 2025,
    url: 'https://statbel.fgov.be/fr/themes/population/structure-de-la-population',
  },
  couverture: [
    {
      niveau: 'commune',
      autorite: 'Commune de Kraainem',
      connecteur: 'lokaalbeslist',
      etat: 'branche',
      precision:
        "Séances et points d'agenda du collège et du conseil depuis 2021, via Lokaal Beslist. La commune publie la liste des décisions, pas leur motivation : le texte intégral est presque toujours absent à la source.",
    },
    {
      niveau: 'communaute',
      autorite: 'Communauté flamande',
      connecteur: null,
      etat: 'non-branche',
      precision:
        "Aucun flux distinct : en Flandre, la Communauté et la Région partagent le même Parlement et le même Gouvernement. Les actes remontent donc par le niveau régional.",
    },
    {
      niveau: 'region',
      autorite: 'Région flamande',
      connecteur: 'vlaamse-codex',
      etat: 'partiel',
      precision: "Législation flamande consultable ; aucun objectif chiffré n'est publié dans un format exploitable.",
    },
    {
      niveau: 'belgique',
      autorite: 'État fédéral',
      connecteur: null,
      etat: 'non-branche',
      precision:
        "Le Moniteur belge et Justel n'exposent aucune API ouverte documentée. Rien n'est promis tant que rien n'a été testé.",
    },
    {
      niveau: 'europe',
      autorite: 'Union européenne',
      connecteur: 'eurlex-cellar',
      etat: 'branche',
      precision: 'EUR-Lex via CELLAR (SPARQL), sur les actes applicables en Belgique.',
    },
  ],
};

/** Communes voisines comparables, pour la comparaison budgétaire par habitant. */
export const VOISINES_KRAAINEM = [
  { code: '23102', nom: 'Wezembeek-Oppem', population: 14_318 },
  { code: '23096', nom: 'Zaventem', population: 34_657 },
  { code: '23062', nom: 'Tervuren', population: 21_784 },
  { code: '23088', nom: 'Wemmel', population: 16_684 },
  { code: '23064', nom: 'Sint-Genesius-Rode', population: 18_812 },
] as const;

export const TERRITOIRES: TerritoirePilote[] = [KRAAINEM];

export function territoireParCode(code: string): TerritoirePilote | undefined {
  return TERRITOIRES.find((t) => t.code === code);
}
