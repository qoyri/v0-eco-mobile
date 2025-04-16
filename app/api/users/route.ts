import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { executeRawQuery } from "@/lib/db"

// Ajouter cette ligne pour le mode d'exportation statique
export const dynamic = "force-static"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    if (user.role !== "ADMIN" && user.role !== "MANAGER") {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
    }

    const users = await executeRawQuery(`
      SELECT id, email, first_name, last_name, role, phone_number, address, created_at, updated_at
      FROM users
      ORDER BY last_name ASC, first_name ASC
    `)

    return NextResponse.json(users)
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
    }

    const data = await request.json()

    // Vérifier si l'email existe déjà
    const existingUser = await executeRawQuery(
      `
      SELECT * FROM users WHERE email = $1 LIMIT 1
    `,
      [data.email],
    )

    if (existingUser.length > 0) {
      return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 400 })
    }

    const newUser = await executeRawQuery(
      `
      INSERT INTO users (
        email, password_hash, first_name, last_name, role, phone_number, address
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, email, first_name, last_name, role, phone_number, address, created_at, updated_at
    `,
      [
        data.email,
        data.password,
        data.firstName,
        data.lastName,
        data.role || "CLIENT",
        data.phoneNumber || null,
        data.address || null,
      ],
    )

    return NextResponse.json(newUser[0], { status: 201 })
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
