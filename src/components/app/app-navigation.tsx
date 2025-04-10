"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Home, 
  ShoppingBag, 
  List, 
  Heart, 
  Settings, 
  User,
  Bell,
  Search,
  ChevronDown
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

const navigationLinks = [
  {
    title: "Inicio",
    href: "/app",
    icon: Home,
  },
  {
    title: "Mis Listas",
    href: "/app/listas",
    icon: List,
  },
  {
    title: "Productos",
    href: "/app/productos",
    icon: ShoppingBag,
  },
  {
    title: "Favoritos",
    href: "/app/favoritos",
    icon: Heart,
  },
]

const userActions = [
  {
    title: "Mi Perfil",
    href: "/app/perfil",
    icon: User,
  },
  {
    title: "Configuración",
    href: "/app/configuracion",
    icon: Settings,
  },
]

interface AppNavigationProps {
  userName?: string
  userEmail?: string
  userImage?: string
}

export function AppNavigation({
  userName = "Usuario",
  userEmail = "usuario@example.com",
  userImage,
}: AppNavigationProps) {
  const pathname = usePathname()
  const [expanded, setExpanded] = React.useState(false)

  const toggleExpanded = () => {
    setExpanded(!expanded)
  }

  return (
    <div className="sticky top-0 z-40 w-full bg-card shadow-sm">
      <div className="container px-4">
        {/* Barra principal (siempre visible) */}
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <ShoppingBag className="h-6 w-6 mr-2 text-primary" />
            <span className="font-semibold text-lg">Super Lista</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/app/buscar">
                <Search className="h-5 w-5" />
                <span className="sr-only">Buscar</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/app/notificaciones">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notificaciones</span>
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                  {userImage ? (
                    <img
                      src={userImage}
                      alt={userName}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      <User className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {userActions.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href} className="flex items-center">
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/login" className="flex items-center w-full">
                    Cerrar sesión
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleExpanded}
              className="ml-1"
            >
              <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
            </Button>
          </div>
        </div>
        
        {/* Barra expandible */}
        <div 
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            expanded ? "max-h-60 opacity-100 pb-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar productos o listas..."
                className="pl-8 bg-background"
              />
            </div>
            <nav className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {navigationLinks.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded-md hover:bg-accent transition-colors",
                      isActive && "bg-accent text-accent-foreground"
                    )}
                  >
                    <item.icon className="mb-1 h-5 w-5" />
                    <span className="text-sm">{item.title}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
} 