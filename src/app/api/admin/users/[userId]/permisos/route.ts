// API para gestionar los permisos de un usuario administrador
// Funcionalidades:
// - Obtener los permisos actuales de un usuario
// - Asignar nuevos permisos a un usuario
// - Revocar permisos de un usuario

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// Tipos para usuario administrador y permisos
type TipoUsuario = {
  id: number;
  valor: string;
  descripcion: string;
}

type Permiso = {
  id: number;
  codigo: string;
  nombre: string;
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
  permisos: Permiso[];
}

// Lista de permisos disponibles en el sistema
const permisosDisponibles: Permiso[] = [
  {
    id: 1,
    codigo: "ADMIN_USERS",
    nombre: "Administrar usuarios",
    descripcion: "Permite crear, modificar y eliminar usuarios"
  },
  {
    id: 2,
    codigo: "ADMIN_CONTENT",
    nombre: "Administrar contenido",
    descripcion: "Permite crear, modificar y eliminar contenido del sitio"
  },
  {
    id: 3,
    codigo: "VIEW_ANALYTICS",
    nombre: "Ver analíticas",
    descripcion: "Permite ver estadísticas y reportes"
  },
  {
    id: 4,
    codigo: "MANAGE_SETTINGS",
    nombre: "Gestionar configuraciones",
    descripcion: "Permite modificar configuraciones generales del sistema"
  },
  {
    id: 5,
    codigo: "EXPORT_DATA",
    nombre: "Exportar datos",
    descripcion: "Permite exportar datos del sistema"
  }
];

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
    },
    permisos: permisosDisponibles // Admin principal tiene todos los permisos
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
    },
    permisos: [permisosDisponibles[1], permisosDisponibles[2]] // Solo permisos de contenido y analíticas
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
    },
    permisos: [permisosDisponibles[1]] // Solo permiso de administrar contenido
  }
];

// Schema para validar la actualización de permisos
const actualizarPermisosSchema = z.object({
  permisos: z.array(z.number({
    required_error: "Los IDs de permisos son requeridos",
    invalid_type_error: "Los IDs de permisos deben ser números"
  }))
});

// GET - Obtener permisos del usuario
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
      permisos: usuario.permisos,
      permisosDisponibles: permisosDisponibles
    }, { status: 200 });
  } catch (error) {
    console.error("Error al obtener permisos:", error);
    return NextResponse.json({
      success: false,
      message: "Error al procesar la solicitud"
    }, { status: 500 });
  }
}

// PUT - Actualizar permisos del usuario
export async function PUT(
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

    // Si es el administrador principal (ID 1), no permitir cambios en sus permisos
    if (userId === 1) {
      return NextResponse.json({
        success: false,
        message: "No se pueden modificar los permisos del administrador principal"
      }, { status: 403 });
    }

    const body = await request.json();
    
    // Validar datos de entrada
    const result = actualizarPermisosSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({
        success: false,
        message: "Datos inválidos",
        errors: result.error.format()
      }, { status: 400 });
    }

    // Verificar que todos los IDs de permisos existen
    const nuevosPermisos = result.data.permisos;
    const permisosValidos = nuevosPermisos.every(id => 
      permisosDisponibles.some(p => p.id === id)
    );

    if (!permisosValidos) {
      return NextResponse.json({
        success: false,
        message: "Uno o más IDs de permisos no son válidos"
      }, { status: 400 });
    }

    // Asignar nuevos permisos
    const permisosAsignados = permisosDisponibles.filter(p => 
      nuevosPermisos.includes(p.id)
    );
    mockUsers[userIndex].permisos = permisosAsignados;
    
    // Simular registro de la acción en log
    console.log(`Permisos actualizados para el usuario ${userId}. Nuevos permisos: ${nuevosPermisos.join(', ')}`);

    return NextResponse.json({
      success: true,
      message: "Permisos actualizados correctamente",
      permisos: mockUsers[userIndex].permisos
    }, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar permisos:", error);
    return NextResponse.json({
      success: false,
      message: "Error al procesar la solicitud"
    }, { status: 500 });
  }
} 