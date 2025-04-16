"use client"

import type { ReactNode } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Bike, Home, LogOut, Settings, Users, BarChart3, Calendar, Bell, Search, MenuIcon } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar pour desktop */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-background">
        <div className="flex h-14 items-center border-b px-4">
          <h1 className="text-lg font-semibold">Eco-Mobil Admin</h1>
        </div>

        <div className="flex flex-col flex-1 p-4 space-y-4">
          <Button variant="ghost" className="justify-start" onClick={() => handleNavigation("/admin")}>
            <Home className="mr-2 h-5 w-5" />
            Tableau de bord
          </Button>

          <Button variant="ghost" className="justify-start" onClick={() => handleNavigation("/admin/reservations")}>
            <Calendar className="mr-2 h-5 w-5" />
            Réservations
          </Button>

          <Button variant="ghost" className="justify-start" onClick={() => handleNavigation("/admin/vehicles")}>
            <Bike className="mr-2 h-5 w-5" />
            Véhicules
          </Button>

          <Button variant="ghost" className="justify-start" onClick={() => handleNavigation("/admin/clients")}>
            <Users className="mr-2 h-5 w-5" />
            Clients
          </Button>

          <Button variant="ghost" className="justify-start" onClick={() => handleNavigation("/admin/reports")}>
            <BarChart3 className="mr-2 h-5 w-5" />
            Rapports
          </Button>

          <Button variant="ghost" className="justify-start" onClick={() => handleNavigation("/admin/settings")}>
            <Settings className="mr-2 h-5 w-5" />
            Paramètres
          </Button>
        </div>

        <div className="border-t p-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => handleNavigation("/")}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Déconnexion
          </Button>
        </div>
      </aside>

      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
          {/* Menu pour mobile */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Eco-Mobil Admin</SheetTitle>
                <SheetDescription>Gestion des réservations et véhicules</SheetDescription>
              </SheetHeader>
              <div className="flex flex-col h-full py-4">
                <nav className="space-y-2 flex-1">
                  <Button variant="ghost" className="w-full justify-start" onClick={() => handleNavigation("/admin")}>
                    <Home className="mr-2 h-5 w-5" />
                    Tableau de bord
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleNavigation("/admin/reservations")}
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    Réservations
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleNavigation("/admin/vehicles")}
                  >
                    <Bike className="mr-2 h-5 w-5" />
                    Véhicules
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleNavigation("/admin/clients")}
                  >
                    <Users className="mr-2 h-5 w-5" />
                    Clients
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleNavigation("/admin/reports")}
                  >
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Rapports
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleNavigation("/admin/settings")}
                  >
                    <Settings className="mr-2 h-5 w-5" />
                    Paramètres
                  </Button>
                </nav>
                <Button
                  variant="ghost"
                  className="justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => handleNavigation("/")}
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Déconnexion
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* Barre de recherche */}
          <div className="relative hidden md:flex flex-1 items-center">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Rechercher..." className="pl-8 w-[300px]" />
          </div>

          <div className="flex items-center gap-4 md:ml-auto">
            {/* Notifications */}
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-600"></span>
            </Button>

            {/* Profil utilisateur */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="Avatar" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleNavigation("/admin/profile")}>Profil</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigation("/admin/settings")}>Paramètres</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleNavigation("/")}>Déconnexion</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Contenu principal */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
