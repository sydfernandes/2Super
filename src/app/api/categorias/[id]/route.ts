/**
 * Dynamic API Routes for Categoria (Category)
 * 
 * Endpoints:
 * GET /api/categorias/[id] - Get a specific category with its relationships
 * PUT /api/categorias/[id] - Update a category
 * DELETE /api/categorias/[id] - Delete a category
 * 
 * Relationships included:
 * - categoriaPadre (parent category)
 * - subcategorias (subcategories)
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET specific category
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const categoria = await prisma.categoria.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        categoriaPadre: true,
        subcategorias: true,
      },
    });

    if (!categoria) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json(categoria);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching category' }, { status: 500 });
  }
}

// PUT update category
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      nombre,
      descripcion,
      categoriaPadreId,
      imagenUrl,
      activo,
    } = body;

    if (!nombre) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const categoria = await prisma.categoria.update({
      where: { id: parseInt(params.id) },
      data: {
        nombre,
        descripcion,
        categoriaPadreId,
        imagenUrl,
        activo,
      },
      include: {
        categoriaPadre: true,
        subcategorias: true,
      },
    });

    return NextResponse.json(categoria);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating category' }, { status: 500 });
  }
}

// DELETE category
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.categoria.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting category' }, { status: 500 });
  }
} 