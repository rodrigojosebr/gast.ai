import { NextResponse } from "next/server";
import { centsToBRL } from "@/lib/gastos";
import { ExpenseRepository } from "@/repositories/expenseRepository";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

function csvEscape(v: string): string {
  if (/[;\n"]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !(session.user as any).id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = (session.user as any).id as string;
    const url = new URL(req.url);

    const month = url.searchParams.get("month"); // Legacy support
    const from = url.searchParams.get("from") || month;
    const to = url.searchParams.get("to") || month;

    if (!from || !/^\d{4}-\d{2}$/.test(from)) {
      return new NextResponse("Mês de início inválido (use YYYY-MM)", { status: 400 });
    }

    // Puxa tudo e filtra na memória para o MVP (no futuro podemos usar where: { date: { gte, lte } })
    const allUserExpenses = await ExpenseRepository.findByUserId(userId);

    // Cálculo dos limites do período (UTC)
    const [startYear, startMonthVal] = from.split("-").map(Number);
    const startDate = new Date(startYear, startMonthVal - 1, 1);

    let endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1); // Final do primeiro mês

    if (to && /^\d{4}-\d{2}$/.test(to)) {
      const [endYear, endMonthVal] = to.split("-").map(Number);
      endDate = new Date(endYear, endMonthVal, 1); // Primeiro dia do mês seguinte ao 'to'
    }

    const validEvents = allUserExpenses.filter(ev => ev.date >= startDate && ev.date < endDate);

    // Ordena por data crescente
    validEvents.sort((a, b) => a.date.getTime() - b.date.getTime());

    let csv = "Data;Valor;Descricao;Metodo de Pagamento\n";

    for (const ev of validEvents) {
      const dateFormatted = ev.date.toISOString().split('T')[0].split('-').reverse().join('/');
      const row = [
        csvEscape(dateFormatted),
        csvEscape(centsToBRL(ev.amountCents)),
        csvEscape(ev.description),
        csvEscape(ev.paymentMethod),
      ].join(";");
      csv += row + "\n";
    }

    // Add BOM for Excel compatibility with accents (ç, ã, etc)
    const csvWithBOM = "\uFEFF" + csv;

    return new NextResponse(csvWithBOM, {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  } catch (e: any) {
    console.error("Erro na Exportação CSV:", e);
    return new NextResponse("Erro interno no servidor", { status: 500 });
  }
}
