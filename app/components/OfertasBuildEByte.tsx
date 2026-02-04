import { client } from '@/app/lib/sanity';
import { OfertasCarousel } from './OfertasCarousel'; // Ajuste o caminho conforme necessário

// Nova Interface baseada no schema 'oferta'
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

// Nova Query simplificada (sem IDs malucos!)
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
  
  const ofertas = await client.fetch(query);
  return ofertas.filter(Boolean);
}

export default async function OfertasBuildEByte() {
  const ofertas = await getLatestOfertas();

  if (!ofertas || ofertas.length === 0) return null;

  return (
    <section className="py-4 sm:py-0 bg-gray-50/50 dark:bg-neutral-950/50">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-primary sm:text-4xl">
            Melhores Ofertas
          </h2>
          <p className="mt-4 text-lg text-foreground/80">
            Hardware com desconto selecionado manualmente.
          </p>
        </div>
        
        {/* Passamos as ofertas para o componente Client */}
        <OfertasCarousel ofertas={ofertas} />
      </div>
    </section>
  );
}