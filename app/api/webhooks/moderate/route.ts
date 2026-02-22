import { NextResponse } from "next/server";
import crypto from "crypto";

// LÓGICA MELHORADA: Palavras base sem acento. 
// O código vai remover os acentos do comentário antes de analisar.
const BAD_WORDS = [
    // Spam e Golpes
    'spam', 'golpe', 'golpista', 'fraude', 'piramide', 
    'crypto', 'bitcoin', 'ethereum', 'forex', 'trader',
    'hacker',
    // Ofensas
    'vacilao', 'vacilaum', 'safado', 'safada', 'pilantra', 'picareta', 'ladrao', 
    'bandido', 'impostor', 'mentiroso', 'burro', 'anta', 'animal', 'jumento',
    'idiota', 'imbecil', 'trouxa', 'otario', 'babaca', 'lixo', 'inutil', 
    'retardado', 'doente', 'escroto', 'nojento', 'arrombado', 'corno', 'chifrudo',
    'vagabundo', 'incompetente',
    // Baixo calao
    'merda', 'bosta', 'caguei', 'caralho', 'krl', 'porra', 'pqp',
    'foda', 'foder', 'fuder', 'fodido', 'fudido', 'fodase', 'vsf', 'cacete', 'k7',
    'cu', 'anus', 'anal', 'rabo', 'puta', 'prostituta', 'quenga', 'piranha', 'vadia',
    'pau', 'pinto', 'rola', 'piroca', 'caceta', 'vara', 'jeba',
    'buceta', 'boceta', 'xoxota', 'perereca', 'aranha',
    'chupa', 'chupar', 'mamada', 'boquete', 'siririca',
    'gozar', 'gozo', 'leite', 'esperma', 'tetas', 'peitos', 'bico',
    'fdp', 'vtmnc', 'vtnc', 'tmnc'
];

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET;

export async function POST(request: Request) {
  console.log("📥 Webhook recebido! Iniciando processamento...");

  // 1. VERIFICAÇÃO DE AMBIENTE
  if (!GITHUB_TOKEN || !WEBHOOK_SECRET) {
    console.error("❌ ERRO FATAL: Variáveis de ambiente ausentes.");
    return NextResponse.json({ error: "Configuração incompleta" }, { status: 500 });
  }

  try {
    // 2. VALIDAÇÃO DE SEGURANÇA (Assinatura do Webhook)
    // Precisamos do texto "cru" (raw) da requisição para calcular o hash corretamente
    const rawBody = await request.text();
    const signature = request.headers.get("x-hub-signature-256");

    if (!signature) {
      console.error("🚨 Requisição sem assinatura do GitHub.");
      return NextResponse.json({ error: "Acesso negado" }, { status: 401 });
    }

    // Calcula o hash usando a sua chave secreta e o corpo da requisição
    const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET);
    const digest = "sha256=" + hmac.update(rawBody).digest("hex");

    // Compara se o hash que o GitHub mandou é igual ao que nós calculamos
    if (signature !== digest) {
      console.error("🚨 Assinatura inválida! Possível ataque forjado.");
      return NextResponse.json({ error: "Assinatura inválida" }, { status: 401 });
    }

    // 3. PROCESSAMENTO DO PAYLOAD
    // Agora que sabemos que é seguro, fazemos o parse para JSON
    const payload = JSON.parse(rawBody);
    const { action, comment } = payload;

    if (action !== 'created' && action !== 'edited') {
        console.log(`ℹ️ Ação ignorada: ${action}`);
        return NextResponse.json({ message: "Ação ignorada" });
    }

    if (!comment || !comment.body || !comment.node_id) {
      return NextResponse.json({ message: "Payload inválido" }, { status: 400 });
    }

    console.log(`🔎 Analisando comentário ID: ${comment.id}`);

    // 4. LÓGICA DE MODERAÇÃO MELHORADA (Evitando falsos positivos)
    // Removemos os acentos e deixamos minúsculo (ex: "CÚ" vira "cu", "Ladrão" vira "ladrao")
    const normalizedComment = comment.body
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    // Busca usando regex com "word boundaries" (\b). Isso garante que ele ache "cu", mas ignore "escutar".
    const foundBadWord = BAD_WORDS.find((word) => {
      // \b significa "fronteira de palavra" (espaço, pontuação, início/fim da frase)
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      return regex.test(normalizedComment);
    });

    // 5. DELEÇÃO NO GITHUB
    if (foundBadWord) {
      console.log(`🚨 PALAVRA PROIBIDA ENCONTRADA: "${foundBadWord}"`);
      console.log(`🗑️ Apagando comentário (NodeID: ${comment.node_id})...`);

      const mutation = JSON.stringify({
        query: `mutation($id: ID!) { deleteDiscussionComment(input: {id: $id}) { clientMutationId } }`,
        variables: { id: comment.node_id },
      });

      const response = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: mutation,
      });

      const responseData = await response.json();

      if (responseData.errors) {
        console.error("❌ Erro no GraphQL:", JSON.stringify(responseData.errors));
        return NextResponse.json({ error: "Falha ao apagar" }, { status: 500 });
      }

      console.log("✅ SUCESSO! Comentário ofensivo removido.");
      return NextResponse.json({ message: "Moderado com sucesso" });
    }

    console.log("👍 Comentário limpo.");
    return NextResponse.json({ message: "Comentário permitido" });

  } catch (error) {
    console.error("❌ Erro interno do servidor:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}