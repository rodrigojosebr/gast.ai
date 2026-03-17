import { NextResponse } from "next/server";
import { ExpenseRepository } from "@/repositories/expenseRepository";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id as string;
    const { id } = await params;

    const deleted = await ExpenseRepository.deleteUserExpense(id, userId);

    if (!deleted) {
      return NextResponse.json({ error: "Gasto não encontrado ou não autorizado" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("Erro no DELETE /api/gasto/[id]:", e);
    return NextResponse.json({ error: "Erro ao deletar gasto" }, { status: 500 });
  }
}
