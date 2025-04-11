/**
 * API Routes for SexoGenero (Gender)
 * 
 * Endpoints:
 * GET /api/sexos-genero - Get all genders
 * POST /api/sexos-genero - Create a new gender
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all genders
export async function GET() {
  try {
    const sexos = await prisma.sexoGenero.findMany();
    return NextResponse.json(sexos);
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

    const sexo = await prisma.sexoGenero.create({
      data: {
        valor,
        descripcion,
      },
    });

    return NextResponse.json(sexo, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating gender' }, { status: 500 });
  }
} 