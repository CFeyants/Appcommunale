/**
 * Le tri du fil.
 *
 * Transparent, déterministe, explicable en une phrase à l'écran. Pas de modèle
 * appris. Deux profils déclarés identiques produisent exactement le même ordre.
 *
 * Le score n'est jamais caché : la pastille de pertinence l'affiche, la carte
 * porte la raison de sa présence, et /fr/classement montre les poids. Un score
 * qu'on ne peut pas voir serait un classement déguisé.
 */

import type { Item } from './schemas';
import { RANG_NIVEAU, type Niveau, type Theme } from './vocabulaires';

/** Poids visibles dans l'interface et exportés dans le JSON de chaque écran. */
export const POIDS = {
  theme: 40,
  public: 20,
  territoire: 25,
  action: 10,
  echeance: 15,
} as const;

export type Poids = typeof POIDS;

export interface ProfilPertinence {
  /** Thèmes déclarés, par niveau. La grille à deux entrées de l'étape 1. */
  abonnements: Partial<Record<Niveau, Theme[]>>;
  /** Publics déclarés par l'utilisateur au titre du consentement A, sinon vide. */
  publics: string[];
  /** Niveau du territoire de résidence — la commune passe avant l'Union. */
  niveauResidence: Niveau;
  /**
   * Centres d'intérêt déduits (consentement B). Vide tant que le consentement
   * n'est pas donné. Chaque attribut est effaçable un par un.
   */
  interetsDeduits: Theme[];
}

export interface ScoreDetail {
  total: number;
  parts: { theme: number; public: number; territoire: number; action: number; echeance: number };
  /** Phrase affichée sur la carte : « parce que vous avez déclaré … ». */
  raison: string;
  /** true si un intérêt déduit a compté, pour pouvoir l'afficher distinctement. */
  viaInteretDeduit: boolean;
}

function recouvrement(a: readonly string[], b: readonly string[]): number {
  if (a.length === 0 || b.length === 0) return 0;
  const set = new Set(b);
  const communs = a.filter((x) => set.has(x)).length;
  return communs / a.length;
}

/** Décroissance linéaire sur 30 jours. Une échéance passée ne vaut plus rien. */
function urgence(echeance: string | undefined, maintenant: Date): number {
  if (!echeance) return 0;
  const jours = (new Date(echeance).getTime() - maintenant.getTime()) / 86_400_000;
  if (jours < 0 || jours > 30) return 0;
  return 1 - jours / 30;
}

function proximite(niveauItem: Niveau, niveauResidence: Niveau): number {
  const ecart = Math.abs(RANG_NIVEAU[niveauItem] - RANG_NIVEAU[niveauResidence]);
  return Math.max(0, 1 - ecart / 4);
}

/**
 * Les seuls champs qui entrent dans le score.
 *
 * Le type est réduit exprès : il rend visible, dans la signature, que ni le
 * texte de l'acte, ni sa source, ni son auteur ne pèsent sur l'ordre. Il
 * permet aussi d'ordonner une projection allégée sans la reconstituer.
 */
export type ItemScorable = Pick<Item, 'id' | 'niveau' | 'themes' | 'publics' | 'action' | 'echeance' | 'dateActe'>;

export function scorer(item: ItemScorable, profil: ProfilPertinence, maintenant = new Date()): ScoreDetail {
  const themesDeclares = profil.abonnements[item.niveau] ?? [];
  const recTheme = recouvrement(item.themes, themesDeclares);
  const recDeduit = profil.interetsDeduits.length > 0 ? recouvrement(item.themes, profil.interetsDeduits) : 0;
  // Un intérêt déduit ne peut jamais peser plus qu'un thème déclaré : il vaut
  // la moitié. La déclaration reste souveraine (§ 2.2).
  const partTheme = POIDS.theme * Math.max(recTheme, recDeduit * 0.5);

  const partPublic = POIDS.public * recouvrement(item.publics, profil.publics);
  const partTerritoire = POIDS.territoire * proximite(item.niveau, profil.niveauResidence);
  const partAction = POIDS.action * (item.action.kind !== 'aucune_action' ? 1 : 0);
  const partEcheance = POIDS.echeance * urgence(item.echeance, maintenant);

  const parts = {
    theme: partTheme,
    public: partPublic,
    territoire: partTerritoire,
    action: partAction,
    echeance: partEcheance,
  };
  const total = Math.round(partTheme + partPublic + partTerritoire + partAction + partEcheance);

  const raisons: string[] = [];
  const viaInteretDeduit = recDeduit * 0.5 > recTheme && recTheme === 0;
  if (recTheme > 0) {
    const communs = item.themes.filter((t) => themesDeclares.includes(t));
    raisons.push(`vous avez déclaré ${communs.map(libelleTheme).join(' et ')}`);
  } else if (viaInteretDeduit) {
    raisons.push('un centre d’intérêt déduit de vos consultations correspond');
  }
  if (partTerritoire >= POIDS.territoire) raisons.push('la décision concerne votre commune');
  else if (partTerritoire > 0) raisons.push(`la décision est prise au niveau ${libelleNiveau(item.niveau)}`);
  if (partEcheance > 0) raisons.push('une échéance approche');
  if (partPublic > 0) raisons.push('elle vise un public que vous avez déclaré');

  return {
    total,
    parts,
    raison: raisons.length > 0 ? `Parce que ${raisons.join(', et que ')}.` : 'Décision à impact général sur votre territoire.',
    viaInteretDeduit,
  };
}

/**
 * Ordonne le fil. Le tri est stable : à score égal, le plus récent d'abord,
 * puis l'identifiant. Deux exécutions donnent donc strictement le même ordre.
 */
export function ordonner<T extends ItemScorable>(items: T[], profil: ProfilPertinence, maintenant = new Date()) {
  return items
    .map((item) => ({ item, score: scorer(item, profil, maintenant) }))
    .sort(
      (a, b) =>
        b.score.total - a.score.total ||
        b.item.dateActe.localeCompare(a.item.dateActe) ||
        a.item.id.localeCompare(b.item.id),
    );
}

export const LIBELLES_THEMES_FR: Record<Theme, string> = {
  'mobilite-voirie': 'mobilité et voirie',
  logement: 'logement',
  'enfance-ecole': 'enfance et école',
  'sante-soins': 'santé et soins',
  aines: 'aînés',
  'environnement-energie': 'environnement et énergie',
  'taxes-budget': 'taxes et budget',
  'emploi-entreprises': 'emploi et entreprises',
  'culture-sport': 'culture et sport',
  securite: 'sécurité',
  'aides-droits-sociaux': 'aides et droits sociaux',
  urbanisme: 'urbanisme',
};

function libelleTheme(t: Theme): string {
  return LIBELLES_THEMES_FR[t] ?? t;
}

const LIBELLE_NIVEAU_FR: Record<Niveau, string> = {
  commune: 'communal',
  communaute: 'de la communauté',
  region: 'régional',
  belgique: 'fédéral',
  europe: 'européen',
};

function libelleNiveau(n: Niveau): string {
  return LIBELLE_NIVEAU_FR[n];
}

/** Phrase unique affichée à côté du bouton de tri (§ 2.2). */
export const PHRASE_DE_TRI =
  'Trié par ce que vous avez déclaré suivre, puis par proximité du niveau de pouvoir, puis par échéance proche.';
