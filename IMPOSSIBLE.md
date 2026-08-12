# Ce que les sources ne permettent pas de tenir

Chaque exigence du brief que les sources réelles ne permettent pas de satisfaire, avec ce
qui a été livré à la place. Écrit au moment de la découverte.

Toutes les vérifications datent du **12 août 2026** et ont été faites depuis le poste de
développement. Les codes de réponse sont ceux réellement obtenus.

---

## I1 — Le budget communal n'est publié dans aucun format ouvert

**Exigé.** § 5.1 : un nombre héroïque par niveau, une barre en parties du tout, des jauges
voté / engagé / exécuté, une comparaison par habitant avec des communes voisines.

**Constaté.** Le budget de Kraainem — comme celui de toute commune flamande — n'est
accessible dans aucun jeu de données ouvert et réutilisable.

| Tentative | Réponse |
|---|---|
| `provincies.incijfers.be/jiveservices/odata/DataSources` | **HTTP 401** — identifiants requis |
| `data.gov.be/api/3/action/package_search` | page HTML, aucune API CKAN au chemin standard |
| `opendata.vlaanderen.be/dataset?q=BBC` | **HTTP 302** vers une page sans interface programmable |
| `lokalestatistieken.vlaanderen.be` | aucune réponse |
| `www.vlaanderen.be/datavindplaats` | application JavaScript, catalogue non atteignable par appel |

Le jeu « Digitale Rapporteringen BBC — wekelijks », cité dans le brief initial avec l'uuid
`74607c08-e7de-48e5-8c53-5ab878542680`, n'a pas pu être localisé.

**Livré à la place.** Les dépenses publiques belges réelles, par fonction CFAP **et par
sous-secteur**, depuis Eurostat (`gov_10a_exp`). Les sous-secteurs se lisent exactement
comme les niveaux de la plateforme : administration centrale (172 202 M€ en 2024),
Communautés et Régions (124 997 M€), administrations locales (44 397 M€). Le nombre
héroïque, la barre en parties du tout, l'explication au clic et le basculement par habitant
sont donc réels.

Les **jauges voté / engagé / exécuté** ne sont pas alimentées : Eurostat publie l'exécuté,
et rien d'autre. Le composant existe et sert aux initiatives.

La **comparaison par habitant entre communes voisines** n'est pas livrée : elle suppose la
donnée communale, qui n'existe pas. Le composant `BarresComparaison` est écrit et testé,
prêt à recevoir la donnée le jour où elle s'ouvrira.

Et surtout, l'absence est publiée : une section entière de l'écran budget dit qui devrait
produire cette donnée et ce qui a été tenté.

---

## I2 — La Banque-Carrefour des Entreprises exige une inscription nominative

**Exigé.** § 7.2 : « Ce qui peut être réel, et doit l'être : la liste elle-même. Charge le
sous-ensemble de Kraainem, avec les vrais numéros, les vraies dénominations, les vraies
adresses. »

**Constaté.** `kbopub.economie.fgov.be/kbo-open-data/…` répond **HTTP 302** vers une page
d'authentification. Le fichier ouvert existe et est gratuit, mais son téléchargement passe
par un compte nominatif que seul l'utilisateur peut créer.

**C'est l'un des trois cas où le brief demande de s'arrêter** — « un accès à une source qui
exige une convention ou une clé que je dois demander ». Il faut donc une action de Cédric :
créer le compte KBO Open Data et fournir les identifiants de téléchargement.

**Livré à la place.** 179 établissements ouverts au public relevés sur OpenStreetMap via
l'API Overpass (licence ODbL 1.0, attribution affichée). L'origine de la liste est
expliquée en tête de section, avec le code de réponse HTTP obtenu et le taux de complétude
réel. Le connecteur BCE est écrit comme si l'accès existait : seul l'adaptateur de
téléchargement reste à brancher.

**Ce qui reste vrai malgré tout.** Le compteur de déclarations — « 0 entreprise sur 179 a
publié ses données » — est exact quelle que soit l'origine de la liste, puisque aucune
entreprise ne publie ces données nulle part.

---

## I3 — Les chiffres environnementaux des entreprises n'existent pas

