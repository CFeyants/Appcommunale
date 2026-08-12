/**
 * Écran 5 — épargne longue et services.
 *
 * Deux avertissements structurent tout ce fichier.
 *
 * 1. La plateforme n'est pas un intermédiaire financier. Elle décrit et
 *    renvoie. Elle n'encaisse pas, ne conseille pas, ne classe pas par
 *    rendement. L'ordre d'affichage ci-dessous est alphabétique, jamais un
 *    ordre de performance.
 *
 * 2. Le rendement affiché est le rendement **observé**, jamais le plafond
 *    légal. Aucune des coopératives citées ne publie sa série de dividendes
 *    dans un format ouvert et réutilisable : la valeur est donc marquée comme
 *    non publiée, avec le lien vers l'endroit où elle l'est réellement. Écrire
 *    un chiffre plausible serait une promesse.
 */

import type { Theme } from '@pc/core';

export interface ProjetEpargne {
  id: string;
  intitule: string;
  porteur: string;
  /** Un projet sans rattachement à un objectif n'entre pas. */
  objectifServiId: string;
  horizonAnneesMin: number;
  agrement: { type: 'fsma-2020-1503' | 'cooperative-citoyenne'; reference: string; url: string };
  /** Vide tant que la série n'est pas publiée en données ouvertes. */
  rendementObserve: Array<{ annee: number; tauxPct: number; source: string }>;
  rendementNonPublie?: { raison: string; ouEstLeChiffre: string };
  tripleComptabilite: { economique: string; social: string; environnemental: string };
  urlSortante: string;
  source: { organisme: string; url: string; dateDonnee: string; licence: string };
}

/** Ordre alphabétique. Aucun classement, aucune mise en avant. */
export const PROJETS_EPARGNE: ProjetEpargne[] = [
  {
    id: 'ecopower',
    intitule: 'Production d’électricité renouvelable coopérative',
    porteur: 'Ecopower CV',
    objectifServiId: 'eu-renouvelables-2030',
    horizonAnneesMin: 10,
    agrement: {
      type: 'cooperative-citoyenne',
      reference:
        'Société coopérative agréée par le Conseil national de la coopération ; membre de REScoop.eu',
      url: 'https://www.ecopower.be/',
    },
    rendementObserve: [],
    rendementNonPublie: {
      raison:
        'Le dividende voté chaque année par l’assemblée générale n’est publié ni en données ouvertes, ni sous une forme réutilisable. La plateforme n’écrira pas un chiffre qu’elle ne peut pas citer.',
      ouEstLeChiffre: 'Rapport annuel et procès-verbal de l’assemblée générale, publiés par la coopérative.',
    },
    tripleComptabilite: {
      economique:
        'Le capital finance des éoliennes et des installations hydroélectriques détenues par les coopérateurs. Il n’est pas garanti et peut être perdu.',
      social:
        'Un coopérateur, une voix, quel que soit le nombre de parts. Les décisions d’investissement passent par l’assemblée générale.',
      environnemental:
        'Production d’électricité renouvelable injectée sur le réseau belge, en substitution d’électricité fossile.',
    },
    urlSortante: 'https://www.ecopower.be/',
    source: {
      organisme: 'Ecopower CV',
      url: 'https://www.ecopower.be/',
      dateDonnee: '2026-08-12',
      licence: 'Information publiée par l’émetteur',
    },
  },
  {
    id: 'klimaan',
    intitule: 'Projets d’énergie et de rénovation portés localement',
    porteur: 'Klimaan CV',
    objectifServiId: 'eu-ges-2030',
    horizonAnneesMin: 8,
    agrement: {
      type: 'cooperative-citoyenne',
      reference: 'Société coopérative citoyenne, membre de REScoop Vlaanderen',
      url: 'https://klimaan.be/',
    },
    rendementObserve: [],
    rendementNonPublie: {
      raison: 'Aucune série de dividendes n’est publiée dans un format ouvert.',
      ouEstLeChiffre: 'Assemblée générale annuelle de la coopérative.',
    },
    tripleComptabilite: {
      economique: 'Capital à risque, non garanti, investi dans des installations situées dans la région.',
      social: 'Gouvernance coopérative, projets décidés avec les habitants des communes concernées.',
      environnemental: 'Production renouvelable et rénovation du bâti existant.',
    },
    urlSortante: 'https://klimaan.be/',
    source: {
      organisme: 'Klimaan CV',
      url: 'https://klimaan.be/',
      dateDonnee: '2026-08-12',
      licence: 'Information publiée par l’émetteur',
    },
  },
];

