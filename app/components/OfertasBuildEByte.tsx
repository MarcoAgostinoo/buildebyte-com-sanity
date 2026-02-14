import { client } from '@/app/lib/sanity';
import { OfertasCarousel } from './OfertasCarousel'; 

interface OfertaItem {
  _id: string;
  title: string;
  slug: string;
  imagem: string;
  price: number;
  originalPrice?: number;
  installments?: string;
  storeName?: string;
  affiliateLink: string;
  description: string;
}

async function getLatestOfertas(): Promise<OfertaItem[]> {
  const query = `
    *[_type == "oferta" && !(_id in path('drafts.**'))] | order(publishedAt desc) [0...11] {
        _id,
        title,
        "slug": slug.current,
        "imagem": mainImage.asset->url,
        price,
        originalPrice,
        installments,
        storeName,
        affiliateLink,
        description
      }
  `;
  
  const ofertas = await client.fetch(query, {}, { next: { revalidate: 300 } });
  return ofertas.filter(Boolean);
}

export default async function OfertasBuildEByte() {
  const ofertas = await getLatestOfertas();

  if (!ofertas || ofertas.length === 0) return null;

  return (
    <section className="py-12 border-y border-(--border) bg-gradient-to-b from-transparent via-primary/5 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER ESTILIZADO (Match com as categorias da Home) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                Curadoria Real-Time
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground uppercase tracking-tighter">
              Melhores <span className="text-primary">Ofertas</span>
            </h2>
          </div>
          
          <p className="text-sm text-foreground/60 max-w-md md:text-right font-medium leading-relaxed">
            Hardware e periféricos selecionados a dedo pela nossa equipe técnica. 
            <span className="block text-primary font-bold">Preços verificados hoje.</span>
          </p>
        </div>
        
        {/* CONTAINER DO CAROUSEL COM GLASSMORPHISM LEVE */}
        <div className="relative p-1 rounded-[2.5rem] bg-(--border)/30 backdrop-blur-sm shadow-inner">
          <div className="bg-(--card-bg) rounded-[2.2rem] p-4 sm:p-8 border border-(--border) shadow-2xl">
            <OfertasCarousel ofertas={ofertas} />
          </div>
        </div>

        {/* FOOTER DA SEÇÃO */}
        <div className="mt-8 flex justify-center">
            <div className="inline-flex items-center gap-6 px-6 py-2 rounded-full border border-(--border) bg-(--card-bg) text-[10px] font-bold uppercase tracking-widest text-foreground/40">
                <span>⚡ Atualizado em tempo real</span>
                <span className="w-1 h-1 bg-(--border) rounded-full"></span>
                <span>📦 Links Verificados</span>
                <span className="w-1 h-1 bg-(--border) rounded-full"></span>
                <span>🏷️ Cupons Ativos</span>
            </div>
        </div>
      </div>
    </section>
  );
}