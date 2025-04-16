"use client"

import { useState, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"

interface Reservation {
  id: string
  reservation_number: string
  user_id: string
  vehicle_id: string
  agency_id: string
  start_date: string
  end_date: string
  duration: number
  status: string
  total_amount: number
  payment_status: string
  vehicle_type?: string
  vehicle_model?: string
  agency_name?: string
  agency_city?: string
  agency_address?: string
}

interface ReservationDetails extends Reservation {
  vehicle_autonomy?: number
  agency_zip_code?: string
  agency_phone?: string
}

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [activeReservation, setActiveReservation] = useState<Reservation | null>(null)
  const [reservationDetails, setReservationDetails] = useState<ReservationDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const fetchReservations = useCallback(
    async (status?: string) => {
      try {
        setLoading(true)

        const url = status ? `/api/reservations?status=${status}` : "/api/reservations"
        const response = await fetch(url)

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Erreur lors de la récupération des réservations")
        }

        const data = await response.json()
        setReservations(data)

        // Définir la réservation active (si elle existe)
        const active = data.find((r: Reservation) => r.status === "IN_PROGRESS")
        setActiveReservation(active || null)

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

  const fetchReservationDetails = useCallback(
    async (id: string) => {
      try {
        setLoading(true)
        console.log("Fetching reservation details for ID:", id)

        const response = await fetch(`/api/reservations/${id}`)

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Erreur lors de la récupération des détails de la réservation")
        }

        const data = await response.json()
        console.log("Reservation details:", data)
        setReservationDetails(data)

        return data
      } catch (error: any) {
        console.error("Error fetching reservation details:", error)
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive",
        })
        return null
      } finally {
        setLoading(false)
      }
    },
    [toast],
  )

  const createReservation = useCallback(
    async (reservationData: {
      vehicleId: string
      agencyId: string
      startDate: Date
      duration: number
    }) => {
      try {
        setLoading(true)

        const response = await fetch("/api/reservations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reservationData),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Erreur lors de la création de la réservation")
        }

        const data = await response.json()

        toast({
          title: "Réservation créée",
          description: `Votre réservation a été créée avec succès. Numéro: ${data.reservation_number}`,
        })

        return data
      } catch (error: any) {
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive",
        })
        return null
      } finally {
        setLoading(false)
      }
    },
    [toast],
  )

  const updateReservation = useCallback(
    async (id: string, action: "cancel" | "validate" | "start" | "complete") => {
      try {
        setLoading(true)

        const response = await fetch(`/api/reservations/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || `Erreur lors de l'action ${action}`)
        }

        const data = await response.json()

        let message = ""
        switch (action) {
          case "cancel":
            message = "Votre réservation a été annulée avec succès"
            break
          case "validate":
            message = "La réservation a été validée avec succès"
            break
          case "start":
            message = "La réservation a été démarrée avec succès"
            break
          case "complete":
            message = "La réservation a été terminée avec succès"
            break
        }

        toast({
          title: "Succès",
          description: message,
        })

        return data
      } catch (error: any) {
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive",
        })
        return null
      } finally {
        setLoading(false)
      }
    },
    [toast],
  )

  const editReservation = useCallback(
    async (
      id: string,
      data: {
        startDate: Date
        duration: number
      },
    ) => {
      try {
        setLoading(true)

        const response = await fetch(`/api/reservations/${id}/edit`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || `Erreur lors de la modification de la réservation`)
        }

        const data = await response.json()

        toast({
          title: "Succès",
          description: "La réservation a été modifiée avec succès",
        })

        return data
      } catch (error: any) {
        toast({
          title: "Erreur",
          description: error.message,
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
      type: string
      description: string
    }) => {
      try {
        setLoading(true)

        const response = await fetch("/api/incidents", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Erreur lors du signalement de l'incident")
        }

        const responseData = await response.json()

        toast({
          title: "Incident signalé",
          description: "Votre signalement a été envoyé avec succès",
        })

        return responseData
      } catch (error: any) {
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive",
        })
        return null
      } finally {
        setLoading(false)
      }
    },
    [toast],
  )

  return {
    reservations,
    activeReservation,
    reservationDetails,
    loading,
    fetchReservations,
    fetchReservationDetails,
    createReservation,
    updateReservation,
    editReservation,
    reportIncident,
  }
}
