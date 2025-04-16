import { type NextRequest, NextResponse } from "next/server"
import { getAllIncidents, createIncident } from "@/lib/services/incident-service"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

export async function GET(request: NextRequest) {
  try {
    console.log("GET /api/incidents - Début de la requête")

    // Pour le débogage, récupérons tous les incidents sans vérifier l'authentification
    const incidents = await getAllIncidents()
    console.log("GET /api/incidents - Incidents récupérés:", incidents?.length || 0)

    return NextResponse.json(incidents)
  } catch (error) {
    console.error("GET /api/incidents - Erreur:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const data = await request.json()

    if (!data.reservationId || !data.type || !data.description) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 })
    }

    const incident = await createIncident({
      reservationId: data.reservationId,
      type: data.type,
      description: data.description,
      userId: session.user.id,
    })

    return NextResponse.json(incident)
  } catch (error: any) {
    console.error("POST /api/incidents - Erreur:", error)
    return NextResponse.json({ error: error.message || "Erreur serveur" }, { status: 500 })
  }
}
