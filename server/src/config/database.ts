import { PrismaClient } from '@prisma/client';


const isLocal = process.env.NODE_ENV !== "production";

process.env.DATABASE_URL = isLocal
  ? process.env.DATABASE_URL_LOCAL
  : process.env.DATABASE_URL_NEON;


export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

export async function disconnectDatabase() {
  await prisma.$disconnect();
}
