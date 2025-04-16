import { type NextRequest, NextResponse } from "next/server"
import { testConnection } from "@/lib/neon-db"

// Changer de force-static à force-dynamic
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const result = await testConnection()

    return NextResponse.json({
      success: true,
      message: "Connexion à la base de données réussie",
      time: result.time,
    })
  } catch (error) {
    console.error("Erreur lors du test de connexion à la base de données:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erreur de connexion à la base de données",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
