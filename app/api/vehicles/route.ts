import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { executeRawQuery } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const agencyId = searchParams.get("agencyId")
    const agencyName = searchParams.get("agencyName") // Nouveau paramètre pour le nom de l'agence
    const type = searchParams.get("type")
    const showAll = searchParams.get("showAll") === "true"

    console.log("API Request params:", { agencyId, agencyName, type, showAll })

    const currentUser = await getCurrentUser()

    // Si showAll est demandé et que l'utilisateur est admin ou manager, renvoyer tous les véhicules
    if (showAll && currentUser && (currentUser.role === "ADMIN" || currentUser.role === "MANAGER")) {
      const vehicles = await executeRawQuery(`
        SELECT v.*, a.name as agency_name, a.city as agency_city
        FROM vehicles v
        JOIN agencies a ON v.agency_id = a.id
        ORDER BY v.type ASC, v.model ASC
      `)
      return NextResponse.json(vehicles)
    }

    // Construire la requête pour les véhicules disponibles
    let query = `
    SELECT v.*, a.name as agency_name, a.city as agency_city
    FROM vehicles v
    JOIN agencies a ON v.agency_id = a.id
    WHERE v.status = 'AVAILABLE'
  `
    const params: any[] = []

    // Si nous avons un nom d'agence, rechercher par nom ou ville
    if (agencyName) {
      params.push(agencyName.toLowerCase())
      query += ` AND (LOWER(a.name) LIKE '%' || $${params.length} || '%' OR LOWER(a.city) = $${params.length})`
    }
    // Sinon, si nous avons un ID d'agence, rechercher par ID
    else if (agencyId) {
      params.push(agencyId)
      query += ` AND v.agency_id = $${params.length}`
    }

    if (type) {
      // Convertir le type en format attendu par la base de données
      let dbType
      if (type.toLowerCase() === "velo") {
        dbType = "BIKE"
      } else if (type.toLowerCase() === "trottinette") {
        dbType = "SCOOTER"
      } else {
        dbType = type.toUpperCase()
      }

      params.push(dbType)
      query += ` AND v.type = $${params.length}`
    }

    query += ` ORDER BY v.hourly_rate ASC`

    console.log("SQL Query:", query)
    console.log("SQL Params:", params)

    const vehicles = await executeRawQuery(query, params)
    console.log("Found vehicles:", vehicles.length)

    return NextResponse.json(vehicles)
  } catch (error) {
    console.error("Erreur lors de la récupération des véhicules:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    if (currentUser.role !== "ADMIN" && currentUser.role !== "MANAGER") {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
    }

    const data = await request.json()

    const newVehicle = await executeRawQuery(
      `
      INSERT INTO vehicles (
        type, model, description, autonomy, status, agency_id, hourly_rate
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `,
      [
        data.type,
        data.model,
        data.description || null,
        data.autonomy,
        data.status || "AVAILABLE",
        data.agencyId,
        data.hourlyRate,
      ],
    )

    return NextResponse.json(newVehicle[0], { status: 201 })
  } catch (error) {
    console.error("Erreur lors de la création du véhicule:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
