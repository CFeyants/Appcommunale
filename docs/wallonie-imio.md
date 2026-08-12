# Proposition technique : un connecteur d'export LBLOD pour deliberations.be

**Destinataire proposé :** iMio, intercommunale de mutualisation informatique et
organisationnelle, opératrice de `deliberations.be`.
**Objet :** contribuer au dépôt d'iMio un module d'export des délibérations au format
LBLOD/OSLO, exposé en JSON:API.
**Rédigé le :** 12 août 2026.

> Ce document est une proposition à adresser, pas un fait acquis. Rien de ce qui suit n'a
> été soumis à iMio à ce jour.

---

## 1. Pourquoi une contribution plutôt qu'une demande

En Flandre, les décisions locales sont accessibles par une interface programmable publique
et sans clé : Lokaal Beslist. Nous en avons collecté 3 207 points d'agenda pour une seule
commune en une heure, sans convention et sans autorisation particulière.

En Wallonie, la publication des décisions est obligatoire et opérée par `deliberations.be`,
portail complet et fonctionnel — mais **sans interface programmable documentée**. La donnée
existe, elle est publique, et elle n'est pas réutilisable par machine.

Attendre une API wallonne qui n'est pas annoncée n'est pas une stratégie. La manœuvre
proposée est différente : **écrire nous-mêmes le module d'export, et le contribuer**.
iMio publie son code ; le travail est donc possible sans convention préalable. Nous
obtenons la Wallonie, iMio gagne une fonction qu'elle n'a pas eu à financer, et les
communes wallonnes gagnent une conformité qui leur sera demandée tôt ou tard.

## 2. Ce que nous proposons de livrer

Un module additionnel exposant, en lecture seule, les délibérations déjà publiées sur le
portail — **rien qui ne soit déjà public**.

### 2.1 Ressources

Les mêmes que Lokaal Beslist, avec les mêmes noms, pour qu'un client écrit pour la Flandre
fonctionne en Wallonie sans modification :

```
GET /sessions
GET /sessions/{id}/agenda-items
GET /agenda-items/{id}/handled-by
GET /agenda-item-handlings/{id}/resolutions
GET /resolutions/{id}/articles
```

En-tête obligatoire : `Accept: application/vnd.api+json`.

### 2.2 Correspondance des vocabulaires

| Concept portail | Terme OSLO | Identifiant |
|---|---|---|
| Séance | Zitting | `https://data.vlaanderen.be/ns/besluit#Zitting` |
| Point d'ordre du jour | Agendapunt | `https://data.vlaanderen.be/ns/besluit#Agendapunt` |
| Traitement du point | BehandelingVanAgendapunt | `https://data.vlaanderen.be/ns/besluit#BehandelingVanAgendapunt` |
| Délibération | Besluit | `https://data.vlaanderen.be/ns/besluit#Besluit` |
| Article de règlement | Artikel | `https://data.vlaanderen.be/ns/besluit#Artikel` |
| Organe | Bestuursorgaan | `https://data.vlaanderen.be/ns/besluit#Bestuursorgaan` |
| Commune | Bestuurseenheid | `https://data.vlaanderen.be/ns/besluit#Bestuurseenheid` |

### 2.3 Filtre par commune

Le filtre le plus utilisé en Flandre, à reproduire à l'identique :

```
GET /sessions?filter[governing-body][is-time-specialization-of][administrative-unit][name]=Nom
```

Un filtre par code INS serait plus robuste que par nom, et nous suggérons de l'ajouter :

```
GET /sessions?filter[administrative-unit][ins]=52011
```

### 2.4 Champs minimaux par ressource

**Séance** — `planned-start`, `started-at`, `ended-at`, `uri`.
**Point d'agenda** — `title`, `description`, `planned-public`, `alternate-link`, `uri`.
**Délibération** — `title`, `value` (texte intégral), `publication-date`, `language`
(URI de l'autorité linguistique de l'Office des publications), `uri`.

## 3. Trois défauts observés en Flandre, à ne pas reproduire

Ce sont les enseignements de notre collecte réelle. Ils valent plus que la spécification.

1. **Ne pas répéter l'intitulé dans le corps de la décision.** Sur 2 751 délibérations
   collectées à Kraainem, 2 471 ont un champ `value` qui reproduit le titre au lieu de
   contenir la motivation. La ressource est conforme et vide de sens.
2. **Publier les articles.** La relation `articles` renvoie zéro pour la totalité des
   délibérations observées. Un règlement sans ses articles n'est pas exploitable.
3. **Permettre l'inclusion des ressources liées.** Le paramètre `include=` échoue en HTTP
   500 sur l'instance flamande, et `/resolutions` n'accepte aucun filtre par commune
   (HTTP 406). Conséquence : il faut trois appels par point d'agenda. Notre collecte a
   demandé **17 988 appels HTTP** pour deux ans d'une seule commune. Un `include` qui
   fonctionne diviserait ce nombre par trois, et allégerait d'autant la charge du serveur.

## 4. Ce que nous nous engageons à fournir

- Le module, sous la licence du dépôt d'iMio.
- Les tests de contrat correspondants, exécutables en intégration continue.
- La documentation des points d'accès, en français.
- Un client de référence en TypeScript, celui-là même que nous utilisons pour la Flandre :
  [`packages/connectors/src/lokaalbeslist`](../packages/connectors/src/lokaalbeslist/index.ts).

## 5. Ce que nous ne demandons pas

Aucun accès privilégié, aucune donnée non publique, aucune convention d'exclusivité, aucune
clé. Le module est proposé pour tout le monde, y compris pour des réutilisateurs
concurrents du nôtre. C'est la condition pour que la demande soit recevable.

## 6. Prochaine étape

Adresser cette proposition à iMio, et publier la réponse — y compris un refus, y compris
une absence de réponse au terme du délai. Le registre des observations du projet est fait
pour cela.
