import { type NextRequest, NextResponse } from "next/server"
import { executeRawQuery } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    // Attendre la résolution de params pour accéder à id
    const { id } = await params
    const { startDate, duration } = await request.json()

    // Récupérer la réservation
    const reservationResult = await executeRawQuery(
      `
      SELECT * FROM reservations WHERE id = $1 LIMIT 1
    `,
      [id],
    )

    if (reservationResult.length === 0) {
      return NextResponse.json({ error: "Réservation non trouvée" }, { status: 404 })
    }

    const reservation = reservationResult[0]

    // Vérifier que l'utilisateur a le droit de modifier cette réservation
    if (user.role !== "ADMIN" && user.role !== "MANAGER" && reservation.user_id !== user.id) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
    }

    // Vérifier que la réservation peut être modifiée
    if (reservation.status !== "PENDING" && reservation.status !== "CONFIRMED") {
      return NextResponse.json({ error: "Cette réservation ne peut plus être modifiée" }, { status: 400 })
    }

    // Calculer la date de fin
    const start = new Date(startDate)
    const end = new Date(start)
    end.setHours(end.getHours() + Number.parseInt(duration))

    // Vérifier la disponibilité du véhicule pour cette nouvelle période
    const availabilityResult = await executeRawQuery(
      `
      SELECT * FROM reservations 
      WHERE vehicle_id = $1 
        AND id != $2
        AND status NOT IN ('CANCELLED', 'COMPLETED')
        AND (
          (start_date <= $3 AND end_date >= $3) OR
          (start_date <= $4 AND end_date >= $4) OR
          (start_date >= $3 AND end_date <= $4)
        )
      LIMIT 1
    `,
      [reservation.vehicle_id, id, start, end],
    )

    if (availabilityResult.length > 0) {
      return NextResponse.json({ error: "Ce véhicule n'est pas disponible pour la période demandée" }, { status: 400 })
    }

    // Récupérer les informations du véhicule pour calculer le nouveau montant
    const vehicleResult = await executeRawQuery(
      `
      SELECT * FROM vehicles WHERE id = $1 LIMIT 1
    `,
      [reservation.vehicle_id],
    )

    const vehicle = vehicleResult[0]
    const totalAmount = vehicle.hourly_rate * Number.parseInt(duration)

    // Mettre à jour la réservation
    const result = await executeRawQuery(
      `
      UPDATE reservations
      SET start_date = $1, end_date = $2, duration = $3, total_amount = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
    `,
      [start, end, duration, totalAmount, id],
    )

    const updatedReservation = result[0]

    return NextResponse.json(updatedReservation)
  } catch (error) {
    console.error("Erreur lors de la modification de la réservation:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
