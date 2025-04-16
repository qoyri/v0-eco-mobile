import { db } from "@/lib/db"
import { incidents, reservations, users, vehicles, agencies } from "@/lib/schema"
import { eq } from "drizzle-orm"

export interface CreateIncidentInput {
  reservationId: string
  type: string
  description: string
  userId?: string
}

export interface UpdateIncidentInput {
  status?: string
  resolvedAt?: Date
  response?: string
}

export async function getAllIncidents() {
  try {
    console.log("getAllIncidents - Début de la récupération")

    // Utilisation d'une requête SQL brute pour récupérer les incidents
    const rawIncidents = await db.select().from(incidents)
    console.log("Incidents bruts récupérés:", rawIncidents?.length || 0)

    // Si nous avons des incidents bruts, essayons de récupérer les détails
    if (rawIncidents && rawIncidents.length > 0) {
      // Récupérer les détails des réservations, utilisateurs, véhicules et agences séparément
      const enrichedIncidents = await Promise.all(
        rawIncidents.map(async (incident) => {
          try {
            // Récupérer la réservation
            const reservation = incident.reservationId
              ? await db.select().from(reservations).where(eq(reservations.id, incident.reservationId)).limit(1)
              : null

            // Si nous avons une réservation, récupérer l'utilisateur, le véhicule et l'agence
            let user = null
            let vehicle = null
            let agency = null

            if (reservation && reservation.length > 0) {
              const res = reservation[0]

              // Récupérer l'utilisateur
              if (res.userId) {
                user = await db.select().from(users).where(eq(users.id, res.userId)).limit(1)
                user = user && user.length > 0 ? user[0] : null
              }

              // Récupérer le véhicule
              if (res.vehicleId) {
                vehicle = await db.select().from(vehicles).where(eq(vehicles.id, res.vehicleId)).limit(1)
                vehicle = vehicle && vehicle.length > 0 ? vehicle[0] : null
              }

              // Récupérer l'agence
              if (res.agencyId) {
                agency = await db.select().from(agencies).where(eq(agencies.id, res.agencyId)).limit(1)
                agency = agency && agency.length > 0 ? agency[0] : null
              }
            }

            // Construire l'objet enrichi
            return {
              ...incident,
              reservation:
                reservation && reservation.length > 0
                  ? {
                      ...reservation[0],
                      user: user,
                      vehicle: vehicle,
                      agency: agency,
                    }
                  : null,
            }
          } catch (error) {
            console.error("Erreur lors de l'enrichissement de l'incident:", error)
            return incident
          }
        }),
      )

      console.log("Incidents enrichis récupérés:", enrichedIncidents?.length || 0)
      return enrichedIncidents
    }

    return rawIncidents || []
  } catch (error) {
    console.error("Erreur dans getAllIncidents:", error)
    return [] // Retourner un tableau vide en cas d'erreur
  }
}

export async function getIncidentsByReservation(reservationId: string) {
  try {
    if (!reservationId) {
      console.error("ID de réservation manquant")
      return []
    }

    // Utiliser une requête simple pour éviter les problèmes de relations
    const result = await db.select().from(incidents).where(eq(incidents.reservationId, reservationId))
    return result || []
  } catch (error) {
    console.error("Erreur dans getIncidentsByReservation:", error)
    return [] // Retourner un tableau vide en cas d'erreur
  }
}

export async function getIncidentsByUser(userId: string) {
  try {
    if (!userId) {
      console.error("ID utilisateur manquant")
      return []
    }

    console.log("Recherche des incidents pour l'utilisateur:", userId)

    // Utiliser une requête simple pour éviter les problèmes potentiels
    const result = await db.select().from(incidents).where(eq(incidents.userId, userId))
    console.log("Incidents trouvés pour l'utilisateur:", result?.length || 0)
    return result || []
  } catch (error) {
    console.error("Erreur dans getIncidentsByUser:", error)
    return [] // Retourner un tableau vide en cas d'erreur
  }
}

