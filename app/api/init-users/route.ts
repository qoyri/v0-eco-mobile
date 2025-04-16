import { type NextRequest, NextResponse } from "next/server"
import { executeRawQuery } from "@/lib/db"
import { hashPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    // Vérifier si des utilisateurs existent déjà
    const usersResult = await executeRawQuery(`SELECT COUNT(*) FROM users`)
    const userCount = Number.parseInt(usersResult[0].count)

    if (userCount > 0) {
      return NextResponse.json({ message: "Des utilisateurs existent déjà dans la base de données" })
    }

    // Créer les utilisateurs avec des mots de passe cryptés
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

    // Insérer les utilisateurs dans la base de données
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

    return NextResponse.json({
      message: "Utilisateurs créés avec succès",
      users: users.map((user) => ({
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      })),
    })
  } catch (error) {
    console.error("Erreur lors de la création des utilisateurs:", error)
    return NextResponse.json({ error: "Erreur serveur lors de la création des utilisateurs" }, { status: 500 })
  }
}
