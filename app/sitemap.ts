import { MetadataRoute } from 'next';
import { client } from '@/app/lib/sanity';

// 1. Interface atualizada com _updatedAt opcional por segurança
interface SanitySitemapItem {
  slug: string;
  _updatedAt?: string; 
  pillarBasePath?: string;
  categorySlug?: string;
  pillarSlug?: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.vetorestrategico.com';
  
  // Data de fallback segura caso o Sanity falhe em retornar a data
  const fallbackDate = new Date(); 

  // 2. ROTAS ESTÁTICAS
  const staticRoutes: MetadataRoute.Sitemap =[
    { url: `${baseUrl}`, lastModified: fallbackDate, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/destaques`, lastModified: fallbackDate, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/radar`, lastModified: fallbackDate, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/mundo`, lastModified: fallbackDate, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/ia`, lastModified: fallbackDate, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/videos`, lastModified: fallbackDate, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/web-stories`, lastModified: fallbackDate, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/achados`, lastModified: fallbackDate, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/militar/geopolitica`, lastModified: fallbackDate, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/militar/arsenal`, lastModified: fallbackDate, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/militar/historia`, lastModified: fallbackDate, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/militar/sobrevivencia`, lastModified: fallbackDate, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/concursos`, lastModified: fallbackDate, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: fallbackDate, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contato`, lastModified: fallbackDate, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/manifesto`, lastModified: fallbackDate, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/search`, lastModified: fallbackDate, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/privacy-policy`, lastModified: fallbackDate, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/licensing`, lastModified: fallbackDate, changeFrequency: 'yearly', priority: 0.3 },
  ];

  try {
    // 3. BUSCA POSTS DINÂMICOS
    const postsQuery = `*[_type == "post" && defined(slug.current) && defined(pillar->basePath) && defined(category->slug.current)] {
      "slug": slug.current,
      _updatedAt,
      "pillarBasePath": pillar->basePath,
      "pillarSlug": pillar->slug.current,
      "categorySlug": category->slug.current
    }`;
    const posts = await client.fetch<SanitySitemapItem[]>(postsQuery);
    const postRoutes: MetadataRoute.Sitemap = posts.map((post) => {
      const p = (post.pillarSlug || post.pillarBasePath || "").toLowerCase();
      const c = post.categorySlug || "geral";
      let postUrl = `/militar/geral/${post.slug}`;
      
      if (p.includes("geopolitica")) postUrl = `/militar/geopolitica/${post.slug}`;
      else if (p.includes("arsenal")) postUrl = `/militar/arsenal/${post.slug}`;
      else if (p.includes("teatro") || p.includes("operacoes") || p.includes("historia")) postUrl = `/militar/historia/${post.slug}`;
      else if (p.includes("sobrevivencia")) postUrl = `/militar/sobrevivencia/${post.slug}`;
      else if (p.includes("carreira") || p.includes("concurso")) postUrl = `/concursos/${c}/${post.slug}`;

      return {
        url: `${baseUrl}${postUrl}`,
        lastModified: post._updatedAt ? new Date(post._updatedAt) : fallbackDate,
        changeFrequency: 'weekly',
        priority: 0.7,
      };
    });

    // 4. BUSCA WEB STORIES DINÂMICAS
    const storiesQuery = `*[_type == "webStory" && defined(slug.current)] { "slug": slug.current, _updatedAt }`;
    const stories = await client.fetch<SanitySitemapItem[]>(storiesQuery);
    const storyRoutes: MetadataRoute.Sitemap = stories.map((story) => ({
      url: `${baseUrl}/web-stories/${story.slug}`,
      lastModified: story._updatedAt ? new Date(story._updatedAt) : fallbackDate,
      changeFrequency: 'daily',
      priority: 0.9,
    }));

    // 5. BUSCA PILARES DINÂMICOS
    const pilaresQuery = `*[_type == "pillar" && defined(slug.current)] { "slug": slug.current, _updatedAt }`;
    const pilares = await client.fetch<SanitySitemapItem[]>(pilaresQuery);
    const pilaresRoutes: MetadataRoute.Sitemap = pilares.map((pilar) => ({
        url: `${baseUrl}/pilares/${pilar.slug}`,
        lastModified: pilar._updatedAt ? new Date(pilar._updatedAt) : fallbackDate,
        changeFrequency: 'weekly',
        priority: 0.6,
    }));

    // 6. BUSCA CLUSTERS DINÂMICOS
    const clustersQuery = `*[_type == "cluster" && defined(slug.current)]{ "slug": slug.current, _updatedAt }`;
    const clusters = await client.fetch<SanitySitemapItem[]>(clustersQuery);
    const clustersRoutes: MetadataRoute.Sitemap = clusters.map((cluster) => ({
        url: `${baseUrl}/clusters/${cluster.slug}`,
        lastModified: cluster._updatedAt ? new Date(cluster._updatedAt) : fallbackDate,
        changeFrequency: 'weekly',
        priority: 0.6,
    }));

    // Retorna tudo combinado de forma limpa
    return[...staticRoutes, ...postRoutes, ...storyRoutes, ...pilaresRoutes, ...clustersRoutes];

  } catch (error) {
    console.error("Erro ao gerar rotas dinâmicas do sitemap. Retornando apenas estáticas:", error);
    return staticRoutes;
  }
}