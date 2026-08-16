/**
 * Le barème — paramètres et règles de calcul du coût complet.
 *
 * Module pur, sans dépendance à l'interface, sur le modèle de `pertinence.ts`.
 * La page /fr/bareme le nomme, comme /fr/classement nomme pertinence.ts.
 *
 * ---------------------------------------------------------------------------
 * La distinction qui gouverne tout ce fichier
 * ---------------------------------------------------------------------------
 *
 * L'écran /fr/impact énonce que la plateforme « n'estime jamais à la place de
 * l'entreprise ». Ce module manipule pourtant des forfaits. Ce n'est pas une
 * contradiction, à une condition qui est inscrite dans les types :
 *
 *   Le forfait n'est pas une estimation de ce que fait cette entreprise-là.
 *   C'est le prix qu'un acheteur applique à un marché en l'absence de
 *   déclaration. Il porte sur un contrat, jamais sur une personne morale.
 *
 * D'où trois règles tenues par le code, pas par la relecture :
 *   — `Forfait` n'existe que dans `LigneCalcul`, qui appartient à un marché.
 *     Aucun type décrivant une entreprise ne peut en porter un.
 *   — aucune fonction ne renvoie un montant sans sa chaîne de calcul ;
 *   — toute valeur porte son statut : déclaré, calculé, forfait, publié,
 *     hypothèse.
 */

// ---------------------------------------------------------------------------
// Statuts d'une valeur — visibles sans survol, partout où un nombre s'affiche.
// ---------------------------------------------------------------------------

export const STATUTS_VALEUR = ['declare', 'calcule', 'forfait', 'publie', 'hypothese'] as const;
export type StatutValeur = (typeof STATUTS_VALEUR)[number];

export const LIBELLE_STATUT: Record<StatutValeur, string> = {
  declare: 'déclaré',
  calcule: 'calculé',
  forfait: 'forfait',
  publie: 'publié',
  hypothese: 'hypothèse',
};

export interface OrigineValeur {
  /** Qui publie ce nombre. Jamais « la plateforme ». */
  organisme: string;
  reference: string;
  url?: string;
  /** Date du relevé, pas date de consultation de la page. */
  releveLe: string;
  /**
   * Faux quand la valeur n'a pas pu être vérifiée par un appel automatisé.
   * Ni la valeur tutélaire du carbone ni le prix du quota ne sont publiés dans
   * un jeu de données ouvert : le premier vit dans un PDF, le second sur une
   * plateforme de marché sans interface programmable. Voir IMPOSSIBLE.md.
   */
  verifieParAppel: boolean;
  /** Renseigné quand `verifieParAppel` est faux : ce qu'il faudrait pour l'être. */
  pourquoi?: string;
}

export interface Parametre {
  cle: string;
  libelle: string;
  montant: number;
  unite: string;
  statut: StatutValeur;
  origine: OrigineValeur;
}

// ---------------------------------------------------------------------------
// Version du barème. Toute modification d'un paramètre incrémente la version
// et alimente l'historique affiché sur /fr/bareme.
// ---------------------------------------------------------------------------

export const VERSION_BAREME = '1.0.0';

export interface EntreeHistorique {
  version: string;
  le: string;
  quoi: string;
}

export const HISTORIQUE_BAREME: EntreeHistorique[] = [
  {
    version: '1.0.0',
    le: '2026-08-16',
    quoi: 'Première version. Valeur tutélaire du carbone ancrée sur les valeurs recommandées par la Commission, prix du quota relevé à la main faute de jeu de données ouvert, quatre forfaits sectoriels, seuil de déclaration calculé et non décidé.',
  },
];

// ---------------------------------------------------------------------------
// 1. La valeur publique du carbone
// ---------------------------------------------------------------------------

/**
 * Valeurs d'ancrage de la valeur tutélaire du carbone.
 *
 * Ce sont des valeurs de politique publique servant à l'analyse coûts-bénéfices,
 * pas un prix de marché. Elles ne sont pas publiées en données ouvertes : le
 * document qui les porte est un PDF. Elles sont donc relevées à la main, datées,
 * et affichées avec leur origine sur /fr/bareme.
 */
