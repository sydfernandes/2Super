"use client";

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlobalNavbar } from "@/components/global"
import { toast } from "sonner"

export default function Home() {
  return (
    <>
    <GlobalNavbar />
    <div className="flex-1">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="max-w-screen-lg mx-auto px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Tu lista de compras inteligente
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Organiza tus compras, ahorra tiempo y nunca olvides un producto con Super Lista.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg">
                  Crear Lista
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => toast("Explorando funcionalidades", {
                    description: "Descubre todas las opciones de Super Lista",
                    icon: <ArrowRight className="h-4 w-4" />
                  })}
                >
                  Explorar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="rounded-lg border bg-card p-8 shadow-sm w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium">Lista de Supermercado</h3>
                    <p className="text-sm text-muted-foreground">4 productos</p>
                  </div>
                  <Button variant="outline" size="sm">Editar</Button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full border flex items-center justify-center bg-primary">
                        <svg className="h-3 w-3 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <span>Leche</span>
                    </div>
                    <span className="text-sm text-muted-foreground">2 L</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full border flex items-center justify-center bg-primary">
                        <svg className="h-3 w-3 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <span>Pan</span>
                    </div>
                    <span className="text-sm text-muted-foreground">1 barra</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full border"></div>
                      <span>Huevos</span>
                    </div>
                    <span className="text-sm text-muted-foreground">12 uni</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full border"></div>
                      <span>Tomates</span>
                    </div>
                    <span className="text-sm text-muted-foreground">1 kg</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  )
} 