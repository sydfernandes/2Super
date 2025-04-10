//Página de gestión de usuarios de tipo admin
//Funcionalidades:
// - Listar todos los usuarios de tipo admin
// - Crear nuevos usuarios admin
// - Editar usuarios admin existentes
// - Eliminar usuarios admin
// - Ver detalles de usuario admin específico
// - Filtrar usuarios admin por nombre o email
// - Ordenar usuarios admin por diferentes campos

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PlusCircle, Search, UserCog, X, MoreVertical, Ban, CheckCircle, AlertCircle, Edit, Trash2 } from "lucide-react"
import { prisma } from "@/lib/db"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Select,
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Interfaces para tipado
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
  autenticacionEmail: boolean;
  autenticacionSms: boolean;
  fechaRegistro: Date;
  ultimaConexion: Date | null;
  tipoUsuario: TipoUsuario;
}

// Componente para mostrar estado del usuario
const EstadoUsuario = ({ activo, bloqueado }: { activo: boolean, bloqueado: boolean }) => {
  if (bloqueado) {
    return <Badge variant="destructive" className="flex items-center gap-1">
      <Ban className="h-3 w-3" />
      Bloqueado
    </Badge>
  }
  
  if (activo) {
    return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center gap-1">
      <CheckCircle className="h-3 w-3" />
      Activo
    </Badge>
  }
  
  return <Badge variant="outline" className="flex items-center gap-1">
    <AlertCircle className="h-3 w-3" />
    Inactivo
  </Badge>
}

