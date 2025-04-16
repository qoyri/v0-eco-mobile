import ReservationDetailsScreen from "@/components/ReservationDetailsScreen"

// Ajouter cette fonction pour générer les paramètres statiques
export async function generateStaticParams() {
  // Pour une application de démonstration, nous pouvons retourner des IDs fictifs
  return [{ id: "reservation-1" }, { id: "reservation-2" }, { id: "reservation-3" }]
}

// Modifier la fonction pour attendre explicitement params avant de le déstructurer
export default async function ReservationDetails({ params }: { params: Promise<{ id: string }> }) {
  // Attendre que params soit résolu avant d'accéder à ses propriétés
  const resolvedParams = await params
  const id = resolvedParams.id

  return <ReservationDetailsScreen id={id} />
}
