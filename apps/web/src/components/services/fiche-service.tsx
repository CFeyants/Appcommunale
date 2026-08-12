import { Clock, Mail, MapPin, Phone, Users } from 'lucide-react';
import type { Dictionnaire, Locale } from '@/i18n';
import { formaterDate } from '@/i18n';
import type { FicheService } from '@/contenu/epargne';

/**
 * La fiche de service, au gabarit de bornin.brussels.
 *
 * Un titre en capitales, un sous-titre entre parenthèses pour le nom usuel,
 * puis quatre blocs nettement séparés : Coordonnées, À propos, Pour qui,
 * Permanence. C'est une fiche qu'on peut lire debout dans un couloir.
 */
export function FicheServiceCarte({
  service,
  d,
  locale,
}: {
  service: FicheService;
  d: Dictionnaire;
  locale: Locale;
}) {
  const categorie =
    service.categorie === 'familles'
      ? d.epargne.familles
      : service.categorie === 'jeunes'
        ? d.epargne.jeunes
        : service.categorie === 'culture-sport'
          ? d.epargne.cultureSport
          : d.epargne.entraide;

  return (
    <article className="carte flex flex-col px-5 py-5">
      <span className="etiquette text-[var(--pc-encre-tenue)]">{categorie}</span>
      <h3 className="mt-1.5 text-[15px] font-bold uppercase leading-snug tracking-wide">{service.nom}</h3>
      {service.nomUsuel && (
        <p className="mt-0.5 text-[13.5px] text-[var(--pc-encre-douce)]">({service.nomUsuel})</p>
      )}

      <Bloc titre={d.epargne.coordonnees}>
        <ul className="space-y-1">
          {service.coordonnees.adresse && (
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--pc-encre-tenue)]" aria-hidden />
              {service.coordonnees.adresse}
            </li>
          )}
          {service.coordonnees.telephone && (
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--pc-encre-tenue)]" aria-hidden />
              {service.coordonnees.telephone}
            </li>
          )}
          {service.coordonnees.courriel && (
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--pc-encre-tenue)]" aria-hidden />
              <a href={`mailto:${service.coordonnees.courriel}`} className="text-[var(--pc-accent)] underline underline-offset-2">
                {service.coordonnees.courriel}
              </a>
            </li>
          )}
          {service.coordonnees.site && (
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
              <a
                href={service.coordonnees.site}
                target="_blank"
                rel="noreferrer"
                className="text-[var(--pc-accent)] underline underline-offset-2"
              >
                {service.coordonnees.site.replace(/^https?:\/\//, '')}
              </a>
            </li>
          )}
        </ul>
      </Bloc>

      <Bloc titre={d.epargne.aPropos}>
        <ul className="list-disc space-y-1 pl-4">
          {service.aPropos.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </Bloc>

      <Bloc titre={d.epargne.pourQui}>
        <ul className="space-y-1">
          {service.pourQui.map((x) => (
            <li key={x} className="flex items-start gap-2">
              <Users className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--pc-encre-tenue)]" aria-hidden />
              {x}
            </li>
          ))}
        </ul>
      </Bloc>

      <Bloc titre={d.epargne.permanence}>
        <ul className="space-y-1">
          {service.permanence.map((x) => (
            <li key={x} className="flex items-start gap-2">
              <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--pc-encre-tenue)]" aria-hidden />
              {x}
            </li>
          ))}
        </ul>
      </Bloc>

      <p className="mt-auto pt-4 text-[11.5px] text-[var(--pc-encre-tenue)]">
        {service.source.organisme} · {formaterDate(service.source.dateDonnee, locale)} · {service.source.licence}
        {service.incomplet ? ' · fiche incomplète : les horaires ne sont pas publiés en données ouvertes' : ''}
      </p>
    </article>
  );
}

function Bloc({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <section className="mt-4 border-t border-[var(--pc-trait)] pt-3">
      <h4 className="etiquette text-[var(--pc-encre-tenue)]">{titre}</h4>
      <div className="mt-1.5 text-[13px] leading-relaxed text-[var(--pc-encre-douce)]">{children}</div>
    </section>
  );
}
