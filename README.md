# Vetor Estratégico — Portal Brasileiro de Defesa Moderna

O Vetor Estratégico é um portal brasileiro de análise de defesa, tecnologia militar e impacto estratégico no Brasil.

Não somos portal de tecnologia ampla.
Não somos blog de TI.
Não somos replicador de manchetes.

Somos análise aplicada da guerra moderna, da infraestrutura crítica e da economia de poder — sempre sob a lente brasileira.

O projeto é construído com **Next.js** para alta performance e **Sanity.io** como gerenciador de conteúdo (Headless CMS).

## 🎯 Perfil Editorial do Projeto

O Vetor Estratégico parte de um princípio simples:

> A guerra moderna não começa com tiros. Começa com chips, drones, satélites, cabos submarinos e cadeias industriais.

Os pilares editoriais do portal:

1. **Defesa & Tecnologia Militar**
   - Drones, mísseis, caças, guerra eletrônica, sistemas antiaéreos
   - Pergunta central: Isso altera capacidade operacional real ou é narrativa?

2. **Infraestrutura Crítica & Soberania**
   - Semicondutores, satélites, cabos submarinos, energia, logística
   - Conexão obrigatória à defesa: semicondutor não é apenas indústria, é autonomia militar

3. **Economia de Poder**
   - Sanções, cadeias globais, política industrial, corridas armamentistas
   - Pergunta: Isso é comércio ou coerção estratégica?

4. **Brasil Estratégico**
   - Base industrial de defesa, dependência tecnológica, posicionamento geopolítico
   - O Brasil depende dessa tecnologia? Nossa base industrial é suficiente? Qual o impacto cambial?

Cada análise cruza **pelo menos dois pilares** e responde:
- Isso altera capacidade real?
- Quem ganha vantagem estrutural?
- O que isso significa para o Brasil?

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

**Slogan Oficial:** Tecnologia. Defesa. Direção.

Seções principais:
- **Defesa & Tecnologia** — Capacidade militar real
- **Infraestrutura & Soberania** — Infraestrutura invisível como instrumento de poder
- **Economia de Poder** — Sanções, BRICS, logística, política industrial
- **Brasil Estratégico** — Posicionamento geopolítico, base industrial, impacto cambial
- **Análise Aplicada** — Impacto nos próximos 2–3 anos com cenários futuros

O foco não é volume de notícias, mas profundidade analítica e impacto estratégico real.

## 🧠 Público-Alvo

**Núcleo Principal:**
- Homens 18–45 anos
- Entusiastas de defesa
- Concurseiros militares
- Interessados em geopolítica
- Público que consome YouTube militar

**Núcleo Técnico:**
- Profissionais de tecnologia
- Engenheiros
- Analistas de Relações Internacionais
- Estudantes de defesa

**Perfil Psicológico:**
- Alta curiosidade
- Busca clareza sem sensacionalismo
- Quer entender o "como funciona"
- Desconfia de manchetes infladas

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

## 📌 Visão e Missão do Projeto

O Vetor Estratégico busca se consolidar como:

- **Referência brasileira** em análise de defesa e impacto geoestratégico
- **Portal técnico aprofundado** sobre tecnologia militar e infraestrutura crítica
- **Fonte consultiva** para profissionais, estudantes e formuladores de política
- **Núcleo sério** de debate sobre poder, soberania e direção estratégica

**Diferencial:**
- Outros portais narram eventos. O Vetor explica sistemas.
- Outros discutem política. O Vetor mede capacidade real.
- Outros geram alarme. O Vetor mede direção.

**Missão Final:** Traduzir a guerra moderna e a infraestrutura de poder para o público brasileiro, com clareza, profundidade e responsabilidade. Sem ruído. Sem exagero. Com direção.

**Slogan:** Tecnologia. Defesa. Direção.