export const ANCRAGES_CARBONE: Array<{ annee: number; euroParTonne: number }> = [
  { annee: 2020, euroParTonne: 100 },
  { annee: 2030, euroParTonne: 250 },
  { annee: 2040, euroParTonne: 500 },
  { annee: 2050, euroParTonne: 800 },
];

export const ORIGINE_CARBONE: OrigineValeur = {
  organisme: 'Commission européenne',
  reference: 'Better Regulation Toolbox, outil n° 64 — coût du carbone pour l’analyse coûts-bénéfices (euros de 2016)',
  url: 'https://commission.europa.eu/law/law-making-process/planning-and-proposing-law/better-regulation/better-regulation-guidelines-and-toolbox_en',
  releveLe: '2026-08-16',
  verifieParAppel: false,
  pourquoi:
    'Le paramètre est publié dans un document PDF, sans jeu de données ouvert correspondant. La page d’accueil de la boîte à outils a été appelée le 16 août 2026 : elle ne porte pas la valeur.',
};

export interface ValeurCarbone {
  annee: number;
  euroParTonne: number;
  statut: StatutValeur;
  chaine: string[];
}

/**
 * Valeur publique du carbone pour une année.
 *
 * Entre deux ancrages, la valeur est interpolée linéairement — et l'interpolation
 * est `calculé`, jamais `publié` : le nombre affiché pour 2027 n'a été publié
 * par personne, seule la droite qui le produit l'a été.
 */
export function valeurCarbone(annee: number): ValeurCarbone {
  const exact = ANCRAGES_CARBONE.find((a) => a.annee === annee);
  if (exact) {
    return {
      annee,
      euroParTonne: exact.euroParTonne,
      statut: 'publie',
      chaine: [`Valeur d’ancrage publiée pour ${annee} : ${exact.euroParTonne} €/tCO₂e.`],
    };
  }

  const avant = [...ANCRAGES_CARBONE].reverse().find((a) => a.annee < annee);
  const apres = ANCRAGES_CARBONE.find((a) => a.annee > annee);

  if (!avant || !apres) {
    const bord = avant ?? apres!;
    return {
      annee,
      euroParTonne: bord.euroParTonne,
      statut: 'hypothese',
      chaine: [
        `Aucun ancrage n’encadre ${annee}.`,
        `Valeur de bord retenue : celle de ${bord.annee}, ${bord.euroParTonne} €/tCO₂e.`,
        'Extrapoler au-delà du dernier ancrage publié serait inventer une politique publique.',
      ],
    };
  }

  const pente = (apres.euroParTonne - avant.euroParTonne) / (apres.annee - avant.annee);
  const valeur = avant.euroParTonne + pente * (annee - avant.annee);

  return {
    annee,
    euroParTonne: Math.round(valeur),
    statut: 'calcule',
    chaine: [
      `Ancrages encadrants : ${avant.annee} → ${avant.euroParTonne} €/t, ${apres.annee} → ${apres.euroParTonne} €/t.`,
      `Pente : (${apres.euroParTonne} − ${avant.euroParTonne}) ÷ (${apres.annee} − ${avant.annee}) = ${pente} €/t par an.`,
      `Valeur ${annee} : ${avant.euroParTonne} + ${pente} × ${annee - avant.annee} = ${Math.round(valeur)} €/tCO₂e.`,
    ],
  };
}

/** La trajectoire annoncée à trois ans, affichée sur /fr/bareme et dans le simulateur. */
export function trajectoireCarbone(depuis: number, ans = 3): ValeurCarbone[] {
  return Array.from({ length: ans + 1 }, (_, i) => valeurCarbone(depuis + i));
}

// ---------------------------------------------------------------------------
// 2. Le carbone déjà tarifé ailleurs — le résidu
// ---------------------------------------------------------------------------

