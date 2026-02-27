import { config } from 'dotenv';
config({ path: '.env.local' });

import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Iniciando o Seed do Banco de Dados...');

  const rajPasswordHash = await bcrypt.hash('raj123456', 10);
  const roseanePasswordHash = await bcrypt.hash('roseane123456', 10);

  // Usa upsert para não criar duplicado caso rode o script de novo sem querer
  const raj = await prisma.user.upsert({
    where: { email: 'raj@gast.ai' },
    update: {},
    create: {
      email: 'raj@gast.ai',
      name: 'Raj',
      passwordHash: rajPasswordHash,
    },
  });

  const roseane = await prisma.user.upsert({
    where: { email: 'roseane@gast.ai' },
    update: {},
    create: {
      email: 'roseane@gast.ai',
      name: 'Roseane',
      passwordHash: roseanePasswordHash,
    },
  });

  console.log('Usuários criados com sucesso:');
  console.log(`- ${raj.name} (ID: ${raj.id})`);
  console.log(`- ${roseane.name} (ID: ${roseane.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
