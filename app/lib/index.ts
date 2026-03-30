export interface BasePost {
  _id: string;
  title: string;
  slug: string;
  imagem: string;
  imagemAlt?: string;
  imagemLqip?: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  pillar?: string;
  pillarBasePath?: string;
  categorySlug?: string;
}

export type FeaturedPost = BasePost;

export interface Post extends BasePost {
  editorialType?: string;
}

export interface CategoryWithPosts {
  _id: string;
  title: string;
  slug: string;
  posts: Post[];
}

export interface WebStory {
  _id: string;
  title: string;
  slug: string;
  coverImage: string;
  description?: string;
  ctaText?: string;
  targetPostSlug?: string;
}

// ── NOVOS TIPOS (Hierarquia Pillar > Category > Post) ──
export {
  type Pillar,
  type Category,
  type CategoryWithPostCount,
  type Post as PostComplete,
  type PostCard,
  type Author,
  type SanityImage,
  type HierarchyValidation,
  type PaginationParams,
  type SEOMetadata,
} from "./types";

// ── NOVOS HELPERS ──
export {
  getPillarByBasePath,
  getAllPillars,
  getPillarBySlug,
  getCategoriesByPillar,
  getCategoryBySlug,
  validateCategoryInPillar,
  getPostsByCategory,
  getPostComplete,
  getRelatedPosts,
  getFeaturedPosts,
  validatePostHierarchy,
  getPostBySlugOnly,
  countPostsInCategory,
  getRecentPostsByPillar,
} from "./sanity-helpers";

// ── VALIDATORS ──
export {
  validatePostHierarchy as validatePostHierarchyStrict,
  validateCategoryHierarchy,
  validatePostPublishStatus,
  validateFriendlyUrl,
} from "./validators";

// ── UTILS ──
export { generatePostPortableTextComponents } from "./portable-text-components";