//Página de gestión de tipos de productos
//Funcionalidades:
// - Listar todos los tipos de producto
// - Filtrar tipos por nombre, descripción o categoría
// - Crear nuevos tipos de producto
// - Editar tipos existentes
// - Eliminar tipos no utilizados
// - Ver productos asociados a cada tipo

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { cn } from "@/lib/utils"

// Tipo para Categoría (simple)
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
  imagenUrl: string | null;
  fechaCreacion: string;
  fechaActualizacion: string;
  activo: boolean;
  categoria?: Categoria;
  _count?: {
    productos: number;
  };
};

// Tipo para entrada de nuevo Tipo de Producto
type TipoProductoInput = {
  nombre: string;
  descripcion: string;
  categoriaId: number;
  imagenUrl: string | null;
  activo: boolean;
};

export default function TiposProductoPage() {
  const router = useRouter();
  const [tiposProducto, setTiposProducto] = useState<TipoProducto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTipos, setFilteredTipos] = useState<TipoProducto[]>([]);
  
  const [newTipoProducto, setNewTipoProducto] = useState<TipoProductoInput>({
    nombre: "",
    descripcion: "",
    categoriaId: 0,
    imagenUrl: null,
    activo: true
  });
  
  const [editingTipo, setEditingTipo] = useState<TipoProducto | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingTipoId, setDeletingTipoId] = useState<number | null>(null);
  
  // Cargar tipos de producto
  const fetchTiposProducto = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/tiposproducto');
      const data = await response.json();
      
      if (data.success) {
        setTiposProducto(data.data);
        setFilteredTipos(data.data);
      } else {
        toast.error("Error al cargar tipos de producto: " + data.message);
      }
    } catch (error) {
      console.error("Error al cargar tipos de producto:", error);
      toast.error("Error al cargar tipos de producto");
    } finally {
      setLoading(false);
    }
  };
  
  // Cargar categorías para los formularios
  const fetchCategorias = async () => {
    try {
      const response = await fetch('/api/admin/categorias');
      const data = await response.json();
      
      if (data.success) {
        setCategorias(data.data);
      } else {
        toast.error("Error al cargar categorías: " + data.message);
      }
    } catch (error) {
      console.error("Error al cargar categorías:", error);
      toast.error("Error al cargar categorías");
    }
  };
  
  // Cargar datos al inicio
  useEffect(() => {
    fetchTiposProducto();
    fetchCategorias();
  }, []);
  
  // Filtrar tipos de producto por término de búsqueda
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredTipos(tiposProducto);
      return;
    }
    
    const searchTermLower = searchTerm.toLowerCase();
    const filtered = tiposProducto.filter(tipo => 
      tipo.nombre.toLowerCase().includes(searchTermLower) || 
      (tipo.descripcion && tipo.descripcion.toLowerCase().includes(searchTermLower)) ||
      (tipo.categoria && tipo.categoria.nombre.toLowerCase().includes(searchTermLower))
    );
    
    setFilteredTipos(filtered);
  }, [searchTerm, tiposProducto]);
  
  // Validar formulario
  useEffect(() => {
    if (editingTipo) {
      setIsFormValid(
        editingTipo.nombre.trim().length >= 2 &&
        editingTipo.categoriaId > 0
      );
    } else {
      setIsFormValid(
        newTipoProducto.nombre.trim().length >= 2 &&
        newTipoProducto.categoriaId > 0
      );
    }
  }, [newTipoProducto, editingTipo]);
  
  // Crear nuevo tipo de producto
  const handleCreate = async () => {
    if (!isFormValid) return;
    
    setIsCreating(true);
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
          categoriaId: 0,
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
      setIsCreating(false);
    }
  };
  
  // Actualizar tipo de producto
  const handleUpdate = async () => {
    if (!editingTipo || !isFormValid) return;
    
    setIsEditing(true);
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
      setIsEditing(false);
    }
  };
  
  // Eliminar tipo de producto
  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    setDeletingTipoId(id);
    try {
      const response = await fetch(`/api/admin/tiposproducto/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Tipo de producto eliminado correctamente");
        fetchTiposProducto();
      } else {
        toast.error("Error al eliminar tipo de producto: " + data.message);
      }
    } catch (error) {
      console.error("Error al eliminar tipo de producto:", error);
      toast.error("Error al eliminar tipo de producto");
    } finally {
      setIsDeleting(false);
      setDeletingTipoId(null);
    }
  };
  
  // Ir a detalle de tipo de producto
  const goToTipoProducto = (tipoId: number) => {
    router.push(`/gestionar/tipodeproducto/${tipoId}`);
  };
  
  return (
    <div className="max-w-5xl mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={() => router.push('/admin')}
          >
            <ChevronLeft className="h-4 w-4" />
            Volver
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Tipos de Producto</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => router.push('/gestionar/categorias')}
          >
            <FolderTree className="h-4 w-4" />
            Categorías
          </Button>
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
                  Añade un nuevo tipo de producto para organizar productos.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="new-nombre">Nombre</Label>
                  <Input 
                    id="new-nombre" 
                    value={newTipoProducto.nombre} 
                    onChange={e => setNewTipoProducto({...newTipoProducto, nombre: e.target.value})}
                    placeholder="Nombre del tipo de producto"
                    maxLength={100}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-descripcion">Descripción</Label>
                  <Textarea 
                    id="new-descripcion" 
                    value={newTipoProducto.descripcion} 
                    onChange={e => setNewTipoProducto({...newTipoProducto, descripcion: e.target.value})}
                    placeholder="Descripción detallada del tipo de producto"
                    maxLength={640}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-categoria">Categoría</Label>
                  <Select
                    value={newTipoProducto.categoriaId ? newTipoProducto.categoriaId.toString() : ""}
                    onValueChange={(value) => {
                      setNewTipoProducto({
                        ...newTipoProducto, 
                        categoriaId: Number(value)
                      });
                    }}
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
                  <Label htmlFor="new-imagen">URL de Imagen (opcional)</Label>
                  <Input 
                    id="new-imagen" 
                    value={newTipoProducto.imagenUrl || ""} 
                    onChange={e => setNewTipoProducto({...newTipoProducto, imagenUrl: e.target.value})}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    maxLength={500}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="new-activo"
                    checked={newTipoProducto.activo}
                    onCheckedChange={(checked) => {
                      setNewTipoProducto({...newTipoProducto, activo: checked});
                    }}
                  />
                  <Label htmlFor="new-activo">Activo</Label>
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
                  onClick={handleCreate} 
                  disabled={!isFormValid || isCreating}
                  className="flex items-center gap-2"
                >
                  {isCreating ? (
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
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Tipos de Producto</CardTitle>
          <CardDescription>
            Administra los tipos de producto utilizados para organizar productos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, descripción o categoría..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredTipos.length === 0 ? (
            <div className="text-center py-8 border border-dashed rounded-md">
              <FileBox className="h-10 w-10 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No hay tipos de producto</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                {searchTerm 
                  ? "No se encontraron resultados para tu búsqueda" 
                  : "No hay tipos de producto definidos. Crea uno nuevo para comenzar."
                }
              </p>
              {!searchTerm && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="mt-4 flex items-center gap-2">
                      <PlusCircle className="h-4 w-4" />
                      Crear Tipo de Producto
                    </Button>
                  </DialogTrigger>
                </Dialog>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Categoría</TableHead>
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
                        {tipo.categoria ? tipo.categoria.nombre : "Sin categoría"}
                      </TableCell>
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
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-1"
                            onClick={() => goToTipoProducto(tipo.id)}
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            Ver
                          </Button>
                          
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
                                    <Label htmlFor="edit-nombre">Nombre</Label>
                                    <Input 
                                      id="edit-nombre" 
                                      value={editingTipo.nombre} 
                                      onChange={e => setEditingTipo({...editingTipo, nombre: e.target.value})}
                                      maxLength={100}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-descripcion">Descripción</Label>
                                    <Textarea 
                                      id="edit-descripcion" 
                                      value={editingTipo.descripcion || ""} 
                                      onChange={e => setEditingTipo({...editingTipo, descripcion: e.target.value})}
                                      maxLength={640}
                                      rows={3}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-categoria">Categoría</Label>
                                    <Select
                                      value={editingTipo.categoriaId?.toString()}
                                      onValueChange={(value) => {
                                        setEditingTipo({
                                          ...editingTipo, 
                                          categoriaId: Number(value)
                                        });
                                      }}
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
                                    <Label htmlFor="edit-imagen">URL de Imagen</Label>
                                    <Input 
                                      id="edit-imagen" 
                                      value={editingTipo.imagenUrl || ""} 
                                      onChange={e => setEditingTipo({...editingTipo, imagenUrl: e.target.value})}
                                      placeholder="https://ejemplo.com/imagen.jpg"
                                      maxLength={500}
                                    />
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Switch 
                                      id="edit-activo"
                                      checked={editingTipo.activo}
                                      onCheckedChange={(checked) => {
                                        setEditingTipo({...editingTipo, activo: checked});
                                      }}
                                    />
                                    <Label htmlFor="edit-activo">Activo</Label>
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
                                  onClick={handleUpdate} 
                                  disabled={!isFormValid || isEditing}
                                  className="flex items-center gap-2"
                                >
                                  {isEditing ? (
                                    <>
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                      Guardando...
                                    </>
                                  ) : (
                                    <>
                                      <Pencil className="h-4 w-4" />
                                      Guardar Cambios
                                    </>
                                  )}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-500 dark:text-red-400"
                                disabled={(tipo._count?.productos || 0) > 0}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Eliminar tipo de producto?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. Esto eliminará permanentemente el tipo de producto 
                                  "{tipo.nombre}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="flex items-center gap-2">
                                  <X className="h-4 w-4" />
                                  Cancelar
                                </AlertDialogCancel>
                                <AlertDialogAction 
                                  className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
                                  onClick={() => handleDelete(tipo.id)}
                                  disabled={isDeleting && deletingTipoId === tipo.id}
                                >
                                  {isDeleting && deletingTipoId === tipo.id ? (
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
    </div>
  );
}
