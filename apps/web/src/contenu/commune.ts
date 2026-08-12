/**
 * Contenu communal.
 *
 * Ce fichier mélange deux natures très différentes, et la distinction est
 * explicite dans chaque objet par le champ `demonstration` :
 *
 *   — `demonstration: false` : fait vérifié dans une source citée. Le règlement
 *     de participation, les démarches et leurs délais légaux en font partie.
 *   — `demonstration: true` : contenu de démonstration, parce que la donnée
 *     n'existe pas et qu'aucune convention ne permet de l'obtenir. Il porte un
 *     badge à l'écran et un interrupteur dédié permet de le masquer — jamais
 *     un filtre partagé avec du contenu réel (§ 16).
 */

import type { EtatInitiative, Theme } from '@pc/core';

// ---------------------------------------------------------------------------
// Le règlement de participation — art. 304 §5 du Decreet Lokaal Bestuur.
// C'est le point le plus important de l'écran Budget, et il est réel.
// ---------------------------------------------------------------------------

export const REGLEMENT_PARTICIPATION = {
  territoireCode: '23099',
  /**
   * Vérifié le 12 août 2026 : aucune décision portant adoption d'un règlement
   * de participation (« participatiereglement », « reglement burgerinitiatief »,
   * « verzoekschrift ») n'apparaît dans les séances du conseil communal de
   * Kraainem publiées sur Lokaal Beslist depuis mai 2021.
   *
   * L'absence est donc une observation, pas une supposition — et c'est
   * exactement ce que la plateforme doit écrire.
   */
  adopte: false,
  fondement: {
    texte: 'Decreet over het lokaal bestuur, artikel 304, § 5',
    resume:
      'Le conseil communal doit adopter un règlement fixant les conditions auxquelles les habitants peuvent inscrire une proposition ou une demande à l’ordre du jour du conseil. C’est ce règlement, et lui seul, qui fixe le seuil de signatures.',
    url: 'https://codex.vlaanderen.be/PrintDocument.ashx?id=1029017',
  },
  seuilSignatures: null,
  conditions: [] as string[],
  canalDepot: 'Dépôt écrit auprès du secrétariat communal, Arthur Dezangrélaan 17, 1950 Kraainem',
  verifieLe: '2026-08-12',
  methodeVerification:
    'Recherche des termes « participatie », « burgerinitiatief », « verzoekschrift » et « inspraak » dans les intitulés des points de séance du conseil communal collectés depuis mai 2021.',
  source: {
    organisme: 'Lokaal Beslist — Agentschap Binnenlands Bestuur',
    url: 'https://lokaalbeslist.vlaanderen.be/',
    dateDonnee: '2026-08-12',
    licence: 'Modellicentie Gratis Hergebruik',
  },
} as const;

/** Formule imposée, affichée telle quelle sous chaque bouton de soutien. */
export const FORMULE_SOUTIEN =
  'Un soutien ici n’est pas une signature légale ; il rend une demande visible et prépare son dépôt officiel.';

// ---------------------------------------------------------------------------
// Les démarches — réelles, avec leur délai légal quand il en existe un.
// ---------------------------------------------------------------------------

export interface Demarche {
  id: string;
  intitule: string;
  intituleOrigine: string;
  aQuiSAdresser: string;
  piecesAFournir: string[];
  coutEur: number | null;
  /** null quand aucun texte ne fixe de délai — dit comme tel, jamais inventé. */
  delaiLegalJours: number | null;
  delaiSource: string | null;
  url: string;
  themes: Theme[];
  demonstration: false;
}

