// Données fictives de démonstration — commune de Kraainem.
// Structure fidèle au document de cadrage du pilote communal.

export type OId = "alimentation" | "climat" | "transmission";

export const me = { nom: "Camille D.", quartier: "Haut Kraainem", tranche: "30-40" };

/**
 * Données FACTUELLES sur Kraainem (sources publiques 2024). Les programmes,
 * décisions, budgets et projets affichés ailleurs restent des exemples de
 * démonstration.
 */
export const commune = {
  nom: "Kraainem",
  habitants: 13906,            // 2024
  superficie: 5.8,             // km²
  densite: 2398,               // hab/km² (13906 / 5,8)
  province: "Brabant flamand (Vlaams-Brabant)",
  arrondissement: "Hal-Vilvorde",
  francophones: "> 80 %",
  facilites: true,             // commune à facilités linguistiques
  siegesConseil: 23,
  quartiers: ["Bas Kraainem", "Haut Kraainem", "Val des Seigneurs"],
  totalBudget: 31_500_000,     // ordre de grandeur illustratif
  miseAJour: "2026-07-31",
};
export const communeFacts = [
  { k: "Habitants", v: "13 906", s: "recensement 2024" },
  { k: "Superficie", v: "5,80 km²", s: "l'une des plus petites du pays" },
  { k: "Densité", v: "≈ 2 400 hab/km²", s: "tissu résidentiel dense" },
  { k: "Francophones", v: "> 80 %", s: "commune à facilités" },
  { k: "Conseil communal", v: "23 sièges", s: "élections du 13 oct. 2024" },
  { k: "Transports", v: "Métro ligne 1", s: "station Kraainem" },
];
export const communeSources = [
  "Population et superficie : Statbel / CityFacts (2024)",
  "Statut linguistique : commune à facilités de la périphérie bruxelloise",
  "Conseil communal : résultats des élections du 13 octobre 2024",
  "Institutions : GC de Lijsterbes (vzw de Rand), Maison de l'Enfant, CPAS de Kraainem",
];

export interface Orientation {
  id: OId; key: "alim" | "clim" | "tran"; titre: string; court: string; horizon: string;
  resume: string; cible: string; chain: { regional: string; national: string; europeen: string };
}
export const orientations: Orientation[] = [
  { id: "alimentation", key: "alim", titre: "Alimentation & relocalisation", court: "Alimentation", horizon: "2035",
    resume: "Sécuriser l'alimentation de base : producteurs locaux, potagers partagés, circuits courts.",
    cible: "50 % des cantines communales en circuits courts d'ici 2035",
    chain: { regional: "Souveraineté alimentaire régionale", national: "Résilience des chaînes d'approvisionnement", europeen: "Farm to Fork" } },
  { id: "climat", key: "clim", titre: "Climat & énergie", court: "Climat", horizon: "2030",
    resume: "Trajectoire de réduction des émissions à laquelle chaque décision se rattache.",
    cible: "−40 % d'émissions du patrimoine communal vs 2019, d'ici 2030",
    chain: { regional: "Plan Air Climat Énergie", national: "Plan National Énergie-Climat", europeen: "Fit for 55" } },
  { id: "transmission", key: "tran", titre: "Transmission & soin", court: "Transmission", horizon: "2032",
    resume: "Maison de la transmission, jeunesse, entraide : rendre du temps, du lien et du soin.",
    cible: "Un réseau de transmission couvrant 100 % des quartiers d'ici 2028",
    chain: { regional: "Cohésion sociale & aînés", national: "Loi « Only Once »", europeen: "Socle européen des droits sociaux" } },
];
export const oriById = (id: OId) => orientations.find((o) => o.id === id)!;

export interface Decision { id: string; date: string; titre: string; desc: string; o: OId; cout: number; etat: "adoptée" | "en cours" | "en projet"; }
export const decisions: Decision[] = [
  { id: "D-2026-041", date: "2026-06-24", titre: "Cantines scolaires bio et locales", desc: "Marché d'approvisionnement des écoles communales confié à un groupement de producteurs à moins de 30 km.", o: "alimentation", cout: 218000, etat: "adoptée" },
  { id: "D-2026-038", date: "2026-06-24", titre: "Rénovation énergétique de l'école du Centre", desc: "Isolation, pompe à chaleur, 90 m² de photovoltaïque.", o: "climat", cout: 640000, etat: "en cours" },
  { id: "D-2026-035", date: "2026-05-27", titre: "Coordinateur·rice Maison de la transmission", desc: "Temps plein pour structurer le réseau bénévole intergénérationnel.", o: "transmission", cout: 58000, etat: "adoptée" },
  { id: "D-2026-027", date: "2026-04-29", titre: "Écoles sans téléphone", desc: "Pochettes de mise à distance des smartphones au secondaire.", o: "transmission", cout: 12500, etat: "adoptée" },
  { id: "D-2026-022", date: "2026-03-25", titre: "Pistes cyclables — phase 2", desc: "3,2 km reliant les hameaux au centre et aux arrêts de bus.", o: "climat", cout: 385000, etat: "en projet" },
  { id: "D-2026-018", date: "2026-03-25", titre: "Guichet unique citoyen — cadrage", desc: "Point d'entrée unique adossé à itsme et l'eBox, avec traçabilité d'accès.", o: "transmission", cout: 34000, etat: "en projet" },
];

export interface LigneBudget { o: OId; intitule: string; vote: number; exec: number; }
export const budget = { annee: 2026, lignes: [
  { o: "alimentation" as OId, intitule: "Alimentation locale, cantines & potagers", vote: 340000, exec: 236000 },
  { o: "climat" as OId, intitule: "Rénovation énergétique & mobilité douce", vote: 1_180_000, exec: 712000 },
  { o: "transmission" as OId, intitule: "Transmission, jeunesse & lien social", vote: 205000, exec: 118000 },
] };

export interface Projet { id: string; titre: string; o: OId; objectif: number; collecte: number; contrib: number; eco: string; soc: string; env: string; }
export const projets: Projet[] = [
  { id: "P-01", titre: "Panneaux solaires citoyens sur 3 bâtiments communaux (Ecopower · Druifkracht)", o: "climat", objectif: 120000, collecte: 78400, contrib: 143,
    eco: "Dividende variable, plafonné légalement à 6 % — 0 à 4 % observés ces 3 dernières années (Ecopower 0 % en 2024, ZuidtrAnt 2 %, BeauVent 4 %). Part à 250 €.",
    soc: "Coopérative ouverte, 1 personne = 1 voix. Projet réel, déjà voté en 2021.", env: "≈ 46 t CO₂ évitées / an" },
  { id: "P-02", titre: "Épicerie coopérative & circuits courts", o: "alimentation", objectif: 60000, collecte: 41250, contrib: 210,
    eco: "Équilibre à 18 mois, 3 emplois locaux", soc: "12 producteurs à moins de 30 km, prix justes", env: "−32 % d'emballages vs grande distribution" },
  { id: "P-03", titre: "Maison de la transmission — aménagement", o: "transmission", objectif: 45000, collecte: 12800, contrib: 64,
    eco: "Mutualise 2 locaux existants (pas de bâtiment neuf)", soc: "Relais sortie d'école + présence aînés isolés", env: "Réemploi du mobilier, rénovation légère" },
];

// `acces` : rendre l'accessibilité VISIBLE (ch. 29 — si l'accès suppose inscription,
// paiement ou engagement à l'année, le dispositif sélectionne ceux qui s'en passeraient).
export type AccesType = "gratuit" | "tarif-social" | "sans-inscription" | "inscription";
export interface Jeune { type: "para" | "stage" | "event"; titre: string; k: string; age: string; quand: string; lieu: string; acces: AccesType[]; }
export const jeunes: Jeune[] = [
  { type: "para", titre: "Atelier robotique", k: "Le mercredi après-midi — découverte, sans niveau requis.", age: "10-14 ans", quand: "Mer. 14h", lieu: "École du Centre", acces: ["inscription", "tarif-social"] },
  { type: "para", titre: "Théâtre bilingue FR/NL", k: "Troupe bilingue, expression et confiance en soi.", age: "8-12 ans", quand: "Sam. 10h", lieu: "Lijsterbes", acces: ["inscription", "tarif-social"] },
  { type: "para", titre: "Club nature & potager", k: "On entre, on repart quand on veut — pas besoin de s'inscrire.", age: "6-10 ans", quand: "Mer. 14h", lieu: "Potager du Parc", acces: ["gratuit", "sans-inscription"] },
  { type: "stage", titre: "Stage vacances : codage de jeux", k: "5 jours encadrés, matériel fourni — sponsorisé par la commune.", age: "12-16 ans", quand: "Toussaint", lieu: "Maison des jeunes", acces: ["tarif-social"] },
  { type: "stage", titre: "Stage sport multi-activités", k: "Grimpe, foot, escalade — sponsorisé par la commune.", age: "8-12 ans", quand: "Congé de détente", lieu: "Halle des sports", acces: ["tarif-social"] },
  { type: "event", titre: "Concert jeunes talents", k: "Scène ouverte organisée par le Lijsterbes.", age: "12-25 ans", quand: "18 oct.", lieu: "GC de Lijsterbes", acces: ["gratuit", "sans-inscription"] },
  { type: "event", titre: "Soirée jeux & rencontres", k: "Organisée par le Lijsterbes — jeux de société, sans écran.", age: "12-18 ans", quand: "25 oct.", lieu: "GC de Lijsterbes", acces: ["gratuit", "sans-inscription"] },
];

