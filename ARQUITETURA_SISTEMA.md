# 🏗️ ARQUITETURA DO SISTEMA

## Fluxo de Dados

```
┌─────────────────────────────────────────────────────────────────┐
│                     BROWSER REQUEST                             │
│          GET /geopolitica-e-defesa/analise-regional             │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              NEXT.JS App Router (Page Component)                │
│  [pillarBasePath]/[categorySlug]/page.tsx                       │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                ┌──────────┴──────────┐
                ▼                     ▼
    ┌─────────────────────┐   ┌──────────────────────┐
    │  Extract Params     │   │  Validate Params     │
    │ pillarBasePath:     │   │  - Not empty?        │
    │ "geopolitica-e-defesa"│   │  - notFound()        │
    │                     │   │                      │
    │ categorySlug:       │   │                      │
    │ "analise-regional"  │   │                      │
    └──────────┬──────────┘   └──────────────────────┘
               │                     │
               │_____________________│
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│              SANITY HELPERS (Type-Safe Functions)               │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 1. getPillarByBasePath("geopolitica-e-defesa")           │  │
│  │    └─> QUERY_PILLAR_BY_BASEPATH                         │  │
│  │        └─> { _id, title, slug, basePath, ... }          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 2. getCategoryBySlug("analise-regional")                 │  │
│  │    └─> QUERY_CATEGORY_BY_SLUG                           │  │
│  │        └─> { _id, title, slug, pillar, ... }            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 3. getPostsByCategory(categoryId, 0, 12)                │  │
│  │    └─> QUERY_POSTS_BY_CATEGORY (com offset/limit)       │  │
│  │        └─> [{_id, title, slug, excerpt, ...}, ...]      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 4. countPostsInCategory(categoryId)                      │  │
│  │    └─> QUERY_COUNT_POSTS_IN_CATEGORY                    │  │
│  │        └─> number                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────┬──────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                   VALIDAÇÕES CRÍTICAS                           │
│                                                                  │
│  ✅ Pilar existe?                                              │
│  ✅ Categoria existe?                                          │
│  ✅ Categoria pertence ao pilar?                              │
│  ✅ Página <= totalPages?                                     │
│  ✅ Todos os dados necessários?                               │
└─────────────────────────┬──────────────────────────────────────┘
                          │
                          ├─ Se inválido → ❌ notFound() (404)
                          │
                          ├─ Se válido → ✅ Continue
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│            GERAÇÃO DE METADADOS (generateMetadata)              │
│                                                                  │
│  title: category.title                                         │
│  description: category.description                             │
│  openGraph: { title, description, type: "website" }           │
│  robots: { index: true, follow: true }                        │
└─────────────────────────┬──────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                  RENDERIZAR PÁGINA                              │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ <div>                                                    │  │
│  │   <Breadcrumb items=[...] />                             │  │
│  │   <CategoryHeader category={category} />                │  │
│  │   <PostGrid posts={posts} />                             │  │
│  │   <Paginacao page={page} totalPages={totalPages} />     │  │
│  │ </div>                                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────┬──────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                  RESPOSTA HTTP (200 OK)                         │
│              HTML completo com metadados                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Fluxo de POST Page (Artigo Completo)

```
GET /geopolitica-e-defesa/analise-regional/conflito-no-mar-vermelho
│
├─ Extract params: { pillarBasePath: "geopolitica-e-defesa", categorySlug: "analise-regional", postSlug: "conflito-no-mar-vermelho" }
│
├─ getPillarByBasePath("geopolitica-e-defesa") → Pillar
│  ├─ if null → notFound()
│  └─ if exists → continue
│
├─ getPostComplete("conflito-no-mar-vermelho") → Post
│  ├─ if null → notFound()
│  └─ if exists → continue
│
├─ VALIDAÇÕES CRÍTICAS
│  ├─ post.pillar.basePath === "geopolitica-e-defesa" ?
│  │  ├─ false → redirect(`/${post.pillar.basePath}/...`)
│  │  └─ true → continue
│  │
│  ├─ post.category.slug === "analise-regional" ?
│  │  ├─ false → redirect(`/${post.pillar.basePath}/${post.category.slug}/...`)
│  │  └─ true → continue
│  │
│  ├─ post.category.pillar._id === post.pillar._id ?
│  │  ├─ false → notFound() (dados inconsistentes!)
│  │  └─ true → continue
│  │
│  ├─ publishedAt <= now() ?
│  │  ├─ false → notFound() (ainda não publicado)
│  │  └─ true → continue
│  │
│  └─ post.author && post.body && post.body.length > 0 ?
│     ├─ false → notFound()
│     └─ true → continue
│
├─ getRelatedPosts(category._id, postSlug) → PostCard[]
│
├─ generateMetadata(post) → Metadata
│  ├─ <title>
│  ├─ <meta name="description">
│  ├─ <meta property="og:*">
│  ├─ <meta name="twitter:*">
│  └─ ... etc
│
└─ Renderizar
   ├─ <Breadcrumb>
   ├─ <PostHeader> (com metadados)
   ├─ <img mainImage>
   ├─ <PortableText body>
   ├─ <AnalystView>
   └─ <RelatedPosts>
