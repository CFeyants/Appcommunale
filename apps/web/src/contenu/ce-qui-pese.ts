/**
 * « Ce qui pèse » — un classement des gestes par ordre de grandeur.
 *
 * ---------------------------------------------------------------------------
 * La contradiction à lever, et comment elle se lève
 * ---------------------------------------------------------------------------
 *
 * L'écran /fr/impact affirme : « Aucun total, aucun score, aucune conversion en
 * équivalent carbone n'est affiché. Les facteurs d'émission varient d'un
 * référentiel à l'autre et la plateforme n'en impose aucun. »
 *
 * Cette doctrine reste entière. Elle interdit de **convertir les saisies de
 * l'utilisateur** en un total personnel. Elle n'interdit pas de **publier un
 * contenu de référence ordonné**, sourcé, identique pour tout le monde —
 * exactement comme /fr/classement publie ses poids.
 *
 * D'où les sept règles tenues ici :
 *   1. en ordres de grandeur, jamais en valeurs précises ;
 *   2. la part que rien d'individuel ne touche, en premier ;
 *   3. trois colonnes, dont « qui peut réellement le faire » ;
 *   4. chaque geste empêché pointe vers ce qui l'empêche ;
 *   5. le bas du classement vaut le haut ;
 *   6. aucune comparaison entre personnes ;
 *   7. chaque ligne porte sa source et sa date.
 */

import type { Niveau } from '@pc/core';

// ---------------------------------------------------------------------------
// Les paliers. Un palier survit au désaccord entre référentiels, une décimale
// non — c'est ce qui rend ce classement compatible avec le refus d'imposer un
// référentiel.
// ---------------------------------------------------------------------------

export const PALIERS = [
  { cle: 'dix-tonnes', libelle: 'De l’ordre de dix tonnes par an', rang: 4 },
  { cle: 'une-tonne', libelle: 'De l’ordre d’une tonne par an', rang: 3 },
  { cle: 'cent-kilos', libelle: 'De l’ordre de cent kilos par an', rang: 2 },
  { cle: 'dix-kilos', libelle: 'De l’ordre de dix kilos par an', rang: 1 },
] as const;

export type ClePalier = (typeof PALIERS)[number]['cle'];

// ---------------------------------------------------------------------------
// La part que rien d'individuel ne touche — affichée en tête, pas en note
// ---------------------------------------------------------------------------

/**
 * Sans ce bloc, l'écran transférerait à l'habitant une responsabilité que
 * l'application refuse explicitement de lui transférer ailleurs.
 *
 * Les deux premiers chiffres viennent de données réelles déjà collectées :
 * la série d'émissions d'Eurostat et la population belge.
 */
export const PART_COLLECTIVE = {
  /** Calculé à l'écran depuis /data : émissions territoriales ÷ population. */
  sourceReelle: 'Eurostat — inventaire national des émissions et population au 1er janvier',
  /**
   * L'empreinte de consommation est plus élevée que l'inventaire territorial :
   * elle compte ce qui est importé. Les travaux la situent autour de seize
   * tonnes pour la Belgique.
   */
  empreinteConsommationTonnes: 16,
  partCollectiveTonnes: 4,
  explication:
    'Sur une empreinte de consommation d’environ seize tonnes, quatre relèvent des services publics, des infrastructures et de la défense. Aucun choix personnel ne les touche : elles se décident par le budget, l’urbanisme et la politique énergétique, pas par un geste.',
  source: {
    organisme: 'Ordre de grandeur issu des travaux sur l’empreinte carbone des ménages',
    releveLe: '2026-08-16',
    verifieParAppel: false,
  },
} as const;

// ---------------------------------------------------------------------------
// Le classement
// ---------------------------------------------------------------------------

export interface Geste {
  cle: string;
  libelle: string;
  palier: ClePalier;
  /** La troisième colonne, celle que personne ne met. */
  quiPeutLeFaire: string;
  /** Vrai quand une part importante des gens ne peut pas, pour une raison structurelle. */
  conditionne: boolean;
  /** Ce qui l'empêche, et vers quel niveau de pouvoir cela renvoie. */
  empeche?: { quoi: string; niveau: Niveau; lien?: string; libelleLien?: string };
  /** Vrai pour les gestes que tout le monde surestime. */
  surestime?: boolean;
  source: { organisme: string; reference: string; releveLe: string };
  /** Particularité belge qui déplace ce geste par rapport aux classements importés. */
  particulariteBelge?: string;
}

