"use client"

import type { ReactNode } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Bike, Home, LogOut, MapPin, Menu, MessageSquare } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter()

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Eco-Mobil</SheetTitle>
                <SheetDescription>Location de véhicules électriques</SheetDescription>
              </SheetHeader>
              <div className="flex flex-col h-full">
                <nav className="space-y-2 flex-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleNavigation("/dashboard")}
                  >
                    <Home className="mr-2 h-5 w-5" />
                    Accueil
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleNavigation("/new-reservation")}
                  >
                    <Bike className="mr-2 h-5 w-5" />
                    Réserver
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleNavigation("/agencies")}
                  >
                    <MapPin className="mr-2 h-5 w-5" />
                    Agences
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => handleNavigation("/support")}>
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Support
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
          <h1 className="text-lg font-semibold">Eco-Mobil</h1>
        </div>
      </header>

      <main className="flex-1 p-4 pb-16">{children}</main>

      <footer className="sticky bottom-0 border-t bg-background">
        <div className="flex h-16 items-center justify-around">
          <Button
            variant="ghost"
            size="icon"
            className="flex flex-col items-center justify-center h-full"
            onClick={() => handleNavigation("/dashboard")}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Accueil</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="flex flex-col items-center justify-center h-full"
            onClick={() => handleNavigation("/new-reservation")}
          >
            <Bike className="h-5 w-5" />
            <span className="text-xs mt-1">Réserver</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="flex flex-col items-center justify-center h-full"
            onClick={() => handleNavigation("/agencies")}
          >
            <MapPin className="h-5 w-5" />
            <span className="text-xs mt-1">Agences</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="flex flex-col items-center justify-center h-full"
            onClick={() => handleNavigation("/support")}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-xs mt-1">Support</span>
          </Button>
        </div>
      </footer>
    </div>
  )
}
