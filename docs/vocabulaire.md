# Vocabulaire

**Décision du Lot 1, irréversible.** Le modèle de données n'invente rien là où un terme
normalisé existe. Chaque type TypeScript cite l'identifiant dont il dérive ; là où aucun
terme ne convenait, l'extension est justifiée ici.

Les constantes sont dans [`packages/core/src/oslo.ts`](../packages/core/src/oslo.ts) ; les
schémas Zod qui les citent sont dans
[`packages/core/src/schemas.ts`](../packages/core/src/schemas.ts).

---

## Pourquoi OSLO, et pourquoi maintenant

Lokaal Beslist n'est pas une base de données : c'est la face visible de **LBLOD** —
*Lokale Besluiten als Gelinkte Open Data* — qui repose sur **OSLO**, le programme flamand
de standards sémantiques publié sur `data.vlaanderen.be`.

Trois raisons, dans l'ordre d'importance.

1. **Cela rend la demande d'ouverture recevable.** Obtenir les données des autres niveaux
   est un problème réglementaire, pas technique. Demander à la Wallonie et à Bruxelles
   d'adopter un standard public existant est une demande légitime ; leur demander
   d'alimenter notre plateforme ne l'est pas.
2. **Cela satisfait notre propre règle de réversibilité.** Des données conformes à un
   standard ouvert sont réutilisables par n'importe qui, y compris contre nous. C'est le
   prix de la cohérence.
3. **Cela rend le connecteur flamand presque trivial**, et tout connecteur ultérieur
   comparable.

## Vérification des espaces de noms — 12 août 2026

Chaque espace de noms cité a été appelé depuis le poste de développement.

| Espace de noms | Réponse |
|---|---|
| `https://data.vlaanderen.be/ns/besluit` | HTTP 200 |
| `https://data.vlaanderen.be/ns/mandaat` | HTTP 200 |
| `https://data.vlaanderen.be/ns/organisatie` | HTTP 200 |
| `https://data.vlaanderen.be/ns/adres` | HTTP 200 |
| `https://data.vlaanderen.be/ns/persoon` | HTTP 200 |
| `https://data.vlaanderen.be/ns/generiek` | HTTP 200 |
| `https://data.vlaanderen.be/ns/dienstencataloog` | **HTTP 404 — n'existe pas** |

Les noms de classes du vocabulaire `besluit` ont été extraits de l'application profile
*Besluit-publicatie* et non supposés : `Zitting`, `Agendapunt`, `BehandelingVanAgendapunt`,
`Besluit`, `Artikel`, `Stemming`, `Bestuursorgaan`, `Bestuurseenheid`, `Vergaderactiviteit`.

---

## Correspondance type par type

| Type du projet | Terme repris | Identifiant |
|---|---|---|
| `Item` (décision locale) | Besluit | `https://data.vlaanderen.be/ns/besluit#Besluit` |
| `Item` (niveaux supérieurs) | Legal Resource | `http://data.europa.eu/eli/ontology#LegalResource` |
| `Seance` | Zitting | `https://data.vlaanderen.be/ns/besluit#Zitting` |
| Point d'agenda (collecte) | Agendapunt | `https://data.vlaanderen.be/ns/besluit#Agendapunt` |
| Traitement d'un point | BehandelingVanAgendapunt | `https://data.vlaanderen.be/ns/besluit#BehandelingVanAgendapunt` |
| Organe délibérant | Bestuursorgaan | `https://data.vlaanderen.be/ns/besluit#Bestuursorgaan` |
| Territoire communal | Bestuurseenheid | `https://data.vlaanderen.be/ns/besluit#Bestuurseenheid` |
| `Droit`, `Service` | Public Service (CPSV-AP) | `http://purl.org/vocab/cpsv#PublicService` |
| `Condition` d'un droit | Rule (CPSV-AP) | `http://purl.org/vocab/cpsv#Rule` |
| `Entreprise` | Formal Organization | `http://www.w3.org/ns/org#FormalOrganization` |
| `Source.organisme` | `dcterms:publisher` | `http://purl.org/dc/terms/publisher` |
| `Source.url` | `dcterms:source` | `http://purl.org/dc/terms/source` |
| `Source.licence` | `dcterms:license` | `http://purl.org/dc/terms/license` |
| `Source.dateDonnee` | `dcterms:issued` | `http://purl.org/dc/terms/issued` |
| `Source.consulteLe` | `prov:generatedAtTime` | `http://www.w3.org/ns/prov#generatedAtTime` |
| Série de mesures | Observation (RDF Data Cube) | `http://purl.org/linked-data/cube#Observation` |

