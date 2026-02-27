import { NextResponse } from "next/server";
import { centsToBRL } from "@/lib/gastos";
import { ExpenseRepository } from "@/repositories/expenseRepository";
import { analyzeExpensesStream } from "@/services/aiParserService";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id as string;
    const url = new URL(req.url);

    const month = url.searchParams.get("month"); // Legacy support
    const from = url.searchParams.get("from") || month;
    const to = url.searchParams.get("to") || month;

    if (!from || !/^\d{4}-\d{2}$/.test(from)) {
      return NextResponse.json({ error: "Mês de início inválido (use YYYY-MM)" }, { status: 400 });
    }

    const allUserExpenses = await ExpenseRepository.findByUserId(userId);

    const [startYear, startMonthVal] = from.split("-").map(Number);
    const startDate = new Date(startYear, startMonthVal - 1, 1);

    let endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    if (to && /^\d{4}-\d{2}$/.test(to)) {
      const [endYear, endMonthVal] = to.split("-").map(Number);
      endDate = new Date(endYear, endMonthVal, 1);
    }

    const validEvents = allUserExpenses.filter(ev => ev.date >= startDate && ev.date < endDate);
    validEvents.sort((a, b) => a.date.getTime() - b.date.getTime());

    if (validEvents.length === 0) {
      // Retorna uma resposta simples de texto caso não haja gastos, usando um stream simples para manter compatibilidade
      const emptyMsg = "Você não possui gastos registrados neste período para analisar. Pelo menos você não gastou nada! 🎉";
      return new Response(emptyMsg, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }

    // Simplificando os dados para a IA entender melhor e economizar tokens
    const simplifiedData = validEvents.map(ev => ({
      data: ev.date.toISOString().split('T')[0].split('-').reverse().join('/'),
      valor: centsToBRL(ev.amountCents),
      desc: ev.description,
      tipo: ev.paymentMethod
    }));

    const stream = await analyzeExpensesStream(JSON.stringify(simplifiedData));

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            controller.enqueue(new TextEncoder().encode(chunk.text));
          }
        } catch (err) {
          console.error("Stream error:", err);
          controller.enqueue(new TextEncoder().encode("\\n\\n[Erro ao gerar análise completa]"));
        } finally {
          controller.close();
        }
      }
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      }
    });

  } catch (e: any) {
    console.error("Erro na Análise com IA:", e);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
