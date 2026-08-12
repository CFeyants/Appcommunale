/**
 * Le modèle de données, en Zod. Les types TypeScript en sont dérivés : il ne
 * peut donc pas y avoir de dérive entre ce qui est validé et ce qui est typé.
 *
 * Chaque schéma cite le terme OSLO dont il dérive, ou renvoie à
 * /docs/vocabulaire.md quand aucun terme normalisé ne convenait.
 *
 * Règle d'architecture : un connecteur ne produit que des objets validés ici.
 * Toute donnée non conforme est rejetée avec un journal explicite — jamais
 * réparée en silence.
 */

import { z } from 'zod';
import { OSLO } from './oslo';
import {
  CATEGORIES,
  ETATS_INITIATIVE,
  LANGUES_ACTE,
  MOTIFS_EXCLUSION,
  NIVEAUX,
  STATUTS,
  THEMES,
} from './vocabulaires';

const iso = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}(T[\d:.+\-Z]+)?$/, 'date ISO 8601 attendue (AAAA-MM-JJ)');

// ---------------------------------------------------------------------------
// Source — obligatoire partout. Règle 1 : aucune information sans source.
// dcterms:source, dcterms:license, dcterms:publisher, prov:generatedAtTime
// ---------------------------------------------------------------------------

export const SourceSchema = z.object({
  /** dcterms:publisher — l'organisme qui émet, pas celui qui relaie. */
  organisme: z.string().min(2),
  /** dcterms:source — lien direct vers l'acte, pas vers une page d'accueil. */
  url: z.string().url(),
  /** dcterms:issued — date de la donnée elle-même. */
  dateDonnee: iso,
  /** dcterms:license — intitulé exact de la licence, jamais « libre ». */
  licence: z.string().min(2),
  /** prov:generatedAtTime — quand la plateforme a lu cette source. */
  consulteLe: iso,
  /** Identifiant amont, pour pouvoir remonter à l'objet d'origine. */
  identifiantAmont: z.string().optional(),
});
export type Source = z.infer<typeof SourceSchema>;

// ---------------------------------------------------------------------------
// Reformulation — extension pc:Reformulation.
// § 9 : le champ `impact` est rédigé par un humain. Un modèle de langage peut
// proposer ; il ne publie jamais. Toute reformulation publiée porte qui l'a
// validée et quand.
// ---------------------------------------------------------------------------

export const ReformulationSchema = z.object({
  /** Qui a validé. Une fonction ou un pseudonyme, jamais « IA » seul. */
  validePar: z.string().min(2),
  valideLe: iso,
  /** true si un modèle de langage a produit la proposition initiale. */
  assisteeParModele: z.boolean(),
});
export type Reformulation = z.infer<typeof ReformulationSchema>;

// ---------------------------------------------------------------------------
// Admission — extension pc:Admission.
// Aucun item n'est supprimé : `publie: false` le sort des vues principales,
// pas du registre ni de l'export.
// ---------------------------------------------------------------------------

export const AdmissionSchema = z.object({
  publie: z.boolean(),
  /** Renseigné si et seulement si publie === false. */
  motif: z.enum(MOTIFS_EXCLUSION).optional(),
  /** Les trois questions du test, tracées une par une. */
  aUnActe: z.boolean(),
  changeQuelqueChose: z.boolean(),
  actionRenseignee: z.boolean(),
  evalueLe: iso,
});
export type Admission = z.infer<typeof AdmissionSchema>;

// ---------------------------------------------------------------------------
// Action — jamais vide. `aucune_action` est une valeur, et l'écrire est déjà
// un service rendu.
// ---------------------------------------------------------------------------

export const ActionSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('aucune_action'), explication: z.string().min(10) }),
  z.object({
    kind: z.literal('demarche'),
    libelle: z.string().min(3),
    url: z.string().url(),
    /** Délai légal de traitement quand il en existe un, sinon absent. */
    delaiLegalJours: z.number().int().positive().optional(),
  }),
  z.object({
    kind: z.literal('consultation'),
    libelle: z.string().min(3),
    url: z.string().url(),
    clotureLe: iso,
  }),
  z.object({
    kind: z.literal('seance'),
    libelle: z.string().min(3),
    date: iso,
    lieu: z.string().min(2),
    inscriptionUrl: z.string().url().optional(),
  }),
  z.object({
    kind: z.literal('demande'),
    /** Clé dans la table de compétences — voir competences.ts. */
    destinataireId: z.string().min(2),
  }),
]);
export type Action = z.infer<typeof ActionSchema>;

