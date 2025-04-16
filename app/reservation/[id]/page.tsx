import ReservationDetailsScreen from "@/components/reservation-details-screen"

// Ajouter cette fonction pour générer les paramètres statiques
export async function generateStaticParams() {
  // Pour une application de démonstration, nous pouvons retourner des IDs fictifs
  return [{ id: "reservation-1" }, { id: "reservation-2" }, { id: "reservation-3" }]
}

export default function ReservationDetails({ params }: { params: { id: string } }) {
  return <ReservationDetailsScreen id={params.id} />
}
