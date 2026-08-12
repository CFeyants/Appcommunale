# Schéma du message de paiement enrichi

**État : maquette non branchée.** Ce document décrit une piste, pas une fonction livrée.
L'écran correspondant, sur `/fr/impact`, porte en permanence le bandeau « maquette — non
branché ». Aucune donnée bancaire n'est lue, aucun appel réseau n'est fait, et cette piste
n'est annoncée nulle part ailleurs dans l'application.

## L'idée, et son point de blocage

L'idée : calculer l'impact d'une personne à partir de ses achats plutôt qu'à partir de ce
qu'elle déclare. L'entreprise communiquerait l'empreinte du produit dans le message de
paiement, et la banque restituerait le rapport à son client. Ni la plateforme ni la banque
n'estimeraient quoi que ce soit : la valeur viendrait de celui qui vend.

Le point de blocage n'est pas technique. **Aucune norme de messagerie de paiement ne
transporte aujourd'hui un champ d'empreinte carbone**, et aucun établissement belge ne
l'expose. Les normes existantes — ISO 20022 pour les virements, les schémas des réseaux de
cartes — ont bien des champs de remise structurée, mais rien qui porte une empreinte
attribuée à une ligne d'achat, ni aucun mécanisme de vérification.

Ce document existe donc pour une raison précise : si la piste devient possible, le schéma
est déjà écrit et n'aura pas à être improvisé.

## Le schéma

Espace de noms : `https://plateforme-citoyenne.be/ns/paiement-enrichi/1`.

```json
{
  "schema": "https://plateforme-citoyenne.be/ns/paiement-enrichi/1",
  "transaction": {
    "reference": "identifiant de la transaction chez l'émetteur",
    "montantEur": 0,
    "date": "AAAA-MM-JJ"
  },
  "empreinte": {
    "co2eGrammes": 0,
    "perimetre": ["scope1", "scope2", "scope3"],
    "methode": "identifiant du référentiel utilisé",
    "declarePar": "0XXX.XXX.XXX",
    "verifiePar": null,
    "declareLe": "AAAA-MM-JJ"
  }
}
```

### Champ par champ

| Champ | Obligatoire | Règle |
|---|---|---|
| `schema` | oui | Version du schéma. Un message sans version n'est pas lu. |
| `transaction.reference` | oui | Sert au rapprochement, jamais à l'identification d'une personne. |
| `transaction.montantEur` | oui | Montant de la ligne, pas du panier. |
| `empreinte.co2eGrammes` | oui | Valeur **déclarée par le vendeur**. La plateforme ne la recalcule pas et ne la corrige pas. |
| `empreinte.perimetre` | oui | Au moins un scope. Un message sans périmètre est rejeté : une valeur sans périmètre n'est pas comparable. |
| `empreinte.methode` | oui | Identifiant du référentiel. Deux valeurs de méthodes différentes ne sont jamais additionnées. |
| `empreinte.declarePar` | oui | Numéro d'entreprise BCE du déclarant. C'est lui qui engage sa responsabilité, pas la plateforme. |
| `empreinte.verifiePar` | non | `null` tant qu'aucun tiers n'a vérifié. Affiché comme tel. |
| `empreinte.declareLe` | oui | Une empreinte de 2019 ne décrit pas un achat de 2026. |

## Trois règles qui survivraient au branchement

Elles découlent des règles du produit, et ne changent pas si la piste aboutit.

1. **La plateforme n'estime jamais.** Un achat sans empreinte déclarée reste un achat sans
   empreinte. Il n'est pas complété par une moyenne sectorielle : une moyenne présentée
   comme une mesure est un chiffre faux.
2. **Aucune donnée bancaire ne quitte l'appareil.** Le rapprochement se ferait côté client,
   à partir d'un export fourni par la personne. La plateforme n'a aucune raison de voir un
   relevé de compte, et n'aurait aucune base légale pour le conserver.
3. **Aucun score, aucun classement, aucune série de jours.** Les indicateurs personnels
   sont privés, locaux, non comparatifs. Un total mensuel qui se compare devient un jeu, et
   un jeu capte du temps au lieu d'en rendre.

## Ce qu'il faudrait pour que cela existe

- Un champ d'empreinte dans une norme de messagerie de paiement, ou un canal parallèle
  standardisé entre commerçants et banques.
- Un référentiel de méthode partagé, sans quoi les valeurs ne sont pas additionnables.
- Un mécanisme de vérification par tiers, sans quoi la valeur est une déclaration
  invérifiable.
- Une banque disposée à restituer ces données à son client dans un format ouvert.

Aucune de ces quatre conditions n'est remplie aujourd'hui.
