import Link from "next/link";

interface ReliefWebDisaster {
  id: string;
  fields: {
    name: string;
    status: string;
    country?: { name: string; iso3: string }[];
    type?: { name: string }[];
    date?: { event?: string };
  };
}

interface ThreatZone {
  id: string;
  label: string;
  region: string;
  type: string;
  level: number;
  status: string;
  color: string;
  bgColor: string;
  pulse: string;
  since?: string;
}

const TYPE_LEVEL: Record<string, number> = {
  "Armed Conflict": 5,
  "Civil Unrest": 4,
  "Epidemic": 3,
  "Technological Disaster": 3,
  "Tsunami": 3,
  "Flood": 2,
  "Flash Flood": 2,
  "Earthquake": 2,
  "Drought": 2,
  "Tropical Cyclone": 2,
  "Volcano": 2,
  "Landslide": 1,
  "Fire": 2,
};

function levelToMeta(level: number) {
  if (level >= 5) return { color: "#ff4444", bgColor: "rgba(255,68,68,0.08)", pulse: "animate-ping",  status: "CONFLITO ATIVO" };
  if (level === 4) return { color: "#ff8c00", bgColor: "rgba(255,140,0,0.08)", pulse: "animate-ping",  status: "ESCALADA CRÍTICA" };
  if (level === 3) return { color: "#ffd700", bgColor: "rgba(255,215,0,0.06)", pulse: "animate-pulse", status: "TENSÃO ELEVADA" };
  if (level === 2) return { color: "#4a9eff", bgColor: "rgba(74,158,255,0.06)", pulse: "animate-pulse", status: "MONITORAMENTO" };
  return                 { color: "#3ddc84", bgColor: "rgba(61,220,132,0.06)", pulse: "animate-pulse", status: "ESTÁVEL" };
}

const COUNTRY_PT: Record<string, string> = {
  "Ukraine": "UCRÂNIA", "Russian Federation": "RÚSSIA",
  "Israel": "ISRAEL", "Iran (Islamic Republic of)": "IRÃ",
  "Myanmar": "MYANMAR", "Sudan": "SUDÃO", "South Sudan": "SUDÃO SUL",
  "Syrian Arab Republic": "SÍRIA", "Yemen": "IÊMEN",
  "Afghanistan": "AFEGANISTÃO", "Ethiopia": "ETIÓPIA",
  "Somalia": "SOMÁLIA", "Haiti": "HAITI",
  "Democratic Republic of the Congo": "R.D. CONGO",
  "Mali": "MALI", "Niger": "NÍGER", "Nigeria": "NIGÉRIA",
  "Burkina Faso": "BURKINA FASO", "Libya": "LÍBIA",
  "Pakistan": "PAQUISTÃO", "Bangladesh": "BANGLADESH",
  "Central African Republic": "REP. C-AFRICANA",
};

const TYPE_PT: Record<string, string> = {
  "Armed Conflict": "CONFLITO ARMADO", "Civil Unrest": "CONFLITO CIVIL",
  "Epidemic": "EPIDEMIA", "Flood": "INUNDAÇÃO", "Earthquake": "TERREMOTO",
  "Drought": "SECA", "Tropical Cyclone": "CICLONE",
  "Technological Disaster": "DESASTRE TECH.", "Tsunami": "TSUNAMI",
  "Volcano": "VULCÃO",
};

function countryName(name: string): string {
  return COUNTRY_PT[name] ?? name.toUpperCase().slice(0, 12);
}

function shortName(name: string): string {
  const clean = name.replace(/^[^:]+:\s*/u, "").trim();
  return clean.length > 32 ? clean.slice(0, 30) + "…" : clean;
}

