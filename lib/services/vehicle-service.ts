import { db } from "@/lib/db"
import { vehicles, reservations } from "@/lib/schema"
import { eq, and, or, between, gte, lte, not } from "drizzle-orm"

export interface CreateVehicleInput {
  type: string
  model: string
  description?: string
  autonomy: number
  status?: string
  agencyId: string
  hourlyRate: number
}

export interface UpdateVehicleInput {
  type?: string
  model?: string
  description?: string
  autonomy?: number
  status?: string
  agencyId?: string
  hourlyRate?: number
  maintenanceCount?: number
  lastMaintenanceDate?: Date
}

export async function getAllVehicles() {
  return await db.query.vehicles.findMany({
    with: {
      agency: true,
    },
    orderBy: (vehicles, { asc }) => [asc(vehicles.type), asc(vehicles.model)],
  })
}

export async function getVehiclesByAgency(agencyId: string) {
  return await db.query.vehicles.findMany({
    where: eq(vehicles.agencyId, agencyId),
    with: {
      agency: true,
    },
    orderBy: (vehicles, { asc }) => [asc(vehicles.type), asc(vehicles.model)],
  })
}

export async function getAvailableVehicles(agencyId?: string, type?: string) {
  let query = eq(vehicles.status, "AVAILABLE")

  if (agencyId) {
    query = and(query, eq(vehicles.agencyId, agencyId))
  }

  if (type) {
    query = and(query, eq(vehicles.type, type))
  }

  return await db.query.vehicles.findMany({
    where: query,
    with: {
      agency: true,
    },
    orderBy: (vehicles, { asc }) => [asc(vehicles.hourlyRate)],
  })
}

export async function getVehicleById(id: string) {
  return await db.query.vehicles.findFirst({
    where: eq(vehicles.id, id),
    with: {
      agency: true,
    },
  })
}

export async function createVehicle(input: CreateVehicleInput) {
  const result = await db
    .insert(vehicles)
    .values({
      type: input.type as any,
      model: input.model,
      description: input.description,
      autonomy: input.autonomy,
      status: (input.status || "AVAILABLE") as any,
      agencyId: input.agencyId,
      hourlyRate: input.hourlyRate,
    })
    .returning()

  return result[0]
}

export async function updateVehicle(id: string, input: UpdateVehicleInput) {
  const result = await db
    .update(vehicles)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(vehicles.id, id))
    .returning()

  return result[0]
}

export async function updateVehicleStatus(id: string, status: string) {
  const result = await db
    .update(vehicles)
    .set({
      status: status as any,
      updatedAt: new Date(),
    })
    .where(eq(vehicles.id, id))
    .returning()

  return result[0]
}

export async function deleteVehicle(id: string) {
  return await db.delete(vehicles).where(eq(vehicles.id, id)).returning()
}

export async function checkVehicleAvailability(vehicleId: string, startDate: Date, endDate: Date) {
  // Vérifier si le véhicule est disponible
  const vehicleResult = await db.query.vehicles.findFirst({
    where: eq(vehicles.id, vehicleId),
  })

  if (!vehicleResult || vehicleResult.status !== "AVAILABLE") {
    return false
  }

  // Vérifier s'il n'y a pas de réservation qui chevauche la période demandée
  const reservationsResult = await db.query.reservations.findMany({
    where: and(
      eq(reservations.vehicleId, vehicleId),
      or(
        between(reservations.startDate, startDate, endDate),
        between(reservations.endDate, startDate, endDate),
        and(lte(reservations.startDate, startDate), gte(reservations.endDate, endDate)),
      ),
      not(eq(reservations.status, "CANCELLED")),
      not(eq(reservations.status, "COMPLETED")),
    ),
  })

  return reservationsResult.length === 0
}
