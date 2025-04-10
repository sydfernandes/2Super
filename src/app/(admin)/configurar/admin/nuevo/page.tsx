"use client"

// Página para crear un nuevo usuario administrativo
// Funcionalidades:
// - Formulario para añadir nuevo usuario admin
// - Validación de datos
// - Configuración de autenticación por email
// - Obtención de tipos de usuario desde la base de datos

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toastSuccess, toastError, toastInfo } from "@/lib/toast"

// Tipo para usuario administrador
type TipoUsuario = {
  id: number;
  valor: string;
  descripcion: string;
}

export default function NuevoUsuarioPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tiposUsuario, setTiposUsuario] = useState<TipoUsuario[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefonoMovil: "",
    tipoUsuarioId: 1, // Administrador por defecto
    activo: false,
    bloqueado: false,
    autenticacionEmail: true,
    autenticacionSms: false,
  });
  
  // Estado de errores de validación
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cargar tipos de usuario al montar el componente
  useEffect(() => {
    async function fetchTiposUsuario() {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/tipos-usuario');
        if (!res.ok) {
          throw new Error('Error al cargar tipos de usuario');
        }
        const data = await res.json();
        
        if (data.success) {
          setTiposUsuario(data.data);
          // Si hay datos, seleccionamos el administrador por defecto o el primer tipo
          if (data.data.length > 0) {
            const adminTipo = data.data.find((tipo: TipoUsuario) => tipo.id === 1);
            if (adminTipo) {
              setFormData(prev => ({ ...prev, tipoUsuarioId: adminTipo.id }));
            } else {
              setFormData(prev => ({ ...prev, tipoUsuarioId: data.data[0].id }));
            }
          }
        } else {
          toastInfo(data.message || "No se pudieron cargar los tipos de usuario");
        }
      } catch (error) {
        console.error("Error fetching tipos de usuario:", error);
        toastError("No se pudieron cargar los tipos de usuario");
      } finally {
        setLoading(false);
      }
    }

    fetchTiposUsuario();
  }, []);
  
  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar error cuando el usuario modifica el campo
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Manejar cambio en el selector de tipo de usuario
  const handleSelectChange = (value: string) => {
    setFormData(prevData => ({
      ...prevData,
      tipoUsuarioId: parseInt(value)
    }));
  };
  
  // Manejar cambio en los switches
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: checked
    }));
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nombre || formData.nombre.length < 3) {
      newErrors.nombre = "El nombre debe tener al menos 3 caracteres";
    }
    
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Introduce un email válido";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toastSuccess("Usuario creado con éxito");
        // Redirigir a la lista de usuarios
        router.push("/configurar/admin");
      } else {
        toastError(result.message || "Error al crear el usuario");
      }
    } catch (error) {
      console.error("Error al crear usuario:", error);
      toastError("No se pudo crear el usuario. Inténtalo de nuevo más tarde.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancelar y volver a la lista de usuarios
  const handleCancel = () => {
    router.push("/configurar/admin");
  };

  // Si está cargando, mostramos un indicador
  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-8">Cargando formulario...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          className="mr-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <h1 className="text-3xl font-bold">Crear Nuevo Usuario</h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Nuevo Usuario Administrativo</CardTitle>
          <CardDescription>
            Introduce los datos para crear un nuevo usuario con acceso al panel de administración.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre completo</Label>
              <Input 
                id="nombre"
                name="nombre"
                placeholder="Nombre del usuario" 
                value={formData.nombre}
                onChange={handleChange}
              />
              {errors.nombre && (
                <p className="text-sm text-red-500">{errors.nombre}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                name="email"
                type="email" 
                placeholder="correo@ejemplo.com" 
                value={formData.email}
                onChange={handleChange}
              />
              <p className="text-sm text-muted-foreground">
                Este email será utilizado para acceder al sistema a través de enlaces de autenticación.
              </p>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="telefonoMovil">Teléfono móvil (opcional)</Label>
              <Input 
                id="telefonoMovil"
                name="telefonoMovil"
                placeholder="+34 666 777 888" 
                value={formData.telefonoMovil}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tipoUsuarioId">Tipo de usuario</Label>
              <Select 
                onValueChange={handleSelectChange}
                defaultValue={formData.tipoUsuarioId.toString()}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposUsuario.map((tipo) => (
                    <SelectItem 
                      key={tipo.id} 
                      value={tipo.id.toString()}
                    >
                      {tipo.descripcion}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Determina los permisos que tendrá el usuario.
              </p>
            </div>
            
            <div className="flex flex-col space-y-4">
              <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">
                    Autenticación por email
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    El usuario recibirá enlaces de acceso vía email.
                  </p>
                </div>
                <Switch
                  checked={formData.autenticacionEmail}
                  onCheckedChange={(checked) => handleSwitchChange('autenticacionEmail', checked)}
                  disabled={true} // Siempre activo ya que es el método principal
                />
              </div>

              <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">
                    Activar usuario
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    El usuario podrá acceder al sistema inmediatamente.
                  </p>
                </div>
                <Switch
                  checked={formData.activo}
                  onCheckedChange={(checked) => handleSwitchChange('activo', checked)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? "Guardando..." : "Guardar usuario"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 