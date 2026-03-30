/**
 * ============================================================================
 * QUERIES GROQ - PILAR
 * ============================================================================
 * Queries para recuperar pilares estratégicos do CMS.
 */

/**
 * QUERY 1: Buscar Pilar por basePath
 * Exemplo: getPillarByBasePath({ basePath: "militar" })
 */
export const QUERY_PILLAR_BY_BASEPATH = `
  *[_type == "pillar" && basePath == $basePath][0] {
    _id,
    title,
    "slug": slug.current,
    basePath,
    description,
    "icon": icon.asset->url,
    color
  }
`;

/**
 * QUERY 2: Listar todos os Pilares (para navegação)
 */
export const QUERY_ALL_PILLARS = `
  *[_type == "pillar"] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    basePath,
    description,
    "icon": icon.asset->url,
    color,
    "categoriesCount": count(*[_type == "category" && pillar._ref == ^._id])
  }
`;

/**
 * QUERY 3: Buscar Pilar por slug
 */
export const QUERY_PILLAR_BY_SLUG = `
  *[_type == "pillar" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    basePath,
    description,
    "icon": icon.asset->url,
    color
  }
`;
