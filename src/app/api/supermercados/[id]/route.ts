/**
 * Dynamic API Routes for Supermercado (Supermarket)
 * 
 * Endpoints:
 * GET /api/supermercados/[id] - Get a specific supermarket with its relationships
 * PUT /api/supermercados/[id] - Update a supermarket
 * DELETE /api/supermercados/[id] - Delete a supermarket
 * 
 * Relationships included:
 * - metodoObtencion (price obtaining method)
 * - precios (prices)
 * - historialPrecios (price history)
 * - usuariosFavoritos (favorite users)
 * - marcas (brands)
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET specific supermarket
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supermercado = await prisma.supermercado.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        metodoObtencion: true,
        precios: true,
        historialPrecios: true,
        usuariosFavoritos: true,
        marcas: true,
      },
    });

    if (!supermercado) {
      return NextResponse.json({ error: 'Supermarket not found' }, { status: 404 });
    }

    return NextResponse.json(supermercado);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching supermarket' }, { status: 500 });
  }
}

// PUT update supermarket
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      nombre,
      logoUrl,
      sitioWeb,
      directorioCsv,
      metodoObtencionId,
      frecuenciaActualizacion,
      activo,
    } = body;

    if (!nombre || !metodoObtencionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supermercado = await prisma.supermercado.update({
      where: { id: parseInt(params.id) },
      data: {
        nombre,
        logoUrl,
        sitioWeb,
        directorioCsv,
        metodoObtencionId,
        frecuenciaActualizacion,
        activo,
      },
      include: {
        metodoObtencion: true,
      },
    });

    return NextResponse.json(supermercado);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating supermarket' }, { status: 500 });
  }
}

// DELETE supermarket
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.supermercado.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ message: 'Supermarket deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting supermarket' }, { status: 500 });
  }
} 