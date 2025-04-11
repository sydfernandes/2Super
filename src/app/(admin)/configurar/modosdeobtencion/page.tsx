//Página de gestión de métodos de obtención de datos
//Funcionalidades:
// - Listar todos los métodos de obtención existentes
// - Crear nuevos métodos de obtención
// - Editar métodos existentes
// - Eliminar métodos no utilizados
// - Filtrar métodos por valor o descripción
// - Mostrar el número de supermercados, precios e historial de precios asociados a cada método

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  PlusCircle, 
  Search, 
  Database, 
  Pencil, 
  Trash2, 
  Loader2,
  Store,
  Tag,
  History,
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
import { Textarea } from "@/components/ui/textarea"

// Tipo para Métodos de Obtención
type MetodoObtencion = {
  id: number;
  valor: string;
  descripcion: string;
  usoTipico?: string | null;
  _count?: {
    supermercados: number;
    precios: number;
    historialPrecios: number;
  };
}

export default function MetodosObtencionPage() {
  const router = useRouter();
  const [metodos, setMetodos] = useState<MetodoObtencion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMetodo, setNewMetodo] = useState<{valor: string; descripcion: string; usoTipico?: string}>({
    valor: "",
    descripcion: "",
    usoTipico: ""
  });
  const [editingMetodo, setEditingMetodo] = useState<MetodoObtencion | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingMetodoId, setDeletingMetodoId] = useState<number | null>(null);
  
  // Cargar métodos de obtención
  const fetchMetodos = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/metodosobtencion');
      const data = await response.json();
      
      if (data.success) {
        setMetodos(data.data);
      } else {
        toast.error("Error al cargar los métodos de obtención: " + data.message);
      }
    } catch (error) {
      console.error("Error al cargar los métodos de obtención:", error);
      toast.error("Error al cargar los métodos de obtención");
    } finally {
      setLoading(false);
    }
  };
  
  // Cargar datos al inicio
  useEffect(() => {
    fetchMetodos();
  }, []);
  
  // Validar formulario
  useEffect(() => {
    if (editingMetodo) {
      setIsFormValid(
        editingMetodo.valor.trim().length >= 2 && 
        editingMetodo.descripcion.trim().length >= 3
      );
    } else {
      setIsFormValid(
        newMetodo.valor.trim().length >= 2 && 
        newMetodo.descripcion.trim().length >= 3
      );
    }
  }, [newMetodo, editingMetodo]);
  
  // Filtrar métodos por término de búsqueda
  const filteredMetodos = metodos.filter(metodo => 
    metodo.valor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    metodo.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (metodo.usoTipico && metodo.usoTipico.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Crear nuevo método de obtención
  const handleCreate = async () => {
    if (!isFormValid) return;
    
    setIsCreating(true);
    try {
      const response = await fetch('/api/admin/metodosobtencion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMetodo),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Método de obtención creado correctamente");
        fetchMetodos();
        setNewMetodo({ valor: "", descripcion: "", usoTipico: "" });
      } else {
        toast.error("Error al crear método de obtención: " + data.message);
      }
    } catch (error) {
      console.error("Error al crear método de obtención:", error);
      toast.error("Error al crear método de obtención");
    } finally {
      setIsCreating(false);
    }
  };
  
  // Actualizar método de obtención
  const handleUpdate = async () => {
    if (!editingMetodo || !isFormValid) return;
    
    setIsEditing(true);
    try {
      const response = await fetch(`/api/admin/metodosobtencion/${editingMetodo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          valor: editingMetodo.valor,
          descripcion: editingMetodo.descripcion,
          usoTipico: editingMetodo.usoTipico || ""
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Método de obtención actualizado correctamente");
        fetchMetodos();
        setEditingMetodo(null);
      } else {
        toast.error("Error al actualizar método de obtención: " + data.message);
      }
    } catch (error) {
      console.error("Error al actualizar método de obtención:", error);
      toast.error("Error al actualizar método de obtención");
    } finally {
      setIsEditing(false);
    }
  };
  
  // Eliminar método de obtención
  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    setDeletingMetodoId(id);
    try {
      const response = await fetch(`/api/admin/metodosobtencion/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Método de obtención eliminado correctamente");
        fetchMetodos();
      } else {
        toast.error("Error al eliminar método de obtención: " + data.message);
      }
    } catch (error) {
      console.error("Error al eliminar método de obtención:", error);
      toast.error("Error al eliminar método de obtención");
    } finally {
      setIsDeleting(false);
      setDeletingMetodoId(null);
    }
  };

  // Calcular total de usos (supermercados + precios + historial)
  const getTotalUsos = (metodo: MetodoObtencion) => {
    const supermercadosCount = metodo._count?.supermercados || 0;
    const preciosCount = metodo._count?.precios || 0;
    const historialCount = metodo._count?.historialPrecios || 0;
    return supermercadosCount + preciosCount + historialCount;
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
          <h1 className="text-3xl font-bold tracking-tight">Métodos de Obtención</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Nuevo Método
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nuevo Método de Obtención</DialogTitle>
                <DialogDescription>
                  Añade un nuevo método para obtener datos de productos. Rellena todos los campos.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="new-valor">Identificador</Label>
                  <Input 
                    id="new-valor" 
                    value={newMetodo.valor} 
                    onChange={e => setNewMetodo({...newMetodo, valor: e.target.value})}
                    placeholder="p.ej. scraping, api, manual"
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
                    value={newMetodo.descripcion} 
                    onChange={e => setNewMetodo({...newMetodo, descripcion: e.target.value})}
                    placeholder="p.ej. Extracción automática de datos web"
                    maxLength={100}
                  />
                  <p className="text-xs text-muted-foreground">
                    Descripción detallada del método (máx 100 caracteres)
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-uso-tipico">Uso Típico (opcional)</Label>
                  <Textarea 
                    id="new-uso-tipico" 
                    value={newMetodo.usoTipico || ""} 
                    onChange={e => setNewMetodo({...newMetodo, usoTipico: e.target.value})}
                    placeholder="p.ej. Utilizado para supermercados que no ofrecen API"
                    maxLength={100}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    Descripción del uso típico de este método (máx 100 caracteres)
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
                      Crear Método
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
          <CardTitle>Métodos de Obtención de Datos</CardTitle>
          <CardDescription>
            Administra los diferentes métodos utilizados para obtener datos de productos y precios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar métodos..."
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
                    <TableHead>Uso Típico</TableHead>
                    <TableHead>Usos</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMetodos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        {searchTerm ? "No se encontraron resultados" : "No hay métodos de obtención definidos"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMetodos.map(metodo => (
                      <TableRow key={metodo.id}>
                        <TableCell>{metodo.id}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Database className="h-3 w-3" />
                            {metodo.valor}
                          </Badge>
                        </TableCell>
                        <TableCell>{metodo.descripcion}</TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {metodo.usoTipico || "—"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Badge variant="secondary" className="flex items-center w-fit gap-1">
                              <Store className="h-3 w-3" />
                              {metodo._count?.supermercados || 0}
                            </Badge>
                            <Badge variant="outline" className="flex items-center w-fit gap-1">
                              <Tag className="h-3 w-3" />
                              {metodo._count?.precios || 0}
                            </Badge>
                            <Badge variant="outline" className="flex items-center w-fit gap-1">
                              <History className="h-3 w-3" />
                              {metodo._count?.historialPrecios || 0}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="icon" onClick={() => setEditingMetodo(metodo)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Editar Método de Obtención</DialogTitle>
                                <DialogDescription>
                                  Modifica los datos del método de obtención de datos.
                                </DialogDescription>
                              </DialogHeader>
                              {editingMetodo && (
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-valor">Identificador</Label>
                                    <Input 
                                      id="edit-valor" 
                                      value={editingMetodo.valor} 
                                      onChange={e => setEditingMetodo({...editingMetodo, valor: e.target.value})}
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
                                      value={editingMetodo.descripcion} 
                                      onChange={e => setEditingMetodo({...editingMetodo, descripcion: e.target.value})}
                                      maxLength={100}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                      Descripción detallada del método (máx 100 caracteres)
                                    </p>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-uso-tipico">Uso Típico (opcional)</Label>
                                    <Textarea 
                                      id="edit-uso-tipico" 
                                      value={editingMetodo.usoTipico || ""} 
                                      onChange={e => setEditingMetodo({...editingMetodo, usoTipico: e.target.value})}
                                      maxLength={100}
                                      rows={3}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                      Descripción del uso típico de este método (máx 100 caracteres)
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
                                disabled={getTotalUsos(metodo) > 0}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Eliminar método de obtención?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. Esto eliminará permanentemente el método 
                                  "{metodo.descripcion}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="flex items-center gap-2">
                                  <X className="h-4 w-4" />
                                  Cancelar
                                </AlertDialogCancel>
                                <AlertDialogAction 
                                  className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
                                  onClick={() => handleDelete(metodo.id)}
                                  disabled={isDeleting && deletingMetodoId === metodo.id}
                                >
                                  {isDeleting && deletingMetodoId === metodo.id ? (
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