export interface Aide { mode: "offre" | "demande"; cat: string; titre: string; k: string; nom: string; quartier: string; av: string; col: string; }
// Le côté DEMANDE d'abord, en commençant par le faible enjeu (l'échec ne coûte rien) :
// c'est ce qui rend « demander » gratuit en effort et en honte, et « répondre » un
// geste unique sans engagement. Les enjeux élevés (garde d'enfants) viennent en dernier,
// quand la confiance est construite.
export const entraide: Aide[] = [
  { mode: "demande", cat: "Emprunt", titre: "Emprunter une échelle ce week-end", k: "Pour nettoyer une gouttière — deux heures suffisent.", nom: "Nadia K.", quartier: "Bas Kraainem", av: "NK", col: "200 90% 40%" },
  { mode: "demande", cat: "Coup de main", titre: "Réceptionner un colis jeudi après-midi", k: "Je travaille, le point relais est loin.", nom: "Tom V.", quartier: "Val des Seigneurs", av: "TV", col: "176 62% 38%" },
  { mode: "demande", cat: "Plantes", titre: "Arroser mes plantes pendant 5 jours", k: "Petit balcon, une fois par jour, la semaine prochaine.", nom: "Els D.", quartier: "Haut Kraainem", av: "ED", col: "142 62% 38%" },
  { mode: "demande", cat: "Mobilité", titre: "Covoiturage vers la gare le matin", k: "Vers 8h, direction Bruxelles.", nom: "Peter H.", quartier: "Val des Seigneurs", av: "PH", col: "32 90% 42%" },
  { mode: "demande", cat: "Numérique", titre: "Un coup de main pour l'eBox et itsme", k: "Une démarche à faire en ligne, je débute.", nom: "Rita M.", quartier: "Stockel-frontière", av: "RM", col: "200 90% 40%" },
  { mode: "demande", cat: "Garde d'enfants", titre: "Garde ponctuelle en fin de journée", k: "Relais 17-18h les jours de réunion (2×/mois).", nom: "Camille D.", quartier: "Haut Kraainem", av: "CD", col: "262 72% 52%" },
  { mode: "offre", cat: "Bricolage", titre: "Petites réparations vélo", k: "Atelier ouvert le samedi matin, j'apprends volontiers.", nom: "Sofie V.", quartier: "Stockel-frontière", av: "SV", col: "176 62% 38%" },
  { mode: "offre", cat: "Mobilité", titre: "Trajets courses & rendez-vous médicaux", k: "Courses le mardi, place pour 2 personnes.", nom: "Marc D.", quartier: "Val des Seigneurs", av: "MD", col: "200 90% 40%" },
  { mode: "offre", cat: "Répit aidant", titre: "Présence pour aîné isolé", k: "Une visite hebdomadaire, compagnie et promenade.", nom: "Amina B.", quartier: "Bas Kraainem", av: "AB", col: "330 78% 48%" },
  { mode: "offre", cat: "Aide aux devoirs", titre: "Aide aux devoirs (primaire)", k: "Ancienne institutrice, 2 après-midis/semaine.", nom: "Françoise L.", quartier: "Haut Kraainem", av: "FL", col: "262 72% 52%" },
];

export interface Conseil { titre: string; k: string; source: string; icon: string; }
export const familleConseils: Conseil[] = [
  { titre: "Le sommeil du tout-petit", k: "Rythmes, siestes et rituels du coucher selon l'âge — et quoi faire quand rien ne marche.", source: "ONE — Office de la Naissance et de l'Enfance", icon: "moon" },
  { titre: "Repas & alimentation", k: "Introduire les aliments, gérer les refus, éviter que le repas devienne un combat.", source: "ONE", icon: "utensils" },
  { titre: "Les écrans avant 12 ans", k: "Repères par âge, alternatives concrètes, et pourquoi la commune agit aussi (écoles sans téléphone).", source: "Repères 3-6-9-12", icon: "smartphone" },
  { titre: "La charge mentale — la partager", k: "Elle pèse souvent d'abord sur les mamans. Oser déléguer, répartir dans le couple, demander de l'aide sans culpabiliser.", source: "Maison de la transmission", icon: "heart" },
  { titre: "Après la naissance", k: "Récupération, baby blues et post-partum : reconnaître les signes et savoir vers qui se tourner près de chez soi.", source: "ONE · consultation & sages-femmes", icon: "baby" },
  { titre: "Colères & émotions", k: "Accompagner les grosses émotions du jeune enfant sans crier — des repères simples et testés.", source: "Atelier parents · Lijsterbes", icon: "heart-handshake" },
  { titre: "Rentrée & devoirs sereins", k: "Installer un cadre qui tient, sans que le soir vire à la crise. Relais possible via la Maison de la transmission.", source: "Écoles communales", icon: "book" },
];
export interface AideDomicile { titre: string; k: string; via: string; icon: string; }
export const familleAide: AideDomicile[] = [
  { titre: "Garde d'enfants à domicile", k: "Halte-garderie, gardiennes encadrées et dépannage ponctuel pour les moins de 12 ans.", via: "Maison de l'Enfant / ONE", icon: "baby" },
  { titre: "Aide ménagère & repassage", k: "Quelques heures par semaine pour souffler, via le système des titres-services.", via: "Titres-services", icon: "home" },
  { titre: "Accompagnement post-partum", k: "Une aide familiale à domicile dans les semaines qui suivent la naissance : ménage, repas, soutien.", via: "ONE / mutuelle", icon: "heart" },
  { titre: "Garde-malade & répit", k: "Une présence quelques heures quand un enfant est malade, pour relayer le parent — hors soin médical.", via: "Maison de la transmission", icon: "heart-handshake" },
  { titre: "Aide administrative à domicile", k: "Un coup de main pour l'eBox, itsme et les formulaires, chez vous si besoin.", via: "Guichet unique / CPAS", icon: "file" },
  { titre: "Portage de repas & courses", k: "Repas livrés et courses assurées pour les familles en difficulté passagère.", via: "CPAS", icon: "basket" },
];

export interface Agenda { type: "culture" | "sport"; titre: string; k: string; quand: string; lieu: string; prix: string; }
export const agenda: Agenda[] = [
  { type: "culture", titre: "Exposition — artistes de Kraainem", k: "Peinture, photo et sculpture d'habitants, vernissage le vendredi soir.", quand: "3–19 oct.", lieu: "GC de Lijsterbes", prix: "Entrée libre" },
  { type: "culture", titre: "Concert de la chorale communale", k: "Répertoire bilingue, avec la participation de l'académie de musique.", quand: "11 oct. · 20h", lieu: "Église Saint-Pancrace", prix: "Prévente 8 €" },
  { type: "culture", titre: "Ciné en plein air — familles", k: "Projection au parc, transats et petite restauration locale.", quand: "6 sept. · 20h30", lieu: "Parc communal", prix: "Gratuit" },
  { type: "culture", titre: "Marché de Noël & artisans", k: "Producteurs locaux, artisans et animations pour enfants.", quand: "13–14 déc.", lieu: "Place communale", prix: "Gratuit" },
  { type: "culture", titre: "Repair Café du Lijsterbes", k: "Réparez ensemble vélos, petit électro et textile plutôt que jeter.", quand: "1er sam. du mois", lieu: "GC de Lijsterbes", prix: "Gratuit" },
  { type: "sport", titre: "Jogging de Kraainem", k: "Courses 5 & 10 km, parcours familial de 2 km, au profit du CPAS.", quand: "28 sept. · 10h", lieu: "Départ Parc communal", prix: "Inscription 6 €" },
  { type: "sport", titre: "Journée découverte des clubs", k: "Portes ouvertes : tennis, foot, judo, gym — essayez gratuitement.", quand: "14 sept. · 13h", lieu: "Halle des sports", prix: "Gratuit" },
  { type: "sport", titre: "Tournoi de tennis du club local", k: "Simple et double, catégories loisirs et confirmés.", quand: "18–20 oct.", lieu: "Tennis Club Kraainem", prix: "Inscription 12 €" },
  { type: "sport", titre: "Yoga au parc — séances d'automne", k: "Tous niveaux, en plein air, tapis fournis.", quand: "Dim. · 9h30", lieu: "Parc communal", prix: "Gratuit" },
];

