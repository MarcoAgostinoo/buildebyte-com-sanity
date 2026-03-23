import { createClient } from "next-sanity";
import createImageUrlBuilder from "@sanity/image-url";

/**
 * ============================================================================
 * VARIÁVEIS DE AMBIENTE
 * ============================================================================
 */
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
const apiVersion = "2024-01-01";

const readToken = process.env.SANITY_API_READ_TOKEN;
const writeToken = process.env.SANITY_API_WRITE_TOKEN;

// Validação de segurança básica
if (!projectId || !dataset) {
  throw new Error(
    "Faltam variáveis do Sanity no .env.local. Verifique PROJECT_ID e DATASET."
  );
}

/**
 * ============================================================================
 * 1️⃣ CLIENTE PÚBLICO (Somente conteúdo publicado)
 * ============================================================================
 * - Usado na maioria dos componentes do portal.
 * - CDN ativa em produção para máxima performance.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
  perspective: "published",
});

/**
 * ============================================================================
 * 2️⃣ CLIENTE DE PREVIEW (Para visualizar rascunhos)
 * ============================================================================
 * - Requer token de leitura.
 * -perspective: "previewDrafts" permite ver o que ainda não foi publicado.
 */
export const previewClient = readToken
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      token: readToken,
      perspective: "previewDrafts",
    })
  : null;

/**
 * ============================================================================
 * 3️⃣ CLIENTE DE ESCRITA (Somente para rotas de API)
 * ============================================================================
 * - Usado para receber leads, comentários ou formulários.
 * - JAMAIS importe isto em componentes que rodam no navegador.
 */
export const writeClient = writeToken
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      token: writeToken,
    })
  : null;

/**
 * HELPER: getClient
 * Escolhe entre o cliente de produção ou o de rascunhos.
 */
export function getClient(preview: boolean = false) {
  if (preview && previewClient) {
    return previewClient;
  }
  return client;
}

/**
 * ============================================================================
 * HELPERS DE IMAGEM (Otimização Dinâmica)
 * ============================================================================
 */
const builder = createImageUrlBuilder(client);

// Tipo exportado para usar nas Interfaces de outros componentes
export type SanityImageSource = Parameters<typeof builder.image>[0];

/**
 * Gera URL de imagem otimizada para Desktop
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source)
    .auto('format')
    .fit('max')
    .quality(75);
}

/**
 * Gera URL de imagem ultra-comprimida para Mobile (Redução de 4G)
 */
export function urlForMobile(source: SanityImageSource) {
  return builder.image(source)
    .auto('format')
    .fit('max')
    .quality(60); 
}