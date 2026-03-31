/**
 * ============================================================================
 * QUERIES GROQ - WEB STORIES
 * ============================================================================
 */

export const QUERY_WEB_STORIES = `
  *[_type == "webStory"] | order(publishedAt desc) [0...12] {
    _id,
    title,
    "slug": slug.current,
    description,
    "coverImage": coverImage.asset->url,
    publishedAt,
    "authorName": author->name,
    "ctaText": ctaText
  }
`;

export const QUERY_WEB_STORY_BY_SLUG = `
  *[_type == "webStory" && slug.current == $slug][0] {
    ...,
    "coverImage": coverImage.asset->url,
    "author": author->{ name, "avatar": image.asset->url },
    "targetPost": targetPost->{
      "slug": slug.current,
      "pillar": pillar->basePath,
      "category": category->slug.current
    },
    pages[] {
      ...,
      "image": image.asset->url,
      "video": video.asset->url
    }
  }
`;