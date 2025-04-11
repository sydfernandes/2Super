/**
 * API Routes for UnidadesMedida (Measurement Units)
 * 
 * Endpoints:
 * GET /api/unidades-medida - Get all measurement units
 * POST /api/unidades-medida - Create a new measurement unit
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all measurement units
export async function GET() {
  try {
    const unidades = await prisma.unidadesMedida.findMany();
    return NextResponse.json(unidades);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching measurement units' }, { status: 500 });
  }
}

// POST new measurement unit
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { valor, descripcion } = body;

    if (!valor || !descripcion) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const unidad = await prisma.unidadesMedida.create({
      data: {
        valor,
        descripcion,
      },
    });

    return NextResponse.json(unidad, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating measurement unit' }, { status: 500 });
  }
} 