export const DEMARCHES: Demarche[] = [
  {
    id: 'carte-identite',
    intitule: 'Demander ou renouveler une carte d’identité',
    intituleOrigine: 'Aanvraag identiteitskaart (eID)',
    aQuiSAdresser: 'Service population de la commune',
    piecesAFournir: ['Une photo d’identité récente aux normes', 'L’ancienne carte si elle existe', 'La convocation si vous en avez reçu une'],
    coutEur: 26,
    delaiLegalJours: null,
    delaiSource:
      'Aucun texte ne fixe de délai de délivrance en procédure normale. La procédure d’urgence est payante et plus rapide.',
    url: 'https://www.ibz.rrn.fgov.be/fr/documents-didentite/eid/',
    themes: ['securite'],
    demonstration: false,
  },
  {
    id: 'acte-naissance',
    intitule: 'Obtenir un acte de naissance',
    intituleOrigine: 'Afschrift of uittreksel van de geboorteakte',
    aQuiSAdresser: 'Officier de l’état civil, ou en ligne via la Banque de données des actes de l’état civil',
    piecesAFournir: ['Votre carte d’identité électronique et son code PIN pour la demande en ligne'],
    coutEur: 0,
    delaiLegalJours: null,
    delaiSource: 'Délivrance immédiate en ligne depuis la BAEC. Aucun délai légal ne s’applique.',
    url: 'https://www.mabelgiqueenligne.be/',
    themes: ['securite'],
    demonstration: false,
  },
  {
    id: 'permis-urbanisme',
    intitule: 'Demander un permis d’environnement pour des travaux',
    intituleOrigine: 'Aanvraag omgevingsvergunning',
    aQuiSAdresser: 'Collège des bourgmestre et échevins, via le guichet environnement flamand',
    piecesAFournir: ['Le dossier de plans', 'La note descriptive', 'Le rapport d’un architecte quand il est requis'],
    coutEur: null,
    delaiLegalJours: 105,
    delaiSource:
      'Decreet betreffende de omgevingsvergunning du 25 avril 2014, art. 32 : 60 jours en procédure simplifiée, 105 jours en procédure ordinaire à compter de la déclaration de complétude.',
    url: 'https://omgevingsloketrpv.omgeving.vlaanderen.be/',
    themes: ['urbanisme', 'logement'],
    demonstration: false,
  },
  {
    id: 'acces-documents',
    intitule: 'Demander la communication d’un document administratif',
    intituleOrigine: 'Verzoek tot openbaarheid van bestuur',
    aQuiSAdresser: 'L’administration qui détient le document',
    piecesAFournir: ['Une demande écrite identifiant le document recherché'],
    coutEur: 0,
    delaiLegalJours: 20,
    delaiSource:
      'Bestuursdecreet du 7 décembre 2018, art. II.32 : 20 jours calendrier, prorogeables une fois de 20 jours par décision motivée.',
    url: 'https://www.vlaanderen.be/openbaarheid-van-bestuur',
    themes: ['securite', 'taxes-budget'],
    demonstration: false,
  },
  {
    id: 'revenu-integration',
    intitule: 'Demander le revenu d’intégration sociale',
    intituleOrigine: 'Aanvraag leefloon',
    aQuiSAdresser: 'CPAS de la commune de résidence',
    piecesAFournir: ['Carte d’identité', 'Justificatifs de ressources', 'Composition de ménage'],
    coutEur: 0,
    delaiLegalJours: 30,
    delaiSource:
      'Loi du 26 mai 2002 concernant le droit à l’intégration sociale, art. 21 § 1er : décision dans les 30 jours de la réception de la demande.',
    url: 'https://www.mi-is.be/fr/revenu-dintegration',
    themes: ['aides-droits-sociaux'],
    demonstration: false,
  },
];

// ---------------------------------------------------------------------------
// Les initiatives — démonstration assumée.
// ---------------------------------------------------------------------------

export interface InitiativeAffichee {
  id: string;
  intitule: string;
  serviceResponsable: string;
  fonctionResponsable: string;
  etat: EtatInitiative;
  jalons: Array<{ libelle: string; datePrevue?: string; dateReelle?: string }>;
  budgetVoteEur?: number;
  budgetConsommeEur?: number;
  prochaineEcheance?: string;
  themes: Theme[];
  demonstration: true;
}

