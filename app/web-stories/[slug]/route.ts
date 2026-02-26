import { client } from "@/app/lib/sanity";

interface WebStoryPage {
  image: string;
  text?: string;
  duration?: number;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const baseUrl = new URL(request.url).origin;

  const query = `*[_type == "webStory" && slug.current == $slug][0]{
    title,
    "coverImage": coverImage.asset->url,
    "targetSlug": targetPost->slug.current,
    "publishedAt": _createdAt,
    "author": targetPost->author->name,
    pages[]{
      "image": image.asset->url,
      text,
      duration
    }
  }`;

  const story = await client.fetch(query, { slug });

  if (!story) {
    return new Response("Story not found", { status: 404 });
  }

  const ctaLink = story.targetSlug
    ? `${baseUrl}/post/${story.targetSlug}`
    : baseUrl;

  // Schema SEO
  const schema = {
    "@context": "http://schema.org",
    "@type": "NewsArticle",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/web-stories/${slug}`,
    },
    headline: story.title,
    image: [story.coverImage],
    datePublished: story.publishedAt || new Date().toISOString(),
    author: {
      "@type": "Person",
      name: story.author || "Build & Byte",
    },
    publisher: {
      "@type": "Organization",
      name: "Build & Byte",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.webp`,
      },
    },
  };

  // HTML AMP corrigido (Sem cta-text)
  const html = `
<!DOCTYPE html>
<html amp lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
    <title>${story.title}</title>
    <link rel="canonical" href="${baseUrl}/web-stories/${slug}">
    <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
    <script async src="https://cdn.ampproject.org/v0.js"></script>
    <script async custom-element="amp-story" src="https://cdn.ampproject.org/v0/amp-story-1.0.js"></script>
    
    <script type="application/ld+json">
      ${JSON.stringify(schema)}
    </script>

    <style amp-custom>
      amp-story { font-family: 'Inter', sans-serif; }
      amp-story-page { background-color: #000; }
      .text-layer {
        background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
        padding: 20px;
        padding-bottom: 40px;
      }
      p { font-weight: 500; font-size: 1.1em; color: white; text-shadow: 1px 1px 2px black; }
    </style>
  </head>
  <body>
    <amp-story standalone
      title="${story.title}"
      publisher="Build & Byte"
      publisher-logo-src="${baseUrl}/logo.webp"
      poster-portrait-src="${story.coverImage}">
      
      ${story.pages
        ?.map((page: WebStoryPage, index: number) => {
          const imgUrl = page.image.includes("sanity.io")
            ? `${page.image}?w=720&h=1280&fit=crop&auto=format`
            : page.image;

          return `
        <amp-story-page id="page-${index}" auto-advance-after="${page.duration || 7}s">
          <amp-story-grid-layer template="fill">
          <amp-img src="${imgUrl}" alt="${page.text ? page.text : story.title}" width="720" height="1280" layout="responsive"></amp-img>
          </amp-story-grid-layer>
          
          ${
            page.text
              ? `
          <amp-story-grid-layer template="vertical" class="bottom">
            <div class="text-layer">
              <p>${page.text}</p>
            </div>
          </amp-story-grid-layer>
          `
              : ""
          }

          ${
            index === story.pages.length - 1
              ? `
            <amp-story-page-outlink layout="nodisplay" theme="dark">
              <a href="${ctaLink}">Ler Artigo Completo</a>
            </amp-story-page-outlink>
          `
              : ""
          }
        </amp-story-page>
      `;
        })
        .join("")}
    </amp-story>
  </body>
</html>`.trim();

  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
}
