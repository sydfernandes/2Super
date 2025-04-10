"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useSearchParams } from "next/navigation"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MockEmailSentPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  
  // Función para generar un token simulado basado en el email
  const generateMockToken = (email: string) => {
    // En producción, este token sería generado en el servidor y almacenado/verificado
    // Este es solo para demostración
    const timestamp = Date.now()
    return Buffer.from(`${email}:${timestamp}`).toString('base64')
  }
  
  // Genera el token basado en el email
  const token = generateMockToken(email)
  const loginUrl = `/login/auto?token=${token}`

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col items-center">
        <div className="mb-2 rounded-full bg-primary/10 p-3">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl sm:text-2xl">Correo electrónico simulado</CardTitle>
        <CardDescription>
          Esto simula el correo que recibiría el usuario en un entorno de producción
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 border rounded-lg p-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">De: Super Lista &lt;acceso@super-lista.es&gt;</p>
            <p className="text-sm font-medium text-muted-foreground">Para: {email}</p>
            <p className="text-sm font-medium text-muted-foreground">Asunto: Tu enlace de acceso a Super Lista</p>
          </div>
          <div className="border-t pt-4 space-y-4">
            <h3 className="text-lg font-medium">¡Hola!</h3>
            <p>Has solicitado un enlace para acceder a tu cuenta en Super Lista. Usa el botón a continuación para iniciar sesión:</p>
            <div className="flex justify-center py-4">
              <Link href={loginUrl} passHref>
                <Button>Iniciar sesión en Super Lista</Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">Si no solicitaste este enlace, puedes ignorar este correo.</p>
            <p className="text-sm text-muted-foreground">Este enlace expirará en 24 horas.</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <p className="text-xs text-muted-foreground text-center w-full">
          Desarrollo: Este token es para {email === "admin@mail.com" ? "un administrador" : "un usuario regular"}
        </p>
        <p className="text-xs text-muted-foreground text-center w-full">
          Token: {token}
        </p>
      </CardFooter>
    </Card>
  )
} 