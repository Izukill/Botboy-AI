import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: Request,
  // 1. Tipamos o params explicitamente como uma Promise
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 2. Fazemos o await antes de desestruturar o id
    const { id } = await params;

    const messages = await prisma.message.findMany({
      where: { chatId: id },
      orderBy: { createdAt: 'asc' }, // Ordem cronológica
      select: {
        id: true,
        role: true,
        content: true,
      }
    });

    // Mapeia para o formato que o useChat espera (parts)
    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      parts: [{ type: 'text', text: msg.content }]
    }));

    return NextResponse.json(formattedMessages);
  } catch (error) {
    console.error("[ERR] Erro ao buscar mensagens:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}