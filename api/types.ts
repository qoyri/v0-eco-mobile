// Types principaux pour l'API

export type Role = "CLIENT" | "ADMIN" | "MANAGER"

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: Role
  phoneNumber?: string
  address?: string
  createdAt: Date
}

export interface Agency {
  id: string
  name: string
  address: string
  city: string
  zipCode: string
  phoneNumber: string
  openingHours: string
  isActive: boolean
}

export type VehicleType = "BIKE" | "SCOOTER" | "HOVERBOARD"
export type VehicleStatus = "AVAILABLE" | "RENTED" | "MAINTENANCE" | "OUT_OF_SERVICE"

export interface Vehicle {
  id: string
  type: VehicleType
  model: string
  description?: string
  autonomy: number // en km
  status: VehicleStatus
  agencyId: string
  hourlyRate: number
  maintenanceCount: number
  lastMaintenanceDate?: Date
}

export type ReservationStatus = "PENDING" | "CONFIRMED" | "VALIDATED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"

export interface Reservation {
  id: string
  reservationNumber: string // Format: ECO-XXXXX
  userId: string
  vehicleId: string
  agencyId: string
  startDate: Date
  endDate: Date
  duration: number // en heures
  status: ReservationStatus
  totalAmount: number
  paymentStatus: "PENDING" | "PAID" | "REFUNDED"
  createdAt: Date
  updatedAt: Date
}

export type IncidentType = "BREAKDOWN" | "THEFT" | "ACCIDENT" | "OTHER"

export interface Incident {
  id: string
  reservationId: string
  type: IncidentType
  description: string
  reportedAt: Date
  status: "REPORTED" | "IN_PROGRESS" | "RESOLVED"
  resolvedAt?: Date
}

export interface Maintenance {
  id: string
  vehicleId: string
  description: string
  startDate: Date
  endDate?: Date
  cost: number
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED"
  technicianId: string
}

// Types pour les requêtes API

export interface LoginRequest {
  email: string
  password?: string
  reservationNumber?: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface CreateReservationRequest {
  vehicleId: string
  agencyId: string
  startDate: Date
  duration: number // en heures
}

export interface ReportIncidentRequest {
  reservationId: string
  type: IncidentType
  description: string
}
