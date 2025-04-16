import { type NextRequest, NextResponse } from "next/server"
import { executeRawQuery } from "@/lib/db"
import { hashPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    // Vérifier si des données existent déjà
    const usersCount = await getTableCount("users")
    const agenciesCount = await getTableCount("agencies")
    const vehiclesCount = await getTableCount("vehicles")

    if (usersCount > 0 || agenciesCount > 0 || vehiclesCount > 0) {
      return NextResponse.json({
        success: false,
        message: "Des données existent déjà dans la base de données. Veuillez d'abord vider la base de données.",
      })
    }

    // Commencer une transaction
    await executeRawQuery("BEGIN")

    try {
      // Créer les utilisateurs
      const password = "password123"
      const hashedPassword = await hashPassword(password)

      const users = [
        {
          email: "admin@example.com",
          password_hash: hashedPassword,
          first_name: "Admin",
          last_name: "Système",
          role: "ADMIN",
          phone_number: "06 XX XX XX XX",
          address: "456 rue des Admins, 74000 Annecy",
        },
        {
          email: "client@example.com",
          password_hash: hashedPassword,
          first_name: "Jean",
          last_name: "Dupont",
          role: "CLIENT",
          phone_number: "06 XX XX XX XX",
          address: "123 rue des Clients, 74000 Annecy",
        },
        {
          email: "manager@example.com",
          password_hash: hashedPassword,
          first_name: "Marie",
          last_name: "Martin",
          role: "MANAGER",
          phone_number: "06 XX XX XX XX",
          address: "789 rue des Managers, 74000 Annecy",
        },
      ]

      // Insérer les utilisateurs
      for (const user of users) {
        await executeRawQuery(
          `
          INSERT INTO users (
            email, password_hash, first_name, last_name, 
            role, phone_number, address
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
          [user.email, user.password_hash, user.first_name, user.last_name, user.role, user.phone_number, user.address],
        )
      }

      // Créer les agences
      const agencies = [
        {
          name: "Eco Mobile Annecy Centre",
          address: "15 rue de la République",
          city: "Annecy",
          zip_code: "74000",
          phone_number: "04 50 XX XX XX",
          opening_hours: "Lun-Sam: 9h-19h, Dim: 10h-18h",
        },
        {
          name: "Eco Mobile Annecy Lac",
          address: "45 avenue du Lac",
          city: "Annecy",
          zip_code: "74000",
          phone_number: "04 50 XX XX XX",
          opening_hours: "Lun-Sam: 9h-19h, Dim: 10h-18h",
        },
        {
          name: "Eco Mobile Annecy Gare",
          address: "2 place de la Gare",
          city: "Annecy",
          zip_code: "74000",
          phone_number: "04 50 XX XX XX",
          opening_hours: "Lun-Sam: 9h-19h, Dim: Fermé",
        },
      ]

      // Insérer les agences
      for (const agency of agencies) {
        await executeRawQuery(
          `
          INSERT INTO agencies (
            name, address, city, zip_code, phone_number, opening_hours
          )
          VALUES ($1, $2, $3, $4, $5, $6)
        `,
          [agency.name, agency.address, agency.city, agency.zip_code, agency.phone_number, agency.opening_hours],
        )
      }

      // Récupérer les IDs des agences
      const agencyIds = await executeRawQuery(`SELECT id FROM agencies`)

      // Créer les véhicules
      const vehicleTypes = ["BIKE", "SCOOTER", "HOVERBOARD"]
      const vehicleModels = {
        BIKE: ["Vélo Électrique City", "Vélo Électrique Mountain", "Vélo Électrique Cargo"],
        SCOOTER: ["Trottinette Électrique Standard", "Trottinette Électrique Pro", "Trottinette Électrique Max"],
        HOVERBOARD: ["Hoverboard Standard", "Hoverboard Pro", "Hoverboard Off-Road"],
      }

      // Insérer les véhicules
      for (const agencyId of agencyIds) {
        for (const type of vehicleTypes) {
          const models = vehicleModels[type as keyof typeof vehicleModels]
          for (const model of models) {
            const autonomy = Math.floor(Math.random() * 50) + 30 // 30-80 km
            const hourlyRate = Math.floor(Math.random() * 10) + 5 + Math.random().toFixed(2) // 5-15 €/h

            await executeRawQuery(
              `
              INSERT INTO vehicles (
                type, model, description, autonomy, status, agency_id, hourly_rate
              )
              VALUES ($1, $2, $3, $4, $5, $6, $7)
            `,
              [
                type,
                model,
                `${model} en excellent état, idéal pour se déplacer en ville.`,
                autonomy,
                "AVAILABLE",
                agencyId.id,
                hourlyRate,
              ],
            )
          }
        }
      }

      // Valider la transaction
      await executeRawQuery("COMMIT")

      return NextResponse.json({
        success: true,
        message: "Base de données peuplée avec succès",
        data: {
          users: users.length,
          agencies: agencies.length,
          vehicles: vehicleTypes.length * Object.values(vehicleModels).flat().length * agencyIds.length,
        },
      })
    } catch (error) {
      // Annuler la transaction en cas d'erreur
      await executeRawQuery("ROLLBACK")
      throw error
    }
  } catch (error) {
    console.error("Erreur lors du peuplement de la base de données:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erreur serveur lors du peuplement de la base de données",
      },
      { status: 500 },
    )
  }
}

// Fonction utilitaire pour compter les enregistrements dans une table
async function getTableCount(tableName: string): Promise<number> {
  try {
    const result = await executeRawQuery(`SELECT COUNT(*) FROM ${tableName}`)
    return Number.parseInt(result[0].count)
  } catch (error) {
    console.error(`Erreur lors du comptage des enregistrements dans ${tableName}:`, error)
    return 0
  }
}
