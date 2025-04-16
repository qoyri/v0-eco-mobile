import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { executeRawQuery } from "@/lib/db"
import { createToken, hashPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, phoneNumber, address } = await request.json()

    // Vérifier si tous les champs requis sont fournis
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "Tous les champs requis doivent être remplis" }, { status: 400 })
    }

    // Vérifier si l'email est déjà utilisé
    const existingUserResult = await executeRawQuery(
      `
      SELECT * FROM users WHERE email = $1 LIMIT 1
    `,
      [email],
    )

    if (existingUserResult.length > 0) {
      return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 400 })
    }

    // Hacher le mot de passe
    const hashedPassword = await hashPassword(password)

    // Créer le nouvel utilisateur
    const result = await executeRawQuery(
      `
      INSERT INTO users (email, password_hash, first_name, last_name, role, phone_number, address)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, email, first_name, last_name, role
    `,
      [email, hashedPassword, firstName, lastName, "CLIENT", phoneNumber || null, address || null],
    )

    const newUser = result[0]

    // Créer le token JWT
    const token = createToken({
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.first_name,
      lastName: newUser.last_name,
      role: newUser.role,
    })

    // Définir le cookie
    cookies().set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 heures
    })

    // Retourner les informations de l'utilisateur
    return NextResponse.json({
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        role: newUser.role,
      },
    })
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error)
    return NextResponse.json({ error: "Erreur serveur lors de l'inscription" }, { status: 500 })
  }
}
