import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = "2024-01-01";

// This token MUST be in your .env.local file as SANITY_API_READ_TOKEN
const token = process.env.SANITY_API_READ_TOKEN;

if (!projectId || !dataset) {
  throw new Error("Missing Sanity project ID or dataset. Check your .env.local file.");
}
// Standard client for fetching published data
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // 'false' ensures fresh data
});

// Client that uses a token to fetch drafts
export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: token,
});