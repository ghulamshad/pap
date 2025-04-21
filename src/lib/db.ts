// import { PrismaClient } from '../generated/prisma';

// // PrismaClient is attached to the `global` object in development to prevent
// // exhausting your database connection limit.
// const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

// // Check if we already have a PrismaClient instance
// if (!globalForPrisma.prisma) {
//   try {
//     globalForPrisma.prisma = new PrismaClient({
//       log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
//     });
//   } catch (error) {
//     console.error('Failed to initialize Prisma Client:', error);
//     throw error;
//   }
// }

// // Export the PrismaClient instance
// export const db = globalForPrisma.prisma;

// // Ensure the PrismaClient is properly disconnected when the app is shutting down
// if (process.env.NODE_ENV !== 'production') {
//   process.on('beforeExit', async () => {
//     await db.$disconnect();
//   });
// } 
import { PrismaClient } from '../generated/prisma';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export const db = prisma;

// Optional: Ensure clean shutdown only if you're running scripts (not in serverless)
if (process.env.NODE_ENV !== 'production') {
  process.on('beforeExit', async () => {
    await db.$disconnect();
  });
}
