/**
 * Identité, préférences et consentement (§ 2).
 *
 * Le contrat d'interface est celui d'itsme, réellement : les portées, les noms
 * de revendications et leurs formats sont ceux d'OpenID Connect tel qu'itsme
 * l'implémente. Le mode démonstration renvoie un habitant fictif **au même
 * format**, pour que le branchement réel ne demande que de changer le
 * fournisseur.
 *
 * Interdit, et vérifié par un test : le numéro de registre national n'est
 * jamais stocké. La clé interne est `sub`, l'identifiant de sujet propre au
 * service, qu'itsme renvoie déjà pseudonymisé par relying party.
 */

import type { Niveau, Theme } from './vocabulaires';

// ---------------------------------------------------------------------------
// Ce qu'itsme renvoie réellement.
// ---------------------------------------------------------------------------

/** Portées itsme. `openid` et `service` sont obligatoires. */
export const SCOPES_ITSME = ['openid', 'service', 'profile', 'email', 'phone', 'address', 'eid'] as const;
export type ScopeItsme = (typeof SCOPES_ITSME)[number];

/**
 * Les portées que la plateforme demande, et rien de plus.
 *
 * `eid` n'est pas demandée : elle porterait le numéro de registre national, et
 * la plateforme n'a aujourd'hui aucune finalité qui l'exige. `phone` et
 * `idDocument` ne sont pas demandées non plus — minimisation stricte.
 */
export const SCOPES_DEMANDES: ScopeItsme[] = ['openid', 'service', 'profile', 'address'];

/**
 * Revendications OIDC telles qu'itsme les renvoie. Les noms sont ceux du
 * standard : `given_name`, `family_name`, `address.street_address`…
 */
export interface RevendicationsItsme {
  /** Identifiant de sujet, propre au service. C'est la seule clé conservée. */
  sub: string;
  given_name?: string;
  family_name?: string;
  name?: string;
  gender?: string;
  locale?: string;
  birthdate?: string;
  email?: string;
  email_verified?: boolean;
  phone_number?: string;
  address?: {
    formatted?: string;
    street_address?: string;
    postal_code?: string;
    locality?: string;
    country?: string;
  };
  /** Attestation d'âge, sans révéler la date de naissance. */
  'urn:be:fgov:ehealth:1.0:certified-namespace:ehealth'?: unknown;
  /** Présent seulement si la portée `eid` était demandée — elle ne l'est pas. */
  'urn:be:fgov:person:ssin'?: string;
}

/**
 * Ce que la plateforme conserve après identification. Comparer avec
 * `RevendicationsItsme` montre tout ce qui est jeté immédiatement.
 */
export interface SessionCitoyen {
  /** Clé interne. Jamais le numéro de registre national. */
  sub: string;
  prenom?: string;
  /** Déduit de l'adresse itsme, seul usage qui en est fait. */
  codePostal?: string;
  localite?: string;
  territoireCode?: string;
  /** true quand la session vient du mode démonstration. Affiché en permanence. */
  demonstration: boolean;
  ouverteLe: string;
}

/**
 * Les champs qu'itsme **ne renvoie pas** et que la plateforme ne prétend donc
 * jamais récupérer automatiquement. Cette liste est affichée à l'écran de
 * consentement A, pour que l'utilisateur sache pourquoi on le lui demande.
 */
export const NON_FOURNIS_PAR_ITSME = [
  'composition du ménage',
  'existence et âge des enfants',
  'situation des parents',
  'profession',
  'employeur',
  'statut social',
  'revenus',
] as const;

// ---------------------------------------------------------------------------
// Préférences.
// ---------------------------------------------------------------------------

/** Types d'événement notifiables. La granularité est le sujet, pas l'existence. */
export const TYPES_EVENEMENT = [
  'nouvelle-decision',
  'consultation-ouverte',
  'echeance-proche',
  'reponse-institution',
  'avancement-initiative',
] as const;
export type TypeEvenement = (typeof TYPES_EVENEMENT)[number];

/** Fréquence maximale : hebdomadaire. Pas de temps réel, jamais. */
export const FREQUENCES = ['jamais', 'hebdomadaire', 'mensuelle'] as const;
export type Frequence = (typeof FREQUENCES)[number];

