/**
 * Ce que la commune achète — marchés, leviers, et la lacune qui les entoure.
 *
 * ---------------------------------------------------------------------------
 * Ce qui est réel et ce qui ne l'est pas, dit une fois pour toutes
 * ---------------------------------------------------------------------------
 *
 * **Réel** : la consommation d'énergie du territoire, relevée chez Fluvius et
 * déjà présente dans /data. Elle porte le classement des leviers, et c'est elle
 * qui produit le résultat le plus utile de cet écran.
 *
 * **Fictif, et marqué comme tel partout** : les quatre marchés, leurs montants,
 * la consommation du patrimoine communal et de la flotte. Aucun connecteur ne
 * fournit ces données — Lokaal Beslist publie la liste des décisions, rarement
 * leur motivation, presque jamais les montants.
 *
 * Une valeur de démonstration qui ressemble à une donnée réelle finit par être
 * citée. Chaque objet ci-dessous porte donc `fictif` dans le code, et un badge
 * à l'écran.
 */

import type { Couverture, OrigineValeur, PostePris, UsageCalcul } from '@pc/core';

// ---------------------------------------------------------------------------
// Les facteurs d'émission
// ---------------------------------------------------------------------------

/**
 * Aucun jeu de données ouvert ne diffuse de facteurs d'émission utilisables par
 * appel : ils vivent dans des bases sectorielles ou des documents. Ils sont donc
 * relevés à la main, datés, et affichés avec leur origine — comme les
 * paramètres du barème.
 */
const ORIGINE_FACTEUR: OrigineValeur = {
  organisme: 'Facteurs d’émission de référence, relevé manuel',
  reference:
    'Valeurs usuelles pour le gaz naturel, l’électricité du réseau belge et les carburants routiers. Aucune interface programmable publique ne les diffuse.',
  releveLe: '2026-08-16',
  verifieParAppel: false,
  pourquoi: 'À remplacer par une source citable dès qu’un référentiel belge ouvert existera.',
};

export const FACTEURS = {
  /** Gaz naturel, pouvoir calorifique supérieur. */
  gazKwh: { valeur: 0.202, unite: 'kg CO₂e/kWh', origine: ORIGINE_FACTEUR },
  /** Électricité du réseau belge — bas, parce que le mix est peu carboné. */
  electriciteKwh: { valeur: 0.14, unite: 'kg CO₂e/kWh', origine: ORIGINE_FACTEUR },
  gasoilLitre: { valeur: 2.7, unite: 'kg CO₂e/L', origine: ORIGINE_FACTEUR },
  enrobeChaudTonne: { valeur: 58, unite: 'kg CO₂e/t', origine: ORIGINE_FACTEUR },
  enrobeTiedeTonne: { valeur: 44, unite: 'kg CO₂e/t', origine: ORIGINE_FACTEUR },
  repasCarne: { valeur: 2.9, unite: 'kg CO₂e/repas', origine: ORIGINE_FACTEUR },
  repasVegetarien: { valeur: 0.9, unite: 'kg CO₂e/repas', origine: ORIGINE_FACTEUR },
  betonM3: { valeur: 245, unite: 'kg CO₂e/m³', origine: ORIGINE_FACTEUR },
} as const;

// ---------------------------------------------------------------------------
// La lacune, déclarée en tête d'écran
// ---------------------------------------------------------------------------

export const LACUNE_MARCHES = {
  /** Décisions d'attribution repérées dans les intitulés collectés. */
  decisionsAttributionCollectees: 61,
  marchesReconstitues: 4,
  organismeAttendu: 'Commune de Kraainem — service des marchés publics',
  explication:
    'Aucun des six connecteurs ne fournit les montants des marchés communaux. Lokaal Beslist publie la liste des décisions, rarement leur motivation, presque jamais les montants. Les quatre marchés ci-dessous sont donc reconstitués : leur objet vient des intitulés réellement collectés, leurs montants sont fictifs.',
  verifieLe: '2026-08-16',
} as const;

// ---------------------------------------------------------------------------
// Les quatre marchés
// ---------------------------------------------------------------------------

export interface MarcheDemonstration {
  id: string;
  objet: string;
  famille: string;
  montantAnnuelEur: number;
  /** L'usage que sert le calcul sur cet écran : ici, on classe des leviers. */
  usage: UsageCalcul;
  postes: PostePris[];
  explication: { montre: string; neMontrePas: string; decisionLocale: string; prochaineMesure: string };
  /** Renseigné quand un instrument plus puissant que la pondération existe. */
  instrumentsDisponibles?: string[];
  fictif: true;
}

