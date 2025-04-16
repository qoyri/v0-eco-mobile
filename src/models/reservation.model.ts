export enum ReservationStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  VALIDATED = "VALIDATED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  REFUNDED = "REFUNDED",
}

export interface Reservation {
  id: string
  reservationNumber: string
  userId: string
  vehicleId: string
  agencyId: string
  startDate: Date
  endDate: Date
  duration: number
  status: ReservationStatus
  totalAmount: number
  paymentStatus: PaymentStatus
  createdAt: Date
  updatedAt: Date
}

export interface ReservationFilter {
  agencyId?: string
  status?: ReservationStatus
  startDate?: Date
  endDate?: Date
}

export interface ReservationStats {
  totalReservations: number
  completedReservations: number
  cancelledReservations: number
  totalRevenue: number
  reservationsByVehicleType: Record<string, number>
  reservationsByAgency: Record<string, number>
}