export interface RegleNotification {
  id: string;
  niveau: Niveau;
  theme: Theme | 'impact-general';
  typeEvenement: TypeEvenement;
  frequence: Frequence;
  canal: 'courriel' | 'aucun';
}

/** Les trois notifications utilitaires — les seules que les gens activent. */
export interface NotificationsUtilitaires {
  calendrierDechets: { actif: boolean; veilleAuSoir: boolean };
  travauxVoirie: { actif: boolean; rayonMetres: number };
  echeanceDemarche: { actif: boolean };
}

export interface SituationDeclaree {
  enfants: Array<{ prenomOuInitiale: string; anneeNaissance: number }>;
  parentsDependants: boolean;
  profession?: string;
  statut?: 'salarie' | 'independant' | 'fonctionnaire' | 'etudiant' | 'pensionne' | 'sans-emploi' | 'autre';
  locataire?: boolean;
}

export interface Consentements {
  /** A — ma situation, saisie par l'utilisateur. Aucune source externe. */
  situation: { accorde: boolean; accordeLe?: string };
  /** B — centres d'intérêt déduits de la navigation. */
  deduction: { accorde: boolean; accordeLe?: string };
}

export const CONSENTEMENTS_PAR_DEFAUT: Consentements = {
  situation: { accorde: false },
  deduction: { accorde: false },
};

export interface Preferences {
  version: string;
  /** Grille à deux entrées : niveaux × thèmes. Tout est décoché au départ. */
  abonnements: Partial<Record<Niveau, Theme[]>>;
  /** Comportement par défaut d'un citoyen qui ne configure rien. */
  impactGeneral: boolean;
  regles: RegleNotification[];
  utilitaires: NotificationsUtilitaires;
  consentements: Consentements;
  situation: SituationDeclaree | null;
  /** Abonnements ponctuels : suivre une initiative, suivre un objectif. */
  suivis: { initiatives: string[]; objectifs: string[] };
  /** Objectifs marqués pour l'élection — en local, jamais agrégé ni publié. */
  objectifsQuiComptent: string[];
  langue: 'fr' | 'nl' | 'en';
  toutVoir: boolean;
}

export const PREFERENCES_PAR_DEFAUT: Preferences = {
  version: '2.0.0',
  abonnements: {},
  impactGeneral: true,
  regles: [],
  utilitaires: {
    calendrierDechets: { actif: false, veilleAuSoir: false },
    travauxVoirie: { actif: false, rayonMetres: 500 },
    echeanceDemarche: { actif: false },
  },
  consentements: CONSENTEMENTS_PAR_DEFAUT,
  situation: null,
  suivis: { initiatives: [], objectifs: [] },
  objectifsQuiComptent: [],
  langue: 'fr',
  toutVoir: false,
};

// ---------------------------------------------------------------------------
// Ce que la plateforme croit savoir de vous (consentement B).
// ---------------------------------------------------------------------------

/**
 * Catégories sensibles au sens de l'art. 9 du RGPD. Aucune déduction ne peut
 * porter dessus, ni directement, ni par proxy. La liste sert de garde-fou
 * exécutable : `estSensible()` est appelée avant toute écriture d'attribut.
 */
export const THEMES_SENSIBLES: readonly Theme[] = ['sante-soins'];

const PROXYS_SENSIBLES = [
  /religion|culte|mosqu|église|synagogue|temple/i,
  /politique|parti|électeur|vote/i,
  /maladie|handicap|grossesse|thérap|psychiatr/i,
  /orientation|homosexu|lgbt/i,
  /origine|ethni|migrat|nationalité/i,
  /syndicat|syndical/i,
];

export function estSensible(theme: Theme, libelle = ''): boolean {
  if (THEMES_SENSIBLES.includes(theme)) return true;
  return PROXYS_SENSIBLES.some((p) => p.test(libelle));
}

export interface AttributDeduit {
  id: string;
  theme: Theme;
  libelle: string;
  /** Ce qui l'a produit, en clair : « 4 fiches consultées sur la mobilité ». */
  produitPar: string;
  premiereObservation: string;
  derniereObservation: string;
  occurrences: number;
}

