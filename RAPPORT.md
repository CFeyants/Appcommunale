# Rapport — extension « Espace entreprise »

16 août 2026. Extension de la plateforme citoyenne existante, sans onglet ajouté
à la barre citoyenne et sans écran renommé.

L'application disait de chacune des 179 entreprises de la commune qu'elle
« n'a rien déclaré ». Voici l'endroit où elle déclare.

---

## Ce qui est fait

### Le module de calcul, écrit avant toute interface

`packages/core/src/bareme.ts`, module pur, nommé sur `/fr/bareme` comme
`pertinence.ts` l'est sur `/fr/classement`. **23 tests**, le test de somme nulle
en premier.

| Règle | Où elle est tenue |
|---|---|
| Somme des soldes exactement nulle | arrondi distribué en centimes, reliquat porté par le plus gros contributeur ; testé sur des valeurs choisies pour tomber mal |
| Référence pondérée par les volumes | c'est cette définition, et elle seule, qui rend la somme nulle |
| On soustrait le prix acquitté, on ne retire jamais la ligne | `residuCarbone` ; une ligne à résidu nul reste au calcul avec le prix déjà payé en regard |
| Aucun montant sans sa chaîne | `impactMonetise` ne renvoie que `{ totalEur, lignes }` ; aucune surcharge ne donne le seul nombre |
| Le forfait porte sur un contrat | `Forfait` n'existe que dans `LigneCalcul` ; aucun type d'entreprise ne peut en porter un |
| Le seuil se calcule | `seuilDeclaration` renvoie la chaîne du quotient |
| Indice d'accident sur trois ans | sous trois ans, aucun indice ; accidents plafonnés à 120 jours ; intérimaires au dénominateur |
| Aucun rang, aucune agrégation en note | un test parcourt les exports du module |
| Aucun arrondi qui masque un ordre de grandeur | `arrondiSignifiant` garde deux chiffres significatifs |

Deux tests supplémentaires ont été ajoutés au jeu de règles existant :

- **aucun filtre du code ne porte sur un pays d'origine** — il parcourt tout le
  dépôt à la recherche des formes qui trahiraient un filtre par provenance ;
- **la fiche publique n'affiche aucun montant forfaitaire** — il lit
  `entreprises.tsx` et échoue si le fichier mentionne `forfait`,
  `impactMonetise`, `FORFAITS` ou `bareme`.

**53 tests au total, tous verts.**

### Côté citoyen

| Écran | Route | Ce qu'il apporte |
|---|---|---|
| Le barème | `/fr/bareme` | dans la couche de transparence, sœur de `/fr/classement` : valeur du carbone et sa trajectoire à trois ans, prix du quota, forfaits, seuil **avec son calcul**, indice d'accident, historique des versions, et ce que le barème **ne fait pas** |
| Ce que la commune achète | `/fr/budget/achats` | sous-écran de Budget : lacune déclarée en tête, classement des leviers, quatre marchés avec prix payé et coût complet, chaîne de calcul poste par poste, contestation publique, et ce que la commune s'applique à elle-même |
| Ce qui pèse | `/fr/impact/ce-qui-pese` | sous-écran de Mon impact : paliers, part collective en premier, colonne « qui peut le faire », liens vers ce qui empêche, bas du classement nommé comme faible |

### Le résultat que l'écran des achats existe pour montrer

> Le chauffage des bâtiments communaux pèse **149 682 €**, soit plus que la
> voirie, les repas et le nettoyage réunis — **61 136 €**.

Ce n'est pas une opinion : c'est le même calcul appliqué aux cinq postes, et il
est écrit au-dessus du graphique, pas en dessous.

Le classement passe **avant** la liste des marchés, contre l'ordre littéral du
prompt et pour la raison qu'il donne lui-même : « sans ce classement, on discute
des sacs poubelle pendant que le chauffage tourne ». En bas de page, personne ne
l'aurait vu.

### L'espace entreprise

Séparé : navigation latérale propre, accent vert, barre supérieure de bascule,
bandeau de démonstration permanent, et **la barre citoyenne à cinq entrées
disparaît** — deux navigations concurrentes disaient l'inverse du changement de
produit.

| Écran | Ce qu'il fait |
|---|---|
| Tableau de bord | quatre blocs, dont **« Ce que le silence me coûte »** en premier : 34 300 € par an, rubrique par rubrique |
| Ma déclaration | les onze rubriques B1 à B11 du module de base européen, **sans aucun champ ajouté** ; forfait pré-rempli, coût affiché, bouton « je fais mieux », gain immédiat, export JSON au schéma ouvert déjà décrit sur `/fr/impact` |
| Mes marchés | impact avec valeurs déclarées, au forfait, différence, et une colonne qui dit clairement quand un marché est **sous le seuil** — rien à fournir |
| Le simulateur | les **quatre instruments par puissance croissante**, leviers, délai de retour, trois scénarios, trajectoire de la référence, stock contre flux sur vingt ans |
| Mes pièces | validité, rubriques appuyées, et l'alerte **avant** l'échéance |
| Bonus-malus | maquette **non branché**, somme nulle démontrée, aucun rang, aucun nom |