// ---------------------------------------------------------------------------
// Territoire — besluit:Bestuurseenheid pour le niveau communal.
// ---------------------------------------------------------------------------

export const TerritoireSchema = z.object({
  /** Code NIS pour une commune belge, code ISO pour un pays, "EU" pour l'Union. */
  code: z.string().min(2),
  nom: z.string().min(2),
  niveau: z.enum(NIVEAUX),
  /** IRI besluit:Bestuurseenheid quand elle existe. */
  iri: z.string().url().optional(),
});
export type Territoire = z.infer<typeof TerritoireSchema>;

// ---------------------------------------------------------------------------
// Item — l'unité de la plateforme.
// Dérive de besluit:Besluit quand l'objet est une décision locale flamande, et
// de eli:LegalResource pour les niveaux supérieurs. Les deux partagent : un
// acte identifié, une date, un émetteur, un texte.
// ---------------------------------------------------------------------------

export const ItemSchema = z
  .object({
    id: z.string().min(4),
    /** OSLO : besluit:Besluit | eli:LegalResource selon `origine.vocabulaire`. */
    typeOslo: z.string().url(),
    niveau: z.enum(NIVEAUX),
    territoireCode: z.string().min(2),
    categorie: z.enum(CATEGORIES),

    /** Titre en français ordinaire, 90 caractères au plus. Jamais l'intitulé administratif. */
    titre: z.string().min(5).max(90),
    /** Intitulé juridique d'origine, conservé tel quel. § 11 : on ne traduit pas sans montrer. */
    titreOrigine: z.string().min(1),
    langueOrigine: z.enum(LANGUES_ACTE),

    /** Ce qui change · pour qui · à partir de quand. Rédigé par un humain. */
    impact: z.string().min(20).max(400),
    action: ActionSchema,

    themes: z.array(z.enum(THEMES)).max(4),
    /** Publics concernés, vocabulaire libre mais court. */
    publics: z.array(z.string().min(3)).max(6).default([]),

    /** Texte intégral publié par l'autorité, dans sa langue. Vide si l'autorité ne le publie pas. */
    texteOrigine: z.string().default(''),

    dateActe: iso,
    entreeEnVigueur: iso.optional(),
    echeance: iso.optional(),
    /** true seulement si l'acte a été adopté. Un ordre du jour ne l'est jamais. */
    adoptee: z.boolean(),

    source: SourceSchema,
    admission: AdmissionSchema,
    /** Absent tant que personne n'a reformulé : l'item vit alors dans le registre seul. */
    reformulation: ReformulationSchema.optional(),

    objectifsLies: z.array(z.string()).default([]),
    itemsLies: z.array(z.string()).default([]),
    /** Identifiant de la séance d'origine, pour le groupement du registre. */
    seanceId: z.string().optional(),
  })
  .superRefine((item, ctx) => {
    // § 16 — « Ne présente jamais un ordre du jour comme une décision adoptée. »
    if (item.adoptee && new Date(item.dateActe).getTime() > Date.now()) {
      ctx.addIssue({
        code: 'custom',
        path: ['adoptee'],
        message: 'un acte adopté ne peut pas porter une date future — dates incohérentes à la source',
      });
    }
    // Cohérence du test d'admission : un item publié a passé les trois questions.
    if (item.admission.publie) {
      const { aUnActe, changeQuelqueChose, actionRenseignee } = item.admission;
      if (!(aUnActe && changeQuelqueChose && actionRenseignee)) {
        ctx.addIssue({
          code: 'custom',
          path: ['admission'],
          message: 'publie: true exige les trois oui du test d’admission',
        });
      }
      if (!item.reformulation) {
        ctx.addIssue({
          code: 'custom',
          path: ['reformulation'],
          message: 'un item publié porte une reformulation validée par un humain (§ 9)',
        });
      }
    } else if (!item.admission.motif) {
      ctx.addIssue({
        code: 'custom',
        path: ['admission', 'motif'],
        message: 'un item non publié doit porter son motif d’exclusion',
      });
    }
    // Cohérence des dates : on affiche l'incohérence, on ne la calcule pas.
    if (item.echeance && item.entreeEnVigueur && item.echeance < item.entreeEnVigueur) {
      ctx.addIssue({
        code: 'custom',
        path: ['echeance'],
        message: 'dates incohérentes à la source : échéance antérieure à l’entrée en vigueur',
      });
    }
  });
