import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const chats = await prisma.chat.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      // Opcional: trazer a última mensagem para usar como resumo
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    return NextResponse.json(chats);
  } catch (error) {
    console.error("[ERR] Erro ao buscar histórico:", error);
    return NextResponse.json({ error: "Falha ao carregar sessões" }, { status: 500 });
  }
}