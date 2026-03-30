import DestaquesGrid from "@/app/components/DestaquesGrid";
import { getAllPosts } from "@/app/lib/sanity";

export default async function ArtigosPage() {
  const initialPosts = await getAllPosts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Todos os Artigos</h1>
      <DestaquesGrid initialPosts={initialPosts} />
    </div>
  );
}
