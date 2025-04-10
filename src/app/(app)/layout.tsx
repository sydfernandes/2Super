"use client"

import * as React from "react"
import { AppNavigation } from "@/components/app/app-navigation"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Aquí podrías obtener la información del usuario actual
  // desde un contexto o un hook personalizado
  const user = {
    name: "Juan Pérez",
    email: "juan@example.com",
    // La imagen es opcional
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AppNavigation
        userName={user.name}
        userEmail={user.email}
      />
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2024 Super Lista. Todos los derechos reservados.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Términos de uso
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Política de privacidad
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Contacto
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 