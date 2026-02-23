import { MetadataRoute } from 'next';
import { client } from '@/app/lib/sanity';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.vetorestrategico.com';

  // 1. ROTAS ESTÁTICAS
  // Mapeadas diretamente a partir das pastas dentro do seu diretório 'app/'
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    
    // Categorias Principais
    { url: `${baseUrl}/destaques`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/mundo`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/ia`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    
    // Conteúdo Multimídia & Interativo
    { url: `${baseUrl}/videos`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/web-stories`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/achados`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    
    // Páginas Institucionais (Prioridade menor, pois mudam pouco)
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contato`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/licensing`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  // 2. ROTAS DINÂMICAS (Artigos do Sanity)
  try {
    // Busca todos os posts publicados que possuem um slug válido
    const query = `*[_type == "post" && defined(slug.current)] {
      "slug": slug.current,
      _updatedAt
    }`;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const posts = await client.fetch<any[]>(query);

    const dynamicRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
      // Baseado na sua pasta 'app/post', a URL deve incluir '/post/'
      // Se na verdade for direto na raiz, remova o '/post' e deixe apenas `/${post.slug}`
      url: `${baseUrl}/post/${post.slug}`, 
      lastModified: new Date(post._updatedAt),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    return [...staticRoutes, ...dynamicRoutes];

  } catch (error) {
    console.error("Erro ao gerar rotas dinâmicas do sitemap:", error);
    // Fallback: se o Sanity falhar, envia pelo menos as páginas estáticas
    return staticRoutes;
  }
}