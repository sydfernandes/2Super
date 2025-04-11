/**
 * Funcionalidades:
 * - Listar todos los supermercados
 * - Filtrar supermercados por nombre o descripción
 * - Crear nuevos supermercados
 * - Ver detalles de un supermercado
 * - Editar supermercados existentes
 * - Eliminar supermercados sin precios asociados
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  Save,
  X,
  ShoppingCart
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
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
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/Spinner";

// Interfaces
interface Supermercado {
  id: number;
  nombre: string;
  logoUrl: string | null;
  sitioWeb: string | null;
  directorioCsv: string | null;
  fechaCreacion: Date;
  fechaUltimoProcesamiento: Date | null;
  metodoObtencionId: number;
  metodoObtencion: {
    valor: string;
  };
  frecuenciaActualizacion: string | null;
  activo: boolean;
  _count: {
    precios: number;
    marcas: number;
  };
}

interface SupermercadoInput {
  nombre: string;
  logoUrl: string | null;
  sitioWeb: string | null;
  directorioCsv: string | null;
  metodoObtencionId: number;
  frecuenciaActualizacion: string | null;
  activo: boolean;
}

interface MetodoObtencion {
  id: number;
  valor: string;
  descripcion: string;
}

export default function SupermercadosPage() {
  const router = useRouter();
  
  const [supermercados, setSupermercados] = useState<Supermercado[]>([]);
  const [metodos, setMetodos] = useState<MetodoObtencion[]>([]);
  const [filteredSupermercados, setFilteredSupermercados] = useState<Supermercado[]>([]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedSupermercadoId, setSelectedSupermercadoId] = useState<number | null>(null);
  
  const [newSupermercado, setNewSupermercado] = useState<SupermercadoInput>({
    nombre: "",
    logoUrl: null,
    sitioWeb: null,
    directorioCsv: null,
    metodoObtencionId: 0,
    frecuenciaActualizacion: null,
    activo: true
  });
  
  // Cargar supermercados y métodos de obtención
  useEffect(() => {
    fetchSupermercados();
    fetchMetodosObtencion();
  }, []);
  
  // Filtrar supermercados cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredSupermercados(supermercados);
    } else {
      const lowerSearch = searchTerm.toLowerCase();
      const filtered = supermercados.filter(
        (supermercado) =>
          supermercado.nombre.toLowerCase().includes(lowerSearch) ||
          supermercado.metodoObtencion.valor.toLowerCase().includes(lowerSearch)
      );
      setFilteredSupermercados(filtered);
    }
  }, [searchTerm, supermercados]);
  
  // Obtener supermercados
  const fetchSupermercados = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/admin/supermercados');
      const data = response.data.map((supermercado: any) => ({
        ...supermercado,
        fechaCreacion: new Date(supermercado.fechaCreacion),
        fechaUltimoProcesamiento: supermercado.fechaUltimoProcesamiento 
          ? new Date(supermercado.fechaUltimoProcesamiento) 
          : null
      }));
      
      setSupermercados(data);
      setFilteredSupermercados(data);
    } catch (error) {
      console.error("Error al cargar supermercados:", error);
      toast.error("Error al cargar los supermercados");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Obtener métodos de obtención
  const fetchMetodosObtencion = async () => {
    try {
      const response = await axios.get('/api/admin/metodosobtencion');
      
      if (response.data.success && Array.isArray(response.data.data)) {
        setMetodos(response.data.data);
        
        // Si hay métodos disponibles, establecer el primero como valor por defecto
        if (response.data.data.length > 0) {
          setNewSupermercado(prev => ({
            ...prev,
            metodoObtencionId: response.data.data[0].id
          }));
        }
      }
    } catch (error) {
      console.error("Error al cargar métodos de obtención:", error);
      toast.error("Error al cargar los métodos de obtención");
    }
  };
  
  // Manejar cambios en el formulario de nuevo supermercado
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewSupermercado(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Manejar cambio en el método de obtención
  const handleMetodoChange = (value: string) => {
    const metodoId = parseInt(value);
    setNewSupermercado(prev => ({
      ...prev,
      metodoObtencionId: metodoId
    }));
  };
  
  // Manejar cambio en el estado activo
  const handleActivoChange = (checked: boolean) => {
    setNewSupermercado(prev => ({
      ...prev,
      activo: checked
    }));
  };
  
  // Validar formulario
  const isFormValid = () => {
    if (!newSupermercado.nombre.trim()) {
      toast.error("El nombre del supermercado es obligatorio");
      return false;
    }
    
    if (!newSupermercado.metodoObtencionId) {
      toast.error("Debe seleccionar un método de obtención");
      return false;
    }
    
    return true;
  };
  
  // Crear nuevo supermercado
  const handleCreateSupermercado = async () => {
    if (!isFormValid()) return;
    
    setIsSaving(true);
    try {
      await axios.post('/api/admin/supermercados', newSupermercado);
      
      toast.success("Supermercado creado correctamente");
      setOpenCreateDialog(false);
      
      // Reiniciar el formulario
      setNewSupermercado({
        nombre: "",
        logoUrl: null,
        sitioWeb: null,
        directorioCsv: null,
        metodoObtencionId: metodos.length > 0 ? metodos[0].id : 0,
        frecuenciaActualizacion: null,
        activo: true
      });
      
      // Recargar la lista de supermercados
      fetchSupermercados();
    } catch (error: any) {
      console.error("Error al crear supermercado:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error al crear el supermercado");
      }
    } finally {
      setIsSaving(false);
    }
  };
  
  // Eliminar supermercado
  const handleDeleteSupermercado = async () => {
    if (!selectedSupermercadoId) return;
    
    setIsDeleting(true);
    try {
      await axios.delete(`/api/admin/supermercados/${selectedSupermercadoId}`);
      
      toast.success("Supermercado eliminado correctamente");
      setOpenDeleteDialog(false);
      setSelectedSupermercadoId(null);
      
      // Recargar la lista de supermercados
      fetchSupermercados();
    } catch (error: any) {
      console.error("Error al eliminar supermercado:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error al eliminar el supermercado");
      }
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Ir a la página de detalle del supermercado
  const goToSupermercadoDetail = (id: number) => {
    router.push(`/gestionar/supermercados/${id}`);
  };
  
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">Gestionar Supermercados</CardTitle>
              <CardDescription>
                Administra los supermercados disponibles en la plataforma
              </CardDescription>
            </div>
            
            <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Supermercado
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Supermercado</DialogTitle>
                  <DialogDescription>
                    Completa el formulario para añadir un nuevo supermercado a la plataforma
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre *</Label>
                    <Input
                      id="nombre"
                      name="nombre"
                      value={newSupermercado.nombre}
                      onChange={handleInputChange}
                      placeholder="Nombre del supermercado"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="logoUrl">URL del Logo</Label>
                    <Input
                      id="logoUrl"
                      name="logoUrl"
                      value={newSupermercado.logoUrl || ''}
                      onChange={handleInputChange}
                      placeholder="https://ejemplo.com/logo.png"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sitioWeb">Sitio Web</Label>
                    <Input
                      id="sitioWeb"
                      name="sitioWeb"
                      value={newSupermercado.sitioWeb || ''}
                      onChange={handleInputChange}
                      placeholder="https://www.supermercado.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="directorioCsv">Directorio CSV</Label>
                    <Input
                      id="directorioCsv"
                      name="directorioCsv"
                      value={newSupermercado.directorioCsv || ''}
                      onChange={handleInputChange}
                      placeholder="/ruta/a/archivos/csv"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="metodoObtencionId">Método de Obtención *</Label>
                    <Select 
                      onValueChange={handleMetodoChange}
                      defaultValue={
                        metodos.length > 0 
                          ? newSupermercado.metodoObtencionId.toString() 
                          : undefined
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar método" />
                      </SelectTrigger>
                      <SelectContent>
                        {metodos.map((metodo) => (
                          <SelectItem key={metodo.id} value={metodo.id.toString()}>
                            {metodo.valor}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="frecuenciaActualizacion">Frecuencia de Actualización</Label>
                    <Input
                      id="frecuenciaActualizacion"
                      name="frecuenciaActualizacion"
                      value={newSupermercado.frecuenciaActualizacion || ''}
                      onChange={handleInputChange}
                      placeholder="Diaria, Semanal, etc."
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 py-2">
                    <Switch
                      id="activo"
                      checked={newSupermercado.activo}
                      onCheckedChange={handleActivoChange}
                    />
                    <Label htmlFor="activo">Supermercado Activo</Label>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpenCreateDialog(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateSupermercado} disabled={isSaving}>
                    {isSaving ? (
                      <Spinner size="sm" />
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Guardar
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o método de obtención..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Spinner size="lg" />
              </div>
            ) : filteredSupermercados.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supermercado</TableHead>
                    <TableHead>Método de Obtención</TableHead>
                    <TableHead>Frecuencia</TableHead>
                    <TableHead>Última Actualización</TableHead>
                    <TableHead>Productos</TableHead>
                    <TableHead>Marcas</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSupermercados.map((supermercado) => (
                    <TableRow key={supermercado.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {supermercado.logoUrl && (
                            <Image
                              src={supermercado.logoUrl}
                              alt={supermercado.nombre}
                              width={32}
                              height={32}
                              className="rounded-sm object-contain"
                            />
                          )}
                          {supermercado.nombre}
                        </div>
                      </TableCell>
                      <TableCell>{supermercado.metodoObtencion.valor}</TableCell>
                      <TableCell>{supermercado.frecuenciaActualizacion || "No definida"}</TableCell>
                      <TableCell>
                        {supermercado.fechaUltimoProcesamiento 
                          ? format(supermercado.fechaUltimoProcesamiento, "dd/MM/yyyy HH:mm", { locale: es })
                          : "Nunca"}
                      </TableCell>
                      <TableCell>{supermercado._count.precios}</TableCell>
                      <TableCell>{supermercado._count.marcas || 0}</TableCell>
                      <TableCell>
                        <Badge variant={supermercado.activo ? "default" : "secondary"}>
                          {supermercado.activo ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => goToSupermercadoDetail(supermercado.id)}
                            title="Editar supermercado"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          
                          <AlertDialog
                            open={openDeleteDialog && selectedSupermercadoId === supermercado.id}
                            onOpenChange={(isOpen) => {
                              setOpenDeleteDialog(isOpen);
                              if (!isOpen) setSelectedSupermercadoId(null);
                            }}
                          >
                            <AlertDialogTrigger asChild>
                              <Button
                                size="icon"
                                variant="destructive"
                                onClick={() => setSelectedSupermercadoId(supermercado.id)}
                                title="Eliminar supermercado"
                                disabled={supermercado._count.precios > 0}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción eliminará el supermercado <strong>{supermercado.nombre}</strong> y no se puede deshacer.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleDeleteSupermercado}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  {isDeleting ? <Spinner size="sm" /> : "Eliminar"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center border rounded-md">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm 
                    ? "No se encontraron supermercados con esos criterios de búsqueda"
                    : "No hay supermercados disponibles"
                  }
                </p>
                <Button
                  variant="outline"
                  onClick={() => setOpenCreateDialog(true)}
                  className="mt-4"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Añadir el primer supermercado
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}