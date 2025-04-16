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

  // Données des agences
  const agencies = [
    {
      id: "annecy",
      name: "Annecy",
      address: "12 rue du Lac, 74000 Annecy",
      phone: "04 50 XX XX XX",
      hours: "Ouvert de 9h00 à 19h00",
      description: "Agence principale située au bord du lac d'Annecy",
      vehicles: 24,
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: "grenoble",
      name: "Grenoble",
      address: "45 avenue de la Libération, 38000 Grenoble",
      phone: "04 76 XX XX XX",
      hours: "Ouvert de 9h00 à 19h00",
      description: "Au cœur de la ville, proche de la gare",
      vehicles: 18,
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: "chambery",
      name: "Chambéry",
      address: "8 place Saint-Léger, 73000 Chambéry",
      phone: "04 79 XX XX XX",
      hours: "Ouvert de 9h00 à 19h00",
      description: "Dans le centre historique de Chambéry",
      vehicles: 15,
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: "valence",
      name: "Valence",
      address: "22 boulevard Bancel, 26000 Valence",
      phone: "04 75 XX XX XX",
      hours: "Ouvert de 9h00 à 19h00",
      description: "À proximité du parc Jouvet",
      vehicles: 12,
      image: "/placeholder.svg?height=200&width=400",
    },
  ]

  return (
    <AppLayout>
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-green-700">Nos agences</h1>
            <p className="text-muted-foreground">Trouvez une agence Eco-Mobil près de chez vous</p>
          </div>
          <div className="relative mt-4 md:mt-0 w-full md:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Rechercher une ville ou une agence" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agencies.map((agency) => (
            <Card key={agency.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-40 bg-gray-200 relative">
                <img
                  src={agency.image || "/placeholder.svg"}
                  alt={`Agence ${agency.name}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                  {agency.vehicles} véhicules
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-green-700">{agency.name}</CardTitle>
                <CardDescription>{agency.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-green-600" />
                    <span className="text-sm">{agency.address}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-green-600" />
                    <span className="text-sm">{agency.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-green-600" />
                    <span className="text-sm">{agency.hours}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => handleSelectAgency(agency.id)}
                >
                  Réserver dans cette agence
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
