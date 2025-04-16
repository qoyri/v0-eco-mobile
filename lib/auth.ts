import { compare, hash } from "bcryptjs"
import { sign, verify } from "jsonwebtoken"
import { cookies } from "next/headers"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const SALT_ROUNDS = 10

export interface UserSession {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
}

// Hacher un mot de passe
export async function hashPassword(password: string): Promise<string> {
  return await hash(password, SALT_ROUNDS)
}

// Vérifier un mot de passe
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await compare(password, hashedPassword)
}

// Créer un token JWT
export function createToken(user: UserSession): string {
  return sign(
    {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "24h" },
  )
}

// Vérifier un token JWT
export function verifyToken(token: string): UserSession | null {
  try {
    return verify(token, JWT_SECRET) as UserSession
  } catch (error) {
    return null
  }
}

// Obtenir l'utilisateur actuel à partir du cookie
export async function getCurrentUser(): Promise<UserSession | null> {
  const cookieStore = cookies()
  const token = (await cookieStore).get("auth-token")?.value

  if (!token) {
    return null
  }

  return verifyToken(token)
}

// Vérifier si l'utilisateur est authentifié
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser()
  return user !== null
}

// Vérifier si l'utilisateur a un rôle spécifique
export async function hasRole(role: string | string[]): Promise<boolean> {
  const user = await getCurrentUser()

  if (!user) {
    return false
  }

  if (Array.isArray(role)) {
    return role.includes(user.role)
  }

  return user.role === role
}
