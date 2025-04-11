/**
 * Dynamic API Routes for MetodoObtencion (Price Obtaining Method)
 * 
 * Endpoints:
 * GET /api/metodos-obtencion/[id] - Get a specific price obtaining method with its relationships
 * PUT /api/metodos-obtencion/[id] - Update a price obtaining method
 * DELETE /api/metodos-obtencion/[id] - Delete a price obtaining method
 * 
 * Relationships included:
 * - supermercados (supermarkets)
 * - precios (prices)
 * - historialPrecios (price history)
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET specific price obtaining method
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const metodoObtencion = await prisma.metodoObtencion.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        supermercados: true,
        precios: true,
        historialPrecios: true,
      },
    });

    if (!metodoObtencion) {
      return NextResponse.json({ error: 'Price obtaining method not found' }, { status: 404 });
    }

    return NextResponse.json(metodoObtencion);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching price obtaining method' }, { status: 500 });
  }
}

// PUT update price obtaining method
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      valor,
      descripcion,
      usoTipico,
    } = body;

    if (!valor || !descripcion) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const metodoObtencion = await prisma.metodoObtencion.update({
      where: { id: parseInt(params.id) },
      data: {
        valor,
        descripcion,
        usoTipico,
      },
    });

    return NextResponse.json(metodoObtencion);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating price obtaining method' }, { status: 500 });
  }
}

// DELETE price obtaining method
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.metodoObtencion.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ message: 'Price obtaining method deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting price obtaining method' }, { status: 500 });
  }
} 