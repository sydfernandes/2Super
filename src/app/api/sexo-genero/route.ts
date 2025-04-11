/**
 * API Routes for SexoGenero (Gender)
 * 
 * Endpoints:
 * GET /api/sexo-genero - Get all genders
 * GET /api/sexo-genero/[id] - Get a specific gender
 * POST /api/sexo-genero - Create a new gender
 * PUT /api/sexo-genero/[id] - Update a gender
 * DELETE /api/sexo-genero/[id] - Delete a gender
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all genders
export async function GET() {
  try {
    const generos = await prisma.sexoGenero.findMany();
    return NextResponse.json(generos);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching genders' }, { status: 500 });
  }
}

// POST new gender
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { valor, descripcion } = body;

    if (!valor || !descripcion) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const genero = await prisma.sexoGenero.create({
      data: {
        valor,
        descripcion,
      },
    });

    return NextResponse.json(genero, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating gender' }, { status: 500 });
  }
} 