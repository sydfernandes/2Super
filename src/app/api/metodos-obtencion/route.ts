/**
 * API Routes for MetodoObtencion (Price Obtaining Methods)
 * 
 * Endpoints:
 * GET /api/metodos-obtencion - Get all price obtaining methods
 * POST /api/metodos-obtencion - Create a new price obtaining method
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all price obtaining methods
export async function GET() {
  try {
    const metodos = await prisma.metodoObtencion.findMany();
    return NextResponse.json(metodos);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching price obtaining methods' }, { status: 500 });
  }
}

// POST new price obtaining method
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { valor, descripcion, usoTipico } = body;

    if (!valor || !descripcion) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const metodo = await prisma.metodoObtencion.create({
      data: {
        valor,
        descripcion,
        usoTipico,
      },
    });

    return NextResponse.json(metodo, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating price obtaining method' }, { status: 500 });
  }
} 