/**
 * Prix du quota européen effectivement acquitté sur un poste couvert.
 *
 * Aucune interface programmable publique ne le diffuse : Eurostat ne publie pas
 * de jeu de données de prix des quotas (vérifié le 16 août 2026, HTTP 404 sur
 * env_ac_ets et aucune entrée au catalogue). Le prix vit sur une plateforme de
 * marché. C'est donc un paramètre relevé à la main, daté, à re-relever
 * mensuellement — et l'écran /fr/bareme le dit.
 */
export const PRIX_QUOTA_ETS: Parametre = {
  cle: 'prix-quota-ets',
  libelle: 'Prix du quota européen d’émission, relevé de référence',
  montant: 78,
  unite: '€/tCO₂e',
  statut: 'publie',
  origine: {
    organisme: 'European Energy Exchange — résultats d’enchères du marché primaire',
    reference: 'Prix de clôture des enchères de quotas EU ETS, relevé de référence du barème',
    url: 'https://www.eex.com/en/market-data/environmental-markets',
    releveLe: '2026-08-16',
    verifieParAppel: false,
    pourquoi:
      'Aucun jeu de données ouvert ne diffuse ce prix. Eurostat répond HTTP 404 sur env_ac_ets et son catalogue n’en contient aucun. Relevé manuel, à reprendre chaque mois.',
  },
};

/** Ce qui couvre un poste, et donc ce qui a déjà été payé dessus. */
export type Couverture = 'ets' | 'aucune' | 'ets2-a-partir-de-2028';

export interface Residu {
  euroParTonne: number;
  statut: StatutValeur;
  couverture: Couverture;
  dejaAcquitte: number;
  chaine: string[];
}

/**
 * Valeur applicable à un poste, une fois retiré ce qui a déjà été payé.
 *
 * C'est la règle la plus facile à rater, et elle change tout :
 *
 *   valeur applicable = valeur publique − prix carbone déjà payé sur ce poste
 *
 * **On soustrait le prix acquitté ; on ne retire jamais la ligne.** Retirer un
 * poste entier du total parce qu'il serait « déjà tarifé » ferait disparaître le
 * plus gros gisement de la commune du classement des leviers. Une ligne
 * totalement couverte s'affiche avec un résidu nul et la mention du prix déjà
 * payé — jamais avec une absence.
 */
export function residuCarbone(couverture: Couverture, annee: number): Residu {
  const publique = valeurCarbone(annee);
  const chaine = [...publique.chaine];

  if (couverture === 'aucune') {
    chaine.push('Ce poste n’est couvert par aucun prix carbone : le résidu est la valeur publique entière.');
    return {
      euroParTonne: publique.euroParTonne,
      statut: publique.statut,
      couverture,
      dejaAcquitte: 0,
      chaine,
    };
  }

  if (couverture === 'ets2-a-partir-de-2028' && annee < 2028) {
    chaine.push(
      `Le second système d’échange, qui couvrira le chauffage des bâtiments, ne s’applique pas en ${annee} : le résidu reste la valeur publique entière.`,
    );
    return {
      euroParTonne: publique.euroParTonne,
      statut: publique.statut,
      couverture,
      dejaAcquitte: 0,
      chaine,
    };
  }

  const acquitte = PRIX_QUOTA_ETS.montant;
  const residu = Math.max(0, publique.euroParTonne - acquitte);
  chaine.push(
    `Ce poste est couvert par un prix carbone : ${acquitte} €/t déjà acquittés (${PRIX_QUOTA_ETS.origine.organisme}, relevé du ${PRIX_QUOTA_ETS.origine.releveLe}).`,
    `Résidu : ${publique.euroParTonne} − ${acquitte} = ${residu} €/tCO₂e.`,
    residu === 0
      ? 'Le résidu est nul : la ligne reste au calcul, avec le prix déjà payé en regard. Elle n’est jamais retirée.'
      : 'La ligne reste au calcul pour son résidu seul, jamais pour la valeur publique entière.',
  );

  return { euroParTonne: residu, statut: 'calcule', couverture, dejaAcquitte: acquitte, chaine };
}