export type Item = z.infer<typeof ItemSchema>;

// ---------------------------------------------------------------------------
// Seance — besluit:Zitting
// ---------------------------------------------------------------------------

export const SeanceSchema = z.object({
  id: z.string().min(4),
  typeOslo: z.literal(OSLO.ZITTING),
  territoireCode: z.string().min(2),
  /** besluit:Bestuursorgaan — « college van burgemeester en schepenen », etc. */
  organe: z.string().min(2),
  organeIri: z.string().url().optional(),
  debutPrevu: iso.optional(),
  debut: iso.optional(),
  fin: iso.optional(),
  nombrePoints: z.number().int().nonnegative(),
  source: SourceSchema,
});
export type Seance = z.infer<typeof SeanceSchema>;

// ---------------------------------------------------------------------------
// Objectif — extension pc:Objectif (aucun terme OSLO ne couvre une cible
// chiffrée et datée rattachée à un objectif de niveau supérieur).
// ---------------------------------------------------------------------------

export const MesureSchema = z.object({
  valeur: z.number(),
  dateMesure: iso,
  source: SourceSchema,
});
export type Mesure = z.infer<typeof MesureSchema>;

export const ObjectifSchema = z.object({
  id: z.string().min(3),
  typeOslo: z.literal(OSLO.PC_OBJECTIF),
  niveau: z.enum(NIVEAUX),
  territoireCode: z.string().min(2),
  /** Les deux horizons ne se mélangent jamais (§ 6). */
  horizon: z.enum(['long', 'mandature']),
  intitule: z.string().min(10).max(160),
  intituleOrigine: z.string().min(1),
  langueOrigine: z.enum(LANGUES_ACTE),
  cible: z
    .object({ valeur: z.number(), unite: z.string().min(1), echeance: iso })
    .optional(),
  /** Série des mesures dans le temps : la trajectoire, pas seulement la cible. */
  trajectoire: z.array(MesureSchema).default([]),
  prochaineMesure: iso.optional(),
  statut: z.enum(STATUTS),
  /** ids d'objectifs de niveau supérieur. Un tableau vide est une information. */
  rattachements: z.array(z.string()).default([]),
  /** Comment cette vision a été définie — § 6. */
  genese: z
    .object({
      proposePar: z.string().optional(),
      procedure: z.string().optional(),
      consultes: z.array(z.string()).default([]),
      votePar: z.string().optional(),
      voteLe: iso.optional(),
      deliberationUrl: z.string().url().optional(),
    })
    .optional(),
  source: SourceSchema,
});
export type Objectif = z.infer<typeof ObjectifSchema>;

// ---------------------------------------------------------------------------
// Initiative — extension pc:Initiative.
// § 5.2 : jalons datés, jamais un pourcentage d'avancement inventé, et jamais
// le nom d'un agent — une fonction responsable.
// ---------------------------------------------------------------------------

export const JalonSchema = z.object({
  libelle: z.string().min(3),
  datePrevue: iso.optional(),
  dateReelle: iso.optional(),
  source: SourceSchema.optional(),
});

export const InitiativeSchema = z.object({
  id: z.string().min(3),
  typeOslo: z.literal(OSLO.PC_INITIATIVE),
  niveau: z.enum(NIVEAUX),
  territoireCode: z.string().min(2),
  intitule: z.string().min(5).max(120),
  /** Une fonction et un service. Jamais un nom de personne. */
  serviceResponsable: z.string().min(2),
  fonctionResponsable: z.string().min(2),
  etat: z.enum(ETATS_INITIATIVE),
  jalons: z.array(JalonSchema).default([]),
  budgetVoteEur: z.number().nonnegative().optional(),
  budgetConsommeEur: z.number().nonnegative().optional(),
  prochaineEcheance: iso.optional(),
  objectifsLies: z.array(z.string()).default([]),
  themes: z.array(z.enum(THEMES)).max(4).default([]),
  source: SourceSchema,
});
export type Initiative = z.infer<typeof InitiativeSchema>;

// ---------------------------------------------------------------------------
// Budget — aucun vocabulaire OSLO. Aligné sur la nomenclature BBC flamande,
// conservée non retraitée pour que l'explication au clic soit vérifiable.
// ---------------------------------------------------------------------------

