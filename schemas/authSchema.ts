import { z } from 'zod';

// Esquema de Validação para Registro de Usuário
export const registerUserSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres')
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;

// Esquema de Validação para Login
export const loginUserSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'A senha é obrigatória')
});

export type LoginUserInput = z.infer<typeof loginUserSchema>;
