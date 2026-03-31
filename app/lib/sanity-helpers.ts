/**
 * ============================================================================
 * SANITY FETCH HELPERS - Funções para executar queries com tipo forte
 * ============================================================================
 * Wrapper amigável sobre queries GROQ com tipagem TypeScript.
 */

import { client, previewClient } from "./sanity";
import { 
  Pillar, 
  Category, 
  Post, 
  PostCard, 
  CategoryWithPostCount, 
  WebStory // Certifique-se de que este tipo existe no seu arquivo de types
} from "./types";

import {
  QUERY_PILLAR_BY_BASEPATH,
  QUERY_ALL_PILLARS,
  QUERY_PILLAR_BY_SLUG,
} from "./queries/pillar";

import {
  QUERY_CATEGORIES_BY_PILLAR,
  QUERY_CATEGORY_BY_SLUG,
  QUERY_VALIDATE_CATEGORY_IN_PILLAR,
} from "./queries/category";

import {
  QUERY_POSTS_BY_CATEGORY,
  QUERY_POST_COMPLETE,
  QUERY_RELATED_POSTS,
  QUERY_FEATURED_POSTS,
  QUERY_VALIDATE_POST_HIERARCHY,
  QUERY_POST_BY_SLUG_ONLY,
  QUERY_COUNT_POSTS_IN_CATEGORY,
  QUERY_RECENT_POSTS_BY_PILLAR,
} from "./queries/post";

// Importação das novas queries de Web Story
import { 
  QUERY_WEB_STORIES, 
  QUERY_WEB_STORY_BY_SLUG 
} from "./queries/webStory";

/**
 * PILLAR FUNCTIONS
 * ============================================================================
 */

export async function getPillarByBasePath(basePath: string): Promise<Pillar | null> {
  try {
    return await client.fetch(QUERY_PILLAR_BY_BASEPATH, { basePath });
  } catch (error) {
    console.error(`[Sanity] Erro ao buscar pilar com basePath "${basePath}":`, error);
    return null;
  }
}

export async function getAllPillars(): Promise<Pillar[]> {
  try {
    return await client.fetch(QUERY_ALL_PILLARS);
  } catch (error) {
    console.error("[Sanity] Erro ao buscar todos os pilares:", error);
    return [];
  }
}

export async function getPillarBySlug(slug: string): Promise<Pillar | null> {
  try {
    return await client.fetch(QUERY_PILLAR_BY_SLUG, { slug });
  } catch (error) {
    console.error(`[Sanity] Erro ao buscar pilar com slug "${slug}":`, error);
    return null;
  }
}

/**
 * CATEGORY FUNCTIONS
 * ============================================================================
 */

export async function getCategoriesByPillar(
  pillarId: string
): Promise<CategoryWithPostCount[]> {
  try {
    return await client.fetch(QUERY_CATEGORIES_BY_PILLAR, { pillarId });
  } catch (error) {
    console.error(
      `[Sanity] Erro ao buscar categorias do pilar "${pillarId}":`,
      error
    );
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    return await client.fetch(QUERY_CATEGORY_BY_SLUG, { slug });
  } catch (error) {
    console.error(`[Sanity] Erro ao buscar categoria com slug "${slug}":`, error);
    return null;
  }
}

export async function validateCategoryInPillar(
  categorySlug: string,
  pillarId: string
): Promise<boolean> {
  try {
    const result = await client.fetch(QUERY_VALIDATE_CATEGORY_IN_PILLAR, {
      categorySlug,
      pillarId,
    });
    return !!result;
  } catch (error) {
    console.error(
      `[Sanity] Erro ao validar categoria "${categorySlug}" no pilar "${pillarId}":`,
      error
    );
    return false;
  }
}

/**
 * POST FUNCTIONS
 * ============================================================================
 */

export async function getPostsByCategory(
  categoryId: string,
  offset: number = 0,
  limit: number = 12
): Promise<PostCard[]> {
  try {
    return await client.fetch(QUERY_POSTS_BY_CATEGORY, {
      categoryId,
      offset,
      limit,
    });
  } catch (error) {
    console.error(
      `[Sanity] Erro ao buscar posts da categoria "${categoryId}":`,
      error
    );
    return [];
  }
}

export async function getPostComplete(slug: string): Promise<Post | null> {
  try {
    return await client.fetch(QUERY_POST_COMPLETE, { slug });
  } catch (error) {
    console.error(`[Sanity] Erro ao buscar post completo "${slug}":`, error);
    return null;
  }
}

export async function getRelatedPosts(
  categoryId: string,
  postSlug: string
): Promise<PostCard[]> {
  try {
    return await client.fetch(QUERY_RELATED_POSTS, {
      categoryId,
      postSlug,
    });
  } catch (error) {
    console.error(
      `[Sanity] Erro ao buscar posts relacionados para "${postSlug}":`,
      error
    );
    return [];
  }
}

export async function getFeaturedPosts(): Promise<PostCard[]> {
  try {
    return await client.fetch(QUERY_FEATURED_POSTS);
  } catch (error) {
    console.error("[Sanity] Erro ao buscar posts em destaque:", error);
    return [];
  }
}

export async function validatePostHierarchy(
  postSlug: string,
  pillarId: string,
  categoryId: string
): Promise<boolean> {
  try {
    const result = await client.fetch(QUERY_VALIDATE_POST_HIERARCHY, {
      postSlug,
      pillarId,
      categoryId,
    });
    return !!result;
  } catch (error) {
    console.error(
      `[Sanity] Erro ao validar hierarquia do post "${postSlug}":`,
      error
    );
    return false;
  }
}

export async function getPostBySlugOnly(slug: string): Promise<Post | null> {
  try {
    return await client.fetch(QUERY_POST_BY_SLUG_ONLY, { slug });
  } catch (error) {
    console.error(
      `[Sanity] Erro ao buscar post por slug "${slug}":`,
      error
    );
    return null;
  }
}

export async function countPostsInCategory(categoryId: string): Promise<number> {
  try {
    return await client.fetch(QUERY_COUNT_POSTS_IN_CATEGORY, { categoryId });
  } catch (error) {
    console.error(
      `[Sanity] Erro ao contar posts na categoria "${categoryId}":`,
      error
    );
    return 0;
  }
}

export async function getRecentPostsByPillar(
  pillarId: string
): Promise<PostCard[]> {
  try {
    return await client.fetch(QUERY_RECENT_POSTS_BY_PILLAR, { pillarId });
  } catch (error) {
    console.error(
      `[Sanity] Erro ao buscar posts recentes do pilar "${pillarId}":`,
      error
    );
    return [];
  }
}

/**
 * WEB STORY FUNCTIONS
 * ============================================================================
 */

/**
 * Busca as stories para o carrossel da Home
 * Inclui autor e data para o componente WebStoriesCarousel
 */
export async function getWebStories(): Promise<WebStory[]> {
  try {
    return await client.fetch(QUERY_WEB_STORIES);
  } catch (error) {
    console.error("[Sanity] Erro ao buscar Web Stories para a Home:", error);
    return [];
  }
}

/**
 * Busca os dados completos de uma Web Story específica para a página interna
 * Inclui mídia (imagem/vídeo) de cada página e o CTA relacionado
 */
export async function getWebStoryBySlug(slug: string): Promise<any | null> {
  try {
    return await client.fetch(QUERY_WEB_STORY_BY_SLUG, { slug });
  } catch (error) {
    console.error(`[Sanity] Erro ao buscar Web Story completa "${slug}":`, error);
    return null;
  }
}