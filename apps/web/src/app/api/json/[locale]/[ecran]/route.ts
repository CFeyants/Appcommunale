import { NextResponse } from 'next/server';
import {
  ANCRAGES_CARBONE,
  bonusMalus,
  CE_QUE_LE_BAREME_NE_FAIT_PAS,
  FORFAITS_SECTORIELS,
  HISTORIQUE_BAREME,
  impactMonetise,
  KRAAINEM,
  ORIGINE_CARBONE,
  PARAMETRES_SEUIL,
  PLAFOND_MENSUEL,
  POIDS,
  PRIX_QUOTA_ETS,
  seuilDeclaration,
  trajectoireCarbone,
  VERSION_BAREME,
  VERSION_VOCABULAIRE,
} from '@pc/core';
import { LACUNE_MARCHES, LEVIERS, MARCHES } from '@/contenu/achats';
import {
  CE_QUE_CET_ECRAN_NE_FAIT_PAS,
  GESTES,
  PALIERS,
  PART_COLLECTIVE,
  SUR_LE_BAS_DU_CLASSEMENT,
} from '@/contenu/ce-qui-pese';
import {
  ECHEANCES,
  ENTREPRISE,
  MARCHES_ENTREPRISE,
  PIECES,
  POSITIONS,
  RUBRIQUES,
  SECTEUR_DEMONSTRATION,
} from '@/contenu/entreprise';
import { estLocale } from '@/i18n';
import {
  alleger,
  chargerActe,
  chargerDepenses,
  chargerEnergie,
  chargerEtablissements,
  chargerEtatSources,
  chargerFil,
  chargerGes,
} from '@/lib/donnees';
import { OBJECTIFS, COUVERTURE_VISION } from '@/contenu/objectifs';
import { INDICATEURS_ENVIRONNEMENT, INDICATEURS_SOCIAUX } from '@/contenu/indicateurs';
import { PROJETS_EPARGNE, SERVICES, INSCRIPTIONS } from '@/contenu/epargne';
import { DECHETS, DEMARCHES, INITIATIVES, PROPOSITIONS, QUESTIONS, REGLEMENT_PARTICIPATION, TRAVAUX } from '@/contenu/commune';
import { BUDGET_COMMUNAL } from '@/contenu/budget';

/**
 * Chaque écran expose son JSON à la même URL suffixée `.json`.
 *
 * La réversibilité n'est pas un principe affiché : c'est une adresse qu'on
 * peut appeler. Le JSON porte les poids du tri, la version du vocabulaire et
 * les plafonds, pour qu'un tiers puisse refaire exactement le même calcul.
 */

export const dynamic = 'force-dynamic';

const enTete = (nom: string) => ({
  ecran: nom,
  genereLe: new Date().toISOString(),
  territoire: { code: KRAAINEM.code, nom: KRAAINEM.nom, codePostal: KRAAINEM.codePostal },
  versionVocabulaire: VERSION_VOCABULAIRE,
  licence: 'Contenu sous licence CC BY 4.0 ; voir la licence propre à chaque source dans « sources ».',
  reutilisation:
    'Ces données sont réutilisables, y compris contre nous. C’est ce que veut dire réversibilité.',
});

