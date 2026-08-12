# Rapport — Lot 6 : vision

## Livré

- **Quatre objectifs réels**, chacun avec sa cible chiffrée, son échéance, son article, son
  identifiant ELI et sa source citable.
- **L'emboîtement rendu visible** : chaque objectif affiche à quel objectif du niveau
  supérieur il se rattache. Un objectif sans rattachement l'affiche, avec la mention que
  c'est une information et non un défaut de saisie.
- **La trajectoire, pas seulement la cible** : la série mesurée des émissions belges de gaz
  à effet de serre, de 1990 à 2024, avec la cible européenne tracée et l'écart calculé.
- **Une page « comment cette vision a été définie »** par objectif : qui l'a proposée,
  quelle procédure, qui a été consulté, qui a voté, quand, et le lien vers la délibération.
- **« Ce qui se décide »**, avec la limite stricte affichée : aucun sondage, aucune
  projection, aucun classement de listes, aucun taux d'accord.
- Le marquage « cet objectif compte pour moi » : en local, sans compte, sans agrégation.

## Le résultat principal de l'écran

| Niveau | Objectifs datés et chiffrés | Domaines de compétence |
|---|---|---|
| Commune de Kraainem | **0** | 14 |
| Communauté flamande | **0** | 6 |
| Région flamande | **0** | 12 |
| État fédéral | **1** | 11 |
| Union européenne | **3** | 32 |
| **Total** | **4** | **75** |

Le nombre héroïque de l'écran est **4 / 75**. Le brief prévenait qu'on trouverait très peu ;
c'est pire que prévu, et c'est affiché comme le résultat, pas comme une lacune.

## Les quatre objectifs, et pourquoi eux

| Objectif | Source | Article |
|---|---|---|
| Neutralité climatique de l'Union en 2050 | règlement (UE) 2021/1119 | art. 2, § 1ᵉʳ |
| −55 % d'émissions nettes d'ici 2030 | règlement (UE) 2021/1119 | art. 4, § 1ᵉʳ |
| 42,5 % de renouvelables d'ici 2030 | directive (UE) 2023/2413 | art. 1ᵉʳ, point 2) |
| −47 % pour la Belgique hors marché carbone | règlement (UE) 2023/857 | annexe I |

Chacun est vérifiable dans son texte d'origine, avec un identifiant ELI stable. Aucun
objectif n'a été retenu sur la foi d'une communication de presse.

## La trajectoire, réellement mesurée

Série Eurostat `env_air_gge`, périmètre `TOTX4_MEMO`, unité `MIO_T` :

- 35 années, de 1990 à 2024 ;
- référence 1990 : **145,47 Mt** ;
- dernière mesure 2024 : **98,01 Mt** ;
- cible 2030 (−55 % sur 1990) : **65,46 Mt** ;
- écart affiché : **+50 % au-dessus de la cible**.

## Critères d'acceptation

| Critère | État | Vérification |
|---|---|---|
| Un même écran affiche les niveaux sans changer de grammaire | ✅ | même carte, même ligne de source, à tous les niveaux |
| Deux horizons séparés, jamais mélangés | ✅ | deux sections distinctes |
| Emboîtement visible, absence de rattachement affichée | ✅ | lien interne ou phrase explicite |
| Trajectoire, écart à la cible, prochaine mesure | ✅ | 35 points mesurés |
| Page « comment cette vision a été définie » | ✅ | dépliant par objectif |
| Aucun sondage, aucune projection, aucun classement | ✅ | section « ce qui se décide », limite affichée |
| Marquage en local, sans agrégation | ✅ | `localStorage`, aucune requête |
| Objectifs de la mandature | ❌ | aucun n'existe — voir `IMPOSSIBLE.md`, point I5 |

## Écart

**Aucun objectif de mandature n'a pu être trouvé, à aucun des cinq niveaux.** Les
déclarations de gouvernement contiennent des intentions, pas des cibles chiffrées et
datées suivies. La section existe, séparée de la vision longue comme l'exige le brief, et
affiche l'absence. Les deux horizons ne sont jamais mélangés, y compris quand l'un est vide.