// ---------------------------------------------------------------------------
// 3. L'impact monétisé d'un marché
// ---------------------------------------------------------------------------

/** Deux usages, deux règles. L'écran doit dire lequel il sert. */
export type UsageCalcul = 'attribuer' | 'classer-les-leviers';

export const EXPLICATION_USAGE: Record<UsageCalcul, string> = {
  attribuer:
    'Départager des offres. Un poste dont le volume est le même quel que soit le soumissionnaire ne départage personne : il est signalé comme non discriminant.',
  'classer-les-leviers':
    'Ranger des gisements entre eux. Tout est compté, au résidu, y compris ce qui est déjà tarifé ailleurs.',
};

export interface PostePris {
  cle: string;
  libelle: string;
  /** Quantité physique. `null` quand elle n'est pas déclarée : le forfait s'applique. */
  quantite: number | null;
  unite: string;
  facteurEmission: number;
  uniteFacteur: string;
  origineFacteur: OrigineValeur;
  couverture: Couverture;
  /** Vrai quand le volume ne dépend pas du soumissionnaire. */
  nonDiscriminant?: boolean;
  /** Renseigné si `quantite` est nulle. Toujours défavorable, toujours publié. */
  forfait?: { quantite: number; origine: OrigineValeur; quantile: string };
}

export interface LigneCalcul {
  cle: string;
  libelle: string;
  quantite: number;
  unite: string;
  statutQuantite: StatutValeur;
  facteurEmission: number;
  tonnesCo2e: number;
  euroParTonne: number;
  dejaAcquitteEuroParTonne: number;
  montantEur: number;
  couverture: Couverture;
  nonDiscriminant: boolean;
  chaine: string[];
}

export interface ImpactMarche {
  totalEur: number;
  /** Part du montant du marché. Rapport présenté comme tel, jamais comme une note. */
  partDuMontant: number | null;
  usage: UsageCalcul;
  annee: number;
  lignes: LigneCalcul[];
  /** Somme des montants dont le carbone est déjà tarifé ailleurs. */
  dejaTarifeEur: number;
}

/**
 * Impact monétisé d'un marché.
 *
 * La fonction renvoie le résultat **et** la chaîne de calcul complète. Il n'existe
 * volontairement aucune surcharge qui renverrait le seul nombre : un appelant ne
 * peut pas obtenir le montant sans le moyen de le contester.
 */
export function impactMonetise(
  postes: PostePris[],
  options: { annee: number; usage: UsageCalcul; montantMarcheEur?: number },
): ImpactMarche {
  const lignes: LigneCalcul[] = postes.map((poste) => {
    const quantite = poste.quantite ?? poste.forfait?.quantite ?? 0;
    const statutQuantite: StatutValeur =
      poste.quantite !== null ? 'declare' : poste.forfait ? 'forfait' : 'hypothese';

    const residu = residuCarbone(poste.couverture, options.annee);
    const tonnes = (quantite * poste.facteurEmission) / 1000;
    const montant = tonnes * residu.euroParTonne;

    const chaine = [
      statutQuantite === 'forfait'
        ? `Quantité non déclarée : forfait de ${quantite} ${poste.unite} appliqué (${poste.forfait!.quantile}, ${poste.forfait!.origine.organisme}). Le forfait porte sur ce contrat, pas sur l’entreprise.`
        : `Quantité déclarée : ${quantite} ${poste.unite}.`,
      `Facteur d’émission : ${poste.facteurEmission} ${poste.uniteFacteur} (${poste.origineFacteur.organisme}, ${poste.origineFacteur.releveLe}).`,
      `Émissions : ${quantite} × ${poste.facteurEmission} ÷ 1 000 = ${arrondiSignifiant(tonnes)} tCO₂e.`,
      ...residu.chaine,
      `Montant : ${arrondiSignifiant(tonnes)} × ${residu.euroParTonne} = ${Math.round(montant)} €.`,
    ];

    if (options.usage === 'attribuer' && poste.nonDiscriminant) {
      chaine.push(
        'Ce poste ne départage pas les offres : le volume est le même quel que soit le soumissionnaire. Il est compté au total mais signalé comme non discriminant.',
      );
    }

    return {
      cle: poste.cle,
      libelle: poste.libelle,
      quantite,
      unite: poste.unite,
      statutQuantite,
      facteurEmission: poste.facteurEmission,
      tonnesCo2e: tonnes,
      euroParTonne: residu.euroParTonne,
      dejaAcquitteEuroParTonne: residu.dejaAcquitte,
      montantEur: montant,
      couverture: poste.couverture,
      nonDiscriminant: Boolean(poste.nonDiscriminant),
      chaine,
    };
  });

  const totalEur = lignes.reduce((s, l) => s + l.montantEur, 0);
  const dejaTarifeEur = lignes.reduce((s, l) => s + (l.tonnesCo2e * l.dejaAcquitteEuroParTonne), 0);

  return {
    totalEur,
    partDuMontant: options.montantMarcheEur ? totalEur / options.montantMarcheEur : null,
    usage: options.usage,
    annee: options.annee,
    lignes,
    dejaTarifeEur,
  };
}