export const LigneBudgetSchema = z.object({
  code: z.string().min(1),
  /** Libellé en français ordinaire. */
  libelle: z.string().min(2),
  /** Nomenclature d'origine, non retraitée. Affichée telle quelle au clic. */
  libelleOrigine: z.string().min(1),
  voteEur: z.number(),
  engageEur: z.number().optional(),
  executeEur: z.number().optional(),
  /** Ce que la ligne recouvre exactement. Affiché dans le panneau d'explication. */
  recouvre: z.string().min(20),
  /** Ce que le chiffre ne dit pas. Obligatoire : c'est la moitié de l'honnêteté. */
  neDitPas: z.string().min(20),
  /** true si la commune décide seule de cette ligne. */
  decisionLocale: z.boolean(),
  source: SourceSchema,
});
export type LigneBudget = z.infer<typeof LigneBudgetSchema>;

export const BudgetSchema = z.object({
  id: z.string().min(3),
  niveau: z.enum(NIVEAUX),
  territoireCode: z.string().min(2),
  exercice: z.number().int().min(2000).max(2100),
  populationRef: z.number().int().positive(),
  totalEur: z.number(),
  lignes: z.array(LigneBudgetSchema).min(1),
  /** Illustratif tant qu'aucune source réelle n'alimente l'exercice. */
  illustratif: z.boolean(),
  source: SourceSchema,
});
export type Budget = z.infer<typeof BudgetSchema>;

// ---------------------------------------------------------------------------
// Graphique — § 5.1 : aucun graphique ne part en production sans son
// explication écrite. Le schéma l'impose, un test le vérifie.
// ---------------------------------------------------------------------------

export const ExplicationGraphiqueSchema = z.object({
  montre: z.string().min(20),
  neMontrePas: z.string().min(20),
  decisionLocale: z.string().min(10),
  prochaineMesure: z.string().min(4),
});
export type ExplicationGraphique = z.infer<typeof ExplicationGraphiqueSchema>;

// ---------------------------------------------------------------------------
// Droit — la plateforme n'écrit jamais « vous y avez droit ».
// CPSV-AP : cpsv:PublicService + cpsv:Rule pour les conditions.
// ---------------------------------------------------------------------------

export const ConditionSchema = z.object({
  id: z.string().min(2),
  /** cpsv:Rule — énoncé de la condition, avec sa source propre. */
  enonce: z.string().min(10),
  source: SourceSchema,
});

export const DroitSchema = z.object({
  id: z.string().min(3),
  typeOslo: z.literal(OSLO.SERVICE_PUBLIC),
  intitule: z.string().min(5).max(120),
  intituleOrigine: z.string().min(1),
  langueOrigine: z.enum(LANGUES_ACTE),
  niveau: z.enum(NIVEAUX),
  territoireCode: z.string().min(2),
  conditions: z.array(ConditionSchema).min(1),
  /** Toujours « indicatif ». Jamais un calcul ferme. */
  montantIndicatif: z.string().optional(),
  automatique: z.boolean(),
  demarche: z
    .object({
      libelle: z.string().min(3),
      url: z.string().url(),
      delaiLegalJours: z.number().int().positive().optional(),
      piecesAFournir: z.array(z.string()).default([]),
      coutEur: z.number().nonnegative().optional(),
    })
    .optional(),
  source: SourceSchema,
});
export type Droit = z.infer<typeof DroitSchema>;

// ---------------------------------------------------------------------------
// Service au citoyen — gabarit bornin.brussels, adossé à CPSV-AP.
// ---------------------------------------------------------------------------

export const ServiceSchema = z.object({
  id: z.string().min(3),
  typeOslo: z.literal(OSLO.SERVICE_PUBLIC),
  /** Le nom en capitales de la fiche. */
  nom: z.string().min(2),
  /** Le nom usuel, entre parenthèses sous le titre. */
  nomUsuel: z.string().optional(),
  categorie: z.enum(['familles', 'jeunes', 'culture-sport', 'entraide', 'sante', 'commerce', 'transport']),
  territoireCode: z.string().min(2),
  coordonnees: z.object({
    adresse: z.string().optional(),
    telephone: z.string().optional(),
    site: z.string().url().optional(),
    courriel: z.string().email().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  }),
  /** Ce que le lieu fait, service par service, chacun nommé. */
  aPropos: z.array(z.string().min(3)).default([]),
  /** Les bénéficiaires, dits sans détour. */
  pourQui: z.array(z.string().min(3)).default([]),
  /** Les horaires réels, « uniquement sur rendez-vous » compris. */
  permanence: z.array(z.string().min(2)).default([]),
  themes: z.array(z.enum(THEMES)).max(4).default([]),
  source: SourceSchema,
});
export type Service = z.infer<typeof ServiceSchema>;

