/**
 * Funcionalidades:
 * - Listar todas las marcas
 * - Filtrar marcas por nombre o descripción
 * - Crear nueva marca
 * - Ver detalles de una marca
 * - Editar una marca
 * - Eliminar una marca (si no tiene productos asociados)
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Plus, 
  Search, 
  PenSquare, 
  Trash2, 
  Eye, 
  CheckCircle, 
  XCircle 
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/Spinner";

// Tipos
interface Marca {
  id: number;
  nombre: string;
  descripcion: string;
  imagenUrl: string | null;
  logoUrl: string | null;
  esMarcaBlanca: boolean;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    productos: number;
    supermercados: number;
  };
}

interface MarcaInput {
  nombre: string;
  descripcion: string;
  imagenUrl: string | null;
  esMarcaBlanca: boolean;
  activo: boolean;
}

export default function MarcasPage() {
  const router = useRouter();
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [filteredMarcas, setFilteredMarcas] = useState<Marca[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [selectedMarcaId, setSelectedMarcaId] = useState<number | null>(null);
  const [newMarcaInput, setNewMarcaInput] = useState<MarcaInput>({
    nombre: "",
    descripcion: "",
    imagenUrl: null,
    esMarcaBlanca: false,
    activo: true
  });
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Fetch marcas
  const fetchMarcas = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/admin/marcas");
      
      const marcasData = response.data.map((marca: any) => ({
        ...marca,
        imagenUrl: marca.imagenUrl || marca.logoUrl, // Handle both field names
        createdAt: new Date(marca.createdAt),
        updatedAt: new Date(marca.updatedAt)
      }));
      
      setMarcas(marcasData);
      setFilteredMarcas(marcasData);
    } catch (error) {
      console.error("Error fetching marcas:", error);
      toast.error("Error al cargar las marcas");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMarcas();
  }, []);

  // Filter marcas based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredMarcas(marcas);
      return;
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = marcas.filter(marca => 
      marca.nombre.toLowerCase().includes(lowerCaseSearchTerm) || 
      marca.descripcion.toLowerCase().includes(lowerCaseSearchTerm)
    );
    
    setFilteredMarcas(filtered);
  }, [searchTerm, marcas]);

  // Handle input changes for new marca
  const handleNewMarcaInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewMarcaInput(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle switch change for marca blanca status
  const handleMarcaBlancaChange = (checked: boolean) => {
    setNewMarcaInput(prev => ({
      ...prev,
      esMarcaBlanca: checked
    }));
  };

  // Handle switch change for active status
  const handleActivoChange = (checked: boolean) => {
    setNewMarcaInput(prev => ({
      ...prev,
      activo: checked
    }));
  };

  // Create new marca
  const handleCreateMarca = async () => {
    // Validate required fields
    if (!newMarcaInput.nombre.trim()) {
      toast.error("El nombre de la marca es obligatorio");
      return;
    }

    try {
      setIsSaving(true);
      await axios.post("/api/admin/marcas", newMarcaInput);
      
      toast.success("Marca creada correctamente");
      setOpenCreateDialog(false);
      setNewMarcaInput({
        nombre: "",
        descripcion: "",
        imagenUrl: null,
        esMarcaBlanca: false,
        activo: true
      });
      fetchMarcas();
    } catch (error) {
      console.error("Error creating marca:", error);
      toast.error("Error al crear la marca");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete marca
  const handleDeleteMarca = async () => {
    if (!selectedMarcaId) return;

    try {
      setIsSaving(true);
      await axios.delete(`/api/admin/marcas/${selectedMarcaId}`);
      
      toast.success("Marca eliminada correctamente");
      setOpenDeleteDialog(false);
      fetchMarcas();
    } catch (error: any) {
      console.error("Error deleting marca:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error al eliminar la marca");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Go to marca detail page
  const goToMarcaDetail = (marcaId: number) => {
    router.push(`/gestionar/marcas/${marcaId}`);
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold">Gestión de Marcas</CardTitle>
              <CardDescription>
                Administra las marcas de productos disponibles en la plataforma
              </CardDescription>
            </div>
            <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Marca
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear Nueva Marca</DialogTitle>
                  <DialogDescription>
                    Rellena los campos para crear una nueva marca
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre *</Label>
                    <Input
                      id="nombre"
                      name="nombre"
                      value={newMarcaInput.nombre}
                      onChange={handleNewMarcaInputChange}
                      placeholder="Nombre de la marca"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Textarea
                      id="descripcion"
                      name="descripcion"
                      value={newMarcaInput.descripcion}
                      onChange={handleNewMarcaInputChange}
                      placeholder="Descripción de la marca"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="imagenUrl">URL de la Imagen</Label>
                    <Input
                      id="imagenUrl"
                      name="imagenUrl"
                      value={newMarcaInput.imagenUrl || ''}
                      onChange={handleNewMarcaInputChange}
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="esMarcaBlanca"
                      checked={newMarcaInput.esMarcaBlanca}
                      onCheckedChange={handleMarcaBlancaChange}
                    />
                    <Label htmlFor="esMarcaBlanca">Marca Blanca</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="activo"
                      checked={newMarcaInput.activo}
                      onCheckedChange={handleActivoChange}
                    />
                    <Label htmlFor="activo">Marca Activa</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpenCreateDialog(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateMarca} disabled={isSaving}>
                    {isSaving ? <Spinner size="sm" /> : "Crear Marca"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar marca por nombre o descripción..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : filteredMarcas.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Marca</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Productos</TableHead>
                  <TableHead>Supermercados</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMarcas.map((marca) => (
                  <TableRow key={marca.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {marca.imagenUrl && (
                          <Image
                            src={marca.imagenUrl}
                            alt={marca.nombre}
                            width={32}
                            height={32}
                            className="rounded-sm object-contain"
                          />
                        )}
                        {marca.nombre}
                        {marca.esMarcaBlanca && (
                          <Badge variant="outline" className="ml-1">Marca Blanca</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate">
                      {marca.descripcion}
                    </TableCell>
                    <TableCell>
                      <Badge variant={marca.activo ? "default" : "secondary"}>
                        {marca.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell>{marca._count.productos}</TableCell>
                    <TableCell>{marca._count.supermercados || 0}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => goToMarcaDetail(marca.id)}
                          title="Ver detalles"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => goToMarcaDetail(marca.id)}
                          title="Editar"
                        >
                          <PenSquare className="h-4 w-4" />
                        </Button>
                        <AlertDialog
                          open={openDeleteDialog && selectedMarcaId === marca.id}
                          onOpenChange={(isOpen) => {
                            setOpenDeleteDialog(isOpen);
                            if (!isOpen) setSelectedMarcaId(null);
                          }}
                        >
                          <AlertDialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="destructive"
                              onClick={() => setSelectedMarcaId(marca.id)}
                              disabled={marca._count.productos > 0}
                              title={marca._count.productos > 0 ? "No se puede eliminar una marca con productos asociados" : ""}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción eliminará permanentemente la marca <strong>{marca.nombre}</strong> y no se puede deshacer.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleDeleteMarca}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                {isSaving ? <Spinner size="sm" /> : "Eliminar"}
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
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">
                {searchTerm ? "No se encontraron marcas con esos criterios de búsqueda." : "No hay marcas disponibles."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}