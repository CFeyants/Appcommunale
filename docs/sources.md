# Fiches des sources

Une fiche par connecteur : point d'accès, licence, cadence, limites connues, date de
dernière vérification. Toutes les vérifications ci-dessous ont été faites depuis le poste
de développement le **12 août 2026**, et les résultats sont ceux réellement obtenus.

L'état courant de chaque connecteur — dernière collecte réussie, nombre d'items, panne
éventuelle — est publié en ligne sur `/fr/sources`, et exporté sur `/fr/sources.json`.

---

## 1. Lokaal Beslist — décisions locales flamandes

| | |
|---|---|
| **Organisme** | Agentschap Binnenlands Bestuur (Autorité flamande) |
| **Point d'accès** | `https://lokaalbeslist.vlaanderen.be/sessions` |
| **Authentification** | aucune |
| **En-tête obligatoire** | `Accept: application/vnd.api+json` |
| **Licence** | Modellicentie Gratis Hergebruik — mention de la source obligatoire |
| **Cadence** | quotidienne, la nuit |
| **Vérifié le** | 12 août 2026 |

**Chemin réel de la donnée.** Il n'existe aucun raccourci :

```
sessions → agenda-items → handled-by → resolutions → articles
(Zitting)  (Agendapunt)   (Behandeling) (Besluit)     (Artikel)
```

**Résultat de la collecte** (Kraainem, 1ᵉʳ août 2024 → 12 août 2026) :

| Mesure | Valeur |
|---|---|
| Séances annoncées par la source, tous exercices | 1 069 |
| Séances collectées sur la fenêtre | 400 |
| Points d'agenda uniques | 3 207 |
| Points portant un acte | 2 751 |
| Actes dont le texte diffère de l'intitulé | 2 192 |
| Actes contenant des articles rédigés (« Artikel 1 : … ») | 736 |
| Actes exposant des articles par la relation `articles` | **0** |
| Appels HTTP pour la collecte complète | 17 988 |

**Limites connues.**

- `/resolutions` n'accepte aucun filtre par commune : **HTTP 406 Not Acceptable**.
- `include=` échoue en **HTTP 500** sur cette instance ; la résolution se fait point par
  point, d'où le nombre d'appels.
- La relation `articles` renvoie zéro pour toutes les délibérations de Kraainem : la
  commune publie sa liste de décisions, pas la structure de ses règlements.
- Un même point d'agenda est rattaché à plusieurs séances — celle qui publie l'ordre du
  jour et celle qui publie la liste des décisions. Sans déduplication, on compte 6 799
  points au lieu de 3 207. Le connecteur déduplique et privilégie l'occurrence liée à la
  liste des décisions.
- Les intitulés sont en néerlandais, y compris pour une commune à facilités.
- Aucun vote nominatif n'est publié pour Kraainem sur la période observée.

---

## 2. Eurostat — dépenses publiques et émissions

| | |
|---|---|
| **Organisme** | Eurostat, Commission européenne |
| **Points d'accès** | `.../statistics/1.0/data/gov_10a_exp`, `.../env_air_gge`, `.../demo_pjan` |
| **Authentification** | aucune |
| **Format** | JSON-stat 2.0 |
| **Licence** | réutilisation autorisée — décision 2011/833/UE |
| **Cadence** | annuelle |
| **Vérifié le** | 12 août 2026 |

**Pourquoi ce connecteur porte l'écran budget.** La donnée budgétaire communale belge
n'est pas ouverte (voir § 6). Eurostat, lui, publie la dépense publique belge par fonction
**et par sous-secteur**, et ces sous-secteurs se lisent exactement comme nos niveaux :

| Code | Libellé Eurostat | Niveau de la plateforme | Exercice 2024 |
|---|---|---|---|
| `S13` | ensemble des administrations publiques | tous | 335 288 M€ |
| `S1311` | administration centrale | Belgique | 172 202 M€ |
| `S1312` | administrations d'États fédérés | Communauté et Région | 124 997 M€ |
| `S1313` | administrations locales | Commune (agrégat national) | 44 397 M€ |

**Trajectoire des émissions** — `env_air_gge`, `airpol=GHG`, `src_crf=TOTX4_MEMO`,
`unit=MIO_T` : série complète de 1990 à 2024, soit 35 années. Référence 1990 : 145,47 Mt.
Dernière mesure 2024 : 98,01 Mt.

**Limites connues.**

- Agrégat national : « administrations locales » couvre les 581 communes belges ensemble.
- Décalage d'environ dix-huit mois sur les comptes publics.
- La classification CFAP n'est pas la nomenclature BBC des communes flamandes : les deux ne
  se recouvrent pas ligne à ligne.
- Eurostat publie l'exécuté, jamais le voté ni l'engagé.
- Les codes de dimension sont instables entre jeux : `src_crf=TOTX4_MEMONIA` et `unit=I90`,
  cités dans plusieurs documentations, ne renvoient rien ; les codes valides sont
  `TOTX4_MEMO` et `MIO_T`.

---

## 3. EUR-Lex / CELLAR — actes de l'Union