const LITTERATURE = {
  organisme: 'Wynes et Nicholas, Environmental Research Letters',
  reference:
    '« The climate mitigation gap : education and government recommendations miss the most effective individual actions » (2017), et travaux ultérieurs sur la demande',
  releveLe: '2026-08-16',
};

const GIEC = {
  organisme: 'GIEC',
  reference: 'Sixième rapport d’évaluation, groupe de travail III, chapitre sur la demande et les services',
  releveLe: '2026-08-16',
};

export const GESTES: Geste[] = [
  {
    cle: 'avion-long',
    libelle: 'Renoncer à un vol long-courrier aller-retour',
    palier: 'une-tonne',
    quiPeutLeFaire:
      'Celles et ceux qui en prennent. Une minorité de la population fait la majorité des vols : pour la plupart des gens, ce geste n’existe pas.',
    conditionne: false,
    source: LITTERATURE,
  },
  {
    cle: 'voiture',
    libelle: 'Vivre sans voiture',
    palier: 'une-tonne',
    quiPeutLeFaire:
      'Gratuit et immédiat à Bruxelles ou près d’une gare. Impossible dans un village mal desservi, et bloqué par un dispositif fiscal pour une part importante des salariés.',
    conditionne: true,
    empeche: {
      quoi: 'La voiture de société est une institution salariale belge : pour beaucoup, renoncer à la voiture revient à renoncer à une part de la rémunération. Ce n’est pas un blocage de volonté, c’est un dispositif fiscal fédéral.',
      niveau: 'belgique',
    },
    particulariteBelge:
      'Aucun classement importé ne contient ce cas. C’est pourtant le cas d’école de la colonne « qui peut le faire » : le geste est individuellement gratuit et collectivement verrouillé.',
    source: LITTERATURE,
  },
  {
    cle: 'chauffage-renovation',
    libelle: 'Isoler son logement',
    palier: 'une-tonne',
    quiPeutLeFaire:
      'Les propriétaires qui peuvent avancer les fonds. Un locataire ne décide pas des murs, et c’est la moitié du problème.',
    conditionne: true,
    empeche: {
      quoi: 'Les primes à la rénovation et les obligations de performance relèvent de la Région. La commune relaie, accompagne et délivre les permis.',
      niveau: 'region',
      lien: '/budget/achats',
      libelleLien: 'Voir le poids du chauffage dans le classement des leviers',
    },
    particulariteBelge:
      'Le parc belge est parmi les moins isolés d’Europe : le gisement par logement y est donc plus grand qu’ailleurs, et le geste plus rentable.',
    source: GIEC,
  },
  {
    cle: 'pompe-a-chaleur',
    libelle: 'Remplacer une chaudière au gaz par une pompe à chaleur',
    palier: 'une-tonne',
    quiPeutLeFaire:
      'Les propriétaires d’un logement suffisamment isolé pour qu’elle fonctionne bien. Sur un logement passoire, elle déçoit.',
    conditionne: true,
    empeche: {
      quoi: 'Le coût d’installation et les primes relèvent de la Région ; le raccordement et le tarif de l’électricité, du fédéral et du régulateur.',
      niveau: 'region',
    },
    particulariteBelge:
      'Anormalement efficace en Belgique, et davantage que dans les classements internationaux : l’électricité y est peu carbonée alors que le parc est peu isolé. Le gain est donc plus grand qu’ailleurs — à condition d’isoler d’abord.',
    source: GIEC,
  },
  {
    cle: 'viande',
    libelle: 'Passer à une alimentation majoritairement végétale',
    palier: 'une-tonne',
    quiPeutLeFaire:
      'Presque tout le monde, sans investissement. C’est le geste le plus accessible du haut du classement — et souvent moins cher.',
    conditionne: false,
    source: LITTERATURE,
  },
  {
    cle: 'electricite-verte',
    libelle: 'Changer de fournisseur d’électricité',
    palier: 'cent-kilos',
    quiPeutLeFaire: 'Tout le monde, en dix minutes et sans frais.',
    conditionne: false,
    particulariteBelge:
      'L’effet réel est faible en Belgique parce que le mix est déjà peu carboné : le même geste pèserait bien plus dans un pays au mix charbonné.',
    source: GIEC,
  },
  {
    cle: 'voiture-usage',
    libelle: 'Rouler moins, ou rouler autrement, sans se séparer de la voiture',
    palier: 'cent-kilos',
    quiPeutLeFaire:
      'Dépend entièrement de la desserte. Là où il n’y a ni bus ni piste cyclable, le geste est prescrit mais indisponible.',
    conditionne: true,
    empeche: {
      quoi: 'Les lignes de bus et les pistes cyclables se décident au niveau communal et régional. Les décisions de voirie de Kraainem sont dans le fil.',
      niveau: 'commune',
      lien: '/?onglet=retenus',
      libelleLien: 'Voir les décisions de voirie au registre',
    },
    source: GIEC,
  },
  {
    cle: 'gros-electromenager',
    libelle: 'Garder un appareil plutôt que le remplacer',
    palier: 'cent-kilos',
    quiPeutLeFaire:
      'Tout le monde, mais la réparabilité et le prix des pièces ne dépendent pas de l’habitant.',
    conditionne: true,
    empeche: {
      quoi: 'La conception, la durabilité et la disponibilité des pièces relèvent de la réglementation européenne des produits.',
      niveau: 'europe',
      lien: '/vision',
      libelleLien: 'Voir les objectifs européens',
    },
    source: GIEC,
  },
  {
    cle: 'tri',
    libelle: 'Trier ses déchets',
    palier: 'dix-kilos',
    quiPeutLeFaire: 'Presque tout le monde, et presque tout le monde le fait déjà.',
    conditionne: false,
    surestime: true,
    source: LITTERATURE,
  },
  {
    cle: 'ampoules',
    libelle: 'Remplacer ses ampoules',
    palier: 'dix-kilos',
    quiPeutLeFaire: 'Tout le monde, une fois.',
    conditionne: false,
    surestime: true,
    source: LITTERATURE,
  },
  {
    cle: 'chargeurs',
    libelle: 'Débrancher les chargeurs et les veilles',
    palier: 'dix-kilos',
    quiPeutLeFaire: 'Tout le monde, tous les jours.',
    conditionne: false,
    surestime: true,
    source: LITTERATURE,
  },
  {
    cle: 'sac-reutilisable',
    libelle: 'Utiliser un sac réutilisable',
    palier: 'dix-kilos',
    quiPeutLeFaire: 'Tout le monde.',
    conditionne: false,
    surestime: true,
    source: LITTERATURE,
  },
];

