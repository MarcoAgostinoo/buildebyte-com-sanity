import { writeClient } from '@/app/lib/sanity'; // <--- IMPORTANTE: Usar o cliente de escrita
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Validação básica
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }

    // 1. Verifica se já existe esse email no banco (para não duplicar)
    // Aqui usamos o writeClient também, mas poderia ser o client normal
    const existingLead = await writeClient.fetch(
      `*[_type == "lead" && email == $email][0]`,
      { email }
    );

    if (existingLead) {
      return NextResponse.json({ message: 'Email já cadastrado!' }, { status: 200 });
    }

    // 2. SALVA NO SANITY (AQUI PRECISA DA PERMISSÃO DE ESCRITA)
    await writeClient.create({
      _type: 'lead', // Certifique-se de ter criado esse schema no Sanity Studio
      email,
      status: 'active',
      source: 'site-capture',
      publishedAt: new Date().toISOString(),
    });

    return NextResponse.json({ message: 'Inscrito com sucesso!' }, { status: 200 });

  } catch (error) {
    console.error('Erro ao salvar lead:', error);
    return NextResponse.json({ error: 'Erro interno ao salvar.' }, { status: 500 });
  }
}