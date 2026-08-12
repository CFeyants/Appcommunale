/**
 * Les indicateurs de l'écran Budget — environnement et social.
 *
 * Chacun porte l'étiquette « indicateur proposé » : ce sont des propositions
 * de la plateforme, à valider avec la commune. Aucune autorité ne les a repris
 * à son compte.
 *
 * Sept indicateurs environnementaux, sept sociaux. Sur les quatorze, **deux**
 * sont réellement mesurables aujourd'hui à partir de sources ouvertes. Les
 * douze autres affichent leur absence, avec le nom de l'organisme qui devrait
 * les produire. C'est un résultat, pas un échec de collecte : le non-recours
 * aux aides, en particulier, n'est mesuré nulle part en Belgique à l'échelle
 * communale.
 */

import type { Statut } from '@pc/core';

export interface IndicateurAffiche {
  id: string;
  famille: 'environnement' | 'social';
  intitule: string;
  unite: string;
  propose: true;
  statut: Statut;
  /** Clé de la série réelle dans /data quand elle existe. */
  serie: 'fluvius-electricite' | 'fluvius-gaz' | 'fluvius-injection' | null;
  seuil?: { valeur: number; libelle: string };
  absence?: { organismeAttendu: string; nonMesureDepuis: string; explication: string };
  explication: { montre: string; neMontrePas: string; decisionLocale: string; prochaineMesure: string };
  source?: { organisme: string; url: string; dateDonnee: string; licence: string };
}

/**
 * Le non-recours vient en premier. C'est le seul des quatorze qui mesure un
 * échec de l'institution plutôt qu'un effort — et c'est celui dont l'absence
 * de donnée est la plus parlante.
 */
