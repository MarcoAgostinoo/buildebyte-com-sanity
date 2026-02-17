import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

export async function GET() {
  const parser = new Parser();
  
  // Substitua pelo SEU link do RSS do Spotify/Anchor
  // Nota: No painel do Spotify for Podcasters, vá em Configurações > Disponibilidade do Podcast > Feed RSS.
  const RSS_URL = 'https://anchor.fm/s/10ea4b7e4/podcast/rss'; 

  try {
    const feed = await parser.parseURL(RSS_URL);

    // Filtra apenas os 3 últimos episódios
    const latestEpisodes = feed.items.slice(0, 3).map((item) => ({
      id: item.guid,
      title: item.title,
      link: item.link, // Link para a página do episódio
      audio: item.enclosure?.url, // Link direto do MP3
      pubDate: item.pubDate,
      content: item.contentSnippet, // Resumo
      image: item.itunes?.image || feed.image?.url, // Capa do episódio ou do podcast
    }));

    // Cacheamento: Revalida a cada 1 hora (3600 segundos) para não bater no RSS toda hora
    return NextResponse.json(
      { episodes: latestEpisodes },
      { 
        status: 200, 
        headers: {
          'Cache-Control': 's-maxage=3600, stale-while-revalidate',
        }
      }
    );
  } catch (error) {
    console.error('Erro ao buscar podcasts:', error);
    return NextResponse.json({ error: 'Falha ao carregar podcasts' }, { status: 500 });
  }
}