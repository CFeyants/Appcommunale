/**
 * L'espace entreprise — données de démonstration.
 *
 * ---------------------------------------------------------------------------
 * Une précaution qui n'est pas négociable
 * ---------------------------------------------------------------------------
 *
 * L'entreprise de démonstration est **fictive, et son nom l'est aussi**.
 * Attacher des chiffres environnementaux inventés à l'un des 179 établissements
 * réels d'OpenStreetMap serait la faute exacte que l'application ne commet
 * jamais : une valeur de démonstration qui ressemble à une donnée réelle finit
 * par être citée, et là elle serait citée contre quelqu'un.
 *
 * Le lien depuis la fiche publique existe donc, mais il mène à un espace qui
 * annonce en tête qu'aucune donnée réelle n'y est attachée.
 */

import type { StatutValeur } from '@pc/core';

// ---------------------------------------------------------------------------
// L'entreprise de démonstration
// ---------------------------------------------------------------------------

export const ENTREPRISE = {
  /** Format BCE valide, plage volontairement non attribuée. */
  numeroEntreprise: '0999.999.999',
  denomination: 'ENTREPRISE DE DÉMONSTRATION — TRAVAUX DE VOIRIE',
  secteur: 'Travaux de voirie',
  equivalentsTempsPlein: 34,
  chiffreAffairesEur: 4_200_000,
  fictif: true,
} as const;

// ---------------------------------------------------------------------------
// Le module de base de la norme volontaire européenne — onze rubriques
// ---------------------------------------------------------------------------

/**
 * B1 à B11 : le plafond que le législateur européen a jugé proportionné pour
 * une petite entreprise non cotée. **Aucun champ n'y est ajouté.** Un
 * questionnaire maison serait plus coûteux pour l'entreprise et plus attaquable
 * pour la commune.
 */
export interface Rubrique {
  cle: string;
  code: string;
  intitule: string;
  /** Ce que la rubrique demande, en une phrase. */
  demande: string;
  /** Renseignée quand l'entreprise a déclaré. */
  valeurDeclaree?: { valeur: string; declareeLe: string; piece?: string };
  /** Le forfait qui s'applique tant que rien n'est déclaré — jamais sur la fiche publique. */
  forfait?: { valeur: string; coutAnnuelEur: number };
  /** Vrai quand la rubrique n'entre dans aucun calcul de marché. */
  sansEffetSurLesMarches?: boolean;
}

export const RUBRIQUES: Rubrique[] = [
  {
    cle: 'b1',
    code: 'B1',
    intitule: 'Base de préparation',
    demande: 'Périmètre retenu, exercice couvert, méthode de consolidation.',
    valeurDeclaree: { valeur: 'Entreprise seule, exercice 2025, méthode opérationnelle', declareeLe: '2026-03-12' },
  },
  {
    cle: 'b2',
    code: 'B2',
    intitule: 'Pratiques de transition',
    demande: 'Politiques, objectifs et actions engagées, s’il en existe.',
    valeurDeclaree: { valeur: 'Plan de renouvellement de la flotte à l’horizon 2030', declareeLe: '2026-03-12' },
  },
  {
    cle: 'b3',
    code: 'B3',
    intitule: 'Énergie et émissions de gaz à effet de serre',
    demande: 'Consommation d’énergie et émissions des scopes 1 et 2, scope 3 si possible.',
    forfait: { valeur: '11 500 L de carburant par 100 000 € de marché', coutAnnuelEur: 18_400 },
  },
  {
    cle: 'b4',
    code: 'B4',
    intitule: 'Pollution de l’air, de l’eau et des sols',
    demande: 'Polluants rejetés, quand un seuil réglementaire s’applique.',
    sansEffetSurLesMarches: true,
  },
  {
    cle: 'b5',
    code: 'B5',
    intitule: 'Biodiversité',
    demande: 'Sites exploités dans ou à proximité de zones sensibles.',
    sansEffetSurLesMarches: true,
  },
  {
    cle: 'b6',
    code: 'B6',
    intitule: 'Eau',
    demande: 'Prélèvements et consommation.',
    sansEffetSurLesMarches: true,
  },
  {
    cle: 'b7',
    code: 'B7',
    intitule: 'Usage des ressources, économie circulaire et déchets',
    demande: 'Matériaux entrants, part de matière secondaire, déchets sortants.',
    forfait: { valeur: 'Enrobé neuf à 100 %, aucun taux de recyclé déclaré', coutAnnuelEur: 9_700 },
  },
  {
    cle: 'b8',
    code: 'B8',
    intitule: 'Effectif — caractéristiques générales',
    demande: 'Effectif, types de contrat, répartition.',
    valeurDeclaree: { valeur: '34 équivalents temps plein, dont 4 intérimaires', declareeLe: '2026-03-12' },
  },
  {
    cle: 'b9',
    code: 'B9',
    intitule: 'Effectif — santé et sécurité',
    demande: 'Accidents du travail et jours d’incapacité.',
    forfait: { valeur: 'Indice de branche appliqué faute de déclaration', coutAnnuelEur: 6_200 },
  },
  {
    cle: 'b10',
    code: 'B10',
    intitule: 'Effectif — rémunération, négociation collective et formation',
    demande: 'Écart de rémunération, couverture conventionnelle, heures de formation.',
    sansEffetSurLesMarches: true,
  },
  {
    cle: 'b11',
    code: 'B11',
    intitule: 'Condamnations pour corruption',
    demande: 'Condamnations définitives et amendes, s’il y en a.',
    valeurDeclaree: { valeur: 'Aucune', declareeLe: '2026-03-12' },
  },
];

