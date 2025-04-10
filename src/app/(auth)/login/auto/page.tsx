"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle } from "lucide-react"

export default function AutoLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying")
  const [message, setMessage] = useState("")
  
  useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("No se ha proporcionado un token de acceso válido.")
      return
    }
    
    // En un sistema real, verificaríamos este token con el backend
    // Para este demo, decodificamos el token simulado y verificamos
    try {
      const decoded = Buffer.from(token, 'base64').toString()
      const [email, timestamp] = decoded.split(":")
      const tokenDate = new Date(parseInt(timestamp))
      const now = new Date()
      
      // Verificar si el token tiene menos de 24 horas
      const tokenAgeMs = now.getTime() - tokenDate.getTime()
      const tokenAgeHours = tokenAgeMs / (1000 * 60 * 60)
      
      if (tokenAgeHours > 24) {
        setStatus("error")
        setMessage("El enlace de acceso ha expirado. Por favor solicita uno nuevo.")
        return
      }
      
      // Realizar la redirección basada en el email
      setStatus("success")
      
      setTimeout(() => {
        if (email === "admin@mail.com") {
          router.push("/admin/dashboard")
        } else {
          router.push("/app/home")
        }
      }, 2000) // Pequeña demora para mostrar el mensaje de éxito
      
    } catch (error) {
      setStatus("error")
      setMessage("El token de acceso es inválido o está mal formado.")
    }
  }, [token, router])
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl text-center">
          {status === "verifying" && "Verificando acceso"}
          {status === "success" && "Acceso verificado"}
          {status === "error" && "Error de verificación"}
        </CardTitle>
        <CardDescription className="text-center">
          {status === "verifying" && "Estamos procesando tu solicitud de acceso..."}
          {status === "success" && "Has iniciado sesión correctamente. Redirigiendo..."}
          {status === "error" && "No podemos verificar tu solicitud de acceso"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        {status === "verifying" && (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Verificando token de acceso...</p>
          </div>
        )}
        
        {status === "success" && (
          <Alert variant="default" className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle>Verificación exitosa</AlertTitle>
            <AlertDescription>
              Hemos verificado tu identidad. Serás redirigido automáticamente.
            </AlertDescription>
          </Alert>
        )}
        
        {status === "error" && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error de verificación</AlertTitle>
            <AlertDescription>
              {message}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
