import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import * as vehicleService from "@/lib/services/vehicle-service"

// Ajouter cette ligne pour le mode d'exportation statique
export const dynamic = "force-static"

// Ajouter cette fonction pour générer les paramètres statiques
export async function generateStaticParams() {
  // Pour une application de démonstration, nous pouvons retourner des IDs fictifs
  return [{ id: "vehicle-1" }, { id: "vehicle-2" }, { id: "vehicle-3" }]
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const vehicle = await vehicleService.getVehicleById(id)

    if (!vehicle) {
      return NextResponse.json({ error: "Véhicule non trouvé" }, { status: 404 })
    }

    // Vérifier si le véhicule est disponible ou si l'utilisateur est admin/manager
    const currentUser = await getCurrentUser()

    if (
      vehicle.status !== "AVAILABLE" &&
      (!currentUser || (currentUser.role !== "ADMIN" && currentUser.role !== "MANAGER"))
    ) {
      return NextResponse.json({ error: "Véhicule non disponible" }, { status: 404 })
    }

    return NextResponse.json(vehicle)
  } catch (error) {
    console.error("Erreur lors de la récupération du véhicule:", error)
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

    // Vérifier si le véhicule existe
    const vehicle = await vehicleService.getVehicleById(id)

    if (!vehicle) {
      return NextResponse.json({ error: "Véhicule non trouvé" }, { status: 404 })
    }

    const updatedVehicle = await vehicleService.updateVehicle(id, data)

    return NextResponse.json(updatedVehicle)
  } catch (error) {
    console.error("Erreur lors de la mise à jour du véhicule:", error)
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

    // Vérifier si le véhicule existe
    const vehicle = await vehicleService.getVehicleById(id)

    if (!vehicle) {
      return NextResponse.json({ error: "Véhicule non trouvé" }, { status: 404 })
    }

    // Au lieu de supprimer le véhicule, le mettre hors service
    const updatedVehicle = await vehicleService.updateVehicleStatus(id, "OUT_OF_SERVICE")

    return NextResponse.json({ message: "Véhicule mis hors service avec succès" })
  } catch (error) {
    console.error("Erreur lors de la mise hors service du véhicule:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
