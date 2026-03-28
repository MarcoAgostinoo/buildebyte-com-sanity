import { MetadataRoute } from 'next';
import { client } from '@/app/lib/sanity';

// 1. Criamos a interface para tipar o retorno exato do Sanity
interface SanitySitemapItem {
  slug: string;
  _updatedAt: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.vetorestrategico.com';

  // 2. ROTAS ESTÁTICAS (ATUALIZADAS)
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/destaques`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/radar`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/mundo`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/ia`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/videos`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/web-stories`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/achados`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/concursos`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/frentes`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contato`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/manifesto`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/licensing`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  try {
    // 3. BUSCA POSTS DINÂMICOS
    const postsQuery = `*[_type == "post" && defined(slug.current)] { "slug": slug.current, _updatedAt }`;
    const posts = await client.fetch<SanitySitemapItem[]>(postsQuery);
    const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}/artigo/${post.slug}`, 
      lastModified: new Date(post._updatedAt),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    // 4. BUSCA WEB STORIES DINÂMICAS
    const storiesQuery = `*[_type == "webStory" && defined(slug.current)] { "slug": slug.current, _updatedAt }`;
    const stories = await client.fetch<SanitySitemapItem[]>(storiesQuery);
    const storyRoutes: MetadataRoute.Sitemap = stories.map((story) => ({
      url: `${baseUrl}/web-stories/${story.slug}`,
      lastModified: new Date(story._updatedAt),
      changeFrequency: 'daily',
      priority: 0.9,
    }));

    // 5. BUSCA FRENTES DINÂMICAS (NOVO)
    const frentesQuery = `*[_type == "frente" && defined(slug.current)] { "slug": slug.current, _updatedAt }`;
    const frentes = await client.fetch<SanitySitemapItem[]>(frentesQuery);
    const frentesRoutes: MetadataRoute.Sitemap = frentes.map((frente) => ({
        url: `${baseUrl}/frentes/${frente.slug}`,
        lastModified: new Date(frente._updatedAt),
        changeFrequency: 'weekly',
        priority: 0.6,
    }));

    // 6. BUSCA PILARES DINÂMICOS (NOVO)
    const pilaresQuery = `*[_type == "pillar" && defined(slug.current)] { "slug": slug.current, _updatedAt }`;
    const pilares = await client.fetch<SanitySitemapItem[]>(pilaresQuery);
    const pilaresRoutes: MetadataRoute.Sitemap = pilares.map((pilar) => ({
        url: `${baseUrl}/pilares/${pilar.slug}`,
        lastModified: new Date(pilar._updatedAt),
        changeFrequency: 'weekly',
        priority: 0.6,
    }));

    // 7. BUSCA CLUSTERS DINÂMICOS (NOVO)
    const clustersQuery = `*[_type == "cluster" && defined(slug.current)]{ "slug": slug.current, _updatedAt }`;
    const clusters = await client.fetch<SanitySitemapItem[]>(clustersQuery);
    const clustersRoutes: MetadataRoute.Sitemap = clusters.map((cluster) => ({
        url: `${baseUrl}/clusters/${cluster.slug}`,
        lastModified: new Date(cluster._updatedAt),
        changeFrequency: 'weekly',
        priority: 0.6,
    }));

    // Retorna tudo combinado
    return [...staticRoutes, ...postRoutes, ...storyRoutes, ...frentesRoutes, ...pilaresRoutes, ...clustersRoutes];

  } catch (error) {
    console.error("Erro ao gerar rotas dinâmicas do sitemap:", error);
    return staticRoutes;
  }
}