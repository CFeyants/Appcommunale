# Rapport — Lot 4 : budget et initiatives

## Livré

- **Budget manipulable** sur données réelles d'Eurostat (`gov_10a_exp`) : quatre exercices,
  quatre niveaux de pouvoir, dix fonctions CFAP déroulables en sous-lignes, basculement
  entre montant total et montant par habitant. Chaque manipulation est réversible d'un seul
  bouton « revenir à la vue initiale ».
- **Tout chiffre est cliquable, et le clic explique** : ce que la ligne recouvre, la
  nomenclature d'origine non retraitée, ce que le chiffre ne dit pas, ce qui relève de la
  décision locale, et la source. Dix explications rédigées, une par fonction CFAP.
- **Une explication écrite sous chaque graphique**, imposée par le code : `CadreGraphique`
  lève une erreur si l'une des quatre parties est vide.
- L'absence du budget communal traitée comme un contenu, avec les quatre tentatives et leur
  code de réponse HTTP.
- **Initiatives** : état parmi cinq valeurs, jalons datés, budget voté et consommé, service
  et **fonction** responsables — jamais un nom de personne.
- **Questions publiques** : question et réponse publiques, pouce « j'ai la même question »
  qui compte des personnes et n'affecte aucun ordre, délai d'attente affiché quand il n'y a
  pas de réponse.
- **Modération** publiée et versionnée sur `/fr/moderation` : cinq critères, quatre
  garanties, registre mensuel.
- **Propositions citoyennes** avec le traitement juridique complet du § 5.4.

## Le point du § 5.4, traité intégralement

Le brief le désignait comme « le point le plus important de tout ce document ».

- Fondement cité : **Decreet over het lokaal bestuur, article 304, § 5**, avec le lien vers
  le texte.
- Constat : Kraainem **n'a pas adopté** son règlement de participation.
- Méthode de vérification affichée : recherche des termes *participatie*,
  *burgerinitiatief*, *verzoekschrift* et *inspraak* dans les intitulés des points du
  conseil communal depuis mai 2021. C'est une observation, pas une supposition, et
  quiconque peut la contredire.
- Le soutien est présenté comme un signal public non contraignant, avec la formule imposée
  affichée telle quelle.
- **Aucune jauge vers un seuil** : il n'en existe aucun, et en dessiner un serait fabriquer
  une promesse (décision D13).
- Le canal officiel de dépôt est indiqué ; la plateforme prépare, elle ne se substitue pas.

## Critères d'acceptation

| Critère | État | Vérification |
|---|---|---|
| Budget manipulable avec explication au clic | ✅ | `/fr/budget`, panneau d'explication |
| Aucun graphique sans texte d'explication | ✅ | `CadreGraphique` lève ; test parcourant les fichiers |
| Initiatives avec jalons datés, jamais un pourcentage | ✅ | aucun champ de pourcentage dans `InitiativeSchema` |
| Jamais de note ni de classement d'une personne | ✅ | seules des fonctions sont nommées ; test sur les tris |
| Questions publiques, pouce compteur, modération humaine | ✅ | `/fr/budget`, `/fr/moderation` |
| Propositions avec le traitement de l'art. 304 § 5 | ✅ | bloc juridique en tête de section |
| Comparaison par habitant avec communes voisines | ❌ | voir ci-dessous |
| Jauges voté / engagé / exécuté sur le budget public | ❌ | voir ci-dessous |

## Volume réel

- 4 exercices × 4 sous-secteurs × 80 lignes CFAP = données réelles pour 2021 à 2024.
- Belgique 2024, tous niveaux : **335 288 M€**, soit **28 215 € par habitant**.
- Administrations locales 2024 : **44 397 M€** — agrégat national, pas Kraainem.
- 3 initiatives, 3 questions, 2 propositions : démonstration étiquetée, interrupteur dédié.

## Critères échoués, et pourquoi

**La comparaison par habitant entre communes voisines n'est pas livrée.** Elle suppose le
budget communal, qui n'est publié dans aucun format ouvert — quatre tentatives documentées
dans [`IMPOSSIBLE.md`](IMPOSSIBLE.md), point I1. La liste des communes comparables et leur
population sont en place ; le composant `BarresComparaison` est écrit et testé.

**Les jauges voté / engagé / exécuté ne sont pas alimentées** sur le budget public :
Eurostat publie l'exécuté et rien d'autre. Le composant `Jauge` existe et sert aux
initiatives.

## Écart assumé

Initiatives, questions et propositions sont de la démonstration. Aucune commune belge ne
publie ses projets sous forme de jalons datés avec budget consommé. Chaque objet porte un
badge, et un interrupteur dédié — jamais un filtre partagé — permet de tout masquer, ce qui
montre alors ce que la plateforme possède réellement : rien.