// Inscription unique — un seul formulaire pour tout ce qui concerne l'enfant,
// échéances tenues à la place du parent (supprime des décisions répétées).
export const enfant = { prenom: "Léa", age: 8, ecole: "École communale du Centre" };
export type EtatDemarche = "fait" | "a-faire";
export interface Demarche { domaine: string; detail: string; etat: EtatDemarche; echeance?: string; }
export const inscriptionUnique: Demarche[] = [
  { domaine: "École", detail: "Inscription 2026-2027 confirmée", etat: "fait" },
  { domaine: "Garderie (matin + soir)", detail: "Reconduite automatiquement", etat: "fait" },
  { domaine: "Cantine — repas locaux", detail: "À confirmer pour la rentrée", etat: "a-faire", echeance: "2026-08-25" },
  { domaine: "Sport du mercredi", detail: "Multisports — place réservée", etat: "fait" },
  { domaine: "Académie de musique", detail: "Réinscription à valider", etat: "a-faire", echeance: "2026-09-05" },
];

export const interets: [string, string][] = [
  ["alimentation", "Alimentation locale"], ["climat", "Climat & énergie"], ["mobilite", "Mobilité douce"],
  ["famille", "Familles & parentalité"], ["enfance", "Enfance & école"], ["jeunesse", "Jeunesse"], ["aines", "Aînés"],
  ["culture", "Culture"], ["sport", "Sport"], ["entraide", "Entraide"], ["finances", "Finances communales"],
];
export const interetLabel = (id: string) => interets.find((i) => i[0] === id)?.[1] ?? id;

export interface FeedItem { kind: string; titre: string; p: string; tags: string[]; cible?: string; icon: string; accent: string; }
export const feed: FeedItem[] = [
  { kind: "Décision", titre: "Cantines scolaires 100 % bio dès septembre", p: "Le conseil valide le marché avec les producteurs locaux — vos enfants sont concernés.", tags: ["alimentation", "enfance"], icon: "list", accent: "alim" },
  { kind: "Événement", titre: "Ouverture du potager partagé du Parc", p: "Portes ouvertes samedi : parcelles disponibles, atelier enfants.", tags: ["alimentation", "enfance", "entraide"], icon: "calendar", accent: "alim" },
  { kind: "Appel de fonds", titre: "Toiture solaire citoyenne — 65 % atteints", p: "Coopérative ouverte, retour ~6 %/an. Il reste 41 600 € à réunir.", tags: ["climat", "finances"], icon: "rocket", accent: "clim" },
  { kind: "Jeunesse", titre: "Stage codage sponsorisé (congé de Toussaint)", p: "Inscriptions ouvertes, tarif social — encadré, matériel fourni.", tags: ["jeunesse", "enfance"], icon: "youth", accent: "tran" },
  { kind: "Entraide", titre: "3 nouvelles demandes près de chez vous", p: "Dont une garde d'enfants en fin de journée dans votre quartier.", tags: ["entraide"], icon: "hands", accent: "tran" },
  { kind: "Mobilité", titre: "Enquête publique — pistes cyclables phase 2", p: "Donnez votre avis sur le tracé reliant les hameaux au centre.", tags: ["mobilite", "climat"], icon: "pin", accent: "clim" },
  { kind: "Séance d'info", titre: "Préparer sa pension — séance 40-50 ans", p: "Réservée par tranche d'âge : mise en avant pour les 40-50 ans.", tags: ["finances"], cible: "40-50", icon: "bell", accent: "muted" },
  { kind: "Aînés", titre: "Navette courses hebdomadaire pour aînés", p: "Nouveau service de la Maison de la transmission.", tags: ["aines", "mobilite"], icon: "hands", accent: "tran" },
  { kind: "Culture", titre: "Concert jeunes talents au Lijsterbes", p: "Scène ouverte, entrée libre — 18 octobre.", tags: ["culture", "jeunesse"], icon: "calendar", accent: "clim" },
  { kind: "Sport", titre: "Journée découverte des clubs sportifs", p: "Portes ouvertes : tennis, foot, judo, gym — essais gratuits.", tags: ["sport", "enfance"], icon: "trophy", accent: "clim" },
  { kind: "Familles", titre: "Permanence conseils parents 0-12 ans", p: "Chaque mardi matin, sans rendez-vous : sommeil, alimentation, écrans, charge mentale.", tags: ["famille", "enfance", "entraide"], icon: "baby", accent: "tran" },
];

export const kpiCommune = [
  { k: "Approvisionnement local des cantines", v: "38 %", t: "+12 pts sur 1 an" },
  { k: "Émissions du patrimoine communal", v: "−18 %", t: "vs 2019 (cible −40 % en 2030)" },
  { k: "Heures d'entraide échangées", v: "2 140 h", t: "lien noué hors de l'app" },
];
// Le service, mesuré sans se flatter (pas de « temps passé dans l'app »).
export const kpiService = [
  { k: "Délai décision → publication lisible", v: "4 j", t: "médiane" },
  { k: "Réutilisations des données par des tiers", v: "5", t: "presse locale + 2 assos + 2 chercheurs" },
  { k: "Réponse aux demandes d'entraide", v: "82 %", t: "1re réponse en 6 h (médiane)" },
];
export const kpiPerso = [
  { k: "Mes heures d'entraide", v: "12 h", t: "données · 4 h reçues" },
  { k: "Projets citoyens soutenus", v: "3", t: "270 € engagés" },
  { k: "Part de mes achats en local", v: "65 %", t: "via la monnaie locale" },
  { k: "Activités jeunesse (mes enfants)", v: "4", t: "ce trimestre" },
];
export const synergies = [
  { pol: "La commune finance 3 potagers partagés et l'épicerie coopérative.", per: "Vous cultivez une parcelle et achetez local à 65 %.", res: "≈ 210 kg de légumes locaux/an pour votre foyer, et un circuit court renforcé pour tout le quartier." },
  { pol: "Écoles sans téléphone + relais sortie d'école financés.", per: "Vous utilisez le relais 2×/semaine.", res: "≈ 3 h/semaine de temps familial rendu — la charge du soir baisse." },
  { pol: "Subvention à la toiture solaire citoyenne.", per: "Vous avez pris 2 parts dans la coopérative.", res: "46 t CO₂ évitées/an collectivement, et un retour ~6 %/an pour vous." },
];

// ---------------------------------------------------------------------------
// ENGAGEMENTS — « porter l'intérêt lésé » (ch. 20) + registre des engagements
// sourcé et NON NOTÉ (ch. 30). On suit promesse → voté → fait, sans score.
// ---------------------------------------------------------------------------
export type EtatEngagement = "promis" | "voté" | "en cours" | "fait" | "en retard";
export interface Engagement {
  id: string; titre: string; o: OId; etat: EtatEngagement; detail: string; source: string; suiveurs: number;
}
export const engagements: Engagement[] = [
  { id: "E-01", titre: "50 % des cantines communales en circuits courts d'ici 2035", o: "alimentation", etat: "en cours", detail: "38 % atteints (rentrée 2026).", source: "Déclaration de politique communale 2024", suiveurs: 214 },
  { id: "E-02", titre: "−40 % d'émissions du patrimoine communal d'ici 2030", o: "climat", etat: "en cours", detail: "−18 % vs 2019 à ce jour.", source: "Plan communal climat, conseil du 27/05/2026", suiveurs: 176 },
  { id: "E-03", titre: "Une Maison de la transmission dans chaque quartier d'ici 2028", o: "transmission", etat: "en cours", detail: "1 quartier couvert sur 3.", source: "Programme de législature", suiveurs: 132 },
  { id: "E-04", titre: "Guichet unique citoyen (« dites-le-nous une fois »)", o: "transmission", etat: "voté", detail: "Cadrage voté ; mise en service prévue 2027.", source: "Décision D-2026-018", suiveurs: 98 },
  { id: "E-05", titre: "Relier les hameaux au centre par une piste cyclable", o: "climat", etat: "en retard", detail: "Permis d'urbanisme en attente (+9 semaines).", source: "Décision D-2026-022", suiveurs: 261 },
  { id: "E-06", titre: "Budget participatif annuel de 150 000 €", o: "transmission", etat: "voté", detail: "Premier appel à projets ouvert.", source: "Conseil du 25/03/2026", suiveurs: 187 },
];

