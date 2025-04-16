import { type NextRequest, NextResponse } from "next/server"
import { getIncidentsByUser } from "@/lib/services/incident-service"
import { getCurrentUser } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    console.log("Récupération des incidents pour l'utilisateur:", user.id)

    // Récupérer les incidents liés à l'utilisateur
    const userIncidents = await getIncidentsByUser(user.id)

    console.log("Nombre d'incidents trouvés:", userIncidents.length)

    return NextResponse.json(userIncidents)
  } catch (error) {
    console.error("Erreur lors de la récupération des incidents de l'utilisateur:", error)
    return NextResponse.json({ error: "Erreur serveur", details: error.message }, { status: 500 })
  }
}
