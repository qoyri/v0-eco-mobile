import ReservationDetailsScreen from "@/components/ReservationDetailsScreen"

// Modifier la fonction pour attendre explicitement params avant de le déstructurer
export default async function ReservationDetails({ params }: { params: Promise<{ id: string }> }) {
  // Attendre que params soit résolu avant d'accéder à ses propriétés
  const resolvedParams = await params
  const id = resolvedParams.id

  return <ReservationDetailsScreen id={id} />
}
