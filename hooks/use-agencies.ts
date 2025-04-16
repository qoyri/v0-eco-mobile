"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface Agency {
  id: string
  name: string
  address: string
  city: string
  zip_code: string
  phone_number: string
  opening_hours: string
  is_active: boolean
}

export function useAgencies() {
  const [agencies, setAgencies] = useState<Agency[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const fetchAgencies = async () => {
    try {
      setLoading(true)

      const response = await fetch("/api/agencies")

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des agences")
      }

      const data = await response.json()
      setAgencies(data)

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
  }

  return {
    agencies,
    loading,
    fetchAgencies,
  }
}