// ---------------------------------------------------------------------------
// Entreprise — identité réelle, chiffres environnementaux jamais estimés.
// org:FormalOrganization / organisatie:Organisatie
// ---------------------------------------------------------------------------

export const DeclarationEntrepriseSchema = z.object({
  /** Signée par l'entreprise elle-même. La plateforme est le porte-voix. */
  signataire: z.string().min(2),
  dateDeclaration: iso,
  perimetre: z.array(z.enum(['scope1', 'scope2', 'scope3'])).min(1),
  methode: z.string().min(3),
  emissionsTotalesTCO2e: z.number().nonnegative(),
  unitesVendues: z.number().positive().optional(),
  uniteLibelle: z.string().optional(),
  objectifPropre: z.string().optional(),
  source: SourceSchema,
});

export const EntrepriseSchema = z.object({
  /** Numéro d'entreprise BCE, format 0XXX.XXX.XXX. */
  numeroEntreprise: z.string().regex(/^\d{4}\.\d{3}\.\d{3}$/),
  typeOslo: z.literal(OSLO.FORMAL_ORGANIZATION),
  denomination: z.string().min(1),
  formeJuridique: z.string().optional(),
  adresse: z.string().optional(),
  codesActivite: z.array(z.string()).default([]),
  territoireCode: z.string().min(2),
  /** Absent dans l'immense majorité des cas, et c'est le message de l'écran. */
  declaration: DeclarationEntrepriseSchema.optional(),
  /** Faits établis seulement : études publiées, décisions de justice définitives. */
  faitsSociaux: z
    .array(z.object({ enonce: z.string().min(10), source: SourceSchema }))
    .default([]),
  source: SourceSchema,
});
export type Entreprise = z.infer<typeof EntrepriseSchema>;

// ---------------------------------------------------------------------------
// Projet d'épargne longue — § 8.1.
// ---------------------------------------------------------------------------

export const ProjetSchema = z.object({
  id: z.string().min(3),
  intitule: z.string().min(5).max(120),
  porteur: z.string().min(2),
  /** Un projet sans rattachement à un objectif n'entre pas. */
  objectifServiId: z.string().min(3),
  horizonAnnees: z.number().int().min(5),
  /** Agrément FSMA / règlement (UE) 2020/1503, ou coopérative citoyenne identifiée. */
  agrement: z.object({
    type: z.enum(['fsma-2020-1503', 'cooperative-citoyenne']),
    reference: z.string().min(2),
    url: z.string().url(),
  }),
  /** Rendement observé, jamais le plafond légal. */
  rendementObserve: z
    .array(z.object({ annee: z.number().int(), tauxPct: z.number(), source: SourceSchema }))
    .default([]),
  tripleComptabilite: z.object({
    economique: z.string().min(10),
    social: z.string().min(10),
    environnemental: z.string().min(10),
  }),
  urlSortante: z.string().url(),
  source: SourceSchema,
});
export type Projet = z.infer<typeof ProjetSchema>;

// ---------------------------------------------------------------------------
// Question publique et proposition citoyenne — § 5.3 et § 5.4.
// ---------------------------------------------------------------------------

export const QuestionSchema = z.object({
  id: z.string().min(3),
  initiativeId: z.string().optional(),
  texte: z.string().min(10).max(1000),
  posesLe: iso,
  /** Compteur de personnes, jamais un score. */
  memeQuestion: z.number().int().nonnegative().default(0),
  /** Modération humaine, datée, motivée. Aucun refus automatique définitif. */
  moderation: z.object({
    etat: z.enum(['en-attente', 'publiee', 'ecartee']),
    decidePar: z.string().optional(),
    decideLe: iso.optional(),
    motif: z.string().optional(),
    recoursOuvertJusquau: iso.optional(),
  }),
  reponse: z
    .object({
      texte: z.string().min(10),
      /** Signée par une fonction, jamais par un nom. */
      fonctionSignataire: z.string().min(2),
      publieeLe: iso,
    })
    .optional(),
  /** Délai légal de réponse quand il en existe un. */
  delaiLegalJours: z.number().int().positive().optional(),
  groupeeAvec: z.array(z.string()).default([]),
});
export type Question = z.infer<typeof QuestionSchema>;

