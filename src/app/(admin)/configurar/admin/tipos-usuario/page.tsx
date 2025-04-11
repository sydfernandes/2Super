//Página de gestión de tipos de usuario
//Funcionalidades:
// - Listar todos los tipos de usuario existentes
// - Crear nuevos tipos de usuario 
// - Editar tipos de usuario existentes
// - Eliminar tipos de usuario no utilizados
// - Ver detalles de tipos de usuario

"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PlusCircle, Pencil, Trash2, Search, Loader2, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

// Componentes UI
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Label } from "@/components/ui/label"
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

// Tipos
type TipoUsuario = {
  id: number;
  valor: string;
  descripcion: string;
};

export default function TiposUsuarioPage() {
  const router = useRouter();
  const [tiposUsuario, setTiposUsuario] = useState<TipoUsuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [newTipoUsuario, setNewTipoUsuario] = useState<{valor: string; descripcion: string}>({
    valor: "",
    descripcion: ""
  });
  const [editingTipoUsuario, setEditingTipoUsuario] = useState<TipoUsuario | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Cargar tipos de usuario
  const fetchTiposUsuario = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/tipos-usuario');
      const data = await response.json();
      
      if (data.success) {
        setTiposUsuario(data.data);
      } else {
        toast.error("Error al cargar los tipos de usuario: " + data.message);
      }
    } catch (error) {
      console.error("Error al cargar los tipos de usuario:", error);
      toast.error("Error al cargar los tipos de usuario");
    } finally {
      setLoading(false);
    }
  };
  
  // Cargar datos al inicio
  useEffect(() => {
    fetchTiposUsuario();
  }, []);
  
  // Validar formulario
  useEffect(() => {
    if (editingTipoUsuario) {
      setIsFormValid(
        editingTipoUsuario.valor.trim().length >= 2 && 
        editingTipoUsuario.descripcion.trim().length >= 3
      );
    } else {
      setIsFormValid(
        newTipoUsuario.valor.trim().length >= 2 && 
        newTipoUsuario.descripcion.trim().length >= 3
      );
    }
  }, [newTipoUsuario, editingTipoUsuario]);
  
  // Filtrar tipos de usuario por término de búsqueda
  const filteredTiposUsuario = tiposUsuario.filter(tipo => 
    tipo.valor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tipo.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Crear nuevo tipo de usuario
  const handleCreate = async () => {
    if (!isFormValid) return;
    
    setIsCreating(true);
    try {
      const response = await fetch('/api/admin/tipos-usuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTipoUsuario),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Tipo de usuario creado correctamente");
        fetchTiposUsuario();
        setNewTipoUsuario({ valor: "", descripcion: "" });
      } else {
        toast.error("Error al crear tipo de usuario: " + data.message);
      }
    } catch (error) {
      console.error("Error al crear tipo de usuario:", error);
      toast.error("Error al crear tipo de usuario");
    } finally {
      setIsCreating(false);
    }
  };
  
  // Actualizar tipo de usuario
  const handleUpdate = async () => {
    if (!editingTipoUsuario || !isFormValid) return;
    
    setIsEditing(true);
    try {
      const response = await fetch(`/api/admin/tipos-usuario/${editingTipoUsuario.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          valor: editingTipoUsuario.valor,
          descripcion: editingTipoUsuario.descripcion
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Tipo de usuario actualizado correctamente");
        fetchTiposUsuario();
        setEditingTipoUsuario(null);
      } else {
        toast.error("Error al actualizar tipo de usuario: " + data.message);
      }
    } catch (error) {
      console.error("Error al actualizar tipo de usuario:", error);
      toast.error("Error al actualizar tipo de usuario");
    } finally {
      setIsEditing(false);
    }
  };
  
  // Eliminar tipo de usuario
  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/tipos-usuario/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Tipo de usuario eliminado correctamente");
        fetchTiposUsuario();
      } else {
        toast.error("Error al eliminar tipo de usuario: " + data.message);
      }
    } catch (error) {
      console.error("Error al eliminar tipo de usuario:", error);
      toast.error("Error al eliminar tipo de usuario");
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <div className="max-w-5xl mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tipos de Usuario</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            asChild
          >
            <Link href="/configurar/admin">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Link>
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
                <DialogTitle>Crear Nuevo Tipo de Usuario</DialogTitle>
                <DialogDescription>
                  Añade un nuevo tipo de usuario al sistema. Rellena todos los campos.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="new-valor">Identificador</Label>
                  <Input 
                    id="new-valor" 
                    value={newTipoUsuario.valor} 
                    onChange={e => setNewTipoUsuario({...newTipoUsuario, valor: e.target.value})}
                    placeholder="p.ej. admin, editor, usuario_standard"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-descripcion">Descripción</Label>
                  <Input 
                    id="new-descripcion" 
                    value={newTipoUsuario.descripcion} 
                    onChange={e => setNewTipoUsuario({...newTipoUsuario, descripcion: e.target.value})}
                    placeholder="p.ej. Administrador del sistema"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
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
                  ) : "Crear Tipo"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Tipos de Usuario</CardTitle>
          <CardDescription>Administra los diferentes niveles de acceso y permisos en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar tipos de usuario..."
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
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTiposUsuario.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        {searchTerm ? "No se encontraron resultados" : "No hay tipos de usuario definidos"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTiposUsuario.map(tipo => (
                      <TableRow key={tipo.id}>
                        <TableCell>{tipo.id}</TableCell>
                        <TableCell>{tipo.valor}</TableCell>
                        <TableCell>{tipo.descripcion}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="icon" onClick={() => setEditingTipoUsuario(tipo)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Editar Tipo de Usuario</DialogTitle>
                                <DialogDescription>
                                  Modifica los datos del tipo de usuario.
                                </DialogDescription>
                              </DialogHeader>
                              {editingTipoUsuario && (
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-valor">Identificador</Label>
                                    <Input 
                                      id="edit-valor" 
                                      value={editingTipoUsuario.valor} 
                                      onChange={e => setEditingTipoUsuario({...editingTipoUsuario, valor: e.target.value})}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-descripcion">Descripción</Label>
                                    <Input 
                                      id="edit-descripcion" 
                                      value={editingTipoUsuario.descripcion} 
                                      onChange={e => setEditingTipoUsuario({...editingTipoUsuario, descripcion: e.target.value})}
                                    />
                                  </div>
                                </div>
                              )}
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button variant="outline">Cancelar</Button>
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
                                  ) : "Guardar Cambios"}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="icon" className="text-red-500 dark:text-red-400">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Eliminar tipo de usuario?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. Esto eliminará permanentemente el tipo de usuario 
                                  "{tipo.descripcion}" y podría afectar a los usuarios que lo tengan asignado.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction 
                                  className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
                                  onClick={() => handleDelete(tipo.id)}
                                  disabled={isDeleting}
                                >
                                  {isDeleting ? (
                                    <>
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                      Eliminando...
                                    </>
                                  ) : "Eliminar"}
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