const FALLBACK: ThreatZone[] = [
  { id: "f1", label: "Conflito Ucrânia–Rússia",       region: "UCRÂNIA", type: "CONFLITO ARMADO", level: 5, status: "CONFLITO ATIVO",   color: "#ff4444", bgColor: "rgba(255,68,68,0.08)",   pulse: "animate-ping" },
  { id: "f2", label: "Tensão Israel–Irã",              region: "ISRAEL",  type: "CONFLITO ARMADO", level: 4, status: "ESCALADA CRÍTICA", color: "#ff8c00", bgColor: "rgba(255,140,0,0.08)",  pulse: "animate-ping" },
  { id: "f3", label: "Guerra Civil Sudão",             region: "SUDÃO",   type: "CONFLITO CIVIL",  level: 4, status: "ESCALADA CRÍTICA", color: "#ff8c00", bgColor: "rgba(255,140,0,0.08)",  pulse: "animate-ping" },
  { id: "f4", label: "Crise Myanmar",                  region: "MYANMAR", type: "CONFLITO CIVIL",  level: 3, status: "TENSÃO ELEVADA",   color: "#ffd700", bgColor: "rgba(255,215,0,0.06)",  pulse: "animate-pulse" },
  { id: "f5", label: "Instabilidade Haiti",            region: "HAITI",   type: "CONFLITO CIVIL",  level: 3, status: "TENSÃO ELEVADA",   color: "#ffd700", bgColor: "rgba(255,215,0,0.06)",  pulse: "animate-pulse" },
  { id: "f6", label: "Sahel — Mali, Niger, Burkina",  region: "SAHEL",   type: "CONFLITO ARMADO", level: 3, status: "MONITORAMENTO",    color: "#ffd700", bgColor: "rgba(255,215,0,0.06)",  pulse: "animate-pulse" },
];

async function fetchThreats(): Promise<ThreatZone[]> {
  const url = `https://api.reliefweb.int/v1/disasters?appname=vetorestrategico.com&preset=latest&filter[operator]=AND&filter[conditions][0][field]=status&filter[conditions][0][value]=ongoing&filter[conditions][1][operator]=OR&filter[conditions][1][conditions][0][field]=type.name&filter[conditions][1][conditions][0][value][]=Armed+Conflict&filter[conditions][1][conditions][0][value][]=Civil+Unrest&filter[conditions][1][conditions][0][value][]=Epidemic&fields[include][]=name&fields[include][]=status&fields[include][]=country.name&fields[include][]=country.iso3&fields[include][]=type.name&fields[include][]=date.event&sort[]=date.event:desc&limit=8`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "Accept": "application/json" },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error(`[ThreatIndexBar] ReliefWeb respondeu com erro: ${res.status}`);
      return FALLBACK;
    }

    const json = await res.json();
    const disasters: ReliefWebDisaster[] = json?.data ?? [];
    if (disasters.length === 0) return FALLBACK;

    return disasters.slice(0, 6).map((d) => {
      const types = d.fields.type ?? [];
      const level = types.reduce((max, t) => {
        const l = TYPE_LEVEL[t.name] ?? 1;
        return l > max ? l : max;
      }, 1);
      const meta = levelToMeta(level);
      const country = d.fields.country?.[0];
      const typeName = types[0]?.name ?? "";

      return {
        id: d.id,
        label: shortName(d.fields.name),
        region: country ? countryName(country.name) : "GLOBAL",
        type: TYPE_PT[typeName] ?? typeName.toUpperCase().slice(0, 16),
        level,
        status: meta.status,
        color: meta.color,
        bgColor: meta.bgColor,
        pulse: meta.pulse,
        since: d.fields.date?.event
          ? new Date(d.fields.date.event).toLocaleDateString("pt-BR", {
              month: "short", year: "numeric",
            })
          : undefined,
      };
    });
  } catch (err) {
    console.error("[ThreatIndexBar] Falha crítica na conexão:", err);
    return FALLBACK;
  }
}

function ThreatBars({ level, color }: { level: number; color: string }) {
  return (
    <div className="flex items-end gap-[3px]">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          style={{
            width: "5px",
            height: `${6 + i * 3}px`,
            backgroundColor: i < level ? color : "#1e2430",
            opacity: i < level ? 1 : 0.45,
            borderRadius: "1px",
          }}
        />
      ))}
    </div>
  );
}

