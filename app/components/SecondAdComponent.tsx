import { client } from "@/app/lib/sanity";
import Image from "next/image";
import Link from "next/link";

async function getData() {
  const query = `
    *[_type == "oferta" && !(_id in path('drafts.**'))] | order(_createdAt desc)[1] {
      title,
      "imagem": mainImage.asset->url,
      affiliateLink
    }
  `;
  const data = await client.fetch(query);
  return data;
}

export default async function SecondAdComponent({ className = '' }: { className?: string }) {
  const secondLatestOffer = await getData();

  if (!secondLatestOffer || !secondLatestOffer.affiliateLink) {
    return (
      <div className={`bg-primary/10 p-4 rounded-lg text-center text-primary dark:text-primary-300 ${className}`}>
        <p>Espaço Publicitário</p>
      </div>
    );
  }

  return (
    <div className={`bg-primary/10 p-4 rounded-lg text-primary dark:text-primary-300 ${className}`}>
      <Link href={secondLatestOffer.affiliateLink} target="_blank" rel="noopener noreferrer">
        <div className="relative w-full h-48 mb-4">
          {secondLatestOffer.imagem && (
            <Image
              src={secondLatestOffer.imagem}
              alt={secondLatestOffer.title}
              fill
              className="object-cover rounded-lg"
            />
          )}
        </div>
        <h3 className="font-bold text-lg text-center hover:underline">{secondLatestOffer.title}</h3>
        <p className="text-sm text-center">Confira a última oferta!</p>
      </Link>
    </div>
  );
}
