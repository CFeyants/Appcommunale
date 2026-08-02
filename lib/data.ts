/**
 * Données fictives d'une commune type — support du mockup « Brique 1 ».
 *
 * Tout ici est inventé, à titre de démonstration. La structure, en revanche,
 * respecte le document de cadrage :
 *  - trois ORIENTATIONS de long terme (le « cap communal »),
 *  - chacune reliée vers le HAUT (régional / national / européen),
 *  - chaque DÉCISION, ligne de BUDGET et PROJET porte une étiquette de
 *    trajectoire, c'est-à-dire un lien explicite vers l'orientation qu'il sert.
 *
 * Principe de conception : la donnée brute est séparée de sa présentation.
 * Ce fichier EST la donnée brute — il est réexporté tel quel par /donnees.
 */

export type OrientationId = "alimentation" | "climat" | "transmission";

export interface Orientation {
  id: OrientationId;
  titre: string;
  resume: string;
  /** Le lien montant : à quoi cette orientation communale se rattache au-dessus. */
  rattachement: {
    regional: string;
    national: string;
    europeen: string;
  };
  horizon: string;
  /** Une cible chiffrée, pour rendre la trajectoire tangible (jamais un score agrégé). */
  cible: string;
  couleur: {
    /** classes Tailwind, une par usage */
    texte: string;
    fond: string;
    bordure: string;
    point: string;
  };
}

export const commune = {
  nom: "Tilleul-sur-Meuse",
  habitants: 4230,
  region: "Wallonie (Belgique)",
  miseAJour: "2026-07-31",
  legislature: "2024–2030",
};

export const orientations: Orientation[] = [
  {
    id: "alimentation",
    titre: "Alimentation & relocalisation sélective",
    resume:
      "Maîtriser les chaînes alimentaires dont la rupture serait grave : soutien aux producteurs locaux, potagers partagés, circuits courts. On ne relocalise pas tout — on sécurise l'essentiel.",
    rattachement: {
      regional: "Stratégie wallonne « Manger Demain » — souveraineté alimentaire régionale",
      national: "Plan fédéral de résilience des chaînes d'approvisionnement",
      europeen: "Farm to Fork (Pacte vert européen)",
    },
    horizon: "2035",
    cible: "50 % de l'approvisionnement des cantines communales en circuits courts d'ici 2035",
    couleur: {
      texte: "text-amber-700",
      fond: "bg-amber-50",
      bordure: "border-amber-200",
      point: "bg-amber-500",
    },
  },
  {
    id: "climat",
    titre: "Climat & transition énergétique",
    resume:
      "Une trajectoire de réduction des émissions adoptée par le conseil communal, à laquelle chaque décision se rattache — ou dont elle s'écarte visiblement.",
    rattachement: {
      regional: "Plan Air Climat Énergie de la Wallonie (PACE 2030)",
      national: "Plan National Énergie-Climat (PNEC)",
      europeen: "Objectif « Fit for 55 » — −55 % d'émissions d'ici 2030",
    },
    horizon: "2030",
    cible: "−40 % d'émissions du patrimoine communal par rapport à 2019, d'ici 2030",
    couleur: {
      texte: "text-sky-700",
      fond: "bg-sky-50",
      bordure: "border-sky-200",
      point: "bg-sky-500",
    },
  },
  {
    id: "transmission",
    titre: "Transmission & soin",
    resume:
      "La Maison de la transmission et l'infrastructure de lien : rendre du temps et du soin, restaurer des canaux de reconnaissance sains, protéger l'attention collectivement.",
    rattachement: {
      regional: "Politique wallonne des aînés et de la cohésion sociale",
      national: "Loi « Only Once » (5 mai 2014) — dites-le-nous une fois",
      europeen: "Socle européen des droits sociaux",
    },
    horizon: "2032",
    cible: "Un réseau « Maison de la transmission » couvrant 100 % des quartiers d'ici 2028",
    couleur: {
      texte: "text-violet-700",
      fond: "bg-violet-50",
      bordure: "border-violet-200",
      point: "bg-violet-500",
    },
  },
];

export function getOrientation(id: OrientationId): Orientation {
  const o = orientations.find((x) => x.id === id);
  if (!o) throw new Error(`Orientation inconnue : ${id}`);
  return o;
}

