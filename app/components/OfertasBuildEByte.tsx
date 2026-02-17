// Server Component simplificado — sem fetch server-side
import { OfertasCarousel } from './OfertasCarousel';

export default function OfertasBuildEByte() {
  return (
    <section className="py-12 border-y border-(--border) bg-linear-to-b from-transparent via-blue-50/5 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0070f3]">
                Preços ao vivo via API
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter">
              Melhores <span className="text-[#0070f3]">Ofertas</span>
            </h2>
          </div>
          <p className="text-sm text-foreground/60 max-w-md md:text-right font-medium">
            Hardware selecionado e preços validados em tempo real com o Mercado Livre.
          </p>
        </div>

        {/* Carousel — todo o fetch acontece no browser do usuário */}
        <div className="relative p-1 rounded-[2.5rem] bg-(--border)/30 shadow-inner">
          <div className="bg-(--card-bg) rounded-[2.2rem] p-4 sm:p-8 border border-(--border) shadow-2xl">
            <OfertasCarousel />
          </div>
        </div>

      </div>
    </section>
  );
}