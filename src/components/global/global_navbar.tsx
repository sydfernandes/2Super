"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function GlobalNavbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-screen-xl mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M8 3h8a2 2 0 0 1 2 2v1.82a5 5 0 0 0 .528 2.236l.944 1.888a5 5 0 0 1 .528 2.236v5.82a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-5.82a5 5 0 0 1 .528 -2.236l1.472 -2.944v-3a2 2 0 0 1 2 -2z" />
              <path d="M14 15m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
              <path d="M6 21a2 2 0 0 0 2 -2v-5.82a5 5 0 0 0 -.528 -2.236l-1.472 -2.944" />
              <path d="M11 7h2" />
            </svg>
            <span className="font-bold sm:inline-block">
              Super Lista
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link
              href="/"
              className="transition-colors hover:text-foreground/80 text-foreground"
            >
              Inicio
            </Link>
            <Link
              href="/lists"
              className="transition-colors hover:text-foreground/80 text-muted-foreground"
            >
              Listas
            </Link>
            <Link
              href="/products"
              className="transition-colors hover:text-foreground/80 text-muted-foreground"
            >
              Productos
            </Link>
            <Link
              href="/explore"
              className="transition-colors hover:text-foreground/80 text-muted-foreground"
            >
              Explorar
            </Link>
          </nav>
        </div>
        <div className="flex">
          <Link 
            href="/login" 
            className="px-3 py-1.5 text-sm transition-colors hover:text-foreground/80 text-muted-foreground mr-2 hidden lg:inline-block">
            Iniciar Sesión
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-8 px-4 py-2 hidden lg:inline-flex"
          >
            Registrarse
          </Link>
        </div>
      </div>
    </header>
  )
} 