/**
 * Base API Routes for NivelPrivacidad (Privacy Level)
 * 
 * Endpoints:
 * GET /api/niveles-privacidad - Get all privacy levels with their relationships
 * POST /api/niveles-privacidad - Create a new privacy level
 * 
 * Relationships included:
 * - listas (lists)
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all privacy levels
export async function GET() {
  try {
    const nivelesPrivacidad = await prisma.nivelPrivacidad.findMany({
      include: {
        listas: true,
      },
    });

    return NextResponse.json(nivelesPrivacidad);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching privacy levels' }, { status: 500 });
  }
}

// POST create new privacy level
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

    const nivelPrivacidad = await prisma.nivelPrivacidad.create({
      data: {
        valor,
        descripcion,
      },
    });

    return NextResponse.json(nivelPrivacidad);
  } catch (error) {
    return NextResponse.json({ error: 'Error creating privacy level' }, { status: 500 });
  }
} 