export const INDICATEURS_SOCIAUX: IndicateurAffiche[] = [
  {
    id: 'non-recours',
    famille: 'social',
    intitule: 'Taux de non-recours aux aides sociales',
    unite: '% des ayants droit estimés',
    propose: true,
    statut: 'non-mesure',
    serie: null,
    absence: {
      organismeAttendu: 'SPF Sécurité sociale et CPAS de Kraainem',
      nonMesureDepuis: 'toujours',
      explication:
        'Personne ne mesure le non-recours à l’échelle communale en Belgique. Le calcul suppose deux nombres : les ayants droit estimés et les bénéficiaires réels. Le second existe chez le CPAS ; le premier n’est estimé par aucune administration. Construire cette donnée serait une contribution en soi.',
    },
    explication: {
      montre:
        'Rien, aujourd’hui. L’écart entre les personnes qui remplissent les conditions d’une aide et celles qui la reçoivent effectivement.',
      neMontrePas:
        'Les raisons du non-recours — méconnaissance, complexité, honte, refus. Ce serait une enquête, pas un indicateur.',
      decisionLocale:
        'Le CPAS peut décider d’aller vers les ayants droit plutôt que d’attendre leur demande. C’est la seule chose qui fasse bouger ce chiffre.',
      prochaineMesure: 'Aucune n’est programmée par une autorité.',
    },
  },
  {
    id: 'delai-population',
    famille: 'social',
    intitule: 'Délai médian pour obtenir un rendez-vous au service population',
    unite: 'jours',
    propose: true,
    statut: 'non-mesure',
    serie: null,
    absence: {
      organismeAttendu: 'Commune de Kraainem — service population',
      nonMesureDepuis: 'toujours',
      explication:
        'Le système de rendez-vous en ligne de la commune connaît ce chiffre à la journée près. Il n’est pas publié, et aucune obligation ne l’impose.',
    },
    explication: {
      montre: 'Le temps qu’un habitant attend avant d’être reçu pour une démarche d’état civil ou de population.',
      neMontrePas: 'La durée du rendez-vous lui-même, ni le nombre de personnes qui renoncent avant de le prendre.',
      decisionLocale: 'Entièrement : effectifs, plages d’ouverture et organisation des guichets sont des décisions communales.',
      prochaineMesure: 'Aucune n’est programmée.',
    },
  },
  {
    id: 'places-accueil-petite-enfance',
    famille: 'social',
    intitule: 'Places d’accueil de la petite enfance pour cent enfants de moins de trois ans',
    unite: 'places / 100 enfants',
    propose: true,
    statut: 'non-mesure',
    serie: null,
    absence: {
      organismeAttendu: 'Opgroeien (Agentschap Opgroeien regie)',
      nonMesureDepuis: '2023',
      explication:
        'Opgroeien tient le registre des places agréées par commune, mais ne l’expose pas en données ouvertes réutilisables. Le rapprochement avec la population de moins de trois ans reste donc manuel.',
    },
    explication: {
      montre: 'Le rapport entre l’offre d’accueil agréée et le nombre d’enfants concernés sur le territoire.',
      neMontrePas: 'Les places réellement disponibles à un instant donné, ni les listes d’attente.',
      decisionLocale: 'Partiellement : la commune peut créer des places, mais l’agrément et le financement sont régionaux.',
      prochaineMesure: 'Aucune n’est programmée.',
    },
  },
  {
    id: 'delai-logement-social',
    famille: 'social',
    intitule: 'Délai moyen d’attribution d’un logement social',
    unite: 'mois',
    propose: true,
    statut: 'non-mesure',
    serie: null,
    absence: {
      organismeAttendu: 'Vlaamse Maatschappij voor Sociaal Wonen (VMSW)',
      nonMesureDepuis: '2022',
      explication:
        'La VMSW publie des statistiques régionales agrégées ; la ventilation par commune n’est pas ouverte.',
    },
    explication: {
      montre: 'Le temps écoulé entre l’inscription sur la liste et l’attribution effective d’un logement.',
      neMontrePas: 'Les ménages qui renoncent en cours d’attente, ni ceux qui ne s’inscrivent jamais.',
      decisionLocale: 'Faiblement : la commune peut mobiliser du foncier ; l’attribution suit des règles régionales.',
      prochaineMesure: 'Aucune n’est programmée.',
    },
  },
  {
    id: 'retard-scolaire',
    famille: 'social',
    intitule: 'Part des élèves en retard scolaire',
    unite: '% des élèves',
    propose: true,
    statut: 'non-mesure',
    serie: null,
    absence: {
      organismeAttendu: 'Departement Onderwijs en Vorming',
      nonMesureDepuis: '2023',
      explication:
        'Les données existent par établissement, pas par commune de résidence. À Kraainem, beaucoup d’élèves sont scolarisés à Bruxelles : l’indicateur par établissement ne décrirait pas la population communale.',
    },
    explication: {
      montre: 'La part des élèves ayant au moins une année de retard par rapport à leur cohorte.',
      neMontrePas: 'Les causes du retard, ni ce que l’école fait pour le rattraper.',
      decisionLocale: 'Presque pas : l’enseignement est une compétence de la Communauté.',
      prochaineMesure: 'Aucune n’est programmée.',
    },
  },
  {
    id: 'personnes-accompagnees-cpas',
    famille: 'social',
    intitule: 'Personnes accompagnées par le centre public d’action sociale',
    unite: 'personnes',
    propose: true,
    statut: 'non-mesure',
    serie: null,
    absence: {
      organismeAttendu: 'CPAS de Kraainem',
      nonMesureDepuis: 'toujours',
      explication:
        'Le rapport annuel du CPAS contient ce chiffre. Il n’est publié ni en données ouvertes, ni sur Lokaal Beslist, qui n’expose que les décisions du bureau permanent.',
    },
    explication: {
      montre: 'Le nombre de personnes distinctes suivies par le CPAS sur une année.',
      neMontrePas: 'L’intensité de l’accompagnement, ni si la situation des personnes s’est améliorée.',
      decisionLocale: 'Entièrement, pour ce que le CPAS choisit d’offrir au-delà du minimum légal.',
      prochaineMesure: 'Aucune n’est programmée.',
    },
  },
  {
    id: 'participation-aines',
    famille: 'social',
    intitule: 'Participation aux activités destinées aux aînés',
    unite: 'participants distincts',
    propose: true,
    statut: 'non-mesure',
    serie: null,
    absence: {
      organismeAttendu: 'Commune de Kraainem — service seniors',
      nonMesureDepuis: 'toujours',
      explication:
        'Approximation de l’isolement, faute de mieux : personne ne mesure l’isolement lui-même. Les listes de participation existent mais ne sont pas agrégées.',
    },
    explication: {
      montre: 'Combien de personnes différentes participent, au moins une fois par an, à une activité communale pour aînés.',
      neMontrePas: 'L’isolement lui-même. Une personne isolée qui ne vient jamais n’apparaît dans aucun chiffre.',
      decisionLocale: 'Entièrement.',
      prochaineMesure: 'Aucune n’est programmée.',
    },
  },
];