**Exigé.** § 7.2 le dit lui-même : « Ce qui ne peut pas être réel, et qu'il est interdit
d'inventer. »

**Constaté.** Confirmé. Le point d'accès unique européen aux informations financières et de
durabilité ouvre le **10 juillet 2027**, par vagues, et ne couvrira pas les petites
entreprises d'une commune de dix mille habitants.

**Livré.** Exactement ce que le brief demande : chaque fiche affiche « n'a rien déclaré »,
et le compteur en tête est le nombre héroïque de l'écran. Le vide est le message.

---

## I4 — Aucun objectif chiffré et daté aux trois niveaux intermédiaires

**Exigé.** § 6 : la vision de chaque niveau, avec ses cibles chiffrées et datées.

**Constaté.** Le brief l'annonçait — « prépare-toi à trouver très peu » —, et c'est pire
que prévu :

| Niveau | Objectifs datés et chiffrés | Domaines de compétence |
|---|---|---|
| Commune de Kraainem | **0** | 14 |
| Communauté flamande | **0** | 6 |
| Région flamande | **0** | 12 |
| État fédéral | 1 | 11 |
| Union européenne | 3 | 32 |

Le plan pluriannuel communal existe et son adoption apparaît dans le fil ; son contenu
n'est publié ni en données ouvertes ni dans un format dont on puisse extraire des cibles.
Le plan flamand énergie-climat comporte des cibles, mais uniquement en PDF, sans
identifiant stable ni série de mesures — elles ne peuvent pas être suivies
automatiquement, et n'entrent donc pas.

**Livré.** Quatre objectifs réels, chacun avec son article, son identifiant ELI et sa
genèse retracée. Une trajectoire réellement mesurée : les émissions belges de 1990 à 2024,
35 années, avec l'écart à la cible calculé. Et le décompte ci-dessus affiché comme nombre
héroïque de l'écran : **4 objectifs sur 75 domaines de compétence**.

---

## I5 — Aucun objectif de mandature nulle part

**Exigé.** § 6 : « les objectifs de la mandature en cours », comme second horizon.

**Constaté.** Aucun des cinq niveaux ne publie d'objectif de mandature avec cible chiffrée
et échéance dans un format vérifiable. Les déclarations de gouvernement contiennent des
intentions, pas des cibles suivies.

**Livré.** La section existe, séparée de la vision longue comme l'exige le brief, et
affiche l'absence. Les deux horizons ne sont jamais mélangés — y compris quand l'un est
vide.

---

## I6 — Aucun flux ouvert pour le calendrier des déchets

**Exigé.** § 8.3 : « la fonction la plus ouverte de toutes ces applications, sans exception
connue ».

**Constaté.** Interza publie son calendrier sur son site et dans son application, sans
interface programmable documentée. Aucune convention n'existe. `kraainem.be` interdit les
outils automatisés par son `robots.txt`, et n'a donc pas été sollicité.

**Livré.** L'absence affichée avec le nom de l'intercommunale, le lien vers le calendrier
officiel, et le schéma du flux qu'il faudrait demander, rédigé dans
[`docs/dechets-interza.md`](docs/dechets-interza.md). L'interrupteur de notification existe
dans les préférences et porte l'avertissement qu'elle ne peut pas encore être envoyée.

**Pourquoi ne pas reconstituer.** Une erreur de reconstitution fait manquer une collecte à
quelqu'un, et la plateforme porterait la faute d'une donnée qu'elle n'a pas reçue.

---

## I7 — Aucun flux ouvert pour les chantiers de voirie

**Exigé.** § 8.3 : les alertes travaux dans un rayon choisi, avec date de fin et itinéraire
de déviation.

**Constaté.** Les chantiers sur voirie régionale figurent dans GIPOD, dont l'accès est
réservé aux gestionnaires de voirie. Les chantiers communaux ne sont publiés que sous forme
d'arrêtés de police, sans géométrie exploitable.

**Livré.** L'absence affichée. En compensation partielle et réelle : les fermetures de rue
décidées par le collège **apparaissent dans le fil**, puisqu'elles passent par un règlement
de police temporaire publié sur Lokaal Beslist. Deux d'entre elles sont reformulées et
visibles.

---

## I8 — Aucun registre agrégé des séances, formations et stages

