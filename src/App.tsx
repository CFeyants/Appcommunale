import { useEffect, useMemo, useState } from "react";
import {
  Compass, ListChecks, Wallet, Rocket, Users, Handshake, Gauge, Sparkles,
  Sun, Moon, Target, ArrowUp, ArrowRight, Calendar, MapPin, Download,
  ShieldCheck, Bell, BadgeCheck, Vote, Plus, HandHeart, CalendarDays, Music, Trophy, Ticket,
  Baby, Heart, HeartHandshake, Home, Utensils, Smartphone, BookOpen, FileText, ShoppingBasket,
  Landmark, Info, Search, Menu, X, ChevronRight,
  ClipboardCheck, Flag, Eye, CheckCircle2, Clock, Timer, AlertTriangle, Gift, DoorOpen, PiggyBank, PenLine, Ban,
  Database, ExternalLink, GraduationCap, Radio,
} from "lucide-react";
import {
  me, commune, communeFacts, communeSources, orientations, oriById, decisions, budget, projets, jeunes,
  entraide, agenda, familleConseils, familleAide, interets, interetLabel, feed,
  kpiCommune, kpiService, kpiPerso, synergies, engagements, pilotesEval, registreEchecs,
  dataMeta, dataSources, dataGaps, dataLicences, enfant, inscriptionUnique,
  eur, pct, dateFr, type OId, type AccesType, type SourceStatut,
} from "./data";

/* ---------- helpers ---------- */
const A = (key: string) => ({
  text: `hsl(var(--${key}))`,
  bg: `hsl(var(--${key}-bg))`,
  line: `hsl(var(--${key}-line))`,
});
function downloadJSON(name: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}
const feedIcons: Record<string, typeof Bell> = {
  list: ListChecks, calendar: Calendar, rocket: Rocket, youth: Users, hands: HandHeart, pin: MapPin, bell: Bell, trophy: Trophy, baby: Baby,
};
const conseilIcons: Record<string, typeof Bell> = {
  moon: Moon, utensils: Utensils, smartphone: Smartphone, heart: Heart, baby: Baby,
  "heart-handshake": HeartHandshake, book: BookOpen, home: Home, file: FileText, basket: ShoppingBasket,
};

