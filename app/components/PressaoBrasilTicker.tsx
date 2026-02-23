"use client";

import { useEffect, useState } from "react";

interface IndicadoresGeopoliticos {
  dolar: string;
  ouro: string;
  riscoSoberano: string;
  reservas: string;
  fluxoTech: string;
}

export default function PowerGridTicker() {
  const [dados, setDados] = useState<IndicadoresGeopoliticos | null>(null);

  const fetchLatestBCB = async (codigo: number) => {
    try {
      const res = await fetch(
        `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${codigo}/dados/ultimos/5?formato=json`
      );
      if (!res.ok) return 0;
      const json = await res.json();
      return Array.isArray(json) ? parseFloat(json.at(-1)?.valor || "0") : 0;
    } catch (error) {
      return 0;
    }
  };

  useEffect(() => {
    const carregar = async () => {
      const [dolarVal, ouroVal, riscoVal, reservasVal, techVal] = await Promise.all([
        fetchLatestBCB(1),      // Dólar Comercial
        fetchLatestBCB(4331),   // Ouro BM&F (Série 4331)
        fetchLatestBCB(11777), // Risco Brasil EMBI+
        fetchLatestBCB(13621), // Reservas Internacionais
        fetchLatestBCB(3600),   // Importação Bens de Capital
      ]);

      const cotacaoDolar = dolarVal || 5.23; 
      
      // Trava de Segurança para o Ouro
      const ouroBRL = (ouroVal > 100 && ouroVal < 1000) 
        ? ouroVal 
        : (2650 * cotacaoDolar) / 31.1035;

      setDados({
        dolar: cotacaoDolar.toFixed(2),
        ouro: ouroBRL.toFixed(2),
        riscoSoberano: riscoVal > 0 ? riscoVal.toFixed(0) : "--",
        reservas: reservasVal > 0 ? Math.floor(reservasVal / 1000).toLocaleString('pt-BR') : "--",
        fluxoTech: techVal > 0 ? Math.floor(techVal).toLocaleString('pt-BR') : "--",
      });
    };
    
    carregar();
  }, []);

  if (!dados) return null;

  const texto = `HEGEMONIA USD: R$ ${dados.dolar} • LASTRO ESTRATÉGICO (OURO): R$ ${dados.ouro}/g • RISCO GEOPOLÍTICO (EMBI+): ${dados.riscoSoberano} pts • ESCUDO EXTERNO: $${dados.reservas} BI • ABSORÇÃO TECH MIL/IND: $${dados.fluxoTech} MI • `;

  return (
    <div className="w-full bg-black border-y border-zinc-800 overflow-hidden font-mono">
      <div className="flex items-center h-8 sm:h-10 relative">
        
        {/* Container mais estreito: px-1.5 sm:px-2.5 e tracking-wide */}
        <div className="bg-amber-600 text-black text-[10px] sm:text-xs font-bold px-1.5 sm:px-2.5 h-full flex items-center tracking-wide uppercase border-r-2 border-amber-400 z-10 flex-shrink-0 whitespace-nowrap">
          Monitor Brasil<span className="hidden sm:inline">&nbsp;BRASIL</span>
        </div>
        
        <div className="flex-1 overflow-hidden relative shadow-[inset_0_0_10px_rgba(0,0,0,0.8)] h-full flex items-center">
          <div className="whitespace-nowrap animate-ticker text-amber-500/90 text-xs sm:text-sm font-semibold pl-4 sm:pl-6 tracking-wide">
            {texto.repeat(4)}
          </div>
        </div>
        
      </div>
    </div>
  );
}