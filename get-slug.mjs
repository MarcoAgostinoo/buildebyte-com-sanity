
import pkg from "./app/lib/sanity.ts";
const { client } = pkg;

async function getFeaturedPosts() {
  const query = `*[_type == "post" && featured == true] {
    "slug": slug.current,
  }`;
  return await client.fetch(query, {}, { cache: "no-store" });
}

