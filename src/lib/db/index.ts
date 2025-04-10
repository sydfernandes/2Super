import { PrismaClient } from '@prisma/client'

// Create a global Prisma instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Example function to test the connection
export async function testConnection() {
  try {
    const result = await prisma.$queryRaw<[{ now: Date }]>`SELECT NOW()`
    console.log('Database connection successful:', result[0])
    return { success: true, timestamp: result[0].now }
  } catch (error) {
    console.error('Database connection error:', error)
    return { success: false, error }
  }
} 