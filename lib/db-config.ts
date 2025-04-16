import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

// Initialiser la connexion à la base de données Neon
export const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema })
