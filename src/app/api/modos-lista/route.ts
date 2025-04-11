/**
 * API Routes for ModoLista (List Mode)
 * 
 * Endpoints:
 * GET /api/modos-lista - Get all list modes
 * GET /api/modos-lista/[id] - Get a specific list mode
 * POST /api/modos-lista - Create a new list mode
 * PUT /api/modos-lista/[id] - Update a list mode
 * DELETE /api/modos-lista/[id] - Delete a list mode
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all list modes
export async function GET() {
  try {
    const modos = await prisma.modoLista.findMany();
    return NextResponse.json(modos);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching list modes' }, { status: 500 });
  }
}

// POST new list mode
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { valor, descripcion } = body;

    if (!valor || !descripcion) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const modo = await prisma.modoLista.create({
      data: {
        valor,
        descripcion,
      },
    });

    return NextResponse.json(modo, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating list mode' }, { status: 500 });
  }
} 