function origineForfait(quantile: string) {
  return {
    quantile,
    origine: {
      organisme: 'Aucun — forfait fictif',
      reference: 'Aucune administration belge ne publie de forfait sectoriel par poste. Valeur de démonstration.',
      releveLe: '2026-08-16',
      verifieParAppel: false,
    } satisfies OrigineValeur,
  };
}

export const MARCHES: MarcheDemonstration[] = [
  {
    id: 'voirie',
    objet: 'Entretien et réfection de voirie',
    famille: 'Travaux',
    montantAnnuelEur: 1_180_000,
    usage: 'classer-les-leviers',
    postes: [
      {
        cle: 'enrobe',
        libelle: 'Enrobé bitumineux, mise en œuvre à chaud',
        quantite: 740,
        unite: 't',
        facteurEmission: FACTEURS.enrobeChaudTonne.valeur,
        uniteFacteur: FACTEURS.enrobeChaudTonne.unite,
        origineFacteur: ORIGINE_FACTEUR,
        couverture: 'aucune' as Couverture,
      },
      {
        cle: 'beton',
        libelle: 'Béton pour ouvrages et bordures',
        quantite: 310,
        unite: 'm³',
        facteurEmission: FACTEURS.betonM3.valeur,
        uniteFacteur: FACTEURS.betonM3.unite,
        origineFacteur: ORIGINE_FACTEUR,
        couverture: 'aucune' as Couverture,
      },
      {
        cle: 'engins',
        libelle: 'Carburant des engins de chantier',
        quantite: null,
        unite: 'L',
        facteurEmission: FACTEURS.gasoilLitre.valeur,
        uniteFacteur: FACTEURS.gasoilLitre.unite,
        origineFacteur: ORIGINE_FACTEUR,
        couverture: 'aucune' as Couverture,
        forfait: { quantite: 135_700, ...origineForfait('neuvième décile de la branche') },
      },
    ],
    explication: {
      montre:
        'Ce que la réfection de voirie coûte au-delà de son prix, une fois le carbone du matériau et du chantier valorisé au barème.',
      neMontrePas:
        'La durée de vie de la chaussée. Un enrobé moins émissif qui tient dix ans au lieu de vingt coûte deux fois plus cher au mètre carré et par an — cet écran ne le voit pas.',
      decisionLocale:
        'Entièrement. La commune écrit son cahier des charges : elle peut y inscrire un enrobé tiède, un plafond d’empreinte par mètre cube de béton, ou un âge de résistance à cinquante-six jours.',
      prochaineMesure: 'À la prochaine attribution, si les montants sont un jour publiés.',
    },
    instrumentsDisponibles: [
      'Spécification d’un enrobé tiède : élimine l’enrobé chaud du champ, là où une pondération à six pour cent n’en écarterait qu’une partie.',
      'Plafond d’empreinte par mètre cube de béton et par classe d’exposition, avec trajectoire annoncée à trois ans. Aucun équivalent n’existe dans la commande publique belge.',
      'Clause d’âge de résistance à cinquante-six jours au lieu de vingt-huit : levier gratuit, contractuel, disponible aujourd’hui.',
    ],
    fictif: true,
  },
  {
    id: 'repas',
    objet: 'Repas scolaires et crèche',
    famille: 'Restauration collective',
    montantAnnuelEur: 418_000,
    usage: 'classer-les-leviers',
    postes: [
      {
        cle: 'repas',
        libelle: 'Repas servis, composition moyenne du menu',
        quantite: null,
        unite: 'repas',
        facteurEmission: FACTEURS.repasCarne.valeur,
        uniteFacteur: FACTEURS.repasCarne.unite,
        origineFacteur: ORIGINE_FACTEUR,
        couverture: 'aucune' as Couverture,
        nonDiscriminant: true,
        forfait: { quantite: 96_000, ...origineForfait('neuvième décile de la branche') },
      },
      {
        cle: 'livraison',
        libelle: 'Livraison quotidienne',
        quantite: 4_200,
        unite: 'L',
        facteurEmission: FACTEURS.gasoilLitre.valeur,
        uniteFacteur: FACTEURS.gasoilLitre.unite,
        origineFacteur: ORIGINE_FACTEUR,
        couverture: 'aucune' as Couverture,
      },
    ],
    explication: {
      montre:
        'Le coût complet des repas servis, dominé par la composition du menu et non par la logistique.',
      neMontrePas:
        'Ce que les enfants mangent réellement : le gaspillage n’est pas mesuré, et il déplace le chiffre de plusieurs dizaines de pour cent.',
      decisionLocale:
        'Largement. Le nombre de repas végétariens par semaine s’écrit dans le cahier des charges, pas dans une pondération.',
      prochaineMesure: 'Au renouvellement du marché.',
    },
    fictif: true,
  },
  {
    id: 'nettoyage',
    objet: 'Nettoyage des bâtiments communaux',
    famille: 'Services',
    montantAnnuelEur: 274_000,
    usage: 'classer-les-leviers',
    postes: [
      {
        cle: 'produits',
        libelle: 'Produits et consommables',
        quantite: null,
        unite: 'unité de 1 000 m² et par an',
        facteurEmission: 41,
        uniteFacteur: 'kg CO₂e/unité',
        origineFacteur: ORIGINE_FACTEUR,
        couverture: 'aucune' as Couverture,
        forfait: { quantite: 11, ...origineForfait('neuvième décile de la branche') },
      },
    ],
    explication: {
      montre:
        'Un impact carbone quasi nul. Ce marché figure ici pour l’ordre de grandeur, et parce que son enjeu est ailleurs.',
      neMontrePas:
        'L’enjeu réel de ce marché, qui est social : horaires morcelés, temps partiel subi, sinistralité. Le barème ne le chiffre pas, et l’écran ne prétend pas le faire.',
      decisionLocale:
        'Entièrement, pour les clauses sociales : plage horaire, continuité des équipes, reprise du personnel.',
      prochaineMesure: 'Au renouvellement du marché.',
    },
    fictif: true,
  },
  {
    id: 'energie-batiments',
    objet: 'Fourniture d’énergie des bâtiments communaux',
    famille: 'Fournitures',
    montantAnnuelEur: 392_000,
    usage: 'classer-les-leviers',
    postes: [
      {
        cle: 'gaz',
        libelle: 'Gaz de chauffage',
        quantite: 3_900_000,
        unite: 'kWh',
        facteurEmission: FACTEURS.gazKwh.valeur,
        uniteFacteur: FACTEURS.gazKwh.unite,
        origineFacteur: ORIGINE_FACTEUR,
        couverture: 'ets2-a-partir-de-2028' as Couverture,
        nonDiscriminant: true,
      },
      {
        cle: 'electricite',
        libelle: 'Électricité',
        quantite: 1_450_000,
        unite: 'kWh',
        facteurEmission: FACTEURS.electriciteKwh.valeur,
        uniteFacteur: FACTEURS.electriciteKwh.unite,
        origineFacteur: ORIGINE_FACTEUR,
        couverture: 'ets' as Couverture,
        nonDiscriminant: true,
      },
    ],
    explication: {
      montre:
        'Le premier poste de la commune, et de loin. Le gaz de chauffage n’est couvert par aucun prix carbone avant 2028 : son résidu est la valeur publique entière.',
      neMontrePas:
        'Ce qui réduirait ce poste, qui n’est pas dans ce marché : l’isolation du bâti. Changer de fournisseur ne change presque rien ; changer les bâtiments change tout.',
      decisionLocale:
        'Le volume, non — il dépend du bâti. Le choix du fournisseur, oui, mais il ne déplace que la ligne électricité.',
      prochaineMesure: 'Relevé mensuel du gestionnaire de réseau.',
    },
    instrumentsDisponibles: [
      'Ce marché est le cas d’école du quatrième instrument : le gain se joue sur le stock — l’isolation — pas sur le flux — la fourniture.',
    ],
    fictif: true,
  },
];

