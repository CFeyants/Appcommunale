import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getOrientation, type OrientationId } from "@/lib/data";

/**
 * L'ÉTIQUETTE DE TRAJECTOIRE — le mécanisme central du pilote.
 *
 * Chaque décision, dépense ou projet porte ce lien explicite vers l'orientation
 * de long terme qu'il sert. Le citoyen ne voit jamais un élément orphelin :
 * il voit toujours pourquoi il existe et à quoi il se rattache.
 */
export function TrajectoryLabel({
  orientation,
  size = "md",
}: {
  orientation: OrientationId;
  size?: "sm" | "md";
}) {
  const o = getOrientation(orientation);
  const compact = size === "sm";

  return (
    <Link
      href={`/#${o.id}`}
      title={`Se rattache à la trajectoire : ${o.titre}`}
      className={`group inline-flex items-center gap-1.5 rounded-full border ${o.couleur.bordure} ${o.couleur.fond} ${o.couleur.texte} font-medium transition-colors hover:brightness-95 ${
        compact ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs"
      }`}
    >
      <span className={`h-2 w-2 rounded-full ${o.couleur.point}`} aria-hidden />
      <span className="opacity-70">Trajectoire&nbsp;·</span>
      <span>{o.titre}</span>
      <ArrowUpRight className="h-3 w-3 opacity-0 -ml-0.5 transition-opacity group-hover:opacity-70" />
    </Link>
  );
}
