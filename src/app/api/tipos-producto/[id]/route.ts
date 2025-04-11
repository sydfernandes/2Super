/**
 * Dynamic API Routes for TipoProducto (Product Type)
 * 
 * Endpoints:
 * GET /api/tipos-producto/[id] - Get a specific product type with its relationships
 * PUT /api/tipos-producto/[id] - Update a product type
 * DELETE /api/tipos-producto/[id] - Delete a product type
 * 
 * Relationships included:
 * - categoria (category)
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET specific product type
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tipoProducto = await prisma.tipoProducto.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        categoria: true,
      },
    });

    if (!tipoProducto) {
      return NextResponse.json({ error: 'Product type not found' }, { status: 404 });
    }

    return NextResponse.json(tipoProducto);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching product type' }, { status: 500 });
  }
}

// PUT update product type
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      nombre,
      categoriaId,
      imagenUrl,
      activo,
    } = body;

    if (!nombre || !categoriaId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const tipoProducto = await prisma.tipoProducto.update({
      where: { id: parseInt(params.id) },
      data: {
        nombre,
        categoriaId,
        imagenUrl,
        activo,
      },
      include: {
        categoria: true,
      },
    });

    return NextResponse.json(tipoProducto);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating product type' }, { status: 500 });
  }
}

// DELETE product type
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.tipoProducto.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ message: 'Product type deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting product type' }, { status: 500 });
  }
} 