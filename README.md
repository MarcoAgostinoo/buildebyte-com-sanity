# Build&Byte - Blog de Tecnologia

Este é um projeto de blog/portal de notícias de tecnologia construído com Next.js e Sanity.io.

## Visão Geral

O projeto utiliza o Next.js para o front-end e o Sanity.io como um headless CMS para gerenciar o conteúdo. O estilo é feito com Tailwind CSS e Flowbite React.

## Começando

Para rodar o projeto localmente, siga estes passos:

1.  **Clone o repositório:**

    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd Build&Byte-front
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**

    Crie um arquivo `.env.local` na raiz do projeto e adicione as seguintes variáveis com as suas credenciais do Sanity:

    ```
    NEXT_PUBLIC_SANITY_PROJECT_ID="seu-project-id"
    NEXT_PUBLIC_SANITY_DATASET="seu-dataset"
    SANITY_API_READ_TOKEN="seu-read-token"
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

-   [Next.js](https://nextjs.org/)
-   [React](https://reactjs.org/)
-   [Tailwind CSS](https://tailwindcss.com/)
-   [Flowbite React](https://www.flowbite-react.com/)
-   [Sanity.io](https://www.sanity.io/)
-   [TypeScript](https://www.typescriptlang.org/)

## Deploy na Vercel

A maneira mais fácil de fazer o deploy do seu aplicativo Next.js é usar a [Plataforma Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) dos criadores do Next.js.

Confira nossa [documentação de deploy do Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para mais detalhes.
