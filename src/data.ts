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
// SOURCES DE DONNÉES RÉELLES (dossier « Les données », 7 août 2026).
// ---------------------------------------------------------------------------
export const dataMeta = {
  sessionsTotal: 1063,
  sessionsFrom: "27 mai 2021",
  sessionsTo: "4 août 2026",
  connecteur: "Lokaal Beslist — API JSON:API, sans clé",
  lien: "https://lokaalbeslist.vlaanderen.be/",
  epurationFlandre: "89 %",
};
export type SourceStatut = "disponible" | "a-tester" | "a-parser" | "manquant";
export interface DataSource { nom: string; source: string; statut: SourceStatut; note?: string; licence?: string; }
export const dataSources: DataSource[] = [
  { nom: "Décisions du conseil & du collège", source: "Lokaal Beslist — API JSON:API", statut: "disponible", note: "1 063 séances indexées (2021→2026) : séances, points, délibérations, votes, mandataires.", licence: "Modellicentie Gratis Hergebruik" },
  { nom: "Qualité de l'air (grille à la rue)", source: "IRCELINE — grilles RIO-IFDM / ATMO-Street", statut: "disponible", note: "Aucune station à Kraainem ; valeur communale via la grille modélisée.", licence: "CC BY 4.0" },
  { nom: "Assainissement & égouttage", source: "VMM — geoserver HDGIS (WFS/WMS)", statut: "disponible", licence: "Modellicentie" },
  { nom: "Bâti, adresses, parcelles", source: "Basisregisters Vlaanderen — API", statut: "disponible", licence: "Modellicentie" },
  { nom: "Consommation élec/gaz & photovoltaïque", source: "Fluvius — Opendatasoft", statut: "a-tester", note: "Par commune et par rue ; confirmer le gestionnaire (Sibelgas)." },
  { nom: "Finances comparables entre communes (BBC)", source: "data.gov.be / Stadsmonitor", statut: "a-tester", note: "Comparaison budgétaire automatique si le dataset hebdo tient sa promesse." },
  { nom: "Raccordement & épuration des eaux", source: "VMM — XLSX annuel", statut: "a-parser", note: "Repère flamand : 89 % des eaux usées épurées fin 2024." },
  { nom: "Accidents de la route géolocalisés", source: "Statbel — open data", statut: "a-parser" },
  { nom: "Criminalité par commune / trimestre", source: "Police fédérale — XLSX", statut: "a-parser" },
  { nom: "Revenus fiscaux par secteur statistique", source: "Statbel", statut: "a-parser", note: "Échelle infracommunale — dit enfin quelque chose des écarts internes à Kraainem." },
  { nom: "Canopée & imperméabilisation", source: "Groenkaart / Boswijzer (rasters)", statut: "a-parser", note: "À découper sur le contour communal." },
];
export const dataGaps = [
  { nom: "Résultats d'analyse de l'eau", raison: "Rapport interactif (Cognos), sans export en masse." },
  { nom: "Potentiel solaire par toiture, labels EPC", raison: "Enfermés dans des rapports Power BI." },
  { nom: "Mesures citoyennes NO₂ (CurieuzeNeuzen)", raison: "20 000 points en Flandre, aucun jeu ouvert." },
  { nom: "Résultats électoraux communaux 2024", raison: "Application monopage, sans téléchargement documenté." },
  { nom: "Activation de Kraainem Connect (Hoplr)", raison: "Donnée privée — à demander." },
  { nom: "Non-recours aux droits sociaux (communal)", raison: "N'existe nulle part — le pilote devra le produire lui-même." },
];
export const dataLicences = [
  "Décisions locales : Modellicentie Gratis Hergebruik (Vlaanderen) — mention de la source obligatoire.",
  "Qualité de l'air : IRCELINE, CC BY 4.0.",
  "Statbel : réutilisation autorisée.",
];

export const eur = (n: number) => new Intl.NumberFormat("fr-BE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
export const pct = (n: number) => new Intl.NumberFormat("fr-BE", { maximumFractionDigits: 0 }).format(n) + " %";
export const dateFr = (s: string) => new Date(s).toLocaleDateString("fr-BE", { day: "numeric", month: "long", year: "numeric" });
