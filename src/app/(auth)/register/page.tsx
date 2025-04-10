"use client"

import { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Image from "next/image"
import { useRouter } from "next/navigation"
import confetti from "canvas-confetti"
import { IconPaperBag } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle } from "lucide-react"

const formSchema = z.object({
  email: z.string().email({
    message: "Por favor ingresa un correo electrónico válido.",
  }),
})

type FormValues = z.infer<typeof formSchema>

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

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

  function onSubmit(values: FormValues) {
    setIsLoading(true)
    console.log(values)
    // Aquí iría la lógica de envío de correo
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
      form.reset()
    }, 1000)
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
                <h1 className="text-2xl font-bold tracking-tight">Crear cuenta</h1>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Crea una cuenta para gestionar tus listas de compras de manera eficiente
                </p>
              </div>
              
              {isSubmitted ? (
                <Alert className="bg-green-50 border-green-200 mb-6">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Hemos enviado un enlace de acceso a tu correo electrónico. Por favor revisa tu bandeja de entrada.
                  </AlertDescription>
                </Alert>
              ) : null}
              
              {/* Formulario de registro */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-8">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo electrónico</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="correo@ejemplo.com"
                            type="email"
                            disabled={isLoading || isSubmitted}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading || isSubmitted} 
                    size="lg"
                  >
                    {isLoading ? "Enviando..." : "Enviar enlace de acceso"}
                  </Button>
                </form>
              </Form>
              
              {/* Enlace a inicio de sesión */}
              <div className="text-center text-sm">
                ¿Ya tienes una cuenta?{" "}
                <Link href="/login" className="text-primary font-medium hover:underline">
                  Iniciar Sesión
                </Link>
              </div>
            </div>
          </div>
          
          {/* Lado derecho - Imagen de borde a borde */}
          <div className="md:w-1/2 h-[300px] md:h-[450px] relative flex items-center justify-center">
            <Image 
              src="/images/auth.jpg"
              alt="Register"
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