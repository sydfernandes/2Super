// API para gestionar el estado (activación/desactivación) de un usuario administrador
// Funcionalidades:
// - Obtener el estado actual de un usuario
// - Cambiar el estado de un usuario (activar/desactivar)

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// Tipo para usuario administrador
type TipoUsuario = {
  id: number;
  valor: string;
  descripcion: string;
}

type Usuario = {
  id: number;
  nombre: string;
  email: string;
  telefonoMovil: string | null;
  activo: boolean;
  bloqueado: boolean;
  fechaRegistro: Date;
  ultimaConexion: Date | null;
  tipoUsuario: TipoUsuario;
}

// Datos mock para desarrollo (en una implementación real, sería una conexión a DB)
const mockUsers: Usuario[] = [
  {
    id: 1,
    nombre: "Admin Principal",
    email: "admin@mail.com",
    telefonoMovil: "+34 666 777 888",
    activo: true,
    bloqueado: false,
    fechaRegistro: new Date('2023-01-15'),
    ultimaConexion: new Date('2024-04-10'),
    tipoUsuario: {
      id: 1,
      valor: "admin",
      descripcion: "Administrador del sistema"
    }
  },
  {
    id: 2,
    nombre: "Moderador de Contenido",
    email: "moderador@mail.com",
    telefonoMovil: "+34 666 111 222",
    activo: true,
    bloqueado: false,
    fechaRegistro: new Date('2023-03-20'),
    ultimaConexion: new Date('2024-04-09'),
    tipoUsuario: {
      id: 2,
      valor: "moderador",
      descripcion: "Moderador de contenido"
    }
  },
  {
    id: 3,
    nombre: "Editor Web",
    email: "editor@mail.com",
    telefonoMovil: "+34 666 333 444",
    activo: false,
    bloqueado: false,
    fechaRegistro: new Date('2023-05-10'),
    ultimaConexion: new Date('2023-12-15'),
    tipoUsuario: {
      id: 3,
      valor: "editor",
      descripcion: "Editor de contenido web"
    }
  }
];

// Schema para validar la actualización del estado
const actualizarEstadoSchema = z.object({
  activo: z.boolean({
    required_error: "El estado 'activo' es requerido",
    invalid_type_error: "El estado 'activo' debe ser un booleano"
  })
});

// GET - Obtener estado del usuario
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

    const usuario = mockUsers.find(u => u.id === userId);
    if (!usuario) {
      return NextResponse.json({
        success: false,
        message: "Usuario no encontrado"
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      estado: {
        activo: usuario.activo,
        bloqueado: usuario.bloqueado
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Error al obtener estado:", error);
    return NextResponse.json({
      success: false,
      message: "Error al procesar la solicitud"
    }, { status: 500 });
  }
}

// PATCH - Actualizar estado del usuario
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

    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return NextResponse.json({
        success: false,
        message: "Usuario no encontrado"
      }, { status: 404 });
    }

    // Si es el administrador principal (ID 1), impedir su desactivación
    if (userId === 1) {
      return NextResponse.json({
        success: false,
        message: "No se puede cambiar el estado del administrador principal"
      }, { status: 403 });
    }

    const body = await request.json();
    
    // Validar datos de entrada
    const result = actualizarEstadoSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({
        success: false,
        message: "Datos inválidos",
        errors: result.error.format()
      }, { status: 400 });
    }

    // Actualizar estado del usuario
    const nuevoEstado = result.data.activo;
    mockUsers[userIndex].activo = nuevoEstado;

    // Simular registro de la acción en log
    console.log(`Usuario ${userId} ${nuevoEstado ? 'activado' : 'desactivado'} por administrador`);

    // Si se desactiva, registrar la fecha de última acción
    let mensaje = nuevoEstado 
      ? "Usuario activado correctamente"
      : "Usuario desactivado correctamente";

    return NextResponse.json({
      success: true,
      message: mensaje,
      estado: {
        activo: mockUsers[userIndex].activo,
        bloqueado: mockUsers[userIndex].bloqueado
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar estado:", error);
    return NextResponse.json({
      success: false,
      message: "Error al procesar la solicitud"
    }, { status: 500 });
  }
} 