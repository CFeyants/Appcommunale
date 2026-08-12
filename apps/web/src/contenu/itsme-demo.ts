/**
 * Fournisseur d'identité — mode démonstration.
 *
 * Le contrat d'interface est le vrai. `RevendicationsItsme` reprend les noms de
 * revendications OpenID Connect tels qu'itsme les renvoie ; l'ordre des étapes
 * et le contenu du jeton sont ceux d'un flux OIDC réel. Le branchement en
 * production consiste à remplacer `FOURNISSEUR_DEMONSTRATION` par un client
 * OIDC pointant vers `idp.prd.itsme.services`, sans rien changer d'autre.
 *
 * Ce qui manque et qui ne peut pas être écrit ici : l'enrôlement auprès de
 * Belgian Mobile ID, qui conditionne l'accès aux environnements de test comme
 * de production. C'est l'un des trois cas où il faut s'arrêter et demander.
 */

import type { RevendicationsItsme, SessionCitoyen } from '@pc/core';
import { SCOPES_DEMANDES } from '@pc/core';

export interface FournisseurIdentite {
  nom: string;
  demonstration: boolean;
  autoriteEmettrice: string;
  scopes: readonly string[];
  /** URL d'autorisation réelle en production ; nulle en démonstration. */
  urlAutorisation: string | null;
  authentifier(): Promise<RevendicationsItsme>;
}

/**
 * Habitante fictive de Kraainem. Les valeurs sont au format exact d'itsme :
 * `sub` opaque, `address` structuré, `birthdate` en AAAA-MM-JJ.
 */
const HABITANTE_FICTIVE: RevendicationsItsme = {
  sub: 'demo:8f14e45fceea167a5a36dedd4bea2543',
  given_name: 'Anaïs',
  family_name: 'De Meyer',
  name: 'Anaïs De Meyer',
  gender: 'female',
  locale: 'fr-BE',
  birthdate: '1987-04-02',
  email: 'anais.demeyer@exemple.invalid',
  email_verified: true,
  address: {
    formatted: 'Wezembeeklaan 12, 1950 Kraainem, BE',
    street_address: 'Wezembeeklaan 12',
    postal_code: '1950',
    locality: 'Kraainem',
    country: 'BE',
  },
};

export const FOURNISSEUR_DEMONSTRATION: FournisseurIdentite = {
  nom: 'itsme (simulation)',
  demonstration: true,
  autoriteEmettrice: 'Belgian Mobile ID — non contacté',
  scopes: SCOPES_DEMANDES,
  urlAutorisation: null,
  async authentifier() {
    return HABITANTE_FICTIVE;
  },
};

/**
 * Traduit les revendications en session conservée.
 *
 * Tout ce qui n'est pas nécessaire est jeté ici, une fois, à un seul endroit :
 * le nom de famille, la date de naissance, le genre, le courriel. Il ne reste
 * que l'identifiant de sujet, le prénom pour s'adresser à la personne, et le
 * code postal pour savoir de quelle commune il s'agit.
 *
 * Le numéro de registre national n'est pas demandé (la portée `eid` ne figure
 * pas dans SCOPES_DEMANDES) et ne serait de toute façon pas conservé : un test
 * le vérifie sur la sortie de cette fonction.
 */
export function versSession(revendications: RevendicationsItsme, demonstration: boolean): SessionCitoyen {
  return {
    sub: revendications.sub,
    prenom: revendications.given_name,
    codePostal: revendications.address?.postal_code,
    localite: revendications.address?.locality,
    territoireCode: revendications.address?.postal_code === '1950' ? '23099' : undefined,
    demonstration,
    ouverteLe: new Date().toISOString(),
  };
}

/** Les portées volontairement non demandées, affichées à l'écran de connexion. */
export const SCOPES_ECARTES = [
  { scope: 'eid', pourquoi: 'Porte le numéro de registre national, le lieu de naissance et la nationalité. Aucune finalité de la plateforme ne l’exige.' },
  { scope: 'phone', pourquoi: 'Aucune notification par téléphone n’est prévue.' },
  { scope: 'email', pourquoi: 'Demandée seulement si vous activez une notification par courriel, et à ce moment-là seulement.' },
  { scope: 'idDocument', pourquoi: 'Type, numéro et validité du document d’identité : sans usage ici.' },
] as const;
