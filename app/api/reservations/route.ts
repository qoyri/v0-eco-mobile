import { type NextRequest, NextResponse } from "next/server"
import { executeRawQuery } from "@/lib/db"
import { generateReservationNumber } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    let query = `
      SELECT r.*, 
        v.type as vehicle_type, 
        v.model as vehicle_model,
        a.name as agency_name,
        a.city as agency_city,
        a.address as agency_address
      FROM reservations r
      JOIN vehicles v ON r.vehicle_id = v.id
      JOIN agencies a ON r.agency_id = a.id
      WHERE r.user_id = $1
    `

    const params: any[] = [user.id]

    if (status) {
      params.push(status)
      query += ` AND r.status = $${params.length}`
    }

    query += ` ORDER BY r.start_date DESC`

    const result = await executeRawQuery(query, params)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const { vehicleId, agencyId, startDate, duration } = await request.json()

    // Vérifier si tous les champs requis sont fournis
    if (!vehicleId || !agencyId || !startDate || !duration) {
      return NextResponse.json({ error: "Tous les champs requis doivent être remplis" }, { status: 400 })
    }

    // Vérifier si le véhicule existe et est disponible
    const vehicleResult = await executeRawQuery(
      `
      SELECT * FROM vehicles WHERE id = $1 AND status = 'AVAILABLE' LIMIT 1
    `,
      [vehicleId],
    )

    if (vehicleResult.length === 0) {
      return NextResponse.json({ error: "Véhicule non disponible" }, { status: 400 })
    }

    const vehicle = vehicleResult[0]

    // Vérifier si l'agence existe
    const agencyResult = await executeRawQuery(
      `
      SELECT * FROM agencies WHERE id = $1 AND is_active = true LIMIT 1
    `,
      [agencyId],
    )

    if (agencyResult.length === 0) {
      return NextResponse.json({ error: "Agence non trouvée" }, { status: 400 })
    }

    // Calculer la date de fin
    const start = new Date(startDate)
    const end = new Date(start)
    end.setHours(end.getHours() + Number.parseInt(duration))

    // Vérifier la disponibilité du véhicule pour cette période
    const availabilityResult = await executeRawQuery(
      `
      SELECT * FROM reservations 
      WHERE vehicle_id = $1 
        AND status NOT IN ('CANCELLED', 'COMPLETED')
        AND (
          (start_date <= $2 AND end_date >= $2) OR
          (start_date <= $3 AND end_date >= $3) OR
          (start_date >= $2 AND end_date <= $3)
        )
      LIMIT 1
    `,
      [vehicleId, start, end],
    )

    if (availabilityResult.length > 0) {
      return NextResponse.json({ error: "Ce véhicule n'est pas disponible pour la période demandée" }, { status: 400 })
    }

    // Calculer le montant total
    const totalAmount = vehicle.hourly_rate * Number.parseInt(duration)

    // Générer un numéro de réservation unique
    const reservationNumber = await generateReservationNumber()

    // Créer la réservation
    const result = await executeRawQuery(
      `
      INSERT INTO reservations (
        reservation_number, user_id, vehicle_id, agency_id, 
        start_date, end_date, duration, status, 
        total_amount, payment_status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `,
      [reservationNumber, user.id, vehicleId, agencyId, start, end, duration, "PENDING", totalAmount, "PENDING"],
    )

    const newReservation = result[0]

    return NextResponse.json(newReservation)
  } catch (error) {
    console.error("Erreur lors de la création de la réservation:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
