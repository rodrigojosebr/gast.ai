import { NextResponse } from "next/server";
import { centsToBRL } from "@/lib/gastos";
import { parseExpenseText } from "@/services/aiParserService";
import { ExpenseRepository } from "@/repositories/expenseRepository";
import { createExpenseSchema } from "@/schemas/expenseSchema";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id as string;
    const userName = session.user.name || "Usuário";

    const timeZone = req.headers.get("x-timezone") || 'America/Sao_Paulo';
    const body = await req.json().catch(() => ({}));
    const text = String(body.text ?? body.valor ?? "").trim();
    if (!text) return NextResponse.json({ error: "Missing text" }, { status: 400 });

    // Chama o Google Gemini (IA)
    const parsedExpense = await parseExpenseText(text, timeZone);
    if (!parsedExpense || parsedExpense.amountCents == null) {
      return NextResponse.json({ error: "Não consegui extrair as informações do seu gasto (valor, descrição). Tente falar de forma mais clara." }, { status: 400 });
    }

    // 1. Prepara os dados brutos para validação
    const expenseData = {
      ...parsedExpense,
      rawText: text,
      userId: userId
    };

    // 2. Validação Estrita (Zod)
    const validationResult = createExpenseSchema.safeParse(expenseData);
    if (!validationResult.success) {
      console.error("Zod Error", validationResult.error);
      return NextResponse.json({ error: "Dados extraídos pela IA são inválidos pro banco." }, { status: 400 });
    }

    // 3. Salva no banco PostgreSQL usando Arquitetura Limpa
    const savedExpense = await ExpenseRepository.create(validationResult.data);

    // 4. Cálculo do Total Mensal (Buscando direto do Postgres)
    const allUserExpenses = await ExpenseRepository.findByUserId(userId);

    // Pega o YYYY-MM do mês atual (UTC)
    const currentMonth = new Date().toISOString().slice(0, 7);

    const monthlyTotalCents = allUserExpenses
      // Filtra apenas os que pertencem ao mês corrente
      .filter(exp => exp.date.toISOString().startsWith(currentMonth))
      .reduce((acc, exp) => acc + exp.amountCents, 0);

    // 5. Devolve para o front-end (adaptando para a interface que ele já espera)
    const event = {
      id: savedExpense.id,
      user: { id: userId, name: userName },
      date: savedExpense.date.toISOString().split('T')[0].split('-').reverse().join('/'),
      amountCents: savedExpense.amountCents,
      amountBRL: centsToBRL(savedExpense.amountCents),
      description: savedExpense.description,
      paymentMethod: savedExpense.paymentMethod,
    };

    return NextResponse.json({
      ok: true,
      event,
      monthlyTotalBRL: centsToBRL(monthlyTotalCents)
    });
  } catch (e: any) {
    console.error("Erro Crítico na Rota de Gastos:", e);
    return NextResponse.json({ error: e?.message ?? "Erro" }, { status: 500 });
  }
}
