/**
 * Dynamic API Routes for Etiqueta (Tag)
 * 
 * Endpoints:
 * GET /api/etiquetas/[id] - Get a specific tag with its relationships
 * PUT /api/etiquetas/[id] - Update a tag
 * DELETE /api/etiquetas/[id] - Delete a tag
 * 
 * Relationships included:
 * - productos (products)
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET specific tag
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const etiqueta = await prisma.etiqueta.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        productos: true,
      },
    });

    if (!etiqueta) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }

    return NextResponse.json(etiqueta);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching tag' }, { status: 500 });
  }
}

// PUT update tag
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

    const etiqueta = await prisma.etiqueta.update({
      where: { id: parseInt(params.id) },
      data: {
        valor,
        descripcion,
      },
    });

    return NextResponse.json(etiqueta);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating tag' }, { status: 500 });
  }
}

// DELETE tag
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.etiqueta.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting tag' }, { status: 500 });
  }
} 