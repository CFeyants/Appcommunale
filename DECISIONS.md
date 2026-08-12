# Décisions

Chaque arbitrage pris pendant la construction : l'option retenue, la règle du brief qui
l'a dictée, et ce qui aurait été fait autrement si la règle n'existait pas.

Tenu au fil de l'eau, dans l'ordre où les questions se sont posées.

---

## D1 — Le monorepo utilise npm workspaces, pas pnpm

**Retenu.** npm workspaces, déjà présent sur le poste.
**Règle qui l'a dicté.** Aucune. Le brief impose l'arborescence, pas le gestionnaire.
**Autrement.** pnpm, pour le lien symbolique strict entre paquets. Le gain aurait été nul
ici : quatre paquets, aucune dépendance transitive litigieuse.

## D2 — La version 1 est archivée, pas supprimée

**Retenu.** L'ancienne application Vite est déplacée dans `_archive-v1/`, exclue de git.
La référence reste le commit `1cb2fc9`.
**Règle qui l'a dicté.** « Rien du design actuel n'est conservé » — mais rien n'exige de
détruire. La suppression a d'ailleurs été refusée par le garde-fou de l'outillage, ce qui
était la bonne réaction.
**Autrement.** Un dépôt réellement neuf. L'historique git rend la distinction théorique.

## D3 — Tailwind v4 et composants écrits à la main plutôt que le CLI shadcn

**Retenu.** Les primitives Radix sont écrites dans `packages/ui`, à la structure de
shadcn/ui, mais habillées entièrement aux jetons du projet.
**Règle qui l'a dicté.** « shadcn/ui comme socle : code copié dans le dépôt et donc
modifiable » et « Je ne garde rien de l'existant ».
**Autrement.** Le CLI, qui aurait installé la palette shadcn par défaut — exactement ce
qu'il fallait éviter. Le CLI aurait aussi déposé les composants dans `apps/web`, alors que
le brief demande `packages/ui`.

## D4 — Aucun composant repris de 21st.dev

**Retenu.** Zéro composant importé.
**Règle qui l'a dicté.** « Ne colle jamais un composant sans le lire ligne à ligne, et
vérifie la licence de chacun. Un composant importé qui échoue aux critères d'accessibilité
du § 3.3 est réécrit ou abandonné. »
**Pourquoi.** Les blocs de ce registre sont conçus pour des pages de vente : nombres
héroïques multiples, animations d'entrée, cartes tarifaires. Trois des règles de rendu du
§ 3.3 — un seul nombre héroïque, aucune animation qui retarde la lecture, statut jamais
porté par la couleur seule — auraient demandé de tout réécrire. Le connecteur MCP est
disponible et a été laissé disponible pour la suite.
**Autrement.** Un ou deux blocs de mise en page repris pour gagner du temps sur l'écran
d'accueil.

## D5 — Graphiques tracés à la main en SVG, sans bibliothèque

**Retenu.** `BarreUnique`, `Jauge`, `Trajectoire`, `BarresComparaison` écrits en SVG.
**Règle qui l'a dicté.** § 3 : « marques fines, extrémités arrondies de 4 px, séparateurs
de 2 px dans la couleur du fond, grilles en filet, étiquettes directes plutôt qu'une valeur
sur chaque point ». Aucune de ces cinq contraintes n'est un paramètre des bibliothèques
courantes.
**Autrement.** Recharts, et deux jours passés à combattre ses valeurs par défaut.

## D6 — `CadreGraphique` lève une erreur si l'explication est vide

**Retenu.** Le composant refuse de rendre, en développement comme en production.
**Règle qui l'a dicté.** § 5.1 : « Aucun graphique ne part en production sans elle — un
test de rendu échoue si la propriété `explication` est vide. »
**Autrement.** Un avertissement en console, que personne n'aurait lu. La règle ne tient
dans le temps que si elle casse quelque chose.

## D7 — L'écran budget est bâti sur Eurostat, pas sur le budget communal

**Retenu.** Les dépenses publiques belges par fonction **et par sous-secteur**
(`gov_10a_exp`), qui se lisent exactement comme les cinq niveaux : administration centrale,
Communautés et Régions, administrations locales.
**Règle qui l'a dicté.** § 16 : « N'invente aucun chiffre pour remplir un écran. Une case
vide sourcée vaut mieux qu'une case pleine inventée. »
**Pourquoi.** Le budget de Kraainem n'est publié dans aucun format ouvert — quatre
tentatives documentées dans `IMPOSSIBLE.md`. Deux options s'ouvraient : un budget communal
illustratif aux chiffres inventés, ou un budget réel à une autre échelle. La seconde tient
la règle, et le contraste — la Belgique à l'euro près, la commune nulle part — est
précisément le propos du produit.
**Autrement.** Un budget communal illustratif, plus impressionnant et faux.