// ---------------------------------------------------------------------------
// PILOTE — critères chiffrés, échéance, clause d'arrêt (ch. 36).
// ---------------------------------------------------------------------------
export const pilotesEval = [
  { brique: "Transparence (Brique 1)", critere: "Délai décision → publication lisible", seuil: "≤ 7 jours", etat: "4 j (médiane)", ok: true },
  { brique: "Transparence (Brique 1)", critere: "Jeux de données brutes réutilisés par des tiers", seuil: "≥ 3 réutilisations", etat: "5 (presse + assos + chercheurs)", ok: true },
  { brique: "Lien / transmission (Brique 3)", critere: "Réponse aux demandes d'entraide", seuil: "en progression à 18 mois", etat: "82 %, 1re réponse 6 h", ok: null },
  { brique: "Lien / transmission (Brique 3)", critere: "Activités proposées par les habitants eux-mêmes", seuil: "≥ 10", etat: "6 à ce jour", ok: null },
];
export const registreEchecs = [
  { titre: "Application communale de covoiturage (2023)", verdict: "Arrêtée", raison: "Moins de 4 % d'usage à 12 mois, sous le seuil fixé. Leçon : sans masse d'usagers dès le départ, l'outil reste vide — on redirige vers l'entraide de proximité." },
  { titre: "Newsletter PDF mensuelle (2022)", verdict: "Remplacée", raison: "Illisible et peu ouverte. Leçon : la donnée doit être reliée à une orientation (lisibilité), pas empilée." },
];

// ---------------------------------------------------------------------------
// SOURCES DE DONNÉES RÉELLES
// Inventaire du dossier « Les données » (Projet Atlas, tome 2 — 7 août 2026),
// dont chaque source automatisable a été rappelée le 8 août 2026 depuis cette
// machine. Les statuts ci-dessous reflètent l'appel réel, pas la promesse.
// ---------------------------------------------------------------------------
export const dataMeta = {
  sessionsTotal: 1063,
  sessionsFrom: "27 mai 2021",
  sessionsTo: "4 août 2026",
  connecteur: "Lokaal Beslist — API JSON:API, sans clé",
  lien: "https://lokaalbeslist.vlaanderen.be/",
  epurationFlandre: "89 %",
  nis: "23099",
  postal: "1950",
  verifieLe: "2026-08-08",
};

/**
 * Vocabulaire du dossier, avec un cran de plus : `verifie` = l'appel a été
 * refait ici et a répondu ; `disponible` = endpoint ouvert, pas encore rappelé.
 */
export type SourceStatut =
  | "verifie" | "disponible" | "a-tester" | "a-parser" | "manuel" | "compte" | "manquant";
export type SourceTheme = "gouvernance" | "environnement" | "cadre" | "comparaison";
export interface DataSource {
  nom: string; source: string; theme: SourceTheme; statut: SourceStatut;
  note?: string; licence?: string; endpoint?: string;
}
export const dataSources: DataSource[] = [
  // — Gouvernance & finances ------------------------------------------------
  { nom: "Décisions du conseil & du collège", source: "Lokaal Beslist — API JSON:API, sans clé", theme: "gouvernance", statut: "verifie",
    note: "1 063 séances confirmées le 8 août 2026, la dernière du 4 août. Ressources : /sessions, /agenda-items, /resolutions, /articles, /mandataries, /votes, /search.",
    licence: "Modellicentie Gratis Hergebruik",
    endpoint: "GET lokaalbeslist.vlaanderen.be/sessions?filter[governing-body][is-time-specialization-of][administrative-unit][name]=Kraainem" },
  { nom: "Mandataires & mandats", source: "Mandatendatabank · /mandataries", theme: "gouvernance", statut: "disponible",
    note: "Qui siège, pour quel parti, depuis quand — même API que les séances.", licence: "Modellicentie" },
  { nom: "Ordres du jour et PV bruts", source: "kraainem.meetingburger.net — HTML annoté RDFa", theme: "gouvernance", statut: "manuel",
    note: "Source amont de Lokaal Beslist. À éviter : passer par l'API agrégée plutôt que scraper." },
  { nom: "Finances comparables entre communes (BBC)", source: "data.gov.be — « Digitale Rapporteringen BBC, wekelijks »", theme: "gouvernance", statut: "a-tester",
    note: "Budgets, comptes, dette et autofinancement de toutes les communes flamandes depuis 2014. L'API CKAN de data.gov.be n'a pas répondu au chemin standard le 8 août — le dataset reste à localiser." },
  { nom: "Finances — restitution graphique", source: "analysetool.bbcdr.be · finpro.bbcdr.be", theme: "gouvernance", statut: "manuel",
    note: "Export Excel à la main. Utile pour amorcer, pas pour tenir un tableau de bord." },
  { nom: "Résultats électoraux 2024", source: "okt24.vlaanderenkiest.be", theme: "gouvernance", statut: "manquant",
    note: "Par bureau de vote et par quartier — une première. Mais application monopage, sans API documentée. Le jeu 2018 existe sur data.gov.be." },

  // — Environnement ---------------------------------------------------------
  { nom: "Points de mesure des eaux de surface", source: "VMM — OGC API Features", theme: "environnement", statut: "verifie",
    note: "22 points renvoyés dans la fenêtre Kraainem le 8 août 2026, dont 7 sur le territoire communal.",
    licence: "Modellicentie",
    endpoint: "GET geo.api.vlaanderen.be/MeetplOppervlwaterkwal/ogc/features/v1/collections/Mtploppw/items?bbox=4.44,50.84,4.50,50.885" },
  { nom: "Résultats d'analyse par point", source: "VMM — rapport Cognos interactif", theme: "environnement", statut: "manuel",
    note: "Les points sont ouverts, les mesures ne le sont pas. C'est exactement l'écart que le pilote a vocation à nommer." },
  { nom: "Zonage d'assainissement & égouttage", source: "VMM — geoserver HDGIS (WFS/WMS, EPSG:31370)", theme: "environnement", statut: "disponible",
    note: "Couches : woonkern, geo_clusters, gup_projecten, prio_ibas, overnamepunten, zuiveringsstations.", licence: "Modellicentie",
    endpoint: "geoserver.vmm.be/geoserver/HDGIS/wfs" },
  { nom: "Taux de raccordement & d'épuration", source: "VMM — XLSX annuel (colonne NIS)", theme: "environnement", statut: "a-parser",
    note: "rioleringsgraad_april_2026.xlsx · zuiveringsgraad_eind2024.xlsx. Le chiffre de Kraainem est dans le fichier ; il n'a pas encore été sorti. Repère flamand : 89 % des eaux usées domestiques épurées fin 2024." },
  { nom: "Qualité de l'air — stations & séries", source: "IRCELINE — SOS REST, WFS, WCS, FTP", theme: "environnement", statut: "verifie",
    note: "137 stations en Belgique le 8 août 2026, aucune à Kraainem. Les plus proches : Arts-Loi (~6 km, station trafic), Vilvoorde, Grimbergen. Pour une valeur communale, passer par la grille RIO-IFDM ou ATMO-Street, qui descend à la rue.",
    licence: "CC BY 4.0", endpoint: "geo.irceline.be/sos/api/v1/stations" },
  { nom: "Consommation d'électricité et de gaz", source: "Fluvius — Opendatasoft", theme: "environnement", statut: "verifie",
    note: "Kraainem répond bien. Attention : les identifiants de jeux cités dans le dossier sont périmés — le bon est 1-19-totaal-gealloceerd-volume, filtré sur leveringsadresgemeente=\"KRAAINEM\". Le passage historique par Sibelgas ne bloque rien : la commune est bien dans les données Fluvius.",
    endpoint: "opendata.fluvius.be/api/explore/v2.1/catalog/datasets/1-19-totaal-gealloceerd-volume/records" },
  { nom: "Installations de production décentralisée", source: "Fluvius — jeu 1_20, par code postal", theme: "environnement", statut: "verifie",
    note: "986 installations pour le code postal 1950, quasi toutes photovoltaïques, relevé de juillet 2026.",
    endpoint: "…/datasets/1_20-lijst-van-decentrale-productie-installaties-gekoppeld-aan-het-distributiene/records?where=postcode=\"1950\"" },
  { nom: "Consommation par rue", source: "Fluvius — jeu 1_03", theme: "environnement", statut: "a-tester",
    note: "Descend sous la commune. À manier avec précaution : à cette échelle, une donnée d'énergie redevient une donnée sur des personnes." },
  { nom: "Canopée, boisement, imperméabilisation", source: "Groenkaart 2021 (1 m) · Boswijzer 2021 (10 m) · indicatoren.omgeving.vlaanderen.be", theme: "environnement", statut: "a-parser",
    note: "Aucun chiffre publié tout fait pour Kraainem : il faut découper les rasters sur le contour communal. Une heure de travail, pas un projet." },
  { nom: "Chaleur, inondations, ombrage des arbres", source: "Klimaatportaal VMM", theme: "environnement", statut: "a-tester",
    note: "Services annoncés, endpoints non publiés — à découvrir." },
  { nom: "Labels EPC & potentiel solaire par toiture", source: "VEKA — Energiekaart, Zonnekaart", theme: "environnement", statut: "manquant",
    note: "Enfermés dans des rapports Power BI ; aucun endpoint confirmé." },

  // — Cadre de vie ----------------------------------------------------------
  { nom: "Bâti, adresses, unités de logement, parcelles", source: "Basisregisters Vlaanderen — API v2", theme: "cadre", statut: "verifie",
    note: "Répond en anonyme ; NIS de Kraainem confirmé (23099). Prévoir une clé pour un usage soutenu.", licence: "Modellicentie",
    endpoint: "api.basisregisters.vlaanderen.be/v2/adressen?gemeentenaam=Kraainem" },
  { nom: "Accidents de la route géolocalisés (2017-2024)", source: "Statbel — open data (ZIP/CSV)", theme: "cadre", statut: "a-parser", licence: "Réutilisation autorisée" },
  { nom: "Revenus fiscaux par secteur statistique", source: "Statbel — XLSX/TXT, 2005-2023", theme: "cadre", statut: "a-parser",
    note: "Échelle infracommunale. Permettrait de dire quelque chose de vrai sur les écarts internes à Kraainem — ce qu'aucun document communal ne fait aujourd'hui." },
  { nom: "Parc de logements : âge, type", source: "Statbel — statistique cadastrale (cube be.STAT)", theme: "cadre", statut: "a-tester" },
  { nom: "Criminalité par commune et par trimestre", source: "Police fédérale — XLSX", theme: "cadre", statut: "a-parser", note: "URL changeantes d'un trimestre à l'autre : prévoir une résolution du lien, pas un lien en dur." },
  { nom: "Comptages vélo", source: "AWV — opendata.apps.mow.vlaanderen.be/fietstellingen (CSV)", theme: "cadre", statut: "a-tester", note: "Vérifier d'abord qu'un point de comptage existe à Kraainem." },
  { nom: "Comptages routiers détaillés", source: "Vlaams Verkeerscentrum", theme: "cadre", statut: "compte", note: "Authentification itsme obligatoire — pas d'accès anonyme." },
  { nom: "Commerces & artisans de la commune", source: "OpenStreetMap — API Overpass", theme: "cadre", statut: "verifie",
    note: "108 établissements relevés le 8 août 2026. Aucune source publique n'existe : ni registre communal ouvert, ni filtre « commerce ouvert au public » par commune dans la Banque-Carrefour des Entreprises. OSM est contributif, donc incomplet — 30 fiches sur 108 portent une adresse complète.",
    licence: "ODbL — attribution obligatoire", endpoint: "POST overpass-api.de/api/interpreter — area[\"name\"=\"Kraainem\"][\"admin_level\"=\"8\"]" },

  // — Comparaison entre communes -------------------------------------------
  { nom: "Provincies in Cijfers", source: "Plateforme Swing — service OData v4", theme: "comparaison", statut: "a-tester",
    note: "Niveau commune et secteur statistique. Un paquet Python prêt à l'emploi : pip install stadincijfers, rend une table pandas.",
    endpoint: "provincies.incijfers.be/viewerservices/odata/Variables" },
  { nom: "Gemeente-Stadsmonitor", source: "Page « download alle cijfers »", theme: "comparaison", statut: "a-parser",
    note: "Plus de 300 indicateurs par commune flamande. Probablement le raccourci le plus rentable pour sortir Kraainem de son isolement statistique." },
  { nom: "Catalogue de métadonnées flamand", source: "metadata.vlaanderen.be — API records", theme: "comparaison", statut: "disponible",
    note: "Interrogeable par programme : le meilleur point d'entrée pour découvrir de nouveaux services.",
    endpoint: "metadata.vlaanderen.be/srv/api/records/{uuid}" },
];

