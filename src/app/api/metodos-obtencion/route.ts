/**
 * Base API Routes for MetodoObtencion (Price Obtaining Method)
 * 
 * Endpoints:
 * GET /api/metodos-obtencion - Get all price obtaining methods with their relationships
 * POST /api/metodos-obtencion - Create a new price obtaining method
 * 
 * Relationships included:
 * - supermercados (supermarkets)
 * - precios (prices)
 * - historialPrecios (price history)
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all price obtaining methods
export async function GET() {
  try {
    const metodosObtencion = await prisma.metodoObtencion.findMany({
      include: {
        supermercados: true,
        precios: true,
        historialPrecios: true,
      },
    });

    return NextResponse.json(metodosObtencion);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching price obtaining methods' }, { status: 500 });
  }
}

// POST create price obtaining method
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      valor,
      descripcion,
      usoTipico,
    } = body;

    if (!valor || !descripcion) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const metodoObtencion = await prisma.metodoObtencion.create({
      data: {
        valor,
        descripcion,
        usoTipico,
      },
    });

    return NextResponse.json(metodoObtencion);
  } catch (error) {
    return NextResponse.json({ error: 'Error creating price obtaining method' }, { status: 500 });
  }
} 