/**
 * Les reformulations.
 *
 * C'est le travail humain que rien ne remplace, et la raison pour laquelle le
 * fil est court. Un acte de Lokaal Beslist arrive sous cette forme :
 *
 *     « Mobiliteit - Aanvullend reglement »
 *
 * Ce n'est ni un titre, ni une information : c'est une référence de dossier.
 * Six actes différents du même mois portent exactement cet intitulé. La
 * reformulation les distingue, en fait des phrases qu'un habitant comprend, et
 * y ajoute les trois choses que la source ne contient pas — ce qui change,
 * pour qui, à partir de quand — plus l'action, y compris quand il n'y en a
 * aucune.
 *
 * Règles, appliquées à chaque entrée ci-dessous :
 *   — le titre fait au plus quatre-vingt-dix caractères et n'est jamais
 *     l'intitulé administratif recopié ;
 *   — `impact` suit le gabarit : ce qui change · pour qui · à partir de quand ;
 *   — `action` est obligatoire, `aucune_action` compris, et alors on l'écrit ;
 *   — `validePar` et `valideLe` disent qui a validé et quand ;
 *   — `assisteeParModele` est vrai quand un modèle de langage a produit la
 *     proposition initiale. Il ne publie jamais directement : chaque entrée
 *     ci-dessous a été relue contre le texte néerlandais de l'acte.
 *
 * Les clés sont les identifiants de points d'agenda de Lokaal Beslist. Elles
 * sont stables : la source les dérive de l'URI de l'acte.
 *
 * Sur 3 207 points collectés en deux ans, 15 sont reformulés ici. Ce rapport
 * est le vrai coût du produit, et il ne faut pas le cacher : reformuler
 * l'ensemble d'une commune demande une personne, pas un algorithme.
 */

import type { Action, Categorie, Theme } from '@pc/core';

export interface Reformulation {
  titre: string;
  impact: string;
  action: Action;
  categorie: Categorie;
  themes: Theme[];
  publics?: string[];
  entreeEnVigueur?: string;
  echeance?: string;
  objectifsLies?: string[];
  validePar: string;
  valideLe: string;
  assisteeParModele: boolean;
}

const VALIDE = { validePar: 'Rédaction — relecture contre le texte néerlandais', valideLe: '2026-08-12', assisteeParModele: true };

