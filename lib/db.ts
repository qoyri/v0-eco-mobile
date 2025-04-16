import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

// Initialiser la connexion à la base de données Neon
const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema })

// Modifier la fonction executeRawQuery pour utiliser sql.query au lieu de sql directement
export async function executeRawQuery(query: string, params: any[] = []) {
  "use server"
  return await sql.query(query, params)
}

// Fonction utilitaire pour générer un numéro de réservation unique
export async function generateReservationNumber(): Promise<string> {
  "use server"
  return `ECO-${Math.floor(10000 + Math.random() * 90000)}`
}
