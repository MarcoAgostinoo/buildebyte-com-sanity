export default function AffiliateDisclaimer() {
  return (
    <div className="mt-16 border-t border-zinc-800 bg-zinc-950 py-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 max-w-4xl mx-auto px-1">
        {/* Label tático */}
        <span className="shrink-0 text-[9px] font-black uppercase tracking-[0.25em] text-amber-500/80 border border-amber-500/20 px-2 py-0.5 bg-amber-500/5">
          Transparência
        </span>
        <p className="text-[11px] text-zinc-500 leading-relaxed font-mono">
          O Vetor Estratégico participa de programas de afiliados. Ao adquirir
          via links de ofertas, podemos receber comissão — sem custo adicional
          para você. Isso financia nossa infraestrutura de análise e servidores.
        </p>
      </div>
    </div>
  );
}