// Componente para formulario de creación/edición de usuario admin
function AdminUserForm({ 
  user, 
  onSubmit, 
  onCancel 
}: { 
  user?: Usuario, 
  onSubmit: (data: any) => void, 
  onCancel: () => void 
}) {
  const [formData, setFormData] = useState({
    nombre: user?.nombre || "",
    email: user?.email || "",
    telefonoMovil: user?.telefonoMovil || "",
    tipoUsuarioId: user?.tipoUsuario.id.toString() || "1",
    autenticacionEmail: user?.autenticacionEmail || true,
    autenticacionSms: user?.autenticacionSms || false,
    estado: user ? (user.bloqueado ? "bloqueado" : (user.activo ? "activo" : "inactivo")) : "inactivo",
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      tipoUsuarioId: parseInt(formData.tipoUsuarioId),
      activo: formData.estado === "activo",
      bloqueado: formData.estado === "bloqueado",
    };
    
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre completo</Label>
        <Input
          id="nombre"
          value={formData.nombre}
          onChange={(e) => handleChange("nombre", e.target.value)}
          placeholder="Nombre del administrador"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="correo@ejemplo.com"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="telefonoMovil">Teléfono móvil</Label>
        <Input
          id="telefonoMovil"
          value={formData.telefonoMovil || ""}
          onChange={(e) => handleChange("telefonoMovil", e.target.value)}
          placeholder="+34 XXX XXX XXX"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Tipo de usuario</Label>
        <Select
          value={formData.tipoUsuarioId}
          onValueChange={(value) => handleChange("tipoUsuarioId", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Tipo de usuario</SelectLabel>
              <SelectItem value="1">Administrador</SelectItem>
              <SelectItem value="2">Moderador</SelectItem>
              <SelectItem value="3">Editor</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>Métodos de autenticación</Label>
        <div className="flex flex-col gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="authEmail"
              checked={formData.autenticacionEmail}
              onCheckedChange={(checked) => handleChange("autenticacionEmail", checked)}
            />
            <Label htmlFor="authEmail" className="font-normal">Email</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="authSms"
              checked={formData.autenticacionSms}
              onCheckedChange={(checked) => handleChange("autenticacionSms", checked)}
            />
            <Label htmlFor="authSms" className="font-normal">SMS</Label>
          </div>
        </div>
      </div>
      
      {user && (
        <div className="space-y-2">
          <Label>Estado</Label>
          <RadioGroup
            value={formData.estado}
            onValueChange={(value) => handleChange("estado", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="activo" id="activo" />
              <Label htmlFor="activo" className="font-normal">Activo</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="inactivo" id="inactivo" />
              <Label htmlFor="inactivo" className="font-normal">Inactivo</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bloqueado" id="bloqueado" />
              <Label htmlFor="bloqueado" className="font-normal">Bloqueado</Label>
            </div>
          </RadioGroup>
        </div>
      )}
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {user ? "Guardar cambios" : "Crear administrador"}
        </Button>
      </DialogFooter>
    </form>
  )
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Fetch users from API
  const fetchAdminUsers = async () => {
    setLoading(true);
    try {
      // Añadir filtro para mostrar solo administradores (tipoUsuarioId = 2)
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.append('search', searchTerm);
      queryParams.append('tipo', '2'); // Filtrar solo administradores
      
      const response = await fetch(`/api/admin/users?${queryParams.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        // Convertir fechas de string a objetos Date
        const usersWithDates = data.data.map((user: any) => ({
          ...user,
          fechaRegistro: new Date(user.fechaRegistro),
          ultimaConexion: user.ultimaConexion ? new Date(user.ultimaConexion) : null
        }));
        setUsuarios(usersWithDates);
      } else {
        toast.error("Error al cargar usuarios: " + data.message);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  // Fetch users on initial load and when search term changes
  useEffect(() => {
    fetchAdminUsers();
  }, [searchTerm]);

  // Handle user creation
  const handleCreateUser = async (userData: any) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Usuario creado correctamente");
        fetchAdminUsers(); // Refetch users
      } else {
        toast.error("Error al crear usuario: " + data.message);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Error al crear usuario");
    }
  };

  // Handle user update
  const handleUpdateUser = async (userData: any) => {
    if (!selectedUser) return;
    
    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Usuario actualizado correctamente");
        setIsEditDialogOpen(false);
        setSelectedUser(null);
        fetchAdminUsers(); // Refetch users
      } else {
        toast.error("Error al actualizar usuario: " + data.message);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Error al actualizar usuario");
    }
  };

  // Handle user deletion
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Usuario eliminado correctamente");
        setIsDeleteDialogOpen(false);
        setSelectedUser(null);
        fetchAdminUsers(); // Refetch users
      } else {
        toast.error("Error al eliminar usuario: " + data.message);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error al eliminar usuario");
    }
  };

  // Handle status change
  const handleToggleStatus = async (user: Usuario) => {
    try {
      // Determine what status change to make
      const newState = {
        activo: !user.activo,
        bloqueado: false
      };
      
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newState),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(
          `Usuario ${newState.activo ? "activado" : "desactivado"} correctamente`
        );
        fetchAdminUsers(); // Refetch users
      } else {
        toast.error("Error al cambiar estado: " + data.message);
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("Error al cambiar estado");
    }
  };

  // Handle block/unblock
  const handleToggleBlock = async (user: Usuario) => {
    try {
      const newState = {
        bloqueado: !user.bloqueado
      };
      
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newState),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(
          `Usuario ${newState.bloqueado ? "bloqueado" : "desbloqueado"} correctamente`
        );
        fetchAdminUsers(); // Refetch users
      } else {
        toast.error("Error al cambiar bloqueo: " + data.message);
      }
    } catch (error) {
      console.error("Error toggling block:", error);
      toast.error("Error al cambiar bloqueo");
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Gestión de Administradores</CardTitle>
            <CardDescription>Gestionar usuarios administrativos del sistema</CardDescription>
          </div>
          <Button 
            className="flex items-center gap-2"
            onClick={() => router.push('/configurar/admin/nuevo')}
          >
            <PlusCircle className="h-4 w-4" />
            Nuevo Administrador
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o email..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Última conexión</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Cargando administradores...
                    </TableCell>
                  </TableRow>
                ) : usuarios.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No hay administradores que coincidan con la búsqueda
                    </TableCell>
                  </TableRow>
                ) : (
                  usuarios.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.nombre}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.tipoUsuario.descripcion}</TableCell>
                      <TableCell>
                        <EstadoUsuario activo={user.activo} bloqueado={user.bloqueado} />
                      </TableCell>
                      <TableCell>
                        {user.ultimaConexion 
                          ? user.ultimaConexion.toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })
                          : "Nunca"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Abrir menú</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem 
                              onClick={() => {
                                router.push(`/configurar/admin/editar/${user.id}`);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleToggleStatus(user)}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              {user.activo ? "Desactivar" : "Activar"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleToggleBlock(user)}
                            >
                              <Ban className="mr-2 h-4 w-4" />
                              {user.bloqueado ? "Desbloquear" : "Bloquear"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={() => {
                                setSelectedUser(user);
                                setIsDeleteDialogOpen(true);
                              }}
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
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Eliminar administrador</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea eliminar este usuario? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}