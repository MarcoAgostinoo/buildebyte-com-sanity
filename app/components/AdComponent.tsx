import { client } from "@/app/lib/sanity";
import Image from "next/image";
import Link from "next/link";

async function getData() {
  // Busca uma lista de ofertas (ex: as 50 últimas)
  const query = `
    *[_type == "oferta" && !(_id in path('drafts.**'))] | order(_createdAt desc)[0...49] {
      title,
      "imagem": mainImage.asset->url,
      affiliateLink
    }
  `;
  
  // "revalidate: 0" garante que a busca ocorra a cada request
  const data = await client.fetch(query, {}, { next: { revalidate: 0 } });

  // CORREÇÃO: Movemos a lógica de seleção aleatória para aqui.
  // Isso evita chamar Math.random() durante a renderização do componente.
  if (data && data.length > 0) {
    return data[Math.floor(Math.random() * data.length)];
  }

  return null;
}

export default async function AdComponent({ className = '' }: { className?: string }) {
  // O componente agora recebe apenas a oferta já selecionada (ou null)
  const randomOffer = await getData();

  if (!randomOffer || !randomOffer.affiliateLink) {
    return (
      <div className={`bg-primary/10 p-4  text-center text-primary dark:text-primary-300 ${className}`}>
        <p>Espaço Publicitário</p>
      </div>
    );
  }

  return (
    <div className={`bg-primary/10  text-primary dark:text-primary-300 ${className}`}>
      <Link href={randomOffer.affiliateLink} target="_blank" rel="noopener noreferrer">
        <div className="relative w-full h-42 mb-4">
          {randomOffer.imagem && (
            <Image
              src={randomOffer.imagem}
              alt={randomOffer.title}
              fill
              className="object-cover "
            />
          )}
        </div>
        <h3 className="font-bold p-4 text-lg text-center hover:underline">{randomOffer.title}</h3>
        <p className="text-sm mb-2 text-center">Confira esta oferta!</p>
      </Link>
    </div>
  );
}
