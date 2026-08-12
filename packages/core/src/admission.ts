/**
 * Le test d'admission (§ 9).
 *
 * Ce n'est pas une consigne éditoriale : c'est une validation exécutée à
 * l'ingestion. Un item qui échoue à l'une des trois questions n'est pas
 * supprimé — il reçoit `publie: false` et son motif, reste dans le registre et
 * dans l'export, et sort des vues principales.
 *
 * Les trois questions :
 *   1. Y a-t-il un acte derrière ?
 *   2. Est-ce que cela change quelque chose pour quelqu'un ?
 *   3. Y a-t-il quelque chose à faire, ou rien ?
 */

import type { Admission, Item } from './schemas';
import type { MotifExclusion, Niveau } from './vocabulaires';
import { PLAFOND_MENSUEL } from './vocabulaires';

/**
 * Motifs détectables sur le seul intitulé d'origine, en néerlandais et en
 * français. Chaque entrée est testée dans admission.test.ts.
 *
 * Ces expressions viennent de la lecture des besluitenlijsten réelles de
 * Kraainem : ce sont les formulations qui reviennent, pas des suppositions.
 */
const MOTIFS_PAR_INTITULE: ReadonlyArray<{ motif: MotifExclusion; motifs: RegExp }> = [
  {
    motif: 'approbation-proces-verbal',
    motifs:
      /\b(goedkeuring|goedkeuren)\s+(van\s+)?(de\s+)?(notulen|verslag)\b|\bprocès[-\s]verbal\b|\bapprobation du procès/i,
  },
  {
    motif: 'fixation-ordre-du-jour',
    motifs: /\b(vaststelling|vaststellen)\s+(van\s+)?(de\s+)?agenda\b|\bordre du jour\b|\bdagorde\b/i,
  },
  {
    motif: 'acte-personnel-individuel',
    motifs:
      /\b(aanstelling|aanwerving|ontslag|pensionering|loopbaanonderbreking|verlof|vakantie|ziekteverlof|arbeidsongeval|benoeming)\b|\bpersoneel\s*[-–]\s*/i,
  },
  {
    motif: 'marche-fournitures-internes-sous-seuil',
    motifs: /\b(facturen|aankoop\s+van\s+(kantoor|bureau)|bestelbon|kleine\s+aankopen)\b/i,
  },
  {
    motif: 'autorisation-individuelle-sans-effet-tiers',
    motifs:
      /\b(inname\s+openbaar\s+domein|parkeerverbod\s+verhuis|signalisatievergunning|individuele\s+vergunning|afleveren\s+van\s+een\s+attest)\b/i,
  },
  {
    motif: 'acte-pure-procedure',
    motifs:
      /\b(kennisname|kennisgeving|akteneming|mededeling(en)?|briefwisseling|varia|rondvraag|verdaging|opening\s+van\s+de\s+zitting|sluiting\s+van\s+de\s+zitting)\b/i,
  },
];

export interface EntreeAdmission {
  /** Intitulé d'origine, non traduit. C'est sur lui que porte la détection. */
  titreOrigine: string;
  /** true si un besluit (acte) est rattaché au point, false pour un simple point d'agenda. */
  aResolution: boolean;
  /** Renseigné seulement quand un humain a rédigé l'impact. */
  impact?: string;
  /** Renseignée seulement quand l'action a été qualifiée. */
  actionRenseignee: boolean;
}

export interface ResultatAdmission {
  admission: Admission;
  /** Explication lisible, affichée dans l'onglet « écartés » du registre. */
  explication: string;
}

/**
 * Évalue les trois questions. Le résultat est déterministe : deux appels avec
 * la même entrée donnent le même verdict, ce qui rend le filtre auditable.
 */
