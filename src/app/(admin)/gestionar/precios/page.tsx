"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Search,
  Filter,
  ArrowUpDown
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"
import { FormDescription } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Define the form schema
const precioSchema = z.object({
  supermercadoId: z.number().int().positive(),
  precioActual: z.number().positive(),
  metodoObtencionId: z.number().int().positive(),
  esOferta: z.boolean(),
  precioPromocional: z.number().positive().nullable().optional(),
  fechaInicioPromocion: z.string().nullable().optional(),
  fechaFinPromocion: z.string().nullable().optional(),
})

// Define the form values type
type PrecioFormValues = z.infer<typeof precioSchema>

export default function PreciosPage() {
  const router = useRouter()
  const [precios, setPrecios] = useState<{
    id: number
    producto: { id: number; nombre: string }
    supermercado: { id: number; nombre: string }
    precioActual: number
    metodoObtencion: { id: number; nombre: string }
    fechaActualizacion: string
    esOferta: boolean
    precioPromocional: number | null
    fechaInicioPromocion: string | null
    fechaFinPromocion: string | null
  }[]>([])
  const [productos, setProductos] = useState<{id: number, nombre: string}[]>([])
  const [supermercados, setSupermercados] = useState<{id: number, nombre: string}[]>([])
  const [metodosObtencion, setMetodosObtencion] = useState<{id: number, nombre: string}[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPrecio, setEditingPrecio] = useState<typeof precios[0] | null>(null)

  const form = useForm<PrecioFormValues>({
    resolver: zodResolver(precioSchema),
    defaultValues: {
      supermercadoId: 0,
      precioActual: 0,
      metodoObtencionId: 0,
      esOferta: false,
      precioPromocional: null,
      fechaInicioPromocion: null,
      fechaFinPromocion: null,
    },
  })

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [preciosRes, productosRes, supermercadosRes, metodosRes] = await Promise.all([
          fetch("/api/admin/precios"),
          fetch("/api/admin/productos"),
          fetch("/api/admin/supermercados"),
          fetch("/api/admin/metodos-obtencion"),
        ])

        const [preciosData, productosData, supermercadosData, metodosData] = await Promise.all([
          preciosRes.json(),
          productosRes.json(),
          supermercadosRes.json(),
          metodosRes.json(),
        ])

        setPrecios(preciosData)
        setProductos(productosData)
        setSupermercados(supermercadosData)
        setMetodosObtencion(metodosData)
      } catch (error) {
        console.error("Error al cargar datos:", error)
        toast.error("Error al cargar los datos")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Manejar envío del formulario
  const onSubmit = async (data: PrecioFormValues) => {
    try {
      const response = await fetch('/api/admin/precios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Error al crear el precio')
      }

      toast.success('Precio creado exitosamente')
      form.reset()
      router.refresh()
    } catch (error) {
      toast.error('Error al crear el precio')
    }
  }

  // Manejar eliminación
  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este precio?")) return

    try {
      const response = await fetch(`/api/admin/precios/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Error al eliminar el precio")
      }

      setPrecios(precios.filter(p => p.id !== id))
      toast.success("Precio eliminado")
    } catch (error) {
      console.error("Error:", error)
      toast.error("Error al eliminar el precio")
    }
  }

  // Abrir diálogo de edición
  const handleEdit = (precio: typeof precios[0]) => {
    setEditingPrecio(precio)
    form.reset({
      supermercadoId: precio.supermercado.id,
      precioActual: precio.precioActual,
      metodoObtencionId: precio.metodoObtencion.id,
      esOferta: precio.esOferta,
      precioPromocional: precio.precioPromocional,
      fechaInicioPromocion: precio.fechaInicioPromocion,
      fechaFinPromocion: precio.fechaFinPromocion,
    })
    setIsDialogOpen(true)
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Gestionar Precios</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="supermercadoId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supermercado</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un supermercado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {supermercados.map((supermercado) => (
                            <SelectItem key={supermercado.id} value={supermercado.id.toString()}>
                              {supermercado.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="precioActual"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio Actual</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="metodoObtencionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Método de Obtención</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un método" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {metodosObtencion.map((metodo) => (
                            <SelectItem key={metodo.id} value={metodo.id.toString()}>
                              {metodo.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="esOferta"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Es Oferta</FormLabel>
                        <FormDescription>
                          Marca esta casilla si el precio es una oferta
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {form.watch("esOferta") && (
                  <>
                    <FormField
                      control={form.control}
                      name="precioPromocional"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Precio Promocional</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fechaInicioPromocion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fecha Inicio Promoción</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fechaFinPromocion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fecha Fin Promoción</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>

              <Button type="submit">Guardar Precio</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
