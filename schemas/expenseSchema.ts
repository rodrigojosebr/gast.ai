import { z } from 'zod';

// Esquema de Validação para criar uma Despesa (Expense)
export const createExpenseSchema = z.object({
  amountCents: z.number().int().nonnegative('O valor deve ser um número inteiro e positivo'),
  description: z.string().min(1, 'A descrição é obrigatória'),
  paymentMethod: z.string().min(1, 'O método de pagamento é obrigatório'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'A data deve estar no formato YYYY-MM-DD'),
  rawText: z.string().optional(),
  userId: z.string().uuid('ID de usuário inválido')
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
