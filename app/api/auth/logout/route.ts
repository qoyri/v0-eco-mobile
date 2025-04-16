import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

// Changer de force-static à force-dynamic
export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  // Supprimer le cookie d'authentification
  cookies().delete("auth-token")

  return NextResponse.json({ message: "Déconnexion réussie" })
}