/** L'ordre du dossier : rapport entre effort consenti et crédibilité gagnée. */
export interface Priorite { rang: number; titre: string; pourquoi: string; fait: boolean; }
export const dataPriorites: Priorite[] = [
  { rang: 1, titre: "Le connecteur Lokaal Beslist", fait: true,
    pourquoi: "Une soirée de travail, et le dossier cesse d'être une intention : il affiche 1 063 séances réelles. La seule brique démontrable sans l'accord de quiconque. — branchée sur /api/lokaalbeslist." },
  { rang: 2, titre: "Le dataset BBC hebdomadaire sur data.gov.be", fait: false,
    pourquoi: "S'il tient sa promesse, la comparaison financière entre Kraainem et ses voisines devient automatique. L'API CKAN standard n'a pas répondu : le dataset est à localiser." },
  { rang: 3, titre: "Fluvius — consommation et photovoltaïque", fait: true,
    pourquoi: "Le socle chiffré de l'appel de fonds. Les identifiants du dossier étaient périmés ; les bons sont câblés et Kraainem répond." },
  { rang: 4, titre: "Le taux de raccordement à l'égout (XLSX VMM)", fait: false,
    pourquoi: "Un seul chiffre, et la brique « ruisseau » a un point de départ mesuré plutôt qu'une intuition." },
  { rang: 5, titre: "Points VMM + grille air IRCELINE", fait: true,
    pourquoi: "L'état zéro environnemental. Les 7 points d'eau de Kraainem sont identifiés ; les stations d'air confirment qu'il n'y en a aucune ici." },
  { rang: 6, titre: "Le recensement honnête de ce qui manque", fait: true,
    pourquoi: "Publié tel quel, ci-dessous. Un pilote qui commence par dire ce qu'il ne peut pas mesurer est plus crédible que celui qui prétend tout savoir." },
];

/**
 * ÉTAT ZÉRO — chiffres réels rapatriés le 8 août 2026, pas des exemples.
 * Fluvius, jeu « totaal gealloceerd volume », 12 mois de juin 2025 à mai 2026.
 */
export const etatZero = {
  periode: "juin 2025 → mai 2026",
  releve: "8 août 2026",
  elecKwh: 31_841_472,
  gazKwh: 91_961_799,
  injectionKwh: 2_320_327,
  pvInstallations: 986,
  pvKva: 5_188,
  pointsEauCommune: 7,
  pointsEauFenetre: 22,
  stationsAir: 0,
  stationsAirBelgique: 137,
  stationLaPlusProche: "Arts-Loi, ~6 km (station trafic)",
};
/** Points de mesure VMM situés sur Kraainem — libellés d'origine (NL) traduits. */
export interface PointEau { code: string; ou: string; }
export const pointsEau: PointEau[] = [
  { code: "363030", ou: "Molenstraat, le long de la rue, en amont des buses PVC" },
  { code: "TR363030.1", ou: "Au droit du point 363030, début de la portion à ciel ouvert" },
  { code: "TR363030.2", ou: "Molenstraat, au terrain de sport, 10 m en amont du passerelle" },
  { code: "TR363030.3", ou: "Steenweg op Zaventem, dans le parc, en amont du pont" },
  { code: "363042", ou: "Chemin privé depuis l'avenue A. Dezangré, après la barrière" },
  { code: "363044", ou: "Derrière l'église, par la ruelle du Sint-Pietersplein" },
  { code: "TR362500.5", ou: "Fin de la Begijnhofstraat, début de tronçon" },
];

