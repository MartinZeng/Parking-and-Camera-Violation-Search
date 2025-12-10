// lib/prisma.ts
import { PrismaClient } from '@prisma/client';// Import the PrismaClient constructor from the Prisma Client library

// Create a global variable to hold the PrismaClient instance

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}