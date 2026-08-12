/**
 * Vocabulaires fermés et versionnés.
 *
 * Rien ici n'est libre : ajouter une valeur est un changement de version, pas
 * une commodité d'ingestion. C'est ce qui rend le filtre comparable entre
 * territoires et dans le temps (§ 4 et § 9 de la spécification).
 */

export const VERSION_VOCABULAIRE = '2.0.0';

// ---------------------------------------------------------------------------
// Les cinq niveaux de pouvoir, toujours dans cet ordre.
// ---------------------------------------------------------------------------

export const NIVEAUX = ['commune', 'communaute', 'region', 'belgique', 'europe'] as const;
export type Niveau = (typeof NIVEAUX)[number];

/** Rang utilisé par la proximité territoriale du tri (§ 4.3). */
export const RANG_NIVEAU: Record<Niveau, number> = {
  commune: 0,
  communaute: 1,
  region: 2,
  belgique: 3,
  europe: 4,
};

// ---------------------------------------------------------------------------
// Les douze thèmes. Douze au maximum : la grille de préférences est à deux
// entrées (5 niveaux × 12 thèmes) et doit tenir à 390 px.
// ---------------------------------------------------------------------------

export const THEMES = [
  'mobilite-voirie',
  'logement',
  'enfance-ecole',
  'sante-soins',
  'aines',
  'environnement-energie',
  'taxes-budget',
  'emploi-entreprises',
  'culture-sport',
  'securite',
  'aides-droits-sociaux',
  'urbanisme',
] as const;
export type Theme = (typeof THEMES)[number];

/**
 * Comportement par défaut d'un citoyen qui ne configure rien : il voit les
 * décisions à impact général, et rien d'autre n'est présélectionné.
 */
export const THEME_PAR_DEFAUT = 'impact-general' as const;

// ---------------------------------------------------------------------------
// Les dix catégories de carte. Liste fermée (§ 4.1).
// ---------------------------------------------------------------------------

export const CATEGORIES = [
  'decision',
  'reglement-taxe',
  'budget',
  'consultation-ouverte',
  'droit-aide',
  'evenement',
  'travaux-voirie',
  'alerte',
  'avancement-initiative',
  'reponse-institution',
] as const;
export type Categorie = (typeof CATEGORIES)[number];

// ---------------------------------------------------------------------------
// Statuts. Quatre états, plus « non mesuré » qui sera le plus fréquent.
// Jamais portés par la couleur seule : chaque statut a une icône et un mot.
// ---------------------------------------------------------------------------

export const STATUTS = ['conforme', 'en-retard', 'serieux', 'hors-seuil', 'non-mesure'] as const;
export type Statut = (typeof STATUTS)[number];

/** Nom d'icône lucide associé. La couleur ne porte jamais l'information seule. */
export const ICONE_STATUT: Record<Statut, string> = {
  conforme: 'CircleCheck',
  'en-retard': 'Clock',
  serieux: 'TriangleAlert',
  'hors-seuil': 'OctagonX',
  'non-mesure': 'CircleDashed',
};

// ---------------------------------------------------------------------------
// États d'une initiative (§ 5.2). Jamais un pourcentage d'avancement inventé.
// ---------------------------------------------------------------------------

export const ETATS_INITIATIVE = ['annoncee', 'engagee', 'en-cours', 'livree', 'abandonnee'] as const;
export type EtatInitiative = (typeof ETATS_INITIATIVE)[number];

// ---------------------------------------------------------------------------
// Motifs d'exclusion du test d'admission (§ 9). Chacun est testé.
// ---------------------------------------------------------------------------

export const MOTIFS_EXCLUSION = [
  'approbation-proces-verbal',
  'fixation-ordre-du-jour',
  'acte-personnel-individuel',
  'marche-fournitures-internes-sous-seuil',
  'autorisation-individuelle-sans-effet-tiers',
  'acte-pure-procedure',
  'sans-impact-identifiable',
  'sans-acte',
  'plafond-mensuel-atteint',
] as const;
export type MotifExclusion = (typeof MOTIFS_EXCLUSION)[number];

// ---------------------------------------------------------------------------
// Plafonds de publication (§ 9). Au-delà, le filtre est trop permissif : on le
// signale au lieu de l'ajuster seul.
// ---------------------------------------------------------------------------

export const PLAFOND_MENSUEL: Record<Niveau, number> = {
  commune: 20,
  communaute: 15,
  region: 15,
  belgique: 15,
  europe: 15,
};

// ---------------------------------------------------------------------------
// Langues de l'interface, et langues d'actes rencontrées.
// ---------------------------------------------------------------------------

export const LOCALES = ['fr', 'nl', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const LOCALE_PAR_DEFAUT: Locale = 'fr';

/** Langue d'origine d'un acte. `nl` est le cas normal à Kraainem. */
export const LANGUES_ACTE = ['nl', 'fr', 'de', 'en', 'multi'] as const;
export type LangueActe = (typeof LANGUES_ACTE)[number];