export const dataGaps = [
  { nom: "Résultats d'analyse de l'eau", raison: "Rapport interactif (Cognos), sans export en masse. Les points de mesure sont ouverts, les mesures ne le sont pas." },
  { nom: "Potentiel solaire par toiture, labels EPC", raison: "Enfermés dans des rapports Power BI (VEKA — Zonnekaart, Energiekaart)." },
  { nom: "Mesures citoyennes NO₂ (CurieuzeNeuzen)", raison: "20 000 points en Flandre, aucun jeu ouvert publié." },
  { nom: "Résultats électoraux communaux 2024", raison: "Application monopage, sans téléchargement documenté. Il faudra inspecter le trafic réseau ou demander à l'Agentschap Binnenlands Bestuur." },
  { nom: "Pacte local énergie-climat (LEKP)", raison: "Un tableau de bord existe pour Kraainem (NIS 23099), mais les valeurs sont chargées par un composant JavaScript ; seul livrable structuré, un PDF par commune." },
  { nom: "Activation de Kraainem Connect (Hoplr)", raison: "Donnée privée — à demander à l'exploitant." },
  { nom: "Non-recours aux droits sociaux (communal)", raison: "N'existe nulle part. C'est un des points où le pilote devra produire lui-même ce qu'il veut mesurer." },
];

/** Contraintes que le code doit respecter — juridiques et techniques. */
export const dataNotes = [
  { titre: "kraainem.be ne doit pas être moissonné", texte: "Le robots.txt du site communal l'interdit. Ce n'est pas un obstacle : l'essentiel de ce que la commune produit est republié dans les canaux flamands, sous une forme bien plus exploitable." },
  { titre: "Chaque source porte sa mention dans l'interface", texte: "La Modellicentie Gratis Hergebruik impose de citer la source ; IRCELINE est en CC BY 4.0. C'est une obligation juridique — et c'est aussi ce qui rend l'outil crédible." },
  { titre: "Trois portails sont des applications monopage", texte: "Stadsmonitor, lokaalklimaatpact.be et okt24.vlaanderenkiest.be. Un navigateur sans interface est nécessaire pour la première passe de découverte ; l'accès ultérieur peut être scripté." },
  { titre: "Deux adresses sont mortes", texte: "lokalestatistieken.vlaanderen.be ne résout plus, et lokaalbestuur.vlaanderen.be/* redirige vers vlaanderen.be/lokaalbestuur — ce qui casse tous les liens profonds antérieurs à 2026." },
  { titre: "Pas de point SPARQL public", texte: "Les endpoints qui circulent dans le code source du projet LBLOD sont des composants internes du moissonneur, pas une API." },
];

export const dataLicences = [
  "Décisions locales, assainissement, bâti : Modellicentie Gratis Hergebruik (Vlaanderen) — mention de la source obligatoire.",
  "Qualité de l'air : IRCELINE — CC BY 4.0.",
  "Statbel : réutilisation autorisée, sans licence nommée.",
  "Énergie : Fluvius, portail open data — mention de la source.",
  "Commerces : © les contributeurs d'OpenStreetMap — ODbL, attribution obligatoire.",
];

// ---------------------------------------------------------------------------
// COMMERCES — les commerçants de Kraainem.
//
// Données réelles, relevées le 8 août 2026 dans OpenStreetMap (licence ODbL,
// attribution obligatoire). Aucun registre communal ouvert n'existe : la
// commune ne publie pas de liste de ses commerçants, et la Banque-Carrefour
// des Entreprises n'expose pas de filtre « commerce ouvert au public » par
// commune. OSM est donc la meilleure source ouverte disponible — contributive,
// donc perfectible : c'est dit à l'écran plutôt que masqué.
//
// Pour rafraîchir la liste, rejouer sur https://overpass-api.de/api/interpreter :
//   [out:json][timeout:120];
//   area["name"="Kraainem"]["admin_level"="8"]->.k;
//   ( nwr["shop"](area.k);
//     nwr["amenity"~"^(restaurant|cafe|bar|pub|fast_food|pharmacy|bank|ice_cream)$"](area.k);
//     nwr["craft"](area.k);
//     nwr["office"~"^(estate_agent|insurance|lawyer|accountant|travel_agent)$"](area.k); );
//   out center tags;
// ---------------------------------------------------------------------------
export type CommerceCat =
  | "alimentation" | "table" | "sante" | "services" | "maison" | "loisirs" | "mobilite" | "artisans";
