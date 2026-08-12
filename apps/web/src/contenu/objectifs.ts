/**
 * Les objectifs, écran Vision.
 *
 * Résultat principal de cet écran, et il faut le lire avant le reste : sur les
 * cinq niveaux de pouvoir, **deux seulement** publient des objectifs chiffrés
 * et datés dans un format vérifiable. Les trois autres n'en publient aucun qui
 * réponde aux trois conditions — une cible chiffrée, une échéance, une source
 * citable. C'est affiché comme tel, avec le nom de l'organisme qui devrait les
 * produire.
 *
 * Chaque objectif retenu ci-dessous a été vérifié dans son texte d'origine :
 * un règlement européen, un identifiant ELI, un article. Rien n'est déduit
 * d'une communication de presse.
 */

import type { Niveau, Statut } from '@pc/core';

export interface Genese {
  proposePar?: string;
  procedure?: string;
  consultes?: string[];
  votePar?: string;
  voteLe?: string;
  deliberationUrl?: string;
}

export interface ObjectifAffiche {
  id: string;
  niveau: Niveau;
  horizon: 'long' | 'mandature';
  intitule: string;
  intituleOrigine: string;
  langueOrigine: 'fr' | 'nl' | 'en';
  cible: { valeur: number; unite: string; echeance: string; base?: string };
  rattachements: string[];
  statut: Statut;
  /** Clé de la série mesurée dans /data, ou null quand rien n'est mesuré. */
  serieMesuree: 'ges-belgique' | null;
  prochaineMesure: string;
  genese: Genese;
  source: { organisme: string; url: string; dateDonnee: string; licence: string; article?: string };
}

export const OBJECTIFS: ObjectifAffiche[] = [
  {
    id: 'eu-neutralite-2050',
    niveau: 'europe',
    horizon: 'long',
    intitule: 'Neutralité climatique de l’Union en 2050',
    intituleOrigine:
      'Union-wide climate neutrality by 2050: balance between emissions and removals of greenhouse gases regulated in Union law',
    langueOrigine: 'en',
    cible: { valeur: 0, unite: 'Mt CO₂e nettes', echeance: '2050-12-31' },
    rattachements: [],
    statut: 'non-mesure',
    serieMesuree: null,
    prochaineMesure: 'Inventaire annuel des émissions, publié chaque année en mai.',
    genese: {
      proposePar: 'Commission européenne',
      procedure: 'Procédure législative ordinaire (codécision)',
      consultes: ['Comité économique et social européen', 'Comité européen des régions', 'consultation publique 2019-2020'],
      votePar: 'Parlement européen et Conseil de l’Union européenne',
      voteLe: '2021-06-30',
      deliberationUrl: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32021R1119',
    },
    source: {
      organisme: 'Office des publications de l’Union européenne — EUR-Lex',
      url: 'http://data.europa.eu/eli/reg/2021/1119/oj',
      dateDonnee: '2021-06-30',
      licence: 'Réutilisation autorisée — décision 2011/833/UE',
      article: 'Règlement (UE) 2021/1119, article 2, § 1er',
    },
  },
  {
    id: 'eu-ges-2030',
    niveau: 'europe',
    horizon: 'long',
    intitule: 'Réduire les émissions nettes de l’Union de 55 % d’ici 2030',
    intituleOrigine:
      'A binding Union climate target of a domestic reduction of net greenhouse gas emissions of at least 55 % compared to 1990 levels by 2030',
    langueOrigine: 'en',
    cible: { valeur: -55, unite: '% par rapport à 1990', echeance: '2030-12-31', base: '1990' },
    rattachements: ['eu-neutralite-2050'],
    statut: 'en-retard',
    serieMesuree: 'ges-belgique',
    prochaineMesure: 'Inventaire 2025, attendu en mai 2027.',
    genese: {
      proposePar: 'Commission européenne',
      procedure: 'Procédure législative ordinaire (codécision)',
      consultes: ['Comité économique et social européen', 'Comité européen des régions'],
      votePar: 'Parlement européen et Conseil de l’Union européenne',
      voteLe: '2021-06-30',
      deliberationUrl: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32021R1119',
    },
    source: {
      organisme: 'Office des publications de l’Union européenne — EUR-Lex',
      url: 'http://data.europa.eu/eli/reg/2021/1119/oj',
      dateDonnee: '2021-06-30',
      licence: 'Réutilisation autorisée — décision 2011/833/UE',
      article: 'Règlement (UE) 2021/1119, article 4, § 1er',
    },
  },
  {
    id: 'eu-renouvelables-2030',
    niveau: 'europe',
    horizon: 'long',
    intitule: 'Porter la part des renouvelables à 42,5 % de la consommation d’ici 2030',
    intituleOrigine:
      'Member States shall collectively ensure that the share of energy from renewable sources in the Union’s gross final consumption of energy in 2030 is at least 42,5 %',
    langueOrigine: 'en',
    cible: { valeur: 42.5, unite: '% de la consommation finale brute', echeance: '2030-12-31' },
    rattachements: ['eu-ges-2030'],
    statut: 'non-mesure',
    serieMesuree: null,
    prochaineMesure: 'Statistiques SHARES d’Eurostat, publication annuelle en décembre.',
    genese: {
      proposePar: 'Commission européenne',
      procedure: 'Procédure législative ordinaire (codécision)',
      consultes: ['Comité économique et social européen', 'Comité européen des régions'],
      votePar: 'Parlement européen et Conseil de l’Union européenne',
      voteLe: '2023-10-18',
      deliberationUrl: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32023L2413',
    },
    source: {
      organisme: 'Office des publications de l’Union européenne — EUR-Lex',
      url: 'http://data.europa.eu/eli/dir/2023/2413/oj',
      dateDonnee: '2023-10-18',
      licence: 'Réutilisation autorisée — décision 2011/833/UE',
      article: 'Directive (UE) 2023/2413, article 1er, point 2)',
    },
  },
  {
    id: 'be-esr-2030',
    niveau: 'belgique',
    horizon: 'long',
    intitule: 'Réduire de 47 % les émissions belges hors marché carbone d’ici 2030',
    intituleOrigine:
      'Belgium: −47 % greenhouse gas emissions in 2030 compared to 2005, in the sectors covered by the Effort Sharing Regulation',
    langueOrigine: 'en',
    cible: { valeur: -47, unite: '% par rapport à 2005', echeance: '2030-12-31', base: '2005' },
    rattachements: ['eu-ges-2030'],
    statut: 'non-mesure',
    serieMesuree: null,
    prochaineMesure: 'Rapportage annuel au titre du règlement gouvernance, mars 2027.',
    genese: {
      proposePar: 'Commission européenne',
      procedure: 'Procédure législative ordinaire ; la répartition entre États membres figure à l’annexe I du règlement',
      consultes: [],
      votePar: 'Parlement européen et Conseil de l’Union européenne',
      voteLe: '2023-04-19',
      deliberationUrl: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32023R0857',
    },
    source: {
      organisme: 'Office des publications de l’Union européenne — EUR-Lex',
      url: 'http://data.europa.eu/eli/reg/2023/857/oj',
      dateDonnee: '2023-04-19',
      licence: 'Réutilisation autorisée — décision 2011/833/UE',
      article: 'Règlement (UE) 2023/857, annexe I',
    },
  },
];

