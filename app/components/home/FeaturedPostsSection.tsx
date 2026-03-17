import Link from "next/link";
import Image from "next/image";
import { FeaturedPost } from "@/app/lib";
import { formatDate } from "@/app/lib/utils";

const DEFAULT_IMAGE = "/images/placeholder.png";

type FeaturedPostsSectionProps = {
  featuredPosts: FeaturedPost[];
};

export default function FeaturedPostsSection({ featuredPosts }: FeaturedPostsSectionProps) {
  if (featuredPosts.length === 0) {
    return null;
  }

  return (
    <section className="mil-section mb-8">
      {/* Cabeçalho */}
{/* Cabeçalho */}
      <div className="mil-header w-full flex flex-wrap items-end justify-between gap-x-2 gap-y-4">
        <div className="mil-title-wrap flex items-end gap-3 flex-1 min-w-[240px]">
          <div className="mil-title-icon shrink-0">
            <span />
            <span />
            <span />
          </div>
          <div>
            <h2 className="mil-section-title text-2xl sm:text-3xl leading-none">
              DESTAQUES <span className="block sm:inline">OPERACIONAIS</span>
            </h2>
          </div>
          <div className="mil-classification shrink-0 mb-1 hidden sm:flex">AO VIVO</div>
        </div>
        
        <Link
          href="/destaques"
          aria-label="Ver todos os destaques"
          className="mil-view-all whitespace-nowrap shrink-0 text-[10px] sm:text-xs border border-[#c8a84b]/30 px-3 py-1.5 hover:bg-[#c8a84b] hover:text-[#0a0b0d] transition-colors ml-auto flex items-center gap-1"
        >
          <span className="hidden sm:inline">MISSÕES COMPLETAS</span>
          <span className="inline sm:hidden">MISSÕES</span>
          <span>&#x2192;</span>
        </Link>
      </div>

      <div className="mil-divider mt-4" />

      {/* Grid de cards */}
      <div className="mil-grid">
        {featuredPosts.map((post, index) => {
          const isHero = index === 0;
          return (
            <article
              key={post._id}
              className={`mil-card${isHero ? " mil-card-hero" : ""}`}
            >
              {isHero && <div className="mil-top-accent" />}
              <div className="mil-scan-line" />

              <Link href={`/post/${post.slug}`} className="mil-card-link">
                {/* Imagem de fundo */}
                <div className="mil-card-img">
                  <Image
                    src={post.imagem || DEFAULT_IMAGE}
                    alt={post.imagemAlt || post.title || "Imagem do artigo"}
                    fill
                    placeholder={post.imagemLqip ? "blur" : "empty"}
                    blurDataURL={post.imagemLqip}
                    className="object-cover"
                    sizes={
                      isHero
                        ? "(max-width: 768px) 100vw, 50vw"
                        : "(max-width: 768px) 100vw, 50vw"
                    }
                    priority={isHero}
                    loading={isHero ? "eager" : "lazy"}
                    fetchPriority={isHero ? "high" : "auto"}
                  />
                </div>

                <div className="mil-card-overlay" />

                {/* Conteúdo */}
                <div className="mil-card-content">
                  <span
                    className={`mil-badge ${
                      isHero ? "mil-badge-manchete" : "mil-badge-alta"
                    }`}
                  >
                    {isHero ? "MANCHETE" : "EM ALTA"}
                  </span>

                  <h3
                    className={`mil-card-title ${
                      isHero ? "mil-card-title-hero" : "mil-card-title-sm"
                    }`}
                  >
                    {post.title}
                  </h3>

                  {isHero && post.excerpt && (
                    <p className="mil-card-excerpt">{post.excerpt}</p>
                  )}

                  <div className="mil-card-meta">
                    <span className="mil-card-meta-author">
                      {post.author}
                    </span>
                    <span className="mil-card-meta-sep">◆</span>
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                </div>
              </Link>
            </article>
          );
        })}
      </div>

      {/* Barra de status */}
      <div className="mil-statusbar">
        <div className="mil-status-left">
          <div className="mil-status-dot" />
          <span>TRANSMISSÃO SEGURA</span>
          <span>NÍVEL: PÚBLICO</span>
        </div>
        <div className="mil-status-right">
          <span>BRASIL</span>
          <span>◆</span>
          <span>DEFESA NACIONAL</span>
        </div>
      </div>
    </section>
  );
}
