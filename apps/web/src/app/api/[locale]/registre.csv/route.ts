import { EXPLICATION_MOTIF } from '@pc/core';
import { estLocale } from '@/i18n';
import { chargerFil } from '@/lib/donnees';

/**
 * L'export CSV du registre.
 *
 * Point-virgule comme séparateur et marque d'ordre d'octets en tête : c'est ce
 * qu'attend un tableur configuré en français ou en néerlandais. Un CSV qui
 * s'ouvre en une colonne n'est pas un export.
 */
export const dynamic = 'force-dynamic';

function echapper(v: unknown): string {
  const s = v === null || v === undefined ? '' : String(v);
  return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(requete: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!estLocale(locale)) return new Response('langue inconnue', { status: 404 });

  const onglet = new URL(requete.url).searchParams.get('onglet') ?? 'retenus';
  const { items } = await chargerFil();
  const liste = items.filter((i) => (onglet === 'ecartes' ? !i.admission.publie : i.admission.publie));

  const colonnes = [
    'identifiant',
    'date_acte',
    'titre_origine_nl',
    'titre_reformule_fr',
    'categorie',
    'themes',
    'impact',
    'action',
    'publie',
    'motif_exclusion',
    'motif_explication',
    'organisme',
    'licence',
    'url_acte',
  ];

  const lignes = liste.map((i) =>
    [
      i.id,
      i.dateActe,
      i.titreOrigine,
      i.reformulation ? i.titre : '',
      i.categorie,
      i.themes.join('|'),
      i.reformulation ? i.impact : '',
      i.action.kind,
      i.admission.publie ? 'oui' : 'non',
      i.admission.motif ?? '',
      i.admission.motif ? EXPLICATION_MOTIF[i.admission.motif] : '',
      i.source.organisme,
      i.source.licence,
      i.source.url,
    ]
      .map(echapper)
      .join(';'),
  );

  const csv = '﻿' + [colonnes.join(';'), ...lignes].join('\r\n');

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="registre-kraainem-${onglet}.csv"`,
    },
  });
}
