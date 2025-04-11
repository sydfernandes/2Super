/**
 * Dynamic API Routes for SexoGenero (Gender)
 * 
 * Endpoints:
 * GET /api/sexos-genero/[id] - Get a specific gender
 * PUT /api/sexos-genero/[id] - Update a gender
 * DELETE /api/sexos-genero/[id] - Delete a gender
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET specific gender
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const sexo = await prisma.sexoGenero.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!sexo) {
      return NextResponse.json({ error: 'Gender not found' }, { status: 404 });
    }

    return NextResponse.json(sexo);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching gender' }, { status: 500 });
  }
}

// PUT update gender
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

    const sexo = await prisma.sexoGenero.update({
      where: { id: parseInt(params.id) },
      data: {
        valor,
        descripcion,
      },
    });

    return NextResponse.json(sexo);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating gender' }, { status: 500 });
  }
}

// DELETE gender
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.sexoGenero.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ message: 'Gender deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting gender' }, { status: 500 });
  }
} 