// ---------------------------------------------------------------------------
// Le classement des leviers
// ---------------------------------------------------------------------------

export interface Levier {
  cle: string;
  libelle: string;
  /** Ce qui se remet à zéro chaque année, ou ce qui s'accumule. */
  nature: 'flux' | 'stock';
  perimetre: 'commune' | 'territoire';
  /** Quantité et facteur, pour que le calcul soit refaisable. */
  quantite: number;
  unite: string;
  facteurEmission: number;
  uniteFacteur: string;
  couverture: Couverture;
  /** Vrai quand la quantité vient d'un connecteur réel. */
  reel: boolean;
  source: string;
  /** Ce que la commune peut réellement décider dessus. */
  prise: string;
}

/**
 * Le classement des leviers, tous calculés à la même valeur.
 *
 * Sans lui, on discute des sacs poubelle pendant que le chauffage tourne.
 *
 * Les deux premiers leviers viennent de données **réelles** : la consommation
 * du territoire relevée chez Fluvius, déjà présente dans /data. Les suivants
 * sont fictifs et marqués. C'est le contraste qui compte : le poste que la
 * commune ne maîtrise pas directement écrase tous ceux qu'elle maîtrise.
 */
export const LEVIERS: Levier[] = [
  {
    cle: 'gaz-territoire',
    libelle: 'Chauffage au gaz du parc résidentiel et tertiaire du territoire',
    nature: 'stock',
    perimetre: 'territoire',
    quantite: 92_000_000,
    unite: 'kWh par an',
    facteurEmission: FACTEURS.gazKwh.valeur,
    uniteFacteur: FACTEURS.gazKwh.unite,
    couverture: 'ets2-a-partir-de-2028',
    reel: true,
    source: 'Fluvius — volumes prélevés sur le réseau de distribution, douze mois glissants',
    prise:
      'Indirecte : permis, primes relayées, accompagnement à la rénovation. La commune ne décide pas des travaux, mais elle décide de qui les accompagne.',
  },
  {
    cle: 'elec-territoire',
    libelle: 'Électricité du territoire',
    nature: 'flux',
    perimetre: 'territoire',
    quantite: 31_800_000,
    unite: 'kWh par an',
    facteurEmission: FACTEURS.electriciteKwh.valeur,
    uniteFacteur: FACTEURS.electriciteKwh.unite,
    couverture: 'ets',
    reel: true,
    source: 'Fluvius — volumes prélevés sur le réseau de distribution, douze mois glissants',
    prise: 'Faible. Le mix est national et déjà tarifé : seul le résidu apparaît ici.',
  },
  {
    cle: 'gaz-patrimoine',
    libelle: 'Chauffage au gaz des bâtiments communaux',
    nature: 'stock',
    perimetre: 'commune',
    quantite: 3_900_000,
    unite: 'kWh par an',
    facteurEmission: FACTEURS.gazKwh.valeur,
    uniteFacteur: FACTEURS.gazKwh.unite,
    couverture: 'ets2-a-partir-de-2028',
    reel: false,
    source: 'Valeur fictive — le cadastre énergétique du patrimoine communal n’est pas publié',
    prise: 'Entière. C’est le seul gros levier que la commune décide seule, de bout en bout.',
  },
  {
    cle: 'voirie',
    libelle: 'Marché de voirie — matériaux et chantier',
    nature: 'flux',
    perimetre: 'commune',
    quantite: 740,
    unite: 't d’enrobé par an',
    facteurEmission: FACTEURS.enrobeChaudTonne.valeur,
    uniteFacteur: FACTEURS.enrobeChaudTonne.unite,
    couverture: 'aucune',
    reel: false,
    source: 'Valeur fictive — les montants des marchés ne sont pas publiés',
    prise: 'Entière, par le cahier des charges.',
  },
  {
    cle: 'flotte',
    libelle: 'Flotte communale',
    nature: 'flux',
    perimetre: 'commune',
    quantite: 48_000,
    unite: 'L de carburant par an',
    facteurEmission: FACTEURS.gasoilLitre.valeur,
    uniteFacteur: FACTEURS.gasoilLitre.unite,
    couverture: 'aucune',
    reel: false,
    source: 'Valeur fictive — l’inventaire de la flotte n’est pas publié',
    prise: 'Entière, au renouvellement des véhicules.',
  },
  {
    cle: 'repas',
    libelle: 'Repas scolaires et crèche',
    nature: 'flux',
    perimetre: 'commune',
    quantite: 96_000,
    unite: 'repas par an',
    facteurEmission: FACTEURS.repasCarne.valeur,
    uniteFacteur: FACTEURS.repasCarne.unite,
    couverture: 'aucune',
    reel: false,
    source: 'Valeur fictive — les montants des marchés ne sont pas publiés',
    prise: 'Largement, par la composition du menu inscrite au cahier des charges.',
  },
  {
    cle: 'dechets',
    libelle: 'Déchets résiduels du territoire',
    nature: 'flux',
    perimetre: 'territoire',
    quantite: 1_900,
    unite: 't par an',
    facteurEmission: 420,
    uniteFacteur: 'kg CO₂e/t',
    couverture: 'aucune',
    reel: false,
    source: 'Valeur fictive — l’OVAM publie ce chiffre en rapport, pas en données ouvertes',
    prise: 'Largement, par la fréquence de collecte et la tarification.',
  },
  {
    cle: 'nettoyage',
    libelle: 'Nettoyage des bâtiments',
    nature: 'flux',
    perimetre: 'commune',
    quantite: 11,
    unite: 'unités de 1 000 m² par an',
    facteurEmission: 41,
    uniteFacteur: 'kg CO₂e/unité',
    couverture: 'aucune',
    reel: false,
    source: 'Valeur fictive — les montants des marchés ne sont pas publiés',
    prise: 'Entière, mais l’enjeu de ce marché est social, pas carbone.',
  },
];

/** Ce que la commune s'applique à elle-même — même méthode, mêmes valeurs. */
export const AUTO_APPLICATION = {
  intitule: 'Ce que la commune s’applique à elle-même',
  explication:
    'Les mêmes règles, appliquées au fonctionnement propre de la commune. Une commune qui demande sans se l’appliquer perd le droit de demander.',
  leviersCommunaux: ['gaz-patrimoine', 'flotte', 'nettoyage'],
  fictif: true,
} as const;
