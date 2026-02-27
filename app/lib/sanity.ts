import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";

/**
 * ============================================================================
 * ENV VARIABLES
 * ============================================================================
 */

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = "2024-01-01";

const readToken = process.env.SANITY_API_READ_TOKEN;
const writeToken = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId) {
  throw new Error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID. Check your .env.local file."
  );
}

if (!dataset) {
  throw new Error(
    "Missing NEXT_PUBLIC_SANITY_DATASET. Check your .env.local file."
  );
}

/**
 * ============================================================================
 * 1️⃣ CLIENTE PÚBLICO (Somente Publicados)
 * ============================================================================
 * - Pode ser usado em qualquer lugar
 * - Não usa token
 * - CDN ativa apenas em produção
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
 * 2️⃣ CLIENTE DE PREVIEW (Draft Mode)
 * ============================================================================
 * - Usa token de leitura
 * - Permite visualizar rascunhos
 * - Só funciona se SANITY_API_READ_TOKEN existir
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
 * 3️⃣ CLIENTE DE ESCRITA (APENAS PARA API ROUTES)
 * ============================================================================
 * - Usar somente em /app/api/*
 * - Nunca importar em componentes React
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
 * ============================================================================
 * Helper para escolher cliente dinamicamente
 * ============================================================================
 */

export function getClient(preview: boolean = false) {
  if (preview && previewClient) {
    return previewClient;
  }
  return client;
}

/**
 * ============================================================================
 * Helper para URLs de Imagem Otimizadas
 * ============================================================================
 */
const builder = createImageUrlBuilder(client);

export type SanityImageSource = Parameters<typeof builder.image>[0];

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
    .auto('format')
    .fit('max')
    .quality(75);
}

/**
 * ============================================================================
 * Helper para URLs de Imagem Otimizadas para Mobile (mais compressão)
 * ============================================================================
 */
export function urlForMobile(source: SanityImageSource) {
  return builder.image(source)
    .auto('format')
    .fit('max')
    .quality(60); // Reduzido para economizar banda em 4G
}