L'entrée se fait depuis la fiche publique de `/fr/impact` : *Vous êtes cette
entreprise ? Déclarez ici.*

### Les quatre instruments, rendus visibles

Le simulateur ne modélise pas un seul instrument mais quatre, numérotés et
rangés par puissance croissante : la pondération qui **déplace à la marge**, la
spécification qui **élimine**, la demande qui **décide avant l'achat**, et le
stock qui **bat le flux**. Le plafond d'empreinte par mètre cube de béton et la
clause d'âge de résistance à cinquante-six jours y figurent, avec leurs limites
— sans lesquelles la recommandation serait fausse.

### Les coulisses

Trois parcours joués pas à pas, en trois colonnes : l'habitant, la donnée et son
trajet, l'entreprise. Le troisième — l'accident du travail — rend l'asymétrie
visible : à chaque étape, un encart dit **ce qui ne circule pas, et pourquoi
c'est un choix**.

---

## Ce qui est simulé

| Objet | État |
|---|---|
| Les quatre marchés et leurs montants | **fictifs**, badge à l'écran, lacune déclarée en tête |
| Le patrimoine communal, la flotte, les déchets | **fictifs**, badge sur chaque ligne du classement |
| Les deux premières lignes du classement des leviers | **réelles** — relevés Fluvius du territoire |
| L'entreprise, ses marchés, ses pièces, ses déclarations | **fictifs**, nom fictif, bandeau permanent |
| Les quatre forfaits sectoriels | **fictifs** — aucune administration belge n'en publie |
| Valeur du carbone, prix du quota, facteurs d'émission | **paramètres relevés à la main**, datés, avec `verifieParAppel: false` et la raison |
| Le bonus-malus | **non branché**, comme le paiement enrichi |
| Les contestations | déposées sur l'appareil ; l'écran écrit que ce n'est pas encore public |

---

## Ce qui manque

1. **Les montants des marchés.** Rien ne les publie. C'est la lacune qui limite
   tout l'écran des achats.
2. **Une source pour les forfaits sectoriels.** La règle est écrite, la matière
   n'existe pas.
3. **Un serveur d'écriture.** Sans lui, ni contestation publique, ni déclaration
   réellement transmise, ni délai de réponse mesuré.
4. **Les traductions.** Six libellés de navigation en trois langues ; les corps
   des nouveaux écrans sont en français, comme les pages transversales
   existantes. À Kraainem, commune à facilités, cette dette coûtera.
5. **Une vérification par appel** de la valeur tutélaire et du prix du quota.

Le détail est dans `IMPOSSIBLE.md`, points I13 à I20.

---

## Les trois choses à faire ensuite

**1. Obtenir les montants des marchés.** C'est le seul verrou qui empêche
`/fr/budget/achats` de passer de la démonstration au réel. Les montants existent
— ils sont dans les délibérations que la commune n'expose pas. La demande est
recevable : elle porte sur des documents déjà publics, et le format attendu tient
en quatre champs. C'est la même manœuvre que la proposition adressée à iMio pour
la Wallonie.

**2. Construire le forfait sectoriel avec une fédération, pas contre elle.** Le
forfait au quantile haut est le moteur du dispositif : sans lui, le silence est
gratuit. Mais une commune ne peut pas le fabriquer seule sans être attaquable. La
voie est une fédération professionnelle qui publie la distribution de sa branche
— elle y a intérêt, parce que le forfait défavorable pénalise ses membres les
plus performants tant qu'ils ne déclarent pas.

**3. Éprouver le seuil sur de vraies entreprises.** Le seuil se calcule, et son
calcul est juste ; mais l'une de ses deux entrées — le coût annualisé d'une
déclaration — est une estimation. Dix entretiens avec des petites entreprises de
voirie et de restauration collective vaudraient plus que dix écrans
supplémentaires. Si ce coût est le double de l'estimation, le seuil double, et la
moitié des marchés sort du dispositif.

---

## Vérification

```
npm test         53 tests, 53 verts
npm run build    73 pages, aucune erreur de type
```

Routes ajoutées, toutes en HTTP 200 en français, néerlandais et anglais :
`/bareme`, `/budget/achats`, `/impact/ce-qui-pese`, `/entreprise`,
`/entreprise/declaration`, `/entreprise/marches`, `/entreprise/simulateur`,
`/entreprise/pieces`, `/entreprise/bonus-malus`, `/coulisses`, et leurs exports
`.json`.
