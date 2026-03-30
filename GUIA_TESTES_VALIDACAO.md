# 🧪 GUIA DE TESTES E VALIDAÇÃO

## ✅ Antes de Começar

- [ ] O código-fonte foi atualizado para a nova arquitetura.
- [ ] O TypeScript compila sem erros (`npm run build`).
- [ ] A configuração do Sanity (`.env.local`) está correta com `PROJECT_ID` e `DATASET`.

---

## 🔍 Testes Manuais

### Teste 1: Verificar Tipos TypeScript

```bash
# Terminal
npm run build

# Esperado: ✅ Build bem-sucedido, sem erros de tipo.
# Se houver erro: Verifique as interfaces em app/lib/types.ts e as queries que as populam.
```

### Teste 2: Verificar Rotas Dinâmicas

```bash
npm run dev

# 1. Acesse a página de um pilar:
#    URL: http://localhost:3000/geopolitica-e-defesa
#    Esperado: Renderiza o cabeçalho do pilar, a lista de categorias e os posts recentes.

# 2. Acesse a página de uma categoria:
#    URL: http://localhost:3000/geopolitica-e-defesa/analise-regional
#    Esperado: Renderiza o cabeçalho da categoria, um grid de posts e a paginação.

# 3. Acesse a página de um post:
#    URL: http://localhost:3000/geopolitica-e-defesa/analise-regional/conflito-no-mar-vermelho
#    Esperado: Renderiza o artigo completo, com breadcrumb, cabeçalho e posts relacionados.
```

### Teste 3: Verificar Validações e Redirecionamentos

```bash
# Teste de Redirecionamento (URL com pilar errado):
#    Acesse: http://localhost:3000/arsenal-e-tecnologia/analise-regional/conflito-no-mar-vermelho
#    Se o post pertence a "geopolitica-e-defesa", deve redirecionar para a URL correta.
#    Esperado: Redirecionamento 307 para /geopolitica-e-defesa/analise-regional/conflito-no-mar-vermelho

# Teste de Conteúdo Não Publicado:
#    No Sanity, altere a data de publicação de um post para uma data no futuro.
#    Acesse a URL desse post.
#    Esperado: Página de 404 (Not Found).

# Teste de Conteúdo Inexistente:
#    Acesse: http://localhost:3000/geopolitica-e-defesa/categoria-inexistente
#    Esperado: Página de 404 (Not Found).
```

### Teste 4: Verificar SEO

```bash
# Acesse a página de um artigo, como no Teste 2.3.

# 1. Abra as Ferramentas de Desenvolvedor (F12).
# 2. Vá para a aba "Elements" (ou "Inspetor").
# 3. Verifique o conteúdo da tag <head>:

# ✅ <title>Deve ser o seoTitle ou o título do post.</title>
# ✅ <meta name="description" content="...">
# ✅ <meta property="og:title" content="...">
# ✅ <meta property="og:description" content="...">
# ✅ <meta property="og:image" content="...">
# ✅ <meta property="og:type" content="article">
```

### Teste 5: Verificar Paginação

```bash
# Acesse uma página de categoria com vários posts:
# URL: http://localhost:3000/geopolitica-e-defesa/analise-regional?page=1

# ✅ Deve renderizar o número correto de posts por página (padrão 12).
# ✅ Deve exibir o contador "Página 1 / X".
# ✅ O botão "Próxima" deve aparecer se houver mais páginas.

# Acesse uma página fora do limite:
# URL: http://localhost:3000/geopolitica-e-defesa/analise-regional?page=999
# Esperado: Página de 404 (Not Found).
```

### Teste 6: Verificar Console de Erros

```bash
# Com o site aberto, verifique o console do navegador e o terminal onde `npm run dev` está rodando.

# ✅ Não deve haver avisos sobre "missing keys" em loops.
# ✅ Não deve haver avisos de "hydration mismatch".
# ✅ Não deve haver erros de JavaScript.
```

---

## 🔧 Testes de Unidade (Recomendado)

Crie testes para as funções de validação para garantir que a lógica de negócio permaneça intacta.

