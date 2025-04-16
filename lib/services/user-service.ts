import { db } from "@/lib/db"
import { users } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { hashPassword } from "@/lib/auth"

export interface CreateUserInput {
  email: string
  password: string
  firstName: string
  lastName: string
  role?: string
  phoneNumber?: string
  address?: string
}

export interface UpdateUserInput {
  firstName?: string
  lastName?: string
  phoneNumber?: string
  address?: string
}

export async function getAllUsers() {
  return await db.query.users.findMany({
    orderBy: (users, { asc }) => [asc(users.lastName), asc(users.firstName)],
  })
}

export async function getUserById(id: string) {
  return await db.query.users.findFirst({
    where: eq(users.id, id),
  })
}

export async function getUserByEmail(email: string) {
  return await db.query.users.findFirst({
    where: eq(users.email, email),
  })
}

export async function createUser(input: CreateUserInput) {
  const hashedPassword = await hashPassword(input.password)

  const result = await db
    .insert(users)
    .values({
      email: input.email,
      passwordHash: hashedPassword,
      firstName: input.firstName,
      lastName: input.lastName,
      role: (input.role || "CLIENT") as any,
      phoneNumber: input.phoneNumber,
      address: input.address,
    })
    .returning()

  return result[0]
}

export async function updateUser(id: string, input: UpdateUserInput) {
  const result = await db
    .update(users)
    .set({
      firstName: input.firstName,
      lastName: input.lastName,
      phoneNumber: input.phoneNumber,
      address: input.address,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning()

  return result[0]
}

export async function updatePassword(id: string, newPassword: string) {
  const hashedPassword = await hashPassword(newPassword)

  const result = await db
    .update(users)
    .set({
      passwordHash: hashedPassword,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning()

  return result[0]
}

export async function deleteUser(id: string) {
  return await db.delete(users).where(eq(users.id, id)).returning()
}
