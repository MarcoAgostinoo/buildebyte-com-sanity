# Vetor Estratégico — Portal Brasileiro de Análise Estratégica

O Vetor Estratégico é um portal brasileiro de análise aplicada sobre tecnologia, defesa, infraestrutura crítica e economia de poder.

Não é um blog de notícias rápidas.
Não é agregador de conteúdo internacional.

É uma plataforma editorial focada em direção, magnitude e impacto sistêmico, com ênfase no que afeta o Brasil nos próximos 2–3 anos.

O projeto é construído com **Next.js** para alta performance e **Sanity.io** como gerenciador de conteúdo (Headless CMS).

## 🎯 Perfil Editorial do Projeto

O Vetor Estratégico parte de um princípio simples:

> Tecnologia deixou de ser ferramenta. Tornou-se instrumento de poder.

O portal analisa:
- Defesa e tecnologia militar
- Infraestrutura crítica (energia, semicondutores, cabos submarinos)
- Cadeias globais de produção
- Sanções e instrumentos econômicos estratégicos
- Disputa tecnológica entre Estados
- Base industrial de defesa brasileira
- Soberania tecnológica

Cada artigo segue quatro camadas analíticas:
1. Fato
2. Contexto histórico
3. Impacto sistêmico
4. Projeção futura

A abordagem é técnica, baseada em dados e orientada ao impacto no Brasil.

## 🛠 Como o Projeto Funciona

O projeto opera em uma arquitetura moderna e desacoplada (Headless):

1. **Gerenciamento de Conteúdo (Sanity.io)**
   - **Funcionamento:** Atua como o banco de dados de conteúdo (Headless CMS). O Next.js se conecta à API do Sanity para buscar artigos, autores e configurações globais.
   - **Variáveis de Ambiente:**
     - `NEXT_PUBLIC_SANITY_PROJECT_ID`: Identificador público do projeto no Sanity.
     - `NEXT_PUBLIC_SANITY_DATASET`: O conjunto de dados (dataset) onde o conteúdo reside (ex: "production").
     - `SANITY_API_READ_TOKEN`: Token de segurança que permite ao Next.js ler os dados do CMS (necessário para operações de build e leitura de dados privados).

2. **Frontend (Next.js 15+)**
   - **Funcionamento:** Utiliza o App Router para roteamento e renderização (SSR/ISR). Consome as variáveis públicas (iniciadas com `NEXT_PUBLIC_`) no cliente e as demais no servidor.
   - **Integrações:** Estilização com Tailwind CSS, componentes Flowbite React e feeds RSS para podcasts.
   - **SEO & Sitemap:** O arquivo `sitemap.ts` gera dinamicamente o mapa do site, listando páginas estáticas (como `/privacy-policy`) e buscando todos os posts publicados no Sanity para indexação automática.

3. **Sistema de Newsletter (Resend)**
   - **Funcionamento:** A rota de API `/api/admin/send-blast` gerencia o envio em massa. Ela busca o conteúdo da newsletter no Sanity, filtra os leads com status "active" e utiliza o SDK do Resend para disparar e-mails em lotes (batch), respeitando limites de envio.
   - **Variáveis de Ambiente:**
     - `RESEND_API_KEY`: Chave privada (API Key) gerada no painel do Resend para autorizar o envio de e-mails.

4. **Segurança e Automação (Cron Jobs)**
   - **Funcionamento:** Rotas administrativas sensíveis são protegidas via Bearer Token. O sistema verifica se o header `Authorization` corresponde ao segredo definido no servidor.
   - **Variáveis de Ambiente:**
     - `MY_CRON_SECRET`: Uma senha forte definida por você. Deve ser enviada no cabeçalho de autorização ou como parâmetro ao chamar rotas administrativas (Cron Jobs).

## 🚀 Começando

Para rodar o projeto localmente, siga estes passos:

1. **Clone o repositório**
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd Vetor-Estrategico-front
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**

   Crie um arquivo `.env.local` na raiz do projeto e adicione as seguintes variáveis:

   ```env
   # --- Sanity (CMS) ---
   NEXT_PUBLIC_SANITY_PROJECT_ID="seu-project-id"
   NEXT_PUBLIC_SANITY_DATASET="production"
   SANITY_API_READ_TOKEN="seu-read-token"

   # --- Resend (E-mails) ---
   RESEND_API_KEY="sua-api-key-do-resend"

   # --- Segurança (API Routes & Cron Jobs) ---
   MY_CRON_SECRET="crie-uma-senha-forte-para-proteger-rotas-admin"
   ```

4. **Rode o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

   Abra: http://localhost:3000

## 🧱 Estrutura do Projeto

- `app/` — Rotas, páginas e layouts (App Router)
- `app/lib/sanity.ts` — Configuração do cliente Sanity
- `app/components/` — Componentes React reutilizáveis
- `public/` — Arquivos estáticos
- `sanity/` — (Opcional) Configuração do Sanity Studio

## 🧭 Estrutura Editorial do Portal

Seções principais:
- Defesa
- Infraestrutura
- Economia de Poder
- Brasil Estratégico
- Tecnologia & Soberania
- Cenário Global
- Relatórios Estratégicos

O foco não é volume de notícias, mas profundidade analítica.

## 🧠 Público-Alvo

- Profissionais de tecnologia
- Analistas de mercado
- Estudantes de Relações Internacionais
- Entusiastas de defesa
- Empreendedores atentos à macroeconomia
- Leitores que buscam contexto, não manchetes

## ⚙ Tecnologias Utilizadas

- **Core:** Next.js, React, TypeScript
- **Estilo:** Tailwind CSS, Flowbite React
- **Dados & CMS:** Sanity.io, Next-Sanity, @portabletext/react
- **E-mail & Marketing:** Resend
- **Acessibilidade:** axe-core
- **Utilitários:** RSS Parser, Embla Carousel

## 🚀 Deploy na Vercel

A maneira mais simples de fazer o deploy do aplicativo Next.js é utilizando a plataforma Vercel.

Consulte a documentação oficial do Next.js para detalhes sobre build, SSR, ISR e configuração de ambiente em produção.

## 📌 Visão do Projeto

O Vetor Estratégico busca se consolidar como:

- Referência brasileira em análise estratégica aplicada à tecnologia
- Plataforma de relatórios técnicos aprofundados
- Fonte consultiva para profissionais e estudantes
- Núcleo de debate técnico sério sobre poder, infraestrutura e soberania

**Tecnologia. Poder. Direção.**
