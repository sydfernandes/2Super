"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, LineChart, PieChart, ShoppingCart, Users, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="max-w-5xl mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            asChild
          >
            <Link href="/configurar/admin">
              <ArrowLeft className="h-4 w-4" />
              Administración
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Usuarios Totales
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +12% respecto al mes anterior
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Productos
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,543</div>
            <p className="text-xs text-muted-foreground">
              +8% respecto al mes anterior
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Listas Creadas
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,456</div>
            <p className="text-xs text-muted-foreground">
              +19% respecto al mes anterior
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Compras Realizadas
            </CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,845</div>
            <p className="text-xs text-muted-foreground">
              +7% respecto al mes anterior
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Actividad del Sistema</CardTitle>
          <CardDescription>
            Visualización de estadísticas y actividad de la plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Vista General</TabsTrigger>
              <TabsTrigger value="analytics">Análisis</TabsTrigger>
              <TabsTrigger value="reports">Informes</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-4">
              <div className="h-[300px] flex items-center justify-center border rounded-md bg-muted/10">
                <PieChart className="h-10 w-10 text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Gráfico de actividad reciente</span>
              </div>
            </TabsContent>
            <TabsContent value="analytics" className="mt-4">
              <div className="h-[300px] flex items-center justify-center border rounded-md bg-muted/10">
                <BarChart3 className="h-10 w-10 text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Gráfico de análisis</span>
              </div>
            </TabsContent>
            <TabsContent value="reports" className="mt-4">
              <div className="h-[300px] flex items-center justify-center border rounded-md bg-muted/10">
                <LineChart className="h-10 w-10 text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Gráfico de informes</span>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 