/**
 * Ce que la couche d'intégration ne peut pas faire, et pourquoi.
 * Écrit à l'écran, pas seulement dans la documentation.
 */
export const INTEGRATION_FINANCIERE = {
  apiDisponible: false,
  explication:
    'Aucune plateforme de financement participatif agréée en Belgique, ni aucune coopérative citoyenne, n’expose d’interface programmable publique documentée. L’interface est écrite comme si elle existait ; les fiches ci-dessus sont alimentées à la main, à partir de ce que les porteurs publient eux-mêmes.',
  listeFsma: 'https://www.fsma.be/fr/prestataires-de-services-de-financement-participatif',
  reglement: 'Règlement (UE) 2020/1503 relatif aux prestataires européens de services de financement participatif',
} as const;

export const AVERTISSEMENT_RISQUE =
  'Risque de perte en capital. Les parts sont illiquides : vous pouvez ne pas pouvoir les revendre quand vous le souhaitez. La plateforme n’encaisse rien, ne conseille rien, et ne classe rien par rendement.';

// ---------------------------------------------------------------------------
// Les services au citoyen — gabarit bornin.brussels.
// ---------------------------------------------------------------------------

export interface FicheService {
  id: string;
  /** Le nom en capitales de la fiche. */
  nom: string;
  /** Le nom usuel, entre parenthèses sous le titre. */
  nomUsuel?: string;
  categorie: 'familles' | 'jeunes' | 'culture-sport' | 'entraide';
  coordonnees: { adresse?: string; telephone?: string; site?: string; courriel?: string };
  /** Ce que le lieu fait, service par service, chacun nommé. */
  aPropos: string[];
  /** Les bénéficiaires, dits sans détour. */
  pourQui: string[];
  /** Les horaires réels, « uniquement sur rendez-vous » compris. */
  permanence: string[];
  themes: Theme[];
  source: { organisme: string; url: string; dateDonnee: string; licence: string };
  /** Les horaires et coordonnées précis ne sont pas publiés en données ouvertes. */
  incomplet: boolean;
}

/**
 * Quatre fiches, une par catégorie. Elles sont bâties sur ce qui est réellement
 * public — l'existence des services, leur adresse, leur rattachement — et
 * signalent explicitement ce qui ne l'est pas : les horaires exacts, que seule
 * la commune publie sur son site, qu'il est interdit de moissonner.
 */
