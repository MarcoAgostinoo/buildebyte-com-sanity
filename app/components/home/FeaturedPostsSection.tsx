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
      <div className="mil-header">
        <div className="mil-title-wrap">
          <div className="mil-title-icon">
            <span />
            <span />
            <span />
          </div>
          <h2 className="mil-section-title">
            DESTAQUES <span>OPERACIONAIS</span>
          </h2>
          <div className="mil-classification">AO VIVO</div>
        </div>
        <Link
          href="/destaques"
          aria-label="Ver todos os destaques"
          className="mil-view-all"
        >
          MISSÕES COMPLETAS &#x2192;
        </Link>
      </div>

      <div className="mil-divider" />

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
