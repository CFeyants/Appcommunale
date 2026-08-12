/**
 * Connecteur EUR-Lex / CELLAR — le niveau européen.
 *
 * CELLAR expose le modèle CDM en SPARQL. Le point d'accès est public et sans
 * clé, ce qui en fait le seul niveau supérieur réellement branchable
 * aujourd'hui : ni le Moniteur belge ni Justel n'exposent d'API ouverte
 * documentée.
 *
 * On ne prend que les règlements et directives — les actes qui produisent des
 * effets juridiques —, dans leur expression française, et on écarte les
 * rectificatifs, qui ne changent rien pour un habitant.
 */

import { obtenirJson } from '../http';

const SPARQL = 'https://publications.europa.eu/webapi/rdf/sparql';

export const FICHE_SOURCE_EURLEX = {
  connecteur: 'eurlex-cellar',
  libelle: 'Actes de l’Union — EUR-Lex / CELLAR',
  organisme: 'Office des publications de l’Union européenne',
  licence: 'Réutilisation autorisée — décision 2011/833/UE',
  endpoint: SPARQL,
  cadence: 'Quotidienne',
  limitesConnues: [
    'CELLAR renvoie le titre officiel, jamais une reformulation : l’impact reste à rédiger point par point.',
    'Aucun lien automatique n’existe entre un acte européen et son effet sur une commune belge : le rattachement est manuel.',
    'Les rectificatifs sont écartés à l’ingestion ; ils sont nombreux et ne changent rien pour un habitant.',
    'Les requêtes SPARQL longues dépassent régulièrement le délai d’attente du point d’accès public.',
  ],
} as const;

interface ReponseSparql {
  results: { bindings: Array<Record<string, { value: string }>> };
}

const REQUETE = (depuis: string, limite: number) => `
PREFIX cdm: <http://publications.europa.eu/ontology/cdm#>
SELECT DISTINCT ?celex ?date ?titre WHERE {
  ?work cdm:resource_legal_id_celex ?celex ;
        cdm:work_date_document ?date .
  ?expr cdm:expression_belongs_to_work ?work ;
        cdm:expression_uses_language <http://publications.europa.eu/resource/authority/language/FRA> ;
        cdm:expression_title ?titre .
  FILTER(?date >= "${depuis}"^^<http://www.w3.org/2001/XMLSchema#date>)
  FILTER(STRSTARTS(STR(?celex), "32026R") || STRSTARTS(STR(?celex), "32026L"))
  FILTER(!CONTAINS(STR(?celex), "R("))
}
ORDER BY DESC(?date)
LIMIT ${limite}`;

export interface ActeUe {
  celex: string;
  date: string;
  titre: string;
  /** L'identifiant européen de législation, stable et citable. */
  urlEli: string;
  urlEurLex: string;
  /** « R » pour règlement, « L » pour directive. */
  nature: 'reglement' | 'directive';
}

export async function collecterActesUe(depuis = '2026-01-01', limite = 40) {
  // Le point d'accès refuse en HTTP 406 un en-tête `Accept: application/json` :
  // il faut lui annoncer le type SPARQL, en plus du paramètre `format`.
  const url = `${SPARQL}?query=${encodeURIComponent(REQUETE(depuis, limite))}&format=${encodeURIComponent('application/sparql-results+json')}`;
  const reponse = await obtenirJson<ReponseSparql>(url, {
    delaiMs: 800,
    tentatives: 3,
    timeoutMs: 120_000,
    accept: 'application/sparql-results+json',
  });
  if (!reponse) throw new Error('CELLAR n’a rien renvoyé');

  const actes: ActeUe[] = reponse.results.bindings.map((b) => {
    const celex = b.celex!.value;
    const nature = celex.includes('R') ? ('reglement' as const) : ('directive' as const);
    const annee = celex.slice(1, 5);
    const numero = celex.slice(6).replace(/^0+/, '');
    return {
      celex,
      date: b.date!.value,
      titre: b.titre!.value,
      urlEli: `http://data.europa.eu/eli/${nature === 'reglement' ? 'reg' : 'dir'}/${annee}/${numero}/oj`,
      urlEurLex: `https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:${celex}`,
      nature,
    };
  });

  return { fiche: FICHE_SOURCE_EURLEX, collecteLe: new Date().toISOString(), depuis, actes };
}
