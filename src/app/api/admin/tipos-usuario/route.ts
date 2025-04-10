// API para obtener los tipos de usuario desde la base de datos
// Funcionalidades:
// - Obtener todos los tipos de usuario disponibles

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// GET - Obtener todos los tipos de usuario
export async function GET(request: NextRequest) {
  try {
    // Obtener todos los tipos de usuario de la base de datos
    const tiposUsuario = await prisma.tipoUsuario.findMany({
      orderBy: {
        id: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      data: tiposUsuario
    }, { status: 200 });
  } catch (error) {
    console.error("Error al obtener tipos de usuario:", error);
    return NextResponse.json({
      success: false,
      message: "Error al procesar la solicitud"
    }, { status: 500 });
  }
} 