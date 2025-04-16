import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import * as vehicleService from "@/lib/services/vehicle-service"

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
    const { status } = await request.json()

    if (!status) {
      return NextResponse.json({ error: "Statut requis" }, { status: 400 })
    }

    // Vérifier si le véhicule existe
    const vehicle = await vehicleService.getVehicleById(id)

    if (!vehicle) {
      return NextResponse.json({ error: "Véhicule non trouvé" }, { status: 404 })
    }

    const updatedVehicle = await vehicleService.updateVehicleStatus(id, status)

    return NextResponse.json(updatedVehicle)
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut du véhicule:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