export default async function ThreatIndexBar() {
  const zones = await fetchThreats();

  return (
    <div className="relative w-full border border-zinc-800 bg-[#080a0e] overflow-hidden my-8 shadow-2xl">

      {/* Scanline decoração */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none z-0 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.01) 2px,rgba(255,255,255,0.01) 3px)",
        }}
      />

      {/* HEADER — compacto */}
      <div className="relative z-10 flex items-center gap-3 px-3 sm:px-6 py-2 border-b border-zinc-800 bg-[#0a0c10]">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
        </span>

        <div className="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-3 min-w-0">
          {/* Mobile: título maior e mais legível */}
          <span className="text-[13px] sm:text-[12px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-zinc-100 font-mono leading-none">
            Radar de Crises Global
          </span>
          <span className="hidden sm:block text-zinc-800">|</span>
          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-zinc-500">
            ReliefWeb &bull; UN/OCHA
          </span>
        </div>

        <div className="flex-1 h-px bg-linear-to-r from-zinc-800 via-zinc-800 to-transparent" />

        <Link
          href="https://reliefweb.int/disasters"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors shrink-0"
        >
          Análise Completa <span aria-hidden="true">→</span>
        </Link>
      </div>

      {/* GRID DE ZONAS — padding reduzido, texto mobile maior */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 divide-y sm:divide-x lg:divide-y-0 divide-zinc-800/50 font-mono">
        {zones.map((zone) => (
          <div
            key={zone.id}
            className="group flex flex-col gap-2.5 px-3 sm:px-4 py-3 sm:py-4 hover:bg-white/[0.02] transition-all duration-300"
            style={{ backgroundColor: zone.bgColor }}
          >
            {/* Topo: região + tipo + pulse */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col gap-0 min-w-0">
                {/* Mobile: 13px (era 10px) — mais legível */}
                <span className="text-[13px] sm:text-[10px] font-black uppercase tracking-[0.12em] sm:tracking-[0.15em] text-zinc-300 sm:text-zinc-500 truncate">
                  {zone.region}
                </span>
                {/* Mobile: 11px (era 9px) — mais legível */}
                <span className="text-[11px] sm:text-[9px] font-bold uppercase tracking-wider text-zinc-500 sm:text-zinc-600 truncate">
                  {zone.type}
                </span>
              </div>
              <span className="relative flex h-2 w-2 shrink-0 mt-0.5">
                <span
                  className={`${zone.pulse} absolute inline-flex h-full w-full rounded-full opacity-75`}
                  style={{ backgroundColor: zone.color }}
                />
                <span
                  className="relative inline-flex rounded-full h-2 w-2"
                  style={{ backgroundColor: zone.color }}
                />
              </span>
            </div>

            {/* Label principal — Mobile: 13px (era 11px), zinc-100 (era zinc-200) */}
            <p className="text-[13px] sm:text-[11px] font-black uppercase leading-snug text-zinc-100 sm:text-zinc-200 line-clamp-2 min-h-[2.4em]">
              {zone.label}
            </p>

            {/* Rodapé: barras + status */}
            <div className="mt-auto space-y-1.5">
              <ThreatBars level={zone.level} color={zone.color} />
              <div className="flex flex-col gap-0">
                {/* Mobile: 12px (era 10px), mais brilhante */}
                <span
                  className="text-[12px] sm:text-[10px] font-black uppercase tracking-widest"
                  style={{ color: zone.color }}
                >
                  {zone.status}
                </span>
                {zone.since && (
                  <span className="text-[10px] sm:text-[9px] font-bold text-zinc-500 sm:text-zinc-700">
                    DESDE {zone.since}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER — ultra-compacto */}
      <div className="relative z-10 flex items-center justify-between gap-4 px-3 sm:px-6 py-1.5 border-t border-zinc-800/60 bg-[#050608]">
        <div className="flex items-center gap-2.5">
          <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-zinc-600">
            VETOR-INTEL-01
          </span>
          <span className="text-zinc-800">|</span>
          <span className="text-[9px] font-mono text-zinc-600 uppercase">
            Sync: 60m
          </span>
        </div>
        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
          {zones.length} alvos ativos
        </span>
      </div>
    </div>
  );
}