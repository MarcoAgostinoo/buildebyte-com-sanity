import { NextResponse } from "next/server";

// 🔴 CONFIGURAÇÃO
const BAD_WORDS = [ // --- 1. SPAM, GOLPES E VENDA ---
    'spam', 'golpe', 'fraude', 'pirâmide', 
    'ganhe dinheiro', 'dinheiro fácil', 'fature', 'renda extra', 'lucro',
    'crypto', 'bitcoin', 'ethereum', 'investimento', 'forex', 'trader',
    'clique aqui', 'link na bio', 'acesse', 'site oficial',
    'seguidores', 'likes', 'visualizações', 'engajamento',
    'promoção', 'sorteio', 'grátis', 'oferta', 'desconto',
    'whatsapp', 'telegram', 'ligue', 'contato',
    'hacker', 'recuperação de conta', 

    // --- 2. CONTEÚDO ADULTO / PORNOGRAFIA ---
    'xxx', 'porn', 'porno', 'pornografia', 'sexo', 'nudes',
    'adulto', 'maduras', 'amador', 'casadas', 'incesto',
    'hentai', 'erótico', 'sensual', 'acompanhante', 'massagem',
    'xvideos', 'onlyfans', 'privacy', 'câmera', 'camgirl',

    // --- 3. PALAVRÕES E OFENSAS GERAIS (PT-BR) ---
    'merda', 'bosta', 'caguei',
    'caralho', 'caralhos', 
    'porra', 'porras',
    'foda', 'foder', 'fuder', 'fodido', 'fudido', 'fodase', 'foda-se',
    'cacete', 'k7',
    
    // --- 4. INSULTOS PESSOAIS ---
    'idiota', 'imbecil', 'burro', 'burra', 'anta', 'animal',
    'trouxa', 'otário', 'otária', 'babaca',
    'lixo', 'inútil', 'retardado', 'retardada', 'doente',
    'escroto', 'escrota', 'nojento', 'nojenta',
    'arrombado', 'arrombada', 
    'corno', 'cornos', 'chifrudo',
    'vagabundo', 'vagabunda',
    
    // --- 5. TERMOS SEXUAIS / ANATÔMICOS (Chulo) ---
    'puta', 'putas', 'prostituta', 'quenga', 'piranha', 'vadia',
    'pau', 'pinto', 'rola', 'piroca', 'caceta', 'vara', 'jeba',
    'buceta', 'boceta', 'xoxota', 'perereca', 'aranha',
    'cu', 'cú', 'anus', 'anal', 'rabo',
    'chupa', 'chupar', 'mamada', 'boquete', 'siririca',
    'gozar', 'gozo', 'leite', 'esperma',
    'tetas', 'peitos', 'bico',

    // --- 6. SIGLAS E VARIAÇÕES ---
    'fdp', 'vtmnc', 'vtnc', 'vsf', 'pqp', 'krl', 'tmnc'
];

// ⚠️ IMPORTANTE: O token é lido de .env.local (GITHUB_TOKEN)
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export async function POST(request: Request) {
  // Verificação inicial do token
  if (!GITHUB_TOKEN) {
    console.error("❌ GITHUB_TOKEN não configurado no ambiente.");
    return NextResponse.json(
      { error: "Serviço não configurado: Token ausente." },
      { status: 500 }
    );
  }

  try {
    const payload = await request.json();

    // Verificação de segurança básica
    if (!payload.comment || !payload.comment.body || !payload.comment.node_id) {
      return NextResponse.json({ message: "Payload inválido" }, { status: 400 });
    }

    const commentBody = payload.comment.body.toLowerCase();
    const hasBadWord = BAD_WORDS.some((word) => commentBody.includes(word));

    if (hasBadWord) {
      console.log(`🚨 PALAVRA PROIBIDA: Comentário com node_id ${payload.comment.node_id}`);

      const nodeId = payload.comment.node_id;

      const mutation = JSON.stringify({
        query: `mutation($id: ID!) { deleteDiscussionComment(input: {id: $id}) { clientMutationId } }`,
        variables: { id: nodeId },
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
        console.error("❌ Erro do GitHub:", responseData.errors);
        return NextResponse.json({ error: "Falha ao apagar no GitHub" }, { status: 500 });
      }

      console.log("✅ Comentário apagado com sucesso via GraphQL!");
      return NextResponse.json({ message: "Comentário moderado e apagado." });
    }

    return NextResponse.json({ message: "Comentário limpo." });

  } catch (error) {
    console.error("Erro interno:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}