"use client"

import { useState, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"

export function useReservations() {
  const [loading, setLoading] = useState(false)
  const [reservations, setReservations] = useState<any[]>([])
  const [reservationDetails, setReservationDetails] = useState<any | null>(null)
  const { toast } = useToast()

  // Récupérer les réservations de l'utilisateur
  const fetchReservations = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/reservations", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des réservations")
      }

      const data = await response.json()
      setReservations(data)
      return data
    } catch (error) {
      console.error("Erreur lors de la récupération des réservations:", error)
      toast({
        title: "Erreur",
        description: "Impossible de récupérer vos réservations. Veuillez réessayer.",
        variant: "destructive",
      })
      return []
    } finally {
      setLoading(false)
    }
  }, [toast])

  // Récupérer les détails d'une réservation
  const fetchReservationDetails = useCallback(
    async (id: string) => {
      setLoading(true)
      try {
        const response = await fetch(`/api/reservations/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des détails de la réservation")
        }

        const data = await response.json()
        setReservationDetails(data)
        return data
      } catch (error) {
        console.error("Erreur lors de la récupération des détails de la réservation:", error)
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les détails de la réservation. Veuillez réessayer.",
          variant: "destructive",
        })
        setReservationDetails(null)
        return null
      } finally {
        setLoading(false)
      }
    },
    [toast],
  )

  // Créer une nouvelle réservation
  const createReservation = useCallback(
    async (reservationData: any) => {
      try {
        const response = await fetch("/api/reservations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reservationData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Erreur lors de la création de la réservation")
        }

        const data = await response.json()
        return data
      } catch (error) {
        console.error("Erreur lors de la création de la réservation:", error)
        toast({
          title: "Erreur",
          description: error.message || "Impossible de créer la réservation. Veuillez réessayer.",
          variant: "destructive",
        })
        throw error
      }
    },
    [toast],
  )

  // Mettre à jour une réservation (annuler, etc.)
  const updateReservation = useCallback(
    async (id: string, action: string) => {
      try {
        const response = await fetch(`/api/reservations/${id}/edit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Erreur lors de la mise à jour de la réservation")
        }

        const data = await response.json()
        return data
      } catch (error) {
        console.error("Erreur lors de la mise à jour de la réservation:", error)
        toast({
          title: "Erreur",
          description: error.message || "Impossible de mettre à jour la réservation. Veuillez réessayer.",
          variant: "destructive",
        })
        throw error
      }
    },
    [toast],
  )

  // Signaler un incident
  const reportIncident = useCallback(
    async (incidentData: { reservationId: string; type: string; description: string }) => {
      try {
        console.log("Envoi des données d'incident:", incidentData)

        const response = await fetch("/api/incidents", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(incidentData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          console.error("Erreur de réponse:", errorData)
          throw new Error(errorData.error || "Erreur lors du signalement de l'incident")
        }

        const data = await response.json()
        console.log("Réponse du signalement d'incident:", data)
        return data
      } catch (error) {
        console.error("Erreur lors du signalement de l'incident:", error)
        toast({
          title: "Erreur",
          description: error.message || "Impossible de signaler l'incident. Veuillez réessayer.",
          variant: "destructive",
        })
        throw error
      }
    },
    [toast],
  )

  return {
    loading,
    reservations,
    reservationDetails,
    fetchReservations,
    fetchReservationDetails,
    createReservation,
    updateReservation,
    reportIncident,
  }
}
