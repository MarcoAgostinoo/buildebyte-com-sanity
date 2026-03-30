/**
 * ============================================================================
 * QUERIES GROQ - CATEGORIA
 * ============================================================================
 * Queries para recuperar categorias de um pilar.
 */

/**
 * QUERY 1: Listar Categorias de um Pilar (com contagem de posts)
 */
export const QUERY_CATEGORIES_BY_PILLAR = `
  *[_type == "category" && pillar._ref == $pillarId] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    "icon": icon.asset->url,
    color,
    "pillar": pillar->{
      _id,
      title,
      "slug": slug.current,
      basePath
    },
    "postsCount": count(*[_type == "post" && category._ref == ^._id && publishedAt <= now()])
  }
`;

/**
 * QUERY 2: Buscar Categoria por slug dentro de um Pilar
 * Retorna categoria completa com referência ao pilar
 */
export const QUERY_CATEGORY_BY_SLUG = `
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    "icon": icon.asset->url,
    color,
    "pillar": pillar->{
      _id,
      title,
      "slug": slug.current,
      basePath
    },
    "postsCount": count(*[_type == "post" && category._ref == ^._id && publishedAt <= now()])
  }
`;

/**
 * QUERY 3: Validar que categoria pertence ao pilar
 * Retorna null se não encontrar ou se o pilar não corresponder
 */
export const QUERY_VALIDATE_CATEGORY_IN_PILLAR = `
  *[_type == "category" && slug.current == $categorySlug && pillar._ref == $pillarId][0] {
    _id,
    title,
    "slug": slug.current
  }
`;