/** Effacement automatique des traces au-delà de quatre-vingt-dix jours. */
export const RETENTION_TRACES_JOURS = 90;

export function purgerTraces<T extends { derniereObservation: string }>(
  attributs: T[],
  maintenant = new Date(),
): T[] {
  const limite = maintenant.getTime() - RETENTION_TRACES_JOURS * 86_400_000;
  return attributs.filter((a) => new Date(a.derniereObservation).getTime() >= limite);
}

/**
 * Ajoute une observation. Refuse silencieusement — et c'est voulu — tout ce qui
 * touche une catégorie sensible : la fonction ne peut pas produire un attribut
 * interdit, même appelée par erreur.
 */
export function observer(
  attributs: AttributDeduit[],
  observation: { theme: Theme; libelle: string; produitPar: string; date: string },
): AttributDeduit[] {
  if (estSensible(observation.theme, observation.libelle)) return attributs;
  const existant = attributs.find((a) => a.theme === observation.theme);
  if (existant) {
    return attributs.map((a) =>
      a.id === existant.id
        ? { ...a, occurrences: a.occurrences + 1, derniereObservation: observation.date, produitPar: observation.produitPar }
        : a,
    );
  }
  return [
    ...attributs,
    {
      id: `deduit-${observation.theme}`,
      theme: observation.theme,
      libelle: observation.libelle,
      produitPar: observation.produitPar,
      premiereObservation: observation.date,
      derniereObservation: observation.date,
      occurrences: 1,
    },
  ];
}

// ---------------------------------------------------------------------------
// Registre des traitements (§ 12) — une finalité, une base légale.
// ---------------------------------------------------------------------------

export interface Traitement {
  finalite: string;
  baseLegale: string;
  donnees: string[];
  conservation: string;
  destinataires: string;
}

export const REGISTRE_TRAITEMENTS: Traitement[] = [
  {
    finalite: 'Identifier le citoyen et déterminer sa commune de résidence',
    baseLegale: 'RGPD art. 6.1.b — exécution du service demandé par la personne',
    donnees: ['identifiant de sujet itsme (sub)', 'prénom', 'code postal', 'localité'],
    conservation: 'Durée du compte, effacement immédiat à la suppression',
    destinataires: 'Aucun. Les données ne quittent pas la plateforme.',
  },
  {
    finalite: 'Filtrer le fil selon les thèmes et niveaux déclarés',
    baseLegale: 'RGPD art. 6.1.b — le filtrage est le service lui-même',
    donnees: ['thèmes déclarés', 'niveaux déclarés'],
    conservation: 'Durée du compte',
    destinataires: 'Aucun',
  },
  {
    finalite: 'Tenir compte de la situation déclarée (consentement A)',
    baseLegale: 'RGPD art. 6.1.a — consentement explicite, retirable à tout moment',
    donnees: ['âge des enfants', 'parents dépendants', 'profession', 'statut'],
    conservation: "Jusqu'au retrait du consentement ; le formulaire est videable en un clic",
    destinataires: 'Aucun',
  },
  {
    finalite: 'Déduire des centres d’intérêt de la navigation (consentement B)',
    baseLegale: 'RGPD art. 6.1.a — consentement explicite, désactivé par défaut',
    donnees: ['thèmes des fiches consultées', 'horodatage'],
    conservation: '90 jours, effacement automatique',
    destinataires: 'Aucun. Aucune régie, aucun courtier, aucun pixel tiers, aucune revente.',
  },
  {
    finalite: 'Envoyer les notifications choisies',
    baseLegale: 'RGPD art. 6.1.a — opt-in explicite par règle',
    donnees: ['adresse de courriel', 'règles activées'],
    conservation: "Jusqu'au retrait",
    destinataires: 'Prestataire d’envoi de courriel, sous contrat de sous-traitance (art. 28)',
  },
  {
    finalite: 'Mesurer le délai de traitement réel des signalements',
    baseLegale: 'RGPD art. 6.1.f — intérêt légitime à produire une statistique publique',
    donnees: ['type de signalement', 'commune', 'date d’envoi', 'date de traitement constatée'],
    conservation: 'Agrégé au-delà de 12 mois, puis anonyme',
    destinataires: 'Publication agrégée, jamais nominative',
  },
];