export function evaluerAdmission(entree: EntreeAdmission, maintenant = new Date()): ResultatAdmission {
  const evalueLe = maintenant.toISOString().slice(0, 10);
  const titre = entree.titreOrigine.trim();

  // Question 1 — y a-t-il un acte derrière ?
  const aUnActe = entree.aResolution && titre.length > 0;
  if (!aUnActe) {
    return {
      admission: { publie: false, motif: 'sans-acte', aUnActe: false, changeQuelqueChose: false, actionRenseignee: false, evalueLe },
      explication: "Point d'agenda sans acte rattaché : la source ne publie aucune décision pour ce point.",
    };
  }

  // Question 2 — est-ce que cela change quelque chose pour quelqu'un ?
  // On écarte d'abord les formes qui, par nature, ne changent rien pour un tiers.
  for (const regle of MOTIFS_PAR_INTITULE) {
    if (regle.motifs.test(titre)) {
      return {
        admission: { publie: false, motif: regle.motif, aUnActe: true, changeQuelqueChose: false, actionRenseignee: false, evalueLe },
        explication: EXPLICATION_MOTIF[regle.motif],
      };
    }
  }

  const changeQuelqueChose = Boolean(entree.impact && entree.impact.trim().length >= 20);
  if (!changeQuelqueChose) {
    return {
      admission: { publie: false, motif: 'sans-impact-identifiable', aUnActe: true, changeQuelqueChose: false, actionRenseignee: false, evalueLe },
      explication:
        "Acte réel, mais personne n'a encore rédigé ce qui change, pour qui et à partir de quand. L'item reste au registre avec son texte d'origine seul.",
    };
  }

  // Question 3 — y a-t-il quelque chose à faire, ou rien ?
  if (!entree.actionRenseignee) {
    return {
      admission: { publie: false, motif: 'sans-impact-identifiable', aUnActe: true, changeQuelqueChose: true, actionRenseignee: false, evalueLe },
      explication: "L'action n'a pas été qualifiée. « Aucune action » est une réponse valable, mais elle doit être écrite.",
    };
  }

  return {
    admission: { publie: true, aUnActe: true, changeQuelqueChose: true, actionRenseignee: true, evalueLe },
    explication: 'Les trois questions du test reçoivent oui.',
  };
}

export const EXPLICATION_MOTIF: Record<MotifExclusion, string> = {
  'approbation-proces-verbal': "Approbation du procès-verbal de la séance précédente : acte réel, mais qui ne change rien pour un habitant.",
  'fixation-ordre-du-jour': "Fixation de l'ordre du jour : acte d'organisation interne de la séance.",
  'acte-personnel-individuel': "Acte de personnel individuel. La plateforme ne publie aucune décision nominative concernant un agent.",
  'marche-fournitures-internes-sous-seuil': "Fournitures internes sous seuil : dépense de fonctionnement sans effet identifiable sur un tiers.",
  'autorisation-individuelle-sans-effet-tiers': "Autorisation individuelle sans effet sur des tiers (occupation temporaire, attestation).",
  'acte-pure-procedure': "Acte de pure procédure : prise de connaissance, communication, ouverture ou clôture de séance.",
  'sans-impact-identifiable': "Aucun impact n'a encore été rédigé pour cet acte.",
  'sans-acte': "Point d'agenda sans acte rattaché.",
  'plafond-mensuel-atteint': "Le plafond mensuel de publication du niveau est atteint. L'item reste consultable au registre.",
};

/**
 * Applique les plafonds du § 9 : 20 items publiés par mois au niveau communal,
 * 15 par niveau supérieur.
 *
 * Le dépassement n'est pas corrigé en silence : la fonction renvoie la liste
 * des mois en dépassement pour que le rapport de lot le signale. « Au-delà, le
 * filtre est trop permissif — dis-le-moi au lieu de l'ajuster seul. »
 */
export function appliquerPlafonds(items: Item[]): {
  items: Item[];
  depassements: Array<{ niveau: Niveau; mois: string; retenus: number; plafond: number }>;
} {
  const compteurs = new Map<string, number>();
  const depassements = new Map<string, { niveau: Niveau; mois: string; retenus: number; plafond: number }>();
  const tries = [...items].sort((a, b) => b.dateActe.localeCompare(a.dateActe));

  const sortie = tries.map((item) => {
    if (!item.admission.publie) return item;
    const mois = item.dateActe.slice(0, 7);
    const cle = `${item.niveau}|${mois}`;
    const plafond = PLAFOND_MENSUEL[item.niveau];
    const n = (compteurs.get(cle) ?? 0) + 1;
    compteurs.set(cle, n);
    if (n <= plafond) return item;

    const d = depassements.get(cle) ?? { niveau: item.niveau, mois, retenus: plafond, plafond };
    d.retenus = n;
    depassements.set(cle, d);
    return {
      ...item,
      admission: { ...item.admission, publie: false, motif: 'plafond-mensuel-atteint' as const },
    };
  });

  return { items: sortie, depassements: [...depassements.values()] };
}
