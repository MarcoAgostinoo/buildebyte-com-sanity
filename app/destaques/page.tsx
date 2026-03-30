import DestaquesGrid from "@/app/components/DestaquesGrid";
import { getFeaturedPosts } from "@/app/lib/sanity";

export default async function DestaquesPage() {
  const initialPosts = await getFeaturedPosts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Destaques</h1>
      <DestaquesGrid initialPosts={initialPosts} />
    </div>
  );
}
