/**
 * Dynamic API Routes for Producto (Product)
 * 
 * Endpoints:
 * GET /api/productos/[id] - Get a specific product with its relationships
 * PUT /api/productos/[id] - Update a product
 * DELETE /api/productos/[id] - Delete a product
 * 
 * Relationships included:
 * - marca (brand)
 * - tipoProducto (product type)
 * - unidadMedida (measurement unit)
 * - etiquetas (tags)
 * - precios (prices)
 * - historialPrecios (price history)
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET specific product
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const producto = await prisma.producto.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        marca: true,
        tipoProducto: true,
        unidadMedida: true,
        etiquetas: true,
        precios: true,
        historialPrecios: true,
      },
    });

    if (!producto) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(producto);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching product' }, { status: 500 });
  }
}

// PUT update product
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      nombre,
      marcaId,
      tipoProductoId,
      tamanoCantidad,
      unidadMedidaId,
      fotoUrl,
      descontinuado,
      etiquetas,
    } = body;

    if (!nombre || !marcaId || !tipoProductoId || !unidadMedidaId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const producto = await prisma.producto.update({
      where: { id: parseInt(params.id) },
      data: {
        nombre,
        marcaId,
        tipoProductoId,
        tamanoCantidad,
        unidadMedidaId,
        fotoUrl,
        descontinuado,
        etiquetas: {
          set: etiquetas?.map((id: number) => ({ id })) || [],
        },
      },
      include: {
        marca: true,
        tipoProducto: true,
        unidadMedida: true,
        etiquetas: true,
      },
    });

    return NextResponse.json(producto);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating product' }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.producto.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting product' }, { status: 500 });
  }
} 