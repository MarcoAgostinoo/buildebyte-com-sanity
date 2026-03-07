import Link from "next/link";
import { CategoryWithPosts } from "@/app/lib";

type PopularPostsListProps = {
    posts: CategoryWithPosts["posts"];
};

export default function PopularPostsList({ posts }: PopularPostsListProps) {
    return (
        <aside className="lg:col-span-3 lg:border-r lg:border-zinc-200 lg:pr-12 p-4 bg-amber-50">
            <h2 className="text-[#0070f3] text-xl font-black mb-8 uppercase tracking-tighter">
                Mais Populares
            </h2>
            <div className="flex flex-col gap-8">
                {posts.map(
                    (
                        post: CategoryWithPosts["posts"][number],
                        index: number
                    ) => (
                        <article key={post._id} className="flex gap-4 group">
                            <span className="text-3xl font-black text-zinc-600 group-hover:text-[#0070f3] leading-none transition-colors">
                                {index + 1}
                            </span>
                            <Link href={`/post/${post.slug}`}>
                                <h3 className="font-bold text-[15px] leading-tight text-zinc-900 group-hover:text-[#0070f3] transition-colors">
                                    {post.title}
                                </h3>
                            </Link>
                        </article>
                    )
                )}
            </div>
        </aside>
    );
}