// ---------------------------------------------------------------------------
// 4. Le seuil de déclaration — il se calcule, il ne se décide pas
// ---------------------------------------------------------------------------

export interface Seuil {
  seuilEur: number;
  chaine: string[];
}

/**
 * Seuil au-dessous duquel aucune déclaration n'est exigée.
 *
 *   seuil = coût annualisé de la déclaration ÷ taux d'impact moyen du marché
 *
 * En dessous, exiger une déclaration coûterait à l'entreprise plus que l'impact
 * qu'on cherche à réduire. L'interface montre le calcul, pas seulement le nombre.
 */
export function seuilDeclaration(coutAnnualiseEur: number, tauxImpactMoyen: number): Seuil {
  if (tauxImpactMoyen <= 0) {
    return {
      seuilEur: Number.POSITIVE_INFINITY,
      chaine: ['Taux d’impact nul ou négatif : aucun seuil ne peut être calculé, donc aucune déclaration exigée.'],
    };
  }
  const seuil = coutAnnualiseEur / tauxImpactMoyen;
  return {
    seuilEur: seuil,
    chaine: [
      `Coût annualisé d’une déclaration pour l’entreprise : ${Math.round(coutAnnualiseEur)} €.`,
      `Taux d’impact moyen constaté sur les marchés de cette famille : ${(tauxImpactMoyen * 100).toFixed(1)} % du montant.`,
      `Seuil : ${Math.round(coutAnnualiseEur)} ÷ ${tauxImpactMoyen.toFixed(3)} = ${Math.round(seuil)} € de marché annuel.`,
      'Sous ce seuil, la déclaration coûterait plus cher que l’impact qu’elle permet de réduire : elle n’est pas exigée.',
    ],
  };
}

// ---------------------------------------------------------------------------
// 5. L'indice d'accident — moyenne triennale, jamais une seule année
// ---------------------------------------------------------------------------

export interface AnneeAccidents {
  annee: number;
  /** Un accident au-delà de 120 jours d'incapacité est plafonné à 120. */
  accidents: Array<{ joursIncapacite: number }>;
  /** Intérimaires et sous-traitants sur site compris. */
  equivalentsTempsPlein: number;
}

export const PLAFOND_JOURS_ACCIDENT = 120;
export const POIDS_ACCIDENT = 4;

export interface IndiceAccident {
  indice: number;
  statut: StatutValeur;
  anneesRetenues: number[];
  chaine: string[];
}

