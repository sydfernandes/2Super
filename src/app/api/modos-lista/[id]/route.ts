/**
 * Dynamic API Routes for ModoLista (List Mode)
 * 
 * Endpoints:
 * GET /api/modos-lista/[id] - Get a specific list mode
 * PUT /api/modos-lista/[id] - Update a list mode
 * DELETE /api/modos-lista/[id] - Delete a list mode
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET specific list mode
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const modo = await prisma.modoLista.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!modo) {
      return NextResponse.json({ error: 'List mode not found' }, { status: 404 });
    }

    return NextResponse.json(modo);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching list mode' }, { status: 500 });
  }
}

// PUT update list mode
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

    const modo = await prisma.modoLista.update({
      where: { id: parseInt(params.id) },
      data: {
        valor,
        descripcion,
      },
    });

    return NextResponse.json(modo);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating list mode' }, { status: 500 });
  }
}

// DELETE list mode
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.modoLista.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ message: 'List mode deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting list mode' }, { status: 500 });
  }
} 