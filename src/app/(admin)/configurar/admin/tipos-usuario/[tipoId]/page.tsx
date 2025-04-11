//Página de edición de tipo de usuario específico
//Funcionalidades:
// - Ver información detallada de un tipo de usuario
// - Editar los datos del tipo de usuario
// - Eliminar el tipo de usuario
// - Ver los usuarios asociados a este tipo

"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Trash2, Users, AlertCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"

// Componentes UI
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Tipos
type TipoUsuario = {
  id: number;
  valor: string;
  descripcion: string;
  _count?: {
    usuarios: number;
  };
};

type Usuario = {
  id: number;
  nombre: string;
  email: string;
  activo: boolean;
  bloqueado: boolean;
  ultimaConexion: Date | null;
};

export default function EditarTipoUsuarioPage({ params }: { params: Promise<{ tipoId: string }> }) {
  // Usando React.use() para desenvolver params según las recomendaciones de Next.js 15.3.0
  const { tipoId } = React.use(params);
  const router = useRouter();
  
  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usuariosLoading, setUsuariosLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    valor: "",
    descripcion: ""
  });
  
  // Cargar datos del tipo de usuario
  const fetchTipoUsuario = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/tipos-usuario/${tipoId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Error al cargar los datos del tipo de usuario");
      }
      
      setTipoUsuario(data.data);
      setFormData({
        valor: data.data.valor,
        descripcion: data.data.descripcion
      });
      
    } catch (error: any) {
      console.error("Error al cargar el tipo de usuario:", error);
      setError(error.message || "Error al cargar el tipo de usuario");
      toast.error(error.message || "Error al cargar el tipo de usuario");
    } finally {
      setLoading(false);
    }
  };
  
  // Cargar usuarios asociados a este tipo
  const fetchUsuarios = async () => {
    try {
      setUsuariosLoading(true);
      const response = await fetch(`/api/admin/tipos-usuario/${tipoId}/usuarios`);
      const data = await response.json();
      
      if (data.success) {
        // Convertir fechas de string a objetos Date
        const usuariosConFechas = data.data.map((user: any) => ({
          ...user,
          ultimaConexion: user.ultimaConexion ? new Date(user.ultimaConexion) : null
        }));
        setUsuarios(usuariosConFechas);
      } else {
        toast.error("Error al cargar usuarios asociados: " + data.message);
      }
    } catch (error) {
      console.error("Error al cargar usuarios asociados:", error);
      toast.error("Error al cargar usuarios asociados");
    } finally {
      setUsuariosLoading(false);
    }
  };
  
  // Cargar datos iniciales
  useEffect(() => {
    fetchTipoUsuario();
    fetchUsuarios();
  }, [tipoId]);
  
  // Manejar cambios en el formulario
  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  // Guardar cambios
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.valor.trim() || formData.valor.length < 2) {
      toast.error("El identificador debe tener al menos 2 caracteres");
      return;
    }
    
    if (!formData.descripcion.trim() || formData.descripcion.length < 3) {
      toast.error("La descripción debe tener al menos 3 caracteres");
      return;
    }
    
    try {
      setSaving(true);
      const response = await fetch(`/api/admin/tipos-usuario/${tipoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        toast.error(data.message || "Error al actualizar el tipo de usuario");
        return;
      }
      
      toast.success("Tipo de usuario actualizado correctamente");
      
      // Actualizar los datos
      if (data.data) {
        setTipoUsuario(data.data);
      }
      
      router.push("/configurar/admin/tipos-usuario");
      
    } catch (error) {
      console.error("Error al actualizar el tipo de usuario:", error);
      toast.error("Error al actualizar el tipo de usuario");
    } finally {
      setSaving(false);
    }
  };
  
  // Eliminar tipo de usuario
  const handleDelete = async () => {
    try {
      setDeleting(true);
      const response = await fetch(`/api/admin/tipos-usuario/${tipoId}`, {
        method: "DELETE",
      });
      
      const data = await response.json();
      
      if (!data.success) {
        toast.error(data.message || "Error al eliminar el tipo de usuario");
        setDeleting(false);
        return;
      }
      
      toast.success("Tipo de usuario eliminado correctamente");
      router.push("/configurar/admin/tipos-usuario");
      
    } catch (error) {
      console.error("Error al eliminar el tipo de usuario:", error);
      toast.error("Error al eliminar el tipo de usuario");
      setDeleting(false);
    }
  };
  
  // Estado de carga
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p>Cargando información del tipo de usuario...</p>
      </div>
    );
  }
  
  // Estado de error
  if (error || !tipoUsuario) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || "No se pudo cargar el tipo de usuario"}
          </AlertDescription>
        </Alert>
        <Button asChild className="mt-4">
          <Link href="/configurar/admin/tipos-usuario">Volver a la lista de tipos</Link>
        </Button>
      </div>
    );
  }
  
  // Verificar si es un tipo protegido del sistema
  const esTipoProtegido = tipoUsuario.id <= 2;
  
  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/configurar/admin/tipos-usuario">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            Tipo de Usuario: {tipoUsuario.descripcion}
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          {!esTipoProtegido && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={deleting}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  {deleting ? "Eliminando..." : "Eliminar"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Esto eliminará permanentemente el tipo de usuario
                    "{tipoUsuario.descripcion}" del sistema.
                    
                    {tipoUsuario._count?.usuarios ? (
                      <Alert variant="destructive" className="mt-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>No se puede eliminar</AlertTitle>
                        <AlertDescription>
                          Este tipo de usuario tiene {tipoUsuario._count.usuarios} usuario(s) asociado(s).
                          Debes cambiar el tipo de estos usuarios antes de eliminar este tipo.
                        </AlertDescription>
                      </Alert>
                    ) : null}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    className="bg-red-600 hover:bg-red-700"
                    onClick={handleDelete}
                    disabled={!!tipoUsuario._count?.usuarios || deleting}
                  >
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          
          <Button onClick={handleSubmit} disabled={saving || esTipoProtegido}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </div>
      
      {esTipoProtegido && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Tipo de usuario protegido</AlertTitle>
          <AlertDescription>
            Este es un tipo de usuario básico del sistema y no puede ser modificado ni eliminado.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Información del Tipo de Usuario</CardTitle>
            <CardDescription>
              Datos básicos del tipo de usuario
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="valor">Identificador</Label>
                <Input 
                  id="valor" 
                  value={formData.valor}
                  onChange={(e) => handleInputChange("valor", e.target.value)}
                  disabled={esTipoProtegido}
                  placeholder="p.ej. admin"
                />
                <p className="text-sm text-muted-foreground">
                  Código único para identificar este tipo de usuario
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Input 
                  id="descripcion" 
                  value={formData.descripcion}
                  onChange={(e) => handleInputChange("descripcion", e.target.value)}
                  disabled={esTipoProtegido}
                  placeholder="p.ej. Administrador del sistema"
                />
                <p className="text-sm text-muted-foreground">
                  Nombre descriptivo que verán los usuarios
                </p>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Información del Sistema</h3>
                <Badge variant={esTipoProtegido ? "secondary" : "outline"}>
                  {esTipoProtegido ? "Protegido" : "Personalizado"}
                </Badge>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium">ID</p>
                  <p className="text-sm text-muted-foreground">{tipoUsuario.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Usuarios Asociados</p>
                  <p className="text-sm text-muted-foreground">
                    {tipoUsuario._count?.usuarios || 0} usuario(s)
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          
          {!esTipoProtegido && (
            <CardFooter className="flex justify-between border-t pt-6">
              <Button 
                variant="outline"
                onClick={() => {
                  // Restaurar valores originales
                  if (tipoUsuario) {
                    setFormData({
                      valor: tipoUsuario.valor,
                      descripcion: tipoUsuario.descripcion
                    });
                    toast.info("Valores restaurados");
                  }
                }}
              >
                Restaurar Valores
              </Button>
              <Button onClick={handleSubmit} disabled={saving}>
                {saving ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </CardFooter>
          )}
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Usuarios con este Tipo
              </CardTitle>
              <CardDescription>
                Lista de usuarios que tienen asignado este tipo
              </CardDescription>
            </div>
            <Badge>{usuarios.length}</Badge>
          </CardHeader>
          <CardContent>
            {usuariosLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : usuarios.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No hay usuarios con este tipo asignado
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Última Conexión</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usuarios.map(usuario => (
                      <TableRow key={usuario.id}>
                        <TableCell className="font-medium">{usuario.nombre}</TableCell>
                        <TableCell>{usuario.email}</TableCell>
                        <TableCell>
                          {usuario.bloqueado ? (
                            <Badge variant="destructive">Bloqueado</Badge>
                          ) : usuario.activo ? (
                            <Badge variant="outline" className="bg-green-100 text-green-800">Activo</Badge>
                          ) : (
                            <Badge variant="outline">Inactivo</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {usuario.ultimaConexion 
                            ? usuario.ultimaConexion.toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                              })
                            : "Nunca"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-center mt-8">
          <Button asChild size="lg" variant="outline" className="gap-2">
            <Link href="/configurar/admin/tipos-usuario">
              <ArrowLeft className="h-4 w-4" />
              Volver a Lista de Tipos de Usuario
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