### Pourquoi CPSV-AP et non OSLO pour les services

OSLO ne publie pas de vocabulaire de catalogue de services à cette adresse : l'espace de
noms `dienstencataloog` renvoie 404. Le standard européen **CPSV-AP** (*Core Public Service
Vocabulary Application Profile*) couvre exactement le besoin — un service public, ses
règles d'éligibilité, ses canaux, ses sorties — et OSLO s'y aligne lui-même. Reprendre
CPSV-AP est donc plus proche de l'esprit d'OSLO qu'inventer un terme flamand qui n'existe
pas.

---

## Extensions du projet

Espace de noms : `https://plateforme-citoyenne.be/ns/core#`, abrégé `pc:`.

Chaque extension répond à la même question : *quel terme existant aurait convenu, et
pourquoi ne convient-il pas ?*

### `pc:Objectif`

Une cible chiffrée et datée fixée par une autorité, rattachée à un objectif de niveau
supérieur.

**Ce qui a été examiné.** `schema:Goal` n'existe pas ; `qb:Observation` décrit une mesure,
pas une cible ; le vocabulaire des ODD des Nations unies décrit dix-sept objectifs figés et
ne sert pas à en déclarer de nouveaux ; `eli:LegalResource` décrit l'acte qui fixe
l'objectif, pas l'objectif lui-même.

**Ce qui manquait vraiment.** Le rattachement `pc:rattachement` d'un objectif à un objectif
de niveau supérieur, et la distinction entre deux horizons — vision longue et mandature —
qui ne doivent jamais être mélangés. Aucun vocabulaire consulté ne porte cette distinction.

### `pc:Initiative`

Un projet budgété, avec des jalons datés et une fonction responsable.

**Ce qui a été examiné.** `schema:Project` s'en approche mais n'a ni jalons datés ni
distinction entre budget voté et budget consommé. `foaf:Project` est purement descriptif.

**Ce qui manquait vraiment.** Le jalon daté, et l'interdiction structurelle du pourcentage
d'avancement : le schéma n'a pas de champ pour en accueillir un.

### `pc:Admission`

Le résultat du test d'admission — trois booléens, un motif, une date d'évaluation.

**Ce qui a été examiné.** Rien. C'est une notion propre au produit : aucun vocabulaire
public n'a de raison de modéliser « cet acte mérite-t-il d'être montré à un citoyen ».

### `pc:Reformulation`

Qui a validé une reformulation en français ordinaire, quand, et si un modèle de langage a
produit la proposition initiale.

**Ce qui a été examiné.** `prov:wasAttributedTo` couvre l'attribution, mais pas la
distinction entre *proposé par une machine* et *validé par un humain*, qui est le cœur de
la règle du § 9.

### `pc:Indicateur`

Un indicateur proposé, avec sa série, son seuil, et — quand la donnée n'existe pas —
l'organisme qui devrait la produire.

**Ce qui a été examiné.** `qb:DataSet` et `qb:Observation` modélisent parfaitement la série.
Ils sont d'ailleurs cités dans le type.

**Ce qui manquait vraiment.** Le champ `absence` : un vocabulaire statistique n'a pas de
place pour dire *cette mesure n'existe pas, et voici qui devrait la faire*. C'est pourtant
la moitié du contenu de nos écrans.

### `pc:delaiObserve`

Le délai réellement constaté entre une demande et sa réponse, par opposition au délai légal.

**Ce qui a été examiné.** Aucun vocabulaire de services publics ne modélise l'écart entre
le délai promis et le délai tenu — pour une raison qui se comprend : ces vocabulaires sont
écrits par les administrations elles-mêmes.

---

## Ce que la conformité OSLO n'apporte pas

Il faut le dire aussi, sinon ce document devient un argumentaire.

- **OSLO ne dit rien de la qualité de ce qui est publié.** Les besluiten de Kraainem sont
  parfaitement conformes au vocabulaire, et 2 471 d'entre eux ne contiennent aucun texte
  au-delà de leur intitulé.
- **La conformité ne rend pas les données comparables entre régions.** La Wallonie publie
  sur `deliberations.be`, dans un format qui n'est pas LBLOD.
- **Le vocabulaire ne porte aucun champ d'impact.** Ce qui change, pour qui, à partir de
  quand : cela n'existe dans aucun standard, et c'est écrit à la main.