/**
 * Ce que dit la littérature sur le bas du classement, et pourquoi le dire est
 * le service le plus utile de cet écran.
 *
 * C'est le même principe que le registre des actes écartés : ce qu'on retire
 * est aussi informatif que ce qu'on garde.
 */
export const SUR_LE_BAS_DU_CLASSEMENT = {
  constat:
    'Les recommandations publiques et scolaires mettent l’accent sur les gestes les moins efficaces. Quatre des gestes les plus enseignés — trier, changer d’ampoules, débrancher les veilles, prendre un sac réutilisable — se situent deux paliers en dessous des gestes du haut.',
  precision:
    'Cela ne veut pas dire qu’il faut cesser de les faire. Cela veut dire qu’une politique publique qui s’y limite déplace la responsabilité sans déplacer le résultat.',
  source: LITTERATURE,
} as const;

export const CE_QUE_CET_ECRAN_NE_FAIT_PAS = [
  'Il ne calcule rien sur vous : il publie ce que disent les études, et vous en faites ce que vous voulez.',
  'Il ne convertit aucune de vos saisies en équivalent carbone — l’application a explicitement choisi de ne pas le faire.',
  'Il ne compare aucun habitant à un autre, et ne produit aucun total personnel.',
  'Il ne donne pas de valeurs précises : un palier survit au désaccord entre référentiels, une décimale non.',
] as const;
