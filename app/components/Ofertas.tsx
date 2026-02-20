// app/components/Ofertas.tsx
import { client } from "@/app/lib/sanity";
import { OfertasCarousel } from './OfertasCarousel';

const QUERY = `*[_type == "oferta"] | order(publishedAt desc) {
  _id, title, price, originalPrice, installments,
  storeName, affiliateLink, mainImage, description
}`;

export default async function Ofertas() {
  const ofertas = await client.fetch(QUERY, {}, { next: { revalidate: 3600 } });

  return (
    <section className="py-12 border-y border-(--border) bg-linear-to-b from-transparent via-blue-50/5 to-transparent">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 bg-yellow-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-500">
                Ofertas Selecionadas
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter">
              Melhores <span className="text-[#0070f3]">Ofertas</span>
            </h2>
          </div>

          <div className="flex flex-col md:items-end gap-1 max-w-md">
            <p className="text-sm md:text-right bg-amber-50 bg-clip-border font-medium">
              Hardware e acessórios selecionados com os melhores preços no Mercado Livre.
            </p>
            <p className="text-xs bg-amber-50 text-yellow-600 dark:text-yellow-400 md:text-right font-mono">
              ⚠️ Preços podem variar. Confirme o valor antes de comprar.
            </p>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative p-1 bg-(--border)/30 bg-yellow-400 shadow-inner">
          <div className="bg-(--card-bg) bg-amber-50 p-4 sm:p-8 border border-(--border) shadow-2xl">
            <OfertasCarousel ofertas={ofertas} />
          </div>
        </div>

      </div>
    </section>
  );
}