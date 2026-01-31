import { NextResponse } from "next/server";

const BAD_WORDS = [
    'spam', 'golpe', 'fraude', 'pirâmide', 'ganhe dinheiro', 'dinheiro fácil', 
    'fature', 'renda extra', 'lucro', 'crypto', 'bitcoin', 'ethereum', 
    'investimento', 'forex', 'trader', 'clique aqui', 'link na bio', 'acesse', 
    'site oficial', 'seguidores', 'likes', 'visualizações', 'engajamento', 
    'promoção', 'sorteio', 'grátis', 'oferta', 'desconto', 'whatsapp', 
    'telegram', 'ligue', 'contato', 'hacker', 'recuperação de conta', 
    'xxx', 'porn', 'porno', 'pornografia', 'sexo', 'nudes', 'adulto', 
    'maduras', 'amador', 'casadas', 'incesto', 'hentai', 'erótico', 'sensual', 
    'acompanhante', 'massagem', 'xvideos', 'onlyfans', 'privacy', 'câmera', 
    'camgirl', 'merda', 'bosta', 'caguei', 'caralho', 'caralhos', 'porra', 
    'porras', 'foda', 'foder', 'fuder', 'fodido', 'fudido', 'fodase', 'foda-se', 
    'cacete', 'k7', 'idiota', 'imbecil', 'burro', 'burra', 'anta', 'animal', 
    'trouxa', 'otário', 'otária', 'babaca', 'lixo', 'inútil', 'retardado', 
    'retardada', 'doente', 'escroto', 'escrota', 'nojento', 'nojenta', 
    'arrombado', 'arrombada', 'corno', 'cornos', 'chifrudo', 'vagabundo', 
    'vagabunda', 'puta', 'putas', 'prostituta', 'quenga', 'piranha', 'vadia', 
    'pau', 'pinto', 'rola', 'piroca', 'caceta', 'vara', 'jeba', 'buceta', 
    'boceta', 'xoxota', 'perereca', 'aranha', 'cu', 'cú', 'anus', 'anal', 
    'rabo', 'chupa', 'chupar', 'mamada', 'boquete', 'siririca', 'gozar', 
    'gozo', 'leite', 'esperma', 'tetas', 'peitos', 'bico', 'fdp', 'vtmnc', 
    'vtnc', 'vsf', 'pqp', 'krl', 'tmnc'
];

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export async function POST(request: Request) {
  console.log("📥 Webhook recebido! Iniciando processamento...");

  if (!GITHUB_TOKEN) {
    console.error("❌ ERRO FATAL: GITHUB_TOKEN não encontrado.");
    return NextResponse.json({ error: "Token ausente" }, { status: 500 });
  }

  try {
    const payload = await request.json();
    const { action, comment } = payload;

    // 1. Filtrar Ação: Só queremos moderar quando Cria ou Edita
    if (action !== 'created' && action !== 'edited') {
        console.log(`ℹ️ Ação ignorada: ${action}`);
        return NextResponse.json({ message: "Ação ignorada" });
    }

    if (!comment || !comment.body || !comment.node_id) {
      console.error("❌ Payload inválido ou incompleto:", payload);
      return NextResponse.json({ message: "Payload inválido" }, { status: 400 });
    }

    const commentBody = comment.body.toLowerCase();
    
    // Log para debug (não mostra o texto todo por privacidade, só o início)
    console.log(`🔎 Analisando comentário ID: ${comment.id}`);

    const foundBadWord = BAD_WORDS.find((word) => commentBody.includes(word));

    if (foundBadWord) {
      console.log(`🚨 PALAVRA PROIBIDA ENCONTRADA: "${foundBadWord}"`);
      console.log(`🗑️ Tentando apagar comentário (NodeID: ${comment.node_id})...`);

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
        console.error("❌ Erro na API do GitHub:", JSON.stringify(responseData.errors));
        return NextResponse.json({ error: "Falha ao apagar no GitHub" }, { status: 500 });
      }

      console.log("✅ SUCESSO! Comentário ofensivo removido.");
      return NextResponse.json({ message: "Moderado com sucesso" });
    }

    console.log("👍 Comentário limpo. Nenhuma ação necessária.");
    return NextResponse.json({ message: "Comentário permitido" });

  } catch (error) {
    console.error("❌ Erro interno do servidor:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}