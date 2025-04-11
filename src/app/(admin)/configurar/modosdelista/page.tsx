//Página de gestión de modos de lista
//Funcionalidades:
// - Listar todos los modos de lista existentes
// - Crear nuevos modos de lista
// - Editar modos existentes
// - Eliminar modos no utilizados
// - Filtrar modos por valor o descripción
// - Mostrar el número de listas y preferencias asociadas a cada modo

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  PlusCircle, 
  Search, 
  ListChecks, 
  Pencil, 
  Trash2, 
  Loader2,
  List,
  Heart,
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

// Tipo para Modos de Lista
type ModoLista = {
  id: number;
  valor: string;
  descripcion: string;
  _count?: {
    listas: number;
    preferenciasUsuario: number;
  };
}

export default function ModosListaPage() {
  const router = useRouter();
  const [modos, setModos] = useState<ModoLista[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [newModo, setNewModo] = useState<{valor: string; descripcion: string}>({
    valor: "",
    descripcion: ""
  });
  const [editingModo, setEditingModo] = useState<ModoLista | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingModoId, setDeletingModoId] = useState<number | null>(null);
  
  // Cargar modos de lista
  const fetchModos = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/modosdelista');
      const data = await response.json();
      
      if (data.success) {
        setModos(data.data);
      } else {
        toast.error("Error al cargar los modos de lista: " + data.message);
      }
    } catch (error) {
      console.error("Error al cargar los modos de lista:", error);
      toast.error("Error al cargar los modos de lista");
    } finally {
      setLoading(false);
    }
  };
  
  // Cargar datos al inicio
  useEffect(() => {
    fetchModos();
  }, []);
  
  // Validar formulario
  useEffect(() => {
    if (editingModo) {
      setIsFormValid(
        editingModo.valor.trim().length >= 2 && 
        editingModo.descripcion.trim().length >= 3
      );
    } else {
      setIsFormValid(
        newModo.valor.trim().length >= 2 && 
        newModo.descripcion.trim().length >= 3
      );
    }
  }, [newModo, editingModo]);
  
  // Filtrar modos por término de búsqueda
  const filteredModos = modos.filter(modo => 
    modo.valor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    modo.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Crear nuevo modo de lista
  const handleCreate = async () => {
    if (!isFormValid) return;
    
    setIsCreating(true);
    try {
      const response = await fetch('/api/admin/modosdelista', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newModo),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Modo de lista creado correctamente");
        fetchModos();
        setNewModo({ valor: "", descripcion: "" });
      } else {
        toast.error("Error al crear modo de lista: " + data.message);
      }
    } catch (error) {
      console.error("Error al crear modo de lista:", error);
      toast.error("Error al crear modo de lista");
    } finally {
      setIsCreating(false);
    }
  };
  
  // Actualizar modo de lista
  const handleUpdate = async () => {
    if (!editingModo || !isFormValid) return;
    
    setIsEditing(true);
    try {
      const response = await fetch(`/api/admin/modosdelista/${editingModo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          valor: editingModo.valor,
          descripcion: editingModo.descripcion
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Modo de lista actualizado correctamente");
        fetchModos();
        setEditingModo(null);
      } else {
        toast.error("Error al actualizar modo de lista: " + data.message);
      }
    } catch (error) {
      console.error("Error al actualizar modo de lista:", error);
      toast.error("Error al actualizar modo de lista");
    } finally {
      setIsEditing(false);
    }
  };
  
  // Eliminar modo de lista
  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    setDeletingModoId(id);
    try {
      const response = await fetch(`/api/admin/modosdelista/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Modo de lista eliminado correctamente");
        fetchModos();
      } else {
        toast.error("Error al eliminar modo de lista: " + data.message);
      }
    } catch (error) {
      console.error("Error al eliminar modo de lista:", error);
      toast.error("Error al eliminar modo de lista");
    } finally {
      setIsDeleting(false);
      setDeletingModoId(null);
    }
  };

  // Calcular total de usos (listas + preferencias)
  const getTotalUsos = (modo: ModoLista) => {
    const listasCount = modo._count?.listas || 0;
    const preferenciasCount = modo._count?.preferenciasUsuario || 0;
    return listasCount + preferenciasCount;
  };
  
  return (
    <div className="max-w-5xl mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Modos de Lista</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Nuevo Modo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nuevo Modo de Lista</DialogTitle>
                <DialogDescription>
                  Añade un nuevo modo para organizar listas de compra. Rellena todos los campos.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="new-valor">Identificador</Label>
                  <Input 
                    id="new-valor" 
                    value={newModo.valor} 
                    onChange={e => setNewModo({...newModo, valor: e.target.value})}
                    placeholder="p.ej. clasico, categorias, tiendas"
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
                    value={newModo.descripcion} 
                    onChange={e => setNewModo({...newModo, descripcion: e.target.value})}
                    placeholder="p.ej. Modo clásico de lista"
                    maxLength={50}
                  />
                  <p className="text-xs text-muted-foreground">
                    Descripción visible para usuarios (máx 50 caracteres)
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
                      Crear Modo
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
          <CardTitle>Modos de Lista</CardTitle>
          <CardDescription>
            Administra los modos disponibles para organizar listas de compra
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar modos..."
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
                  {filteredModos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        {searchTerm ? "No se encontraron resultados" : "No hay modos de lista definidos"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredModos.map(modo => (
                      <TableRow key={modo.id}>
                        <TableCell>{modo.id}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <ListChecks className="h-3 w-3" />
                            {modo.valor}
                          </Badge>
                        </TableCell>
                        <TableCell>{modo.descripcion}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Badge variant="secondary" className="flex items-center w-fit gap-1">
                              <List className="h-3 w-3" />
                              {modo._count?.listas || 0}
                            </Badge>
                            <Badge variant="outline" className="flex items-center w-fit gap-1">
                              <Heart className="h-3 w-3" />
                              {modo._count?.preferenciasUsuario || 0}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="icon" onClick={() => setEditingModo(modo)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Editar Modo de Lista</DialogTitle>
                                <DialogDescription>
                                  Modifica los datos del modo de lista.
                                </DialogDescription>
                              </DialogHeader>
                              {editingModo && (
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-valor">Identificador</Label>
                                    <Input 
                                      id="edit-valor" 
                                      value={editingModo.valor} 
                                      onChange={e => setEditingModo({...editingModo, valor: e.target.value})}
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
                                      value={editingModo.descripcion} 
                                      onChange={e => setEditingModo({...editingModo, descripcion: e.target.value})}
                                      maxLength={50}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                      Descripción visible para usuarios (máx 50 caracteres)
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
                                disabled={getTotalUsos(modo) > 0}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Eliminar modo de lista?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. Esto eliminará permanentemente el modo 
                                  "{modo.descripcion}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="flex items-center gap-2">
                                  <X className="h-4 w-4" />
                                  Cancelar
                                </AlertDialogCancel>
                                <AlertDialogAction 
                                  className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
                                  onClick={() => handleDelete(modo.id)}
                                  disabled={isDeleting && deletingModoId === modo.id}
                                >
                                  {isDeleting && deletingModoId === modo.id ? (
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