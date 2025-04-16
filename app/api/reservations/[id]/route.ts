import { type NextRequest, NextResponse } from "next/server"
import { executeRawQuery } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    // Attendre la résolution de params pour accéder à id
    const { id } = await params

    // Récupérer la réservation avec les détails du véhicule et de l'agence
    const result = await executeRawQuery(
      `
      SELECT r.*, 
        v.type as vehicle_type, 
        v.model as vehicle_model,
        v.autonomy as vehicle_autonomy,
        a.name as agency_name,
        a.city as agency_city,
        a.address as agency_address,
        a.zip_code as agency_zip_code,
        a.phone_number as agency_phone
      FROM reservations r
      JOIN vehicles v ON r.vehicle_id = v.id
      JOIN agencies a ON r.agency_id = a.id
      WHERE r.id = $1
      LIMIT 1
    `,
      [id],
    )

    if (result.length === 0) {
      return NextResponse.json({ error: "Réservation non trouvée" }, { status: 404 })
    }

    const reservation = result[0]

    // Vérifier que l'utilisateur a le droit de voir cette réservation
    if (user.role !== "ADMIN" && user.role !== "MANAGER" && reservation.user_id !== user.id) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
    }

    return NextResponse.json(reservation)
  } catch (error) {
    console.error("Erreur lors de la récupération de la réservation:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    // Attendre la résolution de params pour accéder à id
    const { id } = await params
    const { action } = await request.json()

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

    let newStatus
    let updateVehicle = false

    // Déterminer la nouvelle action en fonction de l'action demandée
    switch (action) {
      case "cancel":
        // Vérifier que la réservation peut être annulée
        if (reservation.status === "COMPLETED" || reservation.status === "CANCELLED") {
          return NextResponse.json({ error: "Cette réservation ne peut pas être annulée" }, { status: 400 })
        }
        newStatus = "CANCELLED"
        // Si la réservation était en cours, mettre à jour le statut du véhicule
        updateVehicle = reservation.status === "IN_PROGRESS"
        break

      case "validate":
        // Seuls les admins et managers peuvent valider une réservation
        if (user.role !== "ADMIN" && user.role !== "MANAGER") {
          return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
        }
        // Vérifier que la réservation peut être validée
        if (reservation.status !== "PENDING" && reservation.status !== "CONFIRMED") {
          return NextResponse.json({ error: "Cette réservation ne peut pas être validée" }, { status: 400 })
        }
        newStatus = "VALIDATED"
        break

      case "start":
        // Seuls les admins et managers peuvent démarrer une réservation
        if (user.role !== "ADMIN" && user.role !== "MANAGER") {
          return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
        }
        // Vérifier que la réservation peut être démarrée
        if (reservation.status !== "VALIDATED") {
          return NextResponse.json({ error: "Cette réservation ne peut pas être démarrée" }, { status: 400 })
        }
        // Vérifier que le paiement a été effectué
        if (reservation.payment_status !== "PAID") {
          return NextResponse.json(
            { error: "Le paiement doit être effectué avant de démarrer la réservation" },
            { status: 400 },
          )
        }
        newStatus = "IN_PROGRESS"
        updateVehicle = true
        break

      case "complete":
        // Seuls les admins et managers peuvent terminer une réservation
        if (user.role !== "ADMIN" && user.role !== "MANAGER") {
          return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
        }
        // Vérifier que la réservation peut être terminée
        if (reservation.status !== "IN_PROGRESS") {
          return NextResponse.json({ error: "Cette réservation ne peut pas être terminée" }, { status: 400 })
        }
        newStatus = "COMPLETED"
        updateVehicle = true
        break

      default:
        return NextResponse.json({ error: "Action non reconnue" }, { status: 400 })
    }

    // Mettre à jour le statut de la réservation
    const result = await executeRawQuery(
      `
      UPDATE reservations
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `,
      [newStatus, id],
    )

    const updatedReservation = result[0]

    // Si nécessaire, mettre à jour le statut du véhicule
    if (updateVehicle) {
      const vehicleStatus = newStatus === "IN_PROGRESS" ? "RENTED" : "AVAILABLE"

      await executeRawQuery(
        `
        UPDATE vehicles
        SET status = $1
        WHERE id = $2
      `,
        [vehicleStatus, reservation.vehicle_id],
      )
    }

    return NextResponse.json(updatedReservation)
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la réservation:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
