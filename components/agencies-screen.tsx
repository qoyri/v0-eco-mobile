"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Clock, MapPin, Phone, Search } from "lucide-react"
import { AppLayout } from "./app-layout"

export function AgenciesScreen() {
  const router = useRouter()

  const handleSelectAgency = (agency: string) => {
    router.push(`/new-reservation?agency=${agency}`)
  }

  return (
    <AppLayout>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Nos agences</h2>
        <p className="text-sm text-muted-foreground">Trouvez une agence Eco-Mobil près de chez vous</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" placeholder="Rechercher une ville ou une agence" />
      </div>

      <div className="space-y-4">
        {["Annecy", "Grenoble", "Chambéry", "Valence"].map((city) => (
          <Card
            key={city}
            className="cursor-pointer hover:bg-accent/50"
            onClick={() => handleSelectAgency(city.toLowerCase())}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{city}</CardTitle>
              <CardDescription>Agence Eco-Mobil {city}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-2">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">12 rue du Lac, 74000 {city}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">04 50 XX XX XX</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">Ouvert de 9h00 à 19h00</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => handleSelectAgency(city.toLowerCase())}>
                Réserver dans cette agence
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </AppLayout>
  )
}
