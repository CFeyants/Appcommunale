/**
 * Vocabulaires OSLO et standards ouverts utilisés par la plateforme.
 *
 * Décision du Lot 1, irréversible : le modèle de données n'invente rien là où
 * un terme normalisé existe. Chaque type de `types.ts` cite ici l'identifiant
 * dont il dérive ; les extensions sont justifiées dans /docs/vocabulaire.md.
 *
 * Vérifié le 12 août 2026 : les espaces de noms `besluit`, `mandaat`,
 * `organisatie`, `adres`, `persoon` et `generiek` répondent en HTTP 200 sur
 * data.vlaanderen.be. `dienstencataloog` n'existe pas — le catalogue de
 * services retombe donc sur CPSV-AP, voir SERVICE_PUBLIC ci-dessous.
 */

export const NS = {
  besluit: 'https://data.vlaanderen.be/ns/besluit#',
  mandaat: 'https://data.vlaanderen.be/ns/mandaat#',
  organisatie: 'https://data.vlaanderen.be/ns/organisatie#',
  adres: 'https://data.vlaanderen.be/ns/adres#',
  persoon: 'https://data.vlaanderen.be/ns/persoon#',
  generiek: 'https://data.vlaanderen.be/ns/generiek#',
  eli: 'http://data.europa.eu/eli/ontology#',
  cpsv: 'http://purl.org/vocab/cpsv#',
  dcterms: 'http://purl.org/dc/terms/',
  dcat: 'http://www.w3.org/ns/dcat#',
  prov: 'http://www.w3.org/ns/prov#',
  qb: 'http://purl.org/linked-data/cube#',
  skos: 'http://www.w3.org/2004/02/skos/core#',
  org: 'http://www.w3.org/ns/org#',
  schema: 'https://schema.org/',
  /** Extension propre au projet. Chaque terme est documenté dans /docs/vocabulaire.md. */
  pc: 'https://plateforme-citoyenne.be/ns/core#',
} as const;

/** Termes utilisés, cités un par un pour qu'une relecture soit possible. */
export const OSLO = {
  // --- Décision locale (LBLOD / OSLO Besluit-publicatie) --------------------
  ZITTING: `${NS.besluit}Zitting`,
  VERGADERACTIVITEIT: `${NS.besluit}Vergaderactiviteit`,
  AGENDAPUNT: `${NS.besluit}Agendapunt`,
  BEHANDELING_VAN_AGENDAPUNT: `${NS.besluit}BehandelingVanAgendapunt`,
  BESLUIT: `${NS.besluit}Besluit`,
  ARTIKEL: `${NS.besluit}Artikel`,
  STEMMING: `${NS.besluit}Stemming`,
  BESTUURSORGAAN: `${NS.besluit}Bestuursorgaan`,
  BESTUURSEENHEID: `${NS.besluit}Bestuurseenheid`,
  MANDATARIS: `${NS.mandaat}Mandataris`,

  // --- Acte juridique, tous niveaux (ELI, utilisé par EUR-Lex et le Moniteur)
  LEGAL_RESOURCE: `${NS.eli}LegalResource`,
  LEGAL_EXPRESSION: `${NS.eli}LegalExpression`,

  // --- Service public (CPSV-AP, standard européen repris par OSLO) ----------
  SERVICE_PUBLIC: `${NS.cpsv}PublicService`,
  REGLE_SERVICE: `${NS.cpsv}Rule`,
  SORTIE_SERVICE: `${NS.cpsv}Output`,
  CANAL: `${NS.cpsv}Channel`,

  // --- Organisation, adresse, personne -------------------------------------
  ORGANISATIE: `${NS.organisatie}Organisatie`,
  ADRES: `${NS.adres}Adres`,
  PERSOON: `${NS.persoon}Persoon`,
  FORMAL_ORGANIZATION: `${NS.org}FormalOrganization`,

  // --- Provenance, source, licence -----------------------------------------
  SOURCE: `${NS.dcterms}source`,
  LICENSE: `${NS.dcterms}license`,
  ISSUED: `${NS.dcterms}issued`,
  PUBLISHER: `${NS.dcterms}publisher`,
  WAS_GENERATED_BY: `${NS.prov}wasGeneratedBy`,
  GENERATED_AT_TIME: `${NS.prov}generatedAtTime`,

  // --- Observation statistique (RDF Data Cube) -----------------------------
  OBSERVATION: `${NS.qb}Observation`,
  MEASURE: `${NS.qb}measureType`,

  // --- Extensions du projet — voir /docs/vocabulaire.md ---------------------
  /** Objectif chiffré et daté d'une autorité. Aucun terme OSLO n'existe. */
  PC_OBJECTIF: `${NS.pc}Objectif`,
  /** Rattachement d'un objectif à un objectif de niveau supérieur. */
  PC_RATTACHEMENT: `${NS.pc}rattachement`,
  /** Initiative budgétée et jalonnée. Voisin de schema:Project, sans jalons datés. */
  PC_INITIATIVE: `${NS.pc}Initiative`,
  /** Résultat du test d'admission. Notion propre au produit. */
  PC_ADMISSION: `${NS.pc}Admission`,
  /** Reformulation en français ordinaire, avec son auteur et sa date. */
  PC_REFORMULATION: `${NS.pc}Reformulation`,
  /** Délai réellement observé entre une demande et sa réponse. */
  PC_DELAI_OBSERVE: `${NS.pc}delaiObserve`,
  /** Indicateur proposé, tant qu'aucune autorité ne l'a repris à son compte. */
  PC_INDICATEUR: `${NS.pc}Indicateur`,
} as const;

export type TermeOslo = (typeof OSLO)[keyof typeof OSLO];
