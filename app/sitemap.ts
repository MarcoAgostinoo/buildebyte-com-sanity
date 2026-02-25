import { MetadataRoute } from 'next';
import { client } from '@/app/lib/sanity';

// 1. Criamos a interface para tipar o retorno exato do Sanity
interface SanitySitemapItem {
  slug: string;
  _updatedAt: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.vetorestrategico.com';

  // 2. ROTAS ESTÁTICAS
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/destaques`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/mundo`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/ia`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/videos`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/web-stories`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/achados`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contato`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/licensing`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  try {
    // 3. BUSCA POSTS DINÂMICOS (Agora tipado com SanitySitemapItem[])
    const postsQuery = `*[_type == "post" && defined(slug.current)] {
      "slug": slug.current,
      _updatedAt
    }`;
    const posts = await client.fetch<SanitySitemapItem[]>(postsQuery);

    const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}/post/${post.slug}`, 
      lastModified: new Date(post._updatedAt),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    // 4. BUSCA WEB STORIES DINÂMICAS (Também tipado corretamente)
    const storiesQuery = `*[_type == "webStory" && defined(slug.current)] {
      "slug": slug.current,
      _updatedAt
    }`;
    const stories = await client.fetch<SanitySitemapItem[]>(storiesQuery);

    const storyRoutes: MetadataRoute.Sitemap = stories.map((story) => ({
      url: `${baseUrl}/web-stories/${story.slug}`,
      lastModified: new Date(story._updatedAt),
      changeFrequency: 'daily',
      priority: 0.9,
    }));

    // Retorna tudo combinado
    return [...staticRoutes, ...postRoutes, ...storyRoutes];

  } catch (error) {
    console.error("Erro ao gerar rotas dinâmicas do sitemap:", error);
    return staticRoutes;
  }
}