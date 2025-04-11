/**
 * Base API Routes for Categoria (Category)
 * 
 * Endpoints:
 * GET /api/categorias - Get all categories with their relationships
 * POST /api/categorias - Create a new category
 * 
 * Relationships included:
 * - categoriaPadre (parent category)
 * - subcategorias (subcategories)
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all categories
export async function GET() {
  try {
    const categorias = await prisma.categoria.findMany({
      include: {
        categoriaPadre: true,
        subcategorias: true,
      },
    });

    return NextResponse.json(categorias);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching categories' }, { status: 500 });
  }
}

// POST create category
export async function POST(request: Request) {
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

    const categoria = await prisma.categoria.create({
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
    return NextResponse.json({ error: 'Error creating category' }, { status: 500 });
  }
} 