export function indiceAccident(annees: AnneeAccidents[]): IndiceAccident {
  const retenues = [...annees].sort((a, b) => b.annee - a.annee).slice(0, 3);

  if (retenues.length < 3) {
    return {
      indice: Number.NaN,
      statut: 'hypothese',
      anneesRetenues: retenues.map((a) => a.annee),
      chaine: [
        `Seulement ${retenues.length} année(s) disponible(s) sur les trois requises.`,
        'Aucun indice n’est calculé : une seule année de sinistralité est du bruit, pas une mesure.',
      ],
    };
  }

  const chaine: string[] = [];
  let numerateur = 0;
  let denominateur = 0;

  for (const a of retenues) {
    const jours = a.accidents.reduce((s, x) => s + Math.min(x.joursIncapacite, PLAFOND_JOURS_ACCIDENT), 0);
    const plafonnes = a.accidents.filter((x) => x.joursIncapacite > PLAFOND_JOURS_ACCIDENT).length;
    const contribution = a.accidents.length * POIDS_ACCIDENT + jours;
    numerateur += contribution;
    denominateur += a.equivalentsTempsPlein;
    chaine.push(
      `${a.annee} : ${a.accidents.length} accident(s) × ${POIDS_ACCIDENT} + ${jours} jours d’incapacité` +
        (plafonnes > 0 ? ` (dont ${plafonnes} plafonné(s) à ${PLAFOND_JOURS_ACCIDENT} jours)` : '') +
        ` = ${contribution}, pour ${a.equivalentsTempsPlein} équivalents temps plein.`,
    );
  }

  const indice = numerateur / denominateur;
  chaine.push(
    `Moyenne triennale : ${numerateur} ÷ ${denominateur} = ${indice.toFixed(2)}.`,
    'Les intérimaires et les sous-traitants présents sur site comptent au dénominateur : sinon, externaliser le risque améliorerait l’indice.',
  );

  return { indice, statut: 'calcule', anneesRetenues: retenues.map((a) => a.annee), chaine };
}

// ---------------------------------------------------------------------------
// 6. Le bonus-malus sectoriel — somme nulle par construction
// ---------------------------------------------------------------------------

export interface EntrepriseSecteur {
  /** Identifiant opaque. Aucune fonction de ce module ne trie sur ce champ. */
  id: string;
  /** Intensité déclarée, dans l'unité du secteur. */
  intensite: number;
  /** Volume d'activité, qui pondère la référence. */
  volume: number;
}

export interface SoldeEntreprise {
  id: string;
  soldeEur: number;
  ecartALaReference: number;
  chaine: string[];
}

export interface BonusMalus {
  reference: number;
  valeurUnitaireEur: number;
  soldes: SoldeEntreprise[];
  /** Vérifié à chaque appel : la somme des soldes vaut exactement zéro. */
  sommeCentimes: number;
  chaine: string[];
}

/**
 * Référence sectorielle : moyenne des intensités **pondérée par les volumes**.
 *
 * Ce n'est pas un choix esthétique. C'est cette définition, et elle seule, qui
 * rend la somme des soldes nulle — c'est-à-dire qui fait du dispositif une
 * redistribution entre pairs et non un impôt déguisé.
 */
export function referenceSectorielle(entreprises: EntrepriseSecteur[]): number {
  const volume = entreprises.reduce((s, e) => s + e.volume, 0);
  if (volume === 0) return 0;
  return entreprises.reduce((s, e) => s + e.intensite * e.volume, 0) / volume;
}

/**
 * Solde de chaque entreprise, en euros.
 *
 *   solde = (intensité − référence) × volume × valeur unitaire
 *
 * L'arrondi est distribué : les soldes sont calculés en centimes, et le reliquat
 * d'arrondi est porté par le plus gros contributeur. Sans cela, la somme
 * s'écarterait de zéro de quelques centimes — et la propriété qui définit le
 * dispositif ne serait plus vraie, seulement presque vraie.
 */
