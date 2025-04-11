//Página de gestión de un tipo de producto específico
//Funcionalidades:
// - Ver detalles del tipo de producto
// - Editar el tipo de producto
// - Eliminar el tipo de producto si no tiene productos asociados
// - Ver productos asociados al tipo
// - Cambiar la categoría del tipo de producto

"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import { 
  PlusCircle, 
  Search, 
  Tag, 
  Pencil, 
  Trash2, 
  Loader2,
  ChevronLeft,
  ShoppingBag,
  FolderTree,
  X,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  FileBox
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

// Tipo para Categoría
type Categoria = {
  id: number;
  nombre: string;
};

// Tipo para Tipo de Producto
type TipoProducto = {
  id: number;
  nombre: string;
  descripcion: string | null;
  categoriaId: number;
  categoria?: Categoria;
  imagenUrl: string | null;
  fechaCreacion: string;
  fechaActualizacion: string;
  activo: boolean;
  _count?: {
    productos: number;
  };
};

// Tipo para Producto
type Producto = {
  id: number;
  nombre: string;
  descripcion: string | null;
  imagenUrl: string | null;
  activo: boolean;
  fechaCreacion: string;
  precio?: number;
};

export default function TipoProductoDetailPage() {
  const router = useRouter();
  const params = useParams();
  const tipoId = Number(params.tipoId);
  
  const [tipoProducto, setTipoProducto] = useState<TipoProducto | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  
  const [loadingTipo, setLoadingTipo] = useState(true);
  const [loadingProductos, setLoadingProductos] = useState(true);
  const [loadingCategorias, setLoadingCategorias] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isTipoFormValid, setIsTipoFormValid] = useState(true);
  
  // Cargar datos del tipo de producto
  const fetchTipoProducto = async () => {
    setLoadingTipo(true);
    try {
      const response = await fetch(`/api/admin/tiposproducto/${tipoId}`);
      const data = await response.json();
      
      if (data.success) {
        setTipoProducto(data.data);
      } else {
        toast.error("Error al cargar el tipo de producto: " + data.message);
      }
    } catch (error) {
      console.error("Error al cargar el tipo de producto:", error);
      toast.error("Error al cargar el tipo de producto");
    } finally {
      setLoadingTipo(false);
    }
  };
  
  // Cargar productos asociados al tipo
  const fetchProductos = async () => {
    setLoadingProductos(true);
    try {
      const response = await fetch(`/api/admin/tiposproducto/${tipoId}/productos`);
      const data = await response.json();
      
      if (data.success) {
        setProductos(data.data);
      } else {
        toast.error("Error al cargar productos: " + data.message);
      }
    } catch (error) {
      console.error("Error al cargar productos:", error);
      toast.error("Error al cargar productos");
    } finally {
      setLoadingProductos(false);
    }
  };
  
  // Cargar categorías disponibles
  const fetchCategorias = async () => {
    setLoadingCategorias(true);
    try {
      const response = await fetch(`/api/admin/categorias`);
      const data = await response.json();
      
      if (data.success) {
        setCategorias(data.data);
      } else {
        toast.error("Error al cargar categorías: " + data.message);
      }
    } catch (error) {
      console.error("Error al cargar categorías:", error);
      toast.error("Error al cargar categorías");
    } finally {
      setLoadingCategorias(false);
    }
  };
  
  // Actualizar tipo de producto
  const handleUpdateTipo = async () => {
    if (!tipoProducto || !isTipoFormValid) return;
    
    setIsEditing(true);
    try {
      const response = await fetch(`/api/admin/tiposproducto/${tipoId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: tipoProducto.nombre,
          descripcion: tipoProducto.descripcion,
          categoriaId: tipoProducto.categoriaId,
          imagenUrl: tipoProducto.imagenUrl,
          activo: tipoProducto.activo
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Tipo de producto actualizado correctamente");
        fetchTipoProducto();
      } else {
        toast.error("Error al actualizar tipo de producto: " + data.message);
      }
    } catch (error) {
      console.error("Error al actualizar tipo de producto:", error);
      toast.error("Error al actualizar tipo de producto");
    } finally {
      setIsEditing(false);
    }
  };
  
  // Eliminar tipo de producto
  const handleDeleteTipo = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/tiposproducto/${tipoId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Tipo de producto eliminado correctamente");
        router.push('/gestionar/tipodeproducto');
      } else {
        toast.error("Error al eliminar tipo de producto: " + data.message);
      }
    } catch (error) {
      console.error("Error al eliminar tipo de producto:", error);
      toast.error("Error al eliminar tipo de producto");
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Ir a la página de detalle de un producto
  const goToProducto = (productoId: number) => {
    router.push(`/gestionar/productos/${productoId}`);
  };
  
  // Ir a la página de detalle de la categoría
  const goToCategoria = (categoriaId: number) => {
    router.push(`/gestionar/categorias/${categoriaId}`);
  };
  
  // Cargar datos iniciales
  useEffect(() => {
    if (tipoId) {
      fetchTipoProducto();
      fetchProductos();
      fetchCategorias();
    }
  }, [tipoId]);
  
  // Validar formulario
  useEffect(() => {
    if (tipoProducto) {
      setIsTipoFormValid(
        tipoProducto.nombre.trim().length >= 2 && 
        tipoProducto.categoriaId > 0
      );
    }
  }, [tipoProducto]);
  
  // Filtrar productos por término de búsqueda
  const filteredProductos = searchTerm.trim() 
    ? productos.filter(producto => 
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (producto.descripcion && producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : productos;
  
  // Mostrar cargando si no tenemos los datos del tipo de producto
  if (loadingTipo) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Mostrar error si no se encuentra el tipo de producto
  if (!tipoProducto) {
    return (
      <div className="max-w-5xl mx-auto py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={() => router.push('/gestionar/tipodeproducto')}
          >
            <ChevronLeft className="h-4 w-4" />
            Volver
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Tipo de producto no encontrado</h1>
        </div>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Tipo de producto no encontrado</h2>
            <p className="text-muted-foreground mb-4">
              No se ha encontrado el tipo de producto solicitado.
            </p>
            <Button 
              onClick={() => router.push('/gestionar/tipodeproducto')}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Volver a Tipos de Producto
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="max-w-5xl mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={() => router.push('/gestionar/tipodeproducto')}
          >
            <ChevronLeft className="h-4 w-4" />
            Volver
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{tipoProducto.nombre}</h1>
          
          {tipoProducto.activo ? (
            <Badge>Activo</Badge>
          ) : (
            <Badge variant="outline" className="bg-muted">Inactivo</Badge>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="detalles">
            <TabsList>
              <TabsTrigger value="detalles">Detalles</TabsTrigger>
              <TabsTrigger value="productos">Productos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="detalles" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información del Tipo de Producto</CardTitle>
                  <CardDescription>
                    Edita los detalles del tipo de producto o elimínalo si no tiene productos asociados.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input 
                      id="nombre" 
                      value={tipoProducto.nombre} 
                      onChange={e => setTipoProducto({...tipoProducto, nombre: e.target.value})}
                      maxLength={100}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Textarea 
                      id="descripcion" 
                      value={tipoProducto.descripcion || ""} 
                      onChange={e => setTipoProducto({...tipoProducto, descripcion: e.target.value})}
                      placeholder="Descripción detallada del tipo de producto"
                      maxLength={500}
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="categoria">Categoría</Label>
                    <Select
                      value={tipoProducto.categoriaId.toString()}
                      onValueChange={(value) => setTipoProducto({...tipoProducto, categoriaId: Number(value)})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categorias.map(cat => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                            {cat.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="imagenUrl">URL de Imagen</Label>
                    <Input 
                      id="imagenUrl" 
                      value={tipoProducto.imagenUrl || ""} 
                      onChange={e => setTipoProducto({...tipoProducto, imagenUrl: e.target.value})}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      maxLength={500}
                    />
                    {tipoProducto.imagenUrl && (
                      <div className="mt-2 rounded-md overflow-hidden border max-w-xs">
                        <Image 
                          src={tipoProducto.imagenUrl} 
                          alt={tipoProducto.nombre}
                          width={300}
                          height={200}
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="activo"
                      checked={tipoProducto.activo}
                      onCheckedChange={(checked) => {
                        setTipoProducto({...tipoProducto, activo: checked});
                      }}
                    />
                    <Label htmlFor="activo">Activo</Label>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        className="flex items-center gap-2"
                        disabled={(tipoProducto._count?.productos || 0) > 0}
                      >
                        {isDeleting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Eliminando...
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4" />
                            Eliminar
                          </>
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar tipo de producto?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Esto eliminará permanentemente el tipo de producto 
                          "{tipoProducto.nombre}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="flex items-center gap-2">
                          <X className="h-4 w-4" />
                          Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction 
                          className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
                          onClick={handleDeleteTipo}
                        >
                          {isDeleting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Eliminando...
                            </>
                          ) : (
                            <>
                              <Trash2 className="h-4 w-4" />
                              Eliminar
                            </>
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  
                  <Button 
                    onClick={handleUpdateTipo} 
                    disabled={!isTipoFormValid || isEditing}
                    className="flex items-center gap-2"
                  >
                    {isEditing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Guardar Cambios
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="productos" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Productos</CardTitle>
                  <CardDescription>
                    Lista de productos que pertenecen a este tipo de producto
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  
                  {loadingProductos ? (
                    <div className="flex justify-center items-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : filteredProductos.length === 0 ? (
                    <div className="text-center py-8 border border-dashed rounded-md">
                      <FileBox className="h-10 w-10 mx-auto text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">No hay productos</h3>
                      <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                        Este tipo de producto no tiene productos asociados.
                      </p>
                      <Button 
                        className="mt-4 flex items-center gap-2"
                        onClick={() => router.push('/gestionar/productos/nuevo')}
                      >
                        <PlusCircle className="h-4 w-4" />
                        Crear Producto
                      </Button>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Precio</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredProductos.map(producto => (
                            <TableRow key={producto.id}>
                              <TableCell className="font-medium">{producto.nombre}</TableCell>
                              <TableCell>
                                {producto.activo ? (
                                  <Badge variant="outline" className="flex w-fit items-center gap-1">
                                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                                    Activo
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="flex w-fit items-center gap-1 bg-muted">
                                    <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                                    Inactivo
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                {producto.precio 
                                  ? new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(producto.precio)
                                  : "No definido"
                                }
                              </TableCell>
                              <TableCell className="text-right">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="flex items-center gap-1"
                                  onClick={() => goToProducto(producto.id)}
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                  Ver detalle
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Información Rápida</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {tipoProducto.imagenUrl ? (
                <div className="relative aspect-square mb-4 overflow-hidden rounded-lg border">
                  <Image
                    src={tipoProducto.imagenUrl}
                    alt={tipoProducto.nombre}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-square mb-4 overflow-hidden rounded-lg border flex items-center justify-center bg-muted">
                  <Tag className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Estado:</span>
                  <Badge variant={tipoProducto.activo ? "default" : "outline"}>
                    {tipoProducto.activo ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Productos:</span>
                  <Badge variant="secondary">{tipoProducto._count?.productos || 0}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Categoría:</span>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-sm flex items-center gap-1"
                    onClick={() => goToCategoria(tipoProducto.categoriaId)}
                  >
                    <FolderTree className="h-3 w-3" />
                    {tipoProducto.categoria?.nombre || "Ver categoría"}
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                {tipoProducto.descripcion && (
                  <div>
                    <span className="text-sm text-muted-foreground">Descripción:</span>
                    <p className="text-sm mt-1">{tipoProducto.descripcion}</p>
                  </div>
                )}
                
                <div>
                  <span className="text-sm text-muted-foreground">Creado:</span>
                  <p className="text-sm mt-1">
                    {new Date(tipoProducto.fechaCreacion).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                
                <div>
                  <span className="text-sm text-muted-foreground">Última actualización:</span>
                  <p className="text-sm mt-1">
                    {new Date(tipoProducto.fechaActualizacion).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 