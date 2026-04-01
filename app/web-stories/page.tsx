import { client } from "@/app/lib/sanity";
import Image from "next/image";
import Link from "next/link";

// Interface para garantir a tipagem correta
interface WebStoryIndex {
  _id: string;
  title: string;
  slug: string;
  coverImage: string;
  description: string;
}

async function getWebStories() {
  const query = `*[_type == "webStory"] | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    "coverImage": coverImage.asset->url,
    description
  }`;
  return await client.fetch(query);
}

export default async function WebStoriesArchivePage() {
  const stories: WebStoryIndex[] = await getWebStories();

  return (
    <main className="min-h-screen bg-zinc-950 pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header no estilo do seu portal */}
        <header className="mb-12 border-l-4 border-red-600 pl-6">
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
            Web Stories <span className="text-red-600">.</span>
          </h1>
          <p className="text-zinc-400 mt-2 max-w-2xl font-medium uppercase text-xs tracking-widest">
            Análises visuais rápidas e táticas
          </p>
        </header>

        {/* Listagem das Stories */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {stories.map((story) => (
            <Link 
              key={story._id} 
              href={`/web-stories/${story.slug}`}
              className="group relative aspect-[9/16] rounded-2xl overflow-hidden border border-zinc-800 transition-all hover:border-red-600 shadow-2xl"
            >
              <Image 
                src={story.coverImage} 
                alt={story.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Overlay de texto */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-4 flex flex-col justify-end">
                <h2 className="text-white font-bold text-sm md:text-base leading-tight">
                  {story.title}
                </h2>
                {story.description && (
                  <p className="text-white/60 text-[10px] mt-1 line-clamp-2 leading-tight uppercase font-medium">
                    {story.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}