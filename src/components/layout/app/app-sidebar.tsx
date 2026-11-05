"use client"

import { Home, FileText, Map, Cog, MessageCircleQuestionIcon, FileXIcon, User, Bell, LogOut } from "lucide-react"
import * as React from "react"
import Link from "next/link"
import { LogoCurrentColor } from "@/assets/icons/LogoCurrentColor"
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, SidebarGroupLabel } from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator } from "../../ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { usePathname } from "next/navigation"
import { logout } from "@/actions/session"
import { USER_COOKIE, type SessionUser } from "@/lib/session"
import Cookie from "js-cookie"

interface UserData {
  name: string
  email: string
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const userCookie = Cookie.get(USER_COOKIE) // cookie público gravado no login
  const userData: Partial<SessionUser> = userCookie ? JSON.parse(userCookie) : {}
  const placeholderAvatar = userData.nome ? userData.nome.slice(0, 2).toUpperCase() : "US"

  const path = usePathname()

  const linksSystem = [
    { title: "Dashboard", url: "/app", icon: Home },
    { title: "Análises", url: "/app/analysis", icon: FileText },
    { title: "Mapa", url: "/app/map", icon: Map }
  ]

  const linksConfig = [
    { title: "Configurações", url: "/app/config", icon: Cog },
    { title: "Ajuda e suporte", url: "/app/help", icon: MessageCircleQuestionIcon },
  ]

  return (
    <Sidebar {...props} className="select-none">
      <SidebarHeader className="bg-white">
        <Link href="/app">
          <LogoCurrentColor className="size-8!" />
        </Link>
      </SidebarHeader>

      <SidebarContent className="bg-white!">
        <SidebarGroup>
          <SidebarGroupLabel>Sistema </SidebarGroupLabel>
          <SidebarMenu>
            {
              linksSystem.map((item, index) => {
                const isActive = path === item.url

                return (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton size="default" asChild isActive={isActive}>
                      <Link href={item.url}>
                        <div hidden={!isActive} className="w-1 h-full rounded-2xl bg-primary"></div>
                        <item.icon />
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })
            }
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Documentos</SidebarGroupLabel>
          <SidebarMenu>
            <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-muted-foreground opacity-60 select-none">
              <FileXIcon className="size-4" /> {/* Um ícone do Heroicons ou Lucide ajuda no visual */}
              <span>Sem docs recentes</span>
            </div>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Configurações</SidebarGroupLabel>
          <SidebarMenu>
            {
              linksConfig.map((item, index) => {
                const isActive = path === item.url

                return (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton size="default" asChild isActive={isActive}>
                      <Link href={item.url}>
                        <div hidden={!isActive} className="w-1 h-full rounded-2xl bg-primary"></div>
                        <item.icon />
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })
            }
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-white!">
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton size="lg">
                    <Avatar>
                      <AvatarImage />
                      <AvatarFallback suppressHydrationWarning>{placeholderAvatar}</AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                      <p className="font-semibold" suppressHydrationWarning>{userData.nome}</p>
                      <p className="font-light" suppressHydrationWarning>{userData.email}</p>
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link href="/app/account"><User /> Minha conta</Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/app/notification"><Bell /> Notificações</Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {/* a ação apaga os cookies e redireciona: sem corrida com a navegação do Link */}
                    <DropdownMenuItem onSelect={() => logout()}>
                      <LogOut /> Sair da conta
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  )
}
