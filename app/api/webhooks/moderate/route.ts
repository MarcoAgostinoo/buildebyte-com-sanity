import { NextResponse } from "next/server";

// 🔴 Configure aqui suas palavras proibidas e seu Token
const BAD_WORDS = ["spam", "golpe", "xxx", "palavrao"];
const GITHUB_TOKEN = "SEU_TOKEN_GHP_AQUI_OU_VARIAVEL_DE_AMBIENTE";

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // 1. Extrair o comentário do corpo do payload
    const commentBody = payload.comment.body;

    // 2. Verificar se o comentário contém palavras proibidas
    const hasBadWord = BAD_WORDS.some((word) =>
      commentBody.toLowerCase().includes(word)
    );

    if (hasBadWord) {
      // 3. Se contiver, deletar o comentário usando a API do GitHub
      const commentId = payload.comment.id;
      const repository = payload.repository.full_name;
      const url = `https://api.github.com/repos/${repository}/issues/comments/${commentId}`;

      await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });

      return NextResponse.json({ message: "Comentário moderado" });
    }

    return NextResponse.json({ message: "Comentário permitido" });
  } catch (error) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
// Segurança: O ideal é colocar o GITHUB_TOKEN no arquivo .env.local (process.env.GITHUB_TOKEN) e não direto no código, para não vazar se você compartilhar o código.