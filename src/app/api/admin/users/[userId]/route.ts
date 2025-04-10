// API para operaciones específicas de usuario administrador por ID
// Funcionalidades:
// - Obtener detalles de un usuario admin específico
// - Actualizar datos de un usuario admin existente
// - Eliminar un usuario admin
// - Cambiar estado (activar/desactivar)
// - Bloquear/desbloquear usuario

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/db"

// Validación de entrada para actualizar usuario
const updateUserSchema = z.object({
  nombre: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }).optional(),
  email: z.string().email({ message: "Email inválido" }).optional(),
  telefonoMovil: z.string().nullable().optional(),
  activo: z.boolean().optional(),
  bloqueado: z.boolean().optional(),
  autenticacionEmail: z.boolean().optional(),
  autenticacionSms: z.boolean().optional(),
  tipoUsuarioId: z.number().optional()
});

// GET - Obtener usuario por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId);
    if (isNaN(userId)) {
      return NextResponse.json({
        success: false,
        message: "ID de usuario inválido"
      }, { status: 400 });
    }

    const user = await prisma.usuario.findUnique({
      where: { id: userId },
      include: { tipoUsuario: true }
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Usuario no encontrado"
      }, { status: 404 });
    }

    // Si estamos en la sección de administradores, verificar que el usuario es de tipo admin (tipoUsuarioId = 2)
    if (request.url.includes('/admin/') && user.tipoUsuarioId !== 2) {
      return NextResponse.json({
        success: false,
        message: "Este usuario no es un administrador"
      }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      data: {
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
        tipoUsuarioId: user.tipoUsuarioId,
        tipoUsuario: {
          id: user.tipoUsuario.id,
          valor: user.tipoUsuario.valor,
          descripcion: user.tipoUsuario.descripcion
        }
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    return NextResponse.json({
      success: false,
      message: "Error al procesar la solicitud"
    }, { status: 500 });
  }
}

// PATCH - Actualizar usuario
export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId);
    if (isNaN(userId)) {
      return NextResponse.json({
        success: false,
        message: "ID de usuario inválido"
      }, { status: 400 });
    }

    // Verificar que el usuario exista
    const existingUser = await prisma.usuario.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      return NextResponse.json({
        success: false,
        message: "Usuario no encontrado"
      }, { status: 404 });
    }

    const body = await request.json();
    
    // Validar datos de entrada
    const result = updateUserSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({
        success: false,
        message: "Datos de usuario inválidos",
        errors: result.error.format()
      }, { status: 400 });
    }

    // Si se está actualizando el email, verificar que no exista ya otro usuario con ese email
    if (body.email && body.email !== existingUser.email) {
      const emailExists = await prisma.usuario.findUnique({
        where: { email: body.email }
      });

      if (emailExists) {
        return NextResponse.json({
          success: false,
          message: "Ya existe otro usuario con este email"
        }, { status: 409 });
      }
    }

    // Preparar los datos para actualizar (solo los campos proporcionados)
    const updateData: any = {};
    if (body.nombre !== undefined) updateData.nombre = body.nombre;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.telefonoMovil !== undefined) updateData.telefonoMovil = body.telefonoMovil;
    if (body.activo !== undefined) updateData.activo = body.activo;
    if (body.bloqueado !== undefined) updateData.bloqueado = body.bloqueado;
    if (body.autenticacionEmail !== undefined) updateData.autenticacionEmail = body.autenticacionEmail;
    if (body.autenticacionSms !== undefined) updateData.autenticacionSms = body.autenticacionSms;
    if (body.tipoUsuarioId !== undefined) updateData.tipoUsuarioId = body.tipoUsuarioId;

    // Actualizar usuario en la base de datos
    const updatedUser = await prisma.usuario.update({
      where: { id: userId },
      data: updateData,
      include: { tipoUsuario: true }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updatedUser.id,
        nombre: updatedUser.nombre,
        email: updatedUser.email,
        telefonoMovil: updatedUser.telefonoMovil,
        activo: updatedUser.activo,
        bloqueado: updatedUser.bloqueado,
        autenticacionEmail: updatedUser.autenticacionEmail,
        autenticacionSms: updatedUser.autenticacionSms,
        fechaRegistro: updatedUser.fechaRegistro,
        ultimaConexion: updatedUser.ultimaConexion,
        tipoUsuario: {
          id: updatedUser.tipoUsuario.id,
          valor: updatedUser.tipoUsuario.valor,
          descripcion: updatedUser.tipoUsuario.descripcion
        }
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return NextResponse.json({
      success: false,
      message: "Error al procesar la solicitud"
    }, { status: 500 });
  }
}

// DELETE - Eliminar usuario
export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId);
    if (isNaN(userId)) {
      return NextResponse.json({
        success: false,
        message: "ID de usuario inválido"
      }, { status: 400 });
    }

    // Verificar que el usuario exista
    const existingUser = await prisma.usuario.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      return NextResponse.json({
        success: false,
        message: "Usuario no encontrado"
      }, { status: 404 });
    }

    // No permitir eliminar ciertos usuarios clave (como el admin principal)
    if (userId === 1) {
      return NextResponse.json({
        success: false,
        message: "No se puede eliminar el administrador principal"
      }, { status: 403 });
    }

    // Eliminar usuario
    await prisma.usuario.delete({
      where: { id: userId }
    });

    return NextResponse.json({
      success: true,
      message: "Usuario eliminado correctamente"
    }, { status: 200 });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return NextResponse.json({
      success: false,
      message: "Error al procesar la solicitud"
    }, { status: 500 });
  }
} 