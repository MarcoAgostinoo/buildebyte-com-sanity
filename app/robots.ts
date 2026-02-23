import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*', // Permite que todos os robôs de busca (Google, Bing, etc.) leiam o site
      allow: '/',     // Permite ler todo o site
      disallow: [
        '/api/',      // Impede o Google de tentar indexar suas rotas de API internas
        '/studio/',   // Se o seu painel do Sanity estiver dentro do site (ex: /studio), bloqueie aqui
      ],
    },
    // Aponta diretamente para o sitemap gerado dinamicamente
    sitemap: 'https://www.vetorestrategico.com/sitemap.xml',
  }
}