## D8 — L'absence du budget communal est un contenu, pas une note de bas de page

**Retenu.** Une section entière, avec les quatre tentatives et leur code de réponse HTTP.
**Règle qui l'a dicté.** § 10 : « Quand une donnée manque, publie l'absence », et § 14.3.
**Autrement.** Une phrase discrète. Ce qui aurait vidé l'écran de son intérêt.

## D9 — Le registre est rendu côté serveur, piloté par l'URL

**Retenu.** Onglet, recherche et page passent par les paramètres d'URL ; les 3 207 entrées
ne traversent jamais vers le navigateur.
**Règle qui l'a dicté.** § 3.3, mode hors ligne et forfait limité, et le « budget
d'attention » du brief initial.
**Mesure.** La page d'accueil est passée de 699 Ko à 120 Ko. Elle fonctionne en outre sans
JavaScript, et une recherche devient une adresse citable.
**Autrement.** Un état client, plus fluide au clic et six fois plus lourd.

## D10 — Le texte intégral d'un acte n'est affiché qu'après relecture humaine

**Retenu.** Un acte non reformulé montre son intitulé et le lien vers la source, pas son
texte.
**Règle qui l'a dicté.** Tension entre « au clic : la fiche complète, où rien n'est caché »
(§ 4.1) et la minimisation des données personnelles (§ 12).
**Pourquoi.** Les délibérations de Kraainem nomment des personnes privées : les couples
fêtant leurs noces d'or, avec leur nom, apparaissent dans le texte publié. Republier
automatiquement 2 751 textes non relus reviendrait à rediffuser ces noms sans que personne
ne l'ait décidé. Le § 4.1 vise les cartes du fil, qui sont toutes relues : pour elles,
rien n'est caché.
**Autrement.** Tout afficher, et découvrir le problème après coup.

## D11 — Les initiatives, questions et propositions sont de la démonstration étiquetée

**Retenu.** Un interrupteur dédié, un badge sur chaque objet, et un texte qui dit pourquoi.
**Règle qui l'a dicté.** § 16 : « Ne mets pas de données de démonstration dans un filtre :
interrupteur dédié et badge. »
**Pourquoi.** Aucune commune belge ne publie ses projets sous forme de jalons datés avec
budget consommé. Sans ces fiches, le gabarit n'existerait pas ; avec elles non étiquetées,
la plateforme mentirait.
**Autrement.** Des sections vides. Plus honnête à première vue, moins utile pour montrer
ce que la structure attend.

## D12 — L'absence du règlement de participation est une observation, pas une supposition

**Retenu.** « Cette commune n'a pas encore adopté son règlement de participation », avec la
méthode de vérification affichée : recherche des termes *participatie*, *burgerinitiatief*,
*verzoekschrift* et *inspraak* dans cinq ans de séances du conseil.
**Règle qui l'a dicté.** § 5.4, « le point le plus important de tout ce document, et je ne
le négocierai pas ».
**Autrement.** Ne rien dire, faute de certitude. La méthode affichée permet à quiconque de
contredire le constat, ce qui est mieux que le silence.

## D13 — Aucune jauge vers un seuil de soutiens

**Retenu.** Le compteur de soutiens s'affiche sans barre de progression.
**Règle qui l'a dicté.** § 16 : « Ne présente jamais un nombre de pouces comme une
obligation d'inscrire un point à l'ordre du jour. »
**Pourquoi.** Une jauge suppose un seuil. Kraainem n'en a fixé aucun. Dessiner une
progression vers un seuil inexistant serait une promesse fabriquée.

## D14 — Le non-recours est placé en premier, et il est vide

**Retenu.** Premier des quatorze indicateurs, mis en avant visuellement, sans donnée.
**Règle qui l'a dicté.** § 5.5 : « Le non-recours est le plus intéressant des sept : c'est
le seul qui mesure un échec de l'institution plutôt qu'un effort. Mets-le en premier. »
**Autrement.** Le reléguer, faute de chiffre. C'est précisément l'inverse de ce qu'il faut
faire : son absence est l'information.

## D15 — La portée `eid` d'itsme n'est pas demandée

**Retenu.** Quatre portées : `openid`, `service`, `profile`, `address`.
**Règle qui l'a dicté.** § 2.1 : « Le numéro de registre national est en Belgique une donnée
dont l'usage est encadré : ne le stocke pas », et § 12, minimisation stricte.
**Comment c'est tenu.** La conversion en session jette tout le reste en un seul endroit, et
un test parcourt le dépôt entier à la recherche d'un stockage de numéro national.
**Autrement.** Demander `eid` « au cas où ». C'est exactement la commodité technique que le
brief interdit.

