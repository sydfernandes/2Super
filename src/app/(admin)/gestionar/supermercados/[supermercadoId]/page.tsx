/**
 * Funcionalidades:
 * - Ver información detallada de un supermercado
 * - Editar información del supermercado
 * - Eliminar supermercado (si no tiene productos/precios asociados)
 * - Ver marcas asociadas al supermercado
 * - Agregar marcas al supermercado
 * - Quitar marcas del supermercado
 */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import React from "react";
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  Search,
  Plus,
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
    id: number;
    valor: string;
    descripcion: string;
  };
  frecuenciaActualizacion: string | null;
  activo: boolean;
  _count: {
    precios: number;
  };
}

interface SupermercadoInput {
  nombre: string;
  logoUrl: string | null;
  sitioWeb: string | null;
  directorioCsv: string | null;
  metodoObtencionId: number;
  frecuenciaActualizacion: string | null;
  fechaUltimoProcesamiento: string | null;
  activo: boolean;
}

interface MetodoObtencion {
  id: number;
  valor: string;
  descripcion: string;
}

interface Marca {
  id: number;
  nombre: string;
  logoUrl: string | null;
  esMarcaBlanca: boolean;
  fechaCreacion: Date;
  activo: boolean;
  _count?: {
    productos: number;
  };
}