export interface Commerce {
  nom: string; cat: CommerceCat; type: string;
  rue?: string; num?: string; tel?: string; web?: string; horaires?: string; osm: string;
}
export const commercesMeta = {
  source: "OpenStreetMap — contributeurs",
  licence: "ODbL — attribution obligatoire",
  lien: "https://www.openstreetmap.org/relation/2408099",
  releve: "2026-08-08",
};
export const commerceCats: { id: CommerceCat; label: string; icon: string }[] = [
  { id: "alimentation", label: "Alimentation", icon: "basket" },
  { id: "table", label: "Restaurants & cafés", icon: "utensils" },
  { id: "sante", label: "Santé & soin", icon: "heart" },
  { id: "services", label: "Services & banques", icon: "file" },
  { id: "maison", label: "Maison & jardin", icon: "home" },
  { id: "loisirs", label: "Mode & loisirs", icon: "gift" },
  { id: "mobilite", label: "Mobilité", icon: "car" },
  { id: "artisans", label: "Artisans", icon: "hammer" },
];
export const commerces: Commerce[] = [
  { nom: "Aaxe", cat: "artisans", type: "Nettoyage", osm: "node/3712552850" },
  { nom: "ABM Floor", cat: "maison", type: "Décoration", tel: "+32 2 725 45 60", web: "http://www.abmfloor.com", osm: "node/4343232053" },
  { nom: "Agence gallia", cat: "artisans", type: "Couvreur", osm: "node/3697451542" },
  { nom: "Al Pronto", cat: "table", type: "Restaurant", osm: "node/383740940" },
  { nom: "Amélie Beauty Services", cat: "sante", type: "Institut de beauté", osm: "node/4343232054" },
  { nom: "Au Petit Monico", cat: "table", type: "Estaminet", osm: "node/1993516045" },
  { nom: "Au Temps d'Elise", cat: "sante", type: "Coiffure", tel: "+32 2 720 33 53", web: "https://www.autempsdelise.be/", osm: "node/5484878945" },
  { nom: "audicare.be", cat: "sante", type: "Audioprothésiste", web: "http://audicare.be/site/sint-pieters-woluwe-stokkel/", osm: "node/5338823284" },
  { nom: "Auto5", cat: "mobilite", type: "Garage", rue: "Avenue de Wezembeek", num: "114", tel: "+32 2 686 02 60", web: "https://autocenter.auto5.be/vlaams-brabant/kraainem/wezembeeklaan-114", horaires: "Mo-Sa 08:30-19:00", osm: "node/3200190128" },
  { nom: "Bag & Cool", cat: "loisirs", type: "Maroquinerie", osm: "node/3200324943" },
  { nom: "Banden Kraainem Pneus", cat: "mobilite", type: "Pneus", osm: "node/1137764881" },
  { nom: "Belfius", cat: "services", type: "Banque", rue: "Koningin Astridlaan", num: "259", osm: "node/394817310" },
  { nom: "Belisol", cat: "maison", type: "Châssis & stores", osm: "node/6397778400" },
  { nom: "BNP Paribas Fortis", cat: "services", type: "Banque", rue: "Oudstrijderslaan", num: "11", osm: "node/393162733" },
  { nom: "Brico", cat: "maison", type: "Bricolage", rue: "Avenue de Wezembeek", num: "114", tel: "+32 2 731 56 54", web: "https://www.brico.be/nl/storedetail/3669/kraainem-crainhem", horaires: "Mo-Sa 08:00-20:00", osm: "way/24880312" },
  { nom: "Buissonnière", cat: "loisirs", type: "Vêtements", rue: "Avenue de Wezembeek", num: "118", tel: "+32 2 688 06 34", web: "https://www.buissonniere.com/", osm: "node/5160447111" },
  { nom: "Carrefour", cat: "alimentation", type: "Supermarché", tel: "+32 2 785 06 11", web: "https://winkels.carrefour.be/nl/s/carrefour/hypermarkt-carrefour-kraainem/669", horaires: "Mo-Sa 08:30-20:00; Fr 08:30-21:00", osm: "node/8707633932" },
  { nom: "Carrefour (galerie)", cat: "alimentation", type: "Galerie commerçante", rue: "Avenue de Wezembeek", num: "114", horaires: "Mo-Th,Sa 08:00-20:00; Fr 08:00-21:00", osm: "way/940176244" },
  { nom: "Carrefour Express", cat: "alimentation", type: "Supermarché", rue: "Arthur Dezangrélaan", num: "11", horaires: "Mo-Su,PH 07:30-20:00", osm: "node/430402113" },
  { nom: "Century 21 New Home", cat: "services", type: "Agence immobilière", rue: "Avenue de Wezembeek", num: "28", tel: "+32 2 880 21 21", web: "https://www.century21.be/", horaires: "Mo-Fr 10:30-18:00", osm: "node/4419689784" },
  { nom: "Chapeau Margot", cat: "loisirs", type: "Antiquités", tel: "+32 2 720 40 35", osm: "node/8321310578" },
  { nom: "Cirkle", cat: "alimentation", type: "Primeur", rue: "Rue Alphonse Lenaerts", num: "28", tel: "+32 2 767 25 81", web: "https://cirkle.be/", osm: "node/4913306431" },
  { nom: "Clubhouse", cat: "table", type: "Café", osm: "node/1638166953" },
  { nom: "Coiffeur Olivier", cat: "sante", type: "Coiffure", horaires: "sur rendez-vous", osm: "node/3621575731" },
  { nom: "Coiffure Charlet", cat: "sante", type: "Coiffure", osm: "node/1608638131" },
  { nom: "Colruyt", cat: "alimentation", type: "Supermarché", tel: "+32 2 731 21 35", web: "https://www.colruyt.be/nl/winkelzoeker/colruyt-kraainem", horaires: "Mo-Th,Sa 08:00-20:00; Fr 08:00-21:00", osm: "node/475615691" },
  { nom: "Connections", cat: "services", type: "Agence de voyage", horaires: "Mo-Sa 10:00-18:00", osm: "node/3665098425" },
  { nom: "CPH Belgium", cat: "loisirs", type: "Librairie", osm: "node/13252384026" },
  { nom: "Crelan", cat: "services", type: "Banque", rue: "Avenue Reine Astrid", num: "233", osm: "node/394817311" },
  { nom: "CycloGardens", cat: "maison", type: "Jardinerie", num: "15", web: "http://www.cyclogardens.be", osm: "node/5484883638" },
  { nom: "D'Haenen", cat: "alimentation", type: "Boulangerie", rue: "Prinses Josephine-Charlotteplein", num: "5", osm: "node/427623570" },
  { nom: "De Foyer", cat: "table", type: "Restaurant", tel: "+32 2 361 47 74", web: "https://defoyerkraainem.be/", horaires: "Tu-Fr 10:00-23:00; Sa 11:00-23:00; Mo 14:00-23:00; Su off", osm: "node/4003443761" },
  { nom: "De Wit", cat: "sante", type: "Opticien", horaires: "Tu-Sa 10:00-12:30, Tu-Fr 13:30-18:00; Su,Mo off", osm: "node/4068907665" },
  { nom: "Delhaize", cat: "alimentation", type: "Supermarché", rue: "Avenue de Wezembeek", num: "112", tel: "+32 2 784 36 48", web: "https://stores.delhaize.be/nl/delhaize-kraainem", horaires: "Mo-Sa 08:00-20:00; Fr 08:00-21:00", osm: "way/506468512" },
  { nom: "Delhaize Shop'n Go", cat: "alimentation", type: "Épicerie de proximité", osm: "way/509620688" },
  { nom: "Deli Kraainem", cat: "alimentation", type: "Traiteur", web: "http://www.delitraiteur.be", horaires: "07:30-22:00", osm: "node/4484314993" },
  { nom: "Deutsche Bank", cat: "services", type: "Banque", rue: "Avenue de Wezembeek", num: "93", tel: "+32 2 551 99 71", web: "https://www.deutschebank.be/nl/contact/kraainem.html", osm: "node/6318445467" },
  { nom: "Domus Cuisine Traiteur", cat: "alimentation", type: "Traiteur", osm: "node/4343232058" },
  { nom: "Ephem'Hair", cat: "sante", type: "Coiffure", osm: "node/5246116818" },
  { nom: "Finres", cat: "maison", type: "Quincaillerie", tel: "+32 2 720 23 56", osm: "node/4343232063" },
  { nom: "First Immo", cat: "services", type: "Agence immobilière", osm: "node/4239382394" },
  { nom: "Frituur DLM Number One", cat: "table", type: "Friterie", osm: "node/12346414848" },
  { nom: "Fruits exotiques", cat: "alimentation", type: "Primeur", osm: "node/13532018637" },
  { nom: "Garage G.M.J.", cat: "mobilite", type: "Automobile", osm: "node/305362414" },
  { nom: "Ghijselings", cat: "sante", type: "Pharmacie", tel: "+32 2 720 47 90", horaires: "Mo-Fr 09:00-12:30,14:00-19:00; Sa 09:00-12:30", osm: "node/12593613073" },
  { nom: "Gianclaudio & Nadia", cat: "sante", type: "Coiffure", horaires: "We-Fr 10:00-18:00; Sa 10:00-17:00; Mo,Tu off", osm: "node/1789806777" },
  { nom: "Gutenberg Buchhandlung", cat: "loisirs", type: "Librairie", tel: "+32 2 731 83 29", web: "https://gutenbergbuchhandlung.be/", horaires: "Mo off; Tu-Sa 10:00-18:30", osm: "node/3697451552" },
  { nom: "Hair Style Francisca", cat: "sante", type: "Coiffure", tel: "+32 2 782 05 21", horaires: "Mo-Sa 08:00-18:00", osm: "node/5484878946" },
  { nom: "Hairstyle", cat: "sante", type: "Coiffure", osm: "node/1285057633" },
  { nom: "Hoeylaerts", cat: "mobilite", type: "Automobile", osm: "node/305362418" },
  { nom: "I Gusto", cat: "alimentation", type: "Traiteur", web: "http://www.i-gusto.com", osm: "node/4917835936" },
  { nom: "Institut Pacific", cat: "sante", type: "Coiffure", rue: "Avenue de Wezembeek", num: "98", tel: "+32 2 731 85 03", osm: "node/2181625359" },
  { nom: "IPR N.V.", cat: "services", type: "Comptabilité", osm: "node/4343232064" },
  { nom: "J. Abreu", cat: "artisans", type: "Tapissier", osm: "node/5281541704" },
  { nom: "Kerstbomen", cat: "maison", type: "Fleuriste", osm: "node/4070596208" },
  { nom: "Kew-Lox", cat: "maison", type: "Mobilier", rue: "Avenue Reine Astrid", num: "325", osm: "node/3623970547" },
  { nom: "Keystones", cat: "services", type: "Agence immobilière", num: "120", osm: "node/5327397989" },
  { nom: "King's Shops", cat: "maison", type: "Décoration", rue: "Avenue de Wezembeek", num: "89", tel: "+32 2 538 42 38", web: "https://kingsshops.be/", osm: "node/6360247876" },
  { nom: "La Baie d'Omija", cat: "alimentation", type: "Boulangerie", osm: "node/430402102" },
  { nom: "La Bottega Dell Artigiano", cat: "table", type: "Restaurant", osm: "node/4068907667" },
  { nom: "La Perle du Désert", cat: "table", type: "Restaurant", horaires: "Tu-Su 11:30-15:00,18:30-23:00", osm: "node/305362416" },
  { nom: "Latour & Petit", cat: "services", type: "Agence immobilière", osm: "node/5338812902" },
  { nom: "Leonidas", cat: "alimentation", type: "Chocolaterie", rue: "Avenue de Wezembeek", num: "114", osm: "node/3200190129" },
  { nom: "Les Pépinières de Tervuren", cat: "maison", type: "Jardinerie", rue: "Chaussée de Bruxelles", num: "298", web: "https://www.pepiniere-jardiflore.be/", osm: "node/10594647478" },
  { nom: "Lidl", cat: "alimentation", type: "Supermarché", rue: "Avenue Reine Astrid", num: "364", web: "https://www.lidl.be/storesearch/assets/detailpages/fr-BE/kraainem/koningin-astridlaan-364.html", horaires: "Mo-Fr 08:30-20:00; Sa 08:30-19:00; PH off", osm: "way/34320657" },
  { nom: "Madame", cat: "sante", type: "Institut de beauté", horaires: "Mo-Sa 09:00-18:30", osm: "node/5385593271" },
  { nom: "Maison Laurent Patrick", cat: "sante", type: "Coiffure", rue: "Chaussée de Malines", num: "362", tel: "+32 2 767 97 67", web: "https://www.laurentpatrick.com", osm: "way/190014793" },
  { nom: "MAK", cat: "services", type: "Agence immobilière", osm: "node/3698510330" },
  { nom: "Mark Sound", cat: "loisirs", type: "Musique", web: "https://marksound.be/", horaires: "Tu-Sa 10:00-13:00,14:00-18:00; Su,Mo off", osm: "node/5246116816" },
  { nom: "Maxime Colin", cat: "table", type: "Restaurant", rue: "Pastoorkesweg", num: "1", tel: "+32 2 720 63 46", web: "https://maximecolin.be/", horaires: "Tu-Fr 12:00-14:00; Tu-Sa 19:30-22:00", osm: "node/4343232069" },
  { nom: "Medi-Market", cat: "sante", type: "Parapharmacie", horaires: "Mo-Fr 09:30-19:00", osm: "node/3200324942" },
  { nom: "Mega Clean", cat: "services", type: "Pressing", horaires: "24/7", osm: "node/3221817935" },
  { nom: "Mister Genius", cat: "loisirs", type: "Téléphonie", horaires: "Tu-Sa 10:30-18:30", osm: "node/5246116815" },
  { nom: "Mister Minit", cat: "artisans", type: "Cordonnier", horaires: "Mo-Sa 10:00-13:00,14:00-18:00", osm: "node/3200324941" },
  { nom: "Ms Coiffure", cat: "sante", type: "Coiffure", rue: "Prinses Josephine-Charlotteplein", num: "7", tel: "+32 2 721 18 63", horaires: "Tu-We 09:00-18:00; Th 09:00-19:30; Fr 09:00-18:00; Sa 08:30-17:00", osm: "node/427623573" },
  { nom: "Origin'O", cat: "alimentation", type: "Supermarché bio", rue: "Avenue des Anciens Combattants", num: "87", tel: "+32 2 725 05 55", web: "https://www.origino.be/", horaires: "Mo 13:00-19:30; Tu-Fr 08:30-19:30; Sa 09:00-18:00; Su 09:00-13:00", osm: "way/96197079" },
  { nom: "Pano", cat: "artisans", type: "Enseigniste", rue: "Avenue Arthur Dezangré", num: "70", horaires: "Tu-Fr 10:00-16:00", osm: "node/4919743838" },
  { nom: "Pearle Opticiens", cat: "sante", type: "Opticien", tel: "+32 2 731 38 64", web: "https://www.pearle.be/nl_BE/opticien/kraainem/wezembeeklaan-114", horaires: "Tu-Sa 10:00-13:00,14:00-18:00", osm: "node/3267487254" },
  { nom: "Pil Poil", cat: "sante", type: "Toilettage", osm: "node/6344769572" },
  { nom: "Pita Palace", cat: "table", type: "Restauration rapide", osm: "node/5281541707" },
  { nom: "Pizzeria Da Toni", cat: "table", type: "Restaurant", osm: "node/393162730" },
  { nom: "Planimmo", cat: "services", type: "Agence immobilière", osm: "node/4919743841" },
  { nom: "Pomax", cat: "loisirs", type: "Vêtements", osm: "node/5364676904" },
  { nom: "Presence Prevail", cat: "loisirs", type: "Vêtements", tel: "+32 2 785 00 05", osm: "node/5272405226" },
  { nom: "R.S.M Moto", cat: "mobilite", type: "Moto", osm: "node/4068907671" },
  { nom: "Red", cat: "sante", type: "Coiffure", osm: "node/3245780534" },
  { nom: "Restaurant Lotus", cat: "table", type: "Restaurant", horaires: "Tu-Su 12:00-14:00,18:00-22:00", osm: "node/315309544" },
  { nom: "Ronne Hoeck", cat: "table", type: "Estaminet", horaires: "Mo-Fr 14:00-24:00, Sa,Su 16:00-24:00", osm: "node/4218266737" },
  { nom: "Rottiers", cat: "alimentation", type: "Boucherie", horaires: "Tu-Sa 08:00-13:30, Su 08:00-12:30, Tu,We,Fr,Sa 14:30-18:30; Mo off", osm: "node/1285072039" },
  { nom: "San Tucci", cat: "table", type: "Restaurant", rue: "Prinses Josephine-Charlotteplein", num: "8", osm: "node/427623574" },
  { nom: "Saporito", cat: "table", type: "Restauration rapide", horaires: "Mo,We-Fr 17:30-22:00; Sa,Su 12:00-22:00", osm: "node/5281541706" },
  { nom: "Senza", cat: "table", type: "Restaurant", horaires: "Tu-Fr 12:00-22:30", osm: "node/5246116817" },
  { nom: "Shuka VIP", cat: "table", type: "Restaurant", horaires: "Sa,Su 15:00-22:00; Fr 16:00-22:00; Mo-Th off", osm: "node/4068907672" },
  { nom: "Siemens", cat: "maison", type: "Électroménager", rue: "Avenue Arthur Dezangré", num: "78", osm: "node/4919743837" },
  { nom: "Sky Blue", cat: "table", type: "Bar", osm: "node/312461297" },
  { nom: "Soko Rooftop", cat: "table", type: "Bar", web: "https://www.sokorooftop.be/", horaires: "Tu-Sa 17:00-01:00", osm: "node/10016388735" },
  { nom: "Station 3", cat: "table", type: "Restaurant", web: "http://www.station3.be/", osm: "node/305362417" },
  { nom: "Stockel Car", cat: "mobilite", type: "Automobile", osm: "node/2235163972" },
  { nom: "Thai by Tom", cat: "table", type: "Restaurant", rue: "Avenue Reine Astrid", osm: "node/3623968229" },
  { nom: "The Bridge", cat: "services", type: "Agence immobilière", rue: "Avenue Reine Astrid", num: "237", web: "https://www.thebridge.be/", osm: "node/3194996841" },
  { nom: "The New Inn", cat: "table", type: "Estaminet", horaires: "Su-Th 11:00-23:00, Fr,Sa 11:00-24:00", osm: "node/4217832699" },
  { nom: "TUI", cat: "services", type: "Agence de voyage", tel: "+32 2 731 79 38", web: "https://www.tui.be/", horaires: "Mo-Fr 09:30-13:15,14:00-18:00; Sa 09:30-13:15,14:00-18:00", osm: "node/3200324940" },
  { nom: "Van Hoorde", cat: "alimentation", type: "Boucherie", horaires: "Mo-Fr 08:30-18:00; Sa 08:30-17:30", osm: "node/5281541705" },
  { nom: "Van Meerbeeck", cat: "maison", type: "Peinture", tel: "+32 2 726 75 83", osm: "node/4343232071" },
  { nom: "Vlaams & Neutraal Ziekenfonds", cat: "services", type: "Mutuelle & assurance", rue: "Avenue Arthur Dezangré", num: "64", horaires: "Tu 18:00-20:00", osm: "node/4919743839" },
  { nom: "Washbix", cat: "services", type: "Blanchisserie", osm: "node/4239382393" },
  { nom: "Wils E.", cat: "sante", type: "Pharmacie", horaires: "Mo-Fr 08:30-12:15,13:30-19:00, Sa 08:30-12:15", osm: "node/313170114" },
  { nom: "Zwaluwenhof", cat: "alimentation", type: "Vente à la ferme", rue: "Rue du Moulin", num: "33", horaires: "Tu 10:00-12:00, 15:00-17:30; Sa 10:00-17:30", osm: "node/4919743849" },
];

/** Horaires OSM (« Mo-Fr 09:00-18:00; Su off ») rendus lisibles en français. */
const JOURS: [RegExp, string][] = [
  [/\bMo\b/g, "lun"], [/\bTu\b/g, "mar"], [/\bWe\b/g, "mer"], [/\bTh\b/g, "jeu"],
  [/\bFr\b/g, "ven"], [/\bSa\b/g, "sam"], [/\bSu\b/g, "dim"], [/\bPH\b/g, "fériés"],
];
export const horairesFr = (h: string) => {
  let s = h;
  for (const [re, fr] of JOURS) s = s.replace(re, fr);
  return s.replace(/\boff\b/g, "fermé").replace(/24\/7/g, "24 h/24, 7 j/7").replace(/;\s*/g, " · ");
};

export const eur = (n: number) => new Intl.NumberFormat("fr-BE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
export const pct = (n: number) => new Intl.NumberFormat("fr-BE", { maximumFractionDigits: 0 }).format(n) + " %";
export const dateFr = (s: string) => new Date(s).toLocaleDateString("fr-BE", { day: "numeric", month: "long", year: "numeric" });
