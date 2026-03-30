import Link from "next/link";
import Image from "next/image";
import { FeaturedPost } from "@/app/lib";
import { formatDate } from "@/app/lib/utils";
import styles from '../MilitaryTheme.module.css';

const DEFAULT_IMAGE = "/images/placeholder.png";

// ---------------------------------------------------------------------------
// MAPEAMENTO DOS EIXOS (Corrigido para usar hifens '-' como nos slugs do Sanity)
// ---------------------------------------------------------------------------
const EIXO_LABELS: Record<string, string> = {
  "geopolitica-e-defesa": "Geopolítica & Defesa",
  "arsenal-e-tecnologia": "Arsenal & Tecnologia",
  "teatro-de-operacoes": "Teatro de Operações",
  "manual-de-sobrevivencia": "Manual de Sobrevivência",
  "carreiras-estrategicas": "Carreiras Estratégicas",
};

type FeaturedPostsSectionProps = {
  featuredPosts: FeaturedPost[];
};

export default function FeaturedPostsSection({ featuredPosts }: FeaturedPostsSectionProps) {
  if (!featuredPosts || featuredPosts.length === 0) {
    return null;
  }

  return (
    <section className={`${styles.mil_section} mb-8`}>
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
          className={`${styles.mil_view_all} whitespace-nowrap shrink-0 text-[12px] sm:text-xs border border-[#c8a84b]/30 px-3 py-1.5 hover:bg-[#c8a84b] hover:text-[#0a0b0d] transition-colors ml-auto flex items-center gap-1`}
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
          
          // 'as any' previne o erro de 'never' caso a interface exija uma string plana, permitindo as verificações robustas.
          const postAny = post as any;
          const pillarSlug = (typeof postAny.pillar === 'object' ? postAny.pillar.slug : postAny.pillar)?.toLowerCase() || postAny.pillarBasePath || postAny.pillarSlug || "";
          const badgeText = pillarSlug && EIXO_LABELS[pillarSlug] 
            ? EIXO_LABELS[pillarSlug].toUpperCase() 
            : (isHero ? "MANCHETE" : "EM ALTA");

          const MILITAR_CATEGORY_MAP: Record<string, string> = {
            "geopolitica-e-defesa": "geopolitica",
            "arsenal-e-tecnologia": "arsenal",
            "teatro-de-operacoes": "historia",
            "manual-de-sobrevivencia": "sobrevivencia",
          };

          let postUrl = '';
          const militarCategory = MILITAR_CATEGORY_MAP[pillarSlug];
          const categorySlug = typeof postAny.category === 'object' ? postAny.category.slug : postAny.categorySlug || "geral";

          if (militarCategory) {
            // Constrói a URL para pilares dentro de /militar
            postUrl = `/militar/${militarCategory}/${post.slug}`;
          } else if (pillarSlug === 'carreiras-estrategicas') {
            // Constrói a URL para o pilar de /concursos, usando a categoria do post
            postUrl = `/concursos/${categorySlug}/${post.slug}`;
          } else {
            // Fallback para um link que provavelmente resultará em 404, para sinalizar dados de pilar ausentes ou incorretos no CMS.
            postUrl = `/${pillarSlug}/${categorySlug}/${post.slug}`;
          }

          return (
            <article
              key={post._id}
              className={`${styles.mil_card}${isHero ? ` ${styles.mil_card_hero}` : ""}`}
            >
              {isHero && <div className={styles.mil_top_accent} />}
              <div className={styles.mil_scan_line} />

              <Link href={postUrl} className={styles.mil_card_link}>
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
                    quality={isHero ? 70 : 65}
                  />
                </div>

                <div className={styles.mil_card_overlay} />

                {/* Conteúdo */}
                <div className={styles.mil_card_content}>
                  
                  {/* BADGE COM O NOME EXATO DO EIXO */}
                  <span
                    className={`${styles.mil_badge} ${
                      isHero ? styles.mil_badge_manchete : styles.mil_badge_alta
                    }`}
                  >
                    {badgeText}
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