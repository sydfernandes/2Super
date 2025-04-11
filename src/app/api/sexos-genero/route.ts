/**
 * Base API Routes for SexoGenero (Gender)
 * 
 * Endpoints:
 * GET /api/sexos-genero - Get all genders with their relationships
 * POST /api/sexos-genero - Create a new gender
 * 
 * Relationships included:
 * - usuarios (users)
 * - miembrosHogar (household members)
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all genders
export async function GET() {
  try {
    const sexosGenero = await prisma.sexoGenero.findMany({
      include: {
        usuarios: true,
        miembrosHogar: true,
      },
    });

    return NextResponse.json(sexosGenero);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching genders' }, { status: 500 });
  }
}

// POST create gender
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

    const sexoGenero = await prisma.sexoGenero.create({
      data: {
        valor,
        descripcion,
      },
    });

    return NextResponse.json(sexoGenero);
  } catch (error) {
    return NextResponse.json({ error: 'Error creating gender' }, { status: 500 });
  }
} 