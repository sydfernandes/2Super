"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { IconPaperBag } from "@tabler/icons-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import confetti from "canvas-confetti"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const router = useRouter()
  
  const handleIconClick = (e: React.MouseEvent) => {
    // Calculate confetti origin from click event
    const origin = {
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight
    }
    
    // Trigger confetti effect with basic settings
    confetti({
      origin,
      particleCount: 75,
      spread: 150,
      startVelocity: 20,
      gravity: 1
    })
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      // En un caso real, aquí iría la lógica de autenticación
      router.push("/home")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-8 px-4">
      <Card className="w-full md:w-[768px] overflow-hidden shadow-lg p-0">
        <div className="flex flex-col md:flex-row">
          {/* Lado izquierdo - Formulario */}
          <div className="md:w-1/2 flex">
            <div className="flex flex-col justify-center p-8 h-full w-full">
              {/* Logo y encabezado */}
              <div className="flex flex-col items-center text-center space-y-2 mb-8">
                <div 
                  className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6 cursor-pointer transition-transform hover:scale-110 relative hover:bg-primary/20 active:scale-95"
                  onClick={handleIconClick}
                >
                  <IconPaperBag className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">Iniciar sesión</h1>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Inicia sesión para gestionar tus listas de compras de manera eficiente
                </p>
              </div>
              
              {/* Formulario de acceso */}
              <form className="space-y-4 mb-8" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="w-full"
                    required
                  />
                </div>
                
                {/* Botón de acceso */}
                <Button type="submit" className="w-full" size="lg">
                  Enviar enlace de acceso
                </Button>
              </form>
              
              {/* Enlace de registro */}
              <div className="text-center text-sm">
                ¿No tienes una cuenta?{" "}
                <Link href="/register" className="text-primary font-medium hover:underline">
                  Crear cuenta
                </Link>
              </div>
            </div>
          </div>
          
          {/* Lado derecho - Imagen de borde a borde */}
          <div className="md:w-1/2 h-[300px] md:h-[450px] relative flex items-center justify-center">
            <Image 
              src="/images/auth.jpg"
              alt="Login"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="text-white text-left p-6">
                <h2 className="text-xl font-bold">Organiza tus compras</h2>
                <p className="text-sm opacity-90">La forma más eficiente de planificar tus compras</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      <div className="mt-6 text-center text-xs text-muted-foreground">
        Al continuar, aceptas nuestros{" "}
        <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
          Términos de servicio
        </Link>{" "}
        y{" "}
        <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
          Política de privacidad
        </Link>
      </div>
    </div>
  )
}