export default function SupermercadoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const supermercadoId = parseInt(params.supermercadoId as string);
  
  const [supermercado, setSupermercado] = useState<Supermercado | null>(null);
  const [editedSupermercado, setEditedSupermercado] = useState<SupermercadoInput>({
    nombre: "",
    logoUrl: null,
    sitioWeb: null,
    directorioCsv: null,
    metodoObtencionId: 0,
    frecuenciaActualizacion: null,
    fechaUltimoProcesamiento: null,
    activo: true
  });
  
  const [metodos, setMetodos] = useState<MetodoObtencion[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [availableMarcas, setAvailableMarcas] = useState<Marca[]>([]);
  const [selectedMarcaIds, setSelectedMarcaIds] = useState<number[]>([]);
  const [selectedMarcaId, setSelectedMarcaId] = useState<number | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSearchingMarcas, setIsSearchingMarcas] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAddMarcasDialog, setOpenAddMarcasDialog] = useState(false);
  const [openRemoveMarcaDialog, setOpenRemoveMarcaDialog] = useState(false);
  
  // Cargar supermercado y métodos de obtención
  useEffect(() => {
    if (isNaN(supermercadoId)) {
      toast.error("ID de supermercado inválido");
      router.push("/gestionar/supermercados");
      return;
    }
    
    fetchSupermercado();
    fetchMetodosObtencion();
    fetchMarcas();
  }, [supermercadoId, router]);
  
  // Obtener detalles del supermercado
  const fetchSupermercado = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/admin/supermercados/${supermercadoId}`);
      
      const supermercadoData = {
        ...response.data,
        fechaCreacion: new Date(response.data.fechaCreacion),
        fechaUltimoProcesamiento: response.data.fechaUltimoProcesamiento 
          ? new Date(response.data.fechaUltimoProcesamiento)
          : null
      };
      
      setSupermercado(supermercadoData);
      setEditedSupermercado({
        nombre: supermercadoData.nombre,
        logoUrl: supermercadoData.logoUrl,
        sitioWeb: supermercadoData.sitioWeb,
        directorioCsv: supermercadoData.directorioCsv,
        metodoObtencionId: supermercadoData.metodoObtencionId,
        frecuenciaActualizacion: supermercadoData.frecuenciaActualizacion,
        fechaUltimoProcesamiento: supermercadoData.fechaUltimoProcesamiento
          ? supermercadoData.fechaUltimoProcesamiento.toISOString()
          : null,
        activo: supermercadoData.activo
      });
    } catch (error) {
      console.error("Error al cargar supermercado:", error);
      toast.error("Error al cargar detalles del supermercado");
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
      }
    } catch (error) {
      console.error("Error al cargar métodos de obtención:", error);
      toast.error("Error al cargar los métodos de obtención");
    }
  };
  
  // Obtener marcas asociadas al supermercado
  const fetchMarcas = async () => {
    try {
      const response = await axios.get(`/api/admin/supermercados/${supermercadoId}/marcas`);
      
      // Handle both response formats - current API might return different formats
      let marcasData = [];
      
      if (response.data.success && Array.isArray(response.data.data)) {
        // Format: { success: true, data: [...] }
        marcasData = response.data.data;
      } else if (Array.isArray(response.data)) {
        // Format: direct array
        marcasData = response.data;
      } else {
        console.warn("Formato de respuesta inesperado en marcas:", response.data);
        marcasData = [];
      }
      
      // Ensure all date fields are properly converted
      const formattedMarcas = marcasData.map((marca: any) => ({
        ...marca,
        fechaCreacion: marca.fechaCreacion ? new Date(marca.fechaCreacion) : new Date(),
        // Ensure we have all required fields even if API response is incomplete
        logoUrl: marca.logoUrl || marca.imagenUrl || null,
        activo: typeof marca.activo === 'boolean' ? marca.activo : true,
        esMarcaBlanca: typeof marca.esMarcaBlanca === 'boolean' ? marca.esMarcaBlanca : false
      }));
      
      setMarcas(formattedMarcas);
    } catch (error) {
      console.error("Error al cargar marcas del supermercado:", error);
      toast.error("Error al cargar marcas asociadas");
      setMarcas([]); // Set empty array on error to avoid undefined state
    }
  };
  
  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedSupermercado(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Manejar cambio en el método de obtención
  const handleMetodoChange = (value: string) => {
    const metodoId = parseInt(value);
    setEditedSupermercado(prev => ({
      ...prev,
      metodoObtencionId: metodoId
    }));
  };
  
  // Manejar cambio en el estado activo
  const handleActivoChange = (checked: boolean) => {
    setEditedSupermercado(prev => ({
      ...prev,
      activo: checked
    }));
  };
  
  // Validar formulario
  const isFormValid = () => {
    if (!editedSupermercado.nombre.trim()) {
      toast.error("El nombre del supermercado es obligatorio");
      return false;
    }
    
    if (!editedSupermercado.metodoObtencionId) {
      toast.error("Debe seleccionar un método de obtención");
      return false;
    }
    
    return true;
  };
  
  // Guardar cambios en el supermercado
  const handleSaveSupermercado = async () => {
    if (!isFormValid()) return;
    
    setIsSaving(true);
    try {
      await axios.patch(`/api/admin/supermercados/${supermercadoId}`, editedSupermercado);
      
      toast.success("Supermercado actualizado correctamente");
      fetchSupermercado();
    } catch (error: any) {
      console.error("Error al actualizar supermercado:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error al actualizar el supermercado");
      }
    } finally {
      setIsSaving(false);
    }
  };
  
  // Eliminar supermercado
  const handleDeleteSupermercado = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`/api/admin/supermercados/${supermercadoId}`);
      
      toast.success("Supermercado eliminado correctamente");
      router.push("/gestionar/supermercados");
    } catch (error: any) {
      console.error("Error al eliminar supermercado:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error al eliminar el supermercado");
      }
    } finally {
      setIsDeleting(false);
      setOpenDeleteDialog(false);
    }
  };
  
  // Buscar marcas disponibles
  const searchAvailableMarcas = async () => {
    setIsSearchingMarcas(true);
    try {
      const response = await axios.get('/api/admin/marcas', {
        params: {
          search: searchTerm
        }
      });
      
      if (Array.isArray(response.data)) {
        // Filtrar para excluir las marcas ya asociadas
        const marcasIds = marcas.map(m => m.id);
        const availableMarcasData = response.data
          .filter((marca: any) => !marcasIds.includes(marca.id))
          .map((marca: any) => ({
            ...marca,
            fechaCreacion: new Date(marca.fechaCreacion || Date.now())
          }));
        
        setAvailableMarcas(availableMarcasData);
      }
    } catch (error) {
      console.error("Error al buscar marcas:", error);
      toast.error("Error al buscar marcas disponibles");
    } finally {
      setIsSearchingMarcas(false);
    }
  };
  
  // Toggle marca selection
  const toggleMarcaSelection = (marcaId: number) => {
    setSelectedMarcaIds(prev => 
      prev.includes(marcaId)
        ? prev.filter(id => id !== marcaId)
        : [...prev, marcaId]
    );
  };
  
  // Añadir marcas al supermercado
  const handleAddMarcasToSupermercado = async () => {
    if (selectedMarcaIds.length === 0) {
      toast.error("Selecciona al menos una marca");
      return;
    }
    
    setIsSaving(true);
    try {
      const response = await axios.post(`/api/admin/supermercados/${supermercadoId}/marcas`, {
        marcaIds: selectedMarcaIds
      });
      
      toast.success("Marcas añadidas al supermercado correctamente");
      
      // Añadir directamente las marcas seleccionadas al estado local para actualización inmediata
      const selectedMarcas = availableMarcas.filter(marca => selectedMarcaIds.includes(marca.id));
      setMarcas(prev => [...prev, ...selectedMarcas]);
      
      setOpenAddMarcasDialog(false);
      setSelectedMarcaIds([]);
      setAvailableMarcas([]);
      setSearchTerm("");
    } catch (error) {
      console.error("Error al añadir marcas:", error);
      toast.error("Error al añadir marcas al supermercado");
    } finally {
      setIsSaving(false);
    }
  };
  
  // Quitar marca del supermercado
  const handleRemoveMarcaFromSupermercado = async () => {
    if (!selectedMarcaId) return;
    
    setIsSaving(true);
    try {
      await axios.delete(`/api/admin/supermercados/${supermercadoId}/marcas/${selectedMarcaId}`);
      
      toast.success("Marca eliminada del supermercado correctamente");
      
      // Eliminar la marca del estado local para actualización inmediata
      setMarcas(prev => prev.filter(marca => marca.id !== selectedMarcaId));
      
      setOpenRemoveMarcaDialog(false);
      setSelectedMarcaId(null);
    } catch (error) {
      console.error("Error al quitar marca:", error);
      toast.error("Error al quitar la marca del supermercado");
    } finally {
      setIsSaving(false);
    }
  };
  
  // Ir a la página de detalle de la marca
  const goToMarcaDetail = (marcaId: number) => {
    router.push(`/gestionar/marcas/${marcaId}`);
  };
  
  // Volver a la lista de supermercados
  const goBack = () => {
    router.push("/gestionar/supermercados");
  };
  
  // Mostrar cargando
  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  
  // Mostrar error si no se encuentra el supermercado
  if (!supermercado) {
    return (
      <div className="p-6">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>El supermercado solicitado no existe o ha sido eliminado.</p>
          </CardContent>
          <DialogFooter>
            <Button onClick={goBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Supermercados
            </Button>
          </DialogFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="p-6 space-y-6">
      <Button variant="outline" onClick={goBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a Supermercados
      </Button>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">Detalles de Supermercado</CardTitle>
              <CardDescription>
                Visualiza y edita la información del supermercado
              </CardDescription>
            </div>
            
            <div className="flex gap-2">
              <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    disabled={supermercado._count.precios > 0}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar Supermercado
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción eliminará permanentemente el supermercado <strong>{supermercado.nombre}</strong> y no se puede deshacer.
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
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="info">
            <TabsList className="mb-4">
              <TabsTrigger value="info">Información</TabsTrigger>
              <TabsTrigger value="marcas">
                Marcas
                <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                  {marcas.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre *</Label>
                    <Input
                      id="nombre"
                      name="nombre"
                      value={editedSupermercado.nombre}
                      onChange={handleInputChange}
                      placeholder="Nombre del supermercado"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="logoUrl">URL del Logo</Label>
                    <Input
                      id="logoUrl"
                      name="logoUrl"
                      value={editedSupermercado.logoUrl || ''}
                      onChange={handleInputChange}
                      placeholder="https://ejemplo.com/logo.png"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sitioWeb">Sitio Web</Label>
                    <Input
                      id="sitioWeb"
                      name="sitioWeb"
                      value={editedSupermercado.sitioWeb || ''}
                      onChange={handleInputChange}
                      placeholder="https://www.supermercado.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="directorioCsv">Directorio CSV</Label>
                    <Input
                      id="directorioCsv"
                      name="directorioCsv"
                      value={editedSupermercado.directorioCsv || ''}
                      onChange={handleInputChange}
                      placeholder="/ruta/a/archivos/csv"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="metodoObtencionId">Método de Obtención *</Label>
                    <Select 
                      onValueChange={handleMetodoChange}
                      defaultValue={editedSupermercado.metodoObtencionId.toString()}
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
                      value={editedSupermercado.frecuenciaActualizacion || ''}
                      onChange={handleInputChange}
                      placeholder="Diaria, Semanal, etc."
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 py-2">
                    <Switch
                      id="activo"
                      checked={editedSupermercado.activo}
                      onCheckedChange={handleActivoChange}
                    />
                    <Label htmlFor="activo">Supermercado Activo</Label>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {editedSupermercado.logoUrl && (
                    <div className="space-y-2">
                      <Label>Vista Previa del Logo</Label>
                      <div className="border rounded-md p-2 w-full h-48 flex items-center justify-center bg-muted">
                        <Image
                          src={editedSupermercado.logoUrl}
                          alt={editedSupermercado.nombre}
                          width={200}
                          height={200}
                          className="max-h-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label>Fecha de Creación</Label>
                    <div className="p-2 border rounded-md bg-muted">
                      {supermercado.fechaCreacion instanceof Date && !isNaN(supermercado.fechaCreacion.getTime())
                        ? format(supermercado.fechaCreacion, "PPpp", { locale: es })
                        : "Fecha no disponible"}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Última Actualización de Precios</Label>
                    <div className="p-2 border rounded-md bg-muted">
                      {supermercado.fechaUltimoProcesamiento instanceof Date && !isNaN(supermercado.fechaUltimoProcesamiento.getTime())
                        ? format(supermercado.fechaUltimoProcesamiento, "PPpp", { locale: es })
                        : "Nunca actualizado"}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Productos/Precios</Label>
                    <div className="p-2 border rounded-md bg-muted flex items-center">
                      <span className="text-lg font-medium">{supermercado._count.precios}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveSupermercado} disabled={isSaving}>
                  {isSaving ? (
                    <Spinner size="sm" />
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Guardar Cambios
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="marcas">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Marcas disponibles en este Supermercado</h3>
                  
                  <Dialog open={openAddMarcasDialog} onOpenChange={setOpenAddMarcasDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Añadir Marcas
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Añadir Marcas al Supermercado</DialogTitle>
                        <DialogDescription>
                          Busca y selecciona las marcas que deseas añadir a este supermercado
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="relative flex-1">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Buscar marcas por nombre..."
                              className="pl-8"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                          </div>
                          <Button
                            onClick={searchAvailableMarcas}
                            disabled={isSearchingMarcas}
                          >
                            {isSearchingMarcas ? <Spinner size="sm" /> : "Buscar"}
                          </Button>
                        </div>
                        
                        {availableMarcas.length > 0 ? (
                          <div className="border rounded-md max-h-[400px] overflow-y-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-12"></TableHead>
                                  <TableHead>Marca</TableHead>
                                  <TableHead>Marca Blanca</TableHead>
                                  <TableHead>Estado</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {availableMarcas.map((marca) => (
                                  <TableRow
                                    key={marca.id}
                                    className={selectedMarcaIds.includes(marca.id) ? "bg-muted/50" : ""}
                                  >
                                    <TableCell>
                                      <div className="flex items-center justify-center">
                                        <input
                                          type="checkbox"
                                          checked={selectedMarcaIds.includes(marca.id)}
                                          onChange={() => toggleMarcaSelection(marca.id)}
                                          className="h-4 w-4"
                                        />
                                      </div>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                      <div className="flex items-center gap-2">
                                        {marca.logoUrl && (
                                          <Image
                                            src={marca.logoUrl}
                                            alt={marca.nombre}
                                            width={32}
                                            height={32}
                                            className="rounded-sm object-contain"
                                          />
                                        )}
                                        {marca.nombre}
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <Badge variant={marca.esMarcaBlanca ? "default" : "outline"}>
                                        {marca.esMarcaBlanca ? "Sí" : "No"}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      <Badge variant={marca.activo ? "default" : "secondary"}>
                                        {marca.activo ? "Activa" : "Inactiva"}
                                      </Badge>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : searchTerm ? (
                          <div className="py-8 text-center">
                            <p className="text-muted-foreground">
                              No se encontraron marcas con ese criterio de búsqueda.
                            </p>
                          </div>
                        ) : (
                          <div className="py-8 text-center">
                            <p className="text-muted-foreground">
                              Busca marcas para añadirlas a este supermercado.
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <DialogFooter>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setOpenAddMarcasDialog(false);
                            setSelectedMarcaIds([]);
                            setAvailableMarcas([]);
                            setSearchTerm("");
                          }}
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={handleAddMarcasToSupermercado}
                          disabled={selectedMarcaIds.length === 0 || isSaving}
                        >
                          {isSaving ? (
                            <Spinner size="sm" />
                          ) : (
                            <>Añadir {selectedMarcaIds.length} marcas</>
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {marcas.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Marca</TableHead>
                        <TableHead>Marca Blanca</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {marcas.map((marca) => (
                        <TableRow key={marca.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {marca.logoUrl && (
                                <Image
                                  src={marca.logoUrl}
                                  alt={marca.nombre}
                                  width={32}
                                  height={32}
                                  className="rounded-sm object-contain"
                                />
                              )}
                              {marca.nombre}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={marca.esMarcaBlanca ? "default" : "outline"}>
                              {marca.esMarcaBlanca ? "Sí" : "No"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={marca.activo ? "default" : "secondary"}>
                              {marca.activo ? "Activa" : "Inactiva"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => goToMarcaDetail(marca.id)}
                                title="Ver detalles de marca"
                              >
                                <ArrowLeft className="h-4 w-4 rotate-180" />
                              </Button>
                              <AlertDialog
                                open={openRemoveMarcaDialog && selectedMarcaId === marca.id}
                                onOpenChange={(isOpen) => {
                                  setOpenRemoveMarcaDialog(isOpen);
                                  if (!isOpen) setSelectedMarcaId(null);
                                }}
                              >
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="destructive"
                                    onClick={() => setSelectedMarcaId(marca.id)}
                                    title="Quitar del supermercado"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Esta acción eliminará la asociación de la marca <strong>{marca.nombre}</strong> con este supermercado, pero no eliminará la marca del sistema.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={handleRemoveMarcaFromSupermercado}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      {isSaving ? <Spinner size="sm" /> : "Quitar"}
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
                  <div className="py-8 text-center border rounded-md">
                    <p className="text-muted-foreground">
                      No hay marcas asociadas a este supermercado.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}