/**
 * Dynamic API Routes for UnidadesMedida (Measurement Units)
 * 
 * Endpoints:
 * GET /api/unidades-medida/[id] - Get a specific measurement unit with its relationships
 * PUT /api/unidades-medida/[id] - Update a measurement unit
 * DELETE /api/unidades-medida/[id] - Delete a measurement unit
 * 
 * Relationships included:
 * - productos (products)
 * - ingredientes (ingredients)
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET specific measurement unit
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const unidadMedida = await prisma.unidadesMedida.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        productos: true,
        ingredientes: true,
      },
    });

    if (!unidadMedida) {
      return NextResponse.json({ error: 'Measurement unit not found' }, { status: 404 });
    }

    return NextResponse.json(unidadMedida);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching measurement unit' }, { status: 500 });
  }
}

// PUT update measurement unit
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      valor,
      descripcion,
    } = body;

    if (!valor || !descripcion) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const unidadMedida = await prisma.unidadesMedida.update({
      where: { id: parseInt(params.id) },
      data: {
        valor,
        descripcion,
      },
    });

    return NextResponse.json(unidadMedida);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating measurement unit' }, { status: 500 });
  }
}

// DELETE measurement unit
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.unidadesMedida.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ message: 'Measurement unit deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting measurement unit' }, { status: 500 });
  }
} 