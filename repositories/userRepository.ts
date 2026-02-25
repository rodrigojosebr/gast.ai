import { prisma } from '../lib/prisma';

export const UserRepository = {
  // Busca um usuário pelo email (usado no login)
  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email }
    });
  },

  // Busca um usuário pelo ID (usado na sessão)
  async findById(id: string) {
    return await prisma.user.findUnique({
      where: { id }
    });
  },

  // Cria um novo usuário (usado no cadastro)
  async create(name: string, email: string, passwordHash: string) {
    return await prisma.user.create({
      data: {
        name,
        email,
        passwordHash
      }
    });
  }
};
