/**
 * ============================================================================
 * VALIDATORS - Validação de Hierarquia e Segurança
 * ============================================================================
 * Funções para validar relacionamentos pilar > category > post
 */

import { HierarchyValidation } from "./types";
import { Post, Category, Pillar } from "./types";

/**
 * Valida que post pertence ao pilar/categoria especificados na URL
 */
export function validatePostHierarchy(
  post: Post,
  urlPillarBasePath: string,
  urlCategorySlug: string
): HierarchyValidation {
  // 1. Validar pilar
  if (post.pillar.basePath !== urlPillarBasePath) {
    return {
      isValid: false,
      reason: `Post belongs to pillar "${post.pillar.basePath}", not "${urlPillarBasePath}"`,
      redirectUrl: `/${post.pillar.basePath}/${post.category.slug.current}/${post.slug.current}`,
    };
  }

  // 2. Validar categoria
  if (post.category.slug.current !== urlCategorySlug) {
    return {
      isValid: false,
      reason: `Post belongs to category "${post.category.slug.current}", not "${urlCategorySlug}"`,
      redirectUrl: `/${post.pillar.basePath}/${post.category.slug.current}/${post.slug.current}`,
    };
  }

  // 3. Validar que categoria pertence ao pilar (crítico!)
  if (typeof post.category.pillar === "object" && post.category.pillar && "_id" in post.category.pillar) {
    if ((post.category.pillar as any)._id !== post.pillar._id) {
      return {
        isValid: false,
        reason: "Category does not belong to post pillar - CRITICAL DATA INCONSISTENCY",
      };
    }
  }

  return { isValid: true };
}

/**
 * Valida que categoria pertence ao pilar
 */
export function validateCategoryHierarchy(
  category: Category,
  urlPillarId: string
): HierarchyValidation {
  const categoryPillarId = typeof category.pillar === "string"
    ? category.pillar
    : typeof category.pillar === "object" && "_id" in category.pillar
    ? (category.pillar as any)._id
    : undefined;

  if (categoryPillarId !== urlPillarId) {
    return {
      isValid: false,
      reason: `Category does not belong to pillar "${urlPillarId}"`,
    };
  }

  return { isValid: true };
}

/**
 * Valida se post pode ser exibido publicamente
 */
export function validatePostPublishStatus(post: Post): HierarchyValidation {
  // Se publishedAt no futuro, não pode ser exibido
  if (new Date(post.publishedAt) > new Date()) {
    return {
      isValid: false,
      reason: "Post not yet published",
    };
  }

  // Validações adicionais
  if (!post.author) {
    return {
      isValid: false,
      reason: "Post has no author",
    };
  }

  if (!post.body || post.body.length === 0) {
    return {
      isValid: false,
      reason: "Post has no body content",
    };
  }

  return { isValid: true };
}

/**
 * Valida estrutura completa para URLs amigáveis
 */
export function validateFriendlyUrl(
  post: Post,
  categorySlug: string,
  pillarBasePath: string
): {
  isValid: boolean;
  canonicalUrl?: string;
  redirectRequired?: boolean;
} {
  const canonicalUrl = `/${post.pillar.basePath}/${post.category.slug.current}/${post.slug.current}`;
  const currentUrl = `/${pillarBasePath}/${categorySlug}/${post.slug.current}`;

  if (canonicalUrl !== currentUrl) {
    return {
      isValid: false,
      canonicalUrl,
      redirectRequired: true,
    };
  }

  return { isValid: true };
}
