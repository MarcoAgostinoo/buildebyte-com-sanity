import Parser from 'rss-parser';

export interface Episode {
  id: string;
  title: string;
  link: string;
  audio: string;
  pubDate: string;
  content: string;
  image?: string;
}

export async function getPodcastEpisodes(): Promise<Episode[]> {
  // URL do Feed RSS (Anchor/Spotify)
  const RSS_URL = 'https://anchor.fm/s/10ea4b7e4/podcast/rss';

  try {
    // Usamos fetch para aproveitar o cache do Next.js (revalidate)
    const res = await fetch(RSS_URL, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const xmlText = await res.text();

    const parser = new Parser();
    const feed = await parser.parseString(xmlText);

    return feed.items.slice(0, 4).map((item) => ({
      id: item.guid || '',
      title: item.title || '',
      link: item.link || '',
      audio: item.enclosure?.url || '',
      pubDate: item.pubDate || '',
      content: item.contentSnippet || '',
      image: item.itunes?.image || feed.image?.url,
    }));
  } catch (error) {
    console.error('Erro ao buscar podcasts:', error);
    return [];
  }
}