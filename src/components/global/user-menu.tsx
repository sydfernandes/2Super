"use client"

import * as React from "react"
import Link from "next/link"
import { 
  User,
  LogOut,
  Settings,
  ChevronDown
} from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import type { VariantProps } from "class-variance-authority"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export interface UserAction {
  title: string
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  onClick?: () => void
}

// Helper function to get avatar initials
function getAvatarFallback(name?: string): string {
  if (!name) return "U";
  const initials = name.split(" ")
    .map(n => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return initials || "U";
}

export interface UserMenuProps {
  userName?: string
  userEmail?: string
  userImage?: string
  align?: 'start' | 'center' | 'end'
  signOutHref?: string
  signOutLabel?: string
  showSignOut?: boolean
  avatarMode?: boolean
  showChevron?: boolean
  buttonClassName?: string
  variant?: VariantProps<typeof buttonVariants>['variant']
  size?: VariantProps<typeof buttonVariants>['size']
}

export function UserMenu({
  userName,
  userEmail,
  userImage,
  align = 'center',
  signOutHref = '/logout',
  signOutLabel = 'Cerrar sesión',
  showSignOut = true,
  avatarMode = false,
  showChevron = false,
  buttonClassName = '',
  variant = 'ghost',
  size = 'icon',
}: UserMenuProps) {
  // Use appropriate default size when not in avatar mode
  const buttonSize = avatarMode ? size : 'default';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant} 
          size={buttonSize}
          className={`${avatarMode ? 'p-0 h-auto w-auto' : 'w-full p-1 h-fit'} ${buttonClassName}`}
        >
          {avatarMode ? (
            <Avatar className="h-9 w-9">
              <AvatarImage src={userImage} alt={userName} />
              <AvatarFallback>{getAvatarFallback(userName)}</AvatarFallback>
            </Avatar>
          ) : (
            <>
              <div className="flex items-center w-full justify-between">
                <div className="flex items-center flex-1 min-w-0 gap-2">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={userImage} alt={userName} />
                    <AvatarFallback>{getAvatarFallback(userName)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col text-left w-full">
                    <span className="font-medium text-sm truncate">{userName}</span>
                    <span className="text-xs text-muted-foreground truncate">
                      {userEmail}
                    </span>
                  </div>
                </div>
                {showChevron && <ChevronDown className="h-4 w-4 ml-2 shrink-0" />}
              </div>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Hardcoded menu items */}
        <DropdownMenuItem asChild>
          <Link href="/app/perfil" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>Mi Perfil</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/app/configuracion" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Configuración</span>
          </Link>
        </DropdownMenuItem>
        
        {showSignOut && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={signOutHref} className="flex items-center w-full">
                <LogOut className="mr-2 h-4 w-4" />
                {signOutLabel}
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 