import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const chat = await prisma.chat.findUnique({
      where: { id: id }
    });

    if (!chat || chat.userId !== userId) {
      return NextResponse.json({ error: "Chat não encontrado ou acesso negado" }, { status: 403 });
    }

    const messages = await prisma.message.findMany({
      where: { chatId: id },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        role: true,
        content: true,
      }
    });

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