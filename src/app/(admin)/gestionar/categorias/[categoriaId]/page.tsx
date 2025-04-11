//Página de gestión de una categoría específica
//Funcionalidades:
// - Ver detalles de la categoría
// - Editar la categoría
// - Eliminar la categoría si no tiene subcategorías o tipos de producto asociados
// - Ver tipos de producto asociados
// - Asociar tipos de producto existentes a la categoría
// - Crear nuevos tipos de producto para la categoría

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
  descripcion: string | null;
  categoriaPadreId: number | null;
  imagenUrl: string | null;
  fechaCreacion: string;
  fechaActualizacion: string;
  activo: boolean;
  categoriaPadre?: Categoria | null;
  _count?: {
    tiposProducto: number;
    subcategorias: number;
  };
};

// Tipo para Tipo de Producto
type TipoProducto = {
  id: number;
  nombre: string;
  descripcion: string | null;
  categoriaId: number;
  imagenUrl: string | null;
  fechaCreacion: string;
  fechaActualizacion: string;
  activo: boolean;
  _count?: {
    productos: number;
  };
};

// Tipo para entrada nueva de TipoProducto
type TipoProductoInput = {
  nombre: string;
  descripcion: string;
  categoriaId: number;
  imagenUrl: string | null;
  activo: boolean;
};

