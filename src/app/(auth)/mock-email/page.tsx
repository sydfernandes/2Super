"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { LucideMailCheck } from "lucide-react"
import { useRouter } from "next/navigation"

export default function MockEmailPage() {
  const [email, setEmail] = useState("")
  const router = useRouter()
  
  // Función para generar un token simulado basado en el email
  const generateMockToken = (email: string) => {
    // En producción, este token sería generado en el servidor y almacenado/verificado
    // Este es solo para demostración
    const timestamp = Date.now()
    return Buffer.from(`${email}:${timestamp}`).toString('base64')
  }

  const handleSendLink = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    router.push(`/mock-email/sent?email=${encodeURIComponent(email)}`)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Enviar enlace de acceso</CardTitle>
        <CardDescription>
          Ingresa tu correo electrónico para recibir un enlace de acceso
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSendLink}>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Input 
                id="email" 
                placeholder="correo@ejemplo.com" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">Enviar enlace de acceso</Button>
        </CardFooter>
      </form>
    </Card>
  )
}
