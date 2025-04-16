import { type NextRequest, NextResponse } from "next/server"
import { executeRawQuery } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const { reservationId, type, description } = await request.json()

    // Vérifier si tous les champs requis sont fournis
    if (!reservationId || !type || !description) {
      return NextResponse.json({ error: "Tous les champs requis doivent être remplis" }, { status: 400 })
    }

    // Vérifier si la réservation existe et appartient à l'utilisateur
    const reservationResult = await executeRawQuery(
      `
      SELECT * FROM reservations WHERE id = $1 LIMIT 1
    `,
      [reservationId],
    )

    if (reservationResult.length === 0) {
      return NextResponse.json({ error: "Réservation non trouvée" }, { status: 404 })
    }

    const reservation = reservationResult[0]

    // Vérifier que l'utilisateur a le droit de signaler un incident sur cette réservation
    if (user.role !== "ADMIN" && user.role !== "MANAGER" && reservation.user_id !== user.id) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
    }

    // Créer l'incident
    const result = await executeRawQuery(
      `
      INSERT INTO incidents (reservation_id, type, description, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
      [reservationId, type, description, "REPORTED"],
    )

    const newIncident = result[0]

    return NextResponse.json(newIncident)
  } catch (error) {
    console.error("Erreur lors de la création de l'incident:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
