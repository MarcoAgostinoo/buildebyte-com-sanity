import { client } from "@/app/lib/sanity";
import Image from "next/image";
import Link from "next/link";

interface Offer {
  title: string;
  imagem: string;
  affiliateLink: string;
}

async function getData(): Promise<Offer | null> {
  const query = `
    *[_type == "oferta" && !(_id in path('drafts.**'))] | order(_createdAt desc)[0...49] {
      title,
      "imagem": mainImage.asset->url,
      affiliateLink
    }
  `;
  const data = await client.fetch(query, {}, { next: { revalidate: 0 } });
  if (data?.length > 0) {
    return data[Math.floor(Math.random() * data.length)] as Offer;
  }
  return null;
}

export default async function SecondAdComponent({ className = "" }: { className?: string }) {
  const offer = await getData();

  if (!offer?.affiliateLink) {
    return (
      <div className={`p-4 text-center border border-(--border) bg-(--card-bg) ${className}`}>
        <p className="text-[12px] font-black uppercase tracking-widest text-primary">
          Espaço Publicitário
        </p>
      </div>
    );
  }

  return (
    <Link
      href={offer.affiliateLink}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className={`
        group flex flex-row items-stretch
        border border-(--border) bg-(--card-bg)
        hover:border-primary/40 transition-all duration-200 overflow-hidden
        ${className}
      `}
    >
      {/* Image — 40% of sidebar width, square crop */}
      <div className="relative w-2/5 shrink-0 min-h-36">
        {offer.imagem && (
          <Image
            src={offer.imagem}
            alt={offer.title}
            fill
            loading="lazy"
            sizes="(max-width: 1024px) 40vw, 160px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
      </div>

      {/* Text — remaining 60% */}
      <div className="flex flex-col justify-between gap-2 px-4 py-4 min-w-0 flex-1">
        <div className="flex flex-col gap-1.5">
          <p className="text-[12px] font-black uppercase tracking-[0.2em] text-primary/60">
            Oferta Verificada
          </p>
          <h3 className="font-black text-sm leading-snug text-(--foreground) line-clamp-3 group-hover:text-primary transition-colors">
            {offer.title}
          </h3>
        </div>

        <span className="inline-flex items-center gap-1.5 text-[12px] font-black uppercase tracking-wider text-primary/70 group-hover:text-primary transition-colors">
          Ver oferta
          <svg
            className="w-3 h-3 group-hover:translate-x-0.5 transition-transform"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </span>
      </div>
    </Link>
  );
}