/* ---------- petits composants ---------- */
function TrajBadge({ o }: { o: OId }) {
  const or = oriById(o); const c = A(or.key);
  return (
    <button onClick={() => (window as any).__go("cap", o)}
      title={`Trajectoire : ${or.titre}`}
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11.5px] font-semibold transition hover:brightness-95"
      style={{ color: c.text, background: c.bg, borderColor: c.line }}>
      <span className="h-2 w-2 rounded-full" style={{ background: c.text }} />
      <span className="font-medium opacity-70">Trajectoire ·</span>{or.court}
    </button>
  );
}
function Bar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
      <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, value)}%`, background: color }} />
    </div>
  );
}
function ExportBar({ msg, name, data }: { msg: string; name: string; data: unknown }) {
  return (
    <div className="mt-7 flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-2.5 text-[13px] text-muted-foreground">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" style={{ color: "hsl(var(--ok))" }} />
        <p>{msg} <span className="opacity-70">Données brutes réutilisables — transparence des institutions, protection des personnes.</span></p>
      </div>
      <button onClick={() => downloadJSON(name, data)}
        className="inline-flex shrink-0 items-center gap-2 self-start rounded-lg bg-primary px-4 py-2 text-[13px] font-semibold text-primary-foreground transition hover:opacity-90 sm:self-auto">
        <Download className="h-4 w-4" /> Télécharger (JSON)
      </button>
    </div>
  );
}
function H1({ eyebrow, children }: { eyebrow?: string; children: React.ReactNode }) {
  return (
    <div className="mb-2">
      {eyebrow && <p className="text-[13px] font-medium text-muted-foreground">{eyebrow}</p>}
      <h1 className="mt-1 text-[clamp(26px,3.6vw,34px)] font-semibold leading-tight text-balance">{children}</h1>
    </div>
  );
}
const Lede = ({ children }: { children: React.ReactNode }) => (
  <p className="max-w-[64ch] text-[16px] leading-relaxed text-muted-foreground">{children}</p>
);
const CapLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground/80">{children}</div>
);

// Accessibilité rendue visible (ch. 29)
const accesMeta: Record<AccesType, { label: string; Icon: typeof Gift; v: string }> = {
  gratuit: { label: "Gratuit", Icon: Gift, v: "ok" },
  "sans-inscription": { label: "Sans inscription", Icon: DoorOpen, v: "clim" },
  "tarif-social": { label: "Tarif social", Icon: PiggyBank, v: "tran" },
  inscription: { label: "Sur inscription", Icon: PenLine, v: "muted" },
};
function AccessBadges({ acces }: { acces: AccesType[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {acces.map((a) => {
        const m = accesMeta[a];
        const style = m.v === "muted"
          ? { color: "hsl(var(--muted-foreground))", background: "hsl(var(--muted))", borderColor: "hsl(var(--border))" }
          : { color: `hsl(var(--${m.v === "ok" ? "ok" : m.v}))`, background: `hsl(var(--${m.v === "ok" ? "ok-bg" : m.v + "-bg"}))`, borderColor: `hsl(var(--${m.v === "ok" ? "ok-line" : m.v + "-line"}))` };
        return (
          <span key={a} className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold" style={style}>
            <m.Icon className="h-3 w-3" />{m.label}
          </span>
        );
      })}
    </div>
  );
}

/* ---------- vues ---------- */
function PourVous({ interests, toutVoir, onToggleInt, onToggleTout }: {
  interests: Set<string>; toutVoir: boolean; onToggleInt: (id: string) => void; onToggleTout: () => void;
}) {
  const ranked = useMemo(() => {
    return feed
      .map((it) => ({ it, s: it.tags.filter((t) => interests.has(t)).length, blocked: !!it.cible && it.cible !== me.tranche }))
      .sort((a, b) => b.s - a.s);
  }, [interests]);
  const visibles = ranked.filter((x) => toutVoir || (!x.blocked && x.s > 0));
  const caches = ranked.length - visibles.length;

  return (
    <div>
      <H1 eyebrow={`Bonjour ${me.nom} · ${me.quartier}`}>Pour vous</H1>
      <Lede>
        Un fil trié selon vos centres d'intérêt et vos besoins. L'algorithme <strong>met en avant</strong> ce qui
        vous concerne — il ne cache jamais l'information publique&nbsp;: « Tout voir » révèle l'intégralité.
      </Lede>
      <div className="mt-4 flex items-start gap-2.5 rounded-lg border p-3 text-[13px]" style={{ background: "hsl(var(--brand-weak))", borderColor: "hsl(var(--tran-line))" }}>
        <Timer className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "hsl(var(--brand))" }} />
        <p className="text-muted-foreground">
          <strong className="text-foreground">Conçu pour vous rendre du temps, pas pour le capter.</strong> Pas de défilement sans fin, pas de notifications, pas de compteur ni de score : vous consultez ce qui vous concerne, puis vous refermez.
        </p>
      </div>

      <div className="mt-6 rounded-lg border bg-card p-5">
        <CapLabel><Sparkles className="h-3.5 w-3.5" /> Vos centres d'intérêt & besoins
          <span className="ml-1 font-medium normal-case tracking-normal opacity-70">— déclarés à l'inscription, modifiables</span>
        </CapLabel>
        <div className="mt-3 flex flex-wrap gap-2">
          {interets.map(([id, lbl]) => {
            const on = interests.has(id);
            return (
              <button key={id} onClick={() => onToggleInt(id)} aria-pressed={on}
                className={`rounded-full border px-3 py-1.5 text-[13px] font-medium transition ${on ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-secondary"}`}>
                {lbl}
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex items-center gap-3 text-[13.5px] text-muted-foreground">
          <button role="switch" aria-checked={toutVoir} onClick={onToggleTout}
            className="relative h-6 w-11 shrink-0 rounded-full transition"
            style={{ background: toutVoir ? "hsl(var(--ok))" : "hsl(var(--border))" }}>
            <span className="absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white transition-all" style={{ left: toutVoir ? 21 : 3 }} />
          </button>
          <span>Tout voir <span className="opacity-70">({caches > 0 ? `${caches} élément(s) hors de votre profil / tranche d'âge` : "tout l'agenda public"})</span></span>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {visibles.length === 0 && <p className="text-muted-foreground">Sélectionnez au moins un centre d'intérêt, ou activez « Tout voir ».</p>}
        {visibles.map(({ it, s, blocked }, i) => {
          const Icon = feedIcons[it.icon] ?? Bell;
          const acc = it.accent === "muted" ? { text: "hsl(var(--muted-foreground))", bg: "hsl(var(--muted))", line: "hsl(var(--border))" } : A(it.accent);
          const rel = blocked ? ["low", "Hors de votre tranche d'âge"] : s >= 2 ? ["hi", "Très pertinent pour vous"] : s === 1 ? ["hi", "Vous concerne"] : ["low", "Suggéré"];
          return (
            <article key={i} className="flex items-start gap-4 rounded-lg border bg-card p-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ background: acc.bg, color: acc.text }}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/80">{it.kind}</div>
                <h3 className="mt-0.5 text-[16px] font-semibold">{it.titre}</h3>
                <p className="text-[14px] text-muted-foreground">{it.p}</p>
                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border px-2.5 py-0.5 text-[11px] font-bold"
                    style={rel[0] === "hi"
                      ? { color: "hsl(var(--ok))", background: "hsl(var(--ok-bg))", borderColor: "hsl(var(--ok-line))" }
                      : { color: "hsl(var(--muted-foreground))", background: "hsl(var(--muted))", borderColor: "hsl(var(--border))" }}>
                    {rel[1]}
                  </span>
                  {it.tags.map((t) => <span key={t} className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">{interetLabel(t)}</span>)}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-7 rounded-lg border bg-secondary/50 p-5">
        <h3 className="text-[15px] font-semibold">Comment l'algorithme décide</h3>
        <p className="mt-1.5 max-w-[72ch] text-[13.5px] text-muted-foreground">
          Il croise vos intérêts déclarés (jamais déduits en secret) avec les thèmes de chaque contenu, et remonte les
          correspondances. Le ciblage par âge <em>priorise</em> sans exclure&nbsp;: la séance « 40-50 ans » reste
          accessible via « Tout voir ». Vous gardez la main, et vous pouvez voir qui a consulté vos données.
        </p>
      </div>
    </div>
  );
}

function KraainemEnBref() {
  const [open, setOpen] = useState(false);
  return (
    <section className="mt-6 rounded-lg border bg-card">
      <div className="flex items-center gap-2 border-b px-5 py-3">
        <Landmark className="h-4 w-4 text-primary" />
        <h2 className="text-[15px] font-semibold">Kraainem en bref</h2>
        <span className="ml-auto rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">Données réelles · 2024</span>
      </div>
      <div className="grid grid-cols-2 gap-px overflow-hidden bg-border md:grid-cols-3">
        {communeFacts.map((f) => (
          <div key={f.k} className="bg-card p-4">
            <div className="text-[12px] font-medium uppercase tracking-wide text-muted-foreground/80">{f.k}</div>
            <div className="mt-0.5 text-[20px] font-bold tnum">{f.v}</div>
            <div className="text-[12px] text-muted-foreground">{f.s}</div>
          </div>
        ))}
      </div>
      <div className="border-t px-5 py-3">
        <button onClick={() => setOpen((o) => !o)} className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-[hsl(var(--link))] hover:underline">
          <Info className="h-3.5 w-3.5" /> {open ? "Masquer les sources" : "Voir les sources"}
        </button>
        {open && (
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[12.5px] text-muted-foreground">
            {communeSources.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        )}
      </div>
    </section>
  );
}

function Cap() {
  return (
    <div>
      <H1 eyebrow="Commune de Kraainem · Le cap">Le cap communal</H1>
      <Lede>Trois orientations de long terme. Chaque décision, euro, projet et service de la plateforme s'y rattache — rien n'est orphelin.</Lede>
      <KraainemEnBref />
      <div className="mt-6 flex flex-col gap-4">
        {orientations.map((o) => {
          const c = A(o.key);
          return (
            <article key={o.id} id={`ori-${o.id}`} className="scroll-mt-32 overflow-hidden rounded-lg border" style={{ borderColor: c.line }}>
              <div className="p-5" style={{ background: c.bg }}>
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="h-3 w-3 rounded-full" style={{ background: c.text }} />
                  <h2 className="text-[19px] font-semibold" style={{ color: c.text }}>{o.titre}</h2>
                  <span className="rounded-full border bg-card px-2.5 py-0.5 text-[12px] font-semibold text-muted-foreground">Horizon {o.horizon}</span>
                </div>
                <p className="mt-2 max-w-[68ch] text-[15px]">{o.resume}</p>
              </div>
              <div className="flex flex-col gap-4 bg-card p-5">
                <div className="flex items-start gap-3">
                  <Target className="mt-0.5 h-5 w-5 shrink-0" style={{ color: c.text }} />
                  <div><CapLabel>Cible mesurable</CapLabel><div className="text-[15px]">{o.cible}</div></div>
                </div>
                <div>
                  <CapLabel><ArrowUp className="h-3.5 w-3.5" /> Ce à quoi cette orientation se rattache</CapLabel>
                  <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                    {[["Régional", o.chain.regional], ["National", o.chain.national], ["Européen", o.chain.europeen]].map(([n, t]) => (
                      <div key={n} className="flex-1 rounded-xl border bg-secondary/60 px-3 py-2">
                        <div className="text-[11px] font-bold text-muted-foreground/80">{n}</div>
                        <div className="text-[13px]">{t}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <div className="mt-7 rounded-lg border bg-secondary/50 p-5">
        <h3 className="text-[15px] font-semibold">Ce que la plateforme ne fait pas</h3>
        <p className="mt-1.5 max-w-[72ch] text-[13.5px] text-muted-foreground">Pas de score agrégé, pas de note unique, pas de classement des élus. On publie des faits reliés à des orientations, et l'on laisse chacun juger.</p>
      </div>
      <ExportBar msg="Le cap communal est ouvert." name="cap-kraainem.json" data={orientations} />
    </div>
  );
}

type SeanceReelle = { id: string; date: string; url: string };
function Decisions() {
  const [filtre, setFiltre] = useState<OId | "toutes">("toutes");
  const [reel, setReel] = useState<{ items: SeanceReelle[]; total: number | null } | null>(null);
  const [charge, setCharge] = useState(true);
  const data = filtre === "toutes" ? decisions : decisions.filter((d) => d.o === filtre);
  const stateStyle: Record<string, React.CSSProperties> = {
    "adoptée": { color: "hsl(var(--ok))", background: "hsl(var(--ok-bg))", borderColor: "hsl(var(--ok-line))" },
    "en cours": { color: "hsl(var(--clim))", background: "hsl(var(--clim-bg))", borderColor: "hsl(var(--clim-line))" },
    "en projet": { color: "hsl(var(--muted-foreground))", background: "hsl(var(--muted))", borderColor: "hsl(var(--border))" },
  };

  useEffect(() => {
    let vivant = true;
    fetch("/api/lokaalbeslist?size=30", { headers: { Accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (!vivant) return;
        if (j && j.ok && Array.isArray(j.items) && j.items.length > 0) setReel({ items: j.items, total: j.total ?? null });
      })
      .catch(() => {})
      .finally(() => vivant && setCharge(false));
    return () => { vivant = false; };
  }, []);

  const dateLongue = (iso: string) => {
    try { return new Date(iso).toLocaleDateString("fr-BE", { weekday: "long", day: "numeric", month: "long", year: "numeric" }); }
    catch { return iso; }
  };

  return (
    <div>
      <H1>Décisions du conseil</H1>
      {reel ? (
        <>
          <Lede>Les séances réelles du conseil communal et du collège de Kraainem — déjà publiques, enfin lisibles.</Lede>
          <div className="mt-4 flex items-start gap-2.5 rounded-lg border p-3.5 text-[13px]" style={{ background: "hsl(var(--ok-bg))", borderColor: "hsl(var(--ok-line))" }}>
            <Radio className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "hsl(var(--ok))" }} />
            <p className="text-muted-foreground">
              <strong className="text-foreground" style={{ color: "hsl(var(--ok))" }}>Données réelles · Lokaal Beslist.</strong>{" "}
              {reel.total ?? dataMeta.sessionsTotal} séances publiées depuis {dataMeta.sessionsFrom}.{" "}
              <a href={dataMeta.lien} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium text-[hsl(var(--link))] hover:underline">source <ExternalLink className="h-3 w-3" /></a>
              <span className="opacity-70"> · Modellicentie Gratis Hergebruik</span>
            </p>
          </div>
          <div className="mt-5 flex flex-col gap-3">
            {reel.items.map((s) => (
              <article key={s.id} className="flex items-center justify-between gap-3 rounded-lg border bg-card p-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg" style={{ background: "hsl(var(--clim-bg))", color: "hsl(var(--clim))" }}><Landmark className="h-4.5 w-4.5" /></span>
                  <div>
                    <h3 className="text-[15px] font-semibold capitalize">Séance du {dateLongue(s.date)}</h3>
                    <div className="font-mono text-[11.5px] text-muted-foreground/70">{s.id}</div>
                  </div>
                </div>
                <a href={s.url} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-input bg-card px-3 py-1.5 text-[12.5px] font-semibold transition hover:bg-secondary">
                  Délibérations <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </article>
            ))}
          </div>
          <ExportBar msg="Les décisions du conseil sont ouvertes (source Lokaal Beslist)." name="seances-kraainem.json" data={reel.items} />
        </>
      ) : (
        <>
          <Lede>Chaque décision porte son coût, son état et l'orientation qu'elle sert.</Lede>
          <div className="mt-4 flex items-start gap-2.5 rounded-lg border p-3.5 text-[13px]" style={{ background: "hsl(var(--warn-bg))", borderColor: "hsl(var(--warn-line))" }}>
            <Info className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "hsl(var(--warn))" }} />
            <p className="text-muted-foreground">
              <strong className="text-foreground">Démonstration du principe.</strong> Les vraies décisions de Kraainem — <strong className="text-foreground">{dataMeta.sessionsTotal} séances publiées depuis {dataMeta.sessionsFrom}</strong> — sont déjà publiques en JSON ({dataMeta.connecteur}) ; personne ne les lit. Le connecteur est prêt : au déploiement, cet onglet affiche les séances réelles.{" "}
              <a href={dataMeta.lien} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium text-[hsl(var(--link))] hover:underline">voir la source <ExternalLink className="h-3 w-3" /></a>
              {charge ? " · connexion…" : ""}
            </p>
          </div>
          <div className="my-5 flex flex-wrap gap-2">
            <FilterChip active={filtre === "toutes"} onClick={() => setFiltre("toutes")}>Toutes ({decisions.length})</FilterChip>
            {orientations.map((o) => (
              <FilterChip key={o.id} active={filtre === o.id} onClick={() => setFiltre(o.id)} accent={o.key}>{o.court}</FilterChip>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            {data.map((d) => (
              <article key={d.id} className="rounded-lg border bg-card p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[12px] text-muted-foreground/80">{d.id}</span>
                  <span className="rounded-full border px-2.5 py-0.5 text-[12px] font-semibold" style={stateStyle[d.etat]}>{d.etat}</span>
                  <TrajBadge o={d.o} />
                </div>
                <h3 className="mt-2 text-[16.5px] font-semibold">{d.titre}</h3>
                <p className="mt-0.5 max-w-[74ch] text-[14px] text-muted-foreground">{d.desc}</p>
                <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" />{dateFr(d.date)}</span>
                  <span className="font-semibold text-foreground tnum">{eur(d.cout)}</span>
                </div>
              </article>
            ))}
          </div>
          <ExportBar msg="Les décisions (démonstration) sont ouvertes." name="decisions-demo.json" data={data} />
        </>
      )}
    </div>
  );
}
function FilterChip({ active, onClick, accent, children }: { active: boolean; onClick: () => void; accent?: string; children: React.ReactNode }) {
  const style = active && accent ? { color: A(accent).text, background: A(accent).bg, borderColor: A(accent).line } : undefined;
  return (
    <button onClick={onClick} aria-pressed={active} style={style}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-medium transition ${active && !accent ? "border-primary bg-primary text-primary-foreground" : active ? "" : "bg-card text-muted-foreground hover:bg-secondary"}`}>
      {accent && <span className="h-2 w-2 rounded-full" style={{ background: A(accent).text }} />}{children}
    </button>
  );
}

function BudgetChart() {
  const W = 680, H = 230, padL = 44, padB = 32, padT = 8;
  const max = Math.max(...budget.lignes.map((l) => l.vote));
  const gw = (W - padL) / budget.lignes.length;
  const yS = (v: number) => (H - padB) - (v / max) * (H - padB - padT);
  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: 520, display: "block" }}>
        {[0, max / 2, max].map((v, i) => (
          <g key={i}>
            <line x1={padL} x2={W} y1={yS(v)} y2={yS(v)} stroke="hsl(var(--border))" />
            <text x={padL - 8} y={yS(v) + 4} textAnchor="end" fontSize="11" fill="hsl(var(--muted-foreground))">{Math.round(v / 1000)}k</text>
          </g>
        ))}
        {budget.lignes.map((l, i) => {
          const cx = padL + gw * i + gw / 2, bw = Math.min(44, gw / 3), or = oriById(l.o);
          return (
            <g key={l.o}>
              <rect x={cx - bw - 3} y={yS(l.vote)} width={bw} height={(H - padB) - yS(l.vote)} rx="4" fill="hsl(var(--muted-foreground))" opacity="0.35"><title>Voté {eur(l.vote)}</title></rect>
              <rect x={cx + 3} y={yS(l.exec)} width={bw} height={(H - padB) - yS(l.exec)} rx="4" fill={`hsl(var(--${or.key}))`}><title>Exécuté {eur(l.exec)}</title></rect>
              <text x={cx} y={H - padB + 18} textAnchor="middle" fontSize="12" fill="hsl(var(--muted-foreground))">{or.court}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
function Budget() {
  const tv = budget.lignes.reduce((s, l) => s + l.vote, 0);
  const te = budget.lignes.reduce((s, l) => s + l.exec, 0);
  return (
    <div>
      <H1>Budget {budget.annee}</H1>
      <Lede>Du voté à l'exécuté, orientation par orientation. Où va l'argent — sans note ni classement.</Lede>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[["Budget total", eur(commune.totalBudget), ""], ["Voté sur les orientations", eur(tv), `${pct((tv / commune.totalBudget) * 100)} du budget`], ["Exécuté à ce jour", eur(te), `${pct((te / tv) * 100)} du voté`]].map(([k, v, s]) => (
          <div key={k} className="rounded-lg border bg-card p-4">
            <div className="text-[13px] text-muted-foreground">{k}</div>
            <div className="mt-1 text-[24px] font-semibold tnum">{v}</div>
            {s && <div className="text-[12px] text-muted-foreground/80">{s}</div>}
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-lg border bg-card p-5">
        <h2 className="text-[19px] font-semibold">Voté vs exécuté</h2>
        <div className="my-3 flex gap-4 text-[13px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><i className="h-3 w-3 rounded-sm" style={{ background: "hsl(var(--muted-foreground))", opacity: .35 }} />Voté</span>
          <span className="inline-flex items-center gap-1.5"><i className="h-3 w-3 rounded-sm bg-primary" />Exécuté (couleur d'orientation)</span>
        </div>
        <BudgetChart />
      </div>
      <div className="mt-4 flex flex-col gap-4">
        {budget.lignes.map((l) => {
          const or = oriById(l.o), taux = (l.exec / l.vote) * 100;
          return (
            <div key={l.o} className="rounded-lg border bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div><h3 className="mb-1.5 text-[15px] font-semibold">{l.intitule}</h3><TrajBadge o={l.o} /></div>
                <div className="text-right"><div className="text-[12px] text-muted-foreground/80">Exécuté / voté</div>
                  <div className="font-semibold tnum">{eur(l.exec)} <span className="text-muted-foreground/70">/ {eur(l.vote)}</span></div></div>
              </div>
              <div className="mt-3"><Bar value={taux} color={`hsl(var(--${or.key}))`} /></div>
              <div className="mt-1.5 text-[12.5px] text-muted-foreground">{pct(taux)} engagé</div>
            </div>
          );
        })}
      </div>
      <ExportBar msg="Le budget est ouvert." name="budget.json" data={budget} />
    </div>
  );
}

function Projets() {
  const tri = [
    { key: "eco", label: "Économique", val: "Retour" }, { key: "soc", label: "Social", val: "Lien" }, { key: "env", label: "Environnemental", val: "Impact" },
  ] as const;
  return (
    <div>
      <H1>Projets & financement citoyen</H1>
      <Lede>Des projets portés par la commune et les habitants, avec appel de fonds et <strong>rentabilité espérée en triple comptabilité</strong> — économique, social et environnemental, présentés séparément (jamais fondus en un score unique).</Lede>
      <div className="mt-6 flex flex-col gap-4">
        {projets.map((p) => {
          const or = oriById(p.o), taux = (p.collecte / p.objectif) * 100;
          return (
            <article key={p.id} className="rounded-lg border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div><TrajBadge o={p.o} /><h3 className="mt-2 text-[17px] font-semibold">{p.titre}</h3></div>
                <span className="rounded-full border bg-card px-2.5 py-0.5 text-[12px] font-semibold text-muted-foreground">{p.contrib} contributeurs</span>
              </div>
              <div className="mt-3.5 rounded-xl bg-secondary/60 p-3.5">
                <div className="mb-2 flex justify-between text-[13px]"><span className="text-muted-foreground">Appel de fonds</span>
                  <span className="font-bold tnum">{eur(p.collecte)} <span className="font-medium text-muted-foreground/70">/ {eur(p.objectif)}</span></span></div>
                <Bar value={taux} color={`hsl(var(--${or.key}))`} />
                <div className="mt-1.5 text-[12.5px] text-muted-foreground">{pct(taux)} réunis — il reste {eur(p.objectif - p.collecte)}</div>
              </div>
              <div className="mt-4"><CapLabel><Gauge className="h-3.5 w-3.5" /> Rentabilité espérée — triple comptabilité</CapLabel></div>
              <div className="mt-2 grid gap-2.5 sm:grid-cols-3">
                {tri.map((t) => (
                  <div key={t.key} className="rounded-xl border p-3">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide" style={{ color: `hsl(var(--${t.key}))` }}>
                      <span className="h-2 w-2 rounded-full" style={{ background: `hsl(var(--${t.key}))` }} />{t.label}
                    </div>
                    <div className="mt-1.5 text-[15px] font-semibold">{t.val}</div>
                    <div className="text-[12px] text-muted-foreground">{(p as any)[t.key]}</div>
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </div>
      <ExportBar msg="Les projets et appels de fonds sont ouverts." name="projets.json" data={projets} />
    </div>
  );
}

function Jeunes() {
  const [f, setF] = useState<"tous" | "para" | "stage" | "event">("tous");
  const label: Record<string, string> = { para: "Parascolaire", stage: "Stage communal", event: "Lijsterbes" };
  const style: Record<string, React.CSSProperties> = {
    para: { color: "hsl(var(--tran))", background: "hsl(var(--tran-bg))", borderColor: "hsl(var(--tran-line))" },
    stage: { color: "hsl(var(--eco))", background: "hsl(var(--ok-bg))", borderColor: "hsl(var(--ok-line))" },
    event: { color: "hsl(var(--clim))", background: "hsl(var(--clim-bg))", borderColor: "hsl(var(--clim-line))" },
  };
  const data = f === "tous" ? jeunes : jeunes.filter((j) => j.type === f);
  return (
    <div>
      <H1>Jeunes</H1>
      <Lede>Le parascolaire, les stages sponsorisés par la commune, et les événements jeunes organisés par le Lijsterbes — au même endroit, inscription via le guichet unique.</Lede>
      <div className="my-5 flex flex-wrap gap-2">
        {[["tous", "Tout"], ["para", "Parascolaire"], ["stage", "Stages"], ["event", "Lijsterbes"]].map(([id, l]) => (
          <FilterChip key={id} active={f === id} onClick={() => setF(id as any)}>{l}</FilterChip>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {data.map((j, i) => (
          <article key={i} className="flex flex-col gap-2 rounded-lg border bg-card p-4">
            <div><span className="rounded-full border px-2.5 py-0.5 text-[11px] font-semibold" style={style[j.type]}>{label[j.type]}</span></div>
            <h3 className="text-[16px] font-semibold">{j.titre}</h3>
            <p className="text-[13.5px] text-muted-foreground">{j.k}</p>
            <AccessBadges acces={j.acces} />
            <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-[12.5px] text-muted-foreground">
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold">{j.age}</span>
              <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{j.quand}</span>
              <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{j.lieu}</span>
            </div>
            <button onClick={() => alert("Démo — inscription via le guichet unique (itsme).")}
              className="mt-1 inline-flex w-fit items-center rounded-lg border border-input bg-card px-3 py-1.5 text-[12.5px] font-semibold transition hover:bg-secondary">S'inscrire</button>
          </article>
        ))}
      </div>
    </div>
  );
}

function Entraide() {
  const [mode, setMode] = useState<"demande" | "offre">("demande");
  const data = entraide.filter((e) => e.mode === mode);
  return (
    <div>
      <H1>Entraide entre voisins</H1>
      <Lede><strong>Demander est gratuit — sans frais, sans engagement, sans gêne.</strong> Et répondre est un geste unique&nbsp;: une fois, sans s'inscrire à rien. Chaque personne est identifiée via itsme (la confiance sans l'anonymat) ; les coordonnées restent privées.</Lede>
      <div className="my-5 inline-flex gap-1 rounded-xl border bg-secondary/60 p-1">
        {[["demande", "Demandes"], ["offre", "Propositions d'aide"]].map(([id, l]) => (
          <button key={id} aria-pressed={mode === id} onClick={() => setMode(id as any)}
            className={`rounded-lg px-3.5 py-1.5 text-[13.5px] font-semibold transition ${mode === id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>{l}</button>
        ))}
      </div>
      {mode === "demande" && (
        <p className="mb-4 -mt-1 text-[13px] text-muted-foreground">Un petit coup de main suffit — une échelle, un colis, des plantes à arroser. Répondre prend deux minutes.</p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {data.map((e, i) => (
          <article key={i} className="flex h-full flex-col gap-2 rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">{e.cat}</span>
              <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-bold"
                style={{ color: "hsl(var(--itsme))", background: "hsl(var(--itsme) / 0.1)", borderColor: "hsl(var(--itsme) / 0.3)" }}>
                <BadgeCheck className="h-3 w-3" /> vérifié·e via itsme
              </span>
            </div>
            <h3 className="text-[16px] font-semibold">{e.titre}</h3>
            <p className="text-[13.5px] text-muted-foreground">{e.k}</p>
            <div className="mt-auto flex items-center gap-2.5 pt-2">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[13px] font-bold text-white" style={{ background: `hsl(${e.col})` }}>{e.av}</span>
              <span><span className="block text-[14px] font-semibold leading-tight">{e.nom}</span>
                <span className="inline-flex items-center gap-1 text-[12px] text-muted-foreground/80"><MapPin className="h-3 w-3" />{e.quartier}</span></span>
            </div>
            <button onClick={() => alert("Démo — mise en relation via la plateforme, coordonnées non publiques.")}
              className="mt-1 inline-flex w-fit items-center rounded-lg border border-input bg-card px-3 py-1.5 text-[12.5px] font-semibold transition hover:bg-secondary">
              {mode === "offre" ? "Contacter" : "Proposer mon aide"}</button>
          </article>
        ))}
      </div>
      <div className="mt-7 rounded-lg border bg-secondary/50 p-5">
        <h3 className="text-[15px] font-semibold">Identité & vie privée</h3>
        <p className="mt-1.5 max-w-[72ch] text-[13.5px] text-muted-foreground">itsme garantit que chaque profil est une personne réelle du territoire (fini les faux comptes). Public&nbsp;: le prénom, l'initiale, le quartier et le badge vérifié. Privé&nbsp;: l'adresse et les coordonnées. C'est « transparence des institutions, protection des personnes » appliqué à l'entraide.</p>
      </div>
    </div>
  );
}

function Bord() {
  const Tile = ({ k, v, t, perso }: { k: string; v: string; t: string; perso?: boolean }) => (
    <div className="rounded-lg border bg-card p-4">
      <div className="text-[13px] text-muted-foreground">{k}</div>
      <div className="mt-1 text-[23px] font-semibold tnum">{v}</div>
      <div className="mt-0.5 text-[12px] font-semibold" style={{ color: perso ? "hsl(var(--muted-foreground))" : "hsl(var(--ok))" }}>{perso ? "" : "▲ "}{t}</div>
    </div>
  );
  return (
    <div>
      <H1>Tableau de bord</H1>
      <Lede>Les indicateurs de la commune et les vôtres, côte à côte — et comment l'action publique et votre action personnelle se renforcent.</Lede>
      <div className="mt-6"><CapLabel><Gauge className="h-3.5 w-3.5" /> Les KPI de la commune</CapLabel></div>
      <div className="mt-3 grid gap-4 sm:grid-cols-3">{kpiCommune.map((k) => <Tile key={k.k} {...k} />)}</div>
      <div className="mt-7"><CapLabel><Radio className="h-3.5 w-3.5" /> Le service, mesuré sans se flatter <span className="ml-1 font-medium normal-case tracking-normal opacity-70">— on mesure le lien noué, pas le temps passé dans l'app</span></CapLabel></div>
      <div className="mt-3 grid gap-4 sm:grid-cols-3">{kpiService.map((k) => <Tile key={k.k} {...k} />)}</div>
      <div className="mt-7"><CapLabel>Mes indicateurs <span className="ml-1 font-medium normal-case tracking-normal opacity-70">— privés, non comparatifs, sans classement ni score citoyen</span></CapLabel></div>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">{kpiPerso.map((k) => <Tile key={k.k} {...k} perso />)}</div>
      <div className="mt-7"><CapLabel><Sparkles className="h-3.5 w-3.5" /> Quand le politique renforce le personnel</CapLabel></div>
      <div className="mt-3 flex flex-col gap-4">
        {synergies.map((s, i) => (
          <div key={i} className="rounded-lg border bg-card p-4">
            <div className="grid items-stretch gap-3 sm:grid-cols-[1fr_auto_1fr]">
              <div className="rounded-xl border p-3 text-[13.5px]" style={{ background: "hsl(var(--clim-bg))", borderColor: "hsl(var(--clim-line))" }}>
                <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide" style={{ color: "hsl(var(--clim))" }}><Vote className="h-3.5 w-3.5" /> Action communale</div>{s.pol}
              </div>
              <div className="grid place-items-center font-bold text-muted-foreground/70"><Plus className="h-5 w-5" /></div>
              <div className="rounded-xl border p-3 text-[13.5px]" style={{ background: "hsl(var(--tran-bg))", borderColor: "hsl(var(--tran-line))" }}>
                <div className="mb-1 text-[11px] font-bold uppercase tracking-wide" style={{ color: "hsl(var(--tran))" }}>Votre action</div>{s.per}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2.5 rounded-xl border p-3 text-[14px]" style={{ background: "hsl(var(--ok-bg))", borderColor: "hsl(var(--ok-line))" }}>
              <Sparkles className="h-4 w-4 shrink-0" style={{ color: "hsl(var(--ok))" }} />
              <span><b style={{ color: "hsl(var(--ok))" }}>Ensemble :</b> {s.res}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-7"><CapLabel><Target className="h-3.5 w-3.5" /> Le pilote est évaluable — et peut s'arrêter</CapLabel></div>
      <div className="mt-3 overflow-hidden rounded-lg border bg-card">
        <div className="grid grid-cols-[1fr_auto] gap-x-4 border-b bg-secondary/50 px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground/80 sm:grid-cols-[1.4fr_1fr_auto]">
          <span>Critère</span><span className="hidden sm:block">Seuil / échéance</span><span className="text-right">État</span>
        </div>
        {pilotesEval.map((p, i) => (
          <div key={i} className="grid grid-cols-[1fr_auto] items-center gap-x-4 border-b px-4 py-2.5 text-[13.5px] last:border-0 sm:grid-cols-[1.4fr_1fr_auto]">
            <div><div className="font-medium">{p.critere}</div><div className="text-[12px] text-muted-foreground/80">{p.brique}</div></div>
            <div className="hidden text-[12.5px] text-muted-foreground sm:block">{p.seuil}</div>
            <div className="flex items-center justify-end gap-1.5 text-right text-[12.5px] font-semibold" style={{ color: p.ok ? "hsl(var(--ok))" : "hsl(var(--muted-foreground))" }}>
              {p.ok ? <CheckCircle2 className="h-4 w-4" /> : <Timer className="h-4 w-4" />}{p.etat}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-start gap-2.5 rounded-lg border p-3 text-[13px]" style={{ background: "hsl(var(--warn-bg))", borderColor: "hsl(var(--warn-line))" }}>
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "hsl(var(--warn))" }} />
        <p className="text-muted-foreground"><strong className="text-foreground">Clause d'arrêt.</strong> Si un seuil n'est pas atteint à l'échéance, le dispositif concerné s'arrête sans nouvelle décision. Le prolonger exige un vote motivé ; l'arrêter est le défaut.</p>
      </div>

      <div className="mt-6"><CapLabel><Ban className="h-3.5 w-3.5" /> Registre des échecs — ce qu'on a arrêté, et pourquoi</CapLabel></div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {registreEchecs.map((e, i) => (
          <div key={i} className="rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-[14.5px] font-semibold">{e.titre}</h3>
              <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">{e.verdict}</span>
            </div>
            <p className="mt-1.5 text-[13px] text-muted-foreground">{e.raison}</p>
          </div>
        ))}
      </div>

      <ExportBar msg="Les KPI publics de la commune sont ouverts (vos KPI restent privés)." name="kpi-commune.json" data={kpiCommune} />
    </div>
  );
}

function AgendaVue() {
  const [f, setF] = useState<"tous" | "culture" | "sport">("tous");
  const data = f === "tous" ? agenda : agenda.filter((a) => a.type === f);
  const meta = {
    culture: { label: "Culture", Icon: Music, style: { color: "hsl(var(--tran))", background: "hsl(var(--tran-bg))", borderColor: "hsl(var(--tran-line))" } as React.CSSProperties },
    sport: { label: "Sport", Icon: Trophy, style: { color: "hsl(var(--clim))", background: "hsl(var(--clim-bg))", borderColor: "hsl(var(--clim-line))" } as React.CSSProperties },
  };
  return (
    <div>
      <H1>Culture & sport</H1>
      <Lede>L'agenda des événements culturels et sportifs de la commune et de ses associations — le Lijsterbes, les clubs, l'académie. Ce qui vous concerne remonte aussi dans « Pour vous ».</Lede>
      <div className="my-5 flex flex-wrap gap-2">
        {[["tous", "Tout"], ["culture", "Culture"], ["sport", "Sport"]].map(([id, l]) => (
          <FilterChip key={id} active={f === id} onClick={() => setF(id as any)}>{l}</FilterChip>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {data.map((a, i) => {
          const m = meta[a.type];
          return (
            <article key={i} className="flex flex-col gap-2 rounded-lg border bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold" style={m.style}>
                  <m.Icon className="h-3 w-3" />{m.label}
                </span>
                <span className="inline-flex items-center gap-1 text-[12px] text-muted-foreground/80"><Ticket className="h-3.5 w-3.5" />{a.prix}</span>
              </div>
              <h3 className="text-[16px] font-semibold">{a.titre}</h3>
              <p className="text-[13.5px] text-muted-foreground">{a.k}</p>
              <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-[12.5px] text-muted-foreground">
                <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{a.quand}</span>
                <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{a.lieu}</span>
              </div>
              <button onClick={() => alert("Démo — agenda et inscriptions via le guichet unique.")}
                className="mt-1 inline-flex w-fit items-center rounded-lg border border-input bg-card px-3 py-1.5 text-[12.5px] font-semibold transition hover:bg-secondary">Ajouter à mon agenda</button>
            </article>
          );
        })}
      </div>
      <ExportBar msg="L'agenda culturel et sportif est ouvert." name="agenda.json" data={agenda} />
    </div>
  );
}

function Familles() {
  const [part, setPart] = useState<"inscription" | "conseils" | "aide">("inscription");
  return (
    <div>
      <H1 eyebrow="Enfants de moins de 12 ans">Familles</H1>
      <Lede>
        Une <strong>inscription unique</strong> pour tout ce qui concerne l'enfant, des <strong>conseils</strong>
        (pensés d'abord pour les mamans, sur qui la charge repose le plus, et ouverts à tous les parents), et de
        l'<strong>aide à domicile</strong> concrète.
      </Lede>

      <div className="my-5 inline-flex flex-wrap gap-1 rounded-xl border bg-secondary/60 p-1">
        {[["inscription", "Inscription unique"], ["conseils", "Conseils & ressources"], ["aide", "Aide à domicile"]].map(([id, l]) => (
          <button key={id} aria-pressed={part === id} onClick={() => setPart(id as any)}
            className={`rounded-lg px-3.5 py-1.5 text-[13.5px] font-semibold transition ${part === id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>{l}</button>
        ))}
      </div>

      {part === "inscription" ? (
        <div>
          <div className="rounded-lg border bg-card">
            <div className="flex flex-wrap items-center gap-2 border-b px-5 py-3.5">
              <GraduationCap className="h-4.5 w-4.5 text-primary" />
              <h2 className="text-[15.5px] font-semibold">Le dossier de {enfant.prenom}, {enfant.age} ans</h2>
              <span className="ml-auto rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">{enfant.ecole}</span>
            </div>
            <ul className="divide-y">
              {inscriptionUnique.map((d, i) => {
                const fait = d.etat === "fait";
                return (
                  <li key={i} className="flex items-center gap-3 px-5 py-3">
                    <span className="shrink-0" style={{ color: fait ? "hsl(var(--ok))" : "hsl(var(--warn))" }}>
                      {fait ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[14.5px] font-medium">{d.domaine}</div>
                      <div className="text-[12.5px] text-muted-foreground">{d.detail}</div>
                    </div>
                    {fait ? (
                      <span className="shrink-0 text-[12px] font-semibold" style={{ color: "hsl(var(--ok))" }}>Fait</span>
                    ) : (
                      <button onClick={() => alert("Démo — préremplissage à partir de ce que la commune sait déjà, via itsme.")}
                        className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-[12px] font-semibold text-primary-foreground hover:opacity-90">
                        Confirmer · avant le {dateFr(d.echeance!)}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
            <div className="flex flex-wrap items-center justify-between gap-2 border-t px-5 py-3.5">
              <span className="text-[12.5px] text-muted-foreground">Les échéances sont tenues à votre place — rappel unique, jamais de relance inutile.</span>
              <button onClick={() => alert("Démo — un seul formulaire pour école, garderie, cantine, sport et académie (guichet unique, itsme).")}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-[13px] font-semibold text-primary-foreground hover:opacity-90">
                <ClipboardCheck className="h-4 w-4" /> Tout gérer en une fois
              </button>
            </div>
          </div>
          <div className="mt-6 rounded-lg border bg-secondary/50 p-5">
            <h3 className="text-[15px] font-semibold">« Dites-le-nous une fois »</h3>
            <p className="mt-1.5 max-w-[72ch] text-[13.5px] text-muted-foreground">
              Un seul point d'entrée pour école, garderie, cantine, sport et académie. La commune préremplit ce
              qu'elle sait déjà (loi « Only Once ») ; quand un droit est acquis, l'inscription est <strong>d'office</strong>.
              C'est le seul endroit où l'application <strong>rend du temps</strong> au lieu d'en informer — chaque
              soirée qu'un parent ne passe plus à remplir des formulaires est le gain le plus tangible du pilote.
            </p>
          </div>
        </div>
      ) : part === "conseils" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {familleConseils.map((c, i) => {
            const Icon = conseilIcons[c.icon] ?? Heart;
            return (
              <article key={i} className="flex gap-3.5 rounded-lg border bg-card p-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ background: "hsl(var(--tran-bg))", color: "hsl(var(--tran))" }}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-[15.5px] font-semibold">{c.titre}</h3>
                  <p className="mt-0.5 text-[13.5px] text-muted-foreground">{c.k}</p>
                  <div className="mt-2 inline-flex items-center gap-1.5 text-[11.5px] font-medium text-muted-foreground/80">
                    <BookOpen className="h-3.5 w-3.5" />{c.source}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {familleAide.map((a, i) => {
            const Icon = conseilIcons[a.icon] ?? Home;
            return (
              <article key={i} className="flex h-full flex-col gap-2 rounded-lg border bg-card p-4">
                <div className="flex items-center justify-between">
                  <div className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: "hsl(var(--ok-bg))", color: "hsl(var(--ok))" }}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">{a.via}</span>
                </div>
                <h3 className="text-[15.5px] font-semibold">{a.titre}</h3>
                <p className="text-[13.5px] text-muted-foreground">{a.k}</p>
                <button onClick={() => alert("Démo — demande via le guichet unique (itsme). Droit ouvert = inscription d'office.")}
                  className="mt-auto inline-flex w-fit items-center rounded-lg border border-input bg-card px-3 py-1.5 text-[12.5px] font-semibold transition hover:bg-secondary">Demander cette aide</button>
              </article>
            );
          })}
        </div>
      )}

      <div className="mt-7 rounded-lg border bg-secondary/50 p-5">
        <h3 className="text-[15px] font-semibold">Pourquoi centrer sur les mamans — sans exclure</h3>
        <p className="mt-1.5 max-w-[72ch] text-[13.5px] text-muted-foreground">
          La charge de la petite enfance et la charge mentale pèsent encore d'abord sur les mères&nbsp;: cet espace
          part de là. Mais l'aide s'adresse à tous les parents et co-parents — le but est d'alléger la charge, pas
          d'assigner qui doit la porter.
        </p>
      </div>
    </div>
  );
}

function Engagements() {
  const [suivis, setSuivis] = useState<Set<string>>(new Set(["E-05"]));
  const toggle = (id: string) => setSuivis((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const meta: Record<string, { label: string; Icon: typeof Clock; style: React.CSSProperties }> = {
    "promis": { label: "Promis", Icon: Clock, style: { color: "hsl(var(--muted-foreground))", background: "hsl(var(--muted))", borderColor: "hsl(var(--border))" } },
    "voté": { label: "Voté", Icon: Vote, style: { color: "hsl(var(--clim))", background: "hsl(var(--clim-bg))", borderColor: "hsl(var(--clim-line))" } },
    "en cours": { label: "En cours", Icon: Timer, style: { color: "hsl(var(--tran))", background: "hsl(var(--tran-bg))", borderColor: "hsl(var(--tran-line))" } },
    "fait": { label: "Fait", Icon: CheckCircle2, style: { color: "hsl(var(--ok))", background: "hsl(var(--ok-bg))", borderColor: "hsl(var(--ok-line))" } },
    "en retard": { label: "En retard", Icon: AlertTriangle, style: { color: "hsl(var(--warn))", background: "hsl(var(--warn-bg))", borderColor: "hsl(var(--warn-line))" } },
  };
  return (
    <div>
      <H1>Engagements</H1>
      <Lede>
        Ce qui a été promis, ce qui a été voté, ce qui est fait — sourcé, et <strong>sans note ni classement</strong>.
        Vous pouvez suivre un engagement et interpeller le conseil : personne ne porte l'intérêt lésé à votre place.
      </Lede>
      <div className="mt-6 flex flex-col gap-4">
        {engagements.map((e) => {
          const m = meta[e.etat]; const suivi = suivis.has(e.id);
          return (
            <article key={e.id} className="rounded-lg border bg-card p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[12px] text-muted-foreground/80">{e.id}</span>
                <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[12px] font-semibold" style={m.style}><m.Icon className="h-3.5 w-3.5" />{m.label}</span>
                <TrajBadge o={e.o} />
              </div>
              <h3 className="mt-2 text-[16.5px] font-semibold">{e.titre}</h3>
              <p className="mt-0.5 text-[14px] text-muted-foreground">{e.detail}</p>
              <div className="mt-2 flex items-center gap-1.5 text-[12px] text-muted-foreground/80"><FileText className="h-3.5 w-3.5" />Source : {e.source}</div>
              <div className="mt-3.5 flex flex-wrap items-center gap-2">
                <button onClick={() => toggle(e.id)} aria-pressed={suivi}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12.5px] font-semibold transition ${suivi ? "border-primary bg-primary text-primary-foreground" : "border-input bg-card hover:bg-secondary"}`}>
                  <Eye className="h-4 w-4" />{suivi ? "Suivi" : "Suivre"}
                </button>
                <button onClick={() => alert("Démo — question écrite au conseil communal. Droit prévu par le règlement d'ordre intérieur : le collège doit répondre, et la réponse est publiée. Délai indicatif : 30 jours.")}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-input bg-card px-3 py-1.5 text-[12.5px] font-semibold transition hover:bg-secondary" title="Question écrite au conseil — réponse due sous 30 jours">
                  <Flag className="h-4 w-4" />Poser une question au conseil
                </button>
                <span className="ml-auto text-[12px] text-muted-foreground/80">{e.suiveurs + (suivi ? 1 : 0)} citoyens suivent</span>
              </div>
            </article>
          );
        })}
      </div>
      <div className="mt-7 rounded-lg border bg-secondary/50 p-5">
        <h3 className="text-[15px] font-semibold">Suivre, et poser une question qui a une réponse due</h3>
        <p className="mt-1.5 max-w-[72ch] text-[13.5px] text-muted-foreground">
          La transparence seule ne change rien là où celui qui décide ne subit aucun coût de l'inaction. « Suivre »
          rend l'intérêt visible ; « poser une question » l'adresse par le <strong>droit de question écrite au conseil</strong> —
          un canal réel, avec une réponse due sous 30 jours et publiée. Ce n'est ni un « j'aime » ni un vote : c'est
          une promesse que la commune doit tenir, pas une boîte à idées sans suite.
        </p>
      </div>
      <ExportBar msg="Le registre des engagements est ouvert." name="engagements.json" data={engagements} />
    </div>
  );
}

function Sources() {
  const meta: Record<SourceStatut, { label: string; style: React.CSSProperties }> = {
    "disponible": { label: "Disponible", style: { color: "hsl(var(--ok))", background: "hsl(var(--ok-bg))", borderColor: "hsl(var(--ok-line))" } },
    "a-tester": { label: "À tester", style: { color: "hsl(var(--clim))", background: "hsl(var(--clim-bg))", borderColor: "hsl(var(--clim-line))" } },
    "a-parser": { label: "Fichier à parser", style: { color: "hsl(var(--warn))", background: "hsl(var(--warn-bg))", borderColor: "hsl(var(--warn-line))" } },
    "manquant": { label: "Manquant", style: { color: "hsl(var(--muted-foreground))", background: "hsl(var(--muted))", borderColor: "hsl(var(--border))" } },
  };
  return (
    <div>
      <H1>Sources & données</H1>
      <Lede>D'où viennent les chiffres — et ce qui n'existe pas encore. Un pilote qui commence par dire ce qu'il ne peut pas mesurer est plus crédible que celui qui prétend tout savoir.</Lede>

      <div className="mt-5 flex items-start gap-2.5 rounded-lg border p-3.5 text-[13.5px]" style={{ background: "hsl(var(--brand-weak))", borderColor: "hsl(var(--clim-line))" }}>
        <Database className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "hsl(var(--brand))" }} />
        <p className="text-muted-foreground"><strong className="text-foreground">{dataMeta.sessionsTotal} séances du conseil déjà publiques en JSON depuis {dataMeta.sessionsFrom}</strong> — et personne ne les lit. Rendre lisible ce qui est déjà public, c'est tout le pilote.</p>
      </div>

      <div className="mt-5 overflow-hidden rounded-lg border bg-card">
        {dataSources.map((s, i) => (
          <div key={i} className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b px-4 py-3 last:border-0">
            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-medium">{s.nom}</div>
              <div className="text-[12.5px] text-muted-foreground">{s.source}{s.note ? <span className="opacity-80"> — {s.note}</span> : null}</div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {s.licence && <span className="hidden text-[11px] text-muted-foreground/70 sm:inline">{s.licence}</span>}
              <span className="rounded-full border px-2.5 py-0.5 text-[11px] font-semibold" style={meta[s.statut].style}>{meta[s.statut].label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-7"><CapLabel><Ban className="h-3.5 w-3.5" /> Ce qui n'existe pas — et qu'on assume</CapLabel></div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {dataGaps.map((g, i) => (
          <div key={i} className="rounded-lg border bg-card p-4">
            <h3 className="text-[14px] font-semibold">{g.nom}</h3>
            <p className="mt-1 text-[12.5px] text-muted-foreground">{g.raison}</p>
          </div>
        ))}
      </div>

      <div className="mt-7 rounded-lg border bg-secondary/50 p-5">
        <h3 className="text-[15px] font-semibold">Licences & mentions</h3>
        <ul className="mt-1.5 list-disc space-y-1 pl-5 text-[12.5px] text-muted-foreground">
          {dataLicences.map((l, i) => <li key={i}>{l}</li>)}
        </ul>
      </div>
      <ExportBar msg="L'inventaire des sources est ouvert." name="sources-donnees.json" data={{ sources: dataSources, manquant: dataGaps }} />
    </div>
  );
}

/* ---------- app shell ---------- */
type NavItem = readonly [string, string, typeof Sparkles];
const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  { label: "", items: [["vous", "Pour vous", Sparkles]] },
  { label: "Ma commune", items: [
    ["cap", "Le cap", Compass], ["decisions", "Décisions", ListChecks], ["engagements", "Engagements", ClipboardCheck],
    ["budget", "Budget", Wallet], ["projets", "Projets & fonds", Rocket], ["bord", "Tableau de bord", Gauge],
    ["sources", "Sources & données", Database],
  ] },
  { label: "Services aux citoyens", items: [
    ["familles", "Familles", Baby], ["jeunes", "Jeunes", Users],
    ["agenda", "Culture & sport", CalendarDays], ["entraide", "Entraide", Handshake],
  ] },
];
const NAV_FLAT = NAV_GROUPS.flatMap((g) => g.items);
const navLabel = (id: string) => NAV_FLAT.find((i) => i[0] === id)?.[1] ?? "";

function NavList({ tab, onGo }: { tab: string; onGo: (t: string) => void }) {
  return (
    <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
      {NAV_GROUPS.map((g, gi) => (
        <div key={gi}>
          {g.label && <div className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">{g.label}</div>}
          <div className="space-y-0.5">
            {g.items.map(([id, label, Icon]) => {
              const active = tab === id;
              return (
                <button key={id} onClick={() => onGo(id)} aria-current={active ? "page" : undefined}
                  className={`flex w-full items-center gap-2.5 rounded-md border-l-2 px-3 py-2 text-left text-[14px] transition ${
                    active
                      ? "border-primary bg-[hsl(var(--brand-weak))] font-semibold text-primary"
                      : "border-transparent text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
                  <Icon className="h-[17px] w-[17px] shrink-0" />{label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

function Brand({ onClick }: { onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2.5 text-left">
      <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-[15px] font-bold text-primary-foreground">K</span>
      <span className="leading-tight">
        <span className="block text-[14.5px] font-bold">Kraainem</span>
        <span className="block text-[11.5px] text-muted-foreground">Plateforme citoyenne</span>
      </span>
    </button>
  );
}

export default function App() {
  const [tab, setTab] = useState<string>("vous");
  const [dark, setDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [interests, setInterests] = useState<Set<string>>(new Set(["famille", "enfance", "alimentation", "entraide", "climat"]));
  const [toutVoir, setToutVoir] = useState(false);

  useEffect(() => { setDark(window.matchMedia("(prefers-color-scheme: dark)").matches); }, []);
  useEffect(() => { document.documentElement.classList.toggle("dark", dark); }, [dark]);
  useEffect(() => {
    (window as any).__go = (t: string, anchor?: string) => {
      setTab(t);
      if (anchor) setTimeout(() => document.getElementById(`ori-${anchor}`)?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
      else window.scrollTo({ top: 0 });
    };
  }, []);

  const go = (t: string) => { setTab(t); setMobileOpen(false); window.scrollTo({ top: 0 }); };
  const toggleInt = (id: string) => setInterests((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <div className="min-h-screen bg-background">
      <div className="h-1 bg-primary" />
      <div className="flex">
        {/* Sidebar (desktop) */}
        <aside className="hidden w-64 shrink-0 border-r bg-card lg:block">
          <div className="sticky top-0 flex h-screen flex-col">
            <div className="border-b px-5 py-4"><Brand onClick={() => go("vous")} /></div>
            <NavList tab={tab} onGo={go} />
            <div className="border-t px-5 py-3 text-[11px] leading-snug text-muted-foreground/70">
              Maquette de démonstration<br />Données de programme fictives
            </div>
          </div>
        </aside>

        {/* Colonne principale */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b bg-card/90 backdrop-blur">
            <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
              <button onClick={() => setMobileOpen(true)} aria-label="Ouvrir le menu"
                className="grid h-9 w-9 place-items-center rounded-md border border-input text-muted-foreground lg:hidden"><Menu className="h-5 w-5" /></button>
              <div className="lg:hidden"><Brand onClick={() => go("vous")} /></div>
              {/* Fil d'Ariane (desktop) */}
              <nav className="hidden items-center gap-1.5 text-[13px] text-muted-foreground lg:flex" aria-label="Fil d'Ariane">
                <button onClick={() => go("vous")} className="hover:text-foreground hover:underline">Accueil</button>
                {tab !== "vous" && (<><ChevronRight className="h-3.5 w-3.5" /><span className="font-medium text-foreground">{navLabel(tab)}</span></>)}
              </nav>

              <div className="relative ml-auto hidden max-w-xs flex-1 sm:block lg:ml-6">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input aria-label="Rechercher" placeholder="Rechercher une démarche, une décision…"
                  className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-[13px] outline-none placeholder:text-muted-foreground/70 focus:border-primary" />
              </div>

              <div className="ml-auto flex items-center gap-2 sm:ml-3">
                <span className="hidden items-center gap-2 rounded-md border bg-card py-1 pl-1 pr-2.5 text-[12.5px] sm:flex">
                  <span className="grid h-[26px] w-[26px] place-items-center rounded-md text-[11px] font-bold text-primary-foreground bg-primary">CD</span>
                  <span className="leading-tight"><b className="font-semibold">Camille D.</b><br /><span className="font-semibold" style={{ color: "hsl(var(--itsme))" }}>via itsme</span></span>
                </span>
                <button onClick={() => setDark((d) => !d)} aria-label="Basculer le thème"
                  className="grid h-9 w-9 place-items-center rounded-md border border-input text-muted-foreground transition hover:text-foreground">
                  {dark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
                </button>
              </div>
            </div>
            <div className="border-t px-4 py-1.5 text-center text-[11.5px] font-medium text-muted-foreground sm:px-6" style={{ background: "hsl(var(--warn-bg))" }}>
              Aperçu de démonstration — données de programme fictives, données factuelles sur la commune sourcées
            </div>
          </header>

          <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
            {tab === "vous" && <PourVous interests={interests} toutVoir={toutVoir} onToggleInt={toggleInt} onToggleTout={() => setToutVoir((v) => !v)} />}
            {tab === "cap" && <Cap />}
            {tab === "decisions" && <Decisions />}
            {tab === "engagements" && <Engagements />}
            {tab === "budget" && <Budget />}
            {tab === "projets" && <Projets />}
            {tab === "familles" && <Familles />}
            {tab === "jeunes" && <Jeunes />}
            {tab === "agenda" && <AgendaVue />}
            {tab === "entraide" && <Entraide />}
            {tab === "bord" && <Bord />}
            {tab === "sources" && <Sources />}
          </main>

          <footer className="border-t bg-card">
            <div className="mx-auto flex max-w-5xl flex-col gap-1.5 px-4 py-5 text-[12.5px] text-muted-foreground/80 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <span>Commune de {commune.nom} · {commune.habitants.toLocaleString("fr-BE")} habitants (2024) · {commune.province}</span>
              <span>Identité via itsme · MAJ {commune.miseAJour}</span>
            </div>
          </footer>
        </div>
      </div>

      {/* Tiroir mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 flex h-full w-72 flex-col bg-card shadow-xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <Brand onClick={() => go("vous")} />
              <button onClick={() => setMobileOpen(false)} aria-label="Fermer" className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-secondary"><X className="h-5 w-5" /></button>
            </div>
            <NavList tab={tab} onGo={go} />
          </div>
        </div>
      )}
    </div>
  );
}
