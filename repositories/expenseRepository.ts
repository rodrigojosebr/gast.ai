import { prisma } from '../lib/prisma';
import { CreateExpenseInput } from '../schemas/expenseSchema';

export const ExpenseRepository = {
  // Cria um novo gasto no banco de dados
  async create(data: CreateExpenseInput) {
    // Converte a string YYYY-MM-DD do Zod para o objeto Date do Prisma
    const dateObj = new Date(data.date);

    return await prisma.expense.create({
      data: {
        amountCents: data.amountCents,
        description: data.description,
        paymentMethod: data.paymentMethod,
        date: dateObj,
        rawText: data.rawText,
        userId: data.userId
      }
    });
  },

  // Busca todos os gastos de um usuário específico
  async findByUserId(userId: string) {
    return await prisma.expense.findMany({
      where: { userId },
      orderBy: { date: 'desc' }
    });
  },

  // Deleta um gasto garantindo que pertença ao usuário
  async deleteUserExpense(id: string, userId: string) {
    // Primeiro verifica se o gasto existe e é do usuário
    const expense = await prisma.expense.findUnique({
      where: { id }
    });

    if (!expense || expense.userId !== userId) {
      return null; // Não autorizado ou não encontrado
    }

    return await prisma.expense.delete({
      where: { id }
    });
  }
};