export const SERVICES: FicheService[] = [
  {
    id: 'service-population',
    nom: 'ADMINISTRATION COMMUNALE — SERVICE POPULATION ET ÉTAT CIVIL',
    nomUsuel: 'La maison communale',
    categorie: 'familles',
    coordonnees: {
      adresse: 'Arthur Dezangrélaan 17, 1950 Kraainem',
      site: 'https://www.kraainem.be/',
      courriel: 'info@kraainem.be',
    },
    aPropos: [
      'Délivrance des cartes d’identité et des documents de séjour',
      'Actes de l’état civil : naissance, mariage, décès',
      'Inscriptions et changements d’adresse au registre de la population',
      'Légalisation de signature et certification de copies',
      'Réception des demandes de permis d’environnement pour le compte du collège',
    ],
    pourQui: [
      'Toute personne inscrite à Kraainem',
      'Toute personne qui s’y installe',
      'Les habitants francophones peuvent demander leurs documents en français, au titre des facilités linguistiques',
    ],
    permanence: [
      'Les horaires exacts ne sont pas publiés en données ouvertes.',
      'Plusieurs guichets fonctionnent uniquement sur rendez-vous : vérifiez avant de vous déplacer.',
    ],
    themes: ['securite', 'logement'],
    source: {
      organisme: 'Commune de Kraainem',
      url: 'https://www.kraainem.be/',
      dateDonnee: '2026-08-12',
      licence: 'Information publique communale',
    },
    incomplet: true,
  },
  {
    id: 'cpas',
    nom: 'CENTRE PUBLIC D’ACTION SOCIALE',
    nomUsuel: 'Le CPAS — OCMW',
    categorie: 'entraide',
    coordonnees: { adresse: 'Arthur Dezangrélaan 17, 1950 Kraainem', courriel: 'info@kraainem.be' },
    aPropos: [
      'Revenu d’intégration sociale : instruction de la demande et décision',
      'Aide sociale individuelle : alimentaire, énergétique, médicale',
      'Médiation de dettes et guidance budgétaire',
      'Aide au logement et garantie locative',
      'Service d’aide aux familles et aux aînés à domicile',
    ],
    pourQui: [
      'Toute personne en difficulté résidant à Kraainem, sans condition de nationalité',
      'Les personnes âgées isolées',
      'Les ménages en difficulté de paiement d’énergie ou de loyer',
    ],
    permanence: [
      'Les permanences ne sont pas publiées en données ouvertes.',
      'La demande de revenu d’intégration donne lieu à une décision dans les trente jours (loi du 26 mai 2002, art. 21 § 1er).',
    ],
    themes: ['aides-droits-sociaux', 'aines', 'logement'],
    source: {
      organisme: 'CPAS de Kraainem',
      url: 'https://www.kraainem.be/',
      dateDonnee: '2026-08-12',
      licence: 'Information publique communale',
    },
    incomplet: true,
  },
  {
    id: 'bibliotheque',
    nom: 'BIBLIOTHÈQUE COMMUNALE',
    nomUsuel: 'De bib',
    categorie: 'culture-sport',
    coordonnees: { adresse: 'Kraainem', site: 'https://www.kraainem.be/' },
    aPropos: [
      'Prêt de livres, de bandes dessinées et de périodiques',
      'Espace de lecture et de travail',
      'Activités de lecture pour les enfants',
      'Accès à internet et accompagnement numérique',
    ],
    pourQui: ['Tous les habitants', 'Les enfants et les écoles de la commune', 'Les personnes sans accès internet à domicile'],
    permanence: ['Les horaires ne sont pas publiés en données ouvertes.'],
    themes: ['culture-sport', 'enfance-ecole'],
    source: {
      organisme: 'Commune de Kraainem',
      url: 'https://www.kraainem.be/',
      dateDonnee: '2026-08-12',
      licence: 'Information publique communale',
    },
    incomplet: true,
  },
  {
    id: 'sporthal',
    nom: 'HALL OMNISPORTS COMMUNAL',
    nomUsuel: 'De sporthal',
    categorie: 'jeunes',
    coordonnees: { adresse: 'Kraainem', site: 'https://www.kraainem.be/' },
    aPropos: [
      'Salle omnisports mise à disposition des clubs',
      'Location de créneaux aux particuliers et associations',
      'Accueil des stages sportifs pendant les congés scolaires',
    ],
    pourQui: ['Les clubs sportifs de la commune', 'Les jeunes en stage pendant les congés', 'Les particuliers qui louent un créneau'],
    permanence: [
      'Les horaires ne sont pas publiés en données ouvertes.',
      'Les jours de fermeture supplémentaires sont arrêtés par le collège : ils apparaissent dans le fil quand une décision les fixe.',
    ],
    themes: ['culture-sport', 'enfance-ecole'],
    source: {
      organisme: 'Commune de Kraainem',
      url: 'https://www.kraainem.be/',
      dateDonnee: '2026-08-12',
      licence: 'Information publique communale',
    },
    incomplet: true,
  },
];

/**
 * Les inscriptions aux séances, formations et stages.
 *
 * Il n'existe aucun registre agrégé de ces séances en Belgique. La couverture
 * réelle doit donc être affichée : elle est nulle.
 */
export const INSCRIPTIONS = {
  registreAgrege: false,
  couvertureReelle: 0,
  explication:
    'Aucun registre agrégé des séances d’information, formations et stages n’existe. Chaque organisateur publie de son côté, souvent sur une page ou un formulaire propre. La plateforme ne peut donc pas proposer un formulaire unique, et n’affiche pas de faux bouton d’inscription.',
} as const;
