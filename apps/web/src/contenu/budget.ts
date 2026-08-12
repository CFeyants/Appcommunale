/**
 * Ce que chaque ligne budgétaire recouvre, et ce qu'elle ne dit pas.
 *
 * C'est la fonction la plus importante de l'écran budget : tout chiffre est
 * cliquable, et le clic explique. Sans ces textes, un graphique de dépenses
 * publiques est un objet décoratif.
 *
 * Les dix fonctions sont celles de la classification CFAP (COFOG) des Nations
 * unies, reprise par Eurostat. Le libellé officiel est conservé tel quel dans
 * les données ; ce qui suit s'y ajoute, sans le remplacer.
 */

export interface ExplicationFonction {
  recouvre: string;
  neDitPas: string;
  /** Ce qui, dans cette fonction, relève réellement d'une décision communale. */
  decisionLocale: string;
}

export const EXPLICATIONS_COFOG: Record<string, ExplicationFonction> = {
  GF01: {
    recouvre:
      'Le fonctionnement des exécutifs et des assemblées, les affaires financières et fiscales, les affaires étrangères, l’aide extérieure, la recherche fondamentale, et — poste souvent décisif — les intérêts de la dette publique.',
    neDitPas:
      'Rien sur l’efficacité de l’administration. Une charge d’intérêts élevée gonfle cette fonction sans qu’aucun service supplémentaire soit rendu.',
    decisionLocale:
      'Une commune décide de son propre personnel administratif et de son endettement, mais pas des intérêts qu’elle paie, qui dépendent des taux.',
  },
  GF02: {
    recouvre: 'La défense militaire, la défense civile, l’aide militaire à des pays étrangers, et la recherche associée.',
    neDitPas: 'La part financée hors budget de la défense, ni les engagements pluriannuels d’achat d’équipement.',
    decisionLocale: 'Aucune. La défense est une compétence exclusivement fédérale.',
  },
  GF03: {
    recouvre: 'Les services de police, la protection civile, les tribunaux, l’administration pénitentiaire.',
    neDitPas:
      'La sécurité obtenue. Une hausse de cette ligne peut traduire un renfort d’effectifs comme une hausse des coûts salariaux.',
    decisionLocale:
      'La commune contribue à la zone de police et décide de sa police administrative — ordonnances, stationnement, salubrité. Le reste est fédéral.',
  },
  GF04: {
    recouvre:
      'Le soutien à l’économie et à l’emploi, l’agriculture, l’énergie, l’industrie, les transports et les communications.',
    neDitPas:
      'L’effet sur l’emploi. Une aide économique se compte en euros dépensés, jamais en emplois créés — ce lien n’est pas mesuré ici.',
    decisionLocale:
      'La voirie communale et l’aménagement des zones d’activité. Les grands axes et le rail relèvent de la Région ou du fédéral.',
  },
  GF05: {
    recouvre:
      'La gestion des déchets et des eaux usées, la lutte contre la pollution, la protection de la biodiversité et du paysage.',
    neDitPas:
      'L’état de l’environnement. Une commune qui dépense beaucoup en collecte de déchets peut simplement en produire davantage.',
    decisionLocale:
      'Largement communale ou intercommunale : fréquence de collecte, tarification, déchetterie, entretien des espaces verts.',
  },
  GF06: {
    recouvre:
      'Le logement, l’alimentation en eau, l’éclairage public, et le développement des collectivités.',
    neDitPas:
      'Le nombre de logements accessibles. Cette ligne mesure une dépense, pas une offre de logement ni des loyers.',
    decisionLocale:
      'L’éclairage public, l’aménagement du domaine public et la politique foncière communale. Le logement social est régional.',
  },
  GF07: {
    recouvre:
      'Les produits et appareils médicaux, les services ambulatoires et hospitaliers, la santé publique.',
    neDitPas:
      'L’état de santé de la population, ni les délais d’accès aux soins. Ce sont deux mesures que personne ne publie par commune.',
    decisionLocale: 'Presque rien : la santé est fédérale et régionale. La commune agit par le CPAS, à la marge.',
  },
  GF08: {
    recouvre:
      'Les services récréatifs et sportifs, la culture, la radiodiffusion et l’édition, les cultes et autres services communautaires.',
    neDitPas:
      'La participation réelle. Un hall omnisports coûte le même prix qu’il soit occupé ou vide.',
    decisionLocale:
      'Très largement communale : équipements sportifs, bibliothèque, subventions aux associations, entretien du patrimoine.',
  },
  GF09: {
    recouvre:
      'L’enseignement à tous les niveaux, du préscolaire au supérieur, et les services auxiliaires — transport, cantine, encadrement.',
    neDitPas:
      'Les résultats scolaires, ni les inégalités entre écoles. La dépense par élève ne dit rien de ce qu’un élève apprend.',
    decisionLocale:
      'Une commune peut organiser ses propres écoles — c’est le cas à Kraainem — mais les programmes et le financement relèvent de la Communauté.',
  },
  GF10: {
    recouvre:
      'Les pensions, le chômage, la maladie et l’invalidité, la famille et les enfants, le logement social, l’exclusion sociale.',
    neDitPas:
      'Le taux de non-recours : les personnes qui remplissent les conditions sans jamais demander n’apparaissent dans aucun de ces montants.',
    decisionLocale:
      'L’aide sociale complémentaire décidée par le CPAS. Les grands régimes — pensions, chômage, allocations — sont fédéraux ou régionaux.',
  },
};

/**
 * Le budget de Kraainem elle-même.
 *
 * Vérifié le 12 août 2026 : il n'est publié dans aucun format ouvert et
 * réutilisable. Le service OData des statistiques locales flamandes répond en
 * HTTP 401 sans identifiants ; les portails CKAN de data.gov.be et
 * opendata.vlaanderen.be ne répondent pas au chemin standard.
 *
 * L'écran affiche donc cette absence comme un fait, avec le nom de l'organisme
 * qui devrait la produire — plutôt qu'un budget illustratif dont les chiffres
 * seraient inventés.
 */
export const BUDGET_COMMUNAL = {
  disponible: false,
  organismeAttendu: 'Agentschap Binnenlands Bestuur — rapportage BBC des pouvoirs locaux',
  verifieLe: '2026-08-12',
  tentatives: [
    { source: 'provincies.incijfers.be — service OData des statistiques locales', resultat: 'HTTP 401 : identifiants requis' },
    { source: 'data.gov.be — API CKAN /api/3/action/package_search', resultat: 'ne répond pas au chemin standard' },
    { source: 'opendata.vlaanderen.be — catalogue', resultat: 'HTTP 302 vers une page sans interface programmable' },
    { source: 'lokalestatistieken.vlaanderen.be', resultat: 'aucune réponse' },
  ],
  ceQuiExiste:
    'La commune arrête chaque année ses comptes et son plan pluriannuel : la décision apparaît dans le fil, transmise à l’autorité de tutelle. C’est le document qui n’est pas publié, pas la décision de l’adopter.',
} as const;
