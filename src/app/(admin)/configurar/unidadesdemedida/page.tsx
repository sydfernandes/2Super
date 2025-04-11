//Página de gestión de unidades de medida
//Funcionalidades:
// - Listar todas las unidades de medida existentes
// - Crear nuevas unidades de medida
// - Editar unidades existentes
// - Eliminar unidades no utilizadas
// - Filtrar unidades por valor o descripción
// - Mostrar el número de productos e ingredientes asociados a cada unidad

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  PlusCircle, 
  Search, 
  Ruler, 
  Pencil, 
  Trash2, 
  Loader2,
  Package,
  Utensils,
  X,
  ChevronLeft
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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

// Tipo para Unidades de Medida
type UnidadMedida = {
  id: number;
  valor: string;
  descripcion: string;
  _count?: {
    productos: number;
    ingredientes: number;
  };
}

export default function UnidadesMedidaPage() {
  const router = useRouter();
  const [unidades, setUnidades] = useState<UnidadMedida[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [newUnidad, setNewUnidad] = useState<{valor: string; descripcion: string}>({
    valor: "",
    descripcion: ""
  });
  const [editingUnidad, setEditingUnidad] = useState<UnidadMedida | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingUnidadId, setDeletingUnidadId] = useState<number | null>(null);
  
  // Cargar unidades de medida
  const fetchUnidades = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/unidadesdemedida');
      const data = await response.json();
      
      if (data.success) {
        setUnidades(data.data);
      } else {
        toast.error("Error al cargar las unidades de medida: " + data.message);
      }
    } catch (error) {
      console.error("Error al cargar las unidades de medida:", error);
      toast.error("Error al cargar las unidades de medida");
    } finally {
      setLoading(false);
    }
  };
  
  // Cargar datos al inicio
  useEffect(() => {
    fetchUnidades();
  }, []);
  
  // Validar formulario
  useEffect(() => {
    if (editingUnidad) {
      setIsFormValid(
        editingUnidad.valor.trim().length >= 2 && 
        editingUnidad.descripcion.trim().length >= 3
      );
    } else {
      setIsFormValid(
        newUnidad.valor.trim().length >= 2 && 
        newUnidad.descripcion.trim().length >= 3
      );
    }
  }, [newUnidad, editingUnidad]);
  
  // Filtrar unidades por término de búsqueda
  const filteredUnidades = unidades.filter(unidad => 
    unidad.valor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unidad.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Crear nueva unidad de medida
  const handleCreate = async () => {
    if (!isFormValid) return;
    
    setIsCreating(true);
    try {
      const response = await fetch('/api/admin/unidadesdemedida', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUnidad),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Unidad de medida creada correctamente");
        fetchUnidades();
        setNewUnidad({ valor: "", descripcion: "" });
      } else {
        toast.error("Error al crear unidad de medida: " + data.message);
      }
    } catch (error) {
      console.error("Error al crear unidad de medida:", error);
      toast.error("Error al crear unidad de medida");
    } finally {
      setIsCreating(false);
    }
  };
  
  // Actualizar unidad de medida
  const handleUpdate = async () => {
    if (!editingUnidad || !isFormValid) return;
    
    setIsEditing(true);
    try {
      const response = await fetch(`/api/admin/unidadesdemedida/${editingUnidad.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          valor: editingUnidad.valor,
          descripcion: editingUnidad.descripcion
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Unidad de medida actualizada correctamente");
        fetchUnidades();
        setEditingUnidad(null);
      } else {
        toast.error("Error al actualizar unidad de medida: " + data.message);
      }
    } catch (error) {
      console.error("Error al actualizar unidad de medida:", error);
      toast.error("Error al actualizar unidad de medida");
    } finally {
      setIsEditing(false);
    }
  };
  
  // Eliminar unidad de medida
  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    setDeletingUnidadId(id);
    try {
      const response = await fetch(`/api/admin/unidadesdemedida/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Unidad de medida eliminada correctamente");
        fetchUnidades();
      } else {
        toast.error("Error al eliminar unidad de medida: " + data.message);
      }
    } catch (error) {
      console.error("Error al eliminar unidad de medida:", error);
      toast.error("Error al eliminar unidad de medida");
    } finally {
      setIsDeleting(false);
      setDeletingUnidadId(null);
    }
  };

  // Calcular total de usos (productos + ingredientes)
  const getTotalUsos = (unidad: UnidadMedida) => {
    const productosCount = unidad._count?.productos || 0;
    const ingredientesCount = unidad._count?.ingredientes || 0;
    return productosCount + ingredientesCount;
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
          <h1 className="text-3xl font-bold tracking-tight">Unidades de Medida</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Nueva Unidad
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nueva Unidad de Medida</DialogTitle>
                <DialogDescription>
                  Añade una nueva unidad para medir productos e ingredientes. Rellena todos los campos.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="new-valor">Identificador</Label>
                  <Input 
                    id="new-valor" 
                    value={newUnidad.valor} 
                    onChange={e => setNewUnidad({...newUnidad, valor: e.target.value})}
                    placeholder="p.ej. kg, g, l, ml, unidad"
                    maxLength={20}
                  />
                  <p className="text-xs text-muted-foreground">
                    Identificador único (máx 20 caracteres, sin espacios preferiblemente)
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-descripcion">Descripción</Label>
                  <Input 
                    id="new-descripcion" 
                    value={newUnidad.descripcion} 
                    onChange={e => setNewUnidad({...newUnidad, descripcion: e.target.value})}
                    placeholder="p.ej. Kilogramo, Gramo, Litro, Mililitro"
                    maxLength={100}
                  />
                  <p className="text-xs text-muted-foreground">
                    Descripción completa de la unidad (máx 100 caracteres)
                  </p>
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
                      Crear Unidad
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
          <CardTitle>Unidades de Medida</CardTitle>
          <CardDescription>
            Administra las unidades utilizadas para medir productos e ingredientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar unidades..."
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
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">ID</TableHead>
                    <TableHead>Identificador</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Usos</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUnidades.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        {searchTerm ? "No se encontraron resultados" : "No hay unidades de medida definidas"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUnidades.map(unidad => (
                      <TableRow key={unidad.id}>
                        <TableCell>{unidad.id}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Ruler className="h-3 w-3" />
                            {unidad.valor}
                          </Badge>
                        </TableCell>
                        <TableCell>{unidad.descripcion}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Badge variant="secondary" className="flex items-center w-fit gap-1">
                              <Package className="h-3 w-3" />
                              {unidad._count?.productos || 0}
                            </Badge>
                            <Badge variant="outline" className="flex items-center w-fit gap-1">
                              <Utensils className="h-3 w-3" />
                              {unidad._count?.ingredientes || 0}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="icon" onClick={() => setEditingUnidad(unidad)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Editar Unidad de Medida</DialogTitle>
                                <DialogDescription>
                                  Modifica los datos de la unidad de medida.
                                </DialogDescription>
                              </DialogHeader>
                              {editingUnidad && (
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-valor">Identificador</Label>
                                    <Input 
                                      id="edit-valor" 
                                      value={editingUnidad.valor} 
                                      onChange={e => setEditingUnidad({...editingUnidad, valor: e.target.value})}
                                      maxLength={20}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                      Identificador único (máx 20 caracteres)
                                    </p>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-descripcion">Descripción</Label>
                                    <Input 
                                      id="edit-descripcion" 
                                      value={editingUnidad.descripcion} 
                                      onChange={e => setEditingUnidad({...editingUnidad, descripcion: e.target.value})}
                                      maxLength={100}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                      Descripción completa de la unidad (máx 100 caracteres)
                                    </p>
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
                                disabled={getTotalUsos(unidad) > 0}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Eliminar unidad de medida?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. Esto eliminará permanentemente la unidad 
                                  "{unidad.descripcion}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="flex items-center gap-2">
                                  <X className="h-4 w-4" />
                                  Cancelar
                                </AlertDialogCancel>
                                <AlertDialogAction 
                                  className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
                                  onClick={() => handleDelete(unidad.id)}
                                  disabled={isDeleting && deletingUnidadId === unidad.id}
                                >
                                  {isDeleting && deletingUnidadId === unidad.id ? (
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
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}