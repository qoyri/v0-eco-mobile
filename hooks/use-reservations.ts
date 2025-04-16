"use client"

import { useState, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"

// Données fictives pour le mode statique
const MOCK_RESERVATIONS = [
  {
    id: "reservation-1",
    reservation_number: "ECO-12345",
    user_id: "user-1",
    vehicle_id: "vehicle-1",
    agency_id: "agency-1",
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 3600000).toISOString(),
    duration: 1,
    status: "CONFIRMED",
    total_amount: 15,
    payment_status: "PAID",
    vehicle_type: "BIKE",
    vehicle_model: "City Explorer",
    agency_name: "Eco Mobile Annecy Centre",
    agency_city: "Annecy",
  },
  {
    id: "reservation-2",
    reservation_number: "ECO-12346",
    user_id: "user-1",
    vehicle_id: "vehicle-2",
    agency_id: "agency-1",
    start_date: new Date(Date.now() - 86400000).toISOString(), // Hier
    end_date: new Date(Date.now() - 86400000 + 7200000).toISOString(),
    duration: 2,
    status: "COMPLETED",
    total_amount: 25,
    payment_status: "PAID",
    vehicle_type: "SCOOTER",
    vehicle_model: "Urban Glide",
    agency_name: "Eco Mobile Annecy Centre",
    agency_city: "Annecy",
  },
]

const MOCK_ACTIVE_RESERVATION = {
  id: "reservation-3",
  reservation_number: "ECO-12347",
  user_id: "user-1",
  vehicle_id: "vehicle-3",
  agency_id: "agency-2",
  start_date: new Date().toISOString(),
  end_date: new Date(Date.now() + 14400000).toISOString(), // +4h
  duration: 4,
  status: "IN_PROGRESS",
  total_amount: 40,
  payment_status: "PAID",
  vehicle_type: "BIKE",
  vehicle_model: "Mountain Explorer",
  agency_name: "Eco Mobile Annecy Lac",
  agency_city: "Annecy",
}

const MOCK_RESERVATION_DETAILS = {
  id: "reservation-1",
  reservation_number: "ECO-12345",
  user_id: "user-1",
  vehicle_id: "vehicle-1",
  agency_id: "agency-1",
  start_date: new Date().toISOString(),
  end_date: new Date(Date.now() + 3600000).toISOString(),
  duration: 1,
  status: "CONFIRMED",
  total_amount: 15,
  payment_status: "PAID",
  vehicle_type: "BIKE",
  vehicle_model: "City Explorer",
  vehicle_autonomy: 80,
  agency_name: "Eco Mobile Annecy Centre",
  agency_city: "Annecy",
  agency_address: "15 rue de la République, 74000 Annecy",
}

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

        // Simuler un délai réseau
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Utiliser des données fictives
        setReservations(MOCK_RESERVATIONS)
        setActiveReservation(MOCK_ACTIVE_RESERVATION)

        return MOCK_RESERVATIONS
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

        // Simuler un délai réseau
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Utiliser des données fictives
        setReservationDetails(MOCK_RESERVATION_DETAILS)

        return MOCK_RESERVATION_DETAILS
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

        // Simuler un délai réseau
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Créer une réservation fictive
        const newReservation = {
          id: `reservation-${Date.now()}`,
          reservation_number: `ECO-${Math.floor(10000 + Math.random() * 90000)}`,
          user_id: "user-1",
          vehicle_id: reservationData.vehicleId,
          agency_id: reservationData.agencyId,
          start_date: reservationData.startDate.toISOString(),
          end_date: new Date(reservationData.startDate.getTime() + reservationData.duration * 3600000).toISOString(),
          duration: reservationData.duration,
          status: "PENDING",
          total_amount: 15 * reservationData.duration,
          payment_status: "PENDING",
          vehicle_type: "BIKE",
          vehicle_model: "City Explorer",
          agency_name: "Eco Mobile Annecy Centre",
          agency_city: "Annecy",
        }

        toast({
          title: "Réservation créée",
          description: `Votre réservation a été créée avec succès. Numéro: ${newReservation.reservation_number}`,
        })

        return newReservation
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

        // Simuler un délai réseau
        await new Promise((resolve) => setTimeout(resolve, 1000))

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

        return { id, status: action === "cancel" ? "CANCELLED" : action === "complete" ? "COMPLETED" : "IN_PROGRESS" }
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

        // Simuler un délai réseau
        await new Promise((resolve) => setTimeout(resolve, 1000))

        toast({
          title: "Succès",
          description: "La réservation a été modifiée avec succès",
        })

        return {
          ...MOCK_RESERVATION_DETAILS,
          start_date: data.startDate.toISOString(),
          end_date: new Date(data.startDate.getTime() + data.duration * 3600000).toISOString(),
          duration: data.duration,
        }
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

        // Simuler un délai réseau
        await new Promise((resolve) => setTimeout(resolve, 1000))

        toast({
          title: "Incident signalé",
          description: "Votre signalement a été envoyé avec succès",
        })

        return {
          id: `incident-${Date.now()}`,
          reservationId: data.reservationId,
          type: data.type,
          description: data.description,
          status: "REPORTED",
          reportedAt: new Date().toISOString(),
        }
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