export async function getIncidentById(id: string) {
  try {
    if (!id) {
      console.error("ID d'incident manquant")
      return null
    }

    // Utiliser une requête simple pour récupérer l'incident
    const incident = await db.select().from(incidents).where(eq(incidents.id, id)).limit(1)

    if (!incident || incident.length === 0) {
      return null
    }

    // Récupérer la réservation
    const reservation = incident[0].reservationId
      ? await db.select().from(reservations).where(eq(reservations.id, incident[0].reservationId)).limit(1)
      : null

    // Si nous avons une réservation, récupérer l'utilisateur, le véhicule et l'agence
    let user = null
    let vehicle = null
    let agency = null

    if (reservation && reservation.length > 0) {
      const res = reservation[0]

      // Récupérer l'utilisateur
      if (res.userId) {
        user = await db.select().from(users).where(eq(users.id, res.userId)).limit(1)
        user = user && user.length > 0 ? user[0] : null
      }

      // Récupérer le véhicule
      if (res.vehicleId) {
        vehicle = await db.select().from(vehicles).where(eq(vehicles.id, res.vehicleId)).limit(1)
        vehicle = vehicle && vehicle.length > 0 ? vehicle[0] : null
      }

      // Récupérer l'agence
      if (res.agencyId) {
        agency = await db.select().from(agencies).where(eq(agencies.id, res.agencyId)).limit(1)
        agency = agency && agency.length > 0 ? agency[0] : null
      }
    }

    // Construire l'objet enrichi
    return {
      ...incident[0],
      reservation:
        reservation && reservation.length > 0
          ? {
              ...reservation[0],
              user: user,
              vehicle: vehicle,
              agency: agency,
            }
          : null,
    }
  } catch (error) {
    console.error("Erreur dans getIncidentById:", error)
    return null
  }
}

export async function createIncident(input: CreateIncidentInput) {
  try {
    if (!input.reservationId) {
      throw new Error("ID de réservation manquant")
    }

    console.log("Création d'un incident avec les données:", input)

    // Si l'ID utilisateur n'est pas fourni, récupérer l'ID de l'utilisateur à partir de la réservation
    let userId = input.userId

    if (!userId) {
      const reservation = await db.select().from(reservations).where(eq(reservations.id, input.reservationId)).limit(1)

      if (!reservation || reservation.length === 0) {
        throw new Error("Réservation introuvable")
      }

      userId = reservation[0].userId
      console.log("ID utilisateur récupéré de la réservation:", userId)
    }

    // Vérifier que le type est valide
    let incidentType = input.type
    if (!["BREAKDOWN", "THEFT", "ACCIDENT", "OTHER"].includes(incidentType)) {
      // Convertir les types français en anglais
      if (input.type === "panne") incidentType = "BREAKDOWN"
      else if (input.type === "vol") incidentType = "THEFT"
      else if (input.type === "accident") incidentType = "ACCIDENT"
      else incidentType = "OTHER"
    }

    const newIncident = {
      reservationId: input.reservationId,
      userId: userId,
      type: incidentType,
      description: input.description,
      status: "REPORTED",
      reportedAt: new Date(),
      updatedAt: new Date(),
    }

    console.log("Insertion de l'incident:", newIncident)

    const result = await db.insert(incidents).values(newIncident).returning()

    console.log("Incident créé:", result[0])
    return result[0]
  } catch (error) {
    console.error("Erreur dans createIncident:", error)
    throw error
  }
}

export async function updateIncidentStatus(id: string, status: string, response?: string) {
  try {
    if (!id) {
      throw new Error("ID d'incident manquant")
    }

    const updates: any = {
      status: status,
      updatedAt: new Date(),
    }

    if (status === "RESOLVED") {
      updates.resolvedAt = new Date()
    }

    if (response) {
      updates.response = response
    }

    const result = await db.update(incidents).set(updates).where(eq(incidents.id, id)).returning()

    return result[0]
  } catch (error) {
    console.error("Erreur dans updateIncidentStatus:", error)
    throw error
  }
}
