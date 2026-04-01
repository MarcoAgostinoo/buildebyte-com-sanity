/**
 * ============================================================================
 * QUERIES GROQ - POST/ARTIGO
 * ============================================================================
 * Queries para recuperar posts/artigos com diferentes níveis de detalhamento.
 */

/**
 * QUERY 1: Lista de Posts de uma Categoria (cartões - campos reduzidos)
 * Usado em grids paginados e listas de categorias.
 */
export const QUERY_POSTS_BY_CATEGORY = `
  *[_type == "post" && category._ref == $categoryId && publishedAt <= now()] 
  | order(publishedAt desc)
  [$offset...$offset + $limit] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    "mainImage": mainImage{
      asset->{ url, metadata },
      alt
    },
    "author": author->{ _id, name, "slug": slug.current, image{ asset->{ url, metadata }, alt }, bio },
    "pillar": pillar->{ basePath },
    "category": category->{ "slug": slug.current }
  }
`;

/**
 * QUERY 2: Buscar Post COMPLETO por slug
 * Retorna todos os campos necessários para exibição em página individual.
 */
export const QUERY_POST_COMPLETE = `
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    seoTitle,
    seoDescription,
    keywords,
    publishedAt,
    featured,
    editorialType,
    body[]{
      ...,
      asset->{
        ...,
        metadata
      },
      _type == "productReference" => @->{
        title,
        "imagem": mainImage.asset->url,
        price,
        originalPrice,
        installments,
        description,
        affiliateLink,
        storeName
      }
    },
    analystView,
    "mainImage": mainImage{
      asset->{ url, metadata },
      alt,
      hotspot
    },
    spotifyEmbed,
    "author": author->{
      _id,
      name,
      "slug": slug.current,
      image{
        asset->{ url, metadata },
        alt
      },
      bio
    },
    "pillar": pillar->{
      _id,
      title,
      "slug": slug.current,
      basePath
    },
    "category": category->{
      _id,
      title,
      "slug": slug.current,
      description,
      "pillar": pillar->{ _id, title, "slug": slug.current, basePath }
    },
    affiliateLink,
    affiliateLabel,
    rating,
    faq
  }
`;

/**
 * QUERY 3: Posts Relacionados (da mesma categoria)
 * Retorna 4 posts similares, excluindo o post atual.
 */
export const QUERY_RELATED_POSTS = `
  *[_type == "post" && category._ref == $categoryId && slug.current != $postSlug && publishedAt <= now()]
  | order(publishedAt desc)
  [0...4] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    "mainImage": mainImage{
      asset->{ url, metadata },
      alt
    },
    "author": author->{ _id, name, "slug": slug.current, image{ asset->{ url, metadata }, alt }, bio },
    "pillar": pillar->{ basePath },
    "category": category->{ "slug": slug.current }
  }
`;

/**
 * QUERY 4: Posts em Destaque (para homepage ou seção especial)
 */
export const QUERY_FEATURED_POSTS = `
  *[_type == "post" && featured == true && publishedAt <= now()]
  | order(publishedAt desc)
  [0...6] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    "mainImage": mainImage{
      asset->{ url, metadata },
      alt
    },
    "author": author->{ _id, name, "slug": slug.current, image{ asset->{ url, metadata }, alt }, bio },
    editorialType,
    "pillar": pillar->{ basePath },
    "category": category->{ "slug": slug.current }
  }
`;

/**
 * QUERY 5: Validar que post pertence ao pilar/categoria corretos
 * Retorna apenas _id se validação passar, null caso contrário
 */
export const QUERY_VALIDATE_POST_HIERARCHY = `
  *[_type == "post" && slug.current == $postSlug && pillar._ref == $pillarId && category._ref == $categoryId][0] {
    _id,
    title,
    "slug": slug.current
  }
`;

/**
 * QUERY 6: Buscar Post POR SLUG APENAS (sem validação de hierarquia)
 * Útil para redirecionar URLs erradas para a URL correta
 */
export const QUERY_POST_BY_SLUG_ONLY = `
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    "pillar": pillar->{
      _id,
      title,
      "slug": slug.current,
      basePath
    },
    "category": category->{
      _id,
      title,
      "slug": slug.current,
      "pillar": pillar->{ _id, basePath }
    }
  }
`;

/**
 * QUERY 7: Contar posts em uma categoria
 * Útil para paginação
 */
export const QUERY_COUNT_POSTS_IN_CATEGORY = `
  count(*[_type == "post" && category._ref == $categoryId && publishedAt <= now()])
`;

/**
 * QUERY 8: Posts recentes do pilar
 * Usado na página do pilar para mostrar últimos posts
 */
export const QUERY_RECENT_POSTS_BY_PILLAR = `
  *[_type == "post" && pillar._ref == $pillarId && publishedAt <= now()]
  | order(publishedAt desc)
  [0...6] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    "mainImage": mainImage{
      asset->{ url, metadata },
      alt
    },
    "author": author->{ _id, name, "slug": slug.current, image{ asset->{ url, metadata }, alt }, bio },
    "pillar": pillar->{ basePath },
    "category": category->{ "slug": slug.current }
  }
`;
