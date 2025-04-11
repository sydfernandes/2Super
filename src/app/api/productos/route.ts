/**
 * Base API Routes for Producto (Product)
 * 
 * Endpoints:
 * GET /api/productos - Get all products with their relationships
 * POST /api/productos - Create a new product
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

// GET all products
export async function GET() {
  try {
    const productos = await prisma.producto.findMany({
      include: {
        marca: true,
        tipoProducto: true,
        unidadMedida: true,
        etiquetas: true,
        precios: true,
        historialPrecios: true,
      },
    });

    return NextResponse.json(productos);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching products' }, { status: 500 });
  }
}

// POST create product
export async function POST(request: Request) {
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

    const producto = await prisma.producto.create({
      data: {
        nombre,
        marcaId,
        tipoProductoId,
        tamanoCantidad,
        unidadMedidaId,
        fotoUrl,
        descontinuado,
        etiquetas: {
          connect: etiquetas?.map((id: number) => ({ id })) || [],
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
    return NextResponse.json({ error: 'Error creating product' }, { status: 500 });
  }
} 