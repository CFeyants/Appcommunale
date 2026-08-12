import { NextResponse } from 'next/server';
import { POIDS, PLAFOND_MENSUEL, VERSION_VOCABULAIRE, KRAAINEM } from '@pc/core';
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
