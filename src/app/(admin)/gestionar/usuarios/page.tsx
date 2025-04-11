"use client"

// Página de administración de usuarios
// Funcionalidades:
// - Listar todos los usuarios administrativos
// - Filtrar usuarios por nombre, email o tipo
// - Crear nuevos usuarios
// - Ver, editar, bloquear o eliminar usuarios

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Check,
  FileEdit,
  Filter,
  Lock,
  MoreHorizontal, 
  Plus, 
  Search, 
  Trash2, 
  Unlock, 
  UserCog,
  UserX
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toastSuccess, toastError, toastInfo } from "@/lib/toast"

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

// Componente para el estado del usuario (activo/inactivo)
const EstadoUsuario = ({ activo, bloqueado }: { activo: boolean, bloqueado: boolean }) => {
  if (bloqueado) {
    return <Badge variant="destructive">Bloqueado</Badge>
  }
  return activo ? 
    <Badge className="bg-green-600 hover:bg-green-700">Activo</Badge> : 
    <Badge variant="secondary">Inactivo</Badge>
}

export default function AdminUsuariosPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([]);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    async function fetchUsuarios() {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/users');
        if (!res.ok) {
          throw new Error('Error al cargar usuarios');
        }
        const data = await res.json();
        
        if (data.success) {
          // Convertir fechas de string a Date
          const usuariosConFechas = data.data.map((user: any) => ({
            ...user,
            fechaRegistro: new Date(user.fechaRegistro),
            ultimaConexion: user.ultimaConexion ? new Date(user.ultimaConexion) : null
          }));
          
          setUsuarios(usuariosConFechas);
          setFilteredUsuarios(usuariosConFechas);
        } else {
          toastInfo(data.message || "No se pudieron cargar los usuarios");
        }
      } catch (error) {
        console.error("Error fetching usuarios:", error);
        toastError("No se pudo conectar con el servidor");
      } finally {
        setLoading(false);
      }
    }

    fetchUsuarios();
  }, []);

  // Filtrar usuarios cuando cambia la búsqueda
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsuarios(usuarios);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = usuarios.filter(
        usuario => 
          usuario.nombre.toLowerCase().includes(query) ||
          usuario.email.toLowerCase().includes(query) ||
          usuario.tipoUsuario.descripcion.toLowerCase().includes(query)
      );
      setFilteredUsuarios(filtered);
    }
  }, [searchQuery, usuarios]);

  // Funciones para acciones sobre usuarios
  const handleVerDetalles = (userId: number) => {
    router.push(`/gestionar/usuarios/${userId}`);
  };

  const handleEditar = (userId: number) => {
    router.push(`/gestionar/usuarios/${userId}/editar`);
  };

  const handleCambiarBloqueo = async (userId: number, bloqueado: boolean) => {
    try {
      // Confirmar antes de cambiar el estado
      const accion = bloqueado ? "desbloquear" : "bloquear";
      if (!confirm(`¿Estás seguro que deseas ${accion} este usuario?`)) {
        return;
      }
      
      const res = await fetch(`/api/admin/users/${userId}/bloqueo`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          bloqueado: !bloqueado,
          razon: !bloqueado ? "Acción administrativa" : undefined
        }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        // Actualizar usuarios en el estado
        setUsuarios(prevUsers => 
          prevUsers.map(user => 
            user.id === userId ? { ...user, bloqueado: !bloqueado } : user
          )
        );
        
        toastSuccess(data.message);
      } else {
        toastError(data.message);
      }
    } catch (error) {
      console.error("Error al cambiar estado de bloqueo:", error);
      toastError("No se pudo completar la acción");
    }
  };

  const handleCambiarEstado = async (userId: number, activo: boolean) => {
    try {
      // Confirmar antes de cambiar el estado
      const accion = activo ? "desactivar" : "activar";
      if (!confirm(`¿Estás seguro que deseas ${accion} este usuario?`)) {
        return;
      }
      
      const res = await fetch(`/api/admin/users/${userId}/estado`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ activo: !activo }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        // Actualizar usuarios en el estado
        setUsuarios(prevUsers => 
          prevUsers.map(user => 
            user.id === userId ? { ...user, activo: !activo } : user
          )
        );
        
        toastSuccess(data.message);
      } else {
        toastError(data.message);
      }
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      toastError("No se pudo completar la acción");
    }
  };

  const handleEliminar = async (userId: number) => {
    try {
      // Confirmar antes de eliminar
      if (!confirm("¿Estás seguro que deseas eliminar este usuario? Esta acción no se puede deshacer.")) {
        return;
      }
      
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });
      
      const data = await res.json();
      
      if (data.success) {
        // Eliminar usuario del estado
        setUsuarios(prevUsers => prevUsers.filter(user => user.id !== userId));
        
        toastSuccess("Usuario eliminado correctamente");
      } else {
        toastError(data.message);
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      toastError("No se pudo eliminar el usuario");
    }
  };

  const handleCrearUsuario = () => {
    router.push('/gestionar/usuarios/nuevo');
  };

  return (
    <div className="max-w-5xl mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            className="flex items-center gap-2"
            onClick={handleCrearUsuario}
          >
            <Plus className="h-4 w-4" />
            Nuevo Usuario
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Usuarios Administrativos</CardTitle>
          <CardDescription>
            Gestiona los accesos y permisos de los usuarios administrativos del sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por nombre, email o tipo..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">Cargando usuarios...</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Registro</TableHead>
                    <TableHead>Última Conexión</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsuarios.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No se encontraron usuarios con los criterios de búsqueda
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsuarios.map((usuario) => (
                      <TableRow key={usuario.id}>
                        <TableCell className="font-medium">{usuario.nombre}</TableCell>
                        <TableCell>{usuario.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{usuario.tipoUsuario.descripcion}</Badge>
                        </TableCell>
                        <TableCell>
                          <EstadoUsuario activo={usuario.activo} bloqueado={usuario.bloqueado} />
                        </TableCell>
                        <TableCell>
                          {format(new Date(usuario.fechaRegistro), 'dd/MM/yyyy', {locale: es})}
                        </TableCell>
                        <TableCell>
                          {usuario.ultimaConexion 
                            ? format(new Date(usuario.ultimaConexion), 'dd/MM/yyyy HH:mm', {locale: es}) 
                            : "Nunca"}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleVerDetalles(usuario.id)}>
                                <UserCog className="mr-2 h-4 w-4" />
                                Ver detalles
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditar(usuario.id)}>
                                <FileEdit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleCambiarEstado(usuario.id, usuario.activo)}>
                                {usuario.activo ? (
                                  <>
                                    <UserX className="mr-2 h-4 w-4" />
                                    Desactivar
                                  </>
                                ) : (
                                  <>
                                    <Check className="mr-2 h-4 w-4" />
                                    Activar
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleCambiarBloqueo(usuario.id, usuario.bloqueado)}>
                                {usuario.bloqueado ? (
                                  <>
                                    <Unlock className="mr-2 h-4 w-4" />
                                    Desbloquear
                                  </>
                                ) : (
                                  <>
                                    <Lock className="mr-2 h-4 w-4" />
                                    Bloquear
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleEliminar(usuario.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 