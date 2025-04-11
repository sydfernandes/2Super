/**
 * Base API Routes for Supermercado (Supermarket)
 * 
 * Endpoints:
 * GET /api/supermercados - Get all supermarkets with their relationships
 * POST /api/supermercados - Create a new supermarket
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

// GET all supermarkets
export async function GET() {
  try {
    const supermercados = await prisma.supermercado.findMany({
      include: {
        metodoObtencion: true,
        precios: true,
        historialPrecios: true,
        usuariosFavoritos: true,
        marcas: true,
      },
    });

    return NextResponse.json(supermercados);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching supermarkets' }, { status: 500 });
  }
}

// POST create supermarket
export async function POST(request: Request) {
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

    const supermercado = await prisma.supermercado.create({
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
    return NextResponse.json({ error: 'Error creating supermarket' }, { status: 500 });
  }
} 