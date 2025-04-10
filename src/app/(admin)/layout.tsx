"use client"

import * as React from "react"
import { BookOpen, Boxes, LayoutDashboard, Settings, ShoppingBag, Users } from "lucide-react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/admin/admin-sidebar"
import { AdminNavbar } from "@/components/admin/admin-navbar"

// Admin user data
const adminUser = {
  name: "Admin",
  email: "admin@mail.com",
  avatar: "",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarExpanded, setSidebarExpanded] = React.useState(true);
  
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar 
          className="hidden md:flex" 
          user={adminUser}
          sidebarExpanded={sidebarExpanded}
        />
        <div className="flex-1 flex flex-col w-full">
          <AdminNavbar 
            showSidebarTrigger={true} 
            user={adminUser}
          />
          <main className="flex-1 p-4 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
} 