// ---------------------------------------------------------------------------
// Décisions du conseil communal — chacune reliée à une orientation.
// ---------------------------------------------------------------------------

export type EtatDecision = "adoptée" | "en cours" | "en projet";

export interface Decision {
  id: string;
  date: string;
  titre: string;
  description: string;
  orientation: OrientationId;
  coutEuros: number;
  etat: EtatDecision;
  /** Numéro de séance du conseil, pour la traçabilité. */
  seance: string;
}

export const decisions: Decision[] = [
  {
    id: "D-2026-041",
    date: "2026-06-24",
    titre: "Marché de fourniture bio et local pour les cantines scolaires",
    description:
      "Attribution du marché d'approvisionnement des trois écoles communales à un groupement de producteurs situés dans un rayon de 30 km.",
    orientation: "alimentation",
    coutEuros: 218000,
    etat: "adoptée",
    seance: "Conseil du 24 juin 2026",
  },
  {
    id: "D-2026-038",
    date: "2026-06-24",
    titre: "Rénovation énergétique de l'école du Centre",
    description:
      "Isolation par l'extérieur, remplacement de la chaufferie mazout par une pompe à chaleur, pose de 90 m² de panneaux photovoltaïques.",
    orientation: "climat",
    coutEuros: 640000,
    etat: "en cours",
    seance: "Conseil du 24 juin 2026",
  },
  {
    id: "D-2026-035",
    date: "2026-05-27",
    titre: "Création du poste de coordinateur·rice de la Maison de la transmission",
    description:
      "Recrutement d'un temps plein chargé de structurer le réseau bénévole intergénérationnel (relais sortie d'école, aide aux devoirs, présence aux aînés isolés).",
    orientation: "transmission",
    coutEuros: 58000,
    etat: "adoptée",
    seance: "Conseil du 27 mai 2026",
  },
  {
    id: "D-2026-031",
    date: "2026-05-27",
    titre: "Aménagement de trois potagers partagés",
    description:
      "Mise à disposition de terrains communaux, clôture, cabanons et point d'eau, en gestion collective par les habitants.",
    orientation: "alimentation",
    coutEuros: 47000,
    etat: "en cours",
    seance: "Conseil du 27 mai 2026",
  },
  {
    id: "D-2026-027",
    date: "2026-04-29",
    titre: "Plan « écoles sans téléphone »",
    description:
      "Dotation en pochettes de mise à distance des smartphones pour les deux implantations du secondaire, et accompagnement des équipes.",
    orientation: "transmission",
    coutEuros: 12500,
    etat: "adoptée",
    seance: "Conseil du 29 avril 2026",
  },
  {
    id: "D-2026-022",
    date: "2026-03-25",
    titre: "Extension du réseau de pistes cyclables — phase 2",
    description:
      "3,2 km de pistes séparées reliant les hameaux au centre et aux arrêts de bus, dans le cadre du plan de mobilité douce.",
    orientation: "climat",
    coutEuros: 385000,
    etat: "en projet",
    seance: "Conseil du 25 mars 2026",
  },
  {
    id: "D-2026-018",
    date: "2026-03-25",
    titre: "Guichet unique citoyen — cadrage",
    description:
      "Cadrage du point d'entrée unique (crèche, cantine, extrascolaire, sport, culture, aides du CPAS) adossé à itsme et à l'eBox, avec traçabilité d'accès aux données.",
    orientation: "transmission",
    coutEuros: 34000,
    etat: "en projet",
    seance: "Conseil du 25 mars 2026",
  },
  {
    id: "D-2026-011",
    date: "2026-02-25",
    titre: "Étude de faisabilité d'une monnaie locale",
    description:
      "Mission confiée à un juriste spécialisé pour cadrer le partenariat avec un émetteur de monnaie électronique agréé (conformité MiCA).",
    orientation: "alimentation",
    coutEuros: 18000,
    etat: "adoptée",
    seance: "Conseil du 25 février 2026",
  },
];

// ---------------------------------------------------------------------------
// Budget — du voté à l'exécuté, par orientation.
// ---------------------------------------------------------------------------

export interface LigneBudget {
  orientation: OrientationId;
  intitule: string;
  voteEuros: number;
  executeEuros: number;
}

