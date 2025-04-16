import { db } from "@/lib/db"
import { reservations } from "@/lib/schema"
import { eq, and, between, gte, lte } from "drizzle-orm"
import { generateReservationNumber } from "@/lib/db"

export interface CreateReservationInput {
  userId: string
  vehicleId: string
  agencyId: string
  startDate: Date
  duration: number
  totalAmount: number
}

export interface UpdateReservationInput {
  status?: string
  paymentStatus?: string
}

export interface ReservationFilter {
  agencyId?: string
  status?: string
  startDate?: Date
  endDate?: Date
}

export async function getAllReservations(filter?: ReservationFilter) {
  let query = undefined

  if (filter) {
    if (filter.agencyId) {
      query = eq(reservations.agencyId, filter.agencyId)
    }

    if (filter.status) {
      const statusCondition = eq(reservations.status, filter.status)
      query = query ? and(query, statusCondition) : statusCondition
    }

    if (filter.startDate && filter.endDate) {
      const dateCondition = between(reservations.startDate, filter.startDate, filter.endDate)
      query = query ? and(query, dateCondition) : dateCondition
    } else if (filter.startDate) {
      const dateCondition = gte(reservations.startDate, filter.startDate)
      query = query ? and(query, dateCondition) : dateCondition
    } else if (filter.endDate) {
      const dateCondition = lte(reservations.startDate, filter.endDate)
      query = query ? and(query, dateCondition) : dateCondition
    }
  }

  return await db.query.reservations.findMany({
    where: query,
    with: {
      user: true,
      vehicle: true,
      agency: true,
    },
    orderBy: (reservations, { desc }) => [desc(reservations.createdAt)],
  })
}

export async function getReservationsByUser(userId: string, filter?: ReservationFilter) {
  let query = eq(reservations.userId, userId)

  if (filter) {
    if (filter.status) {
      query = and(query, eq(reservations.status, filter.status))
    }

    if (filter.startDate && filter.endDate) {
      query = and(query, between(reservations.startDate, filter.startDate, filter.endDate))
    } else if (filter.startDate) {
      query = and(query, gte(reservations.startDate, filter.startDate))
    } else if (filter.endDate) {
      query = and(query, lte(reservations.startDate, filter.endDate))
    }
  }

  return await db.query.reservations.findMany({
    where: query,
    with: {
      vehicle: true,
      agency: true,
    },
    orderBy: (reservations, { desc }) => [desc(reservations.createdAt)],
  })
}

export async function getReservationById(id: string) {
  return await db.query.reservations.findFirst({
    where: eq(reservations.id, id),
    with: {
      user: true,
      vehicle: true,
      agency: true,
    },
  })
}

export async function getReservationByNumber(reservationNumber: string) {
  return await db.query.reservations.findFirst({
    where: eq(reservations.reservationNumber, reservationNumber),
    with: {
      user: true,
      vehicle: true,
      agency: true,
    },
  })
}

export async function createReservation(input: CreateReservationInput) {
  // Calculer la date de fin
  const startDate = new Date(input.startDate)
  const endDate = new Date(startDate)
  endDate.setHours(endDate.getHours() + input.duration)

  // Générer un numéro de réservation unique
  const reservationNumber = await generateReservationNumber()

  const result = await db
    .insert(reservations)
    .values({
      reservationNumber,
      userId: input.userId,
      vehicleId: input.vehicleId,
      agencyId: input.agencyId,
      startDate,
      endDate,
      duration: input.duration,
      totalAmount: input.totalAmount,
      status: "PENDING",
      paymentStatus: "PENDING",
    })
    .returning()

  return result[0]
}

export async function updateReservationStatus(id: string, status: string) {
  const result = await db
    .update(reservations)
    .set({
      status: status as any,
      updatedAt: new Date(),
    })
    .where(eq(reservations.id, id))
    .returning()

  return result[0]
}

export async function updateReservationPaymentStatus(id: string, paymentStatus: string) {
  const result = await db
    .update(reservations)
    .set({
      paymentStatus: paymentStatus as any,
      updatedAt: new Date(),
    })
    .where(eq(reservations.id, id))
    .returning()

  return result[0]
}

export async function cancelReservation(id: string) {
  const result = await db
    .update(reservations)
    .set({
      status: "CANCELLED",
      updatedAt: new Date(),
    })
    .where(eq(reservations.id, id))
    .returning()

  return result[0]
}
