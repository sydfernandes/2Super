//Página de gestión de categorías
//Funcionalidades:
// - Listar todas las categorías existentes con su estructura jerárquica
// - Crear nuevas categorías (con opción de asignar categoría padre)
// - Editar categorías existentes
// - Eliminar categorías no utilizadas
// - Filtrar categorías por nombre o descripción
// - Mostrar el número de tipos de producto y subcategorías asociadas

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  PlusCircle, 
  Search, 
  FolderTree, 
  Pencil, 
  Trash2, 
  Loader2,
  Tag,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  FolderPlus,
  X,
  Image,
  ExternalLink
} from "lucide-react"
import { toast } from "sonner"

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

// Tipo para Categorías
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
  subcategorias?: Categoria[];
  _count?: {
    tiposProducto: number;
    subcategorias: number;
  };
};

// Tipo para entrada nueva
type CategoriaInput = {
  nombre: string;
  descripcion: string;
  categoriaPadreId: number | null;
  imagenUrl: string | null;
  activo: boolean;
};

export default function CategoriasPage() {
  const router = useRouter();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const [newCategoria, setNewCategoria] = useState<CategoriaInput>({
    nombre: "",
    descripcion: "",
    categoriaPadreId: null,
    imagenUrl: null,
    activo: true
  });
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingCategoriaId, setDeletingCategoriaId] = useState<number | null>(null);
  
  // Cargar categorías
  const fetchCategorias = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/categorias');
      const data = await response.json();
      
      if (data.success) {
        setCategorias(processCategoriesHierarchy(data.data));
      } else {
        toast.error("Error al cargar las categorías: " + data.message);
      }
    } catch (error) {
      console.error("Error al cargar las categorías:", error);
      toast.error("Error al cargar las categorías");
    } finally {
      setLoading(false);
    }
  };
  
  // Procesar las categorías para formar una jerarquía
  const processCategoriesHierarchy = (categoriasData: Categoria[]): Categoria[] => {
    // Crear índice de todas las categorías
    const categoriasMap = categoriasData.reduce((acc, categoria) => {
      acc[categoria.id] = { ...categoria, subcategorias: [] };
      return acc;
    }, {} as Record<number, Categoria>);
    
    // Categorías raíz (sin padre)
    const rootCategorias: Categoria[] = [];
    
    // Organizar las categorías en estructura jerárquica
    categoriasData.forEach(categoria => {
      if (categoria.categoriaPadreId === null) {
        // Es una categoría raíz
        rootCategorias.push(categoriasMap[categoria.id]);
      } else {
        // Es una subcategoría, agregar a su padre
        if (categoriasMap[categoria.categoriaPadreId]) {
          if (!categoriasMap[categoria.categoriaPadreId].subcategorias) {
            categoriasMap[categoria.categoriaPadreId].subcategorias = [];
          }
          categoriasMap[categoria.categoriaPadreId].subcategorias!.push(categoriasMap[categoria.id]);
        }
      }
    });
    
    return rootCategorias;
  };
  
  // Obtener todas las categorías en forma plana (para selects)
  const getAllCategoriesFlat = (): Categoria[] => {
    const flatList: Categoria[] = [];
    
    const flattenCategories = (cats: Categoria[], depth = 0) => {
      cats.forEach(cat => {
        // Agregar con información de nivel para mostrar sangría en selects
        flatList.push({
          ...cat,
          nombre: '  '.repeat(depth) + (depth > 0 ? '└─ ' : '') + cat.nombre
        });
        
        if (cat.subcategorias && cat.subcategorias.length > 0) {
          flattenCategories(cat.subcategorias, depth + 1);
        }
      });
    };
    
    flattenCategories(categorias);
    return flatList;
  };
  
  // Toggle para expandir/colapsar categoría
  const toggleCategory = (categoryId: number) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };
  
  // Cargar datos al inicio
  useEffect(() => {
    fetchCategorias();
  }, []);
  
  // Validar formulario
  useEffect(() => {
    if (editingCategoria) {
      setIsFormValid(
        editingCategoria.nombre.trim().length >= 3
      );
    } else {
      setIsFormValid(
        newCategoria.nombre.trim().length >= 3
      );
    }
  }, [newCategoria, editingCategoria]);
  
  // Filtrar categorías por término de búsqueda
  const searchCategories = () => {
    if (!searchTerm.trim()) return categorias;
    
    const results: Categoria[] = [];
    
    const searchInCategory = (categoria: Categoria): boolean => {
      const matchesSearch = 
        categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (categoria.descripcion && categoria.descripcion.toLowerCase().includes(searchTerm.toLowerCase()));
      
      if (matchesSearch) {
        results.push(categoria);
        return true;
      }
      
      let hasMatchingChild = false;
      
      if (categoria.subcategorias && categoria.subcategorias.length > 0) {
        categoria.subcategorias.forEach(subcat => {
          if (searchInCategory(subcat)) {
            hasMatchingChild = true;
          }
        });
      }
      
      if (hasMatchingChild) {
        results.push(categoria);
        return true;
      }
      
      return false;
    };
    
    categorias.forEach(cat => searchInCategory(cat));
    
    return results;
  };
  
  // Crear nueva categoría
  const handleCreate = async () => {
    if (!isFormValid) return;
    
    setIsCreating(true);
    try {
      const response = await fetch('/api/admin/categorias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategoria),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Categoría creada correctamente");
        fetchCategorias();
        setNewCategoria({
          nombre: "",
          descripcion: "",
          categoriaPadreId: null,
          imagenUrl: null,
          activo: true
        });
      } else {
        toast.error("Error al crear categoría: " + data.message);
      }
    } catch (error) {
      console.error("Error al crear categoría:", error);
      toast.error("Error al crear categoría");
    } finally {
      setIsCreating(false);
    }
  };
  
  // Actualizar categoría
  const handleUpdate = async () => {
    if (!editingCategoria || !isFormValid) return;
    
    setIsEditing(true);
    try {
      const response = await fetch(`/api/admin/categorias/${editingCategoria.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: editingCategoria.nombre,
          descripcion: editingCategoria.descripcion,
          categoriaPadreId: editingCategoria.categoriaPadreId,
          imagenUrl: editingCategoria.imagenUrl,
          activo: editingCategoria.activo
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Categoría actualizada correctamente");
        fetchCategorias();
        setEditingCategoria(null);
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
  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    setDeletingCategoriaId(id);
    try {
      const response = await fetch(`/api/admin/categorias/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Categoría eliminada correctamente");
        fetchCategorias();
      } else {
        toast.error("Error al eliminar categoría: " + data.message);
      }
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
      toast.error("Error al eliminar categoría");
    } finally {
      setIsDeleting(false);
      setDeletingCategoriaId(null);
    }
  };

  // Renderizar categoría con sus subcategorías de forma recursiva
  const renderCategoria = (categoria: Categoria, depth = 0) => {
    const isExpanded = expandedCategories.includes(categoria.id);
    const hasChildren = categoria.subcategorias && categoria.subcategorias.length > 0;
    
    return (
      <div key={categoria.id} className="mb-1">
        <div className={cn(
          "flex items-center p-2 rounded-md hover:bg-muted transition-colors",
          depth > 0 && "ml-6"
        )}>
          <div className="flex-1 flex items-center gap-2">
            {hasChildren ? (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-5 w-5"
                onClick={() => toggleCategory(categoria.id)}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            ) : (
              <div className="w-5" /> // Spacer for alignment
            )}
            
            <span 
              className="font-medium cursor-pointer hover:text-primary hover:underline"
              onClick={() => router.push(`/gestionar/categorias/${categoria.id}`)}
            >
              {categoria.nombre}
            </span>
            
            {categoria.activo ? (
              <Badge variant="outline" className="ml-2">Activo</Badge>
            ) : (
              <Badge variant="outline" className="bg-muted ml-2">Inactivo</Badge>
            )}
            
            <div className="flex gap-2 ml-auto">
              <Badge variant="secondary" className="flex items-center gap-1">
                <FolderTree className="h-3 w-3" />
                {categoria._count?.subcategorias || 0}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {categoria._count?.tiposProducto || 0}
              </Badge>
            </div>
          </div>
          
          <div className="ml-4 flex gap-1">
            <Button 
              variant="outline" 
              size="icon"
              className="text-blue-500 dark:text-blue-400"
              onClick={() => router.push(`/gestionar/categorias/${categoria.id}`)}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => setEditingCategoria(categoria)}>
                  <Pencil className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editar Categoría</DialogTitle>
                  <DialogDescription>
                    Modifica los datos de la categoría.
                  </DialogDescription>
                </DialogHeader>
                {editingCategoria && (
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-nombre">Nombre</Label>
                      <Input 
                        id="edit-nombre" 
                        value={editingCategoria.nombre} 
                        onChange={e => setEditingCategoria({...editingCategoria, nombre: e.target.value})}
                        maxLength={100}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-descripcion">Descripción</Label>
                      <Textarea 
                        id="edit-descripcion" 
                        value={editingCategoria.descripcion || ""} 
                        onChange={e => setEditingCategoria({...editingCategoria, descripcion: e.target.value})}
                        maxLength={640}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-padre">Categoría Padre</Label>
                      <Select
                        value={editingCategoria.categoriaPadreId?.toString() || "null"}
                        onValueChange={(value) => {
                          setEditingCategoria({
                            ...editingCategoria, 
                            categoriaPadreId: value === "null" ? null : Number(value)
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sin categoría padre" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="null">Sin categoría padre</SelectItem>
                          {getAllCategoriesFlat()
                            .filter(cat => cat.id !== editingCategoria.id)
                            .map(cat => (
                              <SelectItem 
                                key={cat.id} 
                                value={cat.id.toString()}
                                disabled={
                                  // Prevenir selección circular de categorías padre
                                  editingCategoria.subcategorias?.some(
                                    subcat => subcat.id === cat.id || 
                                    subcat.subcategorias?.some(s => s.id === cat.id)
                                  )
                                }
                              >
                                {cat.nombre}
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-imagen">URL de Imagen</Label>
                      <Input 
                        id="edit-imagen" 
                        value={editingCategoria.imagenUrl || ""} 
                        onChange={e => setEditingCategoria({...editingCategoria, imagenUrl: e.target.value})}
                        placeholder="https://ejemplo.com/imagen.jpg"
                        maxLength={500}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="edit-activo"
                        checked={editingCategoria.activo}
                        onCheckedChange={(checked) => {
                          setEditingCategoria({...editingCategoria, activo: checked});
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
                  size="icon" 
                  className="text-red-500 dark:text-red-400"
                  disabled={(categoria._count?.subcategorias || 0) > 0 || (categoria._count?.tiposProducto || 0) > 0}
                >
                  <Trash2 className="h-4 w-4" />
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
                    onClick={() => handleDelete(categoria.id)}
                    disabled={isDeleting && deletingCategoriaId === categoria.id}
                  >
                    {isDeleting && deletingCategoriaId === categoria.id ? (
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
            
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="text-green-500 dark:text-green-400"
                >
                  <FolderPlus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear Subcategoría</DialogTitle>
                  <DialogDescription>
                    Crea una nueva subcategoría dentro de "{categoria.nombre}".
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="sub-nombre">Nombre</Label>
                    <Input 
                      id="sub-nombre" 
                      value={newCategoria.nombre} 
                      onChange={e => setNewCategoria({...newCategoria, nombre: e.target.value})}
                      placeholder="Nombre de la subcategoría"
                      maxLength={100}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sub-descripcion">Descripción</Label>
                    <Textarea 
                      id="sub-descripcion" 
                      value={newCategoria.descripcion} 
                      onChange={e => setNewCategoria({...newCategoria, descripcion: e.target.value})}
                      placeholder="Descripción detallada"
                      maxLength={640}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sub-imagen">URL de Imagen</Label>
                    <Input 
                      id="sub-imagen" 
                      value={newCategoria.imagenUrl || ""} 
                      onChange={e => setNewCategoria({...newCategoria, imagenUrl: e.target.value})}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      maxLength={500}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="sub-activo"
                      checked={newCategoria.activo}
                      onCheckedChange={(checked) => {
                        setNewCategoria({...newCategoria, activo: checked});
                      }}
                    />
                    <Label htmlFor="sub-activo">Activo</Label>
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
                    onClick={() => {
                      setNewCategoria({...newCategoria, categoriaPadreId: categoria.id});
                      handleCreate();
                    }}
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
                        <FolderPlus className="h-4 w-4" />
                        Crear Subcategoría
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {isExpanded && hasChildren && (
          <div className="ml-4 pl-2 border-l border-border">
            {categoria.subcategorias!.map(subcat => renderCategoria(subcat, depth + 1))}
          </div>
        )}
      </div>
    );
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
          <h1 className="text-3xl font-bold tracking-tight">Categorías</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => router.push('/gestionar/tipodeproducto')}
          >
            <Tag className="h-4 w-4" />
            Tipos de Producto
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Nueva Categoría
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nueva Categoría</DialogTitle>
                <DialogDescription>
                  Añade una nueva categoría para organizar productos.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="new-nombre">Nombre</Label>
                  <Input 
                    id="new-nombre" 
                    value={newCategoria.nombre} 
                    onChange={e => setNewCategoria({...newCategoria, nombre: e.target.value})}
                    placeholder="Nombre de la categoría"
                    maxLength={100}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-descripcion">Descripción</Label>
                  <Textarea 
                    id="new-descripcion" 
                    value={newCategoria.descripcion} 
                    onChange={e => setNewCategoria({...newCategoria, descripcion: e.target.value})}
                    placeholder="Descripción detallada de la categoría"
                    maxLength={640}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-padre">Categoría Padre (opcional)</Label>
                  <Select
                    value={newCategoria.categoriaPadreId?.toString() || "null"}
                    onValueChange={(value) => {
                      setNewCategoria({
                        ...newCategoria, 
                        categoriaPadreId: value === "null" ? null : Number(value)
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sin categoría padre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="null">Sin categoría padre</SelectItem>
                      {getAllCategoriesFlat().map(cat => (
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
                    value={newCategoria.imagenUrl || ""} 
                    onChange={e => setNewCategoria({...newCategoria, imagenUrl: e.target.value})}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    maxLength={500}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="new-activo"
                    checked={newCategoria.activo}
                    onCheckedChange={(checked) => {
                      setNewCategoria({...newCategoria, activo: checked});
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
                      Crear Categoría
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
          <CardTitle>Categorías</CardTitle>
          <CardDescription>
            Administra las categorías utilizadas para organizar productos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar categorías..."
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
          ) : (
            <div className="space-y-2 border rounded-md p-4">
              {searchCategories().length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm ? "No se encontraron resultados" : "No hay categorías definidas"}
                </div>
              ) : (
                searchCategories().map(categoria => renderCategoria(categoria))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}