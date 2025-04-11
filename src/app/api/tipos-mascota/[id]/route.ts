/**
 * Dynamic API Routes for TipoMascota (Pet Type)
 * 
 * Endpoints:
 * GET /api/tipos-mascota/[id] - Get a specific pet type
 * PUT /api/tipos-mascota/[id] - Update a pet type
 * DELETE /api/tipos-mascota/[id] - Delete a pet type
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET specific pet type
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tipo = await prisma.tipoMascota.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!tipo) {
      return NextResponse.json({ error: 'Pet type not found' }, { status: 404 });
    }

    return NextResponse.json(tipo);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching pet type' }, { status: 500 });
  }
}

// PUT update pet type
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { valor, descripcion } = body;

    if (!valor || !descripcion) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const tipo = await prisma.tipoMascota.update({
      where: { id: parseInt(params.id) },
      data: {
        valor,
        descripcion,
      },
    });

    return NextResponse.json(tipo);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating pet type' }, { status: 500 });
  }
}

// DELETE pet type
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.tipoMascota.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ message: 'Pet type deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting pet type' }, { status: 500 });
  }
} 