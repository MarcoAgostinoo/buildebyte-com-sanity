# Vetor Estratégico - Portal de Notícias de Tecnologia

Este é um projeto de blog e portal de notícias de tecnologia focado em análises técnicas, hardware e estratégia digital. O sistema é construído com **Next.js** para alta performance e **Sanity.io** como gerenciador de conteúdo.

## 🛠 Como o Projeto Funciona

O projeto opera em uma arquitetura moderna e desacoplada (Headless):

1.  **Gerenciamento de Conteúdo (Sanity.io):**
    -   **Funcionamento:** Atua como o banco de dados de conteúdo (Headless CMS). O Next.js se conecta à API do Sanity para buscar artigos, autores e configurações globais.
    -   **Variáveis de Ambiente:**
        -   `NEXT_PUBLIC_SANITY_PROJECT_ID`: Identificador público do projeto no Sanity.
        -   `NEXT_PUBLIC_SANITY_DATASET`: O conjunto de dados (dataset) onde o conteúdo reside (ex: "production").
        -   `SANITY_API_READ_TOKEN`: Token de segurança que permite ao Next.js ler os dados do CMS (necessário para operações de build e leitura de dados privados).

2.  **Frontend (Next.js 15+):**
    -   **Funcionamento:** Utiliza o **App Router** para roteamento e renderização (SSR/ISR). Consome as variáveis públicas (iniciadas com `NEXT_PUBLIC_`) no cliente e as demais no servidor.
    -   **Integrações:** Estilização com Tailwind CSS, componentes Flowbite React e feeds RSS para podcasts.

3.  **Sistema de Newsletter (Resend):**
    -   **Funcionamento:** O Resend é o provedor de e-mail transacional. Quando uma newsletter é disparada (rota `/api/admin/send-blast`), o sistema usa a chave de API para autenticar o envio.
    -   **Variáveis de Ambiente:**
        -   `RESEND_API_KEY`: Chave privada (API Key) gerada no painel do Resend para autorizar o envio de e-mails.

4.  **Segurança e Automação (Cron Jobs):**
    -   **Funcionamento:** Rotas administrativas sensíveis (como disparo de e-mails em massa) são protegidas para evitar execução pública não autorizada.
    -   **Variáveis de Ambiente:**
        -   `MY_CRON_SECRET`: Uma senha forte definida por você. Deve ser enviada no cabeçalho de autorização ou como parâmetro ao chamar rotas administrativas (Cron Jobs).

## 🚀 Começando

Para rodar o projeto localmente, siga estes passos:

1.  **Clone o repositório:**

    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd Vetor Estratégico-front
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**

    Crie um arquivo `.env.local` na raiz do projeto e adicione as seguintes variáveis. É essencial preencher todas para o funcionamento correto do CMS e do sistema de e-mails.

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

4.  **Rode o servidor de desenvolvimento:**

    ```bash
    npm run dev
    ```

    Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

## Estrutura do Projeto

-   `app/`: Contém todas as rotas, páginas e layouts (App Router).
-   `app/lib/sanity.ts`: Configuração do cliente Sanity.
-   `app/components/`: Componentes React reutilizáveis.
-   `public/`: Arquivos estáticos.
-   `sanity/`: (Se você tiver o Sanity Studio no mesmo projeto) a configuração do Sanity Studio.

## Tecnologias Utilizadas

-   **Core:** [Next.js](https://nextjs.org/), [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/)
-   **Estilo:** [Tailwind CSS](https://tailwindcss.com/), [Flowbite React](https://www.flowbite-react.com/)
-   **Dados & CMS:** [Sanity.io](https://www.sanity.io/), [Next-Sanity](https://github.com/sanity-io/next-sanity)
-   **E-mail & Marketing:** [Resend](https://resend.com/)
-   **Utilitários:** [RSS Parser](https://www.npmjs.com/package/rss-parser) (para Podcasts), [Embla Carousel](https://www.embla-carousel.com/)

## Deploy na Vercel

A maneira mais fácil de fazer o deploy do seu aplicativo Next.js é usar a [Plataforma Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) dos criadores do Next.js.

Confira nossa [documentação de deploy do Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para mais detalhes.
