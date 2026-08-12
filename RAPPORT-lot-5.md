# Rapport — Lot 5 : les indicateurs

## Livré

Quatorze indicateurs proposés, sept sociaux et sept environnementaux. Chacun porte
l'étiquette « indicateur proposé » tant qu'aucune autorité ne l'a repris à son compte.

**Le non-recours est en première position**, mis en avant visuellement, et il est vide.
C'est délibéré : c'est le seul des quatorze qui mesure un échec de l'institution plutôt
qu'un effort, et son absence est l'information.

## Ce qui est mesuré, et ce qui ne l'est pas

| Indicateur | Famille | Mesuré | Source ou organisme attendu |
|---|---|---|---|
| Taux de non-recours aux aides sociales | social | ❌ | SPF Sécurité sociale et CPAS — **personne ne le mesure** |
| Délai médian de rendez-vous au service population | social | ❌ | Commune de Kraainem |
| Places d'accueil petite enfance pour 100 enfants | social | ❌ | Opgroeien |
| Délai moyen d'attribution d'un logement social | social | ❌ | VMSW |
| Part des élèves en retard scolaire | social | ❌ | Departement Onderwijs en Vorming |
| Personnes accompagnées par le CPAS | social | ❌ | CPAS de Kraainem |
| Participation aux activités pour aînés | social | ❌ | Commune de Kraainem |
| Électricité prélevée sur le réseau | environnement | ✅ | **Fluvius** |
| Gaz naturel prélevé | environnement | ✅ | **Fluvius** |
| Électricité réinjectée | environnement | ✅ | **Fluvius** |
| Consommation du patrimoine communal | environnement | ❌ | Commune de Kraainem |
| Qualité de l'air sur le territoire | environnement | ❌ | IRCEL-CELINE — **aucune station à Kraainem** |
| Déchets résiduels par habitant | environnement | ❌ | OVAM |
| Arbres plantés nets des abattages | environnement | ❌ | Commune de Kraainem |

**Deux mesurés sur quatorze.** Ce rapport est le résultat de l'écran, pas son échec.

## Critères d'acceptation

| Critère | État | Vérification |
|---|---|---|
| Environnement en rapport : chiffres, séries, seuils | ✅ | trois séries mensuelles réelles sur 24 mois |
| Social en infographie, une histoire par indicateur | ✅ | fiches distinctes avec absence, organisme et explication |
| Le non-recours en premier | ✅ | première position, encadré accentué |
| Étiquette « indicateur proposé » sur chacun | ✅ | badge sur les quatorze |
| Chaque graphique a une vue tableau et un export | ✅ | `CadreGraphique` |
| Aucune explication vide | ✅ | test parcourant les fichiers |

## Volume réel

- **370 relevés mensuels** Fluvius pour Kraainem, par secteur et par catégorie de point.
- Séries affichées sur les **24 derniers mois** disponibles.
- IRCEL-CELINE : **8 stations** retenues autour de la commune, la plus proche à **3,4 km**,
  aucune sur le territoire.

## Ce que la collecte a appris

**La qualité de l'air de Kraainem n'est pas mesurée.** La station la plus proche est une
station trafic située à 3,4 km : sa valeur décrit un carrefour, pas une commune
résidentielle survolée par les avions. Emprunter ce chiffre aurait produit une valeur fausse
présentée comme vraie. L'écran affiche la distance et l'absence.

**Les volumes Fluvius ne sont pas une consommation.** Ce sont des volumes de réseau :
l'électricité produite et consommée sur place par une installation solaire n'y figure pas.
C'est écrit dans le « ce qu'il ne montre pas » de chaque graphique, pas en note de bas de
page.

## Écart

Aucun seuil n'est affiché sur les trois séries mesurées : aucune autorité n'en a fixé pour
la consommation d'énergie d'une commune. Un seuil inventé aurait transformé un indicateur
en jugement.
