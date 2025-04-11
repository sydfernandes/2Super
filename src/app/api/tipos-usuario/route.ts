/**
 * API Routes for TipoUsuario (User Type)
 * 
 * Endpoints:
 * GET /api/tipos-usuario - Get all user types
 * GET /api/tipos-usuario/[id] - Get a specific user type
 * POST /api/tipos-usuario - Create a new user type
 * PUT /api/tipos-usuario/[id] - Update a user type
 * DELETE /api/tipos-usuario/[id] - Delete a user type
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all user types
export async function GET() {
  try {
    const tipos = await prisma.tipoUsuario.findMany();
    return NextResponse.json(tipos);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching user types' }, { status: 500 });
  }
}

// POST new user type
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { valor, descripcion } = body;

    if (!valor || !descripcion) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const tipo = await prisma.tipoUsuario.create({
      data: {
        valor,
        descripcion,
      },
    });

    return NextResponse.json(tipo, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating user type' }, { status: 500 });
  }
} 