// ---------------------------------------------------------------------------
// Les marchés de cette entreprise
// ---------------------------------------------------------------------------

export interface MarcheEntreprise {
  id: string;
  objet: string;
  pouvoirAdjudicateur: string;
  montantEur: number;
  etat: 'en-cours' | 'a-venir';
  /** Sous le seuil, l'entreprise n'a rien à fournir — et l'écran le dit. */
  sousLeSeuil: boolean;
  impactAvecValeursDeclarees: number;
  impactAuForfait: number;
  fictif: true;
}

export const MARCHES_ENTREPRISE: MarcheEntreprise[] = [
  {
    id: 'voirie-2026',
    objet: 'Entretien et réfection de voirie',
    pouvoirAdjudicateur: 'Commune de Kraainem',
    montantEur: 1_180_000,
    etat: 'en-cours',
    sousLeSeuil: false,
    impactAvecValeursDeclarees: 118_400,
    impactAuForfait: 152_900,
    fictif: true,
  },
  {
    id: 'trottoirs-2027',
    objet: 'Réfection de trottoirs, lot 2',
    pouvoirAdjudicateur: 'Commune de Kraainem',
    montantEur: 340_000,
    etat: 'a-venir',
    sousLeSeuil: false,
    impactAvecValeursDeclarees: 34_100,
    impactAuForfait: 44_300,
    fictif: true,
  },
  {
    id: 'signalisation-2026',
    objet: 'Fourniture et pose de signalisation',
    pouvoirAdjudicateur: 'Commune de Kraainem',
    montantEur: 42_000,
    etat: 'en-cours',
    sousLeSeuil: true,
    impactAvecValeursDeclarees: 0,
    impactAuForfait: 0,
    fictif: true,
  },
];

// ---------------------------------------------------------------------------
// Les pièces justificatives
// ---------------------------------------------------------------------------

export interface Piece {
  id: string;
  objet: string;
  emiseLe: string;
  valideJusquau: string;
  rubriques: string[];
  fictif: true;
}

export const PIECES: Piece[] = [
  {
    id: 'dep-enrobe',
    objet: 'Déclaration environnementale de produit — enrobé tiède, vérifiée par tierce partie',
    emiseLe: '2024-11-04',
    valideJusquau: '2029-11-04',
    rubriques: ['b3', 'b7'],
    fictif: true,
  },
  {
    id: 'releve-carburant',
    objet: 'Relevé annuel de consommation de carburant des engins',
    emiseLe: '2026-01-20',
    valideJusquau: '2026-12-31',
    rubriques: ['b3'],
    fictif: true,
  },
  {
    id: 'registre-accidents',
    objet: 'Registre des accidents du travail, exercice 2025',
    emiseLe: '2026-02-15',
    valideJusquau: '2026-09-30',
    rubriques: ['b9'],
    fictif: true,
  },
];

// ---------------------------------------------------------------------------
// La position dans le secteur — par écart, jamais par rang
// ---------------------------------------------------------------------------

export interface Position {
  indicateur: string;
  valeurEntreprise: number;
  reference: number;
  unite: string;
  statut: StatutValeur;
}

/**
 * Aucune entreprise n'est nommée en comparaison, et aucun rang n'est affiché.
 * L'écart à la référence de son secteur suffit à décider d'un investissement ;
 * un rang ne servirait qu'à humilier ou à rassurer.
 */
export const POSITIONS: Position[] = [
  { indicateur: 'Carburant par 100 000 € de marché', valeurEntreprise: 8_900, reference: 9_400, unite: 'L', statut: 'declare' },
  { indicateur: 'Part d’enrobé tiède', valeurEntreprise: 62, reference: 28, unite: '%', statut: 'declare' },
  { indicateur: 'Indice d’accident triennal', valeurEntreprise: 0, reference: 1.9, unite: '', statut: 'forfait' },
  { indicateur: 'Part de matière secondaire', valeurEntreprise: 0, reference: 22, unite: '%', statut: 'forfait' },
];

// ---------------------------------------------------------------------------
// Les échéances
// ---------------------------------------------------------------------------

export const ECHEANCES = [
  { quoi: 'Le registre des accidents 2025 cesse d’être valide', le: '2026-09-30', rubrique: 'b9' },
  { quoi: 'Remise de l’offre — réfection de trottoirs, lot 2', le: '2026-10-15', rubrique: null },
  { quoi: 'Le relevé de carburant 2026 doit être renouvelé', le: '2026-12-31', rubrique: 'b3' },
] as const;

// ---------------------------------------------------------------------------
// Le secteur, pour la démonstration du bonus-malus
// ---------------------------------------------------------------------------

/**
 * Huit entreprises anonymes d'un même secteur. Les identifiants sont opaques :
 * aucun écran ne les trie, aucun ne les nomme.
 */
export const SECTEUR_DEMONSTRATION = [
  { id: 'A', intensite: 0.212, volume: 4_200_000 },
  { id: 'B', intensite: 0.284, volume: 2_800_000 },
  { id: 'C', intensite: 0.176, volume: 6_100_000 },
  { id: 'D', intensite: 0.311, volume: 1_450_000 },
  { id: 'E', intensite: 0.239, volume: 3_300_000 },
  { id: 'F', intensite: 0.198, volume: 5_700_000 },
  { id: 'G', intensite: 0.267, volume: 2_100_000 },
  { id: 'H', intensite: 0.225, volume: 3_900_000 },
] as const;

/** L'entreprise de démonstration est la première du secteur. */
export const ID_ENTREPRISE_DANS_SECTEUR = 'A';
