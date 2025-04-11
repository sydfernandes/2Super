"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { 
  // Navigation icons
  Home, 
  ShoppingBag, 
  List, 
  Heart, 
  
  // Team/Project icons
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  
  // UI icons
  Bell,
  Search,
  ChevronRight,
  ChevronsUpDown,
  Plus,
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSidebar } from "@/components/ui/sidebar"
import { UserMenu } from "@/components/global/user-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu"
import { ToolbarExpandable } from "@/components/ui/toolbar-expandable"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarMenuAction,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

export interface NavigationLink {
  title: string
  href: string
  icon: LucideIcon
  isActive?: boolean
}

export interface UserProfile {
  name: string
  email: string
  avatar: string
}

export interface TeamData {
  name: string
  logo: LucideIcon
  plan: string
}

export interface NavMainItem {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  items?: {
    title: string
    url: string
  }[]
}

export interface ProjectData {
  name: string
  url: string
  icon: LucideIcon
}


// TEAM-SWITCHER
interface TeamSwitcherProps {
  teams?: TeamData[]
  activeTeam?: TeamData
  setActiveTeam?: (team: TeamData) => void
}

export function TeamSwitcher({ 
  teams,
  activeTeam,
  setActiveTeam 
}: TeamSwitcherProps) {
  const { isMobile } = useSidebar()
  
  // Use hardcoded data if props not provided
  const staticTeams = [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ];
  
  const teamsData = teams || staticTeams;
  const activeTeamData = activeTeam || teamsData[0];
  const handleSetActiveTeam = setActiveTeam || ((team) => {});

  if (!activeTeamData) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <activeTeamData.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeTeamData.name}</span>
                <span className="truncate text-xs">{activeTeamData.plan}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Equipos
            </DropdownMenuLabel>
            {teamsData.map((team, index) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => handleSetActiveTeam(team)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <team.logo className="size-3.5 shrink-0" />
                </div>
                {team.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Añadir equipo</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}


// NAV-MAIN
interface NavMainProps {
  navMain?: NavMainItem[]
}

export function NavMain({ navMain }: NavMainProps) {
  // Hardcoded data
  const staticNavMain = [
    {
      title: "Panel Admin",
      url: "/admin",
      icon: PieChart,
      isActive: true,
    },
    {
      title: "Gestionar",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Conexión API",
          url: "/gestionar/conexion-api",
        },
        {
          title: "Productos",
          url: "/gestionar/productos",
        },
        {
          title: "Precios",
          url: "/gestionar/precios",
        },
        {
          title: "Marcas",
          url: "/gestionar/marcas",
        },
        {
          title: "Supermercados",
          url: "/gestionar/supermercados",
        },
        {
          title: "Categorías",
          url: "/gestionar/categorias",
        },
        {
          title: "Tipos de Producto",
          url: "/gestionar/tipodeproducto",
        },
        {
          title: "Usuarios",
          url: "/gestionar/usuarios",
        },
      ],
    },
    {
      title: "Configurar",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Etiquetas",
          url: "/configurar/etiquetas",
        },
        {
          title: "Géneros",
          url: "/configurar/generos",
        },
        {
          title: "Modos de Lista",
          url: "/configurar/modosdelista",
        },
        {
          title: "Modos de Obtención",
          url: "/configurar/modosdeobtencion",
        },
        {
          title: "Unidades de Medida",
          url: "/configurar/unidadesdemedida",
        },
      ],
    },
  ];

  const navData = navMain || staticNavMain;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Administración</SidebarGroupLabel>
      <SidebarMenu>
        {navData.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              {item.items ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : (
                <SidebarMenuButton asChild>
                  <Link href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

// NAV-PROJECTS
interface NavProjectsProps {
  projects?: ProjectData[]
}

export function NavProjects({ projects }: NavProjectsProps) {
  const { isMobile } = useSidebar()
  
  // Hardcoded data
  const staticProjects = [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ];

  const projectsData = projects || staticProjects;

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Proyectos</SidebarGroupLabel>
      <SidebarMenu>
        {projectsData.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <Folder className="text-muted-foreground" />
                  <span>Ver Proyecto</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Forward className="text-muted-foreground" />
                  <span>Compartir Proyecto</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Eliminar Proyecto</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal className="text-sidebar-foreground/70" />
            <span>Más</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}

// NAV-USER
interface NavUserProps {
  user?: UserProfile
  sidebarExpanded?: boolean
}

export function NavUser({ 
  user,
  sidebarExpanded = true 
}: NavUserProps) {
  // Hardcoded user data - usando string vacía para avatar para evitar error 404
  const staticUser = {
    name: "shadcn",
    email: "m@example.com",
    avatar: "",
  };

  const userData = user || staticUser;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <UserMenu
          userName={userData.name}
          userEmail={userData.email}
          userImage={userData.avatar}
          align="end"
          avatarMode={!sidebarExpanded}
          showChevron={sidebarExpanded}
          buttonClassName={sidebarExpanded ? "w-full" : ""}
        />
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

// APP-SIDEBAR
interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: UserProfile
  teams?: TeamData[]
  navMain?: NavMainItem[]
  projects?: ProjectData[]
  sidebarExpanded?: boolean
}

export function AppSidebar({ 
  user,
  teams,
  navMain,
  projects,
  sidebarExpanded = true,
  ...props 
}: AppSidebarProps) {
  // Static user - usando string vacía para avatar para evitar error 404
  const staticUser = {
    name: "shadcn",
    email: "m@example.com",
    avatar: "",
  };
  
  // Static teams
  const staticTeams = [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ];
  
  const teamsData = teams || staticTeams;
  const userData = user || staticUser;
  const [activeTeam, setActiveTeam] = React.useState<TeamData>(teamsData[0]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher 
          teams={teamsData} 
          activeTeam={activeTeam} 
          setActiveTeam={setActiveTeam} 
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain navMain={navMain} />
        <NavProjects projects={projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} sidebarExpanded={sidebarExpanded} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

// APP-NAVIGATION
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

  const collapsedContent = (
    <div className="flex items-center justify-between w-full">
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
        <UserMenu 
          userName={userName}
          userEmail={userEmail}
          userImage={userImage}
          avatarMode={true}
          size="default"
        />
      </div>
    </div>
  )

  const expandedContent = (
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
        {[
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
        ].map((item) => {
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
  )

  return (
    <ToolbarExpandable
      className="w-full z-40 sticky top-0"
      collapsedContent={collapsedContent}
      expandedContent={expandedContent}
      height={230}
      collapsedHeight={64}
    />
  )
} 