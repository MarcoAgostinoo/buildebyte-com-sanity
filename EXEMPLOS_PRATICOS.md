# 📋 EXEMPLOS PRÁTICOS DE IMPLEMENTAÇÃO

## Exemplo 1: Página do Pilar (`/geopolitica-e-defesa`)

### Arquivo: `app/[pillarBasePath]/page.tsx`

```typescript
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  getPillarByBasePath,
  getCategoriesByPillar,
  getRecentPostsByPillar,
} from "@/app/lib/sanity-helpers";
import { Breadcrumb } from "@/app/components/shared/Breadcrumb";
import { PillarHeader } from "@/app/components/pillar/PillarHeader";
import { PillarCategoriesSection } from "@/app/components/pillar/PillarCategoriesSection";
import { PostGrid } from "@/app/components/post/PostCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pillarBasePath: string }>;
}): Promise<Metadata> {
  const { pillarBasePath } = await params;
  const pillar = await getPillarByBasePath(pillarBasePath);

  if (!pillar) {
    return { title: "Pilar não encontrado" };
  }

  return {
    title: `${pillar.title} | Vetor Estratégico`,
    description: pillar.description,
  };
}

export default async function PillarPage({
  params,
}: {
  params: Promise<{ pillarBasePath: string }>;
}) {
  const { pillarBasePath } = await params;

  if (!pillarBasePath) notFound();

  const pillar = await getPillarByBasePath(pillarBasePath);
  if (!pillar) notFound();

  const categories = await getCategoriesByPillar(pillar._id);
  const recentPosts = await getRecentPostsByPillar(pillar._id);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: pillar.title },
          ]}
        />
      </div>

      <PillarHeader pillar={pillar} />

      {categories.length > 0 && (
        <PillarCategoriesSection pillar={pillar} categories={categories} />
      )}

      {recentPosts.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black text-gray-900 mb-8">
              Últimos Artigos
            </h2>
            <PostGrid posts={recentPosts} />
          </div>
        </section>
      )}
    </div>
  );
}
```

---

## Exemplo 2: Página de Categoria com Paginação (`/geopolitica-e-defesa/analise-regional?page=1`)

### Arquivo: `app/[pillarBasePath]/[categorySlug]/page.tsx`

```typescript
import {
  getPillarByBasePath,
  getCategoryBySlug,
  getPostsByCategory,
  countPostsInCategory,
} from "@/app/lib/sanity-helpers";
import { Breadcrumb } from "@/app/components/shared/Breadcrumb";
import { CategoryHeader } from "@/app/components/category/CategoryHeader";
import { PostGrid } from "@/app/components/post/PostCard";

const POSTS_PER_PAGE = 12;

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ pillarBasePath: string; categorySlug: string }>;
  searchParams?: Promise<{ page?: string }>;
}) {
  const { pillarBasePath, categorySlug } = await params;
  const { page = "1" } = (await searchParams) || {};
  const currentPage = parseInt(page, 10);

  if (!pillarBasePath || !categorySlug) notFound();

  const pillar = await getPillarByBasePath(pillarBasePath);
  if (!pillar) notFound();

  const category = await getCategoryBySlug(categorySlug);
  if (!category) notFound();

  // ⚠️ VALIDAÇÃO: Categoria pertence ao pilar?
  if (typeof category.pillar !== "string" && category.pillar._id !== pillar._id) {
    notFound();
  }

  const totalPosts = await countPostsInCategory(category._id);
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  if (currentPage < 1 || currentPage > Math.max(1, totalPages)) {
    notFound();
  }

  const offset = (currentPage - 1) * POSTS_PER_PAGE;
  const posts = await getPostsByCategory(category._id, offset, POSTS_PER_PAGE);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: pillar.title, href: `/${pillar.basePath}` },
            { label: category.title },
          ]}
        />
      </div>

      <CategoryHeader category={category} />

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length > 0 ? (
            <>
              <PostGrid posts={posts} />

              {totalPages > 1 && (
                <div className="mt-12 flex justify-center gap-4">
                  {currentPage > 1 && (
                    <a
                      href={`?page=${currentPage - 1}`}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                    >
                      ← Anterior
                    </a>
                  )}

                  <span className="px-4 py-2 text-gray-600">
                    {currentPage} / {totalPages}
                  </span>

                  {currentPage < totalPages && (
                    <a
                      href={`?page=${currentPage + 1}`}
                      className="px-4 py-2 border bg-blue-50 rounded-lg"
                    >
                      Próxima →
                    </a>
                  )}
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-600 text-center py-12">
              Nenhum artigo encontrado.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
```

---

## Exemplo 3: Página de Post Completo com Validações

### Arquivo: `app/[pillarBasePath]/[categorySlug]/[postSlug]/page.tsx`

