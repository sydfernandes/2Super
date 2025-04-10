"use client"

import { GlobalNavbar } from "@/components/global"
import { ThemeProvider } from "@/components/global/theme-provider"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
      <GlobalNavbar />
      
        <div className="bg-muted/50 w-full min-h-screen">
        {children}
        </div>
      </ThemeProvider>
      </>
  )
} 