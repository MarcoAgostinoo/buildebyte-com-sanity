# 🎯 GUIA RÁPIDO DE USO - Rotas Hierárquicas

## 📦 O Que Foi Implementado

✅ **Tipos TypeScript** - Tipagem forte para Pillar, Category, Post  
✅ **Queries GROQ** - Queries otimizadas em arquivos separados  
✅ **Helpers Sanity** - Funções wrapper com tipagem forte  
✅ **Componentes Reutilizáveis** - Breadcrumb, PostHeader, PostCard, RelatedPosts  
✅ **Rotas Dinâmicas** - Pillar → Category → Post  
✅ **Validações** - Hierarquia, publicação, data  
✅ **SEO Completo** - Metadados dinâmicos, OG tags, JSON-LD  
✅ **Paginação** - Grid de posts com navegação  
✅ **Redirecionamento** - URLs erradas → URL correta  

---

## 🚀 Como Usar

### 1. Importar Tipos

```typescript
import type {
  Pillar,
  Category,
  Post,
  PostCard,
  Author,
} from "@/app/lib";
```

### 2. Usar Helpers Sanity

```typescript
// Buscar pilar por basePath
const pillar = await getPillarByBasePath("geopolitica-e-defesa");

// Buscar categorias de um pilar
const categories = await getCategoriesByPillar(pillar._id);

// Buscar posts de uma categoria (com paginação)
const posts = await getPostsByCategory(category._id, offset, limit);

// Buscar post único (completo)
const post = await getPostComplete("conflito-no-mar-vermelho");

// Buscar posts relacionados
const related = await getRelatedPosts(category._id, postSlug);
```

### 3. Usar Componentes

```tsx
import { Breadcrumb } from "@/app/components/shared/Breadcrumb";
import { PostCard, PostGrid } from "@/app/components/post/PostCard";
import { RelatedPosts } from "@/app/components/post/RelatedPosts";
import { CategoryHeader } from "@/app/components/category/CategoryHeader";
import { PillarHeader } from "@/app/components/pillar/PillarHeader";

// Exemplo em Page Component
export default async function CategoryPage() {
  const category = await getCategoryBySlug("analise-regional");
  const posts = await getPostsByCategory(category._id, 0, 12);

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: category.pillar.title, href: `/${category.pillar.basePath}` },
          { label: category.title },
        ]}
      />
      <CategoryHeader category={category} />
      <PostGrid posts={posts} />
    </>
  );
}
```

### 4. Validações

```typescript
import {
  validatePostHierarchy,
  validatePostPublishStatus,
} from "@/app/lib";

// Validar que post pertence ao pilar/categoria
const validation = validatePostHierarchy(
  post,
  params.pillarBasePath,
  params.categorySlug
);

if (!validation.isValid) {
  if (validation.redirectUrl) {
    redirect(validation.redirectUrl);
  }
  notFound();
}

// Validar publicação
const published = validatePostPublishStatus(post);
if (!published.isValid) {
  notFound();
}
```

### 5. SEO Metadados

```typescript
import { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
  { params }: PostPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const post = await getPostComplete(postSlug);

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: imageUrl, width: 1200, height: 630 }],
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
    },
  };
}
```

---

## 📁 Estrutura de Arquivos Relevantes

```
app/
├── lib/
│   ├── types.ts                      ← Tipos TypeScript
│   ├── sanity-helpers.ts             ← Helpers com tipagem
│   ├── validators.ts                 ← Validações
│   ├── queries/
│   │   ├── pillar.ts                 ← Queries GROQ
│   │   ├── category.ts
│   │   └── post.ts
│   └── index.ts                      ← Exports centralizados
│
├── components/
│   ├── shared/
│   │   └── Breadcrumb.tsx
│   ├── post/
│   │   ├── PostHeader.tsx
│   │   ├── PostCard.tsx
│   │   └── ...
│   └── ...
│
├── [pillarBasePath]/
│   ├── page.tsx                      ← Página Pilar
│   ├── layout.tsx
│   ├── [categorySlug]/
│   │   ├── page.tsx                  ← Página Categoria
│   │   └── [postSlug]/
│   │       └── page.tsx              ← Página Post
│
└── ARQUITETURA_SISTEMA.md            ← Documentação principal da arquitetura
```

---

## 🔄 URLs e Rotas

### URLs Esperadas

```
/                                      # Homepage
/geopolitica-e-defesa                  # Página Pilar
/geopolitica-e-defesa/analise-regional # Página Categoria
/geopolitica-e-defesa/analise-regional/conflito-no-mar-vermelho  # Página Post

/carreiras-estrategicas                # Outro Pilar
/carreiras-estrategicas/concursos-militares # Categoria do Pilar
/carreiras-estrategicas/concursos-militares/edital-2026 # Post
```

### Redirecionamentos Automáticos

```
# URL com pilar errado para uma categoria válida
GET /arsenal-e-tecnologia/analise-regional/conflito-no-mar-vermelho
→ HTTP 307 Redirect
→ GET /geopolitica-e-defesa/analise-regional/conflito-no-mar-vermelho
```

---

## ⚠️ Validações Automáticas (404)

- ❌ Pilar não existe
- ❌ Categoria não existe
- ❌ Post não existe
- ❌ Post ainda não foi publicado
- ❌ Categoria não pertence ao pilar
- ❌ Post não pertence à categoria
- ❌ Post sem autor
- ❌ Post sem conteúdo

---

## 🔍 Debugging

### Ver Queries Executadas

Adicione em `sanity-helpers.ts`:

```typescript
console.log(`[Sanity] Executando query:`, query, { params });
```

### Validar Dados no Sanity

Acesse: `https://sanity.io/desk` → e navegue até seu conteúdo.

### Ver Erros de Validação

Verifique o `console` do navegador e os `logs do servidor` do Next.js.

---

## 🎨 Personalização

### Customizar Limites de Paginação

```typescript
// Em [categorySlug]/page.tsx
export const POSTS_PER_PAGE = 24; // Alterar limite padrão de 12
```

### Customizar Componentes

Todos os componentes em `app/components/` podem ser customizados.

```typescript
// PostCard.tsx
export const PostCard: FC<PostCardProps> = ({ post }) => {
  // Adicionar seus estilos/lógica aqui
};
```

---

## 📞 Suporte

Para dúvidas sobre a implementação:

1. Verifique: `ARQUITETURA_SISTEMA.md`
2. Verifique a tipagem em `app/lib/types.ts`
3. Verifique as queries em `app/lib/queries/`
4. Verifique a estrutura de rotas em `app/[pillarBasePath]/`
