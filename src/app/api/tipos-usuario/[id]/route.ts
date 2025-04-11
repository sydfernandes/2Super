/**
 * Dynamic API Routes for TipoUsuario (User Type)
 * 
 * Endpoints:
 * GET /api/tipos-usuario/[id] - Get a specific user type
 * PUT /api/tipos-usuario/[id] - Update a user type
 * DELETE /api/tipos-usuario/[id] - Delete a user type
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET specific user type
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tipo = await prisma.tipoUsuario.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!tipo) {
      return NextResponse.json({ error: 'User type not found' }, { status: 404 });
    }

    return NextResponse.json(tipo);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching user type' }, { status: 500 });
  }
}

// PUT update user type
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { valor, descripcion } = body;

    if (!valor || !descripcion) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const tipo = await prisma.tipoUsuario.update({
      where: { id: parseInt(params.id) },
      data: {
        valor,
        descripcion,
      },
    });

    return NextResponse.json(tipo);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating user type' }, { status: 500 });
  }
}

// DELETE user type
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.tipoUsuario.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ message: 'User type deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting user type' }, { status: 500 });
  }
} 