export const REFORMULATIONS: Record<string, Reformulation> = {
  // --- Mobilité : zone 30 étendue -----------------------------------------
  '51cd5ee5-0dad-5d7a-a899-10ae2b608dfe': {
    titre: 'La zone 30 est étendue à l’avenue Armand Forton',
    impact:
      'La vitesse passe à 30 km/h sur l’avenue Armand Forton, entre l’avenue des Sorbiers et l’avenue Saint-Georges. Concerne tous les conducteurs qui empruntent cette portion, et les riverains. Applicable dès la pose des panneaux F4a et F4b.',
    action: {
      kind: 'aucune_action',
      explication:
        'La mesure s’applique d’elle-même dès que les panneaux sont placés. Le règlement est transmis pour information au Departement Mobiliteit en Openbare Werken.',
    },
    categorie: 'reglement-taxe',
    themes: ['mobilite-voirie', 'securite'],
    publics: ['riverains', 'automobilistes', 'parents'],
    entreeEnVigueur: '2026-07-22',
    ...VALIDE,
  },

  // --- Mobilité : sentier réservé aux piétons et cyclistes ----------------
  '23b4b559-5c51-5cca-bd71-368eeda4f968': {
    titre: 'Le sentier vers Wezembeek-Oppem est réservé aux piétons et aux vélos',
    impact:
      'Le sentier entre l’Appelbomenoord et la limite de Wezembeek-Oppem devient interdit aux véhicules dans les deux sens, sauf vélos et speed pedelecs. Concerne les usagers du sentier. Applicable dès la pose du panneau C3 avec le panneau additionnel M11.',
    action: {
      kind: 'aucune_action',
      explication: 'La mesure vaut dès la signalisation posée sur place.',
    },
    categorie: 'reglement-taxe',
    themes: ['mobilite-voirie'],
    publics: ['cyclistes', 'piétons', 'riverains'],
    entreeEnVigueur: '2026-07-28',
    ...VALIDE,
  },

  // --- Mobilité : priorité inversée ----------------------------------------
  '23f924a4-7173-565f-964b-b21d70ec3350': {
    titre: 'La priorité s’inverse au rétrécissement de la Potaardestraat',
    impact:
      'Au rétrécissement de la Potaardestraat, à hauteur du Hazelnotenlarenweg, ce sont désormais les conducteurs venant de Kraainem qui ont la priorité ; ceux qui roulent vers Wezembeek-Oppem doivent céder le passage. Concerne tous les conducteurs de cette rue. Applicable dès la pose des panneaux B19 et B21.',
    action: {
      kind: 'aucune_action',
      explication:
        'mais la règle change par rapport à ce que les habitués connaissaient : c’est l’inverse de la situation précédente.',
    },
    categorie: 'reglement-taxe',
    themes: ['mobilite-voirie', 'securite'],
    publics: ['automobilistes', 'riverains'],
    entreeEnVigueur: '2026-07-28',
    ...VALIDE,
  },

  // --- Mobilité : stationnement limité aux véhicules courts ---------------
  '090d5fa0-94a1-5faf-a290-6889f8579864': {
    titre: 'Le stationnement avenue Arthur Dezangré se limite aux véhicules de moins de 12 m',
    impact:
      'La bande de stationnement de l’avenue Arthur Dezangré, entre le Mezenweg et la limite de Zaventem, est réservée aux motos, voitures, véhicules à double usage et minibus. Elle sera physiquement découpée en emplacements de 12 mètres par des bornes, des pavés ou des bacs à plantes, pour empêcher les grands véhicules de s’y garer. Concerne les riverains et les transporteurs. Applicable dès les aménagements et la pose du panneau E9b.',
    action: {
      kind: 'aucune_action',
      explication: 'Rien à faire pour les riverains. Les conducteurs de poids lourds devront stationner ailleurs.',
    },
    categorie: 'reglement-taxe',
    themes: ['mobilite-voirie', 'urbanisme'],
    publics: ['riverains', 'automobilistes'],
    entreeEnVigueur: '2026-07-22',
    ...VALIDE,
  },

  // --- Mobilité : consultation sans suite ---------------------------------
  'af6f426f-4377-5362-b04d-cca8d42be370': {
    titre: 'Avenue des Faisans : la consultation des riverains ne débouche sur rien',
    impact:
      'Quatorze réponses sur soixante logements : sept pour des mesures de ralentissement, cinq pour du dolomie sur l’accotement, une pour un trottoir, une invalide. Le collège décide de ne rien entreprendre. Concerne les riverains de l’avenue des Faisans. Décidé le 22 juillet 2026.',
    action: {
      kind: 'aucune_action',
      explication:
        'et c’est le sens même de la décision : la consultation est close sans suite. Les riverains reçoivent un courrier les en informant. Ce cas est instructif — une consultation à 23 % de réponse a servi à justifier l’absence de mesure.',
    },
    categorie: 'decision',
    themes: ['mobilite-voirie', 'securite'],
    publics: ['riverains'],
    ...VALIDE,
  },

  // --- Mobilité : plateau refusé, autres mesures --------------------------
  '039c9f8f-148f-5b7b-b9fd-057351c8c1df': {
    titre: 'Pas de plateau surélevé au carrefour Armand Forton — Saint-Georges',
    impact:
      'Le collège renonce au plateau surélevé prévu au carrefour de l’avenue Armand Forton et de l’avenue Saint-Georges, et retient une autre mesure de ralentissement : coussins berlinois, ou déviation d’axe par bornes ou bacs à plantes. Concerne les riverains et les usagers du carrefour. Décidé le 22 juillet 2026 ; la variante retenue conditionne le calendrier.',
    action: {
      kind: 'aucune_action',
      explication:
        'À noter : le texte publié par la commune contient trois variantes d’article 2 séparées par « OF » (ou). La source ne permet pas de savoir laquelle a été retenue.',
    },
    categorie: 'decision',
    themes: ['mobilite-voirie', 'securite'],
    publics: ['riverains'],
    ...VALIDE,
  },

  // --- Événement : fermeture de rue pour un festival ----------------------
  '2c279d21-c4e7-51d8-81b5-f02ab2ec9772': {
    titre: 'Festival d’été du 27 juin : rue fermée et déviations',
    impact:
      'L’avenue des Sorbiers est fermée aux numéros 2 à 8, avec interdiction de stationner là et sur le parking Cammeland, et interdiction de tourner depuis l’avenue Arthur Dezangré. Deux déviations sont prévues. Concerne les riverains et les automobilistes du quartier. Le samedi 27 juin 2026, de 9 h à 22 h.',
    action: {
      kind: 'seance',
      libelle: 'Festival d’été — circulation modifiée dans le quartier',
      date: '2026-06-27',
      lieu: 'Avenue des Sorbiers, 1950 Kraainem',
    },
    categorie: 'travaux-voirie',
    themes: ['mobilite-voirie', 'culture-sport'],
    publics: ['riverains', 'automobilistes'],
    entreeEnVigueur: '2026-06-27',
    echeance: '2026-06-27',
    ...VALIDE,
  },

  // --- Événement : Summer Kids Village ------------------------------------
  'ec86fc0f-b8ac-5d04-ba50-06d75192ba67': {
    titre: 'Summer Kids Village : le Kruisveld fermé trois après-midi d’été',
    impact:
      'Le Kruisveld est fermé à la circulation et il est interdit d’y tourner depuis l’avenue d’Annecy et la rue Amédé Bracke. Concerne les riverains, et les familles qui viennent à l’activité. Les 29 juillet, 12 août et 26 août 2026, de 15 h à 18 h.',
    action: {
      kind: 'seance',
      libelle: 'Summer Kids Village — activité pour enfants, rue fermée',
      date: '2026-07-29',
      lieu: 'Kruisveld, 1950 Kraainem',
    },
    categorie: 'evenement',
    themes: ['enfance-ecole', 'mobilite-voirie', 'culture-sport'],
    publics: ['parents', 'riverains'],
    entreeEnVigueur: '2026-07-29',
    echeance: '2026-08-26',
    ...VALIDE,
  },

  // --- Enfance : plaine de jeux d'été -------------------------------------
  'b6a9b7ba-25f5-5c4e-8ff9-b4470d898afa': {
    titre: 'La plaine de jeux d’été ouvre à l’école Diabolo du 1er juillet au 21 août',
    impact:
      'Le collège autorise l’ASBL Diabolo à organiser une plaine de jeux dans l’école communale francophone Diabolo, avenue d’Hébron 17. Le réfectoire, la salle de gymnastique et deux classes sont mis à disposition ; les sanitaires sont nettoyés chaque jour. Concerne les familles de la commune. Du 1er juillet au 21 août 2026.',
    action: {
      kind: 'demarche',
      libelle: 'L’inscription se fait auprès de l’organisateur, l’ASBL Diabolo — la commune autorise, elle n’inscrit pas',
      url: 'https://www.kraainem.be/',
    },
    categorie: 'evenement',
    themes: ['enfance-ecole', 'culture-sport'],
    publics: ['parents', 'enfants'],
    entreeEnVigueur: '2026-07-01',
    echeance: '2026-08-21',
    ...VALIDE,
  },

  // --- École : règlement scolaire 2026-2027 -------------------------------
  '9af7acd2-35f0-5dc1-81e0-e234532ffe1b': {
    titre: 'Le règlement scolaire 2026-2027 de l’école Diabolo passe au conseil communal',
    impact:
      'Le collège prend connaissance du règlement de travail, du règlement scolaire et de la brochure d’information de l’école communale francophone Diabolo, avec le barème des participations financières demandées aux familles. Concerne les parents d’élèves de Diabolo. Pour l’année scolaire 2026-2027, après vote du conseil communal.',
    action: {
      kind: 'aucune_action',
      explication:
        'Rien à faire pour l’instant : le texte doit encore être approuvé par le conseil communal. Le barème des participations est en annexe de la décision, non publiée par la source.',
    },
    categorie: 'decision',
    themes: ['enfance-ecole'],
    publics: ['parents'],
    ...VALIDE,
  },

  // --- Taxe : logements négligés ------------------------------------------
  'e0e9663d-0577-5087-809b-401260b4e347': {
    titre: 'Une taxe sur les logements et bâtiments négligés est en préparation',
    impact:
      'Le collège prend connaissance d’un projet de règlement instaurant un inventaire et une taxe sur les logements et bâtiments laissés à l’abandon, avec l’attestation d’inscription à l’inventaire. Concerne les propriétaires de biens inoccupés ou dégradés. Le texte doit encore être voté par le conseil communal : rien n’est dû aujourd’hui.',
    action: {
      kind: 'aucune_action',
      explication:
        'Rien à faire tant que le conseil communal n’a pas voté. Un propriétaire concerné a cependant intérêt à suivre ce point : une inscription à l’inventaire déclenche la taxe.',
    },
    categorie: 'reglement-taxe',
    themes: ['logement', 'taxes-budget', 'urbanisme'],
    publics: ['propriétaires'],
    ...VALIDE,
  },

  // --- Règlement : cimetière ----------------------------------------------
  'afc90ce2-96cd-54a7-9c78-1a91d623294b': {
    titre: 'Le règlement du cimetière communal est entièrement réécrit',
    impact:
      'Le conseil communal abroge l’ordonnance de police coordonnée et le règlement des concessions de 2012, et adopte un nouveau règlement d’ordre intérieur du cimetière communal. Concerne toute personne titulaire d’une concession ou qui en demande une. À partir du vote du 19 mai 2026.',
    action: {
      kind: 'demarche',
      libelle: 'Demander ou renouveler une concession auprès du service population',
      url: 'https://www.kraainem.be/',
    },
    categorie: 'reglement-taxe',
    themes: ['securite', 'aines'],
    publics: ['familles', 'aînés'],
    entreeEnVigueur: '2026-05-19',
    ...VALIDE,
  },

  // --- Budget : comptes annuels 2025 --------------------------------------
  '4c8f10df-3ef4-53de-88fc-581da2756bcc': {
    titre: 'Les comptes 2025 de la commune et du CPAS sont arrêtés',
    impact:
      'Le conseil communal approuve les comptes annuels 2025 du CPAS et arrête ceux de la commune. C’est l’acte qui fixe ce qui a réellement été dépensé l’an dernier. Concerne tout habitant qui veut savoir où est passé l’argent. Décidé le 19 mai 2026 ; transmis à l’autorité de tutelle.',
    action: {
      kind: 'demarche',
      libelle: 'Demander la communication des comptes annuels — délai légal de 20 jours',
      url: 'https://www.vlaanderen.be/openbaarheid-van-bestuur',
      delaiLegalJours: 20,
    },
    categorie: 'budget',
    themes: ['taxes-budget'],
    publics: ['tous'],
    entreeEnVigueur: '2026-05-19',
    ...VALIDE,
  },

  // --- Urbanisme : recours sur un permis ----------------------------------
  '1e361d0a-42b6-5a23-9859-f77848d624bb': {
    titre: 'Permis Blauwe Bosbessenlaan : le collège maintient son refus malgré son administration',
    impact:
      'Un recours a été introduit le 21 mai 2026 devant la députation permanente du Brabant flamand, déclaré recevable le 18 juin. Le collège décide de ne pas suivre l’avis de sa propre administration et confirme sa décision du 14 avril 2026. Concerne le demandeur, les riverains, et quiconque suit les permis dans le quartier. La députation tranchera.',
    action: {
      kind: 'aucune_action',
      explication:
        'Rien à faire pour un tiers : la procédure de recours suit son cours devant la province. Ce point mérite d’être signalé parce que le collège s’écarte explicitement de l’avis technique de son administration.',
    },
    categorie: 'decision',
    themes: ['urbanisme', 'logement'],
    publics: ['riverains', 'propriétaires'],
    ...VALIDE,
  },

  // --- Culture : restauration de l'orgue ----------------------------------
  'f2a9ddba-7c01-5871-a558-ac3a94556fbf': {
    titre: 'Restauration de l’orgue de Saint-Pancrace : 23 005 € de plus approuvés',
    impact:
      'Le collège approuve le vingtième état d’avancement du chantier de restauration de l’orgue de l’église Saint-Pancrace : 19 012,74 € hors TVA, soit 23 005,42 € TVA comprise. Une partie est subsidiée par l’Agence du patrimoine immobilier de Flandre, une autre par la fabrique d’église. Concerne le contribuable communal. Décidé le 9 juin 2026.',
    action: {
      kind: 'aucune_action',
      explication:
        'Ce vingtième état d’avancement montre qu’un chantier de restauration se paie par tranches successives, chacune votée séparément : le coût total ne figure dans aucune décision unique.',
    },
    categorie: 'budget',
    themes: ['culture-sport', 'taxes-budget'],
    publics: ['tous'],
    entreeEnVigueur: '2026-06-09',
    ...VALIDE,
  },
};

/** Nombre de reformulations tenues à jour — affiché sur la page d'admission. */
export const NOMBRE_REFORMULATIONS = Object.keys(REFORMULATIONS).length;
