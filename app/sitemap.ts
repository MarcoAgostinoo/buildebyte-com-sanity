import { MetadataRoute } from 'next';
import { client } from '@/app/lib/sanity';

// 1. Criamos a interface para tipar o retorno exato do Sanity
interface SanitySitemapItem {
  slug: string;
  _updatedAt: string;
  pillarBasePath?: string;
  categorySlug?: string;
  pillarSlug?: string;
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
    // Frentes/Categorias principais
    { url: `${baseUrl}/militar/geopolitica`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/militar/arsenal`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/militar/historia`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/militar/sobrevivencia`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/concursos`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    // Páginas institucionais
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contato`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/manifesto`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/licensing`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
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
        lastModified: new Date(post._updatedAt),
        changeFrequency: 'weekly',
        priority: 0.7,
      };
    });

    // 4. BUSCA WEB STORIES DINÂMICAS
    const storiesQuery = `*[_type == "webStory" && defined(slug.current)] { "slug": slug.current, _updatedAt }`;
    const stories = await client.fetch<SanitySitemapItem[]>(storiesQuery);
    const storyRoutes: MetadataRoute.Sitemap = stories.map((story) => ({
      url: `${baseUrl}/web-stories/${story.slug}`,
      lastModified: new Date(story._updatedAt),
      changeFrequency: 'daily',
      priority: 0.9,
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
    return [...staticRoutes, ...postRoutes, ...storyRoutes, ...pilaresRoutes, ...clustersRoutes];

  } catch (error) {
    console.error("Erro ao gerar rotas dinâmicas do sitemap:", error);
    return staticRoutes;
  }
}