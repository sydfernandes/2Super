// API para gestión de usuarios administradores
// Funcionalidades:
// - Listar todos los usuarios de tipo admin
// - Crear nuevos usuarios admin
// - Filtrar usuarios admin por nombre o email

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/db"

// Validación de entrada para crear/actualizar usuario
const userSchema = z.object({
  nombre: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  telefonoMovil: z.string().nullable().optional(),
  activo: z.boolean().optional().default(false), // Por defecto inactivo para administradores
  bloqueado: z.boolean().optional().default(false),
  autenticacionEmail: z.boolean().optional().default(true),
  autenticacionSms: z.boolean().optional().default(false),
  tipoUsuarioId: z.number().optional().default(1)
});

// GET - Obtener todos los usuarios admin o filtrar por búsqueda
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('search')?.toLowerCase() || '';
    const tipoParam = searchParams.get('tipo');
    
    // Definir filtro de tipo de usuario
    const tipoUsuarioFilter = tipoParam 
      ? { tipoUsuarioId: parseInt(tipoParam) } 
      : { tipoUsuarioId: { in: [1, 2, 3] } }; // Si no se especifica, incluye todos los tipos de usuario

    // Buscamos los usuarios que cumplan con los criterios de filtrado
    const usuarios = await prisma.usuario.findMany({
      where: {
        OR: [
          {
            nombre: {
              contains: searchQuery,
              mode: 'insensitive'
            }
          },
          {
            email: {
              contains: searchQuery,
              mode: 'insensitive'
            }
          }
        ],
        AND: tipoUsuarioFilter
      },
      include: {
        tipoUsuario: true
      }
    });

    // Transformamos el resultado para mantener el formato esperado por el cliente
    const formattedUsuarios = usuarios.map(user => ({
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      telefonoMovil: user.telefonoMovil,
      activo: user.activo,
      bloqueado: user.bloqueado,
      autenticacionEmail: user.autenticacionEmail,
      autenticacionSms: user.autenticacionSms,
      fechaRegistro: user.fechaRegistro,
      ultimaConexion: user.ultimaConexion,
      tipoUsuario: {
        id: user.tipoUsuario.id,
        valor: user.tipoUsuario.valor,
        descripcion: user.tipoUsuario.descripcion
      }
    }));

    return NextResponse.json({
      success: true,
      data: formattedUsuarios
    }, { status: 200 });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return NextResponse.json({
      success: false,
      message: "Error al procesar la solicitud"
    }, { status: 500 });
  }
}

// POST - Crear nuevo usuario admin
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar datos de entrada
    const result = userSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({
        success: false,
        message: "Datos de usuario inválidos",
        errors: result.error.format()
      }, { status: 400 });
    }

    // Verificar si ya existe un usuario con el mismo email
    const existingUser = await prisma.usuario.findUnique({
      where: {
        email: body.email
      }
    });

    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: "Ya existe un usuario con este email"
      }, { status: 409 });
    }
    
    // Crear nuevo usuario en la base de datos
    const newUser = await prisma.usuario.create({
      data: {
        nombre: body.nombre,
        email: body.email,
        telefonoMovil: body.telefonoMovil || null,
        activo: body.activo ?? false,
        bloqueado: body.bloqueado ?? false,
        autenticacionEmail: body.autenticacionEmail ?? true,
        autenticacionSms: body.autenticacionSms ?? false,
        tipoUsuarioId: body.tipoUsuarioId || 1,
        fechaRegistro: new Date()
      },
      include: {
        tipoUsuario: true
      }
    });
    
    return NextResponse.json({
      success: true,
      data: {
        id: newUser.id,
        nombre: newUser.nombre,
        email: newUser.email,
        telefonoMovil: newUser.telefonoMovil,
        activo: newUser.activo,
        bloqueado: newUser.bloqueado,
        autenticacionEmail: newUser.autenticacionEmail,
        autenticacionSms: newUser.autenticacionSms,
        fechaRegistro: newUser.fechaRegistro,
        ultimaConexion: newUser.ultimaConexion,
        tipoUsuario: {
          id: newUser.tipoUsuario.id,
          valor: newUser.tipoUsuario.valor,
          descripcion: newUser.tipoUsuario.descripcion
        }
      }
    }, { status: 201 });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    return NextResponse.json({
      success: false,
      message: "Error al procesar la solicitud"
    }, { status: 500 });
  }
} 