```typescript
// __tests__/lib/validators.test.ts

import { validatePostHierarchy, validatePostPublishStatus } from "@/app/lib/validators";
import type { Post } from "@/app/lib/types";

describe("Validators", () => {
  const mockPost: Post = {
    _id: "post-1",
    title: "Test Post",
    slug: { current: "test-post" },
    body: [{ _type: "block", children: [] }],
    author: { _id: "author-1", name: "John Doe" },
    pillar: {
      _id: "pillar-1",
      title: "Geopolítica & Defesa",
      basePath: "geopolitica-e-defesa",
      slug: { current: "geopolitica-e-defesa" },
    },
    category: {
      _id: "category-1",
      title: "Análise Regional",
      slug: { current: "analise-regional" },
      pillar: { _id: "pillar-1", _type: "reference" },
    },
    mainImage: {
      _type: "image",
      asset: { _ref: "image-1", url: "https://..." },
      alt: "Test Image",
    },
    publishedAt: new Date().toISOString(),
  };

  test("Deve validar uma hierarquia correta", () => {
    const result = validatePostHierarchy(
      mockPost,
      "geopolitica-e-defesa",
      "analise-regional"
    );
    expect(result.isValid).toBe(true);
  });

  test("Deve rejeitar um pilar incorreto e sugerir redirecionamento", () => {
    const result = validatePostHierarchy(
      mockPost,
      "carreiras-estrategicas",  // Pilar incorreto!
      "analise-regional"
    );
    expect(result.isValid).toBe(false);
    expect(result.redirectUrl).toBeDefined();
    expect(result.redirectUrl).toBe("/geopolitica-e-defesa/analise-regional/test-post");
  });

  test("Deve aceitar um post publicado", () => {
    const result = validatePostPublishStatus(mockPost);
    expect(result.isValid).toBe(true);
  });

  test("Deve rejeitar um post não publicado (data futura)", () => {
    const futurePost = {
      ...mockPost,
      publishedAt: new Date(Date.now() + 86400000).toISOString(), // Amanhã
    };
    const result = validatePostPublishStatus(futurePost);
    expect(result.isValid).toBe(false);
  });
});
```

---

## 📊 Checklist de Verificação Final

### Funcionalidades Verificadas

| Funcionalidade | Status | Teste Relacionado |
|---|:---:|---|
| Compilação sem Erros | [ ] | `npm run build` |
| Rota de Pilar | [ ] | Teste 2.1 |
| Rota de Categoria | [ ] | Teste 2.2 |
| Rota de Post | [ ] | Teste 2.3 |
| Redirecionamento de URL | [ ] | Teste 3 |
| Validação de Publicação | [ ] | Teste 3 |
| Validação de 404 | [ ] | Teste 3 |
| Metadados de SEO | [ ] | Teste 4 |
| Paginação | [ ] | Teste 5 |
| Ausência de Erros no Console | [ ] | Teste 6 |

### Documentação Atualizada

- [x] `ARQUITETURA_SISTEMA.md` - Diagramas e fluxos atualizados.
- [x] `GUIA_RAPIDO_USO.md` - Exemplos de código corrigidos.
- [x] `EXEMPLOS_PRATICOS.md` - Exemplos de página completa corrigidos.

---

## 🆘 Troubleshooting

### Problema: "404 quando o post deveria existir"

**Solução:**
1.  **Verifique a data de publicação:** `validatePostPublishStatus` retornará `false` se `publishedAt` estiver no futuro.
2.  **Verifique a hierarquia:** Adicione `console.log` em `validatePostHierarchy` para ver se o pilar ou a categoria da URL correspondem aos dados do post.
3.  **Verifique o slug:** Confirme se o slug na URL é exatamente o mesmo que está no Sanity.

### Problema: "Imagens não carregam"

**Solução:**
1.  **Verifique `next.config.ts`:** Certifique-se de que o hostname `cdn.sanity.io` está nos `remotePatterns` da configuração de imagens.
2.  **Verifique a URL da imagem:** Use `console.log(urlFor(post.mainImage).url())` para ver a URL gerada. Ela deve começar com `https://cdn.sanity.io/...`.
3.  **Verifique o asset no Sanity:** Confirme se a imagem foi de fato carregada no CMS.

---

## ✨ Critérios de Sucesso

- ✅ Todas as rotas dinâmicas funcionam conforme o esperado.
- ✅ As validações de hierarquia e publicação estão ativas e corretas.
- ✅ O SEO (metadados) é gerado dinamicamente para cada página.
- ✅ Não há erros no console do navegador ou no terminal do servidor.
- ✅ O build (`npm run build`) é concluído com sucesso.

**Se todos os itens do checklist passarem, a validação está completa! 🚀**