export const INDICATEURS_ENVIRONNEMENT: IndicateurAffiche[] = [
  {
    id: 'electricite-commune',
    famille: 'environnement',
    intitule: 'Électricité prélevée sur le réseau, tous usages du territoire',
    unite: 'GWh par an',
    propose: true,
    statut: 'conforme',
    serie: 'fluvius-electricite',
    explication: {
      montre:
        'Le volume d’électricité prélevé sur le réseau de distribution par tous les points de fourniture situés à Kraainem, mois par mois.',
      neMontrePas:
        'L’électricité produite et consommée sur place sans passer par le réseau : une installation solaire en autoconsommation est invisible ici.',
      decisionLocale:
        'Très peu. La commune ne décide ni des prix, ni du raccordement ; elle ne maîtrise directement que la consommation de son propre patrimoine.',
      prochaineMesure: 'Publication mensuelle de Fluvius, environ trois mois après le mois concerné.',
    },
    source: {
      organisme: 'Fluvius System Operator',
      url: 'https://opendata.fluvius.be/explore/dataset/1-19-totaal-gealloceerd-volume/',
      dateDonnee: '2026-08-12',
      licence: 'Licence ouverte Fluvius',
    },
  },
  {
    id: 'gaz-commune',
    famille: 'environnement',
    intitule: 'Gaz naturel prélevé sur le réseau',
    unite: 'GWh par an',
    propose: true,
    statut: 'conforme',
    serie: 'fluvius-gaz',
    explication: {
      montre: 'Le volume de gaz naturel distribué sur le territoire de la commune, mois par mois.',
      neMontrePas:
        'Le chauffage au mazout, au bois ou par pompe à chaleur. Une commune qui abandonnerait le gaz pour le mazout verrait ce chiffre baisser sans avoir rien amélioré.',
      decisionLocale: 'Très peu directement ; les primes à l’isolation relèvent de la Région.',
      prochaineMesure: 'Publication mensuelle de Fluvius.',
    },
    source: {
      organisme: 'Fluvius System Operator',
      url: 'https://opendata.fluvius.be/explore/dataset/1-19-totaal-gealloceerd-volume/',
      dateDonnee: '2026-08-12',
      licence: 'Licence ouverte Fluvius',
    },
  },
  {
    id: 'injection-commune',
    famille: 'environnement',
    intitule: 'Électricité réinjectée sur le réseau depuis le territoire',
    unite: 'GWh par an',
    propose: true,
    statut: 'conforme',
    serie: 'fluvius-injection',
    explication: {
      montre: 'Le surplus de production locale — essentiellement solaire — renvoyé vers le réseau de distribution.',
      neMontrePas:
        'La production totale : ce qui est autoconsommé n’est jamais compté. La production réelle est donc supérieure, sans qu’on sache de combien.',
      decisionLocale: 'La commune peut équiper ses propres toitures et faciliter les permis ; le reste dépend des particuliers.',
      prochaineMesure: 'Publication mensuelle de Fluvius.',
    },
    source: {
      organisme: 'Fluvius System Operator',
      url: 'https://opendata.fluvius.be/explore/dataset/1-19-totaal-gealloceerd-volume/',
      dateDonnee: '2026-08-12',
      licence: 'Licence ouverte Fluvius',
    },
  },
  {
    id: 'patrimoine-communal-kwh-m2',
    famille: 'environnement',
    intitule: 'Consommation du patrimoine communal',
    unite: 'kWh par m² et par an',
    propose: true,
    statut: 'non-mesure',
    serie: null,
    absence: {
      organismeAttendu: 'Commune de Kraainem — service des travaux',
      nonMesureDepuis: 'toujours',
      explication:
        'Suppose un cadastre énergétique des bâtiments communaux avec leurs surfaces. La commune dispose des factures ; le rapprochement avec les surfaces n’est pas publié.',
    },
    explication: {
      montre: 'Ce que consomment les bâtiments que la commune possède, rapporté à leur surface.',
      neMontrePas: 'Le confort obtenu : un bâtiment sobre et froid a le même chiffre qu’un bâtiment sobre et confortable.',
      decisionLocale: 'Entièrement. C’est le seul indicateur environnemental que la commune maîtrise de bout en bout.',
      prochaineMesure: 'Aucune n’est programmée.',
    },
  },
  {
    id: 'qualite-air',
    famille: 'environnement',
    intitule: 'Qualité de l’air mesurée sur le territoire communal',
    unite: 'µg/m³ (PM2,5)',
    propose: true,
    statut: 'non-mesure',
    serie: null,
    absence: {
      organismeAttendu: 'IRCEL-CELINE — Cellule interrégionale de l’environnement',
      nonMesureDepuis: 'toujours',
      explication:
        'Aucune station de mesure ne se trouve à Kraainem. La plus proche est une station trafic bruxelloise : sa valeur décrit un carrefour, pas une commune résidentielle survolée par les avions.',
    },
    explication: {
      montre: 'Rien à Kraainem. La carte montre où sont les stations, et à quelle distance.',
      neMontrePas:
        'L’air que respire un habitant de Kraainem. Emprunter la valeur d’une station située ailleurs serait un chiffre faux présenté comme vrai.',
      decisionLocale:
        'La commune peut demander l’installation d’une station ou financer des capteurs citoyens. Elle ne décide pas du réseau interrégional.',
      prochaineMesure: 'Aucune n’est programmée.',
    },
    source: {
      organisme: 'IRCEL-CELINE',
      url: 'https://geo.irceline.be/sos/api/v1/stations',
      dateDonnee: '2026-08-12',
      licence: 'CC BY 4.0',
    },
  },
  {
    id: 'collecte-selective',
    famille: 'environnement',
    intitule: 'Quantité de déchets résiduels par habitant',
    unite: 'kg par habitant et par an',
    propose: true,
    statut: 'non-mesure',
    serie: null,
    absence: {
      organismeAttendu: 'OVAM (Openbare Vlaamse Afvalstoffenmaatschappij)',
      nonMesureDepuis: '2023',
      explication:
        'L’OVAM publie ce chiffre par commune dans ses rapports, mais pas sous forme de jeu de données ouvert et daté qui permette d’en suivre l’évolution automatiquement.',
    },
    explication: {
      montre: 'Ce qui part à l’incinération, rapporté à la population.',
      neMontrePas: 'Ce qui est trié correctement, ni les déchets déposés hors de la commune.',
      decisionLocale: 'Largement : fréquence de collecte, tarification et déchetterie sont des choix communaux ou intercommunaux.',
      prochaineMesure: 'Aucune n’est programmée.',
    },
  },
  {
    id: 'arbres-plantes-nets',
    famille: 'environnement',
    intitule: 'Arbres plantés, nets des abattages',
    unite: 'arbres par an',
    propose: true,
    statut: 'non-mesure',
    serie: null,
    absence: {
      organismeAttendu: 'Commune de Kraainem — service espaces verts',
      nonMesureDepuis: 'toujours',
      explication:
        'Les autorisations d’abattage passent par le collège et apparaissent dans Lokaal Beslist ; les plantations n’y apparaissent pas. Le solde n’est donc pas calculable à partir des sources ouvertes.',
    },
    explication: {
      montre: 'Le solde réel : ce qui a été planté moins ce qui a été abattu.',
      neMontrePas:
        'La différence de maturité. Un chêne de quatre-vingts ans abattu et remplacé par trois jeunes plants donne un solde positif et une perte écologique.',
      decisionLocale: 'Entièrement pour le domaine public.',
      prochaineMesure: 'Aucune n’est programmée.',
    },
  },
];

export const TOUS_INDICATEURS = [...INDICATEURS_SOCIAUX, ...INDICATEURS_ENVIRONNEMENT];
