/**
 * Base API Routes for UnidadesMedida (Measurement Units)
 * 
 * Endpoints:
 * GET /api/unidades-medida - Get all measurement units with their relationships
 * POST /api/unidades-medida - Create a new measurement unit
 * 
 * Relationships included:
 * - productos (products)
 * - ingredientes (ingredients)
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all measurement units
export async function GET() {
  try {
    const unidadesMedida = await prisma.unidadesMedida.findMany({
      include: {
        productos: true,
        ingredientes: true,
      },
    });

    return NextResponse.json(unidadesMedida);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching measurement units' }, { status: 500 });
  }
}

// POST create measurement unit
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      valor,
      descripcion,
    } = body;

    if (!valor || !descripcion) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const unidadMedida = await prisma.unidadesMedida.create({
      data: {
        valor,
        descripcion,
      },
    });

    return NextResponse.json(unidadMedida);
  } catch (error) {
    return NextResponse.json({ error: 'Error creating measurement unit' }, { status: 500 });
  }
} 