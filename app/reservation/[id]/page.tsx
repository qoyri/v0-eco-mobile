import ReservationDetailsScreen from "@/components/ReservationDetailsScreen"

// Ajouter cette fonction pour générer les paramètres statiques
export function generateStaticParams() {
  // Pour une application de démonstration, nous pouvons retourner des IDs fictifs
  return [{ id: "reservation-1" }, { id: "reservation-2" }, { id: "reservation-3" }]
}

// Simplifier la fonction pour éviter les problèmes avec les paramètres
export default function ReservationDetails({ params }: { params: { id: string } }) {
  const id = params.id
  return <ReservationDetailsScreen id={id} />
}
