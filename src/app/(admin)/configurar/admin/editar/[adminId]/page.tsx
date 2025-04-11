//Página de gestión de un usuario de tipo admin específico
//Funcionalidades:
// - Ver información detallada de un usuario admin
// - Editar información del usuario admin
// - Cambiar estado (activar/desactivar)
// - Bloquear/desbloquear usuario
// - Eliminar usuario
// - Ver historial de actividad

"use client"

import React from "react"
import { ArrowLeft, Trash2, Save, AlertCircle, UserCog, Shield } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Loader2, RefreshCw } from "lucide-react"
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

// Tipos
type Usuario = {
  id: number;
  nombre: string;
  email: string;
  telefonoMovil: string | null;
  autenticacionEmail: boolean;
  autenticacionSms: boolean;
  fechaNacimiento: Date | null;
  codigoPostal: string | null;
  sexoId: number | null;
  fechaRegistro: Date;
  ultimaConexion: Date | null;
  activo: boolean;
  bloqueado: boolean;
  tipoUsuarioId: number;
  tipoUsuario: {
    id: number;
    valor: string;
    descripcion: string;
  };
}

export default function EditarAdminPage({ params }: { params: Promise<{ adminId: string }> }) {
  // Usando React.use() para desenvolver params según las recomendaciones de Next.js 15.3.0
  const { adminId } = React.use(params);
  const router = useRouter();
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefonoMovil: '',
    codigoPostal: '',
    activo: true,
    bloqueado: false,
    autenticacionEmail: true,
    autenticacionSms: false,
    tipoUsuarioId: 2 // Tipo administrador
  });

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/users/${adminId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al cargar los datos del administrador");
      }

      // Ya no es necesario validar aquí si es administrador, lo hace la API
      setUser(data.data);
      setFormData({
        nombre: data.data.nombre || "",
        email: data.data.email || "",
        telefonoMovil: data.data.telefonoMovil || "",
        codigoPostal: data.data.codigoPostal || "",
        activo: data.data.activo,
        bloqueado: data.data.bloqueado,
        autenticacionEmail: data.data.autenticacionEmail,
        autenticacionSms: data.data.autenticacionSms,
        tipoUsuarioId: data.data.tipoUsuarioId
      });
    } catch (error: any) {
      console.error("Error al cargar el usuario:", error);
      setError(error.message || "Error al cargar el usuario");
      toast.error(error.message || "Error al cargar el usuario");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [adminId]);
  
  const handleInputChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      // Validar email
      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        toast.error("Introduce un email válido");
        setSaving(false);
        return;
      }
      
      // Validar nombre
      if (!formData.nombre || formData.nombre.length < 3) {
        toast.error("El nombre debe tener al menos 3 caracteres");
        setSaving(false);
        return;
      }
      
      const response = await fetch(`/api/admin/users/${adminId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (!data.success) {
        toast.error(data.message || "Error al actualizar el usuario");
        return;
      }
      
      toast.success("Usuario actualizado correctamente");
      
      // Actualizar los datos del usuario en el estado
      if (data.data) {
        setUser({
          ...user,
          ...data.data
        });
      }
      
      router.push("/configurar/admin");
      
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      toast.error("Error al actualizar el usuario");
    } finally {
      setSaving(false);
    }
  };
  
  const deleteUser = async () => {
    if (confirm("¿Estás seguro que deseas eliminar este administrador? Esta acción no se puede deshacer.")) {
      try {
        const response = await fetch(`/api/admin/users/${adminId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          router.push("/configurar/admin");
          toast.success("Administrador eliminado correctamente");
        } else {
          toast.error("Error al eliminar el administrador");
        }
      } catch (error) {
        console.error("Error al eliminar el administrador:", error);
        toast.error("Error al eliminar el administrador");
      }
    }
  };

  const handleRestoreValues = () => {
    if (user) {
      setFormData({
        nombre: user.nombre,
        email: user.email,
        telefonoMovil: user.telefonoMovil || '',
        codigoPostal: user.codigoPostal || '',
        activo: user.activo,
        bloqueado: user.bloqueado,
        autenticacionEmail: user.autenticacionEmail,
        autenticacionSms: user.autenticacionSms,
        tipoUsuarioId: user.tipoUsuarioId
      });
      toast.info("Valores restaurados");
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <p>Cargando información del usuario...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Usuario no encontrado</h1>
        <p className="text-muted-foreground">
          {error || `El usuario con ID ${adminId} no existe o no tiene permisos de administrador.`}
        </p>
        <Button asChild className="mt-4">
          <Link href="/configurar/admin">Volver a la lista de administradores</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/configurar/admin">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            Administrador: {user.nombre}
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
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
                  Esta acción no se puede deshacer. Esto eliminará permanentemente la cuenta de administrador
                  de {user.nombre} y eliminará sus datos del servidor.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  className="bg-red-600 hover:bg-red-700"
                  onClick={deleteUser}
                >
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <Button onClick={handleSubmit} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <UserCog className="mr-2 h-5 w-5" />
                  Información de la Cuenta
                </CardTitle>
                <CardDescription>
                  Información básica y configuración de la cuenta del administrador.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={formData.activo ? "outline" : "destructive"} className={formData.activo ? "bg-green-100 text-green-800" : ""}>
                  {formData.activo ? "Activo" : "Inactivo"}
                </Badge>
                {formData.bloqueado && (
                  <Badge variant="destructive">Bloqueado</Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Detalles</TabsTrigger>
                <TabsTrigger value="security">Seguridad</TabsTrigger>
                <TabsTrigger value="activity">Actividad</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input 
                      id="nombre" 
                      value={formData.nombre}
                      onChange={(e) => handleInputChange("nombre", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefonoMovil">Teléfono</Label>
                    <Input 
                      id="telefonoMovil" 
                      value={formData.telefonoMovil}
                      onChange={(e) => handleInputChange("telefonoMovil", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="codigoPostal">Código Postal</Label>
                    <Input 
                      id="codigoPostal" 
                      value={formData.codigoPostal}
                      onChange={(e) => handleInputChange("codigoPostal", e.target.value)}
                    />
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Información del Sistema</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium">ID de Usuario</p>
                      <p className="text-sm text-muted-foreground">{user.id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Fecha de Registro</p>
                      <p className="text-sm text-muted-foreground">
                        {user.fechaRegistro ? 
                          new Date(user.fechaRegistro).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          }) : "No disponible"
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Último Acceso</p>
                      <p className="text-sm text-muted-foreground">
                        {user.ultimaConexion ? 
                          new Date(user.ultimaConexion).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 
                          "Nunca"
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Tipo de Usuario</p>
                      <p className="text-sm text-muted-foreground">
                        {user.tipoUsuario.descripcion} ({user.tipoUsuario.valor})
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="security" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="activo">Cuenta Activa</Label>
                      <p className="text-sm text-muted-foreground">
                        Determina si el usuario puede acceder al sistema.
                      </p>
                    </div>
                    <Switch 
                      id="activo" 
                      checked={formData.activo}
                      onCheckedChange={(checked) => handleInputChange("activo", checked)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="bloqueado">Cuenta Bloqueada</Label>
                      <p className="text-sm text-muted-foreground">
                        Bloquea temporalmente el acceso del usuario al sistema.
                      </p>
                    </div>
                    <Switch 
                      id="bloqueado" 
                      checked={formData.bloqueado}
                      onCheckedChange={(checked) => handleInputChange("bloqueado", checked)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="autenticacionEmail">Autenticación por Email</Label>
                      <p className="text-sm text-muted-foreground">
                        Permite iniciar sesión mediante verificación por email.
                      </p>
                    </div>
                    <Switch 
                      id="autenticacionEmail" 
                      checked={formData.autenticacionEmail}
                      onCheckedChange={(checked) => handleInputChange("autenticacionEmail", checked)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="autenticacionSms">Autenticación por SMS</Label>
                      <p className="text-sm text-muted-foreground">
                        Permite iniciar sesión mediante verificación por SMS.
                      </p>
                    </div>
                    <Switch 
                      id="autenticacionSms" 
                      checked={formData.autenticacionSms}
                      onCheckedChange={(checked) => handleInputChange("autenticacionSms", checked)}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="activity" className="pt-4">
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-center h-32">
                    <p className="text-muted-foreground">
                      No hay registros de actividad disponibles.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline"
              onClick={handleRestoreValues}
            >
              Restaurar Valores
            </Button>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Permisos Administrativos
            </CardTitle>
            <CardDescription>
              Gestiona los permisos específicos para este administrador.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch id="permission-users" defaultChecked />
                  <Label htmlFor="permission-users">Gestión de Usuarios</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="permission-products" defaultChecked />
                  <Label htmlFor="permission-products">Gestión de Productos</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="permission-categories" defaultChecked />
                  <Label htmlFor="permission-categories">Gestión de Categorías</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="permission-supermarkets" defaultChecked />
                  <Label htmlFor="permission-supermarkets">Gestión de Supermercados</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="permission-prices" defaultChecked />
                  <Label htmlFor="permission-prices">Gestión de Precios</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="permission-settings" defaultChecked />
                  <Label htmlFor="permission-settings">Configuración del Sistema</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
