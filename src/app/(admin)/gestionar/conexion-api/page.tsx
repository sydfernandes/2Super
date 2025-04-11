"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react"

type ApiStatusType = "loading" | "online" | "offline"

interface ApiMethodStatus {
  method: string
  status: ApiStatusType
  lastChecked: string
}

interface ApiStatus {
  name: string
  path: string
  methods: ApiMethodStatus[]
}

const ConexionApiPage = () => {
  const [apiStatuses, setApiStatuses] = useState<ApiStatus[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const apis = [
    { 
      name: "Supermercados", 
      path: "/api/supermercados",
      methods: ["GET", "POST"]
    },
    { 
      name: "Supermercado Detalle", 
      path: "/api/supermercados/[id]",
      methods: ["GET", "PUT", "DELETE"]
    },
    { 
      name: "Productos", 
      path: "/api/productos",
      methods: ["GET", "POST"]
    },
    { 
      name: "Producto Detalle", 
      path: "/api/productos/[id]",
      methods: ["GET", "PUT", "DELETE"]
    },
    { 
      name: "Categorías", 
      path: "/api/categorias",
      methods: ["GET", "POST"]
    },
    { 
      name: "Categoría Detalle", 
      path: "/api/categorias/[id]",
      methods: ["GET", "PUT", "DELETE"]
    },
    { 
      name: "Tipos de Producto", 
      path: "/api/tipos-producto",
      methods: ["GET", "POST"]
    },
    { 
      name: "Tipo de Producto Detalle", 
      path: "/api/tipos-producto/[id]",
      methods: ["GET", "PUT", "DELETE"]
    },
    { 
      name: "Marcas", 
      path: "/api/marcas",
      methods: ["GET", "POST"]
    },
    { 
      name: "Marca Detalle", 
      path: "/api/marcas/[id]",
      methods: ["GET", "PUT", "DELETE"]
    },
    { 
      name: "Etiquetas", 
      path: "/api/etiquetas",
      methods: ["GET", "POST"]
    },
    { 
      name: "Etiqueta Detalle", 
      path: "/api/etiquetas/[id]",
      methods: ["GET", "PUT", "DELETE"]
    },
    { 
      name: "Unidades de Medida", 
      path: "/api/unidades-medida",
      methods: ["GET", "POST"]
    },
    { 
      name: "Unidad de Medida Detalle", 
      path: "/api/unidades-medida/[id]",
      methods: ["GET", "PUT", "DELETE"]
    },
    { 
      name: "Métodos de Obtención", 
      path: "/api/metodos-obtencion",
      methods: ["GET", "POST"]
    },
    { 
      name: "Método de Obtención Detalle", 
      path: "/api/metodos-obtencion/[id]",
      methods: ["GET", "PUT", "DELETE"]
    },
    { 
      name: "Sexos y Géneros", 
      path: "/api/sexos-genero",
      methods: ["GET", "POST"]
    },
    { 
      name: "Sexo y Género Detalle", 
      path: "/api/sexos-genero/[id]",
      methods: ["GET", "PUT", "DELETE"]
    },
    { 
      name: "Niveles de Privacidad", 
      path: "/api/niveles-privacidad",
      methods: ["GET", "POST"]
    },
    { 
      name: "Nivel de Privacidad Detalle", 
      path: "/api/niveles-privacidad/[id]",
      methods: ["GET", "PUT", "DELETE"]
    },
    { 
      name: "Tipos de Mascota", 
      path: "/api/tipos-mascota",
      methods: ["GET", "POST"]
    },
    { 
      name: "Tipo de Mascota Detalle", 
      path: "/api/tipos-mascota/[id]",
      methods: ["GET", "PUT", "DELETE"]
    },
    { 
      name: "Modos de Lista", 
      path: "/api/modos-lista",
      methods: ["GET", "POST"]
    },
    { 
      name: "Modo de Lista Detalle", 
      path: "/api/modos-lista/[id]",
      methods: ["GET", "PUT", "DELETE"]
    },
    { 
      name: "Tipos de Usuario", 
      path: "/api/tipos-usuario",
      methods: ["GET", "POST"]
    },
    { 
      name: "Tipo de Usuario Detalle", 
      path: "/api/tipos-usuario/[id]",
      methods: ["GET", "PUT", "DELETE"]
    }
  ]

  const checkApiMethod = async (api: { name: string; path: string }, method: string): Promise<ApiMethodStatus> => {
    try {
      const response = await fetch(api.path, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: method !== "GET" ? JSON.stringify({}) : undefined,
      })
      
      return {
        method,
        status: response.ok ? "online" : "offline",
        lastChecked: new Date().toLocaleTimeString(),
      }
    } catch (error) {
      return {
        method,
        status: "offline",
        lastChecked: new Date().toLocaleTimeString(),
      }
    }
  }

  const checkApiStatus = async (api: { name: string; path: string; methods: string[] }): Promise<ApiStatus> => {
    const methodStatuses = await Promise.all(
      api.methods.map(method => checkApiMethod(api, method))
    )

    return {
      name: api.name,
      path: api.path,
      methods: methodStatuses,
    }
  }

  useEffect(() => {
    const checkAllApis = async () => {
      setIsLoading(true)
      const initialStatuses: ApiStatus[] = apis.map(api => ({
        name: api.name,
        path: api.path,
        methods: api.methods.map(method => ({
          method,
          status: "loading",
          lastChecked: new Date().toLocaleTimeString(),
        })),
      }))
      setApiStatuses(initialStatuses)

      const statusPromises = apis.map(api => checkApiStatus(api))
      const results = await Promise.all(statusPromises)
      setApiStatuses(results)
      setIsLoading(false)
    }

    checkAllApis()
    const interval = setInterval(checkAllApis, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const getStatusBadge = (status: ApiStatusType) => {
    switch (status) {
      case "online":
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Online
          </Badge>
        )
      case "offline":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Offline
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            Cargando
          </Badge>
        )
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Estado de las APIs</h1>
        <p className="text-muted-foreground">
          Verifica el estado de todas las APIs del sistema
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {apiStatuses.map((api) => (
          <Card key={api.path}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{api.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <p className="mb-2">Ruta: {api.path}</p>
                <div className="space-y-2">
                  {api.methods.map((methodStatus) => (
                    <div key={methodStatus.method} className="flex items-center justify-between">
                      <span className="font-mono">{methodStatus.method}</span>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(methodStatus.status)}
                        <span className="text-xs text-muted-foreground">
                          {methodStatus.lastChecked}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ConexionApiPage
