# Rapport — Lot 8 : épargne longue et services

## Livré

### Où placer

- Deux fiches projet, sur des **coopératives citoyennes réellement identifiées**, en ordre
  alphabétique — jamais par rendement.
- **Un projet sans rattachement à un objectif n'entre pas** : chaque fiche cite l'objectif
  servi avec son identifiant, et le lien mène à l'écran Vision.
- Horizon minimal affiché sur chaque fiche : dix ans et huit ans.
- **Avertissement de risque visible sans clic**, en tête de section : perte en capital,
  illiquidité des parts, et le rappel que la plateforme n'encaisse rien, ne conseille rien
  et ne classe rien par rendement.
- **Rendement observé, jamais plafond légal** : aucune série n'est affichée, parce qu'aucune
  coopérative ne publie ses dividendes en données ouvertes réutilisables. La raison est
  écrite, et l'endroit où le chiffre existe réellement aussi.
- Triple comptabilité sur chaque fiche : économique, social, environnemental.

### Services au citoyen

Quatre fiches au **gabarit `bornin.brussels`** : nom en capitales, nom usuel entre
parenthèses, puis quatre blocs nettement séparés — Coordonnées, À propos (service par
service, chacun nommé), Pour qui (les bénéficiaires, dits sans détour), Permanence (les
horaires réels, « uniquement sur rendez-vous » compris).

Une fiche par catégorie : Familles, Jeunes, Culture et sport, Entraide.

## Critères d'acceptation

| Critère | État | Vérification |
|---|---|---|
| Uniquement du long terme, horizon affiché | ✅ | ≥ 8 ans sur chaque fiche |
| Un projet sans objectif rattaché n'entre pas | ✅ | `objectifServiId` obligatoire dans le schéma |
| Aucun encaissement, aucun conseil, aucun classement par rendement | ✅ | lien sortant seul ; ordre alphabétique |
| Uniquement des acteurs agréés ou coopératives identifiées | ✅ | deux coopératives citoyennes, référence affichée |
| Rendement observé, jamais plafond légal | ✅ | aucune valeur affichée ; la raison l'est |
| Avertissement visible sur chaque fiche | ✅ | bandeau en tête de section |
| Triple comptabilité | ✅ | trois colonnes par fiche |
| Fiches service au gabarit bornin.brussels | ✅ | quatre blocs, capture `5-epargne_*` |
| Quatre catégories | ✅ | Familles, Jeunes, Culture et sport, Entraide |
| Inscriptions | ⚠️ | couverture réelle : zéro — voir ci-dessous |

## Volume réel

- 2 fiches projet, 2 objectifs européens servis.
- 4 fiches service, chacune signalant explicitement ce qu'elle ne peut pas contenir.
- 0 séance inscriptible.

## Les deux écarts

**Aucun rendement observé n'est affiché.** Ni Ecopower ni Klimaan ne publient leur série de
dividendes dans un format ouvert et réutilisable. Le dividende est voté chaque année en
assemblée générale et figure dans le rapport annuel. Écrire un pourcentage plausible aurait
été une promesse — ce que le brief interdit deux fois, au § 8.1 et au § 16. La fiche dit
donc où le chiffre existe réellement, et laisse la personne aller le chercher.

**Les inscriptions n'ont aucune couverture.** Il n'existe aucun registre agrégé des séances
d'information, formations et stages : chaque organisateur publie de son côté. La couverture
réelle est affichée — zéro séance sur un nombre inconnu — et **aucun faux bouton
d'inscription** n'est présenté. Voir [`IMPOSSIBLE.md`](IMPOSSIBLE.md), point I8.

## Ce que les fiches service ne peuvent pas contenir, et pourquoi c'est écrit

Les horaires exacts des services communaux ne sont publiés dans aucun format ouvert, et
`kraainem.be` interdit les outils automatisés par son `robots.txt` — il n'a donc pas été
sollicité. Chaque fiche porte la mention « les horaires ne sont pas publiés en données
ouvertes » plutôt qu'un horaire inventé, et la fiche est marquée incomplète.

En revanche, ce qui est réel l'est complètement : l'adresse de la maison communale, les
facilités linguistiques, le délai légal de trente jours pour une décision du CPAS (loi du
26 mai 2002, art. 21 § 1ᵉʳ), et le fait que les jours de fermeture supplémentaires du hall
omnisports apparaissent dans le fil quand le collège les arrête.
