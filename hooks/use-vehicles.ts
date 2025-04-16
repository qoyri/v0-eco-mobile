"use client"

import { useState, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"

// Données fictives pour le mode statique
const MOCK_VEHICLES = [
  {
    id: "vehicle-1",
    type: "BIKE",
    model: "City Explorer",
    description: "Vélo électrique idéal pour la ville",
    autonomy: 80,
    status: "AVAILABLE",
    agency_id: "agency-1",
    hourly_rate: 6,
    agency_name: "Eco Mobile Annecy Centre",
    agency_city: "Annecy",
  },
  {
    id: "vehicle-2",
    type: "SCOOTER",
    model: "Urban Glide",
    description: "Trottinette électrique légère et maniable",
    autonomy: 30,
    status: "AVAILABLE",
    agency_id: "agency-1",
    hourly_rate: 5,
    agency_name: "Eco Mobile Annecy Centre",
    agency_city: "Annecy",
  },
  {
    id: "vehicle-3",
    type: "BIKE",
    model: "Mountain Explorer",
    description: "Vélo électrique tout-terrain",
    autonomy: 60,
    status: "AVAILABLE",
    agency_id: "agency-2",
    hourly_rate: 8,
    agency_name: "Eco Mobile Annecy Lac",
    agency_city: "Annecy",
  },
]

interface Vehicle {
  id: string
  type: string
  model: string
  description?: string
  autonomy: number
  status: string
  agency_id: string
  hourly_rate: number
  agency_name?: string
  agency_city?: string
}

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Mémoriser fetchVehicles avec useCallback pour éviter les appels en boucle
  const fetchVehicles = useCallback(
    async (agencyId?: string, type?: string, agencyName?: string) => {
      try {
        setLoading(true)

        // Simuler un délai réseau
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Filtrer les véhicules selon les critères
        let filteredVehicles = [...MOCK_VEHICLES]

        if (agencyId) {
          filteredVehicles = filteredVehicles.filter((v) => v.agency_id === agencyId)
        }

        if (agencyName) {
          filteredVehicles = filteredVehicles.filter(
            (v) =>
              v.agency_name?.toLowerCase().includes(agencyName.toLowerCase()) ||
              v.agency_city?.toLowerCase() === agencyName.toLowerCase(),
          )
        }

        if (type) {
          // Convertir le type en format attendu par la base de données
          let dbType
          if (type.toLowerCase() === "velo") {
            dbType = "BIKE"
          } else if (type.toLowerCase() === "trottinette") {
            dbType = "SCOOTER"
          } else {
            dbType = type.toUpperCase()
          }

          filteredVehicles = filteredVehicles.filter((v) => v.type === dbType)
        }

        // Trier par tarif horaire
        filteredVehicles.sort((a, b) => a.hourly_rate - b.hourly_rate)

        setVehicles(filteredVehicles)

        return filteredVehicles
      } catch (error: any) {
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive",
        })
        return []
      } finally {
        setLoading(false)
      }
    },
    [toast],
  )

  return {
    vehicles,
    loading,
    fetchVehicles,
  }
}
