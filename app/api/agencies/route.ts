import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { executeRawQuery } from "@/lib/db"

// Changer de force-static à force-dynamic
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    // Récupérer uniquement les agences actives pour les utilisateurs non authentifiés
    const { searchParams } = new URL(request.url)
    const showAll = searchParams.get("showAll") === "true"

    const currentUser = await getCurrentUser()

    // Si showAll est demandé et que l'utilisateur est admin ou manager, renvoyer toutes les agences
    if (showAll && currentUser && (currentUser.role === "ADMIN" || currentUser.role === "MANAGER")) {
      const agencies = await executeRawQuery(`
        SELECT * FROM agencies
        ORDER BY name ASC
      `)
      return NextResponse.json(agencies)
    }

    // Sinon, renvoyer uniquement les agences actives
    const agencies = await executeRawQuery(`
      SELECT * FROM agencies
      WHERE is_active = true
      ORDER BY name ASC
    `)
    return NextResponse.json(agencies)
  } catch (error) {
    console.error("Erreur lors de la récupération des agences:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    if (currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
    }

    const data = await request.json()

    const newAgency = await executeRawQuery(
      `
      INSERT INTO agencies (
        name, address, city, zip_code, phone_number, opening_hours, is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `,
      [
        data.name,
        data.address,
        data.city,
        data.zipCode,
        data.phoneNumber,
        data.openingHours,
        data.isActive !== undefined ? data.isActive : true,
      ],
    )

    return NextResponse.json(newAgency[0], { status: 201 })
  } catch (error) {
    console.error("Erreur lors de la création de l'agence:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
