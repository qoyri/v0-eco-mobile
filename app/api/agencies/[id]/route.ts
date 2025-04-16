import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import * as agencyService from "@/lib/services/agency-service"

// Ajouter cette ligne pour le mode d'exportation statique
export const dynamic = "force-static"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const agency = await agencyService.getAgencyById(id)

    if (!agency) {
      return NextResponse.json({ error: "Agence non trouvée" }, { status: 404 })
    }

    // Vérifier si l'agence est active ou si l'utilisateur est admin/manager
    const currentUser = await getCurrentUser()

    if (!agency.isActive && (!currentUser || (currentUser.role !== "ADMIN" && currentUser.role !== "MANAGER"))) {
      return NextResponse.json({ error: "Agence non trouvée" }, { status: 404 })
    }

    return NextResponse.json(agency)
  } catch (error) {
    console.error("Erreur lors de la récupération de l'agence:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    if (currentUser.role !== "ADMIN" && currentUser.role !== "MANAGER") {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
    }

    const id = params.id
    const data = await request.json()

    // Vérifier si l'agence existe
    const agency = await agencyService.getAgencyById(id)

    if (!agency) {
      return NextResponse.json({ error: "Agence non trouvée" }, { status: 404 })
    }

    // Seuls les admins peuvent modifier le statut actif/inactif
    if (data.isActive !== undefined && currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Seuls les administrateurs peuvent modifier le statut d'une agence" },
        { status: 403 },
      )
    }

    const updatedAgency = await agencyService.updateAgency(id, data)

    return NextResponse.json(updatedAgency)
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'agence:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    if (currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
    }

    const id = params.id

    // Vérifier si l'agence existe
    const agency = await agencyService.getAgencyById(id)

    if (!agency) {
      return NextResponse.json({ error: "Agence non trouvée" }, { status: 404 })
    }

    // Au lieu de supprimer l'agence, la désactiver
    const updatedAgency = await agencyService.updateAgency(id, { isActive: false })

    return NextResponse.json({ message: "Agence désactivée avec succès" })
  } catch (error) {
    console.error("Erreur lors de la désactivation de l'agence:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
