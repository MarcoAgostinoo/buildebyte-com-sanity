/**
 * Schema.org helpers para SEO estruturado
 * Reutilize essas funções para NewsArticle, WebStories, BlogPosting, etc.
 */

export interface SchemaOrganization {
  "@type": "Organization";
  "@id": string;
  name: string;
  url: string;
  logo: {
    "@type": "ImageObject";
    url: string;
  };
  description: string;
  sameAs?: string[];
  contactPoint?: {
    "@type": "ContactPoint";
    contactType: string;
    email?: string;
    url?: string;
  };
}

export interface SchemaNewsArticle {
  "@context": "https://schema.org";
  "@type": "NewsArticle" | "BlogPosting" | "Article";
  "@id": string;
  headline: string;
  description: string;
  image: string | string[];
  datePublished: string;
  dateModified: string;
  keywords: string;
  articleSection?: string;
  author: {
    "@type": "Organization" | "Person";
    name: string;
    url?: string;
    logo?: {
      "@type": "ImageObject";
      url: string;
    };
  };
  publisher: {
    "@type": "Organization";
    name: string;
    logo: {
      "@type": "ImageObject";
      url: string;
    };
  };
  mainEntity?: {
    "@type": "WebPage";
    "@id": string;
  };
}

/**
 * Gera Schema NewsArticle otimizado para Google News e Google Discover
 */
export function generateNewsArticleSchema(props: {
  title: string;
  description: string;
  image: string | string[];
  url: string;
  publishedAt: string;
  keywords: string;
  authorName?: string;
  articleSection?: string;
  slug: string;
}): SchemaNewsArticle {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "@id": `${props.url}#article`,
    headline: props.title,
    description: props.description,
    image: props.image,
    datePublished: props.publishedAt,
    dateModified: props.publishedAt,
    keywords: props.keywords,
    articleSection: props.articleSection || "Notícias",
    author: {
      "@type": "Organization",
      name: props.authorName || "Vetor Estratégico",
      url: "https://vetorestrategico.com",
      logo: {
        "@type": "ImageObject",
        url: "https://vetorestrategico.com/logo.png",
      },
    },
    publisher: {
      "@type": "Organization",
      name: "Vetor Estratégico",
      logo: {
        "@type": "ImageObject",
        url: "https://vetorestrategico.com/logo.png",
      },
    },
    mainEntity: {
      "@type": "WebPage",
      "@id": props.url,
    },
  };
}

/**
 * Gera Schema para BlogPosting (artigos técnicos/análises)
 */
export function generateBlogPostingSchema(props: {
  title: string;
  description: string;
  content: string;
  image: string | string[];
  url: string;
  publishedAt: string;
  keywords: string;
  authorName?: string;
}): SchemaNewsArticle {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${props.url}#article`,
    headline: props.title,
    description: props.description,
    image: props.image,
    datePublished: props.publishedAt,
    dateModified: props.publishedAt,
    keywords: props.keywords,
    author: {
      "@type": "Person",
      name: props.authorName || "Vetor Estratégico",
    },
    publisher: {
      "@type": "Organization",
      name: "Vetor Estratégico",
      logo: {
        "@type": "ImageObject",
        url: "https://vetorestrategico.com/logo.png",
      },
    },
  };
}

/**
 * Gera Schema BreadcrumbList para navegação estruturada
 * Útil para SEO de rastreamento de navegação
 */
export function generateBreadcrumbSchema(props: {
  items: Array<{
    name: string;
    url: string;
  }>;
}): {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }>;
} {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: props.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Gera informações estruturadas para artigos em Web Stories
 * Compatível com Google News e AMP Stories
 */
export function generateWebStorySchema(props: {
  title: string;
  description: string;
  image: string;
  url: string;
  publishedAt: string;
  keywords: string;
  authorName?: string;
  storyTitle?: string;
  storyUrl?: string;
}): SchemaNewsArticle {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "@id": `${props.url}#web-story`,
    headline: props.storyTitle || props.title,
    description: props.description,
    image: props.image,
    datePublished: props.publishedAt,
    dateModified: props.publishedAt,
    keywords: props.keywords,
    articleSection: "Web Stories",
    author: {
      "@type": "Organization",
      name: props.authorName || "Vetor Estratégico",
      url: "https://vetorestrategico.com",
      logo: {
        "@type": "ImageObject",
        url: "https://vetorestrategico.com/logo.png",
      },
    },
    publisher: {
      "@type": "Organization",
      name: "Vetor Estratégico",
      logo: {
        "@type": "ImageObject",
        url: "https://vetorestrategico.com/logo.png",
      },
    },
  };
}

/**
 * Extrai keywords de um array de categorias
 * Útil para Google News categorization
 */
export function extractNewsKeywords(
  categories?: Array<{ title: string }>,
  pillar?: string,
  defaultKeywords = "tecnologia, defesa, infraestrutura"
): string {
  const categoryKeywords = categories?.map((c) => c.title) || [];
  const allKeywords = pillar
    ? [...categoryKeywords, pillar]
    : categoryKeywords;
  
  return allKeywords.length > 0 ? allKeywords.join(", ") : defaultKeywords;
}

/**
 * Gera metatags específicas para Google News
 * Retorna string com metatags prontas para inserir no <head>
 */
export function generateGoogleNewsMetatags(props: {
  title: string;
  publishedAt: string;
  keywords: string;
  standalone?: boolean; // Se true, volta com tags HTML; se false, apenas retorna props para metadata
}): string {
  const date = new Date(props.publishedAt).toISOString().split("T")[0];
  
  if (props.standalone) {
    return `
<meta name="news_keywords" content="${props.keywords}" />
<meta property="article:published_time" content="${props.publishedAt}" />
<meta property="og:type" content="news" />
`.trim();
  }
  
  return props.keywords;
}
