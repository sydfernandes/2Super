/**
 * Funcionalidades:
 * - Listar todos los productos
 * - Filtrar productos por nombre, marca o tipo
 * - Crear nuevo producto
 * - Ver detalles de un producto
 * - Editar un producto existente
 * - Eliminar productos sin precios asociados
 * - Marcar productos como descontinuados
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
  Tag,
  Package
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
import { Spinner } from "@/components/Spinner";

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

interface ProductoInput {
  nombre: string;
  marcaId: number;
  tipoProductoId: number;
  tamanoCantidad: number;
  unidadMedidaId: number;
  fotoUrl: string | null;
  etiquetaIds: number[];
  descontinuado: boolean;
}

interface Supermercado {
  id: number;
  nombre: string;
}

interface MetodoObtencion {
  id: number;
  valor: string;
}

interface Categoria {
  id: number;
  nombre: string;
}

// Schema for price form
const precioSchema = z.object({
  supermercadoId: z.number().int().positive(),
  precioActual: z.number().positive(),
  esOferta: z.boolean().optional().default(false),
  precioPromocional: z.number().positive().optional(),
  fechaInicioPromocion: z.string().datetime().optional(),
  fechaFinPromocion: z.string().datetime().optional(),
  metodoObtencionId: z.number().int().positive()
});

// Add this new interface for the price dialog
interface PrecioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  precio: z.infer<typeof precioSchema>;
  onSave: (precio: z.infer<typeof precioSchema>) => void;
  supermercados: Supermercado[];
  metodosObtencion: MetodoObtencion[];
}

// Add this new component for the price dialog
function PrecioDialog({ open, onOpenChange, precio, onSave, supermercados, metodosObtencion }: PrecioDialogProps) {
  const [formData, setFormData] = useState(precio);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(precio);
  }, [precio]);

  const handleSubmit = () => {
    setIsSaving(true);
    onSave(formData);
    setIsSaving(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Gestionar Precio</DialogTitle>
          <DialogDescription>
            Añade o edita el precio del producto para un supermercado específico
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
                      value={formData.fechaInicioPromocion || ''}
                      onChange={(e) => setFormData({ ...formData, fechaInicioPromocion: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fechaFin" className="text-xs">Fin</Label>
                    <Input
                      id="fechaFin"
                      type="datetime-local"
                      value={formData.fechaFinPromocion || ''}
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
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? <Spinner size="sm" /> : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function ProductosPage() {
  const router = useRouter();
  
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filteredProductos, setFilteredProductos] = useState<Producto[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [tiposProducto, setTiposProducto] = useState<TipoProducto[]>([]);
  const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([]);
  const [etiquetas, setEtiquetas] = useState<Etiqueta[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMarcaId, setFilterMarcaId] = useState<string>("");
  const [filterTipoId, setFilterTipoId] = useState<string>("");
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedProductoId, setSelectedProductoId] = useState<number | null>(null);
  
  const [newProducto, setNewProducto] = useState<ProductoInput>({
    nombre: "",
    marcaId: 0,
    tipoProductoId: 0,
    tamanoCantidad: 1,
    unidadMedidaId: 0,
    fotoUrl: null,
    etiquetaIds: [],
    descontinuado: false
  });
  
  const [precios, setPrecios] = useState<z.infer<typeof precioSchema>[]>([]);
  
  const [supermercados, setSupermercados] = useState<Supermercado[]>([]);
  const [metodosObtencion, setMetodosObtencion] = useState<MetodoObtencion[]>([]);
  
  // Add these state variables to the main component
  // Fetch functions
  const fetchCategorias = async () => {
    try {
      const response = await fetch("/api/admin/categorias");
      if (!response.ok) {
        console.warn("API endpoint /api/admin/categorias not found");
        setCategorias([]);
        return;
      }
      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
      setCategorias([]);
    }
  };

  const fetchUnidadesMedida = async () => {
    try {
      const response = await fetch("/api/admin/unidades-medida");
      if (!response.ok) {
        console.warn("API endpoint /api/admin/unidades-medida not found");
        setUnidadesMedida([]);
        return;
      }
      const data = await response.json();
      setUnidadesMedida(data);
    } catch (error) {
      console.error("Error al cargar unidades de medida:", error);
      setUnidadesMedida([]);
    }
  };

  const fetchEtiquetas = async () => {
    try {
      const response = await fetch("/api/admin/etiquetas");
      if (!response.ok) {
        console.warn("API endpoint /api/admin/etiquetas not found");
        setEtiquetas([]);
        return;
      }
      const data = await response.json();
      setEtiquetas(data);
    } catch (error) {
      console.error("Error al cargar etiquetas:", error);
      setEtiquetas([]);
    }
  };

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchProductos(),
          fetchMarcas(),
          fetchTiposProducto(),
          fetchUnidadesMedida(),
          fetchEtiquetas(),
          fetchCategorias()
        ]);
      } catch (error) {
        console.error("Error loading initial data:", error);
        toast.error("Error al cargar los datos iniciales");
      }
    };
    
    loadData();
  }, []);
  
  // Filtrar productos cuando cambian los criterios
  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterMarcaId, filterTipoId, productos]);
  
  // Aplicar filtros a los productos
  const applyFilters = () => {
    let filtered = [...productos];
    
    // Filtrar por término de búsqueda (nombre)
    if (searchTerm.trim() !== "") {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(producto => 
        producto.nombre.toLowerCase().includes(lowerSearch) ||
        producto.marca.nombre.toLowerCase().includes(lowerSearch) ||
        producto.tipoProducto.nombre.toLowerCase().includes(lowerSearch)
      );
    }
    
    // Filtrar por marca
    if (filterMarcaId && filterMarcaId !== "todos") {
      const marcaId = parseInt(filterMarcaId);
      filtered = filtered.filter(producto => producto.marcaId === marcaId);
    }
    
    // Filtrar por tipo de producto
    if (filterTipoId && filterTipoId !== "todos") {
      const tipoId = parseInt(filterTipoId);
      filtered = filtered.filter(producto => producto.tipoProductoId === tipoId);
    }
    
    setFilteredProductos(filtered);
  };
  
  // Obtener productos
  const fetchProductos = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/admin/productos');
      
      // Asegurarse de que las fechas son objetos Date
      const productosData = Array.isArray(response.data) ? response.data.map((producto: any) => ({
        ...producto,
        fechaCreacion: new Date(producto.fechaCreacion),
        fechaActualizacion: new Date(producto.fechaActualizacion)
      })) : [];
      
      setProductos(productosData);
      setFilteredProductos(productosData);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      toast.error("Error al cargar los productos");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Obtener marcas
  const fetchMarcas = async () => {
    try {
      const response = await axios.get('/api/admin/marcas');
      setMarcas(Array.isArray(response.data) ? response.data : []);
      
      // Si hay marcas disponibles, establecer el primero como valor por defecto
      if (Array.isArray(response.data) && response.data.length > 0) {
        setNewProducto(prev => ({
          ...prev,
          marcaId: response.data[0].id
        }));
      }
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
      
      // Si hay tipos disponibles, establecer el primero como valor por defecto
      if (tiposData.length > 0) {
        setNewProducto(prev => ({
          ...prev,
          tipoProductoId: tiposData[0].id
        }));
      }
    } catch (error) {
      console.error("Error al cargar tipos de producto:", error);
      toast.error("Error al cargar los tipos de producto");
    }
  };
  
  // Add new useEffect to fetch supermercados and metodosObtencion
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [supermercadosRes, metodosRes] = await Promise.all([
          fetch("/api/admin/supermercados"),
          fetch("/api/admin/metodosobtencion")
        ]);
        
        if (!supermercadosRes.ok || !metodosRes.ok) {
          throw new Error("Error al cargar los datos");
        }
        
        const supermercadosData = await supermercadosRes.json();
        const metodosData = await metodosRes.json();
        
        setSupermercados(supermercadosData);
        setMetodosObtencion(metodosData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        toast.error("Error al cargar los datos");
      }
    };
    
    fetchData();
  }, []);
  
  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProducto(prev => ({
      ...prev,
      [name]: name === 'tamanoCantidad' ? parseFloat(value) : value
    }));
  };
  
  // Manejar cambio en la marca
  const handleMarcaChange = (value: string) => {
    setNewProducto(prev => ({
      ...prev,
      marcaId: parseInt(value)
    }));
  };
  
  // Manejar cambio en el tipo de producto
  const handleTipoProductoChange = (value: string) => {
    setNewProducto(prev => ({
      ...prev,
      tipoProductoId: parseInt(value)
    }));
  };
  
  // Manejar cambio en la unidad de medida
  const handleUnidadMedidaChange = (value: string) => {
    setNewProducto(prev => ({
      ...prev,
      unidadMedidaId: parseInt(value)
    }));
  };
  
  // Manejar cambio en las etiquetas
  const handleEtiquetaSelection = (etiquetaId: number) => {
    setNewProducto(prev => {
      if (prev.etiquetaIds.includes(etiquetaId)) {
        // Quitar la etiqueta si ya está seleccionada
        return {
          ...prev,
          etiquetaIds: prev.etiquetaIds.filter(id => id !== etiquetaId)
        };
      } else {
        // Añadir la etiqueta si no está seleccionada
        return {
          ...prev,
          etiquetaIds: [...prev.etiquetaIds, etiquetaId]
        };
      }
    });
  };
  
  // Manejar cambio en el estado descontinuado
  const handleDescontinuadoChange = (checked: boolean) => {
    setNewProducto(prev => ({
      ...prev,
      descontinuado: checked
    }));
  };
  
  // Validar formulario
  const isFormValid = () => {
    if (!newProducto.nombre.trim()) {
      toast.error("El nombre del producto es obligatorio");
      return false;
    }
    
    if (!newProducto.marcaId) {
      toast.error("Debe seleccionar una marca");
      return false;
    }
    
    if (!newProducto.tipoProductoId) {
      toast.error("Debe seleccionar un tipo de producto");
      return false;
    }
    
    if (newProducto.tamanoCantidad <= 0) {
      toast.error("La cantidad debe ser mayor a cero");
      return false;
    }
    
    if (!newProducto.unidadMedidaId) {
      toast.error("Debe seleccionar una unidad de medida");
      return false;
    }
    
    return true;
  };
  
  // Crear nuevo producto
  const handleCreateProducto = async () => {
    if (!isFormValid()) return;
    
    setIsSaving(true);
    try {
      const response = await axios.post('/api/admin/productos', newProducto);
      
      toast.success("Producto creado correctamente");
      setOpenCreateDialog(false);
      
      // Reiniciar el formulario
      setNewProducto({
        nombre: "",
        marcaId: marcas.length > 0 ? marcas[0].id : 0,
        tipoProductoId: tiposProducto.length > 0 ? tiposProducto[0].id : 0,
        tamanoCantidad: 1,
        unidadMedidaId: unidadesMedida.length > 0 ? unidadesMedida[0].id : 0,
        fotoUrl: null,
        etiquetaIds: [],
        descontinuado: false
      });
      
      // Recargar la lista de productos
      fetchProductos();
    } catch (error: any) {
      console.error("Error al crear producto:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error al crear el producto");
      }
    } finally {
      setIsSaving(false);
    }
  };
  
  // Eliminar producto
  const handleDeleteProducto = async () => {
    if (!selectedProductoId) return;
    
    setIsDeleting(true);
    try {
      await axios.delete(`/api/admin/productos/${selectedProductoId}`);
      
      toast.success("Producto eliminado correctamente");
      setOpenDeleteDialog(false);
      setSelectedProductoId(null);
      
      // Recargar la lista de productos
      fetchProductos();
    } catch (error: any) {
      console.error("Error al eliminar producto:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error al eliminar el producto");
      }
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Marcar producto como descontinuado
  const handleDescontinuarProducto = async (productoId: number) => {
    try {
      await axios.patch(`/api/admin/productos/${productoId}`, {
        descontinuado: true
      });
      
      toast.success("Producto marcado como descontinuado");
      
      // Actualizar el estado local para reflejar el cambio
      setProductos(prev => prev.map(p => {
        if (p.id === productoId) {
          return { ...p, descontinuado: true };
        }
        return p;
      }));
      
      applyFilters();
    } catch (error) {
      console.error("Error al descontinuar producto:", error);
      toast.error("Error al actualizar el producto");
    }
  };
  
  // Ir a la página de detalle del producto
  const goToProductoDetail = (id: number) => {
    router.push(`/gestionar/productos/${id}`);
  };
  
  // Renderizar etiquetas
  const renderEtiquetas = (etiquetas: Etiqueta[]) => {
    if (etiquetas.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {etiquetas.map((etiqueta) => (
          <Badge key={etiqueta.id} variant="outline" className="text-xs">
            <Tag className="h-3 w-3 mr-1" />
            {etiqueta.valor}
          </Badge>
        ))}
      </div>
    );
  };
  
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">Gestionar Productos</CardTitle>
              <CardDescription>
                Administra los productos disponibles en la plataforma
              </CardDescription>
            </div>
            
            <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Producto
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Producto</DialogTitle>
                  <DialogDescription>
                    Completa el formulario para añadir un nuevo producto
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre *</Label>
                    <Input
                      id="nombre"
                      name="nombre"
                      value={newProducto.nombre}
                      onChange={handleInputChange}
                      placeholder="Nombre del producto"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="marcaId">Marca *</Label>
                    <Select 
                      onValueChange={handleMarcaChange}
                      defaultValue={newProducto.marcaId ? newProducto.marcaId.toString() : undefined}
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
                    <Label htmlFor="tipoProductoId">Tipo de Producto *</Label>
                    <Select 
                      onValueChange={handleTipoProductoChange}
                      defaultValue={newProducto.tipoProductoId ? newProducto.tipoProductoId.toString() : undefined}
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
                      <Label htmlFor="tamanoCantidad">Cantidad *</Label>
                      <Input
                        id="tamanoCantidad"
                        name="tamanoCantidad"
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={newProducto.tamanoCantidad}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2 flex-1">
                      <Label htmlFor="unidadMedidaId">Unidad *</Label>
                      <Select 
                        onValueChange={handleUnidadMedidaChange}
                        defaultValue={newProducto.unidadMedidaId ? newProducto.unidadMedidaId.toString() : undefined}
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
                      value={newProducto.fotoUrl || ''}
                      onChange={handleInputChange}
                      placeholder="https://ejemplo.com/foto.jpg"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="descontinuado"
                      checked={newProducto.descontinuado}
                      onCheckedChange={handleDescontinuadoChange}
                    />
                    <Label htmlFor="descontinuado">Producto Descontinuado</Label>
                  </div>
                  
                  <div className="col-span-2 space-y-2">
                    <Label>Etiquetas</Label>
                    <div className="border p-2 rounded-md max-h-[150px] overflow-y-auto">
                      <div className="flex flex-wrap gap-2">
                        {etiquetas && etiquetas.length > 0 ? (
                          etiquetas.map((etiqueta) => (
                            <Badge 
                              key={etiqueta.id} 
                              variant={newProducto.etiquetaIds.includes(etiqueta.id) ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => handleEtiquetaSelection(etiqueta.id)}
                            >
                              {etiqueta.valor}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No hay etiquetas disponibles</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Precios</Label>
                    <div className="space-y-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Supermercado</TableHead>
                            <TableHead>Precio Actual</TableHead>
                            <TableHead>Método de Obtención</TableHead>
                            <TableHead className="w-[100px]">Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {precios.map((precio, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <Select
                                  value={precio.supermercadoId.toString()}
                                  onValueChange={(value) => {
                                    const newPrecios = [...precios];
                                    newPrecios[index].supermercadoId = parseInt(value);
                                    setPrecios(newPrecios);
                                  }}
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
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  placeholder="Precio actual"
                                  value={precio.precioActual}
                                  onChange={(e) => {
                                    const newPrecios = [...precios];
                                    newPrecios[index].precioActual = parseFloat(e.target.value);
                                    setPrecios(newPrecios);
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={precio.metodoObtencionId.toString()}
                                  onValueChange={(value) => {
                                    const newPrecios = [...precios];
                                    newPrecios[index].metodoObtencionId = parseInt(value);
                                    setPrecios(newPrecios);
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Método de obtención" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {metodosObtencion.map((metodo) => (
                                      <SelectItem key={metodo.id} value={metodo.id.toString()}>
                                        {metodo.valor}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    const newPrecios = [...precios];
                                    newPrecios.splice(index, 1);
                                    setPrecios(newPrecios);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setPrecios([
                            ...precios,
                            {
                              supermercadoId: 0,
                              precioActual: 0,
                              esOferta: false,
                              metodoObtencionId: 0
                            }
                          ]);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Añadir precio
                      </Button>
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpenCreateDialog(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateProducto} disabled={isSaving}>
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
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, marca o tipo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              
              <div className="flex-1 sm:flex-none sm:w-48">
                <Select onValueChange={setFilterMarcaId} defaultValue="todos">
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por marca" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas las marcas</SelectItem>
                    {marcas.map((marca) => (
                      <SelectItem key={marca.id} value={marca.id.toString()}>
                        {marca.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1 sm:flex-none sm:w-48">
                <Select onValueChange={setFilterTipoId} defaultValue="todos">
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los tipos</SelectItem>
                    {tiposProducto.map((tipo) => (
                      <SelectItem key={tipo.id} value={tipo.id.toString()}>
                        {tipo.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Spinner size="lg" />
              </div>
            ) : filteredProductos.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Marca</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Tamaño</TableHead>
                    <TableHead>Precios</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProductos.map((producto) => (
                    <TableRow key={producto.id} className={producto.descontinuado ? "bg-muted/30" : ""}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            {producto.fotoUrl && (
                              <Image
                                src={producto.fotoUrl}
                                alt={producto.nombre}
                                width={32}
                                height={32}
                                className="rounded-sm object-contain"
                              />
                            )}
                            {producto.nombre}
                          </div>
                          {renderEtiquetas(producto.etiquetas)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {producto.marca.logoUrl && (
                            <Image
                              src={producto.marca.logoUrl}
                              alt={producto.marca.nombre}
                              width={24}
                              height={24}
                              className="rounded-sm object-contain"
                            />
                          )}
                          {producto.marca.nombre}
                        </div>
                      </TableCell>
                      <TableCell>
                        {producto.tipoProducto.nombre}
                        {producto.tipoProducto.categoria && (
                          <div className="text-xs text-muted-foreground">
                            {producto.tipoProducto.categoria.nombre}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {producto.tamanoCantidad} {producto.unidadMedida.valor}
                      </TableCell>
                      <TableCell>{producto._count.precios}</TableCell>
                      <TableCell>
                        {producto.descontinuado ? (
                          <Badge variant="secondary">Descontinuado</Badge>
                        ) : (
                          <Badge variant="default">Activo</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => goToProductoDetail(producto.id)}
                            title="Editar producto"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          
                          {!producto.descontinuado && (
                            <Button
                              size="icon"
                              variant="secondary"
                              onClick={() => handleDescontinuarProducto(producto.id)}
                              title="Marcar como descontinuado"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                          
                          <AlertDialog
                            open={openDeleteDialog && selectedProductoId === producto.id}
                            onOpenChange={(isOpen) => {
                              setOpenDeleteDialog(isOpen);
                              if (!isOpen) setSelectedProductoId(null);
                            }}
                          >
                            <AlertDialogTrigger asChild>
                              <Button
                                size="icon"
                                variant="destructive"
                                onClick={() => setSelectedProductoId(producto.id)}
                                title="Eliminar producto"
                                disabled={producto._count.precios > 0}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción eliminará el producto <strong>{producto.nombre}</strong> y no se puede deshacer.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleDeleteProducto}
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
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm || filterMarcaId !== "todos" || filterTipoId !== "todos"
                    ? "No se encontraron productos con esos criterios de búsqueda"
                    : "No hay productos disponibles"
                  }
                </p>
                <Button
                  variant="outline"
                  onClick={() => setOpenCreateDialog(true)}
                  className="mt-4"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Añadir el primer producto
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
