/**
 * Base API Routes for TipoProducto (Product Type)
 * 
 * Endpoints:
 * GET /api/tipos-producto - Get all product types with their relationships
 * POST /api/tipos-producto - Create a new product type
 * 
 * Relationships included:
 * - categoria (category)
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all product types
export async function GET() {
  try {
    const tiposProducto = await prisma.tipoProducto.findMany({
      include: {
        categoria: true,
      },
    });

    return NextResponse.json(tiposProducto);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching product types' }, { status: 500 });
  }
}

// POST create product type
export async function POST(request: Request) {
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

    const tipoProducto = await prisma.tipoProducto.create({
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
    return NextResponse.json({ error: 'Error creating product type' }, { status: 500 });
  }
} 