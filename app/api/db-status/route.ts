import { type NextRequest, NextResponse } from "next/server"
import { executeRawQuery } from "@/lib/db"

// Ajouter cette ligne pour le mode d'exportation statique
export const dynamic = "force-static"

// Fonction utilitaire pour vérifier si une table existe
async function tableExists(tableName: string): Promise<boolean> {
  const result = await executeRawQuery(
    `SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = $1
    )`,
    [tableName],
  )
  return result[0].exists
}

// Fonction utilitaire pour vérifier si un type enum existe
async function enumExists(enumName: string): Promise<boolean> {
  const result = await executeRawQuery(
    `SELECT EXISTS (
      SELECT FROM pg_type 
      WHERE typname = $1
    )`,
    [enumName],
  )
  return result[0].exists
}

// Fonction utilitaire pour compter les enregistrements dans une table
async function countRecords(tableName: string): Promise<number> {
  try {
    const result = await executeRawQuery(`SELECT COUNT(*) FROM ${tableName}`)
    return Number.parseInt(result[0].count)
  } catch (error) {
    console.error(`Erreur lors du comptage des enregistrements dans ${tableName}:`, error)
    return 0
  }
}

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'existence des tables
    const tablesStatus = {
      users: await tableExists("users"),
      agencies: await tableExists("agencies"),
      vehicles: await tableExists("vehicles"),
      reservations: await tableExists("reservations"),
      incidents: await tableExists("incidents"),
    }

    // Vérifier l'existence des types enum
    const enumsStatus = {
      role: await enumExists("role"),
      vehicle_type: await enumExists("vehicle_type"),
      vehicle_status: await enumExists("vehicle_status"),
      reservation_status: await enumExists("reservation_status"),
      payment_status: await enumExists("payment_status"),
      incident_type: await enumExists("incident_type"),
      incident_status: await enumExists("incident_status"),
    }

    // Compter les enregistrements dans chaque table
    const recordCounts = {
      users: tablesStatus.users ? await countRecords("users") : 0,
      agencies: tablesStatus.agencies ? await countRecords("agencies") : 0,
      vehicles: tablesStatus.vehicles ? await countRecords("vehicles") : 0,
      reservations: tablesStatus.reservations ? await countRecords("reservations") : 0,
      incidents: tablesStatus.incidents ? await countRecords("incidents") : 0,
    }

    // Vérifier si toutes les tables existent
    const allTablesExist = Object.values(tablesStatus).every((status) => status)

    // Vérifier si tous les types enum existent
    const allEnumsExist = Object.values(enumsStatus).every((status) => status)

    // Vérifier si la base de données est vide (aucun enregistrement dans aucune table)
    const isDatabaseEmpty = Object.values(recordCounts).every((count) => count === 0)

    // Vérifier si la base de données est initialisée (toutes les tables et tous les types enum existent)
    const isDatabaseInitialized = allTablesExist && allEnumsExist

    return NextResponse.json({
      success: true,
      tablesStatus,
      enumsStatus,
      recordCounts,
      isDatabaseInitialized,
      isDatabaseEmpty,
      allTablesExist,
      allEnumsExist,
    })
  } catch (error) {
    console.error("Erreur lors de la vérification de l'état de la base de données:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la vérification de l'état de la base de données",
      },
      { status: 500 },
    )
  }
}
