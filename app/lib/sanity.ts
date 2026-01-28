import { createClient } from "next-sanity";

const projectId = "8j2x53jw";
const dataset = "marcosanity";
const apiVersion = "2024-01-01";

// This token MUST be in your .env.local file as SANITY_API_READ_TOKEN
const token = process.env.SANITY_API_READ_TOKEN;

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