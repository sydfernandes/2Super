/**
 * Base API Routes for Etiqueta (Tag)
 * 
 * Endpoints:
 * GET /api/etiquetas - Get all tags with their relationships
 * POST /api/etiquetas - Create a new tag
 * 
 * Relationships included:
 * - productos (products)
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all tags
export async function GET() {
  try {
    const etiquetas = await prisma.etiqueta.findMany({
      include: {
        productos: true,
      },
    });

    return NextResponse.json(etiquetas);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching tags' }, { status: 500 });
  }
}

// POST create tag
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      valor,
      descripcion,
    } = body;

    if (!valor || !descripcion) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const etiqueta = await prisma.etiqueta.create({
      data: {
        valor,
        descripcion,
      },
    });

    return NextResponse.json(etiqueta);
  } catch (error) {
    return NextResponse.json({ error: 'Error creating tag' }, { status: 500 });
  }
} 