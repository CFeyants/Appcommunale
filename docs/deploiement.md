# Déploiement

Le projet est un monorepo npm workspaces dont l'application Next.js vit dans `apps/web`.
La v1 était une application Vite : **la configuration Vercel existante ne fonctionnera
pas telle quelle** et doit être reprise point par point.

---

## 1. Réglages du projet Vercel

Dans **Settings → General** :

| Réglage | Valeur | Pourquoi |
|---|---|---|
| Framework Preset | **Next.js** | la v1 était détectée comme Vite |
| Root Directory | **`apps/web`** | et cocher « Include files outside the root directory » |
| Node.js Version | **22.x** | `engines` du dépôt |
| Install Command | par défaut | Vercel détecte les workspaces npm et installe depuis la racine |
| Build Command | par défaut | `next build` |

Ces valeurs sont aussi écrites dans [`apps/web/vercel.json`](../apps/web/vercel.json), qui
fixe en plus la région **`fra1`** — Francfort, la plus proche de la Belgique.

**« Include files outside the root directory » n'est pas optionnel.** Sans cette case, ni
`packages/*` ni `/data` ne sont copiés dans l'environnement de build, et le déploiement
échoue à l'installation.

## 2. Le piège du déploiement, et comment il est désamorcé

L'interface lit `/data` avec `fs.readFile` et un chemin calculé à l'exécution. Le traçage
de fichiers de Next ne peut pas le deviner : sans réglage, les fonctions déployées ne
trouvent aucun instantané et **tous les écrans s'affichent vides, sans la moindre erreur**.
C'est le pire des échecs — celui qui ressemble à un succès.

Deux options le désamorcent, dans `next.config.mjs` :

```js
outputFileTracingRoot: RACINE,                     // autorise à remonter au-dessus de apps/web
outputFileTracingIncludes: { '/**': ['../../data/**/*.json'] },
```

Et un test le vérifie à chaque poussée, dans
[`.github/workflows/verification.yml`](../.github/workflows/verification.yml) : il cherche
`data/kraainem/lokaalbeslist.json` dans les fichiers de traçage produits par le build, et
échoue si l'instantané n'y est pas.

Vérification manuelle, après un `npm run build` :

```bash
grep -o 'data/[a-z]*/[a-z-]*\.json' \
  apps/web/.next/server/app/api/json/\[locale\]/\[ecran\]/route.js.nft.json | sort -u
```

Sept fichiers doivent apparaître.

## 3. L'ingestion ne tourne pas sur Vercel

Le système de fichiers d'une fonction Vercel est **en lecture seule** à l'exécution :
`npm run ingest` ne peut pas y écrire `/data`. Une tâche planifiée Vercel n'y changerait
rien.

La collecte vit donc dans l'intégration continue, et la chaîne est la suivante :

```
GitHub Actions (3 h 17 UTC)  →  commit de /data  →  Vercel redéploie  →  écrans à jour
```

Le flux est dans [`.github/workflows/ingestion.yml`](../.github/workflows/ingestion.yml).

### Ce qu'il fait

- Fenêtre de **soixante jours** par défaut, réglable au déclenchement manuel.
- La collecte est **incrémentale et fusionnée** avec l'instantané existant, jamais
  substituée : sans cette fusion, une collecte de soixante jours effacerait deux ans
  d'historique.
- Délai de **500 ms** entre deux appels au lieu de 200 : la tâche tourne sans personne
  pour la surveiller, et un portail public n'a aucune obligation de nous servir.
- Les tests tournent **avant** le commit : un instantané corrompu déployé silencieusement
  est pire qu'une collecte manquée.
- Rien n'est commité si rien n'a changé.
- Le résumé de l'exécution affiche l'état de chaque connecteur.

### Durées observées

| Portée | Durée |
|---|---|
| Fenêtre complète de deux ans, délai 200 ms | ≈ 55 min, 17 988 appels |
| Fenêtre de soixante jours, délai 500 ms | quelques minutes |

### Déclenchement manuel

Onglet **Actions → Ingestion planifiée → Run workflow**. Deux paramètres : la fenêtre en
jours, et la liste des sources (vide = toutes). Pour ne rafraîchir que l'énergie :
`fluvius`.

## 4. Variables d'environnement

**Aucune n'est requise.** Toutes les sources branchées sont publiques et sans clé — c'est
un choix, pas un hasard : une plateforme dont la reproductibilité dépend d'un secret n'est
pas reproductible.

Deux variables facultatives, utilisées seulement par l'ingestion :

| Variable | Défaut | Effet |
|---|---|---|
| `PC_DEPUIS` | `2024-08-01` | début de la fenêtre de collecte |
| `PC_DELAI_MS` | `200` | délai entre deux appels au même hôte |

Le jour où l'accès KBO Open Data et l'enrôlement itsme seront obtenus, ils apporteront
leurs propres secrets — à déclarer dans Vercel **et** dans les secrets GitHub, pas dans le
dépôt.

## 5. En-têtes servis

Ils sont dans `next.config.mjs`, et rendent vérifiables de l'extérieur des promesses qui,
sans eux, seraient sur parole.

| En-tête | Valeur | Ce qu'il garantit |
|---|---|---|
| `Content-Security-Policy` | `default-src 'self'`, `connect-src 'self'` | aucun traceur tiers, aucune connexion sortante |
| `Referrer-Policy` | `no-referrer` | aucune fuite de navigation vers les sites liés |
| `Permissions-Policy` | tout refusé sauf `geolocation=(self)` | la géolocalisation ne sert qu'au signalement, à la demande |
| `X-Content-Type-Options` | `nosniff` | |
| `Strict-Transport-Security` | un an | |

Sur les exports — `/fr.json`, `/fr/budget.json`, `/api/*` — s'ajoutent
`Access-Control-Allow-Origin: *` et un cache d'une heure : ces données sont faites pour
être reprises depuis un autre domaine.

Les trois motifs d'en-tête d'export sont nécessaires : les en-têtes sont appariés sur le
chemin **demandé**, pas sur la destination de la réécriture. Une seule règle sur `/api/*`
laisserait `/fr/budget.json` sans en-tête.

## 6. Ce qu'il reste à décider

- **Le domaine.** `appcommunale.vercel.app` porte le nom de la v1, qui était une maquette
  communale. La v2 couvre cinq niveaux de pouvoir.
- **Le plan Vercel.** La fenêtre complète de deux ans dépasse la limite d'exécution du plan
  gratuit — sans conséquence, puisque l'ingestion tourne sur GitHub Actions.
- **La branche déployée.** `plateforme-v2` aujourd'hui. Pointer Vercel sur `main` demande
  de fusionner d'abord.
