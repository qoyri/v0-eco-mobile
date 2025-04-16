import type { Metadata } from "next"
import { UserIncidents } from "@/components/user-incidents"

export const metadata: Metadata = {
  title: "Mes incidents",
  description: "Consultez et gérez vos incidents signalés",
}

export default function IncidentsPage() {
  return <UserIncidents />
}
