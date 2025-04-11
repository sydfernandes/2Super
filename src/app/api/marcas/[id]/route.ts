/**
 * Dynamic API Routes for Marca (Brand)
 * 
 * Endpoints:
 * GET /api/marcas/[id] - Get a specific brand with its relationships
 * PUT /api/marcas/[id] - Update a brand
 * DELETE /api/marcas/[id] - Delete a brand
 * 
 * Relationships included:
 * - productos (products)
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET specific brand
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const marca = await prisma.marca.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        productos: true,
      },
    });

    if (!marca) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    return NextResponse.json(marca);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching brand' }, { status: 500 });
  }
}

// PUT update brand
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      nombre,
      logoUrl,
      esMarcaBlanca,
      activo,
    } = body;

    if (!nombre) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const marca = await prisma.marca.update({
      where: { id: parseInt(params.id) },
      data: {
        nombre,
        logoUrl,
        esMarcaBlanca,
        activo,
      },
    });

    return NextResponse.json(marca);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating brand' }, { status: 500 });
  }
}

// DELETE brand
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.marca.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting brand' }, { status: 500 });
  }
} 