**Exigé.** § 8.3, dernier alinéa : les inscriptions en un formulaire unique et minimal.

**Constaté.** Aucun registre agrégé n'existe. Chaque organisateur publie de son côté.

**Livré.** La couverture réelle est affichée : **zéro séance** sur un nombre inconnu. Aucun
faux bouton d'inscription n'est présenté.

---

## I9 — Le texte des délibérations est souvent l'intitulé recopié

**Exigé.** § 4.1 : « la fiche complète, où rien n'est caché — texte intégral publié par
l'autorité dans sa langue ».

**Constaté.** Sur 2 751 actes collectés, **559** ont un champ texte identique à leur
intitulé, et **0** exposent leurs articles par la relation prévue à cet effet. Seuls **736**
contiennent une motivation rédigée sous forme d'articles. La commune publie sa liste de
décisions, pas la structure de ses règlements.

**Livré.** La fiche affiche le texte quand il existe et le dit quand il n'existe pas, avec
le lien vers ce que l'autorité publie réellement. Le défaut est remonté dans la fiche de
source et dans la proposition adressée à iMio, comme un défaut à ne pas reproduire en
Wallonie.

---

## I10 — itsme exige un enrôlement auprès de Belgian Mobile ID

**Exigé.** § 2.1 : la connexion itsme, en environnement de test comme en production.

**Constaté.** L'accès aux deux environnements passe par un enrôlement contractuel auprès de
Belgian Mobile ID. C'est le deuxième des trois cas où le brief demande de s'arrêter.

**Livré.** Le mode démonstration au contrat réel, comme le brief l'autorise
explicitement : les portées demandées sont celles d'itsme, les revendications portent les
noms exacts d'OpenID Connect, et le branchement réel consiste à remplacer le fournisseur.
Un bandeau « simulation — aucune donnée réelle » précède le bouton de connexion et reste
affiché pendant toute la session.

---

## I11 — Le non-recours aux aides n'est mesuré nulle part

**Exigé.** § 5.5 : l'indicateur social le plus important, à mettre en premier.

**Constaté.** Personne ne mesure le non-recours à l'échelle communale en Belgique. Le
calcul suppose deux nombres : les ayants droit estimés et les bénéficiaires réels. Le second
existe chez le CPAS ; le premier n'est estimé par aucune administration.

**Livré.** L'indicateur est en première position, mis en avant visuellement, et affiche son
absence avec le nom des organismes qui devraient la produire. Douze des quatorze
indicateurs proposés sont dans ce cas : deux seulement sont mesurables aujourd'hui.

---

## I12 — La comparaison entre communes voisines par habitant

**Exigé.** § 5.1, dernier terme de la manipulation budgétaire.

**Constaté.** Conséquence directe de I1 : sans budget communal ouvert pour Kraainem, il n'y
en a pas davantage pour Wezembeek-Oppem, Zaventem, Tervuren, Wemmel ou Rhode-Saint-Genèse.

**Livré.** Rien sur cet écran. La liste des communes comparables et leur population sont en
place dans `packages/core/src/territoires.ts`, et le composant de comparaison est écrit :
il reste un jour de travail le jour où la donnée s'ouvre.

---

## Récapitulatif : ce qu'il faudrait pour lever ces points

| Point | Ce qu'il faut | Qui peut l'obtenir |
|---|---|---|
| I1, I12 | accès aux rapportages BBC des pouvoirs locaux | demande à l'Agentschap Binnenlands Bestuur |
| I2 | compte KBO Open Data et identifiants de téléchargement | **Cédric — inscription nominative** |
| I6 | flux iCalendar ou JSON du calendrier de collecte | demande à Interza — schéma rédigé |
| I7 | accès GIPOD en lecture, ou publication communale géolocalisée | demande à la commune et à l'AWV |
| I10 | enrôlement itsme auprès de Belgian Mobile ID | **Cédric — engagement contractuel** |
| I4, I5 | publication des plans en données ouvertes | demande aux niveaux concernés |
| I9 | publication des articles de règlement | demande à la commune ; déjà écrit pour iMio |
| I3, I11 | rien à demander : la donnée n'existe pas encore | attendre 2027, ou la construire |
