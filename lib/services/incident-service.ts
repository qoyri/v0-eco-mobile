import { db } from "@/lib/db"
import { incidents } from "@/lib/schema"
import { eq } from "drizzle-orm"

export interface CreateIncidentInput {
  reservationId: string
  type: string
  description: string
}

export interface UpdateIncidentInput {
  status?: string
  resolvedAt?: Date
}

export async function getAllIncidents() {
  return await db.query.incidents.findMany({
    with: {
      reservation: {
        with: {
          user: true,
          vehicle: true,
        },
      },
    },
    orderBy: (incidents, { desc }) => [desc(incidents.reportedAt)],
  })
}

export async function getIncidentsByReservation(reservationId: string) {
  return await db.query.incidents.findMany({
    where: eq(incidents.reservationId, reservationId),
    orderBy: (incidents, { desc }) => [desc(incidents.reportedAt)],
  })
}

export async function getIncidentById(id: string) {
  return await db.query.incidents.findFirst({
    where: eq(incidents.id, id),
    with: {
      reservation: {
        with: {
          user: true,
          vehicle: true,
        },
      },
    },
  })
}

export async function createIncident(input: CreateIncidentInput) {
  const result = await db
    .insert(incidents)
    .values({
      reservationId: input.reservationId,
      type: input.type as any,
      description: input.description,
      status: "REPORTED",
      reportedAt: new Date(),
    })
    .returning()

  return result[0]
}

export async function updateIncidentStatus(id: string, status: string) {
  const updates: any = {
    status: status as any,
    updatedAt: new Date(),
  }

  if (status === "RESOLVED") {
    updates.resolvedAt = new Date()
  }

  const result = await db.update(incidents).set(updates).where(eq(incidents.id, id)).returning()

  return result[0]
}
