//Página de gestión de géneros (sexo de usuarios)
//Funcionalidades:
// - Listar todos los géneros existentes
// - Crear nuevos géneros
// - Editar géneros existentes
// - Eliminar géneros no utilizados
// - Filtrar géneros por valor o descripción
// - Mostrar el número de usuarios asociados a cada género

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  PlusCircle, 
  Search, 
  Users, 
  Pencil, 
  Trash2, 
  Loader2,
  User,
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

// Tipo para Géneros
type SexoGenero = {
  id: number;
  valor: string;
  descripcion: string;
  _count?: {
    usuarios: number;
    miembrosHogar: number;
  };
}

export default function GenerosPage() {
  const router = useRouter();
  const [generos, setGeneros] = useState<SexoGenero[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [newGenero, setNewGenero] = useState<{valor: string; descripcion: string}>({
    valor: "",
    descripcion: ""
  });
  const [editingGenero, setEditingGenero] = useState<SexoGenero | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingGeneroId, setDeletingGeneroId] = useState<number | null>(null);
  
  // Cargar géneros
  const fetchGeneros = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/generos');
      const data = await response.json();
      
      if (data.success) {
        setGeneros(data.data);
      } else {
        toast.error("Error al cargar los géneros: " + data.message);
      }
    } catch (error) {
      console.error("Error al cargar los géneros:", error);
      toast.error("Error al cargar los géneros");
    } finally {
      setLoading(false);
    }
  };
  
  // Cargar datos al inicio
  useEffect(() => {
    fetchGeneros();
  }, []);
  
  // Validar formulario
  useEffect(() => {
    if (editingGenero) {
      setIsFormValid(
        editingGenero.valor.trim().length >= 2 && 
        editingGenero.descripcion.trim().length >= 3
      );
    } else {
      setIsFormValid(
        newGenero.valor.trim().length >= 2 && 
        newGenero.descripcion.trim().length >= 3
      );
    }
  }, [newGenero, editingGenero]);
  
  // Filtrar géneros por término de búsqueda
  const filteredGeneros = generos.filter(genero => 
    genero.valor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    genero.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Crear nuevo género
  const handleCreate = async () => {
    if (!isFormValid) return;
    
    setIsCreating(true);
    try {
      const response = await fetch('/api/admin/generos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGenero),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Género creado correctamente");
        fetchGeneros();
        setNewGenero({ valor: "", descripcion: "" });
      } else {
        toast.error("Error al crear género: " + data.message);
      }
    } catch (error) {
      console.error("Error al crear género:", error);
      toast.error("Error al crear género");
    } finally {
      setIsCreating(false);
    }
  };
  
  // Actualizar género
  const handleUpdate = async () => {
    if (!editingGenero || !isFormValid) return;
    
    setIsEditing(true);
    try {
      const response = await fetch(`/api/admin/generos/${editingGenero.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          valor: editingGenero.valor,
          descripcion: editingGenero.descripcion
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Género actualizado correctamente");
        fetchGeneros();
        setEditingGenero(null);
      } else {
        toast.error("Error al actualizar género: " + data.message);
      }
    } catch (error) {
      console.error("Error al actualizar género:", error);
      toast.error("Error al actualizar género");
    } finally {
      setIsEditing(false);
    }
  };
  
  // Eliminar género
  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    setDeletingGeneroId(id);
    try {
      const response = await fetch(`/api/admin/generos/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Género eliminado correctamente");
        fetchGeneros();
      } else {
        toast.error("Error al eliminar género: " + data.message);
      }
    } catch (error) {
      console.error("Error al eliminar género:", error);
      toast.error("Error al eliminar género");
    } finally {
      setIsDeleting(false);
      setDeletingGeneroId(null);
    }
  };

  // Calcular total de usuarios asociados (usuarios + miembros del hogar)
  const getTotalAsociados = (genero: SexoGenero) => {
    const usuariosCount = genero._count?.usuarios || 0;
    const miembrosCount = genero._count?.miembrosHogar || 0;
    return usuariosCount + miembrosCount;
  };
  
  return (
    <div className="max-w-5xl mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Géneros</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Nuevo Género
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nuevo Género</DialogTitle>
                <DialogDescription>
                  Añade un nuevo género para clasificar usuarios. Rellena todos los campos.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="new-valor">Identificador</Label>
                  <Input 
                    id="new-valor" 
                    value={newGenero.valor} 
                    onChange={e => setNewGenero({...newGenero, valor: e.target.value})}
                    placeholder="p.ej. masculino, femenino, otro"
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
                    value={newGenero.descripcion} 
                    onChange={e => setNewGenero({...newGenero, descripcion: e.target.value})}
                    placeholder="p.ej. Masculino"
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
                      Crear Género
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
          <CardTitle>Géneros</CardTitle>
          <CardDescription>
            Administra los géneros disponibles para usuarios y miembros del hogar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar géneros..."
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
                    <TableHead>Usuarios asociados</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGeneros.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        {searchTerm ? "No se encontraron resultados" : "No hay géneros definidos"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredGeneros.map(genero => (
                      <TableRow key={genero.id}>
                        <TableCell>{genero.id}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {genero.valor}
                          </Badge>
                        </TableCell>
                        <TableCell>{genero.descripcion}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="flex items-center w-fit gap-1">
                            <Users className="h-3 w-3" />
                            {getTotalAsociados(genero)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="icon" onClick={() => setEditingGenero(genero)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Editar Género</DialogTitle>
                                <DialogDescription>
                                  Modifica los datos del género.
                                </DialogDescription>
                              </DialogHeader>
                              {editingGenero && (
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-valor">Identificador</Label>
                                    <Input 
                                      id="edit-valor" 
                                      value={editingGenero.valor} 
                                      onChange={e => setEditingGenero({...editingGenero, valor: e.target.value})}
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
                                      value={editingGenero.descripcion} 
                                      onChange={e => setEditingGenero({...editingGenero, descripcion: e.target.value})}
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
                                disabled={getTotalAsociados(genero) > 0}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Eliminar género?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. Esto eliminará permanentemente el género 
                                  "{genero.descripcion}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="flex items-center gap-2">
                                  <X className="h-4 w-4" />
                                  Cancelar
                                </AlertDialogCancel>
                                <AlertDialogAction 
                                  className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
                                  onClick={() => handleDelete(genero.id)}
                                  disabled={isDeleting && deletingGeneroId === genero.id}
                                >
                                  {isDeleting && deletingGeneroId === genero.id ? (
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