export const budget = {
  annee: 2026,
  totalCommuneEuros: 9_450_000,
  lignes: [
    {
      orientation: "alimentation" as OrientationId,
      intitule: "Alimentation locale, cantines & potagers",
      voteEuros: 340000,
      executeEuros: 236000,
    },
    {
      orientation: "climat" as OrientationId,
      intitule: "Rénovation énergétique & mobilité douce",
      voteEuros: 1_180_000,
      executeEuros: 712000,
    },
    {
      orientation: "transmission" as OrientationId,
      intitule: "Maison de la transmission & lien social",
      voteEuros: 205000,
      executeEuros: 118000,
    },
  ] as LigneBudget[],
};

// ---------------------------------------------------------------------------
// Projets — jalons, retards, écarts au plan.
// ---------------------------------------------------------------------------

export type EtatJalon = "fait" | "en cours" | "à venir" | "en retard";

export interface Jalon {
  libelle: string;
  echeance: string;
  etat: EtatJalon;
}

export interface Projet {
  id: string;
  titre: string;
  orientation: OrientationId;
  avancementPct: number;
  budgetEuros: number;
  depenseEuros: number;
  /** Écart au calendrier initial, en semaines (négatif = en avance). */
  ecartSemaines: number;
  jalons: Jalon[];
}

export const projets: Projet[] = [
  {
    id: "P-01",
    titre: "Rénovation énergétique de l'école du Centre",
    orientation: "climat",
    avancementPct: 55,
    budgetEuros: 640000,
    depenseEuros: 351000,
    ecartSemaines: 4,
    jalons: [
      { libelle: "Étude thermique", echeance: "2026-01", etat: "fait" },
      { libelle: "Marché de travaux attribué", echeance: "2026-03", etat: "fait" },
      { libelle: "Isolation & toiture", echeance: "2026-08", etat: "en cours" },
      { libelle: "Pompe à chaleur & photovoltaïque", echeance: "2026-11", etat: "à venir" },
      { libelle: "Réception des travaux", echeance: "2027-01", etat: "à venir" },
    ],
  },
  {
    id: "P-02",
    titre: "Maison de la transmission — réseau léger",
    orientation: "transmission",
    avancementPct: 35,
    budgetEuros: 205000,
    depenseEuros: 71000,
    ecartSemaines: 0,
    jalons: [
      { libelle: "Recrutement du coordinateur", echeance: "2026-06", etat: "fait" },
      { libelle: "Conventions écoles / médiathèque / résidence", echeance: "2026-09", etat: "en cours" },
      { libelle: "Lancement du relais sortie d'école", echeance: "2026-10", etat: "à venir" },
      { libelle: "Premiers créneaux aide aux devoirs", echeance: "2026-11", etat: "à venir" },
      { libelle: "Évaluation capacité relationnelle", echeance: "2027-06", etat: "à venir" },
    ],
  },
  {
    id: "P-03",
    titre: "Cantines en circuits courts",
    orientation: "alimentation",
    avancementPct: 70,
    budgetEuros: 340000,
    depenseEuros: 236000,
    ecartSemaines: -2,
    jalons: [
      { libelle: "Cahier des charges circuits courts", echeance: "2026-02", etat: "fait" },
      { libelle: "Marché attribué au groupement local", echeance: "2026-06", etat: "fait" },
      { libelle: "Première rentrée en approvisionnement local", echeance: "2026-09", etat: "en cours" },
      { libelle: "Bilan première année", echeance: "2027-07", etat: "à venir" },
    ],
  },
  {
    id: "P-04",
    titre: "Pistes cyclables — phase 2",
    orientation: "climat",
    avancementPct: 15,
    budgetEuros: 385000,
    depenseEuros: 41000,
    ecartSemaines: 9,
    jalons: [
      { libelle: "Études de tracé", echeance: "2026-04", etat: "fait" },
      { libelle: "Permis d'urbanisme", echeance: "2026-07", etat: "en retard" },
      { libelle: "Marché de travaux", echeance: "2026-10", etat: "à venir" },
      { libelle: "Travaux tronçon nord", echeance: "2027-03", etat: "à venir" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Helpers de présentation (jamais un score agrégé — juste du formatage).
// ---------------------------------------------------------------------------

export function euros(n: number): string {
  return new Intl.NumberFormat("fr-BE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function pct(n: number): string {
  return new Intl.NumberFormat("fr-BE", { maximumFractionDigits: 0 }).format(n) + " %";
}
