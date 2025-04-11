/**
 * Funcionalidades:
 * - Ver información detallada de la marca
 * - Editar información de la marca
 * - Eliminar la marca (si no tiene productos asociados)
 * - Ver productos asociados a la marca
 * - Agregar productos existentes a la marca
 * - Editar productos de la marca
 * - Quitar productos de la marca
 * - Ver supermercados que ofrecen la marca
 * - Agregar supermercados a la marca
 * - Quitar supermercados de la marca
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import React from "react";
import { 
  ArrowLeft, 
  Pencil, 
  Trash2, 
  Save, 
  Plus, 
  Search,
  X,
  CheckCircle, 
  XCircle,
  ShoppingCart
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/Spinner";

// Interfaces
interface Marca {
  id: number;
  nombre: string;
  descripcion: string;
  imagenUrl: string | null;
  logoUrl: string | null;
  esMarcaBlanca: boolean;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    productos: number;
    supermercados: number;
  };
}

interface MarcaInput {
  nombre: string;
  descripcion: string;
  imagenUrl: string | null;
  esMarcaBlanca: boolean;
  activo: boolean;
}

interface Producto {
  id: number;
  nombre: string;
  descripcion: string | null;
  imagenUrl: string | null;
  precio: number | null;
  tipoProductoId: number | null;
  tipoProducto: {
    nombre: string;
  } | null;
  marcaId: number | null;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ProductoInput {
  nombre: string;
  descripcion: string | null;
  imagenUrl: string | null;
  precio: number | null;
  tipoProductoId: number | null;
  marcaId: number | null;
  activo: boolean;
}

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
  _count?: {
    precios: number;
  };
}

export default function MarcaDetallePage() {
  const router = useRouter();
  const params = useParams();
  const marcaId = parseInt(params.marcaId as string);
  
  const [marca, setMarca] = useState<Marca | null>(null);
  const [editedMarca, setEditedMarca] = useState<MarcaInput>({
    nombre: "",
    descripcion: "",
    imagenUrl: null,
    esMarcaBlanca: false,
    activo: true
  });
  
  const [productos, setProductos] = useState<Producto[]>([]);
  const [availableProductos, setAvailableProductos] = useState<Producto[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  
  const [supermercados, setSupermercados] = useState<Supermercado[]>([]);
  const [availableSupermercados, setAvailableSupermercados] = useState<Supermercado[]>([]);
  const [selectedSupermercadoIds, setSelectedSupermercadoIds] = useState<number[]>([]);
  const [selectedSupermercadoId, setSelectedSupermercadoId] = useState<number | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isSearchingProducts, setIsSearchingProducts] = useState<boolean>(false);
  const [isSearchingSupermercados, setIsSearchingSupermercados] = useState<boolean>(false);
  
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchSupermercadoTerm, setSearchSupermercadoTerm] = useState<string>("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [openAddProductsDialog, setOpenAddProductsDialog] = useState<boolean>(false);
  const [openRemoveProductDialog, setOpenRemoveProductDialog] = useState<boolean>(false);
  const [openAddSupermercadosDialog, setOpenAddSupermercadosDialog] = useState<boolean>(false);
  const [openRemoveSupermercadoDialog, setOpenRemoveSupermercadoDialog] = useState<boolean>(false);

  // Fetch marca and its products and supermarkets
  const fetchMarca = async () => {
    try {
      setIsLoading(true);
      
      // Fetch marca details
      const marcaResponse = await axios.get(`/api/admin/marcas/${marcaId}`);
      
      // Ensure we create proper Date objects
      const marcaData = {
        ...marcaResponse.data,
        createdAt: new Date(marcaResponse.data.createdAt || Date.now()),
        updatedAt: new Date(marcaResponse.data.updatedAt || Date.now())
      };
      
      setMarca(marcaData);
      setEditedMarca({
        nombre: marcaData.nombre,
        descripcion: marcaData.descripcion,
        imagenUrl: marcaData.imagenUrl || marcaData.logoUrl, // Handle both field names
        esMarcaBlanca: marcaData.esMarcaBlanca,
        activo: marcaData.activo
      });
      
      // Fetch products of the marca
      const productosResponse = await axios.get(`/api/admin/marcas/${marcaId}/productos`);
      
      // Check if the API response has the new structure with success and data properties
      let productosData;
      if (productosResponse.data && productosResponse.data.success === true && Array.isArray(productosResponse.data.data)) {
        productosData = productosResponse.data.data;
      } else if (Array.isArray(productosResponse.data)) {
        productosData = productosResponse.data;
      } else {
        productosData = [];
      }
      
      // Make sure to create valid Date objects with fallback
      const productosFormateados = productosData.map((producto: any) => ({
        ...producto,
        createdAt: new Date(producto.createdAt || Date.now()),
        updatedAt: new Date(producto.updatedAt || Date.now())
      }));
      
      setProductos(productosFormateados);
      
      // Fetch supermarkets associated with the marca
      fetchSupermercadosMarca();
    } catch (error) {
      console.error("Error fetching marca details:", error);
      toast.error("Error al cargar los detalles de la marca");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch supermarkets associated with the marca
  const fetchSupermercadosMarca = async () => {
    try {
      const response = await axios.get(`/api/admin/marcas/${marcaId}/supermercados`);
      
      // Handle different response formats
      let supermercadosData = [];
      if (response.data.success && Array.isArray(response.data.data)) {
        supermercadosData = response.data.data;
      } else if (Array.isArray(response.data)) {
        supermercadosData = response.data;
      } else {
        console.warn("Formato de respuesta inesperado en supermercados:", response.data);
        supermercadosData = [];
      }
      
      // Ensure all date fields are properly converted
      const formattedSupermercados = supermercadosData.map((supermercado: any) => ({
        ...supermercado,
        fechaCreacion: supermercado.fechaCreacion ? new Date(supermercado.fechaCreacion) : new Date(),
        fechaUltimoProcesamiento: supermercado.fechaUltimoProcesamiento 
          ? new Date(supermercado.fechaUltimoProcesamiento)
          : null,
        activo: typeof supermercado.activo === 'boolean' ? supermercado.activo : true
      }));
      
      setSupermercados(formattedSupermercados);
    } catch (error) {
      console.error("Error al cargar supermercados de la marca:", error);
      toast.error("Error al cargar supermercados asociados");
      setSupermercados([]);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (isNaN(marcaId)) {
      toast.error("ID de marca inválido");
      router.push("/gestionar/marcas");
      return;
    }
    
    fetchMarca();
  }, [marcaId, router]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedMarca(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle switch change for active status
  const handleActivoChange = (checked: boolean) => {
    setEditedMarca(prev => ({
      ...prev,
      activo: checked
    }));
  };

  // Handle switch change for marca blanca status
  const handleMarcaBlancaChange = (checked: boolean) => {
    setEditedMarca(prev => ({
      ...prev,
      esMarcaBlanca: checked
    }));
  };

  // Save marca changes
  const handleSaveMarca = async () => {
    // Validate required fields
    if (!editedMarca.nombre.trim()) {
      toast.error("El nombre de la marca es obligatorio");
      return;
    }

    try {
      setIsSaving(true);
      await axios.patch(`/api/admin/marcas/${marcaId}`, editedMarca);
      
      toast.success("Marca actualizada correctamente");
      fetchMarca();
    } catch (error) {
      console.error("Error updating marca:", error);
      toast.error("Error al actualizar la marca");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete marca
  const handleDeleteMarca = async () => {
    try {
      setIsDeleting(true);
      await axios.delete(`/api/admin/marcas/${marcaId}`);
      
      toast.success("Marca eliminada correctamente");
      router.push("/gestionar/marcas");
    } catch (error: any) {
      console.error("Error deleting marca:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error al eliminar la marca");
      }
    } finally {
      setIsDeleting(false);
      setOpenDeleteDialog(false);
    }
  };

  // Search for available products
  const searchAvailableProducts = async () => {
    try {
      setIsSearchingProducts(true);
      const response = await axios.get(`/api/admin/productos`, {
        params: {
          search: searchTerm,
          excludeMarcaId: marcaId
        }
      });
      
      const availableProductsData = response.data.map((producto: any) => ({
        ...producto,
        createdAt: new Date(producto.createdAt),
        updatedAt: new Date(producto.updatedAt)
      }));
      
      setAvailableProductos(availableProductsData);
    } catch (error) {
      console.error("Error searching products:", error);
      toast.error("Error al buscar productos");
    } finally {
      setIsSearchingProducts(false);
    }
  };

  // Handle add products to marca
  const handleAddProductsToMarca = async () => {
    if (selectedProductIds.length === 0) {
      toast.error("Selecciona al menos un producto");
      return;
    }

    try {
      setIsSaving(true);
      await axios.post(`/api/admin/marcas/${marcaId}/productos`, {
        productIds: selectedProductIds
      });
      
      toast.success("Productos añadidos a la marca correctamente");
      setOpenAddProductsDialog(false);
      setSelectedProductIds([]);
      setAvailableProductos([]);
      setSearchTerm("");
      fetchMarca();
    } catch (error) {
      console.error("Error adding products to marca:", error);
      toast.error("Error al añadir productos a la marca");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle remove product from marca
  const handleRemoveProductFromMarca = async () => {
    if (!selectedProductId) return;

    try {
      setIsSaving(true);
      await axios.delete(`/api/admin/marcas/${marcaId}/productos/${selectedProductId}`);
      
      toast.success("Producto eliminado de la marca correctamente");
      setOpenRemoveProductDialog(false);
      setSelectedProductId(null);
      fetchMarca();
    } catch (error) {
      console.error("Error removing product from marca:", error);
      toast.error("Error al eliminar el producto de la marca");
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle product selection
  const toggleProductSelection = (productId: number) => {
    setSelectedProductIds(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Navigate back to marcas list
  const goBack = () => {
    router.push("/gestionar/marcas");
  };

  // Navigate to product detail
  const goToProductDetail = (productId: number) => {
    router.push(`/gestionar/productos/${productId}`);
  };

  // Search for available supermarkets
  const searchAvailableSupermercados = async () => {
    setIsSearchingSupermercados(true);
    try {
      const response = await axios.get('/api/admin/supermercados', {
        params: {
          search: searchSupermercadoTerm
        }
      });
      
      if (Array.isArray(response.data)) {
        // Filtrar para excluir los supermercados ya asociados
        const supermercadosIds = supermercados.map(s => s.id);
        const availableSupermercadosData = response.data
          .filter((supermercado: any) => !supermercadosIds.includes(supermercado.id))
          .map((supermercado: any) => ({
            ...supermercado,
            fechaCreacion: new Date(supermercado.fechaCreacion || Date.now()),
            fechaUltimoProcesamiento: supermercado.fechaUltimoProcesamiento 
              ? new Date(supermercado.fechaUltimoProcesamiento)
              : null
          }));
        
        setAvailableSupermercados(availableSupermercadosData);
      }
    } catch (error) {
      console.error("Error al buscar supermercados:", error);
      toast.error("Error al buscar supermercados disponibles");
    } finally {
      setIsSearchingSupermercados(false);
    }
  };
  
  // Toggle supermercado selection
  const toggleSupermercadoSelection = (supermercadoId: number) => {
    setSelectedSupermercadoIds(prev => 
      prev.includes(supermercadoId)
        ? prev.filter(id => id !== supermercadoId)
        : [...prev, supermercadoId]
    );
  };
  
  // Add supermarkets to marca
  const handleAddSupermercadosToMarca = async () => {
    if (selectedSupermercadoIds.length === 0) {
      toast.error("Selecciona al menos un supermercado");
      return;
    }
    
    setIsSaving(true);
    try {
      const response = await axios.post(`/api/admin/marcas/${marcaId}/supermercados`, {
        supermercadoIds: selectedSupermercadoIds
      });
      
      toast.success("Supermercados añadidos a la marca correctamente");
      
      // Añadir directamente los supermercados seleccionados al estado local para actualización inmediata
      const selectedSupermercados = availableSupermercados.filter(supermercado => 
        selectedSupermercadoIds.includes(supermercado.id)
      );
      setSupermercados(prev => [...prev, ...selectedSupermercados]);
      
      setOpenAddSupermercadosDialog(false);
      setSelectedSupermercadoIds([]);
      setAvailableSupermercados([]);
      setSearchSupermercadoTerm("");
    } catch (error) {
      console.error("Error al añadir supermercados:", error);
      toast.error("Error al añadir supermercados a la marca");
    } finally {
      setIsSaving(false);
    }
  };
  
  // Remove supermercado from marca
  const handleRemoveSupermercadoFromMarca = async () => {
    if (!selectedSupermercadoId) return;
    
    setIsSaving(true);
    try {
      await axios.delete(`/api/admin/marcas/${marcaId}/supermercados/${selectedSupermercadoId}`);
      
      toast.success("Supermercado eliminado de la marca correctamente");
      
      // Eliminar el supermercado del estado local para actualización inmediata
      setSupermercados(prev => prev.filter(supermercado => supermercado.id !== selectedSupermercadoId));
      
      setOpenRemoveSupermercadoDialog(false);
      setSelectedSupermercadoId(null);
    } catch (error) {
      console.error("Error al quitar supermercado:", error);
      toast.error("Error al quitar el supermercado de la marca");
    } finally {
      setIsSaving(false);
    }
  };
  
  // Go to supermercado detail page
  const goToSupermercadoDetail = (supermercadoId: number) => {
    router.push(`/gestionar/supermercados/${supermercadoId}`);
  };

  // Display loading state
  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Display error if marca not found
  if (!marca) {
    return (
      <div className="p-6">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>La marca solicitada no existe o ha sido eliminada.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={goBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Marcas
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Button variant="outline" onClick={goBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a Marcas
      </Button>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">Detalles de Marca</CardTitle>
              <CardDescription>
                Visualiza y edita la información de la marca
              </CardDescription>
            </div>
            
            <div className="flex gap-2">
              <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={marca._count.productos > 0}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar Marca
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción eliminará permanentemente la marca <strong>{marca.nombre}</strong> y no se puede deshacer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteMarca}
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
              <TabsTrigger value="productos">
                Productos
                <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                  {marca._count.productos}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="supermercados">
                Supermercados
                <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                  {marca._count.supermercados || 0}
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
                      value={editedMarca.nombre}
                      onChange={handleInputChange}
                      placeholder="Nombre de la marca"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Textarea
                      id="descripcion"
                      name="descripcion"
                      value={editedMarca.descripcion}
                      onChange={handleInputChange}
                      placeholder="Descripción de la marca"
                      rows={4}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="imagenUrl">URL de la Imagen</Label>
                    <Input
                      id="imagenUrl"
                      name="imagenUrl"
                      value={editedMarca.imagenUrl || ''}
                      onChange={handleInputChange}
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 py-2">
                    <Switch
                      id="esMarcaBlanca"
                      checked={editedMarca.esMarcaBlanca}
                      onCheckedChange={handleMarcaBlancaChange}
                    />
                    <Label htmlFor="esMarcaBlanca">Marca Blanca</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 py-2">
                    <Switch
                      id="activo"
                      checked={editedMarca.activo}
                      onCheckedChange={handleActivoChange}
                    />
                    <Label htmlFor="activo">Marca Activa</Label>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {editedMarca.imagenUrl && (
                    <div className="space-y-2">
                      <Label>Vista Previa de la Imagen</Label>
                      <div className="border rounded-md p-2 w-full h-48 flex items-center justify-center bg-muted">
                        <Image
                          src={editedMarca.imagenUrl}
                          alt={editedMarca.nombre}
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
                      {marca.createdAt instanceof Date && !isNaN(marca.createdAt.getTime()) 
                        ? format(marca.createdAt, "PPpp", { locale: es })
                        : "Fecha no disponible"}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Última Actualización</Label>
                    <div className="p-2 border rounded-md bg-muted">
                      {marca.updatedAt instanceof Date && !isNaN(marca.updatedAt.getTime())
                        ? format(marca.updatedAt, "PPpp", { locale: es })
                        : "Fecha no disponible"}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Productos Asociados</Label>
                    <div className="p-2 border rounded-md bg-muted flex items-center">
                      <span className="text-lg font-medium">{marca._count.productos}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveMarca} disabled={isSaving}>
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

            <TabsContent value="productos">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Productos de la Marca</h3>
                  
                  <Dialog open={openAddProductsDialog} onOpenChange={setOpenAddProductsDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Añadir Productos
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Añadir Productos a la Marca</DialogTitle>
                        <DialogDescription>
                          Busca y selecciona los productos que deseas añadir a esta marca
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="relative flex-1">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Buscar productos por nombre..."
                              className="pl-8"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                          </div>
                          <Button
                            onClick={searchAvailableProducts}
                            disabled={isSearchingProducts}
                          >
                            {isSearchingProducts ? <Spinner size="sm" /> : "Buscar"}
                          </Button>
                        </div>
                        
                        {availableProductos.length > 0 ? (
                          <div className="border rounded-md max-h-[400px] overflow-y-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-12"></TableHead>
                                  <TableHead>Producto</TableHead>
                                  <TableHead>Tipo</TableHead>
                                  <TableHead>Precio</TableHead>
                                  <TableHead>Estado</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {availableProductos.map((producto) => (
                                  <TableRow
                                    key={producto.id}
                                    className={selectedProductIds.includes(producto.id) ? "bg-muted/50" : ""}
                                  >
                                    <TableCell>
                                      <div className="flex items-center justify-center">
                                        <input
                                          type="checkbox"
                                          checked={selectedProductIds.includes(producto.id)}
                                          onChange={() => toggleProductSelection(producto.id)}
                                          className="h-4 w-4"
                                        />
                                      </div>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                      <div className="flex items-center gap-2">
                                        {producto.imagenUrl && (
                                          <Image
                                            src={producto.imagenUrl}
                                            alt={producto.nombre}
                                            width={32}
                                            height={32}
                                            className="rounded-sm object-contain"
                                          />
                                        )}
                                        {producto.nombre}
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      {producto.tipoProducto?.nombre || "Sin tipo"}
                                    </TableCell>
                                    <TableCell>
                                      {producto.precio ? `${producto.precio.toFixed(2)} €` : "No definido"}
                                    </TableCell>
                                    <TableCell>
                                      <Badge variant={producto.activo ? "default" : "secondary"}>
                                        {producto.activo ? "Activo" : "Inactivo"}
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
                              No se encontraron productos con ese criterio de búsqueda.
                            </p>
                          </div>
                        ) : (
                          <div className="py-8 text-center">
                            <p className="text-muted-foreground">
                              Busca productos para añadirlos a esta marca.
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <DialogFooter>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setOpenAddProductsDialog(false);
                            setSelectedProductIds([]);
                            setAvailableProductos([]);
                            setSearchTerm("");
                          }}
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={handleAddProductsToMarca}
                          disabled={selectedProductIds.length === 0 || isSaving}
                        >
                          {isSaving ? (
                            <Spinner size="sm" />
                          ) : (
                            <>Añadir {selectedProductIds.length} productos</>
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {productos.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {productos.map((producto) => (
                        <TableRow key={producto.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {producto.imagenUrl && (
                                <Image
                                  src={producto.imagenUrl}
                                  alt={producto.nombre}
                                  width={32}
                                  height={32}
                                  className="rounded-sm object-contain"
                                />
                              )}
                              {producto.nombre}
                            </div>
                          </TableCell>
                          <TableCell>
                            {producto.tipoProducto?.nombre || "Sin tipo"}
                          </TableCell>
                          <TableCell>
                            {producto.precio ? `${producto.precio.toFixed(2)} €` : "No definido"}
                          </TableCell>
                          <TableCell>
                            <Badge variant={producto.activo ? "default" : "secondary"}>
                              {producto.activo ? "Activo" : "Inactivo"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => goToProductDetail(producto.id)}
                                title="Editar producto"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <AlertDialog
                                open={openRemoveProductDialog && selectedProductId === producto.id}
                                onOpenChange={(isOpen) => {
                                  setOpenRemoveProductDialog(isOpen);
                                  if (!isOpen) setSelectedProductId(null);
                                }}
                              >
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="destructive"
                                    onClick={() => setSelectedProductId(producto.id)}
                                    title="Quitar de la marca"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Esta acción eliminará la asociación del producto <strong>{producto.nombre}</strong> con esta marca, pero no eliminará el producto del sistema.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={handleRemoveProductFromMarca}
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
                      No hay productos asociados a esta marca.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="supermercados">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Supermercados que Ofrecen esta Marca</h3>
                  
                  <Dialog open={openAddSupermercadosDialog} onOpenChange={setOpenAddSupermercadosDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Añadir Supermercados
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Añadir Supermercados a la Marca</DialogTitle>
                        <DialogDescription>
                          Busca y selecciona los supermercados donde se ofrece esta marca
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="relative flex-1">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Buscar supermercados por nombre..."
                              className="pl-8"
                              value={searchSupermercadoTerm}
                              onChange={(e) => setSearchSupermercadoTerm(e.target.value)}
                            />
                          </div>
                          <Button
                            onClick={searchAvailableSupermercados}
                            disabled={isSearchingSupermercados}
                          >
                            {isSearchingSupermercados ? <Spinner size="sm" /> : "Buscar"}
                          </Button>
                        </div>
                        
                        {availableSupermercados.length > 0 ? (
                          <div className="border rounded-md max-h-[400px] overflow-y-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-12"></TableHead>
                                  <TableHead>Supermercado</TableHead>
                                  <TableHead>Método Obtención</TableHead>
                                  <TableHead>Estado</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {availableSupermercados.map((supermercado) => (
                                  <TableRow
                                    key={supermercado.id}
                                    className={selectedSupermercadoIds.includes(supermercado.id) ? "bg-muted/50" : ""}
                                  >
                                    <TableCell>
                                      <div className="flex items-center justify-center">
                                        <input
                                          type="checkbox"
                                          checked={selectedSupermercadoIds.includes(supermercado.id)}
                                          onChange={() => toggleSupermercadoSelection(supermercado.id)}
                                          className="h-4 w-4"
                                        />
                                      </div>
                                    </TableCell>
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
                                    <TableCell>
                                      {supermercado.metodoObtencion?.valor || "No especificado"}
                                    </TableCell>
                                    <TableCell>
                                      <Badge variant={supermercado.activo ? "default" : "secondary"}>
                                        {supermercado.activo ? "Activo" : "Inactivo"}
                                      </Badge>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : searchSupermercadoTerm ? (
                          <div className="py-8 text-center">
                            <p className="text-muted-foreground">
                              No se encontraron supermercados con ese criterio de búsqueda.
                            </p>
                          </div>
                        ) : (
                          <div className="py-8 text-center">
                            <p className="text-muted-foreground">
                              Busca supermercados para añadirlos a esta marca.
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <DialogFooter>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setOpenAddSupermercadosDialog(false);
                            setSelectedSupermercadoIds([]);
                            setAvailableSupermercados([]);
                            setSearchSupermercadoTerm("");
                          }}
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={handleAddSupermercadosToMarca}
                          disabled={selectedSupermercadoIds.length === 0 || isSaving}
                        >
                          {isSaving ? (
                            <Spinner size="sm" />
                          ) : (
                            <>Añadir {selectedSupermercadoIds.length} supermercados</>
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {supermercados.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Supermercado</TableHead>
                        <TableHead>Método Obtención</TableHead>
                        <TableHead>Última Actualización</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {supermercados.map((supermercado) => (
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
                          <TableCell>
                            {supermercado.metodoObtencion?.valor || "No especificado"}
                          </TableCell>
                          <TableCell>
                            {supermercado.fechaUltimoProcesamiento instanceof Date && !isNaN(supermercado.fechaUltimoProcesamiento.getTime())
                              ? format(supermercado.fechaUltimoProcesamiento, "dd/MM/yyyy", { locale: es })
                              : "Nunca"}
                          </TableCell>
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
                                title="Ver detalles del supermercado"
                              >
                                <ShoppingCart className="h-4 w-4" />
                              </Button>
                              <AlertDialog
                                open={openRemoveSupermercadoDialog && selectedSupermercadoId === supermercado.id}
                                onOpenChange={(isOpen) => {
                                  setOpenRemoveSupermercadoDialog(isOpen);
                                  if (!isOpen) setSelectedSupermercadoId(null);
                                }}
                              >
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="destructive"
                                    onClick={() => setSelectedSupermercadoId(supermercado.id)}
                                    title="Quitar de la marca"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Esta acción eliminará la asociación del supermercado <strong>{supermercado.nombre}</strong> con esta marca, pero no eliminará el supermercado del sistema.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={handleRemoveSupermercadoFromMarca}
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
                      No hay supermercados asociados a esta marca.
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