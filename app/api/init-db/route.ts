import { type NextRequest, NextResponse } from "next/server"
import { executeRawQuery } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    // Commencer une transaction
    await executeRawQuery("BEGIN")

    try {
      // Créer les types enum
      await executeRawQuery(`
        DO $$ 
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role') THEN
            CREATE TYPE role AS ENUM ('CLIENT', 'ADMIN', 'MANAGER');
          END IF;
          
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vehicle_type') THEN
            CREATE TYPE vehicle_type AS ENUM ('BIKE', 'SCOOTER', 'HOVERBOARD');
          END IF;
          
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vehicle_status') THEN
            CREATE TYPE vehicle_status AS ENUM ('AVAILABLE', 'RENTED', 'MAINTENANCE', 'OUT_OF_SERVICE');
          END IF;
          
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'reservation_status') THEN
            CREATE TYPE reservation_status AS ENUM ('PENDING', 'CONFIRMED', 'VALIDATED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
          END IF;
          
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
            CREATE TYPE payment_status AS ENUM ('PENDING', 'PAID', 'REFUNDED');
          END IF;
          
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'incident_type') THEN
            CREATE TYPE incident_type AS ENUM ('BREAKDOWN', 'THEFT', 'ACCIDENT', 'OTHER');
          END IF;
          
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'incident_status') THEN
            CREATE TYPE incident_status AS ENUM ('REPORTED', 'IN_PROGRESS', 'RESOLVED');
          END IF;
        END $$;
      `)

      // Créer la table users
      await executeRawQuery(`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) NOT NULL UNIQUE,
          password_hash VARCHAR(255) NOT NULL,
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          role role NOT NULL DEFAULT 'CLIENT',
          phone_number VARCHAR(20),
          address TEXT,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `)

      // Créer la table agencies
      await executeRawQuery(`
        CREATE TABLE IF NOT EXISTS agencies (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          address TEXT NOT NULL,
          city VARCHAR(100) NOT NULL,
          zip_code VARCHAR(20) NOT NULL,
          phone_number VARCHAR(20) NOT NULL,
          opening_hours VARCHAR(100) NOT NULL,
          is_active BOOLEAN NOT NULL DEFAULT TRUE,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `)

      // Créer la table vehicles
      await executeRawQuery(`
        CREATE TABLE IF NOT EXISTS vehicles (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          type vehicle_type NOT NULL,
          model VARCHAR(100) NOT NULL,
          description TEXT,
          autonomy INTEGER NOT NULL,
          status vehicle_status NOT NULL DEFAULT 'AVAILABLE',
          agency_id UUID NOT NULL REFERENCES agencies(id),
          hourly_rate DECIMAL(10, 2) NOT NULL,
          maintenance_count INTEGER NOT NULL DEFAULT 0,
          last_maintenance_date TIMESTAMP,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `)

      // Créer la table reservations
      await executeRawQuery(`
        CREATE TABLE IF NOT EXISTS reservations (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          reservation_number VARCHAR(20) NOT NULL UNIQUE,
          user_id UUID NOT NULL REFERENCES users(id),
          vehicle_id UUID NOT NULL REFERENCES vehicles(id),
          agency_id UUID NOT NULL REFERENCES agencies(id),
          start_date TIMESTAMP NOT NULL,
          end_date TIMESTAMP NOT NULL,
          duration INTEGER NOT NULL,
          status reservation_status NOT NULL DEFAULT 'PENDING',
          total_amount DECIMAL(10, 2) NOT NULL,
          payment_status payment_status NOT NULL DEFAULT 'PENDING',
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `)

      // Créer la table incidents
      await executeRawQuery(`
        CREATE TABLE IF NOT EXISTS incidents (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          reservation_id UUID NOT NULL REFERENCES reservations(id),
          type incident_type NOT NULL,
          description TEXT NOT NULL,
          reported_at TIMESTAMP NOT NULL DEFAULT NOW(),
          status incident_status NOT NULL DEFAULT 'REPORTED',
          resolved_at TIMESTAMP,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `)

      // Valider la transaction
      await executeRawQuery("COMMIT")

      return NextResponse.json({
        success: true,
        message: "Base de données initialisée avec succès",
      })
    } catch (error) {
      // Annuler la transaction en cas d'erreur
      await executeRawQuery("ROLLBACK")
      throw error
    }
  } catch (error) {
    console.error("Erreur lors de l'initialisation de la base de données:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erreur serveur lors de l'initialisation de la base de données",
      },
      { status: 500 },
    )
  }
}
