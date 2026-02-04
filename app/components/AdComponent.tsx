import { client } from "@/app/lib/sanity";
import Image from "next/image";
import Link from "next/link";

async function getData() {
  const query = `
    *[_type == "oferta" && !(_id in path('drafts.**'))] | order(_createdAt desc)[0] {
      title,
      "imagem": mainImage.asset->url,
      affiliateLink
    }
  `;
  const data = await client.fetch(query);
  return data;
}

export default async function AdComponent({ className = '' }: { className?: string }) {
  const latestOffer = await getData();

  if (!latestOffer || !latestOffer.affiliateLink) {
    return (
      <div className={`bg-primary/10 p-4 rounded-lg text-center text-primary dark:text-primary-300 ${className}`}>
        <p>Espaço Publicitário</p>
      </div>
    );
  }

  return (
    <div className={`bg-primary/10 p-4 rounded-lg text-primary dark:text-primary-300 ${className}`}>
      <Link href={latestOffer.affiliateLink} target="_blank" rel="noopener noreferrer">
        <div className="relative w-full h-48 mb-4">
          {latestOffer.imagem && (
            <Image
              src={latestOffer.imagem}
              alt={latestOffer.title}
              fill
              className="object-cover rounded-lg"
            />
          )}
        </div>
        <h3 className="font-bold text-lg text-center hover:underline">{latestOffer.title}</h3>
        <p className="text-sm text-center">Confira a última oferta!</p>
      </Link>
    </div>
  );
}
