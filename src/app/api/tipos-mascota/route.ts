/**
 * API Routes for TipoMascota (Pet Type)
 * 
 * Endpoints:
 * GET /api/tipos-mascota - Get all pet types
 * GET /api/tipos-mascota/[id] - Get a specific pet type
 * POST /api/tipos-mascota - Create a new pet type
 * PUT /api/tipos-mascota/[id] - Update a pet type
 * DELETE /api/tipos-mascota/[id] - Delete a pet type
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all pet types
export async function GET() {
  try {
    const tipos = await prisma.tipoMascota.findMany();
    return NextResponse.json(tipos);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching pet types' }, { status: 500 });
  }
}

// POST new pet type
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { valor, descripcion } = body;

    if (!valor || !descripcion) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const tipo = await prisma.tipoMascota.create({
      data: {
        valor,
        descripcion,
      },
    });

    return NextResponse.json(tipo, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating pet type' }, { status: 500 });
  }
} 