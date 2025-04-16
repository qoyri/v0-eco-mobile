"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Bike,
  Home,
  LogOut,
  Settings,
  Users,
  BarChart3,
  Calendar,
  Bell,
  Search,
  MenuIcon,
  AlertTriangle,
  ChevronDown,
} from "lucide-react"
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
import { useAuth } from "@/hooks/use-auth"

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
      <div className="flex h-screen" style={{ backgroundColor: "hsl(222.2 84% 4.9%)" }}>
        {/* Sidebar */}
        <div
            className={`transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"} hidden md:block border-r border-slate-800`}
            style={{ backgroundColor: "hsl(222.2 47.4% 11.2%)" }}
        >
          <div className="flex h-16 items-center justify-between border-b border-slate-800 px-4">
            <h1 className={`text-xl font-bold text-white ${!sidebarOpen && "hidden"}`}>Eco-Mobil Admin</h1>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-slate-300 hover:bg-slate-800"
            >
              <MenuIcon className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-4">
            <nav className="space-y-2">
              <Link href="/admin/dashboard" passHref>
                <Button
                    variant={isActive("/admin/dashboard") ? "default" : "ghost"}
                    className={`w-full justify-start ${!sidebarOpen && "justify-center px-0"} ${
                        isActive("/admin/dashboard")
                            ? "bg-slate-700 hover:bg-slate-600 text-white"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                >
                  <Home className="h-5 w-5 mr-2" />
                  {sidebarOpen && <span>Tableau de bord</span>}
                </Button>
              </Link>

              <Link href="/admin/reservations" passHref>
                <Button
                    variant={isActive("/admin/reservations") ? "default" : "ghost"}
                    className={`w-full justify-start ${!sidebarOpen && "justify-center px-0"} ${
                        isActive("/admin/reservations")
                            ? "bg-slate-700 hover:bg-slate-600 text-white"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  {sidebarOpen && <span>Réservations</span>}
                </Button>
              </Link>

              <Link href="/admin/vehicles" passHref>
                <Button
                    variant={isActive("/admin/vehicles") ? "default" : "ghost"}
                    className={`w-full justify-start ${!sidebarOpen && "justify-center px-0"} ${
                        isActive("/admin/vehicles")
                            ? "bg-slate-700 hover:bg-slate-600 text-white"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                >
                  <Bike className="h-5 w-5 mr-2" />
                  {sidebarOpen && <span>Véhicules</span>}
                </Button>
              </Link>

              <Link href="/admin/users" passHref>
                <Button
                    variant={isActive("/admin/users") ? "default" : "ghost"}
                    className={`w-full justify-start ${!sidebarOpen && "justify-center px-0"} ${
                        isActive("/admin/users")
                            ? "bg-slate-700 hover:bg-slate-600 text-white"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                >
                  <Users className="h-5 w-5 mr-2" />
                  {sidebarOpen && <span>Utilisateurs</span>}
                </Button>
              </Link>

              <Link href="/admin/incidents" passHref>
                <Button
                    variant={isActive("/admin/incidents") ? "default" : "ghost"}
                    className={`w-full justify-start ${!sidebarOpen && "justify-center px-0"} ${
                        isActive("/admin/incidents")
                            ? "bg-slate-700 hover:bg-slate-600 text-white"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                >
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  {sidebarOpen && <span>Incidents</span>}
                </Button>
              </Link>

              <Link href="/admin/analytics" passHref>
                <Button
                    variant={isActive("/admin/analytics") ? "default" : "ghost"}
                    className={`w-full justify-start ${!sidebarOpen && "justify-center px-0"} ${
                        isActive("/admin/analytics")
                            ? "bg-slate-700 hover:bg-slate-600 text-white"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                >
                  <BarChart3 className="h-5 w-5 mr-2" />
                  {sidebarOpen && <span>Statistiques</span>}
                </Button>
              </Link>

              <Link href="/admin/settings" passHref>
                <Button
                    variant={isActive("/admin/settings") ? "default" : "ghost"}
                    className={`w-full justify-start ${!sidebarOpen && "justify-center px-0"} ${
                        isActive("/admin/settings")
                            ? "bg-slate-700 hover:bg-slate-600 text-white"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                >
                  <Settings className="h-5 w-5 mr-2" />
                  {sidebarOpen && <span>Paramètres</span>}
                </Button>
              </Link>
            </nav>
          </div>

          <div className="absolute bottom-0 w-full border-t border-slate-800 p-4">
            <Button
                variant="ghost"
                className={`w-full justify-start text-red-400 hover:text-red-300 hover:bg-slate-800 ${
                    !sidebarOpen && "justify-center px-0"
                }`}
                onClick={() => logout()}
            >
              <LogOut className="h-5 w-5 mr-2" />
              {sidebarOpen && <span>Déconnexion</span>}
            </Button>
          </div>
        </div>

        {/* Mobile sidebar button */}
        <div className="md:hidden fixed bottom-4 right-4 z-50">
          <Button className="rounded-full h-12 w-12 shadow-lg bg-slate-700 hover:bg-slate-600">
            <MenuIcon className="h-6 w-6" />
          </Button>
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header */}
          <header
              className="border-b border-slate-800 h-16 flex items-center justify-between px-6 shadow-sm"
              style={{ backgroundColor: "hsl(222.2 47.4% 11.2%)" }}
          >
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="md:hidden mr-2 text-slate-300 hover:bg-slate-800">
                <MenuIcon className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold text-white md:hidden">Eco-Mobil Admin</h1>
            </div>

            <div className="flex-1 max-w-xl mx-4 hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <Input
                    placeholder="Rechercher..."
                    className="pl-10 pr-4 py-2 border rounded-lg w-full bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-slate-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative text-slate-300 hover:bg-slate-800">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 text-slate-300 hover:bg-slate-800">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" alt="Avatar" />
                      <AvatarFallback className="bg-slate-700 text-white">
                        {user?.firstName?.charAt(0)}
                        {user?.lastName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {sidebarOpen && (
                        <>
                          <div className="text-sm font-medium text-left hidden md:block">
                            <div className="text-white">
                              {user?.firstName} {user?.lastName}
                            </div>
                            <div className="text-xs text-slate-400">{user?.role || "Admin"}</div>
                          </div>
                          <ChevronDown className="h-4 w-4 text-slate-400 hidden md:block" />
                        </>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    className="w-56 border-slate-800 text-white"
                    style={{ backgroundColor: "hsl(222.2 47.4% 11.2%)" }}
                >
                  <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-800" />
                  <DropdownMenuItem className="text-slate-300 hover:bg-slate-800 hover:text-white">
                    Profil
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-slate-300 hover:bg-slate-800 hover:text-white">
                    Paramètres
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-800" />
                  <DropdownMenuItem
                      onClick={() => logout()}
                      className="text-red-400 hover:bg-slate-800 hover:text-red-300"
                  >
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 overflow-auto p-6" style={{ backgroundColor: "hsl(222.2 84% 4.9%)" }}>
            {children}
          </main>
        </div>
      </div>
  )
}
