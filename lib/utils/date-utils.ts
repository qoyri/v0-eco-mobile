// Fonction utilitaire pour formater les dates (côté client)
export function formatDate(date: Date): string {
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

// Fonction utilitaire pour formater les heures (côté client)
export function formatTime(date: Date): string {
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Fonction utilitaire pour générer un numéro de réservation unique (côté client)
export function generateReservationNumber(): string {
  return `ECO-${Math.floor(10000 + Math.random() * 90000)}`
}