```typescript
import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import {
  getPostComplete,
  getRelatedPosts,
  getPillarByBasePath,
} from "@/app/lib/sanity-helpers";
import {
  validatePostHierarchy,
  validatePostPublishStatus,
} from "@/app/lib/validators";
import { Breadcrumb } from "@/app/components/shared/Breadcrumb";
import { PostHeader } from "@/app/components/post/PostHeader";
import { RelatedPosts } from "@/app/components/post/RelatedPosts";
import { PortableText } from "@portabletext/react";
import { generatePostPortableTextComponents } from "@/app/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ postSlug: string }>;
}): Promise<Metadata> {
  const { postSlug } = await params;
  const post = await getPostComplete(postSlug);

  if (!post) {
    return { title: "Artigo não encontrado" };
  }

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{
    pillarBasePath: string;
    categorySlug: string;
    postSlug: string;
  }>;
}) {
  const { pillarBasePath, categorySlug, postSlug } = await params;

  // 1️⃣ Validações básicas
  if (!pillarBasePath || !categorySlug || !postSlug) notFound();

  // 2️⃣ Buscar pilar
  const pillar = await getPillarByBasePath(pillarBasePath);
  if (!pillar) notFound();

  // 3️⃣ Buscar post
  const post = await getPostComplete(postSlug);
  if (!post) notFound();

  // 4️⃣ VALIDAÇÃO CRÍTICA 1: Hierarquia
  const hierarchyValidation = validatePostHierarchy(
    post,
    pillarBasePath,
    categorySlug
  );
  if (!hierarchyValidation.isValid) {
    if (hierarchyValidation.redirectUrl) {
      redirect(hierarchyValidation.redirectUrl);
    }
    notFound();
  }

  // 5️⃣ VALIDAÇÃO CRÍTICA 2: Publicação
  const publishValidation = validatePostPublishStatus(post);
  if (!publishValidation.isValid) {
    notFound();
  }

  // 6️⃣ Buscar posts relacionados
  const relatedPosts = await getRelatedPosts(post.category._id, postSlug);

  // 7️⃣ Gerar breadcrumb
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: post.pillar.title, href: `/${post.pillar.basePath}` },
    {
      label: post.category.title,
      href: `/${post.pillar.basePath}/${post.category.slug.current}`,
    },
    { label: post.title },
  ];

  const ptComponents = generatePostPortableTextComponents();

  return (
    <article className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        <PostHeader post={post} />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <PortableText value={post.body} components={ptComponents} />
      </div>

      {post.analystView && post.analystView.length > 0 && (
        <section className="mb-16 bg-blue-50 border-l-4 border-blue-600">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">
              💡 Visão do Analista
            </h2>
            <PortableText value={post.analystView} components={ptComponents} />
          </div>
        </section>
      )}

      {relatedPosts.length > 0 && (
        <RelatedPosts
          posts={relatedPosts}
          categoryTitle={post.category.title}
        />
      )}
    </article>
  );
}
```

---

## Exemplo 4: Usar Helpers em um Componente Client (com Server Actions)

### Arquivo: `app/actions/pillarActions.ts` (Novo arquivo de ações)

```typescript
"use server";

import { getAllPillars } from "@/app/lib/sanity-helpers";

export async function getPillarsAction() {
  return await getAllPillars();
}
```

### Arquivo: `app/components/CategorySelector.tsx` (Componente Client)

```typescript
"use client";

import { useEffect, useState } from "react";
import { getPillarsAction } from "@/app/actions/pillarActions";
import type { Pillar } from "@/app/lib/types";

export function CategorySelector() {
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPillars() {
      try {
        const data = await getPillarsAction();
        setPillars(data);
      } finally {
        setLoading(false);
      }
    }

    loadPillars();
  }, []);

  return (
    <div>
      {loading ? <p>Carregando pilares...</p> : (
        <select>
          {pillars.map(pillar => (
            <option key={pillar._id} value={pillar.basePath}>
              {pillar.title}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
```

---

## Exemplo 5: Customizar Grid de Posts

### Arquivo: `app/components/CustomPostGrid.tsx`

```typescript
import { FC } from "react";
import { PostCard } from "@/app/lib/types";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/app/lib/sanity";

interface CustomPostGridProps {
  posts: PostCard[];
  columns?: 2 | 3 | 4;
}

export const CustomPostGrid: FC<CustomPostGridProps> = ({
  posts,
  columns = 3,
}) => {
  const gridClass = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  }[columns];

  return (
    <div className={`grid ${gridClass} gap-6`}>
      {posts.map((post) => {
        const href = `/${post.pillar.basePath}/${post.category.slug.current}/${post.slug.current}`;
        const imageUrl = urlFor(post.mainImage).width(400).url();

        return (
          <article
            key={post._id}
            className="group border rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <Link href={href}>
              <div className="relative h-48 bg-gray-200 overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={post.mainImage.alt || post.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform"
                />
              </div>
            </Link>

            <div className="p-4">
              <h3 className="font-bold mb-2 line-clamp-2 group-hover:text-blue-600">
                <Link href={href}>{post.title}</Link>
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {post.excerpt}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
};
```

---

## 📝 Dicas e Boas Práticas

### ✅ FAÇA

- ✅ Use `await params` em Server Components para acessar os parâmetros da rota.
- ✅ Valide a hierarquia do conteúdo (`Pilar` > `Categoria` > `Post`) antes de renderizar a página.
- ✅ Importe e utilize os tipos de dados de `@/app/lib/types.ts` para garantir consistência.
- ✅ Implemente redirecionamentos para URLs canônicas para melhorar o SEO.
- ✅ Envolva chamadas de API ou banco de dados em blocos `try-catch` para tratamento de erros.

### ❌ NÃO FAÇA

- ❌ Não importe queries GROQ diretamente nos componentes; use os `sanity-helpers`.
- ❌ Não chame `sanity-helpers` diretamente de Componentes Client; use Server Actions como intermediário.
- ❌ Não confie apenas no `slug` do post para validação; verifique toda a hierarquia.
- ❌ Não renderize conteúdo que ainda não foi publicado (verifique `publishedAt`).
- ❌ Não implemente paginação sem validar os limites para evitar erros.
