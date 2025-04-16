"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Home,
  Calendar,
  MapPin,
  User,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  Bike,
  AlertTriangle,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notificationCount, setNotificationCount] = useState(2)

  // Fermer le menu mobile lors du changement de route
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/")
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion",
        variant: "destructive",
      })
    }
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  const navItems = [
    { path: "/dashboard", label: "Tableau de bord", icon: Home },
    { path: "/agencies", label: "Nos agences", icon: MapPin },
    { path: "/new-reservation", label: "Nouvelle réservation", icon: Calendar },
    { path: "/incidents", label: "Mes incidents", icon: AlertTriangle },
    { path: "/support", label: "Support", icon: HelpCircle },
  ]

  return (
    <div className="flex h-screen" style={{ backgroundColor: "hsl(222.2 84% 4.9%)" }}>
      {/* Sidebar pour desktop */}
      <aside
        className="hidden md:flex md:w-64 flex-col border-r border-slate-800 shadow-sm"
        style={{ backgroundColor: "hsl(222.2 47.4% 11.2%)" }}
      >
        <div className="flex h-16 items-center px-4 border-b border-slate-800">
          <Link href="/dashboard" className="flex items-center">
            <Bike className="h-6 w-6 text-slate-300 mr-2" />
            <h1 className="text-xl font-bold text-white">Eco-Mobil</h1>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.path} href={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    isActive(item.path)
                      ? "bg-slate-700 hover:bg-slate-600 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon className="mr-2 h-5 w-5" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center mb-4">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src="/placeholder.svg" alt="Avatar" />
              <AvatarFallback className="bg-slate-700 text-white">
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-white">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-slate-800 border-slate-700"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Contenu principal */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header
          className="border-b border-slate-800 h-16 flex items-center justify-between px-4 md:px-6"
          style={{ backgroundColor: "hsl(222.2 47.4% 11.2%)" }}
        >
          <div className="flex items-center">
            {/* Logo pour mobile */}
            <div className="flex items-center md:hidden">
              <Bike className="h-6 w-6 text-slate-300 mr-2" />
              <h1 className="text-xl font-bold text-white">Eco-Mobil</h1>
            </div>

            {/* Bouton menu pour mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden ml-2 text-slate-300 hover:bg-slate-800"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="relative text-slate-300 hover:bg-slate-800">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                  {notificationCount}
                </Badge>
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 hidden md:flex text-slate-300 hover:bg-slate-800"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="Avatar" />
                    <AvatarFallback className="bg-slate-700 text-white">
                      {user?.firstName?.charAt(0)}
                      {user?.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm font-medium text-left">
                    <div className="text-white">
                      {user?.firstName} {user?.lastName}
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 border-slate-800 text-white"
                style={{ backgroundColor: "hsl(222.2 47.4% 11.2%)" }}
              >
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-800" />
                <DropdownMenuItem
                  onClick={() => router.push("/profile")}
                  className="text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  <User className="mr-2 h-4 w-4" />
                  Profil
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/reservations")}
                  className="text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Mes réservations
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/incidents")}
                  className="text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Mes incidents
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-800" />
                <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:bg-slate-800 hover:text-red-300">
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Menu mobile */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden">
            <div
              className="fixed inset-y-0 left-0 w-64 shadow-lg"
              style={{ backgroundColor: "hsl(222.2 47.4% 11.2%)" }}
            >
              <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
                <div className="flex items-center">
                  <Bike className="h-6 w-6 text-slate-300 mr-2" />
                  <h1 className="text-xl font-bold text-white">Eco-Mobil</h1>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-300 hover:bg-slate-800"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <div className="p-4">
                <div className="flex items-center mb-6">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src="/placeholder.svg" alt="Avatar" />
                    <AvatarFallback className="bg-slate-700 text-white">
                      {user?.firstName?.charAt(0)}
                      {user?.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-white">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-slate-400">{user?.email}</p>
                  </div>
                </div>

                <nav className="space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link key={item.path} href={item.path}>
                        <Button
                          variant={isActive(item.path) ? "default" : "ghost"}
                          className={`w-full justify-start ${
                            isActive(item.path)
                              ? "bg-slate-700 hover:bg-slate-600 text-white"
                              : "text-slate-300 hover:bg-slate-800 hover:text-white"
                          }`}
                        >
                          <Icon className="mr-2 h-5 w-5" />
                          {item.label}
                        </Button>
                      </Link>
                    )
                  })}
                </nav>

                <div className="mt-6 pt-6 border-t border-slate-800">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-slate-800 border-slate-700"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-5 w-5" />
                    Déconnexion
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contenu principal */}
        <main className="flex-1 overflow-auto p-4 md:p-6" style={{ backgroundColor: "hsl(222.2 84% 4.9%)" }}>
          {children}
        </main>
      </div>
    </div>
  )
}
