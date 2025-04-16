"use client"

import { useState, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"

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

        let url = "/api/vehicles"
        const params = new URLSearchParams()

        if (agencyId) {
          params.append("agencyId", agencyId)
        }

        if (agencyName) {
          params.append("agencyName", agencyName)
        }

        if (type) {
          params.append("type", type)
        }

        if (params.toString()) {
          url += `?${params.toString()}`
        }

        console.log("Fetching vehicles:", url)

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des véhicules")
        }

        const data = await response.json()
        setVehicles(data)

        return data
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