/**
 * Aucune commune belge ne publie ses initiatives sous forme de jalons datés
 * avec leur budget consommé. Ce que Lokaal Beslist expose, ce sont des
 * décisions isolées, sans fil conducteur ni suivi.
 *
 * Ces trois initiatives sont donc des démonstrations du gabarit — elles
 * portent un badge et sont masquables par l'interrupteur dédié. Le jour où une
 * commune publiera ces données, la structure est prête à les recevoir.
 */
export const INITIATIVES: InitiativeAffichee[] = [
  {
    id: 'demo-voirie-apaisee',
    intitule: 'Apaisement de la circulation aux abords des écoles',
    serviceResponsable: 'Service des travaux et de la mobilité',
    fonctionResponsable: 'Échevin ou échevine de la mobilité',
    etat: 'en-cours',
    jalons: [
      { libelle: 'Étude de circulation commandée', datePrevue: '2025-03-01', dateReelle: '2025-04-18' },
      { libelle: 'Consultation des riverains', datePrevue: '2025-09-15', dateReelle: '2025-10-02' },
      { libelle: 'Marché de travaux attribué', datePrevue: '2026-02-01' },
      { libelle: 'Travaux terminés', datePrevue: '2026-11-30' },
    ],
    budgetVoteEur: 480_000,
    budgetConsommeEur: 96_400,
    prochaineEcheance: '2026-02-01',
    themes: ['mobilite-voirie', 'enfance-ecole', 'securite'],
    demonstration: true,
  },
  {
    id: 'demo-toitures-solaires',
    intitule: 'Équipement solaire des bâtiments communaux',
    serviceResponsable: 'Service des travaux',
    fonctionResponsable: 'Échevin ou échevine des bâtiments',
    etat: 'engagee',
    jalons: [
      { libelle: 'Audit des toitures', datePrevue: '2025-06-01', dateReelle: '2025-06-24' },
      { libelle: 'Décision du collège', datePrevue: '2026-01-15' },
      { libelle: 'Première installation en service', datePrevue: '2026-12-01' },
    ],
    budgetVoteEur: 215_000,
    budgetConsommeEur: 12_800,
    prochaineEcheance: '2026-01-15',
    themes: ['environnement-energie'],
    demonstration: true,
  },
  {
    id: 'demo-maison-aines',
    intitule: 'Lieu d’accueil de jour pour les aînés',
    serviceResponsable: 'CPAS',
    fonctionResponsable: 'Présidence du CPAS',
    etat: 'annoncee',
    jalons: [{ libelle: 'Étude de faisabilité', datePrevue: '2026-09-30' }],
    budgetVoteEur: 0,
    themes: ['aines', 'sante-soins'],
    demonstration: true,
  },
];

// ---------------------------------------------------------------------------
// Questions publiques et propositions — démonstration assumée.
// ---------------------------------------------------------------------------

export interface QuestionAffichee {
  id: string;
  initiativeId: string;
  texte: string;
  poseesLe: string;
  memeQuestion: number;
  etatModeration: 'en-attente' | 'publiee' | 'ecartee';
  decidePar?: string;
  decideLe?: string;
  motif?: string;
  reponse?: { texte: string; fonctionSignataire: string; publieeLe: string };
  delaiLegalJours: number | null;
  demonstration: true;
}

export const QUESTIONS: QuestionAffichee[] = [
  {
    id: 'demo-q1',
    initiativeId: 'demo-voirie-apaisee',
    texte:
      'L’étude de circulation a été livrée avec sept semaines de retard. Est-ce que le marché de travaux de février tient toujours, et si non, quelle est la nouvelle date ?',
    poseesLe: '2025-11-04',
    memeQuestion: 23,
    etatModeration: 'publiee',
    decidePar: 'Modération — bénévole n° 2',
    decideLe: '2025-11-05',
    delaiLegalJours: null,
    demonstration: true,
  },
  {
    id: 'demo-q2',
    initiativeId: 'demo-toitures-solaires',
    texte:
      'Quelles toitures ont été retenues par l’audit, et pourquoi celles qui ont été écartées l’ont-elles été ?',
    poseesLe: '2025-08-19',
    memeQuestion: 8,
    etatModeration: 'publiee',
    decidePar: 'Modération — bénévole n° 1',
    decideLe: '2025-08-20',
    reponse: {
      texte:
        'Réponse de démonstration. Sur une plateforme en service, ce bloc contiendrait le texte transmis par le service, daté et signé par une fonction.',
      fonctionSignataire: 'Service des travaux',
      publieeLe: '2025-09-11',
    },
    delaiLegalJours: null,
    demonstration: true,
  },
  {
    id: 'demo-q3',
    initiativeId: 'demo-voirie-apaisee',
    texte: 'Combien coûte réellement le passage surélevé de la rue de l’Église ?',
    poseesLe: '2026-01-22',
    memeQuestion: 4,
    etatModeration: 'publiee',
    decidePar: 'Modération — bénévole n° 2',
    decideLe: '2026-01-23',
    delaiLegalJours: null,
    demonstration: true,
  },
];

