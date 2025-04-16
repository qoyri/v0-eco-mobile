"use client"

import { useState, useCallback, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

export type IncidentType = "BREAKDOWN" | "THEFT" | "ACCIDENT" | "OTHER"
export type IncidentStatus = "REPORTED" | "IN_PROGRESS" | "RESOLVED"

export interface Incident {
  id: string
  reservationId: string
  userId: string
  type: IncidentType
  description: string
  reportedAt: string
  status: IncidentStatus
  resolvedAt?: string
  response?: string
  createdAt: string
  updatedAt: string
  reservation?: {
    id: string
    userId: string
    vehicleId: string
    agencyId: string
    reservation_number: string
    status: string
    user?: {
      id: string
      firstName: string
      lastName: string
      email: string
    }
    vehicle?: {
      id: string
      type: string
      model: string
    }
    agency?: {
      id: string
      name: string
      address: string
    }
  }
}

export function useIncidents() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [userIncidents, setUserIncidents] = useState<Incident[]>([])
  const [currentIncident, setCurrentIncident] = useState<Incident | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Modifions seulement la fonction fetchAllIncidents pour ajouter plus de logs
  const fetchAllIncidents = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("Récupération de tous les incidents...")

      const response = await fetch("/api/incidents", {
        method: "GET",
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      console.log("Statut de la réponse:", response.status)

      // Récupérer le texte brut de la réponse pour le débogage
      const responseText = await response.text()
      console.log("Réponse brute:", responseText)

      // Essayer de parser la réponse JSON
      let data
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error("Erreur de parsing JSON:", parseError)
        throw new Error("Réponse invalide du serveur")
      }

      if (!response.ok) {
        console.error("Erreur HTTP:", response.status, data)
        throw new Error(data.error || `Erreur HTTP: ${response.status}`)
      }

      console.log("Incidents récupérés:", data?.length || 0)

      // Afficher les premiers incidents pour le débogage
      if (data && data.length > 0) {
        console.log("Premier incident:", {
          id: data[0].id,
          type: data[0].type,
          status: data[0].status,
          reservationId: data[0].reservationId,
          userId: data[0].userId,
          hasReservation: !!data[0].reservation,
          hasUser: data[0].reservation ? !!data[0].reservation.user : false,
        })
      }

      // Assurons-nous que les incidents ont toutes les informations nécessaires
      const validIncidents = data.filter(
        (incident: any) => incident && incident.reservation && incident.reservation.user,
      )

      console.log("Incidents valides après filtrage:", validIncidents.length)
      setIncidents(validIncidents || [])
      return validIncidents
    } catch (error: any) {
      console.error("Erreur lors de la récupération des incidents:", error)
      setError(error.message || "Erreur inconnue")
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les incidents. Veuillez réessayer.",
        variant: "destructive",
      })
      return []
    } finally {
      setLoading(false)
    }
  }, [toast])

  const fetchUserIncidents = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("Récupération des incidents utilisateur...")

      const response = await fetch("/api/incidents/user", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      // Même si la réponse n'est pas OK, on essaie de récupérer les données
      const data = await response.json()

      if (!response.ok) {
        const errorMessage = data.error || `Erreur HTTP: ${response.status}`
        console.error("Erreur HTTP:", response.status, errorMessage)
        throw new Error(errorMessage)
      }

      console.log("Incidents utilisateur récupérés:", data?.length || 0)
      setUserIncidents(data || [])
      return data
    } catch (error: any) {
      console.error("Erreur lors de la récupération des incidents utilisateur:", error)
      setError(error.message || "Erreur inconnue")
      // Ne pas afficher de toast pour éviter de spammer l'utilisateur
      return []
    } finally {
      setLoading(false)
    }
  }, [toast])

  const fetchIncidentById = useCallback(
    async (id: string) => {
      try {
        if (!id) {
          console.error("ID d'incident manquant")
          return null
        }

        setLoading(true)
        setError(null)
        console.log("Récupération de l'incident:", id)

        const response = await fetch(`/api/incidents/${id}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error("Erreur HTTP:", response.status, errorText)
          throw new Error(`Erreur HTTP: ${response.status}`)
        }

        const data = await response.json()
        console.log("Incident récupéré:", data)
        setCurrentIncident(data)
        return data
      } catch (error: any) {
        console.error("Erreur lors de la récupération de l'incident:", error)
        setError(error.message || "Erreur inconnue")
        toast({
          title: "Erreur",
          description: "Impossible de récupérer l'incident. Veuillez réessayer.",
          variant: "destructive",
        })
        return null
      } finally {
        setLoading(false)
      }
    },
    [toast],
  )

  const reportIncident = useCallback(
    async (data: {
      reservationId: string
      type: IncidentType
      description: string
    }) => {
      try {
        if (!data.reservationId) {
          throw new Error("ID de réservation manquant")
        }

        setLoading(true)
        setError(null)
        console.log("Signalement d'un incident:", data)

        const response = await fetch("/api/incidents", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })

        const responseData = await response.json()

        if (!response.ok) {
          console.error("Erreur HTTP:", response.status, responseData)
          throw new Error(responseData.error || `Erreur HTTP: ${response.status}`)
        }

        console.log("Incident signalé:", responseData)

        // Mettre à jour les listes d'incidents
        fetchUserIncidents()

        toast({
          title: "Incident signalé",
          description: "Votre signalement a été envoyé avec succès",
        })

        return responseData
      } catch (error: any) {
        console.error("Erreur lors du signalement de l'incident:", error)
        setError(error.message || "Erreur inconnue")
        toast({
          title: "Erreur",
          description: error.message || "Impossible de signaler l'incident. Veuillez réessayer.",
          variant: "destructive",
        })
        return null
      } finally {
        setLoading(false)
      }
    },
    [toast, fetchUserIncidents],
  )

  const updateIncidentStatus = useCallback(
    async (id: string, status: IncidentStatus, response?: string) => {
      try {
        if (!id) {
          throw new Error("ID d'incident manquant")
        }

        setLoading(true)
        setError(null)
        console.log("Mise à jour du statut de l'incident:", id, status, response)

        const r = await fetch(`/api/incidents/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status, response }),
        })

        const responseData = await r.json()

        if (!r.ok) {
          console.error("Erreur HTTP:", r.status, responseData)
          throw new Error(responseData.error || `Erreur HTTP: ${r.status}`)
        }

        console.log("Incident mis à jour:", responseData)

        // Mettre à jour l'état local
        setIncidents((prev) => prev.map((inc) => (inc.id === id ? responseData : inc)))
        setUserIncidents((prev) => prev.map((inc) => (inc.id === id ? responseData : inc)))

        if (currentIncident?.id === id) {
          setCurrentIncident(responseData)
        }

        toast({
          title: "Incident mis à jour",
          description: "Le statut de l'incident a été mis à jour avec succès",
        })

        return responseData
      } catch (error: any) {
        console.error("Erreur lors de la mise à jour de l'incident:", error)
        setError(error.message || "Erreur inconnue")
        toast({
          title: "Erreur",
          description: error.message || "Impossible de mettre à jour l'incident. Veuillez réessayer.",
          variant: "destructive",
        })
        return null
      } finally {
        setLoading(false)
      }
    },
    [toast, currentIncident],
  )

  // Effet pour récupérer les incidents au chargement
  useEffect(() => {
    // Récupérer les incidents utilisateur au chargement
    fetchUserIncidents().catch(console.error)

    // Récupérer tous les incidents pour la vue admin
    fetchAllIncidents().catch(console.error)
  }, [fetchUserIncidents, fetchAllIncidents])

  return {
    incidents,
    userIncidents,
    currentIncident,
    loading,
    error,
    fetchAllIncidents,
    fetchUserIncidents,
    fetchIncidentById,
    reportIncident,
    updateIncidentStatus,
  }
}
