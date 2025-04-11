/**
 * Base API Routes for Marca (Brand)
 * 
 * Endpoints:
 * GET /api/marcas - Get all brands with their relationships
 * POST /api/marcas - Create a new brand
 * 
 * Relationships included:
 * - productos (products)
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all brands
export async function GET() {
  try {
    const marcas = await prisma.marca.findMany({
      include: {
        productos: true,
      },
    });

    return NextResponse.json(marcas);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching brands' }, { status: 500 });
  }
}

// POST create brand
export async function POST(request: Request) {
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

    const marca = await prisma.marca.create({
      data: {
        nombre,
        logoUrl,
        esMarcaBlanca,
        activo,
      },
    });

    return NextResponse.json(marca);
  } catch (error) {
    return NextResponse.json({ error: 'Error creating brand' }, { status: 500 });
  }
} 