/**
 * Ce que chaque niveau publie réellement, et ce qu'il ne publie pas.
 *
 * Cette table est le vrai contenu de l'écran Vision. Elle est écrite à la main
 * parce qu'aucune source ne la produit — c'est précisément le constat.
 */
export interface CouvertureVision {
  niveau: Niveau;
  autorite: string;
  objectifsDatesEtChiffres: number;
  domainesDeCompetence: number;
  /** Renseigné quand le niveau ne publie rien d'exploitable. */
  absence?: { organismeAttendu: string; explication: string; depuis: string };
}

export const COUVERTURE_VISION: CouvertureVision[] = [
  {
    niveau: 'commune',
    autorite: 'Commune de Kraainem',
    objectifsDatesEtChiffres: 0,
    domainesDeCompetence: 14,
    absence: {
      organismeAttendu: 'Commune de Kraainem — service du secrétariat communal',
      depuis: '2019',
      explication:
        'Le plan pluriannuel (meerjarenplan) que toute commune flamande doit adopter n’est publié ni en données ouvertes, ni dans un format qui permette d’en extraire des cibles chiffrées et datées. Lokaal Beslist expose la décision qui l’adopte, pas son contenu.',
    },
  },
  {
    niveau: 'communaute',
    autorite: 'Communauté flamande',
    objectifsDatesEtChiffres: 0,
    domainesDeCompetence: 6,
    absence: {
      organismeAttendu: 'Vlaamse overheid — Departement Kanselarij en Buitenlandse Zaken',
      depuis: '2024',
      explication:
        'La déclaration de gouvernement contient des intentions, pas des cibles chiffrées et datées publiées sous une forme réutilisable. Aucun jeu de données ne les expose.',
    },
  },
  {
    niveau: 'region',
    autorite: 'Région flamande',
    objectifsDatesEtChiffres: 0,
    domainesDeCompetence: 12,
    absence: {
      organismeAttendu: 'Vlaamse overheid — Departement Omgeving',
      depuis: '2021',
      explication:
        'Le plan flamand énergie-climat comporte bien des cibles, mais elles ne sont publiées qu’en PDF, sans identifiant stable ni série de mesures associée. Elles ne peuvent pas être suivies automatiquement, et n’entrent donc pas.',
    },
  },
  { niveau: 'belgique', autorite: 'État fédéral', objectifsDatesEtChiffres: 1, domainesDeCompetence: 11 },
  { niveau: 'europe', autorite: 'Union européenne', objectifsDatesEtChiffres: 3, domainesDeCompetence: 32 },
];

/**
 * Page « Ce qui se décide » — activée avant un scrutin.
 *
 * Vide aujourd'hui, et pour une raison qui doit être dite : aucune élection
 * n'est en cours, et surtout, aucune liste ne publie ses positions dans un
 * format que la plateforme puisse citer telle quelle. La plateforme ne
 * résume pas un programme : elle cite une position déclarée, avec sa source.
 */
export const SCRUTIN_EN_COURS: {
  actif: boolean;
  intitule: string;
  dateScrutin: string | null;
  objectifsSoumis: string[];
  positions: Array<{ liste: string; objectifId: string; citation: string; source: string }>;
} = {
  actif: false,
  intitule: 'Aucun scrutin en cours',
  dateScrutin: null,
  objectifsSoumis: [],
  positions: [],
};