export default function CategoriaDetailPage() {
  const router = useRouter();
  const params = useParams();
  const categoriaId = Number(params.categoriaId);
  
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [tiposProducto, setTiposProducto] = useState<TipoProducto[]>([]);
  const [tiposDisponibles, setTiposDisponibles] = useState<TipoProducto[]>([]);
  const [selectedTipoId, setSelectedTipoId] = useState<number | null>(null);
  const [editingTipo, setEditingTipo] = useState<TipoProducto | null>(null);

  const [loadingCategoria, setLoadingCategoria] = useState(true);
  const [loadingTipos, setLoadingTipos] = useState(true);
  const [loadingTiposDisponibles, setLoadingTiposDisponibles] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddingTipo, setIsAddingTipo] = useState(false);
  const [isCreatingTipo, setIsCreatingTipo] = useState(false);
  const [isUpdatingTipo, setIsUpdatingTipo] = useState(false);
  
  const [newTipoProducto, setNewTipoProducto] = useState<TipoProductoInput>({
    nombre: "",
    descripcion: "",
    categoriaId: categoriaId,
    imagenUrl: null,
    activo: true
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isCategoriaFormValid, setIsCategoriaFormValid] = useState(true);
  const [isTipoFormValid, setIsTipoFormValid] = useState(false);
  
  // Cargar datos de la categoría
  const fetchCategoria = async () => {
    setLoadingCategoria(true);
    try {
      const response = await fetch(`/api/admin/categorias/${categoriaId}`);
      const data = await response.json();
      
      if (data.success) {
        setCategoria(data.data);
      } else {
        toast.error("Error al cargar la categoría: " + data.message);
      }
    } catch (error) {
      console.error("Error al cargar la categoría:", error);
      toast.error("Error al cargar la categoría");
    } finally {
      setLoadingCategoria(false);
    }
  };
  
  // Cargar tipos de producto de la categoría
  const fetchTiposProducto = async () => {
    setLoadingTipos(true);
    try {
      const response = await fetch(`/api/admin/categorias/${categoriaId}/tiposproducto`);
      const data = await response.json();
      
      if (data.success) {
        setTiposProducto(data.data);
      } else {
        toast.error("Error al cargar tipos de producto: " + data.message);
      }
    } catch (error) {
      console.error("Error al cargar tipos de producto:", error);
      toast.error("Error al cargar tipos de producto");
    } finally {
      setLoadingTipos(false);
    }
  };
  
  // Cargar tipos de producto disponibles para asociar
  const fetchTiposDisponibles = async () => {
    setLoadingTiposDisponibles(true);
    try {
      const response = await fetch(`/api/admin/tiposproducto/disponibles?categoriaId=${categoriaId}`);
      const data = await response.json();
      
      if (data.success) {
        setTiposDisponibles(data.data);
      } else {
        toast.error("Error al cargar tipos disponibles: " + data.message);
      }
    } catch (error) {
      console.error("Error al cargar tipos disponibles:", error);
      toast.error("Error al cargar tipos disponibles");
    } finally {
      setLoadingTiposDisponibles(false);
    }
  };
  
  // Actualizar categoría
  const handleUpdateCategoria = async () => {
    if (!categoria || !isCategoriaFormValid) return;
    
    setIsEditing(true);
    try {
      const response = await fetch(`/api/admin/categorias/${categoriaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: categoria.nombre,
          descripcion: categoria.descripcion,
          categoriaPadreId: categoria.categoriaPadreId,
          imagenUrl: categoria.imagenUrl,
          activo: categoria.activo
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Categoría actualizada correctamente");
        fetchCategoria();
      } else {
        toast.error("Error al actualizar categoría: " + data.message);
      }
    } catch (error) {
      console.error("Error al actualizar categoría:", error);
      toast.error("Error al actualizar categoría");
    } finally {
      setIsEditing(false);
    }
  };
  
  // Eliminar categoría
  const handleDeleteCategoria = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/categorias/${categoriaId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Categoría eliminada correctamente");
        router.push('/gestionar/categorias');
      } else {
        toast.error("Error al eliminar categoría: " + data.message);
      }
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
      toast.error("Error al eliminar categoría");
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Asociar tipo de producto a la categoría
  const handleAddTipo = async () => {
    if (!selectedTipoId) return;
    
    setIsAddingTipo(true);
    try {
      const response = await fetch(`/api/admin/tiposproducto/${selectedTipoId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categoriaId: categoriaId
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Tipo de producto asociado correctamente");
        fetchTiposProducto();
        fetchTiposDisponibles();
        setSelectedTipoId(null);
      } else {
        toast.error("Error al asociar tipo de producto: " + data.message);
      }
    } catch (error) {
      console.error("Error al asociar tipo de producto:", error);
      toast.error("Error al asociar tipo de producto");
    } finally {
      setIsAddingTipo(false);
    }
  };
  
  // Crear nuevo tipo de producto
  const handleCreateTipoProducto = async () => {
    if (!isTipoFormValid) return;
    
    setIsCreatingTipo(true);
    try {
      const response = await fetch('/api/admin/tiposproducto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTipoProducto),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Tipo de producto creado correctamente");
        fetchTiposProducto();
        setNewTipoProducto({
          nombre: "",
          descripcion: "",
          categoriaId: categoriaId,
          imagenUrl: null,
          activo: true
        });
      } else {
        toast.error("Error al crear tipo de producto: " + data.message);
      }
    } catch (error) {
      console.error("Error al crear tipo de producto:", error);
      toast.error("Error al crear tipo de producto");
    } finally {
      setIsCreatingTipo(false);
    }
  };
  
  // Actualizar tipo de producto existente
  const handleUpdateTipoProducto = async () => {
    if (!editingTipo || !isTipoFormValid) return;
    
    setIsUpdatingTipo(true);
    try {
      const response = await fetch(`/api/admin/tiposproducto/${editingTipo.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: editingTipo.nombre,
          descripcion: editingTipo.descripcion,
          categoriaId: editingTipo.categoriaId,
          imagenUrl: editingTipo.imagenUrl,
          activo: editingTipo.activo
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Tipo de producto actualizado correctamente");
        fetchTiposProducto();
        setEditingTipo(null);
      } else {
        toast.error("Error al actualizar tipo de producto: " + data.message);
      }
    } catch (error) {
      console.error("Error al actualizar tipo de producto:", error);
      toast.error("Error al actualizar tipo de producto");
    } finally {
      setIsUpdatingTipo(false);
    }
  };
  
  // Ir a la página de detalle de tipo de producto
  const goToTipoProducto = (tipoId: number) => {
    router.push(`/gestionar/tipodeproducto/${tipoId}`);
  };
  
  // Cargar datos iniciales
  useEffect(() => {
    if (categoriaId) {
      fetchCategoria();
      fetchTiposProducto();
    }
  }, [categoriaId]);
  
  // Validar formulario de categoría
  useEffect(() => {
    if (categoria) {
      setIsCategoriaFormValid(categoria.nombre.trim().length >= 2);
    }
  }, [categoria]);
  
  // Validar formulario de tipo de producto
  useEffect(() => {
    setIsTipoFormValid(newTipoProducto.nombre.trim().length >= 2);
  }, [newTipoProducto]);
  
  // Filtrar tipos por término de búsqueda
  const filteredTipos = searchTerm.trim() 
    ? tiposProducto.filter(tipo => 
        tipo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (tipo.descripcion && tipo.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : tiposProducto;
  
  // Mostrar cargando si no tenemos los datos de la categoría
  if (loadingCategoria) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Mostrar error si no se encuentra la categoría
  if (!categoria) {
    return (
      <div className="max-w-5xl mx-auto py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={() => router.push('/gestionar/categorias')}
          >
            <ChevronLeft className="h-4 w-4" />
            Volver
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Categoría no encontrada</h1>
        </div>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Categoría no encontrada</h2>
            <p className="text-muted-foreground mb-4">
              No se ha encontrado la categoría solicitada.
            </p>
            <Button 
              onClick={() => router.push('/gestionar/categorias')}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Volver a Categorías
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
            onClick={() => router.push('/gestionar/categorias')}
          >
            <ChevronLeft className="h-4 w-4" />
            Volver
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{categoria.nombre}</h1>
          
          {categoria.activo ? (
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
              <TabsTrigger value="tipos">Tipos de Producto</TabsTrigger>
            </TabsList>
            
            <TabsContent value="detalles" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información de la Categoría</CardTitle>
                  <CardDescription>
                    Edita los detalles de la categoría o elimínala si no tiene elementos asociados.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input 
                      id="nombre" 
                      value={categoria.nombre} 
                      onChange={e => setCategoria({...categoria, nombre: e.target.value})}
                      maxLength={100}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Textarea 
                      id="descripcion" 
                      value={categoria.descripcion || ""} 
                      onChange={e => setCategoria({...categoria, descripcion: e.target.value})}
                      placeholder="Descripción detallada de la categoría"
                      maxLength={500}
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="imagenUrl">URL de Imagen</Label>
                    <Input 
                      id="imagenUrl" 
                      value={categoria.imagenUrl || ""} 
                      onChange={e => setCategoria({...categoria, imagenUrl: e.target.value})}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      maxLength={500}
                    />
                    {categoria.imagenUrl && (
                      <div className="mt-2 rounded-md overflow-hidden border max-w-xs">
                        <Image 
                          src={categoria.imagenUrl} 
                          alt={categoria.nombre}
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
                      checked={categoria.activo}
                      onCheckedChange={(checked) => {
                        setCategoria({...categoria, activo: checked});
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
                        disabled={(categoria._count?.subcategorias || 0) > 0 || (categoria._count?.tiposProducto || 0) > 0}
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
                        <AlertDialogTitle>¿Eliminar categoría?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Esto eliminará permanentemente la categoría 
                          "{categoria.nombre}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="flex items-center gap-2">
                          <X className="h-4 w-4" />
                          Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction 
                          className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
                          onClick={handleDeleteCategoria}
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
                    onClick={handleUpdateCategoria} 
                    disabled={!isCategoriaFormValid || isEditing}
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
            
            <TabsContent value="tipos" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle>Tipos de Producto</CardTitle>
                    <CardDescription>
                      Gestiona los tipos de producto asociados a esta categoría
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-2" onClick={fetchTiposDisponibles}>
                          <PlusCircle className="h-4 w-4" />
                          Asociar Tipo
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Asociar Tipo de Producto</DialogTitle>
                          <DialogDescription>
                            Selecciona un tipo de producto existente para asociarlo a esta categoría
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          {loadingTiposDisponibles ? (
                            <div className="flex justify-center items-center py-4">
                              <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                          ) : tiposDisponibles.length === 0 ? (
                            <div className="text-center py-4">
                              <p className="text-muted-foreground">
                                No hay tipos de producto disponibles para asociar.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Label htmlFor="tipo-id">Tipo de Producto</Label>
                              <Select
                                value={selectedTipoId?.toString() || ""}
                                onValueChange={(value) => setSelectedTipoId(Number(value))}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona un tipo de producto" />
                                </SelectTrigger>
                                <SelectContent>
                                  {tiposDisponibles.map(tipo => (
                                    <SelectItem key={tipo.id} value={tipo.id.toString()}>
                                      {tipo.nombre}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline" className="flex items-center gap-2">
                              <X className="h-4 w-4" />
                              Cancelar
                            </Button>
                          </DialogClose>
                          <Button 
                            onClick={handleAddTipo} 
                            disabled={!selectedTipoId || isAddingTipo}
                            className="flex items-center gap-2"
                          >
                            {isAddingTipo ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Asociando...
                              </>
                            ) : (
                              <>
                                <PlusCircle className="h-4 w-4" />
                                Asociar Tipo
                              </>
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                          <PlusCircle className="h-4 w-4" />
                          Nuevo Tipo
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Crear Nuevo Tipo de Producto</DialogTitle>
                          <DialogDescription>
                            Añade un nuevo tipo de producto a la categoría "{categoria.nombre}"
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="tipo-nombre">Nombre</Label>
                            <Input 
                              id="tipo-nombre" 
                              value={newTipoProducto.nombre} 
                              onChange={e => setNewTipoProducto({...newTipoProducto, nombre: e.target.value})}
                              placeholder="Ej: Bebidas Gaseosas"
                              maxLength={100}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="tipo-descripcion">Descripción</Label>
                            <Textarea 
                              id="tipo-descripcion" 
                              value={newTipoProducto.descripcion} 
                              onChange={e => setNewTipoProducto({...newTipoProducto, descripcion: e.target.value})}
                              placeholder="Descripción detallada del tipo de producto"
                              maxLength={640}
                              rows={3}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="tipo-imagen">URL de Imagen</Label>
                            <Input 
                              id="tipo-imagen" 
                              value={newTipoProducto.imagenUrl || ""} 
                              onChange={e => setNewTipoProducto({...newTipoProducto, imagenUrl: e.target.value})}
                              placeholder="https://ejemplo.com/imagen.jpg"
                              maxLength={500}
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch 
                              id="tipo-activo"
                              checked={newTipoProducto.activo}
                              onCheckedChange={(checked) => {
                                setNewTipoProducto({...newTipoProducto, activo: checked});
                              }}
                            />
                            <Label htmlFor="tipo-activo">Activo</Label>
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline" className="flex items-center gap-2">
                              <X className="h-4 w-4" />
                              Cancelar
                            </Button>
                          </DialogClose>
                          <Button 
                            onClick={handleCreateTipoProducto} 
                            disabled={!isTipoFormValid || isCreatingTipo}
                            className="flex items-center gap-2"
                          >
                            {isCreatingTipo ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Creando...
                              </>
                            ) : (
                              <>
                                <PlusCircle className="h-4 w-4" />
                                Crear Tipo
                              </>
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar tipos de producto..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  
                  {loadingTipos ? (
                    <div className="flex justify-center items-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : filteredTipos.length === 0 ? (
                    <div className="text-center py-8 border border-dashed rounded-md">
                      <FileBox className="h-10 w-10 mx-auto text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">No hay tipos de producto</h3>
                      <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                        Esta categoría no tiene tipos de producto. Crea uno nuevo para comenzar a gestionar productos.
                      </p>
                      <div className="flex items-center justify-center gap-2 mt-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2" onClick={fetchTiposDisponibles}>
                              <PlusCircle className="h-4 w-4" />
                              Asociar Tipo
                            </Button>
                          </DialogTrigger>
                        </Dialog>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="flex items-center gap-2">
                              <PlusCircle className="h-4 w-4" />
                              Crear Tipo
                            </Button>
                          </DialogTrigger>
                        </Dialog>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Productos</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredTipos.map(tipo => (
                            <TableRow key={tipo.id}>
                              <TableCell className="font-medium">{tipo.nombre}</TableCell>
                              <TableCell>
                                {tipo.activo ? (
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
                                <Badge variant="secondary" className="flex w-fit items-center gap-1">
                                  <ShoppingBag className="h-3 w-3" />
                                  {tipo._count?.productos || 0}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        className="flex items-center gap-1"
                                        onClick={() => setEditingTipo(tipo)}
                                      >
                                        <Pencil className="h-3.5 w-3.5" />
                                        Editar
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Editar Tipo de Producto</DialogTitle>
                                        <DialogDescription>
                                          Modifica los datos del tipo de producto.
                                        </DialogDescription>
                                      </DialogHeader>
                                      {editingTipo && (
                                        <div className="space-y-4 py-4">
                                          <div className="space-y-2">
                                            <Label htmlFor="edit-tipo-nombre">Nombre</Label>
                                            <Input 
                                              id="edit-tipo-nombre" 
                                              value={editingTipo.nombre} 
                                              onChange={e => setEditingTipo({...editingTipo, nombre: e.target.value})}
                                              maxLength={100}
                                            />
                                          </div>
                                          <div className="space-y-2">
                                            <Label htmlFor="edit-tipo-descripcion">Descripción</Label>
                                            <Textarea 
                                              id="edit-tipo-descripcion" 
                                              value={editingTipo.descripcion || ""} 
                                              onChange={e => setEditingTipo({...editingTipo, descripcion: e.target.value})}
                                              placeholder="Descripción detallada del tipo de producto"
                                              maxLength={640}
                                              rows={3}
                                            />
                                          </div>
                                          <div className="space-y-2">
                                            <Label htmlFor="edit-tipo-imagen">URL de Imagen</Label>
                                            <Input 
                                              id="edit-tipo-imagen" 
                                              value={editingTipo.imagenUrl || ""} 
                                              onChange={e => setEditingTipo({...editingTipo, imagenUrl: e.target.value})}
                                              placeholder="https://ejemplo.com/imagen.jpg"
                                              maxLength={500}
                                            />
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <Switch 
                                              id="edit-tipo-activo"
                                              checked={editingTipo.activo}
                                              onCheckedChange={(checked) => {
                                                setEditingTipo({...editingTipo, activo: checked});
                                              }}
                                            />
                                            <Label htmlFor="edit-tipo-activo">Activo</Label>
                                          </div>
                                        </div>
                                      )}
                                      <DialogFooter>
                                        <DialogClose asChild>
                                          <Button variant="outline" className="flex items-center gap-2">
                                            <X className="h-4 w-4" />
                                            Cancelar
                                          </Button>
                                        </DialogClose>
                                        <Button 
                                          onClick={handleUpdateTipoProducto} 
                                          disabled={!editingTipo || !isTipoFormValid || isUpdatingTipo}
                                          className="flex items-center gap-2"
                                        >
                                          {isUpdatingTipo ? (
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
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                  
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="flex items-center gap-1"
                                    onClick={() => goToTipoProducto(tipo.id)}
                                  >
                                    <ExternalLink className="h-3.5 w-3.5" />
                                    Ver
                                  </Button>
                                </div>
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
              {categoria.imagenUrl ? (
                <div className="relative aspect-square mb-4 overflow-hidden rounded-lg border">
                  <Image
                    src={categoria.imagenUrl}
                    alt={categoria.nombre}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-square mb-4 overflow-hidden rounded-lg border flex items-center justify-center bg-muted">
                  <FolderTree className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Estado:</span>
                  <Badge variant={categoria.activo ? "default" : "outline"}>
                    {categoria.activo ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Tipos de Producto:</span>
                  <Badge variant="secondary">{categoria._count?.tiposProducto || 0}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Subcategorías:</span>
                  <Badge variant="outline">{categoria._count?.subcategorias || 0}</Badge>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                {categoria.descripcion && (
                  <div>
                    <span className="text-sm text-muted-foreground">Descripción:</span>
                    <p className="text-sm mt-1">{categoria.descripcion}</p>
                  </div>
                )}
                
                {categoria.categoriaPadre && (
                  <div>
                    <span className="text-sm text-muted-foreground">Categoría Padre:</span>
                    <div className="mt-1">
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-sm"
                        onClick={() => router.push(`/gestionar/categorias/${categoria.categoriaPadreId}`)}
                      >
                        {categoria.categoriaPadre.nombre}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
