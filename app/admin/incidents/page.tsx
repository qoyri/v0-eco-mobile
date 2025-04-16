import type { Metadata } from "next"
import { IncidentsManagement } from "@/components/admin/incidents-management"

export const metadata: Metadata = {
  title: "Gestion des incidents | Admin",
  description: "Gestion des incidents signalés par les clients",
}

export default function IncidentsPage() {
  return <IncidentsManagement />
}
