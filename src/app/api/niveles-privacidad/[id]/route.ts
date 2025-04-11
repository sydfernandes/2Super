/**
 * Dynamic API Routes for NivelPrivacidad (Privacy Level)
 * 
 * Endpoints:
 * GET /api/niveles-privacidad/[id] - Get a specific privacy level
 * PUT /api/niveles-privacidad/[id] - Update a privacy level
 * DELETE /api/niveles-privacidad/[id] - Delete a privacy level
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET specific privacy level
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const nivel = await prisma.nivelPrivacidad.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!nivel) {
      return NextResponse.json({ error: 'Privacy level not found' }, { status: 404 });
    }

    return NextResponse.json(nivel);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching privacy level' }, { status: 500 });
  }
}

// PUT update privacy level
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

    const nivel = await prisma.nivelPrivacidad.update({
      where: { id: parseInt(params.id) },
      data: {
        valor,
        descripcion,
      },
    });

    return NextResponse.json(nivel);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating privacy level' }, { status: 500 });
  }
}

// DELETE privacy level
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.nivelPrivacidad.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ message: 'Privacy level deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting privacy level' }, { status: 500 });
  }
} 