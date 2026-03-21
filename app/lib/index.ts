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