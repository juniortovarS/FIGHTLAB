import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;

// Configuración optimizada para Render
const pool = new pg.Pool({ 
  connectionString,
  max: 1, // Solo una conexión para evitar que Render nos bloquee
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl: {
    rejectUnauthorized: false
  }
});

const adapter = new PrismaPg(pool);

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter: adapter,
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
