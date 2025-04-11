//Página de gestión de etiquetas
//Funcionalidades:
// - Listar todas las etiquetas existentes
// - Crear nuevas etiquetas
// - Editar etiquetas existentes
// - Eliminar etiquetas no utilizadas
// - Filtrar etiquetas por valor o descripción
// - Mostrar el número de productos asociados a cada etiqueta

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
  ShoppingBag,
  X 
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

// Tipo para Etiquetas
type Etiqueta = {
  id: number;
  valor: string;
  descripcion: string;
  _count?: {
    productos: number;
  };
}

export default function EtiquetasPage() {
  const router = useRouter();
  const [etiquetas, setEtiquetas] = useState<Etiqueta[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [newEtiqueta, setNewEtiqueta] = useState<{valor: string; descripcion: string}>({
    valor: "",
    descripcion: ""
  });
  const [editingEtiqueta, setEditingEtiqueta] = useState<Etiqueta | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingEtiquetaId, setDeletingEtiquetaId] = useState<number | null>(null);
  
  // Cargar etiquetas
  const fetchEtiquetas = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/etiquetas');
      const data = await response.json();
      
      if (data.success) {
        setEtiquetas(data.data);
      } else {
        toast.error("Error al cargar las etiquetas: " + data.message);
      }
    } catch (error) {
      console.error("Error al cargar las etiquetas:", error);
      toast.error("Error al cargar las etiquetas");
    } finally {
      setLoading(false);
    }
  };
  
  // Cargar datos al inicio
  useEffect(() => {
    fetchEtiquetas();
  }, []);
  
  // Validar formulario
  useEffect(() => {
    if (editingEtiqueta) {
      setIsFormValid(
        editingEtiqueta.valor.trim().length >= 2 && 
        editingEtiqueta.descripcion.trim().length >= 3
      );
    } else {
      setIsFormValid(
        newEtiqueta.valor.trim().length >= 2 && 
        newEtiqueta.descripcion.trim().length >= 3
      );
    }
  }, [newEtiqueta, editingEtiqueta]);
  
  // Filtrar etiquetas por término de búsqueda
  const filteredEtiquetas = etiquetas.filter(etiqueta => 
    etiqueta.valor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    etiqueta.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Crear nueva etiqueta
  const handleCreate = async () => {
    if (!isFormValid) return;
    
    setIsCreating(true);
    try {
      const response = await fetch('/api/admin/etiquetas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEtiqueta),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Etiqueta creada correctamente");
        fetchEtiquetas();
        setNewEtiqueta({ valor: "", descripcion: "" });
      } else {
        toast.error("Error al crear etiqueta: " + data.message);
      }
    } catch (error) {
      console.error("Error al crear etiqueta:", error);
      toast.error("Error al crear etiqueta");
    } finally {
      setIsCreating(false);
    }
  };
  
  // Actualizar etiqueta
  const handleUpdate = async () => {
    if (!editingEtiqueta || !isFormValid) return;
    
    setIsEditing(true);
    try {
      const response = await fetch(`/api/admin/etiquetas/${editingEtiqueta.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          valor: editingEtiqueta.valor,
          descripcion: editingEtiqueta.descripcion
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Etiqueta actualizada correctamente");
        fetchEtiquetas();
        setEditingEtiqueta(null);
      } else {
        toast.error("Error al actualizar etiqueta: " + data.message);
      }
    } catch (error) {
      console.error("Error al actualizar etiqueta:", error);
      toast.error("Error al actualizar etiqueta");
    } finally {
      setIsEditing(false);
    }
  };
  
  // Eliminar etiqueta
  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    setDeletingEtiquetaId(id);
    try {
      const response = await fetch(`/api/admin/etiquetas/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Etiqueta eliminada correctamente");
        fetchEtiquetas();
      } else {
        toast.error("Error al eliminar etiqueta: " + data.message);
      }
    } catch (error) {
      console.error("Error al eliminar etiqueta:", error);
      toast.error("Error al eliminar etiqueta");
    } finally {
      setIsDeleting(false);
      setDeletingEtiquetaId(null);
    }
  };
  
  return (
    <div className="max-w-5xl mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Etiquetas</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Nueva Etiqueta
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nueva Etiqueta</DialogTitle>
                <DialogDescription>
                  Añade una nueva etiqueta para clasificar productos. Rellena todos los campos.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="new-valor">Identificador</Label>
                  <Input 
                    id="new-valor" 
                    value={newEtiqueta.valor} 
                    onChange={e => setNewEtiqueta({...newEtiqueta, valor: e.target.value})}
                    placeholder="p.ej. organico, vegano, eco"
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
                    value={newEtiqueta.descripcion} 
                    onChange={e => setNewEtiqueta({...newEtiqueta, descripcion: e.target.value})}
                    placeholder="p.ej. Productos de origen orgánico"
                    maxLength={100}
                  />
                  <p className="text-xs text-muted-foreground">
                    Descripción detallada (máx 100 caracteres)
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
                      Crear Etiqueta
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
          <CardTitle>Etiquetas</CardTitle>
          <CardDescription>
            Administra las etiquetas utilizadas para clasificar productos en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar etiquetas..."
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
                    <TableHead>Productos</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEtiquetas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        {searchTerm ? "No se encontraron resultados" : "No hay etiquetas definidas"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEtiquetas.map(etiqueta => (
                      <TableRow key={etiqueta.id}>
                        <TableCell>{etiqueta.id}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {etiqueta.valor}
                          </Badge>
                        </TableCell>
                        <TableCell>{etiqueta.descripcion}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="flex items-center w-fit gap-1">
                            <ShoppingBag className="h-3 w-3" />
                            {etiqueta._count?.productos || 0}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="icon" onClick={() => setEditingEtiqueta(etiqueta)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Editar Etiqueta</DialogTitle>
                                <DialogDescription>
                                  Modifica los datos de la etiqueta.
                                </DialogDescription>
                              </DialogHeader>
                              {editingEtiqueta && (
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-valor">Identificador</Label>
                                    <Input 
                                      id="edit-valor" 
                                      value={editingEtiqueta.valor} 
                                      onChange={e => setEditingEtiqueta({...editingEtiqueta, valor: e.target.value})}
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
                                      value={editingEtiqueta.descripcion} 
                                      onChange={e => setEditingEtiqueta({...editingEtiqueta, descripcion: e.target.value})}
                                      maxLength={100}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                      Descripción detallada (máx 100 caracteres)
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
                                disabled={(etiqueta._count?.productos || 0) > 0}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Eliminar etiqueta?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. Esto eliminará permanentemente la etiqueta 
                                  "{etiqueta.descripcion}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="flex items-center gap-2">
                                  <X className="h-4 w-4" />
                                  Cancelar
                                </AlertDialogCancel>
                                <AlertDialogAction 
                                  className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
                                  onClick={() => handleDelete(etiqueta.id)}
                                  disabled={isDeleting && deletingEtiquetaId === etiqueta.id}
                                >
                                  {isDeleting && deletingEtiquetaId === etiqueta.id ? (
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