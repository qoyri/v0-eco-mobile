import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { executeRawQuery } from "@/lib/db"
import { createToken, verifyPassword } from "@/lib/auth"

// Ajouter cette ligne pour le mode d'exportation statique
export const dynamic = "force-static"

export async function POST(request: NextRequest) {
  try {
    const { email, password, reservationNumber } = await request.json()

    // Vérifier si l'email est fourni
    if (!email) {
      return NextResponse.json({ error: "Email requis" }, { status: 400 })
    }

    // Rechercher l'utilisateur par email
    const result = await executeRawQuery(
      `
      SELECT * FROM users WHERE email = $1 LIMIT 1
    `,
      [email],
    )

    const user = result[0]

    if (!user) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 })
    }

    // Authentification par mot de passe
    if (password) {
      const isPasswordValid = await verifyPassword(password, user.password_hash)

      if (!isPasswordValid) {
        return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 })
      }
    }
    // Authentification par numéro de réservation
    else if (reservationNumber) {
      const reservationResult = await executeRawQuery(
        `
        SELECT * FROM reservations 
        WHERE reservation_number = $1 AND user_id = $2 
        LIMIT 1
      `,
        [reservationNumber, user.id],
      )

      const reservation = reservationResult[0]

      if (!reservation) {
        return NextResponse.json({ error: "Email ou numéro de réservation incorrect" }, { status: 401 })
      }
    } else {
      return NextResponse.json({ error: "Mot de passe ou numéro de réservation requis" }, { status: 400 })
    }

    // Créer le token JWT
    const token = createToken({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
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

    // Retourner les informations de l'utilisateur (sans le mot de passe)
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Erreur lors de la connexion:", error)
    return NextResponse.json({ error: "Erreur serveur lors de la connexion" }, { status: 500 })
  }
}
