/**
 * Funcionalidades:
 * - Ver detalles de un producto específico
 * - Editar propiedades del producto
 * - Gestionar etiquetas asociadas al producto
 * - Ver precios asociados al producto
 * - Marcar/desmarcar como descontinuado
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  ArrowLeft, 
  Save,
  Pencil,
  X,
  Tag,
  ShoppingCart,
  PackageCheck,
  Plus,
  Trash2
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/Spinner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Interfaces
interface Producto {
  id: number;
  nombre: string;
  marcaId: number;
  tipoProductoId: number;
  tamanoCantidad: number;
  unidadMedidaId: number;
  fotoUrl: string | null;
  descontinuado: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  marca: {
    nombre: string;
    logoUrl: string | null;
  };
  tipoProducto: {
    nombre: string;
    categoria: {
      nombre: string;
    };
  };
  unidadMedida: {
    valor: string;
  };
  etiquetas: Etiqueta[];
  _count: {
    precios: number;
  };
}

interface Precio {
  id: number;
  productoId: number;
  supermercadoId: number;
  precioActual: number;
  esOferta: boolean;
  precioPromocional: number | null;
  fechaInicioPromocion: Date | null;
  fechaFinPromocion: Date | null;
  fechaActualizacion: Date;
  metodoObtencionId: number;
  supermercado: {
    nombre: string;
    logoUrl: string | null;
  };
  metodoObtencion: {
    valor: string;
  };
}

interface Marca {
  id: number;
  nombre: string;
  logoUrl: string | null;
}

interface TipoProducto {
  id: number;
  nombre: string;
  categoriaId: number;
  categoria: {
    nombre: string;
  };
}

interface UnidadMedida {
  id: number;
  valor: string;
  descripcion: string;
}

interface Etiqueta {
  id: number;
  valor: string;
  descripcion: string;
}

interface Supermercado {
  id: number;
  nombre: string;
  logoUrl: string | null;
}

interface MetodoObtencion {
  id: number;
  valor: string;
  descripcion: string;
}

// Schema for price form
const precioSchema = z.object({
  supermercadoId: z.number().int().positive(),
  precioActual: z.number().positive(),
  esOferta: z.boolean().optional().default(false),
  precioPromocional: z.number().positive().optional().nullable(),
  fechaInicioPromocion: z.string().datetime().optional().nullable(),
  fechaFinPromocion: z.string().datetime().optional().nullable(),
  metodoObtencionId: z.number().int().positive()
});

// Add this new interface for the price dialog
interface PrecioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  precio: Precio | null;
  onSave: (precio: z.infer<typeof precioSchema>) => void;
  supermercados: Supermercado[];
  metodosObtencion: MetodoObtencion[];
}

// Update the formatPrice function
const formatPrice = (price: number) => {
  return price.toFixed(2).replace('.', ',') + ' €';
};

export default function ProductoDetailPage({
  params,
}: {
  params: { productoId: string };
}) {
  const router = useRouter();
  const productoId = parseInt(params.productoId, 10);
  
  const [producto, setProducto] = useState<Producto | null>(null);
  const [precios, setPrecios] = useState<Precio[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [tiposProducto, setTiposProducto] = useState<TipoProducto[]>([]);
  const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([]);
  const [etiquetas, setEtiquetas] = useState<Etiqueta[]>([]);
  const [selectedEtiquetaIds, setSelectedEtiquetaIds] = useState<number[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: "",
    marcaId: 0,
    tipoProductoId: 0,
    tamanoCantidad: 0,
    unidadMedidaId: 0,
    fotoUrl: "",
    descontinuado: false
  });
  
  const [precioDialogOpen, setPrecioDialogOpen] = useState(false);
  const [selectedPrecio, setSelectedPrecio] = useState<Precio | null>(null);
  
  // Add supermercados to the state variables
  const [supermercados, setSupermercados] = useState<Supermercado[]>([]);
  
  // Add metodosObtencion to the state variables
  const [metodosObtencion, setMetodosObtencion] = useState<MetodoObtencion[]>([]);
  
  // Cargar datos del producto
  useEffect(() => {
    if (isNaN(productoId)) {
      toast.error("ID de producto inválido");
      router.push("/gestionar/productos");
      return;
    }
    
    fetchProducto();
    fetchPrecios();
    fetchMarcas();
    fetchTiposProducto();
    fetchUnidadesMedida();
    fetchEtiquetas();
    fetchSupermercados();
    fetchMetodosObtencion();
  }, [productoId]);
  
  // Inicializar el formulario cuando se cargan los datos del producto
  useEffect(() => {
    if (producto) {
      setFormData({
        nombre: producto.nombre,
        marcaId: producto.marcaId,
        tipoProductoId: producto.tipoProductoId,
        tamanoCantidad: producto.tamanoCantidad,
        unidadMedidaId: producto.unidadMedidaId,
        fotoUrl: producto.fotoUrl || "",
        descontinuado: producto.descontinuado
      });
      
      setSelectedEtiquetaIds(producto.etiquetas.map(e => e.id));
    }
  }, [producto]);
  
  // Obtener datos del producto
  const fetchProducto = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/admin/productos/${productoId}`);
      
      // Convertir fechas a objetos Date
      const productoData = {
        ...response.data,
        fechaCreacion: new Date(response.data.fechaCreacion),
        fechaActualizacion: new Date(response.data.fechaActualizacion)
      };
      
      setProducto(productoData);
    } catch (error) {
      console.error("Error al cargar el producto:", error);
      toast.error("Error al cargar los datos del producto");
      router.push("/gestionar/productos");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Obtener precios asociados al producto
  const fetchPrecios = async () => {
    try {
      const response = await axios.get(`/api/admin/productos/${productoId}/precios`);
      
      // Asumiendo que la API devuelve un array de precios
      const preciosData = Array.isArray(response.data) ? response.data.map((precio: any) => ({
        ...precio,
        fechaActualizacion: new Date(precio.fechaActualizacion),
        fechaInicioPromocion: precio.fechaInicioPromocion ? new Date(precio.fechaInicioPromocion) : null,
        fechaFinPromocion: precio.fechaFinPromocion ? new Date(precio.fechaFinPromocion) : null
      })) : [];
      
      setPrecios(preciosData);
    } catch (error) {
      console.error("Error al cargar los precios:", error);
      toast.error("Error al cargar los precios del producto");
    }
  };
  
  // Obtener marcas
  const fetchMarcas = async () => {
    try {
      const response = await axios.get('/api/admin/marcas');
      setMarcas(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error al cargar marcas:", error);
      toast.error("Error al cargar las marcas");
    }
  };
  
  // Obtener tipos de producto
  const fetchTiposProducto = async () => {
    try {
      const response = await axios.get('/api/admin/tiposproducto');
      
      let tiposData = [];
      if (response.data.success && Array.isArray(response.data.data)) {
        tiposData = response.data.data;
      } else if (Array.isArray(response.data)) {
        tiposData = response.data;
      }
      
      setTiposProducto(tiposData);
    } catch (error) {
      console.error("Error al cargar tipos de producto:", error);
      toast.error("Error al cargar los tipos de producto");
    }
  };
  
  // Obtener unidades de medida
  const fetchUnidadesMedida = async () => {
    try {
      const response = await axios.get('/api/admin/unidadesdemedida');
      
      let unidadesData = [];
      if (response.data.success && Array.isArray(response.data.data)) {
        unidadesData = response.data.data;
      } else if (Array.isArray(response.data)) {
        unidadesData = response.data;
      }
      
      setUnidadesMedida(unidadesData);
    } catch (error) {
      console.error("Error al cargar unidades de medida:", error);
      toast.error("Error al cargar las unidades de medida");
    }
  };
  
  // Obtener etiquetas
  const fetchEtiquetas = async () => {
    try {
      const response = await axios.get('/api/admin/etiquetas');
      
      let etiquetasData = [];
      if (response.data.success && Array.isArray(response.data.data)) {
        etiquetasData = response.data.data;
      } else if (Array.isArray(response.data)) {
        etiquetasData = response.data;
      }
      
      setEtiquetas(etiquetasData);
    } catch (error) {
      console.error("Error al cargar etiquetas:", error);
      toast.error("Error al cargar las etiquetas");
    }
  };
  
  // Add the fetchSupermercados function
  const fetchSupermercados = async () => {
    try {
      const response = await axios.get('/api/admin/supermercados');
      setSupermercados(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error al cargar supermercados:", error);
      toast.error("Error al cargar los supermercados");
    }
  };
  
  // Add the fetchMetodosObtencion function
  const fetchMetodosObtencion = async () => {
    try {
      const response = await axios.get('/api/admin/metodosobtencion');
      
      if (response.data.success) {
        setMetodosObtencion(response.data.data);
      } else {
        toast.error("Error al cargar los métodos de obtención: " + response.data.message);
      }
    } catch (error) {
      console.error("Error al cargar los métodos de obtención:", error);
      toast.error("Error al cargar los métodos de obtención");
    }
  };
  
  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'tamanoCantidad' ? parseFloat(value) : value
    }));
  };
  
  // Manejar cambio en la marca
  const handleMarcaChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      marcaId: parseInt(value)
    }));
  };
  
  // Manejar cambio en el tipo de producto
  const handleTipoProductoChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      tipoProductoId: parseInt(value)
    }));
  };
  
  // Manejar cambio en la unidad de medida
  const handleUnidadMedidaChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      unidadMedidaId: parseInt(value)
    }));
  };
  
  // Manejar cambio en el estado descontinuado
  const handleDescontinuadoChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      descontinuado: checked
    }));
  };
  
  // Manejar cambio en las etiquetas
  const handleEtiquetaSelection = (etiquetaId: number) => {
    setSelectedEtiquetaIds(prev => {
      if (prev.includes(etiquetaId)) {
        // Quitar la etiqueta si ya está seleccionada
        return prev.filter(id => id !== etiquetaId);
      } else {
        // Añadir la etiqueta si no está seleccionada
        return [...prev, etiquetaId];
      }
    });
  };
  
  // Validar formulario
  const isFormValid = () => {
    if (!formData.nombre.trim()) {
      toast.error("El nombre del producto es obligatorio");
      return false;
    }
    
    if (!formData.marcaId) {
      toast.error("Debe seleccionar una marca");
      return false;
    }
    
    if (!formData.tipoProductoId) {
      toast.error("Debe seleccionar un tipo de producto");
      return false;
    }
    
    if (formData.tamanoCantidad <= 0) {
      toast.error("La cantidad debe ser mayor a cero");
      return false;
    }
    
    if (!formData.unidadMedidaId) {
      toast.error("Debe seleccionar una unidad de medida");
      return false;
    }
    
    return true;
  };
  
  // Guardar cambios
  const handleSaveChanges = async () => {
    if (!isFormValid()) return;
    
    setIsSaving(true);
    try {
      // Preparar datos para actualizar
      const updateData = {
        ...formData,
        fotoUrl: formData.fotoUrl || null,
        etiquetaIds: selectedEtiquetaIds
      };
      
      // Enviar actualizaciones
      const response = await axios.patch(`/api/admin/productos/${productoId}`, updateData);
      
      toast.success("Producto actualizado correctamente");
      setIsEditing(false);
      
      // Actualizar los datos locales
      setProducto(response.data);
    } catch (error: any) {
      console.error("Error al actualizar producto:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error al actualizar el producto");
      }
    } finally {
      setIsSaving(false);
    }
  };
  
  // Cancelar edición
  const handleCancelEdit = () => {
    // Restaurar los valores originales
    if (producto) {
      setFormData({
        nombre: producto.nombre,
        marcaId: producto.marcaId,
        tipoProductoId: producto.tipoProductoId,
        tamanoCantidad: producto.tamanoCantidad,
        unidadMedidaId: producto.unidadMedidaId,
        fotoUrl: producto.fotoUrl || "",
        descontinuado: producto.descontinuado
      });
      
      setSelectedEtiquetaIds(producto.etiquetas.map(e => e.id));
    }
    
    setIsEditing(false);
  };
  
  // Renderizar etiquetas
  const renderEtiquetas = (etiquetas: Etiqueta[]) => {
    if (etiquetas.length === 0) return <p className="text-muted-foreground">No hay etiquetas asignadas</p>;
    
    return (
      <div className="flex flex-wrap gap-2">
        {etiquetas.map((etiqueta) => (
          <Badge key={etiqueta.id} variant="outline">
            <Tag className="h-4 w-4 mr-1" />
            {etiqueta.valor}
          </Badge>
        ))}
      </div>
    );
  };
  
  // Add this new component for the price dialog
  function PrecioDialog({ open, onOpenChange, precio, onSave, supermercados, metodosObtencion }: PrecioDialogProps) {
    const [formData, setFormData] = useState({
      supermercadoId: precio?.supermercadoId || 0,
      precioActual: precio?.precioActual || 0,
      esOferta: precio?.esOferta || false,
      precioPromocional: precio?.precioPromocional || null,
      fechaInicioPromocion: precio?.fechaInicioPromocion?.toISOString().slice(0, 16) || '',
      fechaFinPromocion: precio?.fechaFinPromocion?.toISOString().slice(0, 16) || '',
      metodoObtencionId: precio?.metodoObtencionId || 0
    });

    const handleSubmit = () => {
      onSave(formData);
      onOpenChange(false);
    };

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{precio ? 'Editar Precio' : 'Añadir Precio'}</DialogTitle>
            <DialogDescription>
              {precio ? 'Modifica los detalles del precio' : 'Añade un nuevo precio para este producto'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="supermercado">Supermercado</Label>
              <Select
                value={formData.supermercadoId.toString()}
                onValueChange={(value) => setFormData({ ...formData, supermercadoId: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un supermercado" />
                </SelectTrigger>
                <SelectContent>
                  {supermercados.map((supermercado) => (
                    <SelectItem key={supermercado.id} value={supermercado.id.toString()}>
                      {supermercado.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="precio">Precio Actual (€)</Label>
              <Input
                id="precio"
                type="number"
                step="0.01"
                value={formData.precioActual}
                onChange={(e) => setFormData({ ...formData, precioActual: parseFloat(e.target.value) })}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="metodo">Método de Obtención</Label>
              <Select
                value={formData.metodoObtencionId.toString()}
                onValueChange={(value) => setFormData({ ...formData, metodoObtencionId: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un método" />
                </SelectTrigger>
                <SelectContent>
                  {metodosObtencion.map((metodo) => (
                    <SelectItem key={metodo.id} value={metodo.id.toString()}>
                      {metodo.valor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="oferta"
                checked={formData.esOferta}
                onCheckedChange={(checked) => setFormData({ ...formData, esOferta: checked })}
              />
              <Label htmlFor="oferta">Es Oferta</Label>
            </div>
            
            {formData.esOferta && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="precioPromocional">Precio Promocional (€)</Label>
                  <Input
                    id="precioPromocional"
                    type="number"
                    step="0.01"
                    value={formData.precioPromocional || ''}
                    onChange={(e) => setFormData({ ...formData, precioPromocional: parseFloat(e.target.value) })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label>Período de Promoción</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="fechaInicio" className="text-xs">Inicio</Label>
                      <Input
                        id="fechaInicio"
                        type="datetime-local"
                        value={formData.fechaInicioPromocion}
                        onChange={(e) => setFormData({ ...formData, fechaInicioPromocion: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="fechaFin" className="text-xs">Fin</Label>
                      <Input
                        id="fechaFin"
                        type="datetime-local"
                        value={formData.fechaFinPromocion}
                        onChange={(e) => setFormData({ ...formData, fechaFinPromocion: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              {precio ? 'Guardar Cambios' : 'Añadir Precio'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
  
  // Add the handleDeletePrecio function
  const handleDeletePrecio = async (precioId: number) => {
    try {
      await axios.delete(`/api/admin/productos/${productoId}/precios/${precioId}`);
      toast.success("Precio eliminado correctamente");
      fetchPrecios();
    } catch (error) {
      console.error("Error al eliminar el precio:", error);
      toast.error("Error al eliminar el precio");
    }
  };
  
  const handleSavePrecio = async (precioData: z.infer<typeof precioSchema>) => {
    try {
      if (selectedPrecio) {
        // Update existing price
        await axios.put(`/api/admin/productos/${productoId}/precios/${selectedPrecio.id}`, precioData);
        toast.success("Precio actualizado correctamente");
      } else {
        // Create new price
        await axios.post(`/api/admin/productos/${productoId}/precios`, precioData);
        toast.success("Precio añadido correctamente");
      }
      fetchPrecios();
    } catch (error) {
      console.error("Error al guardar el precio:", error);
      toast.error("Error al guardar el precio");
    }
  };
  
  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[300px]">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (!producto) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Producto no encontrado</CardTitle>
            <CardDescription>
              No se pudo encontrar el producto solicitado.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.push("/gestionar/productos")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a la lista de productos
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => router.push("/gestionar/productos")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancelEdit}>
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button onClick={handleSaveChanges} disabled={isSaving}>
              {isSaving ? <Spinner size="sm" /> : <Save className="mr-2 h-4 w-4" />}
              Guardar
            </Button>
          </div>
        )}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            {producto.descontinuado && (
              <Badge variant="secondary" className="mr-2">Descontinuado</Badge>
            )}
            {producto.nombre}
          </CardTitle>
          <CardDescription>
            Creado el {format(producto.fechaCreacion, "dd/MM/yyyy", { locale: es })} • 
            Última actualización: {format(producto.fechaActualizacion, "dd/MM/yyyy HH:mm", { locale: es })}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="detalles">
            <TabsList className="mb-4">
              <TabsTrigger value="detalles">Detalles</TabsTrigger>
              <TabsTrigger value="precios">Precios ({precios.length})</TabsTrigger>
              <TabsTrigger value="etiquetas">Etiquetas ({producto.etiquetas.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="detalles">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  {/* Información básica */}
                  <div className="space-y-4">
                    {isEditing ? (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="nombre">Nombre</Label>
                          <Input
                            id="nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="marcaId">Marca</Label>
                          <Select 
                            value={formData.marcaId.toString()}
                            onValueChange={handleMarcaChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar marca" />
                            </SelectTrigger>
                            <SelectContent>
                              {marcas.map((marca) => (
                                <SelectItem key={marca.id} value={marca.id.toString()}>
                                  {marca.nombre}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="tipoProductoId">Tipo de Producto</Label>
                          <Select 
                            value={formData.tipoProductoId.toString()}
                            onValueChange={handleTipoProductoChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              {tiposProducto.map((tipo) => (
                                <SelectItem key={tipo.id} value={tipo.id.toString()}>
                                  {tipo.nombre} {tipo.categoria && `(${tipo.categoria.nombre})`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex gap-4">
                          <div className="space-y-2 flex-1">
                            <Label htmlFor="tamanoCantidad">Cantidad</Label>
                            <Input
                              id="tamanoCantidad"
                              name="tamanoCantidad"
                              type="number"
                              min="0.01"
                              step="0.01"
                              value={formData.tamanoCantidad}
                              onChange={handleInputChange}
                            />
                          </div>
                          
                          <div className="space-y-2 flex-1">
                            <Label htmlFor="unidadMedidaId">Unidad</Label>
                            <Select 
                              value={formData.unidadMedidaId.toString()}
                              onValueChange={handleUnidadMedidaChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar unidad" />
                              </SelectTrigger>
                              <SelectContent>
                                {unidadesMedida.map((unidad) => (
                                  <SelectItem key={unidad.id} value={unidad.id.toString()}>
                                    {unidad.valor}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="fotoUrl">URL de la Imagen</Label>
                          <Input
                            id="fotoUrl"
                            name="fotoUrl"
                            value={formData.fotoUrl}
                            onChange={handleInputChange}
                            placeholder="https://ejemplo.com/foto.jpg"
                          />
                        </div>
                        
                        <div className="flex items-center space-x-2 pt-2">
                          <Switch
                            id="descontinuado"
                            checked={formData.descontinuado}
                            onCheckedChange={handleDescontinuadoChange}
                          />
                          <Label htmlFor="descontinuado">Producto Descontinuado</Label>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-4 mb-4">
                          {producto.fotoUrl && (
                            <div className="flex-shrink-0">
                              <Image
                                src={producto.fotoUrl}
                                alt={producto.nombre}
                                width={120}
                                height={120}
                                className="rounded-md object-contain"
                              />
                            </div>
                          )}
                          
                          <div className="flex-grow">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h3 className="text-sm font-semibold text-muted-foreground">Marca</h3>
                                <div className="flex items-center gap-2 mt-1">
                                  {producto.marca.logoUrl && (
                                    <Image
                                      src={producto.marca.logoUrl}
                                      alt={producto.marca.nombre}
                                      width={24}
                                      height={24}
                                      className="rounded-sm object-contain"
                                    />
                                  )}
                                  <span className="font-medium">{producto.marca.nombre}</span>
                                </div>
                              </div>
                              
                              <div>
                                <h3 className="text-sm font-semibold text-muted-foreground">Tipo de Producto</h3>
                                <p className="font-medium">{producto.tipoProducto.nombre}</p>
                                {producto.tipoProducto.categoria && (
                                  <p className="text-sm text-muted-foreground">
                                    Categoría: {producto.tipoProducto.categoria.nombre}
                                  </p>
                                )}
                              </div>
                              
                              <div>
                                <h3 className="text-sm font-semibold text-muted-foreground">Tamaño</h3>
                                <p className="font-medium">
                                  {producto.tamanoCantidad} {producto.unidadMedida.valor}
                                </p>
                              </div>
                              
                              <div>
                                <h3 className="text-sm font-semibold text-muted-foreground">Estado</h3>
                                <p>
                                  {producto.descontinuado ? (
                                    <Badge variant="secondary">Descontinuado</Badge>
                                  ) : (
                                    <Badge variant="default">Activo</Badge>
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="precios">
              <div className="flex justify-end mb-4">
                <Button onClick={() => {
                  setSelectedPrecio(null);
                  setPrecioDialogOpen(true);
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Añadir Precio
                </Button>
              </div>
              
              {precios.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Supermercado</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Oferta</TableHead>
                      <TableHead>Actualización</TableHead>
                      <TableHead>Método Obtención</TableHead>
                      <TableHead className="w-[100px]">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {precios.map((precio) => (
                      <TableRow key={precio.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {precio.supermercado.logoUrl && (
                              <Image
                                src={precio.supermercado.logoUrl}
                                alt={precio.supermercado.nombre}
                                width={24}
                                height={24}
                                className="rounded-sm object-contain"
                              />
                            )}
                            {precio.supermercado.nombre}
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatPrice(precio.precioActual)}
                        </TableCell>
                        <TableCell>
                          {precio.esOferta ? (
                            <div>
                              <Badge variant="secondary" className="mb-1">Oferta</Badge>
                              {precio.precioPromocional && (
                                <div className="text-sm">{formatPrice(precio.precioPromocional)}</div>
                              )}
                              {precio.fechaInicioPromocion && precio.fechaFinPromocion && (
                                <div className="text-xs text-muted-foreground">
                                  {format(precio.fechaInicioPromocion, "dd/MM/yyyy")} - {format(precio.fechaFinPromocion, "dd/MM/yyyy")}
                                </div>
                              )}
                            </div>
                          ) : (
                            "No"
                          )}
                        </TableCell>
                        <TableCell>
                          {format(precio.fechaActualizacion, "dd/MM/yyyy HH:mm", { locale: es })}
                        </TableCell>
                        <TableCell>
                          {precio.metodoObtencion.valor}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedPrecio(precio);
                                setPrecioDialogOpen(true);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeletePrecio(precio.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center border rounded-md">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No hay precios registrados para este producto</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="etiquetas">
              {isEditing ? (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold">Seleccionar Etiquetas</h3>
                  <div className="border p-3 rounded-md">
                    <div className="flex flex-wrap gap-2">
                      {etiquetas.map((etiqueta) => (
                        <Badge 
                          key={etiqueta.id} 
                          variant={selectedEtiquetaIds.includes(etiqueta.id) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => handleEtiquetaSelection(etiqueta.id)}
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {etiqueta.valor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-semibold mb-3">Etiquetas Asociadas</h3>
                  {renderEtiquetas(producto.etiquetas)}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <PrecioDialog
        open={precioDialogOpen}
        onOpenChange={setPrecioDialogOpen}
        precio={selectedPrecio}
        onSave={handleSavePrecio}
        supermercados={supermercados}
        metodosObtencion={metodosObtencion}
      />
    </div>
  );
} 