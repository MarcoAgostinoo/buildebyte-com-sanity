// ---------------------------------------------------------------------------
// THREAT INDEX BAR — ReliefWeb API (ONU/OCHA)
// FIX: Usando GET em vez de POST — POST retorna 403 em alguns ambientes.
//
// Salvar em: app/components/home/ThreatIndexBar.tsx
// Server Component — sem "use client"
// ---------------------------------------------------------------------------

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
  "Armed Conflict":          5,
  "Civil Unrest":            4,
  "Epidemic":                3,
  "Technological Disaster":  3,
  "Tsunami":                 3,
  "Flood":                   2,
  "Flash Flood":             2,
  "Earthquake":              2,
  "Drought":                 2,
  "Tropical Cyclone":        2,
  "Volcano":                 2,
  "Landslide":               1,
  "Fire":                    2,
};

function levelToMeta(level: number) {
  if (level >= 5) return { color: "#ff4444", bgColor: "rgba(255,68,68,0.08)",   pulse: "animate-ping",  status: "CONFLITO ATIVO",   };
  if (level === 4) return { color: "#ff8c00", bgColor: "rgba(255,140,0,0.08)",  pulse: "animate-ping",  status: "ESCALADA CRÍTICA", };
  if (level === 3) return { color: "#ffd700", bgColor: "rgba(255,215,0,0.06)",  pulse: "animate-pulse", status: "TENSÃO ELEVADA",   };
  if (level === 2) return { color: "#4a9eff", bgColor: "rgba(74,158,255,0.06)", pulse: "animate-pulse", status: "MONITORAMENTO",    };
  return              { color: "#3ddc84", bgColor: "rgba(61,220,132,0.06)",     pulse: "animate-pulse", status: "ESTÁVEL",          };
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

// ---------------------------------------------------------------------------
// FETCH — GET request (evita 403)
// ---------------------------------------------------------------------------
async function fetchThreats(): Promise<ThreatZone[]> {
  try {
    // Filtros como query string — GET simples, sem CORS/firewall issues
    const params = new URLSearchParams({
      appname: "vetorestrategico",
      "filter[operator]": "AND",
      "filter[conditions][0][field]": "status",
      "filter[conditions][0][value]": "ongoing",
      "filter[conditions][1][operator]": "OR",
      "filter[conditions][1][conditions][0][field]": "type.name",
      "filter[conditions][1][conditions][0][value]": "Armed Conflict",
      "filter[conditions][1][conditions][1][field]": "type.name",
      "filter[conditions][1][conditions][1][value]": "Civil Unrest",
      "filter[conditions][1][conditions][2][field]": "type.name",
      "filter[conditions][1][conditions][2][value]": "Epidemic",
      "fields[include][]": "name",
      "sort[]": "date.event:desc",
      limit: "10",
      preset: "latest",
    });

    // Adicionamos os campos um por um (URLSearchParams não duplica automaticamente)
    const url = `https://api.reliefweb.int/v1/disasters?appname=vetorestrategico&preset=latest&filter[operator]=AND&filter[conditions][0][field]=status&filter[conditions][0][value]=ongoing&filter[conditions][1][operator]=OR&filter[conditions][1][conditions][0][field]=type.name&filter[conditions][1][conditions][0][value][]=Armed+Conflict&filter[conditions][1][conditions][0][value][]=Civil+Unrest&filter[conditions][1][conditions][0][value][]=Epidemic&fields[include][]=name&fields[include][]=status&fields[include][]=country.name&fields[include][]=country.iso3&fields[include][]=type.name&fields[include][]=date.event&sort[]=date.event:desc&limit=8`;

    const res = await fetch(url, {
      method: "GET",
      headers: { "Accept": "application/json" },
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error(`ReliefWeb GET: ${res.status}`);

    const json = await res.json();
    const disasters: ReliefWebDisaster[] = json?.data ?? [];

    return disasters.slice(0, 6).map((d) => {
      const types  = d.fields.type ?? [];
      const level  = types.reduce((max, t) => {
        const l = TYPE_LEVEL[t.name] ?? 1;
        return l > max ? l : max;
      }, 1);
      const meta    = levelToMeta(level);
      const country = d.fields.country?.[0];
      const typeName = types[0]?.name ?? "";

      return {
        id:      d.id,
        label:   shortName(d.fields.name),
        region:  country ? countryName(country.name) : "GLOBAL",
        type:    TYPE_PT[typeName] ?? typeName.toUpperCase().slice(0, 16),
        level,
        status:  meta.status,
        color:   meta.color,
        bgColor: meta.bgColor,
        pulse:   meta.pulse,
        since:   d.fields.date?.event
          ? new Date(d.fields.date.event).toLocaleDateString("pt-BR", {
              month: "short", year: "numeric",
            })
          : undefined,
      };
    });
  } catch (err) {
    console.error("[ThreatIndexBar]", err);
    return FALLBACK;
  }
}

const FALLBACK: ThreatZone[] = [
  { id:"f1", label:"Conflito Ucrânia–Rússia",     region:"UCRÂNIA",    type:"CONFLITO ARMADO",  level:5, status:"CONFLITO ATIVO",   color:"#ff4444", bgColor:"rgba(255,68,68,0.08)",   pulse:"animate-ping"  },
  { id:"f2", label:"Tensão Israel–Irã",            region:"ISRAEL",     type:"CONFLITO ARMADO",  level:4, status:"ESCALADA CRÍTICA", color:"#ff8c00", bgColor:"rgba(255,140,0,0.08)",   pulse:"animate-ping"  },
  { id:"f3", label:"Guerra Civil Sudão",            region:"SUDÃO",      type:"CONFLITO CIVIL",   level:4, status:"ESCALADA CRÍTICA", color:"#ff8c00", bgColor:"rgba(255,140,0,0.08)",   pulse:"animate-ping"  },
  { id:"f4", label:"Crise Myanmar",                region:"MYANMAR",    type:"CONFLITO CIVIL",   level:3, status:"TENSÃO ELEVADA",   color:"#ffd700", bgColor:"rgba(255,215,0,0.06)",   pulse:"animate-pulse" },
  { id:"f5", label:"Instabilidade Haiti",          region:"HAITI",      type:"CONFLITO CIVIL",   level:3, status:"TENSÃO ELEVADA",   color:"#ffd700", bgColor:"rgba(255,215,0,0.06)",   pulse:"animate-pulse" },
  { id:"f6", label:"Sahel — Mali, Niger, Burkina", region:"SAHEL",      type:"CONFLITO ARMADO",  level:3, status:"MONITORAMENTO",    color:"#ffd700", bgColor:"rgba(255,215,0,0.06)",   pulse:"animate-pulse" },
];

// ---------------------------------------------------------------------------
// BARRAS DE INTENSIDADE
// ---------------------------------------------------------------------------
function ThreatBars({ level, color }: { level: number; color: string }) {
  return (
    <div className="flex items-end gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          style={{
            width: "6px",
            height: `${8 + i * 4}px`,
            backgroundColor: i < level ? color : "#1e2430",
            opacity: i < level ? 1 : 0.5,
            borderRadius: "1px",
          }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// COMPONENTE PRINCIPAL
// ---------------------------------------------------------------------------
export default async function ThreatIndexBar() {
  const zones = await fetchThreats();

  return (
    <div className="relative w-full border border-zinc-800 bg-[#080a0e] overflow-hidden my-8">

      {/* Scanline */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none z-0 opacity-60"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.015) 2px,rgba(255,255,255,0.015) 3px)",
        }}
      />

      {/* HEADER */}
      <div className="relative z-10 flex items-center gap-4 px-5 sm:px-7 py-3.5 border-b border-zinc-800">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
        </span>
        <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-3">
          {/* FIX: style={{ color }} em vez de text-zinc-* para escapar do global.css h2/h3 override */}
          <span
            className="text-[11px] font-black uppercase tracking-[0.3em]"
            style={{ color: "#d4d8e0" }}
          >
            Índice de Crises Global
          </span>
          <span className="hidden sm:block" style={{ color: "#374151" }}>·</span>
          <span className="text-[12px] font-mono uppercase tracking-wider" style={{ color: "#FFFFFF" }}>
            ReliefWeb / OCHA — Nações Unidas
          </span>
        </div>
        <div className="flex-1 h-px bg-zinc-800" />
        <Link
          href="https://reliefweb.int/disasters"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 text-[12px] font-black uppercase tracking-widest transition-colors"
          style={{ color: "#FFFFFF" }}
        >
          Fonte ONU →
        </Link>
      </div>

      {/* ZONES */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-y lg:divide-y-0 divide-zinc-800/70">
        {zones.map((zone) => (
          <div
            key={zone.id}
            className="group flex flex-col gap-3 px-5 sm:px-6 py-5 hover:brightness-110 transition-all duration-300"
            style={{ backgroundColor: zone.bgColor }}
          >
            {/* Região + tipo + dot */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col gap-0.5 min-w-0">
                <span
                  className="text-[10px] font-black uppercase tracking-[0.2em] truncate"
                  style={{ color: "#9ca3af" }}
                >
                  {zone.region}
                </span>
                <span
                  className="text-[9px] font-mono uppercase tracking-wide truncate"
                  style={{ color: "#6b7280" }}
                >
                  {zone.type}
                </span>
              </div>
              <span className="relative flex h-2 w-2 shrink-0 mt-0.5">
                <span
                  className={`${zone.pulse} absolute inline-flex h-full w-full rounded-full opacity-75`}
                  style={{ backgroundColor: zone.color }}
                />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: zone.color }} />
              </span>
            </div>

            {/* Nome */}
            <p
              className="text-sm font-black uppercase leading-snug line-clamp-2"
              style={{ color: "#f3f4f6", letterSpacing: "0.03em" }}
              title={zone.label}
            >
              {zone.label}
            </p>

            {/* Barras */}
            <ThreatBars level={zone.level} color={zone.color} />

            {/* Status + data */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: zone.color }}>
                {zone.status}
              </span>
              {zone.since && (
                <span className="text-[9px] tabular-nums font-mono" style={{ color: "#374151" }}>
                  desde {zone.since}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="relative z-10 flex items-center justify-between gap-4 px-5 sm:px-7 py-2.5 border-t border-zinc-800/70">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono uppercase tracking-wider" style={{ color: "#FFFFFF" }}>
            VETOR INT-01
          </span>
          <span style={{ color: "#1f2937" }}>·</span>
          <span className="text-[11px] font-mono" style={{ color: "#FFFFFF" }}>
            Atualização automática a cada 1h
          </span>
        </div>
        <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: "#FFFFFF" }}>
          {zones.length} crises monitoradas
        </span>
      </div>
    </div>
  );
}