## D16 — Un intérêt déduit pèse la moitié d'un thème déclaré

**Retenu.** Le consentement B est livré, avec ce plafond.
**Règle qui l'a dicté.** § 2.2 : la déduction est autorisée sous cinq conditions. Aucune
n'impose ce plafond — c'est un arbitrage.
**Pourquoi.** Sans plafond, la déduction finirait par dominer la déclaration, et la règle
« les intérêts sont déclarés » tomberait par la porte de service. Le plafond est testé.
**Autrement.** Un poids égal, plus simple et moins défendable.

## D17 — Le signalement produit un document, sans acheminement

**Retenu.** Un fichier daté, fabriqué dans le navigateur, avec le destinataire suggéré et
le délai légal. Puis une relance à trente jours et la publication du délai observé.
**Règle qui l'a dicté.** § 8.3, décision déjà tranchée par le brief.
**Autrement.** Un formulaire d'envoi. Ce qui aurait créé une attente que nous ne contrôlons
pas, et fait porter à la plateforme la déception d'une commune qui ne traite pas.

## D18 — Les entreprises viennent d'OpenStreetMap, pas de la Banque-Carrefour

**Retenu.** 179 établissements OSM, avec l'origine expliquée en tête de section.
**Règle qui l'a dictée.** § 7.2 : « la liste elle-même peut être réelle, et doit l'être. »
**Pourquoi.** Le fichier KBO Open Data exige une inscription nominative : HTTP 302 vers une
page d'authentification. C'est l'un des trois cas où le brief demande de s'arrêter — voir
`IMPOSSIBLE.md`, point I2.
**Autrement.** Attendre l'inscription, et livrer un écran vide.

## D19 — Le rendement des coopératives est affiché comme non publié

**Retenu.** Aucune série de dividendes n'est affichée ; à la place, la raison et l'endroit
où le chiffre existe réellement.
**Règle qui l'a dicté.** § 8.1 : « Rendement observé, jamais plafond légal », et § 16 :
« N'invente aucun chiffre. »
**Autrement.** Reprendre des pourcentages lus quelque part. Un rendement approximatif
affiché sur une fiche d'épargne est une promesse, et le brief l'interdit deux fois.

## D20 — Quinze reformulations, et le rapport est affiché

**Retenu.** Quinze actes réels reformulés à la main, et une section « le vrai coût, dit
sans détour » qui affiche le rapport 15 sur 3 207.
**Règle qui l'a dicté.** § 13, lot 3 : « dix items reformulés à la main pour prouver le
gabarit ».
**Pourquoi le dire.** Cacher le rapport laisserait croire que le fil se remplit tout seul.
Il ne se remplit pas tout seul : il demande une personne. C'est le fait le plus important
sur la viabilité du produit.

## D21 — Les données de démonstration sont visibles par défaut

**Retenu.** L'interrupteur existe, et il est sur « afficher ».
**Règle qui l'a dicté.** § 16 impose l'interrupteur et le badge, pas la position par
défaut.
**Pourquoi.** Une section vide sans explication est moins honnête qu'une section pleine et
étiquetée : le visiteur ne saurait pas s'il manque une donnée ou une fonction.
**Autrement.** Masqué par défaut, ce qui rendrait trois sections vides sur l'écran budget.

## D22 — Les captures d'écran sont un livrable versionné

**Retenu.** 56 images produites par un script reproductible, dans `/captures`.
**Règle qui l'a dicté.** § 17, dernier critère d'acceptation.
**Autrement.** Des captures prises à la main, invérifiables et périmées à la première
modification.

---

## Deux défauts trouvés en cours de route, et corrigés

Ils méritent d'être écrits : ce sont des erreurs, pas des arbitrages.

**Les classes utilitaires de `packages/ui` n'étaient pas scannées.** La détection
automatique de Tailwind part du dossier de compilation, donc de `apps/web`. Toutes les
classes écrites dans `packages/ui` étaient silencieusement absentes de la feuille produite.
Le défaut est sournois : un composant paraît correct tant qu'il n'utilise que des classes
présentes ailleurs. Il a été trouvé parce que la barre du graphique budgétaire avait une
hauteur de zéro pixel — mesurée dans le navigateur, pas devinée. Corrigé par deux
directives `@source` explicites.

**Un même point d'agenda est rattaché à plusieurs séances.** La première collecte a compté
6 799 points là où il y en a 3 207. Sans déduplication, chaque acte serait apparu deux fois
dans le fil et toutes les statistiques auraient été fausses. Le connecteur déduplique
désormais, en gardant l'occurrence liée à la liste des décisions.
