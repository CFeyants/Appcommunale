/**
 * Table de compétences, versionnée.
 *
 * Fait correspondre { thème, niveau } → institution compétente, avec le
 * fondement juridique et le canal de dépôt. Le routage est **suggéré, jamais
 * automatique** : l'utilisateur voit le destinataire proposé et la raison, et
 * peut le changer.
 *
 * La table est volontairement incomplète et le dit : une correspondance
 * absente s'affiche comme absente plutôt que de renvoyer vers un guichet
 * plausible mais faux.
 */

import type { Niveau, Theme } from './vocabulaires';

export const VERSION_COMPETENCES = '2026-08-12';

export interface Institution {
  id: string;
  nom: string;
  niveau: Niveau;
  /** Le texte qui fonde la compétence. Cité, pas résumé. */
  fondementJuridique: string;
  fondementUrl: string;
  canal: { libelle: string; url?: string; adresse?: string; courriel?: string };
  /** Délai légal de réponse quand un texte en fixe un. Sinon `null`, dit comme tel. */
  delaiLegalJours: number | null;
  delaiSource?: string;
}

export const INSTITUTIONS: Record<string, Institution> = {
  'kraainem-college': {
    id: 'kraainem-college',
    nom: 'Collège des bourgmestre et échevins de Kraainem',
    niveau: 'commune',
    fondementJuridique: 'Decreet over het lokaal bestuur, art. 56 — compétences du collège',
    fondementUrl: 'https://codex.vlaanderen.be/PrintDocument.ashx?id=1029017',
    canal: {
      libelle: 'Courrier ou courriel à l’administration communale',
      adresse: 'Arthur Dezangrélaan 17, 1950 Kraainem',
      courriel: 'info@kraainem.be',
    },
    delaiLegalJours: null,
  },
  'kraainem-conseil': {
    id: 'kraainem-conseil',
    nom: 'Conseil communal de Kraainem',
    niveau: 'commune',
    fondementJuridique: 'Decreet over het lokaal bestuur, art. 40-41 — compétences du conseil',
    fondementUrl: 'https://codex.vlaanderen.be/PrintDocument.ashx?id=1029017',
    canal: { libelle: 'Dépôt auprès du secrétariat communal', adresse: 'Arthur Dezangrélaan 17, 1950 Kraainem' },
    delaiLegalJours: null,
  },
  'kraainem-ocmw': {
    id: 'kraainem-ocmw',
    nom: 'Centre public d’action sociale de Kraainem (OCMW)',
    niveau: 'commune',
    fondementJuridique: 'Loi organique des CPAS du 8 juillet 1976, art. 1er — droit à l’aide sociale',
    fondementUrl: 'https://www.ejustice.just.fgov.be/eli/loi/1976/07/08/1976070850/justel',
    canal: { libelle: 'Demande auprès du CPAS', adresse: 'Arthur Dezangrélaan 17, 1950 Kraainem' },
    delaiLegalJours: 30,
    delaiSource: 'Loi du 8 juillet 1976, art. 58 §1 — décision dans les 30 jours de la demande',
  },
  'vlaamse-overheid': {
    id: 'vlaamse-overheid',
    nom: 'Autorité flamande',
    niveau: 'region',
    fondementJuridique: 'Loi spéciale de réformes institutionnelles du 8 août 1980, art. 6',
    fondementUrl: 'https://www.ejustice.just.fgov.be/eli/loi/1980/08/08/1980080802/justel',
    canal: { libelle: 'Vlaamse Infolijn 1700', url: 'https://www.vlaanderen.be/contact' },
    delaiLegalJours: 45,
    delaiSource: 'Bestuursdecreet du 7 décembre 2018, art. II.29 — publicité de l’administration, 20 jours prorogeables à 40',
  },
  'federaal-ombudsman': {
    id: 'federaal-ombudsman',
    nom: 'Médiateur fédéral',
    niveau: 'belgique',
    fondementJuridique: 'Loi du 22 mars 1995 instaurant des médiateurs fédéraux',
    fondementUrl: 'https://www.ejustice.just.fgov.be/eli/loi/1995/03/22/1995021162/justel',
    canal: { libelle: 'Plainte en ligne', url: 'https://www.mediateurfederal.be/fr/deposer-une-plainte' },
    delaiLegalJours: null,
  },
  'commission-europeenne': {
    id: 'commission-europeenne',
    nom: 'Commission européenne',
    niveau: 'europe',
    fondementJuridique: 'Règlement (CE) n° 1049/2001 — accès aux documents',
    fondementUrl: 'https://eur-lex.europa.eu/eli/reg/2001/1049/oj',
    canal: { libelle: 'Demande d’accès aux documents', url: 'https://www.asktheeu.org/' },
    delaiLegalJours: 15,
    delaiSource: 'Règlement (CE) n° 1049/2001, art. 7 §1 — 15 jours ouvrables',
  },
};

interface RegleCompetence {
  themes: Theme[];
  niveau: Niveau;
  institutionId: string;
  /** La raison montrée à l'utilisateur, en une phrase. */
  raison: string;
}

const REGLES: RegleCompetence[] = [
  {
    themes: ['mobilite-voirie', 'urbanisme', 'securite', 'culture-sport'],
    niveau: 'commune',
    institutionId: 'kraainem-college',
    raison: 'La voirie communale, l’urbanisme de proximité et la police administrative relèvent du collège.',
  },
  {
    themes: ['taxes-budget'],
    niveau: 'commune',
    institutionId: 'kraainem-conseil',
    raison: 'Les règlements-taxes et le budget sont votés par le conseil communal, pas par le collège.',
  },
  {
    themes: ['aides-droits-sociaux', 'aines', 'sante-soins'],
    niveau: 'commune',
    institutionId: 'kraainem-ocmw',
    raison: 'L’aide sociale individuelle relève du CPAS, autorité distincte de la commune.',
  },
  {
    themes: ['enfance-ecole', 'environnement-energie', 'logement', 'emploi-entreprises'],
    niveau: 'region',
    institutionId: 'vlaamse-overheid',
    raison: 'L’enseignement, l’énergie, le logement et l’économie sont des compétences de la Région et de la Communauté flamandes.',
  },
];

export interface Suggestion {
  institution: Institution;
  raison: string;
  /** Toujours vrai : le routage propose, il ne décide pas. */
  modifiable: true;
  /** Les autres destinataires plausibles, pour que le choix soit réel. */
  alternatives: Institution[];
}

/**
 * Suggère un destinataire. Renvoie `null` quand la table ne couvre pas le cas :
 * mieux vaut dire « nous ne savons pas à qui adresser cette demande » que
 * d'envoyer quelqu'un au mauvais guichet.
 */
export function suggererDestinataire(theme: Theme, niveau: Niveau): Suggestion | null {
  const regle = REGLES.find((r) => r.niveau === niveau && r.themes.includes(theme));
  if (!regle) return null;
  const institution = INSTITUTIONS[regle.institutionId];
  if (!institution) return null;
  return {
    institution,
    raison: regle.raison,
    modifiable: true,
    alternatives: Object.values(INSTITUTIONS).filter((i) => i.id !== institution.id),
  };
}