```

---

## Estrutura de Pastas em Detalhes

```
app/
│
├── lib/                              ← Lógica reutilizável
│   ├── types.ts                      ← Tipos TypeScript
│   │   ├── Pillar {}
│   │   ├── Category {}
│   │   ├── Post {}
│   │   ├── PostCard {}
│   │   ├── Author {}
│   │   ├── SanityImage {}
│   │   └── ValidationTypes {}
│   │
│   ├── queries/                      ← GROQ puro
│   │   ├── pillar.ts
│   │   ├── category.ts
│   │   └── post.ts
│   │
│   ├── sanity-helpers.ts             ← Wrappers com tipo e cache
│   │   ├── getPillarByBasePath()
│   │   ├── getCategoryBySlug()
│   │   ├── getPostsByCategory()
│   │   ├── getPostComplete()
│   │   └── ... etc
│   │
│   ├── validators.ts                 ← Lógica de validação de hierarquia e status
│   │
│   ├── utils.ts                      ← Helpers diversos
│   │
│   ├── sanity.ts                     ← Client Sanity
│   └── index.ts                      ← Export central
│
├── components/
│   ├── shared/
│   │   └── Breadcrumb.tsx
│   ├── post/
│   │   ├── PostHeader.tsx
│   │   ├── PostCard.tsx
│   │   └── ...
│   ├── category/
│   │   └── CategoryHeader.tsx
│   └── pillar/
│       └── PillarHeader.tsx
│
├── [pillarBasePath]/                 ← ROTA DINÂMICA DE PILAR
│   │
│   ├── page.tsx                      ← Ex: /geopolitica-e-defesa
│   │
│   ├── [categorySlug]/               ← ROTA DINÂMICA DE CATEGORIA
│   │   │
│   │   ├── page.tsx                  ← Ex: /geopolitica-e-defesa/analise-regional
│   │   │
│   │   └── [postSlug]/               ← ROTA DINÂMICA DE POST
│   │       │
│   │       └── page.tsx              ← Ex: /geopolitica-e-defesa/analise-regional/artigo
│   │
│   └── layout.tsx                    ← Layout compartilhado
│
├── page.tsx                          ← Homepage
├── layout.tsx                        ← Root layout
└── ...rotas estáticas (contato, etc)
```

---

## Comparação: Antes vs Depois

### ❌ ANTES (Estrutura Plana)

```typescript
// app/artigo/[slug]/page.tsx
async function getPost(slug: string) {
  const query = `*[_type == "post" && slug.current == $slug][0]`;
  return await client.fetch(query, { slug });
}

export default async function ArticlePage({ params }) {
  const post = await getPost(params.slug);
  // URL: /artigo/meu-post
  // 脆弱性: Não há contexto de pilar ou categoria na URL.
  // SEO: Menos eficaz, sem hierarquia clara.
  // Validação: Manual e propensa a erros.
}
```

### ✅ DEPOIS (Estrutura Hierárquica)

```typescript
// app/[pillarBasePath]/[categorySlug]/[postSlug]/page.tsx
export async function generateMetadata({ params }) {
  const post = await getPostComplete(params.postSlug);
  // Gera metadados ricos com base no post
  return { title: post.seoTitle, ... };
}

export default async function PostPage({ params }) {
  // URL: /geopolitica-e-defesa/analise-regional/meu-post
  const { pillarBasePath, categorySlug, postSlug } = params;

  // Validação de hierarquia acontece aqui
  const validationResult = await validatePostHierarchy(params);
  if (!validationResult.isValid) {
    if (validationResult.redirectUrl) redirect(validationResult.redirectUrl);
    notFound();
  }
  
  const post = validationResult.post; // Post já vem da validação
  const related = await getRelatedPosts(post.category._id, postSlug);
  
  return (
    // Renderiza a página com dados validados
    <PostTemplate post={post} related={related} />
  );
}
```

**Benefícios da Nova Arquitetura:**
- ✅ **URLs Semânticas:** As URLs agora descrevem o conteúdo e sua posição na hierarquia do site.
- ✅ **SEO Otimizado:** A estrutura hierárquica é facilmente compreendida por mecanismos de busca, melhorando o ranking.
- ✅ **Validação Robusta:** O sistema valida automaticamente se um post pertence à categoria e ao pilar corretos, redirecionando ou mostrando um 404 se a URL for inconsistente.
- ✅ **Manutenção Simplificada:** Componentes e lógicas são organizados de forma clara, facilitando futuras manutenções e adições de conteúdo.
- ✅ **Tipagem Forte:** O uso de TypeScript garante que os dados que fluem do CMS para os componentes sejam sempre consistentes.