| | |
|---|---|
| **Organisme** | Office des publications de l'Union européenne |
| **Point d'accès** | `https://publications.europa.eu/webapi/rdf/sparql` |
| **Authentification** | aucune |
| **Licence** | réutilisation autorisée — décision 2011/833/UE |
| **Cadence** | quotidienne |
| **Vérifié le** | 12 août 2026 |

**Résultat.** 40 règlements et directives de 2026, avec leur titre officiel français, leur
identifiant CELEX et leur identifiant ELI.

**Limites connues.**

- Le point d'accès répond **HTTP 406** à un en-tête `Accept: application/json` : il faut
  annoncer `application/sparql-results+json`, en plus du paramètre `format`. C'est la
  cause de l'échec du premier passage d'ingestion, corrigé.
- CELLAR renvoie le titre officiel, jamais une reformulation.
- Aucun lien automatique n'existe entre un acte européen et son effet sur une commune
  belge : le rattachement est manuel.
- Les requêtes longues dépassent régulièrement le délai d'attente du point d'accès public.
- Les rectificatifs sont nombreux ; ils sont écartés à l'ingestion.

---

## 4. Fluvius — énergie par commune

| | |
|---|---|
| **Organisme** | Fluvius System Operator |
| **Point d'accès** | `https://opendata.fluvius.be/api/explore/v2.1/catalog/datasets/1-19-totaal-gealloceerd-volume/records` |
| **Licence** | licence ouverte Fluvius (Opendatasoft) |
| **Cadence** | mensuelle |
| **Vérifié le** | 12 août 2026 |

**Résultat.** 370 relevés mensuels pour Kraainem, par secteur (électricité, gaz) et par
catégorie de point d'accès.

**Limites connues.**

- Le champ `leveringsadresgemeente` est en **MAJUSCULES** : une requête en minuscules
  renvoie zéro ligne, sans erreur.
- Volumes de réseau, pas consommation réelle : l'autoconsommation solaire est invisible.
- Aucune ventilation par ménage.
- Les identifiants de jeux changent sans préavis. Deux identifiants cités dans la version 1
  du projet (`totaal-gealloceerd-volume`, `lokale-productie-installaties-per-gemeente`)
  avaient déjà disparu.

---

## 5. IRCEL-CELINE — qualité de l'air

| | |
|---|---|
| **Organisme** | Cellule interrégionale de l'environnement |
| **Point d'accès** | `https://geo.irceline.be/sos/api/v1/stations` |
| **Licence** | CC BY 4.0 |
| **Cadence** | horaire |
| **Vérifié le** | 12 août 2026 |

**Résultat, et c'est le plus utile de ce connecteur :** aucune station de mesure sur le
territoire de Kraainem. La plus proche est à **3,4 km**, et c'est une station trafic.

**Limites connues.**

- Emprunter la valeur d'une station située ailleurs produirait un chiffre faux présenté
  comme vrai. L'écran affiche donc l'absence.
- Les grilles modélisées à 4 × 4 km existent mais ne sont disponibles que par FTP.

---

## 6. OpenStreetMap — établissements ouverts au public

| | |
|---|---|
| **Organisme** | les contributeurs d'OpenStreetMap |
| **Point d'accès** | `https://overpass-api.de/api/interpreter` |
| **Licence** | **ODbL 1.0 — attribution obligatoire** |
| **Cadence** | hebdomadaire |
| **Vérifié le** | 12 août 2026 |

**Résultat.** 179 établissements nommés sur le territoire (`area["ref:INS"="23099"]`), dont
une minorité porte une adresse complète.

**Pourquoi cette source et pas la Banque-Carrefour des Entreprises.** Voir
[IMPOSSIBLE.md](../IMPOSSIBLE.md) : le téléchargement KBO Open Data exige une inscription
nominative ; le service répond **HTTP 302** vers une page d'authentification.

**Limites connues.**

- Base contributive : couverture incomplète et inégale selon les quartiers.
- Rien ne garantit qu'un établissement fermé ait été retiré.
- Aucune pharmacie de garde : le rôle de garde n'est publié dans aucun flux ouvert.
- Les établissements sans nom sont écartés : une fiche « commerce sans nom » n'est pas une
  fiche.

---

## 7. Sources examinées et non retenues

| Source | Ce qui a été tenté | Résultat |
|---|---|---|
| KBO Open Data (entreprises) | téléchargement du fichier ouvert | HTTP 302 vers authentification |
| Statistiques locales flamandes | service OData `provincies.incijfers.be` | HTTP 401 |
| `data.gov.be` | API CKAN `/api/3/action/package_search` | page HTML, pas d'API |
| `opendata.vlaanderen.be` | catalogue | HTTP 302, pas d'interface programmable |
| `lokalestatistieken.vlaanderen.be` | page d'accueil | aucune réponse |
| Interza (calendrier des déchets) | recherche d'un flux structuré | aucun flux documenté |
| GIPOD (chantiers) | accès aux données de chantier | réservé aux gestionnaires de voirie |
| `kraainem.be` | — | **non sollicité : `robots.txt` interdit les outils automatisés** |
