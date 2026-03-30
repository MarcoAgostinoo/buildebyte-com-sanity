/**
 * ============================================================================
 * TIPOS SANITY - Estrutura Hierárquica de Pillar > Category > Post
 * ============================================================================
 * Interfaces TypeScript para tipagem forte do conteúdo do Sanity CMS.
 */

import { PortableTextBlock } from "@portabletext/types";

/**
 * IMAGENS SANITY
 * ============================================================================
 */
export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _id?: string;
    url?: string;
    metadata?: {
      dimensions: { width: number; height: number; aspectRatio: number };
      lqip?: string;
    };
  };
  alt?: string;
  caption?: string;
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
}

/**
 * AUTOR
 * ============================================================================
 */
export interface Author {
  _id: string;
  name: string;
  slug?: { current: string };
  bio?: PortableTextBlock[];
  linkedin?: string;
  image?: SanityImage;
}

/**
 * PILAR (Estratégico)
 * ============================================================================
 * Exemplo: "Militar", "Concursos", "IA", etc.
 */
export interface Pillar {
  _id: string;
  title: string;
  slug: { current: string };
  basePath: string; // URL path: "militar", "concursos"
  description?: string;
  icon?: SanityImage;
  color?: string;
}

/**
 * CATEGORIA (dentro de um Pilar)
 * ============================================================================
 * Exemplo: "Geopolítica", "Sobrevivência", "Arsenal", etc.
 */
export interface Category {
  _id: string;
  title: string;
  slug: { current: string };
  pillar: {
    _ref: string;
    _type: "reference";
  } | Pillar; // Resolvido ou referência
  description?: string;
  icon?: SanityImage;
  color?: string;
}

/**
 * POST/ARTIGO (dentro de uma Categoria)
 * ============================================================================
 * Campo completo para exibição em página individual.
 */
export interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  body: PortableTextBlock[];

  // Metadados de publicação
  publishedAt: string;
  featured?: boolean;
  editorialType?: "analise" | "relatorio" | "guia" | "comparativo" | "review" | "opiniao";

  // SEO
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];

  // Imagens
  mainImage: SanityImage;

  // Relacionamentos
  author: Author;
  pillar: Pillar;
  category: Category;

  // Conteúdo especial
  analystView?: PortableTextBlock[];
  spotifyEmbed?: string;

  // Afiliado
  affiliateLink?: string;
  affiliateLabel?: string;
  rating?: number;
}

/**
 * POST (versão listagem - campos reduzidos)
 * ============================================================================
 * Usado em grids, listas paginadas, etc.
 */
export interface PostCard {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  publishedAt: string;
  mainImage: SanityImage;
  author: Pick<Author, "_id" | "name">;
  pillar: Pick<Pillar, "basePath">;
  category: Pick<Category, "slug" | "pillar">;
}

/**
 * CATEGORY (versão listagem com contagem de posts)
 * ============================================================================
 */
export interface CategoryWithPostCount extends Category {
  postsCount: number;
}

/**
 * VALIDAÇÃO DE HIERARQUIA
 * ============================================================================
 * Utilitários para validar se URLs correspondem ao conteúdo.
 */
export interface HierarchyValidation {
  isValid: boolean;
  reason?: string;
  redirectUrl?: string;
}

/**
 * PAGINAÇÃO
 * ============================================================================
 */
export interface PaginationParams {
  offset: number;
  limit: number;
}

/**
 * SEO METADATA
 * ============================================================================
 */
export interface SEOMetadata {
  title: string;
  description: string;
  image: string;
  url: string;
  author?: string;
  publishedAt?: string;
  keywords?: string[];
  type: "article" | "category" | "pillar";
}
