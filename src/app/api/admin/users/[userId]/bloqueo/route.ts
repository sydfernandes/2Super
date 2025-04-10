// API para gestionar el bloqueo/desbloqueo de un usuario administrador
// Funcionalidades:
// - Obtener el estado de bloqueo actual de un usuario
// - Cambiar el estado de bloqueo de un usuario (bloquear/desbloquear)

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

// Schema para validar la actualización del estado de bloqueo
const actualizarBloqueoSchema = z.object({
  bloqueado: z.boolean({
    required_error: "El estado 'bloqueado' es requerido",
    invalid_type_error: "El estado 'bloqueado' debe ser un booleano"
  }),
  razon: z.string().min(5, "La razón debe tener al menos 5 caracteres").optional()
});

// GET - Obtener estado de bloqueo del usuario
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
        bloqueado: usuario.bloqueado
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Error al obtener estado de bloqueo:", error);
    return NextResponse.json({
      success: false,
      message: "Error al procesar la solicitud"
    }, { status: 500 });
  }
}

// PATCH - Actualizar estado de bloqueo del usuario
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

    // Si es el administrador principal (ID 1), impedir su bloqueo
    if (userId === 1) {
      return NextResponse.json({
        success: false,
        message: "No se puede bloquear al administrador principal"
      }, { status: 403 });
    }

    const body = await request.json();
    
    // Validar datos de entrada
    const result = actualizarBloqueoSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({
        success: false,
        message: "Datos inválidos",
        errors: result.error.format()
      }, { status: 400 });
    }

    // Actualizar estado de bloqueo del usuario
    const nuevoEstadoBloqueo = result.data.bloqueado;
    mockUsers[userIndex].bloqueado = nuevoEstadoBloqueo;

    // Registrar la razón del bloqueo (en caso real se guardaría en DB)
    const razon = result.data.razon || "No especificada";
    
    // Simular registro de la acción en log
    console.log(`Usuario ${userId} ${nuevoEstadoBloqueo ? 'bloqueado' : 'desbloqueado'} por administrador. Razón: ${razon}`);

    // Mensaje según la acción
    let mensaje = nuevoEstadoBloqueo 
      ? "Usuario bloqueado correctamente"
      : "Usuario desbloqueado correctamente";

    return NextResponse.json({
      success: true,
      message: mensaje,
      estado: {
        bloqueado: mockUsers[userIndex].bloqueado,
        razon: nuevoEstadoBloqueo ? razon : null
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar estado de bloqueo:", error);
    return NextResponse.json({
      success: false,
      message: "Error al procesar la solicitud"
    }, { status: 500 });
  }
} 