export function bonusMalus(entreprises: EntrepriseSecteur[], valeurUnitaireEur: number): BonusMalus {
  const reference = referenceSectorielle(entreprises);

  const bruts = entreprises.map((e) => {
    const ecart = e.intensite - reference;
    return { e, ecart, centimes: Math.round(ecart * e.volume * valeurUnitaireEur * 100) };
  });

  const reliquat = -bruts.reduce((s, b) => s + b.centimes, 0);
  if (reliquat !== 0 && bruts.length > 0) {
    const porteur = bruts.reduce((a, b) => (Math.abs(b.centimes) > Math.abs(a.centimes) ? b : a));
    porteur.centimes += reliquat;
  }

  const soldes: SoldeEntreprise[] = bruts.map((b) => ({
    id: b.e.id,
    soldeEur: b.centimes / 100,
    ecartALaReference: b.ecart,
    chaine: [
      `Intensité déclarée : ${b.e.intensite}. Référence du secteur : ${reference.toFixed(4)}.`,
      `Écart : ${b.ecart.toFixed(4)}.`,
      `Solde : ${b.ecart.toFixed(4)} × ${b.e.volume} × ${valeurUnitaireEur} = ${(b.centimes / 100).toFixed(2)} €.`,
      b.centimes < 0
        ? 'Solde négatif : l’entreprise reçoit, parce qu’elle fait mieux que la moyenne pondérée de son secteur.'
        : 'Solde positif : l’entreprise verse, parce qu’elle fait moins bien que la moyenne pondérée de son secteur.',
    ],
  }));

  return {
    reference,
    valeurUnitaireEur,
    soldes,
    sommeCentimes: bruts.reduce((s, b) => s + b.centimes, 0),
    chaine: [
      `Référence sectorielle : moyenne des intensités pondérée par les volumes = ${reference.toFixed(4)}.`,
      'La somme des soldes vaut exactement zéro : ce que versent les uns est reçu par les autres, à l’euro comme au centime.',
      'Le dispositif redistribue à l’intérieur d’un secteur. Il ne prélève rien.',
    ],
  };
}

// ---------------------------------------------------------------------------
// 7. Les forfaits sectoriels
// ---------------------------------------------------------------------------

export interface ForfaitSectoriel {
  cle: string;
  secteur: string;
  poste: string;
  quantite: number;
  unite: string;
  /** Toujours défavorable par construction : sinon le silence devient une stratégie. */
  quantile: string;
  origine: OrigineValeur;
  /**
   * Vrai tant qu'aucune source publiée ne fournit ce forfait pour la Belgique.
   * Une valeur de démonstration qui ressemble à une donnée réelle finirait par
   * être citée : elle porte donc son étiquette dans le code comme à l'écran.
   */
  fictif: boolean;
}

const ORIGINE_FORFAIT_ABSENTE: OrigineValeur = {
  organisme: 'Aucun — à construire',
  reference:
    'Aucune administration belge ne publie de forfait sectoriel par poste au quantile haut de la branche. Le barème publie la règle ; les valeurs ci-dessous sont fictives tant que la source n’existe pas.',
  releveLe: '2026-08-16',
  verifieParAppel: false,
  pourquoi:
    'La règle du forfait exige une source publiée et datée. Elle n’existe pas : ces valeurs sont des valeurs de démonstration, marquées comme telles partout où elles s’affichent.',
};

export const FORFAITS_SECTORIELS: ForfaitSectoriel[] = [
  {
    cle: 'voirie-carburant',
    secteur: 'Travaux de voirie',
    poste: 'Carburant des engins de chantier',
    quantite: 11_500,
    unite: 'L par 100 000 € de marché',
    quantile: 'neuvième décile de la branche',
    origine: ORIGINE_FORFAIT_ABSENTE,
    fictif: true,
  },
  {
    cle: 'voirie-liant',
    secteur: 'Travaux de voirie',
    poste: 'Enrobé, hypothèse de mise en œuvre à chaud',
    quantite: 62,
    unite: 't par 100 000 € de marché',
    quantile: 'neuvième décile de la branche',
    origine: ORIGINE_FORFAIT_ABSENTE,
    fictif: true,
  },
  {
    cle: 'repas-menu',
    secteur: 'Restauration collective',
    poste: 'Composition moyenne du menu',
    quantite: 2.9,
    unite: 'kg CO₂e par repas',
    quantile: 'neuvième décile de la branche',
    origine: ORIGINE_FORFAIT_ABSENTE,
    fictif: true,
  },
  {
    cle: 'nettoyage-produits',
    secteur: 'Nettoyage',
    poste: 'Produits et consommables',
    quantite: 41,
    unite: 'kg CO₂e par 1 000 m² et par an',
    quantile: 'neuvième décile de la branche',
    origine: ORIGINE_FORFAIT_ABSENTE,
    fictif: true,
  },
];

