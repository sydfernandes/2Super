"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Bell, PanelRightClose, PanelRightOpen, User } from "lucide-react"
import { UserProfile } from "@/components/admin/admin-sidebar"
import { UserMenu } from "@/components/global/user-menu"
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AdminNavbarProps {
  breadcrumbs?: Array<{
    label: string
    href?: string
    isActive?: boolean
  }>
  showSidebarTrigger?: boolean
  user: UserProfile
}

export function AdminNavbar({
  breadcrumbs = [],
  showSidebarTrigger = true,
  user
}: AdminNavbarProps) {
  const { toggleSidebar, state } = useSidebar()
  const pathname = usePathname()

  // Generate breadcrumbs from pathname if not provided
  const generatedBreadcrumbs = React.useMemo(() => {
    if (breadcrumbs.length > 0) return breadcrumbs

    // Skip empty segments and admin (which is the root)
    const segments = pathname
      .split('/')
      .filter(segment => segment && segment !== 'admin')
    
    return [
      { label: 'Admin', href: '/admin' },
      ...segments.map((segment, index) => {
        const href = `/admin/${segments.slice(0, index + 1).join('/')}`
        const isActive = index === segments.length - 1
        // Capitalize and replace dashes with spaces
        const label = segment.charAt(0).toUpperCase() + 
                     segment.slice(1).replace(/-/g, ' ')
        
        return { label, href, isActive }
      })
    ]
  }, [pathname, breadcrumbs])

  return (
    <div className="bg-background z-10 h-fit py-2 px-4 flex items-center justify-between w-full">
      <div className="flex items-center space-x-4">
        {showSidebarTrigger && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
          >
            {state === "expanded" ? (
              <PanelRightOpen className="h-5 w-5" />
            ) : (
              <PanelRightClose className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        )}
        
        <Breadcrumb>
          <BreadcrumbList>
            {generatedBreadcrumbs.map((item, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  {item.isActive ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < generatedBreadcrumbs.length - 1 && (
                  <BreadcrumbSeparator />
                )}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
          <span className="sr-only">Notificaciones</span>
        </Button>
        
        <UserMenu 
          userName={user.name}
          userEmail={user.email}
          userImage={user.avatar}
          avatarMode={true}
        />
      </div>
    </div>
  )
} 