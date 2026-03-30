import { OfertasCarousel } from "@/app/components/OfertasCarousel";
import { getOffers } from "@/app/lib/sanity";

export default async function AchadosPage() {
  const ofertas = await getOffers();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Achados</h1>
      <OfertasCarousel ofertas={ofertas} />
    </div>
  );
}