// ---------------------------------------------------------------------------
// 8. Les paramètres du seuil
// ---------------------------------------------------------------------------

/**
 * Le seuil ne se décide pas, il se calcule — mais ses deux entrées, elles, sont
 * des paramètres publiés du barème.
 */
export const PARAMETRES_SEUIL = {
  coutAnnualiseDeclarationEur: 7_800,
  origineCout: {
    organisme: 'Estimation de démonstration',
    reference:
      'Coût annualisé, pour une petite entreprise, de la collecte et de la vérification des onze rubriques du module de base. Aucune source publiée ne le chiffre pour la Belgique.',
    releveLe: '2026-08-16',
    verifieParAppel: false,
    pourquoi: 'Valeur de démonstration, marquée comme telle. Elle devra être remplacée par une mesure.',
  } satisfies OrigineValeur,
  fictif: true,
  tauxImpactMoyen: 0.13,
  origineTaux: {
    organisme: 'Calculé par la plateforme sur les marchés de démonstration',
    reference: 'Part moyenne de l’impact monétisé, énergie comptée au résidu, dans le montant des marchés',
    releveLe: '2026-08-16',
    verifieParAppel: false,
  } satisfies OrigineValeur,
} as const;

/** Ce que le barème ne fait pas. Affiché sur /fr/bareme, pas seulement écrit ici. */
export const CE_QUE_LE_BAREME_NE_FAIT_PAS = [
  'Il ne note aucune entreprise.',
  'Il ne classe aucune entreprise.',
  'Il ne s’applique pas hors du contexte d’un marché.',
  'Il ne produit aucune appréciation : il applique une règle publiée à des quantités déclarées ou forfaitaires.',
] as const;

// ---------------------------------------------------------------------------
// 9. Interdits, tenus par le code
// ---------------------------------------------------------------------------

/**
 * Arrondi qui préserve l'ordre de grandeur.
 *
 * `Math.round` sur une valeur inférieure à 1 renvoie 0 et fait disparaître la
 * ligne. On garde donc toujours deux chiffres significatifs.
 */
export function arrondiSignifiant(valeur: number, significatifs = 2): number {
  if (valeur === 0 || !Number.isFinite(valeur)) return valeur;
  const ordre = Math.floor(Math.log10(Math.abs(valeur)));
  const facteur = 10 ** (significatifs - 1 - ordre);
  return Math.round(valeur * facteur) / facteur;
}

/**
 * Il n'existe volontairement dans ce module :
 *   — aucune fonction qui agrège des indicateurs en un nombre unique ;
 *   — aucune fonction de rang sur les entreprises ;
 *   — aucune conversion carbone applicable aux indicateurs personnels de
 *     /fr/impact, que l'application a explicitement choisi de ne pas faire.
 *
 * Ces absences sont vérifiées par regles-achats.test.ts, qui lit ce fichier.
 */
export const INTERDITS_TENUS = [
  'aucune agrégation d’indicateurs en un nombre unique',
  'aucune fonction de rang sur les entreprises',
  'aucun arrondi qui masque un ordre de grandeur',
  'aucune conversion carbone imposée sur les indicateurs personnels',
  'aucun filtre ni pondération sur un pays d’origine',
] as const;
