import { type NextRequest, NextResponse } from "next/server"
import { getIncidentById, updateIncidentStatus } from "@/lib/services/incident-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("GET /api/incidents/[id] - Début de la requête pour l'ID:", params.id)

    // Pour le débogage, récupérons l'incident sans vérifier l'authentification
    const incident = await getIncidentById(params.id)

    if (!incident) {
      console.error("GET /api/incidents/[id] - Incident non trouvé")
      return NextResponse.json({ error: "Incident non trouvé" }, { status: 404 })
    }

    console.log("GET /api/incidents/[id] - Incident récupéré:", incident.id)

    return NextResponse.json(incident)
  } catch (error) {
    console.error("GET /api/incidents/[id] - Erreur:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("PATCH /api/incidents/[id] - Début de la requête pour l'ID:", params.id)

    // Pour le débogage, mettons à jour l'incident sans vérifier l'authentification
    const data = await request.json()

    if (!data.status) {
      return NextResponse.json({ error: "Statut manquant" }, { status: 400 })
    }

    const incident = await updateIncidentStatus(params.id, data.status, data.response)

    if (!incident) {
      return NextResponse.json({ error: "Incident non trouvé" }, { status: 404 })
    }

    console.log("PATCH /api/incidents/[id] - Incident mis à jour:", incident.id)

    return NextResponse.json(incident)
  } catch (error: any) {
    console.error("PATCH /api/incidents/[id] - Erreur:", error)
    return NextResponse.json({ error: error.message || "Erreur serveur" }, { status: 500 })
  }
}
