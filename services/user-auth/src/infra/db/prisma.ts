import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Avoid creating multiple instances in development (hot reload issue)
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

process.once('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
process.once('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
