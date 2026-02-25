import { NextResponse } from 'next/server';
import { client } from '@/app/lib/sanity'; // Cliente de Leitura
import { Resend } from 'resend';
import { PortableText } from '@portabletext/react'; // Para converter o texto do Sanity para HTML se precisar customizar
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

// Segredo para ninguém disparar e-mail no seu lugar (Coloque isso no .env.local)
const CRON_SECRET = process.env.MY_CRON_SECRET;

// Função auxiliar para sanitizar strings e evitar injeção de HTML
function escapeHtml(text: string) {
  if (!text) return '';
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  try {
    // Garante que o segredo esteja configurado no servidor
    if (!CRON_SECRET) {
      return NextResponse.json({ error: 'Server configuration error: Missing CRON_SECRET' }, { status: 500 });
    }

    // 1. Verificação de Segurança (Bearer Token)
    const authHeader = request.headers.get('authorization') || '';
    const expectedAuth = `Bearer ${CRON_SECRET}`;

    // Proteção contra Timing Attacks: Comparação de tempo constante
    const encoder = new TextEncoder();
    const a = encoder.encode(authHeader);
    const b = encoder.encode(expectedAuth);

    // timingSafeEqual requer buffers de mesmo tamanho, então verificamos o tamanho antes
    // mas ainda usamos timingSafeEqual para evitar vazamento de informação sobre o tamanho se possível, ou falhamos logo.
    if (a.byteLength !== b.byteLength || !crypto.timingSafeEqual(a, b)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { newsletterId } = await request.json();

    if (!newsletterId) {
      return NextResponse.json({ error: 'ID da newsletter obrigatório' }, { status: 400 });
    }

    // 2. Busca o conteúdo do e-mail no Sanity
    const newsletter = await client.fetch(`*[_type == "newsletter" && _id == $id][0]`, { id: newsletterId });
    
    // 3. Busca TODOS os e-mails ativos
    // DICA: Em produção, limite isso ou use paginação se tiver >1000 leads
    const leads = await client.fetch(`*[_type == "lead" && status == "active"].email`);

    if (!newsletter || leads.length === 0) {
      return NextResponse.json({ error: 'Nada para enviar ou lista vazia' }, { status: 404 });
    }

    // 4. Prepara o Lote (Batch Sending do Resend)
    // O Resend aceita arrays de até 100 emails por request.
    const emailBatch = leads.map((email: string) => ({
      from: 'Build & Byte <news@Vetor Estratégico.com>', // SEU DOMÍNIO VALIDADO NO RESEND
      to: email,
      subject: newsletter.subject,
      html: `
        <div style="font-family: sans-serif; color: #333;">
          <h1>${escapeHtml(newsletter.subject)}</h1>
          <p>${escapeHtml(newsletter.previewText || '')}</p>
          <hr />
          
          <p>Olá! Temos novidades no blog.</p>
          <p>Acesse agora para conferir.</p>

          <br/>
          <a href="https://Vetor Estratégico.com" style="background: #000; color: #fff; padding: 10px 20px; text-decoration: none;">Ler Artigos</a>
          
          <br/><br/>
          <small><a href="%unsubscribe_url%">Descadastrar</a></small>
        </div>
      `,
    }));

    // 5. Dispara!
    // Nota: O plano gratuito do Resend tem limites diários (100 emails/dia).
    const data = await resend.batch.send(emailBatch);

    return NextResponse.json({ message: 'Disparo iniciado!', data }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro no disparo' }, { status: 500 });
  }
}