export async function GET(
  _requete: Request,
  { params }: { params: Promise<{ locale: string; ecran: string }> },
) {
  const { locale, ecran } = await params;
  if (!estLocale(locale)) return NextResponse.json({ erreur: 'langue inconnue' }, { status: 404 });

  switch (ecran) {
    case 'fil': {
      const { items, statistiques, fenetre, seances, depassements } = await chargerFil();
      return NextResponse.json({
        ...enTete('fil'),
        fenetre,
        statistiques,
        // Les poids sont exportés avec l'écran : sans eux, l'ordre n'est pas
        // reproductible par un tiers.
        poidsDuTri: POIDS,
        plafondsMensuels: PLAFOND_MENSUEL,
        depassements,
        nombreSeances: seances.length,
        items: items.map(alleger),
      });
    }

    case 'budget': {
      const [depenses, energie] = await Promise.all([chargerDepenses(), chargerEnergie()]);
      return NextResponse.json({
        ...enTete('budget'),
        depensesPubliques: depenses,
        budgetCommunal: BUDGET_COMMUNAL,
        energie: energie?.parSecteur ?? null,
        initiatives: INITIATIVES,
        questions: QUESTIONS,
        propositions: PROPOSITIONS,
        reglementParticipation: REGLEMENT_PARTICIPATION,
        indicateurs: { social: INDICATEURS_SOCIAUX, environnement: INDICATEURS_ENVIRONNEMENT },
      });
    }

    case 'vision': {
      const ges = await chargerGes();
      return NextResponse.json({
        ...enTete('vision'),
        objectifs: OBJECTIFS,
        couverture: COUVERTURE_VISION,
        trajectoires: { 'ges-belgique': ges },
      });
    }

    case 'impact': {
      const etabs = await chargerEtablissements();
      return NextResponse.json({
        ...enTete('impact'),
        attribution: '© les contributeurs d’OpenStreetMap, ODbL 1.0',
        entreprisesDeclarantes: 0,
        etablissements: etabs?.etablissements ?? [],
        completude: etabs?.completude ?? null,
      });
    }

    case 'epargne': {
      const etabs = await chargerEtablissements();
      return NextResponse.json({
        ...enTete('epargne'),
        attribution: '© les contributeurs d’OpenStreetMap, ODbL 1.0',
        projets: PROJETS_EPARGNE,
        services: SERVICES,
        demarches: DEMARCHES,
        dechets: DECHETS,
        travaux: TRAVAUX,
        inscriptions: INSCRIPTIONS,
        annuaire: etabs?.etablissements ?? [],
      });
    }

    case 'sources':
      return NextResponse.json({ ...enTete('sources'), couverture: KRAAINEM.couverture, connecteurs: await chargerEtatSources() });

    /* --- Les écrans ajoutés par l'extension entreprise ------------------ */

    case 'bareme': {
      const annee = new Date().getFullYear();
      return NextResponse.json({
        ...enTete('bareme'),
        version: VERSION_BAREME,
        module: 'packages/core/src/bareme.ts',
        ancragesCarbone: ANCRAGES_CARBONE,
        origineCarbone: ORIGINE_CARBONE,
        trajectoire: trajectoireCarbone(annee, 3),
        prixQuotaEts: PRIX_QUOTA_ETS,
        forfaitsSectoriels: FORFAITS_SECTORIELS,
        parametresSeuil: PARAMETRES_SEUIL,
        seuil: seuilDeclaration(PARAMETRES_SEUIL.coutAnnualiseDeclarationEur, PARAMETRES_SEUIL.tauxImpactMoyen),
        ceQueLeBaremeNeFaitPas: CE_QUE_LE_BAREME_NE_FAIT_PAS,
        historique: HISTORIQUE_BAREME,
      });
    }

    case 'achats': {
      const annee = new Date().getFullYear();
      return NextResponse.json({
        ...enTete('achats'),
        avertissement:
          'Les marchés et leurs montants sont fictifs : aucun connecteur ne publie les montants des marchés communaux. Seules les deux premières lignes du classement des leviers viennent de données réelles (Fluvius).',
        lacune: LACUNE_MARCHES,
        versionBareme: VERSION_BAREME,
        marches: MARCHES.map((m) => ({
          ...m,
          impact: impactMonetise(m.postes, { annee, usage: m.usage, montantMarcheEur: m.montantAnnuelEur }),
        })),
        leviers: LEVIERS.map((levier) => ({
          ...levier,
          impact: impactMonetise(
            [
              {
                cle: levier.cle,
                libelle: levier.libelle,
                quantite: levier.quantite,
                unite: levier.unite,
                facteurEmission: levier.facteurEmission,
                uniteFacteur: levier.uniteFacteur,
                origineFacteur: {
                  organisme: levier.source,
                  reference: levier.source,
                  releveLe: '2026-08-16',
                  verifieParAppel: levier.reel,
                },
                couverture: levier.couverture,
              },
            ],
            { annee, usage: 'classer-les-leviers' },
          ),
        })),
      });
    }

    case 'ce-qui-pese':
      return NextResponse.json({
        ...enTete('ce-qui-pese'),
        avertissement:
          'Ce fichier ne calcule rien sur personne. Il publie un contenu de référence ordonné, identique pour tout le monde.',
        paliers: PALIERS,
        partCollective: PART_COLLECTIVE,
        gestes: GESTES,
        surLeBasDuClassement: SUR_LE_BAS_DU_CLASSEMENT,
        ceQueCetEcranNeFaitPas: CE_QUE_CET_ECRAN_NE_FAIT_PAS,
      });

    case 'entreprise': {
      const secteur = bonusMalus([...SECTEUR_DEMONSTRATION], 250);
      return NextResponse.json({
        ...enTete('entreprise'),
        avertissement:
          'Espace de démonstration. L’entreprise, ses marchés et ses déclarations sont fictifs : aucune donnée réelle n’est attachée à un établissement de la commune.',
        entreprise: ENTREPRISE,
        referentiel: 'Module de base de la norme volontaire européenne pour PME non cotées, rubriques B1 à B11',
        rubriques: RUBRIQUES,
        marches: MARCHES_ENTREPRISE,
        pieces: PIECES,
        positions: POSITIONS,
        echeances: ECHEANCES,
        bonusMalus: {
          nonBranche: true,
          pourquoi:
            'Une commune n’a ni le périmètre, ni la base légale, ni la légitimité pour redistribuer entre entreprises. L’échelon est le secteur.',
          ...secteur,
        },
      });
    }

    default: {
      // Un acte précis : /api/json/fr/acte-<id>
      if (ecran.startsWith('acte-')) {
        const acte = await chargerActe(ecran.slice(5));
        if (!acte) return NextResponse.json({ erreur: 'acte inconnu' }, { status: 404 });
        return NextResponse.json({ ...enTete('acte'), acte });
      }
      return NextResponse.json({ erreur: 'écran inconnu' }, { status: 404 });
    }
  }
}
