"use client";

import { useEffect, useState } from "react";

interface Pais {
  code: string;
  nome: string;
}

interface Resultado {
  nome: string;
  valor: number | null;
}

const paises: Pais[] = [
  { code: "BR", nome: "BRASIL" },
  { code: "US", nome: "EUA" },
  { code: "CN", nome: "CHINA" },
  { code: "RU", nome: "RÚSSIA" },
  { code: "IN", nome: "ÍNDIA" },
  { code: "GB", nome: "REINO UNIDO" },
  { code: "FR", nome: "FRANÇA" },
  { code: "JP", nome: "JAPÃO" },
];

export default function MilitaryPowerTicker() {
  const [dados, setDados] = useState<Resultado[]>([]);

  async function fetchPais(code: string, nome: string) {
    try {
      const res = await fetch(
        `https://api.worldbank.org/v2/country/${code}/indicator/MS.MIL.XPND.GD.ZS?format=json`
      );
      const json = await res.json();

      if (!json[1]) return { nome, valor: null };

      const latest = json[1].find((item: any) => item.value !== null);

      return {
        nome,
        valor: latest?.value ?? null,
      };
    } catch {
      return { nome, valor: null };
    }
  }

  useEffect(() => {
    async function carregar() {
      const resultados = await Promise.all(
        paises.map((p) => fetchPais(p.code, p.nome))
      );
      setDados(resultados);
    }

    carregar();
  }, []);

  if (!dados.length) return null;

  const texto = dados
    .map(
      (p) =>
        `PROJEÇÃO DEFESA ${p.nome}: ${
          p.valor ? p.valor.toFixed(2) + "% PIB" : "--"
        }`
    )
    .join(" • ");

  return (
    <div className="w-full bg-black border-y border-zinc-800 overflow-hidden font-mono">
      <div className="flex items-center h-10 relative">
        
        {/* Etiqueta estratégica */}
        <div className="bg-red-700 text-white text-xs font-bold px-4 h-full flex items-center tracking-widest uppercase border-r border-red-500 z-10">
         BALANÇO DE PODER GLOBAL
        </div>

        <div className="flex-1 overflow-hidden relative shadow-[inset_0_0_12px_rgba(0,0,0,0.9)]">
          <div className="whitespace-nowrap animate-ticker text-red-500/90 text-sm font-semibold pl-6 tracking-wide">
            {texto.repeat(4)}
          </div>
        </div>

      </div>
    </div>
  );
}