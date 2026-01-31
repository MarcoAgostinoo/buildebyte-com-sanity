import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { nome, email, mensagem } = await request.json();

    // Validação básica
    if (!nome || !email || !mensagem) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 });
    }

    const data = await resend.emails.send({
      from: 'Contato Site <onboarding@resend.dev>', // Use esse email padrão por enquanto
      to: ['buildebite@gmail.com'], // 🔴 TROQUE PELO SEU EMAIL REAL
      subject: `Nova mensagem de ${nome} via Buildebite`,
      replyTo: email, // Isso permite que você clique em "Responder" e vá para o email da pessoa
      text: `
        Nome: ${nome}
        Email: ${email}
        
        Mensagem:
        ${mensagem}
      `,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao enviar email' }, { status: 500 });
  }
}