export interface PropositionAffichee {
  id: string;
  titre: string;
  expose: string;
  deposeeLe: string;
  soutiens: number;
  themes: Theme[];
  etatModeration: 'en-attente' | 'publiee' | 'ecartee';
  demonstration: true;
}

export const PROPOSITIONS: PropositionAffichee[] = [
  {
    id: 'demo-p1',
    titre: 'Une navette entre le quartier du Bois et la station de métro',
    expose:
      'Les habitants du haut de la commune n’ont pas de desserte directe vers le métro. Une navette aux heures de pointe changerait la vie de ceux qui ne conduisent pas.',
    deposeeLe: '2026-03-08',
    soutiens: 147,
    themes: ['mobilite-voirie', 'aines'],
    etatModeration: 'publiee',
    demonstration: true,
  },
  {
    id: 'demo-p2',
    titre: 'Ouvrir la cour de l’école le week-end',
    expose: 'La cour est fermée et vide deux jours sur sept, alors que le quartier manque d’espace de jeu.',
    deposeeLe: '2026-05-21',
    soutiens: 62,
    themes: ['enfance-ecole', 'culture-sport'],
    etatModeration: 'publiee',
    demonstration: true,
  },
];

// ---------------------------------------------------------------------------
// Calendrier des déchets et travaux — la donnée n'existe pas en accès ouvert.
// ---------------------------------------------------------------------------

/**
 * Interza est l'intercommunale de collecte de Kraainem. Elle publie son
 * calendrier sur son propre site et dans son application, sans API ouverte
 * documentée. Le site communal interdit les outils automatisés.
 *
 * La plateforme affiche donc le lien officiel et l'absence de flux, plutôt
 * qu'un calendrier inventé qui ferait manquer une collecte à quelqu'un.
 */
export const DECHETS = {
  intercommunale: 'Interza',
  communesDesservies: ['Kraainem', 'Wezembeek-Oppem', 'Zaventem', 'Steenokkerzeel', 'Machelen'],
  fluxOuvert: false,
  raisonAbsence:
    'Interza publie son calendrier sur son site et dans son application, sans interface programmable documentée. Aucune convention n’existe à ce jour. Afficher un calendrier reconstitué ferait manquer une collecte à quelqu’un : la plateforme s’y refuse.',
  urlOfficiel: 'https://www.interza.be/afvalkalender',
  demarcheEngagee:
    'Une demande d’accès à un flux structuré (ICS ou JSON) doit être adressée à Interza. Le schéma attendu est décrit dans /docs/dechets-interza.md.',
  demonstration: false,
} as const;

export const TRAVAUX = {
  fluxOuvert: false,
  organismeAttendu: 'Commune de Kraainem et Agentschap Wegen en Verkeer',
  raisonAbsence:
    'Les chantiers sur voirie régionale figurent dans le système GIPOD de la Région flamande, dont l’accès est réservé aux gestionnaires de voirie. Les chantiers communaux ne sont publiés que sous forme d’arrêtés de police, sans géométrie exploitable.',
  urlGipod: 'https://www.vlaanderen.be/digitaal-vlaanderen/onze-oplossingen/gipod',
  demonstration: false,
} as const;
