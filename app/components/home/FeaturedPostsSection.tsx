import Link from "next/link";
import Image from "next/image";
import { FeaturedPost } from "@/app/lib";
import { formatDate } from "@/app/lib/utils";
import styles from '../MilitaryTheme.module.css';

const DEFAULT_IMAGE = "/images/placeholder.png";

type FeaturedPostsSectionProps = {
  featuredPosts: FeaturedPost[];
};

export default function FeaturedPostsSection({ featuredPosts }: FeaturedPostsSectionProps) {
  if (featuredPosts.length === 0) {
    return null;
  }

  return (
    <section className={`${styles.mil_section} mb-8`}>
      {/* Cabeçalho */}
{/* Cabeçalho */}
      <div className={`${styles.mil_header} w-full flex flex-wrap items-end justify-between gap-x-2 gap-y-4`}>
        <div className={`${styles.mil_title_wrap} flex items-end gap-3 flex-1 min-w-[240px]`}>
          <div className={`${styles.mil_title_icon} shrink-0`}>
            <span />
            <span />
            <span />
          </div>
          <div className="hidden sm:block">
            <h2 className={`${styles.mil_section_title} text-2xl sm:text-3xl leading-none`}>
              DESTAQUES <span className="block sm:inline">OPERACIONAIS</span>
            </h2>
          </div>
          <div className={`${styles.mil_classification} shrink-0 mb-1 hidden sm:flex`}>Atualidade</div>
        </div>
        
        <Link
          href="/destaques"
          aria-label="Ver todos os destaques"
          className={`${styles.mil_view_all} whitespace-nowrap shrink-0 text-[10px] sm:text-xs border border-[#c8a84b]/30 px-3 py-1.5 hover:bg-[#c8a84b] hover:text-[#0a0b0d] transition-colors ml-auto flex items-center gap-1`}
        >
          <span className="hidden sm:inline">MISSÕES COMPLETAS</span>
          <span className="hidden sm:inline">MISSÕES</span>
          <span>&#x2192;</span>
        </Link>
      </div>

      <div className={`${styles.mil_divider} mt-4`} />

      {/* Grid de cards */}
      <div className={styles.mil_grid}>
        {featuredPosts.map((post, index) => {
          const isHero = index === 0;
          return (
            <article
              key={post._id}
              className={`${styles.mil_card}${isHero ? ` ${styles.mil_card_hero}` : ""}`}
            >
              {isHero && <div className={styles.mil_top_accent} />}
              <div className={styles.mil_scan_line} />

              <Link href={`/post/${post.slug}`} className={styles.mil_card_link}>
                {/* Imagem de fundo */}
                <div className={styles.mil_card_img}>
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

                <div className={styles.mil_card_overlay} />

                {/* Conteúdo */}
                <div className={styles.mil_card_content}>
                  <span
                    className={`${styles.mil_badge} ${
                      isHero ? styles.mil_badge_manchete : styles.mil_badge_alta
                    }`}
                  >
                    {isHero ? "MANCHETE" : "EM ALTA"}
                  </span>

                  <h3
                    className={`${styles.mil_card_title} ${
                      isHero ? styles.mil_card_title_hero : styles.mil_card_title_sm
                    }`}
                  >
                    {post.title}
                  </h3>

                  {isHero && post.excerpt && (
                    <p className={styles.mil_card_excerpt}>{post.excerpt}</p>
                  )}

                  <div className={styles.mil_card_meta}>
                    <span className={styles.mil_card_meta_author}>
                      {post.author}
                    </span>
                    <span className={styles.mil_card_meta_sep}>◆</span>
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                </div>
              </Link>
            </article>
          );
        })}
      </div>

      {/* Barra de status */}
      <div className={styles.mil_statusbar}>
        <div className={styles.mil_status_left}>
          <div className={styles.mil_status_dot} />
          <span>TRANSMISSÃO SEGURA</span>
          <span>NÍVEL: PÚBLICO</span>
        </div>
        <div className={styles.mil_status_right}>
          <span>BRASIL</span>
          <span>◆</span>
          <span>DEFESA NACIONAL</span>
        </div>
      </div>
    </section>
  );
}