export const PropositionSchema = z.object({
  id: z.string().min(3),
  titre: z.string().min(5).max(120),
  expose: z.string().min(20),
  deposeeLe: iso,
  territoireCode: z.string().min(2),
  themes: z.array(z.enum(THEMES)).max(4).default([]),
  /** Un soutien n'est pas une signature légale. Le libellé est imposé à l'écran. */
  soutiens: z.number().int().nonnegative().default(0),
  moderation: QuestionSchema.shape.moderation,
});
export type Proposition = z.infer<typeof PropositionSchema>;

/**
 * Règlement de participation communal — art. 304 §5 du Decreet Lokaal Bestuur.
 * C'est ce règlement, pas la plateforme, qui fixe le seuil.
 */
export const ReglementParticipationSchema = z.object({
  territoireCode: z.string().min(2),
  adopte: z.boolean(),
  /** Renseignés seulement si adopte === true. */
  seuilSignatures: z.number().int().positive().optional(),
  conditions: z.array(z.string()).default([]),
  texteUrl: z.string().url().optional(),
  adopteLe: iso.optional(),
  /** Le canal officiel de dépôt, que la plateforme prépare sans s'y substituer. */
  canalDepot: z.string().optional(),
  source: SourceSchema,
});
export type ReglementParticipation = z.infer<typeof ReglementParticipationSchema>;

// ---------------------------------------------------------------------------
// Signalement — § 8.3. La plateforme n'achemine pas ; elle mesure le délai.
// ---------------------------------------------------------------------------

export const SignalementSchema = z.object({
  id: z.string().min(3),
  qualification: z.enum(['voirie', 'eclairage', 'proprete', 'espaces-verts', 'mobilier', 'autre']),
  description: z.string().min(10).max(600),
  latitude: z.number(),
  longitude: z.number(),
  creeLe: iso,
  /** L'utilisateur déclare avoir envoyé le document par le canal officiel. */
  envoyeLe: iso.optional(),
  canalOfficiel: z.string().min(3),
  delaiLegalJours: z.number().int().positive().optional(),
  /** Réponse à la relance de J+30. C'est la seule donnée que personne ne produit. */
  suivi: z
    .object({
      demandeLe: iso,
      traite: z.boolean().optional(),
      constateLe: iso.optional(),
    })
    .optional(),
});
export type Signalement = z.infer<typeof SignalementSchema>;

// ---------------------------------------------------------------------------
// Indicateur — extension pc:Indicateur, aligné sur qb:Observation.
// Étiqueté « indicateur proposé » tant qu'aucune autorité ne l'a repris.
// ---------------------------------------------------------------------------

export const IndicateurSchema = z.object({
  id: z.string().min(3),
  famille: z.enum(['environnement', 'social']),
  intitule: z.string().min(5).max(140),
  unite: z.string().min(1),
  territoireCode: z.string().min(2),
  /** true tant qu'aucune autorité n'a repris l'indicateur à son compte. */
  propose: z.boolean(),
  serie: z.array(z.object({ periode: z.string().min(4), valeur: z.number().nullable() })).default([]),
  seuil: z.object({ valeur: z.number(), libelle: z.string() }).optional(),
  statut: z.enum(STATUTS),
  /** Quand la donnée n'existe pas : qui devrait la produire, et depuis quand. */
  absence: z
    .object({
      organismeAttendu: z.string().min(2),
      nonMesureDepuis: z.string().min(4),
      explication: z.string().min(10),
    })
    .optional(),
  explication: ExplicationGraphiqueSchema,
  source: SourceSchema.optional(),
});
export type Indicateur = z.infer<typeof IndicateurSchema>;

// ---------------------------------------------------------------------------
// État d'un connecteur — la page « État des sources » (§ 10).
// Une plateforme de transparence qui cache ses propres pannes se contredit.
// ---------------------------------------------------------------------------

export const EtatSourceSchema = z.object({
  connecteur: z.string().min(2),
  libelle: z.string().min(2),
  organisme: z.string().min(2),
  licence: z.string().min(2),
  endpoint: z.string(),
  cadence: z.string().min(2),
  derniereCollecteReussie: iso.nullable(),
  derniereTentative: iso.nullable(),
  nombreItems: z.number().int().nonnegative(),
  etat: z.enum(['ok', 'degrade', 'panne', 'non-branche']),
  /** Renseigné dès que etat !== 'ok'. Le mode dégradé est explicite. */
  raison: z.string().optional(),
  limitesConnues: z.array(z.string()).default([]),
});
export type EtatSource = z.infer<typeof EtatSourceSchema>;
