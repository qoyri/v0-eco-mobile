import { pgTable, uuid, varchar, text, timestamp, boolean, integer, decimal, pgEnum } from "drizzle-orm/pg-core"

// Énumérations
export const roleEnum = pgEnum("role", ["CLIENT", "ADMIN", "MANAGER"])
export const vehicleTypeEnum = pgEnum("vehicle_type", ["BIKE", "SCOOTER", "HOVERBOARD"])
export const vehicleStatusEnum = pgEnum("vehicle_status", ["AVAILABLE", "RENTED", "MAINTENANCE", "OUT_OF_SERVICE"])
export const reservationStatusEnum = pgEnum("reservation_status", [
  "PENDING",
  "CONFIRMED",
  "VALIDATED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
])
export const paymentStatusEnum = pgEnum("payment_status", ["PENDING", "PAID", "REFUNDED"])
export const incidentTypeEnum = pgEnum("incident_type", ["BREAKDOWN", "THEFT", "ACCIDENT", "OTHER"])
export const incidentStatusEnum = pgEnum("incident_status", ["REPORTED", "IN_PROGRESS", "RESOLVED"])

// Table utilisateurs
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  role: roleEnum("role").notNull().default("CLIENT"),
  phoneNumber: varchar("phone_number", { length: 20 }),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Table agences
export const agencies = pgTable("agencies", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  zipCode: varchar("zip_code", { length: 20 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
  openingHours: varchar("opening_hours", { length: 100 }).notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Table véhicules
export const vehicles = pgTable("vehicles", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: vehicleTypeEnum("type").notNull(),
  model: varchar("model", { length: 100 }).notNull(),
  description: text("description"),
  autonomy: integer("autonomy").notNull(), // en km
  status: vehicleStatusEnum("status").notNull().default("AVAILABLE"),
  agencyId: uuid("agency_id")
    .notNull()
    .references(() => agencies.id),
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }).notNull(),
  maintenanceCount: integer("maintenance_count").notNull().default(0),
  lastMaintenanceDate: timestamp("last_maintenance_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Table réservations
export const reservations = pgTable("reservations", {
  id: uuid("id").primaryKey().defaultRandom(),
  reservationNumber: varchar("reservation_number", { length: 20 }).notNull().unique(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  vehicleId: uuid("vehicle_id")
    .notNull()
    .references(() => vehicles.id),
  agencyId: uuid("agency_id")
    .notNull()
    .references(() => agencies.id),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  duration: integer("duration").notNull(), // en heures
  status: reservationStatusEnum("status").notNull().default("PENDING"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  paymentStatus: paymentStatusEnum("payment_status").notNull().default("PENDING"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Table incidents
export const incidents = pgTable("incidents", {
  id: uuid("id").primaryKey().defaultRandom(),
  reservationId: uuid("reservation_id")
    .notNull()
    .references(() => reservations.id),
  type: incidentTypeEnum("type").notNull(),
  description: text("description").notNull(),
  reportedAt: timestamp("reported_at").defaultNow().notNull(),
  status: incidentStatusEnum("status").notNull().default("REPORTED"),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})
