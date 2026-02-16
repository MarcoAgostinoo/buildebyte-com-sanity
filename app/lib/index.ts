export interface BasePost {
  _id: string;
  title: string;
  slug: string;
  imagem: string;
  imagemAlt?: string;
  excerpt: string;
  author: string;
  publishedAt: string;
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
  targetPostSlug?: string;
}