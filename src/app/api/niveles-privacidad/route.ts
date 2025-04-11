/**
 * API Routes for NivelPrivacidad (Privacy Level)
 * 
 * Endpoints:
 * GET /api/niveles-privacidad - Get all privacy levels
 * GET /api/niveles-privacidad/[id] - Get a specific privacy level
 * POST /api/niveles-privacidad - Create a new privacy level
 * PUT /api/niveles-privacidad/[id] - Update a privacy level
 * DELETE /api/niveles-privacidad/[id] - Delete a privacy level
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all privacy levels
export async function GET() {
  try {
    const niveles = await prisma.nivelPrivacidad.findMany();
    return NextResponse.json(niveles);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching privacy levels' }, { status: 500 });
  }
}

// POST new privacy level
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { valor, descripcion } = body;

    if (!valor || !descripcion) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const nivel = await prisma.nivelPrivacidad.create({
      data: {
        valor,
        descripcion,
      },
    });

    return NextResponse.json(nivel, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating privacy level' }, { status: 500 });
  }
} 