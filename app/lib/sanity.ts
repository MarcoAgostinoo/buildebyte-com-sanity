import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = "2024-01-01";

// Tokens from .env.local
const readToken = process.env.SANITY_API_READ_TOKEN;
const writeToken = process.env.SANITY_API_WRITE_TOKEN; // NOVO: Token de escrita

if (!projectId || !dataset) {
  throw new Error("Missing Sanity project ID or dataset. Check your .env.local file.");
}

// 1. Standard client for fetching published data (Leitura Pública)
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // 'false' ensures fresh data
});

// 2. Client that uses a token to fetch drafts (Leitura de Rascunhos)
export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: readToken,
});

// 3. Client for WRITING data (Escrita - Newsletter, Likes, Views)
// Use este cliente APENAS em rotas de API (nunca no frontend direto)
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: writeToken, // Este token precisa ter permissão de 'Editor' ou 'Write'
});