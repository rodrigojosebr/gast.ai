import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/client/client';

if (!process.env.DATABASE_URL) {
  require('dotenv').config({ path: '.env.local' });
}

const connectionString = `${process.env.DATABASE_URL}`;

const globalForPrisma = global as unknown as { 
  prisma: PrismaClient;
  pool: Pool;
};

// Precisamos manter a mesma conexão de Pool no modo de desenvolvimento
const pool = globalForPrisma.pool || new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}
