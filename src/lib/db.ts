import { PrismaClient, Prisma } from '@prisma/client';

// Type helper for decimal fields
export type Decimal = Prisma.Decimal;
export const Decimal = Prisma.Decimal;

// Helper function to safely convert to decimal with proper precision
export function toDecimal(value: string | number | Decimal): Decimal {
  if (value instanceof Decimal) return value;
  // Ensure the decimal has the correct precision (65,30)
  const decimal = new Decimal(value.toString());
  return decimal;
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn']
      : ['error'],
  }).$use(async (params, next) => {
    // Convert decimal fields to Prisma.Decimal with proper precision
    if (params.action === 'create' || params.action === 'update') {
      const decimalFields = [
        'precioActual',
        'precioPromocional',
        'precio',
        'tamanoCantidad',
        'cantidad'
      ];

      for (const field of decimalFields) {
        if (params.args.data[field]) {
          params.args.data[field] = toDecimal(params.args.data[field]);
        }
      }
    }
    return next(params);
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Ensure we only create one instance of PrismaClient in development
const client = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = client;
}

// Export the PrismaClient instance with proper typing
export const prisma = client as unknown as PrismaClient;

// Example function to test the connection
export async function testConnection() {
  try {
    const result = await prisma.$queryRaw<[{ now: Date }]>`SELECT NOW()`;
    console.log('Database connection successful:', result[0]);
    return { success: true, timestamp: result[0].now };
  } catch (error) {
    console.error('Database connection error:', error);
    return { success: false, error };
  }
} 