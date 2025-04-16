import { db } from "@/lib/db"
import { agencies } from "@/lib/schema"
import { eq } from "drizzle-orm"

export interface CreateAgencyInput {
  name: string
  address: string
  city: string
  zipCode: string
  phoneNumber: string
  openingHours: string
  isActive?: boolean
}

export interface UpdateAgencyInput {
  name?: string
  address?: string
  city?: string
  zipCode?: string
  phoneNumber?: string
  openingHours?: string
  isActive?: boolean
}

export async function getAllAgencies() {
  return await db.query.agencies.findMany({
    orderBy: (agencies, { asc }) => [asc(agencies.name)],
  })
}

export async function getActiveAgencies() {
  return await db.query.agencies.findMany({
    where: eq(agencies.isActive, true),
    orderBy: (agencies, { asc }) => [asc(agencies.name)],
  })
}

export async function getAgencyById(id: string) {
  return await db.query.agencies.findFirst({
    where: eq(agencies.id, id),
  })
}

export async function createAgency(input: CreateAgencyInput) {
  const result = await db
    .insert(agencies)
    .values({
      name: input.name,
      address: input.address,
      city: input.city,
      zipCode: input.zipCode,
      phoneNumber: input.phoneNumber,
      openingHours: input.openingHours,
      isActive: input.isActive !== undefined ? input.isActive : true,
    })
    .returning()

  return result[0]
}

export async function updateAgency(id: string, input: UpdateAgencyInput) {
  const result = await db
    .update(agencies)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(agencies.id, id))
    .returning()

  return result[0]
}

export async function deleteAgency(id: string) {
  return await db.delete(agencies).where(eq(agencies.id, id)).returning()
}
