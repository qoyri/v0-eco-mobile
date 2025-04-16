"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Bike, Calendar, ChevronRight, Clock, Filter, Search, User, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatDate, formatTime } from "@/lib/utils/date-utils"
import { AdminLayout } from "./admin-layout"

interface Reservation {
  id: string
  reservation_number: string
  user_id: string
  vehicle_id: string
  agency_id: string
  start_date: string
  end_date: string
  duration: number
  status: string
  total_amount: number
  payment_status: string
  vehicle_type?: string
  vehicle_model?: string
  agency_name?: string
  agency_city?: string
  user_first_name?: string
  user_last_name?: string
}

interface Vehicle {
  id: string
  type: string
  model: string
  status: string
  hourly_rate: number
  autonomy: number
  maintenance_count: number
}

interface Stats {
  totalReservations: number
  activeReservations: number
  totalVehicles: number
  availableVehicles: number
  totalRevenue: number
  pendingReservations: number
}

export function AdminDashboard() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [stats, setStats] = useState<Stats>({
    totalReservations: 0,
    activeReservations: 0,
    totalVehicles: 0,
    availableVehicles: 0,
    totalRevenue: 0,
    pendingReservations: 0,
  })
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      // Dans un environnement réel, ces appels seraient à des API réelles
      // Pour l'instant, nous simulons les données

      // Simuler un délai réseau
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Données simulées
      const mockReservations: Reservation[] = [
        {
          id: "1",
          reservation_number: "ECO-12345",
          user_id: "user1",
          vehicle_id: "vehicle1",
          agency_id: "agency1",
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 3600000).toISOString(),
          duration: 1,
          status: "PENDING",
          total_amount: 15,
          payment_status: "PENDING",
          vehicle_type: "BIKE",
          vehicle_model: "City Explorer",
          agency_name: "Annecy Centre",
          agency_city: "Annecy",
          user_first_name: "Jean",
          user_last_name: "Dupont",
        },
        {
          id: "2",
          reservation_number: "ECO-12346",
          user_id: "user2",
          vehicle_id: "vehicle2",
          agency_id: "agency1",
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 7200000).toISOString(),
          duration: 2,
          status: "CONFIRMED",
          total_amount: 25,
          payment_status: "PAID",
          vehicle_type: "SCOOTER",
          vehicle_model: "Urban Glide",
          agency_name: "Annecy Centre",
          agency_city: "Annecy",
          user_first_name: "Marie",
          user_last_name: "Martin",
        },
        {
          id: "3",
          reservation_number: "ECO-12347",
          user_id: "user3",
          vehicle_id: "vehicle3",
          agency_id: "agency1",
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 14400000).toISOString(),
          duration: 4,
          status: "IN_PROGRESS",
          total_amount: 40,
          payment_status: "PAID",
          vehicle_type: "BIKE",
          vehicle_model: "Mountain Explorer",
          agency_name: "Annecy Centre",
          agency_city: "Annecy",
          user_first_name: "Pierre",
          user_last_name: "Durand",
        },
      ]

      const mockVehicles: Vehicle[] = [
        {
          id: "vehicle1",
          type: "BIKE",
          model: "City Explorer",
          status: "AVAILABLE",
          hourly_rate: 15,
          autonomy: 80,
          maintenance_count: 2,
        },
        {
          id: "vehicle2",
          type: "SCOOTER",
          model: "Urban Glide",
          status: "RENTED",
          hourly_rate: 12.5,
          autonomy: 30,
          maintenance_count: 1,
        },
        {
          id: "vehicle3",
          type: "BIKE",
          model: "Mountain Explorer",
          status: "RENTED",
          hourly_rate: 18,
          autonomy: 60,
          maintenance_count: 3,
        },
      ]

      const mockStats: Stats = {
        totalReservations: 15,
        activeReservations: 3,
        totalVehicles: 25,
        availableVehicles: 18,
        totalRevenue: 1250.5,
        pendingReservations: 5,
      }

      setReservations(mockReservations)
      setVehicles(mockVehicles)
      setStats(mockStats)
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du tableau de bord",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (reservationId: string, newStatus: string) => {
    try {
      // Dans un environnement réel, cet appel serait à une API réelle
      // Pour l'instant, nous simulons la mise à jour

      // Simuler un délai réseau
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Mettre à jour localement
      setReservations((prev) => prev.map((res) => (res.id === reservationId ? { ...res, status: newStatus } : res)))

      toast({
        title: "Succès",
        description: `Statut de la réservation mis à jour avec succès`,
      })
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la réservation",
        variant: "destructive",
      })
    }
  }

  const filteredReservations =
    statusFilter === "all" ? reservations : reservations.filter((res) => res.status === statusFilter)

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Tableau de bord administrateur</h1>
        <p className="text-muted-foreground">Gérez les réservations et les véhicules de votre agence</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Réservations totales</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReservations}</div>
            <p className="text-xs text-muted-foreground">{stats.activeReservations} réservations actives</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Véhicules disponibles</CardTitle>
            <Bike className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.availableVehicles}</div>
            <p className="text-xs text-muted-foreground">sur {stats.totalVehicles} véhicules au total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chiffre d'affaires</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRevenue.toFixed(2)} €</div>
            <p className="text-xs text-muted-foreground">+12.5% par rapport au mois dernier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Réservations en attente</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReservations}</div>
            <p className="text-xs text-muted-foreground">Nécessitent une validation</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reservations" className="w-full">
        <TabsList>
          <TabsTrigger value="reservations">Réservations</TabsTrigger>
          <TabsTrigger value="vehicles">Véhicules</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
        </TabsList>

        <TabsContent value="reservations" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Rechercher..." className="pl-8" />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="PENDING">En attente</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmée</SelectItem>
                  <SelectItem value="VALIDATED">Validée</SelectItem>
                  <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                  <SelectItem value="COMPLETED">Terminée</SelectItem>
                  <SelectItem value="CANCELLED">Annulée</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline">Exporter</Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N° Réservation</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Véhicule</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Chargement des réservations...
                      </TableCell>
                    </TableRow>
                  ) : filteredReservations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Aucune réservation trouvée
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredReservations.map((reservation) => {
                      // Déterminer le statut à afficher
                      let statusBadge
                      switch (reservation.status) {
                        case "PENDING":
                          statusBadge = (
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                              En attente
                            </Badge>
                          )
                          break
                        case "CONFIRMED":
                          statusBadge = (
                            <Badge variant="outline" className="bg-blue-100 text-blue-800">
                              Confirmée
                            </Badge>
                          )
                          break
                        case "VALIDATED":
                          statusBadge = (
                            <Badge variant="outline" className="bg-blue-200 text-blue-800">
                              Validée
                            </Badge>
                          )
                          break
                        case "IN_PROGRESS":
                          statusBadge = (
                            <Badge variant="outline" className="bg-green-100 text-green-800">
                              En cours
                            </Badge>
                          )
                          break
                        case "COMPLETED":
                          statusBadge = (
                            <Badge variant="outline" className="bg-gray-100 text-gray-800">
                              Terminée
                            </Badge>
                          )
                          break
                        case "CANCELLED":
                          statusBadge = (
                            <Badge variant="outline" className="bg-red-100 text-red-800">
                              Annulée
                            </Badge>
                          )
                          break
                        default:
                          statusBadge = <Badge variant="outline">{reservation.status}</Badge>
                      }

                      return (
                        <TableRow key={reservation.id}>
                          <TableCell className="font-medium">{reservation.reservation_number}</TableCell>
                          <TableCell>
                            {reservation.user_first_name} {reservation.user_last_name}
                          </TableCell>
                          <TableCell>
                            {reservation.vehicle_type} - {reservation.vehicle_model}
                          </TableCell>
                          <TableCell>
                            {formatDate(new Date(reservation.start_date))}
                            <div className="text-xs text-muted-foreground">
                              {formatTime(new Date(reservation.start_date))} -{" "}
                              {formatTime(new Date(reservation.end_date))}
                            </div>
                          </TableCell>
                          <TableCell>{statusBadge}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              {reservation.status === "PENDING" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusChange(reservation.id, "VALIDATED")}
                                >
                                  Valider
                                </Button>
                              )}
                              {reservation.status === "VALIDATED" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusChange(reservation.id, "IN_PROGRESS")}
                                >
                                  Démarrer
                                </Button>
                              )}
                              {reservation.status === "IN_PROGRESS" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusChange(reservation.id, "COMPLETED")}
                                >
                                  Terminer
                                </Button>
                              )}
                              <Button size="sm" variant="ghost">
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicles" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Rechercher un véhicule..." className="pl-8" />
              </div>

              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filtrer par type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="BIKE">Vélos</SelectItem>
                  <SelectItem value="SCOOTER">Trottinettes</SelectItem>
                  <SelectItem value="HOVERBOARD">Hoverboards</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button>Ajouter un véhicule</Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Modèle</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Tarif horaire</TableHead>
                    <TableHead>Autonomie</TableHead>
                    <TableHead>Maintenance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        Chargement des véhicules...
                      </TableCell>
                    </TableRow>
                  ) : vehicles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        Aucun véhicule trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    vehicles.map((vehicle) => {
                      // Déterminer le statut à afficher
                      let statusBadge
                      switch (vehicle.status) {
                        case "AVAILABLE":
                          statusBadge = (
                            <Badge variant="outline" className="bg-green-100 text-green-800">
                              Disponible
                            </Badge>
                          )
                          break
                        case "RENTED":
                          statusBadge = (
                            <Badge variant="outline" className="bg-blue-100 text-blue-800">
                              En location
                            </Badge>
                          )
                          break
                        case "MAINTENANCE":
                          statusBadge = (
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                              En maintenance
                            </Badge>
                          )
                          break
                        case "OUT_OF_SERVICE":
                          statusBadge = (
                            <Badge variant="outline" className="bg-red-100 text-red-800">
                              Hors service
                            </Badge>
                          )
                          break
                        default:
                          statusBadge = <Badge variant="outline">{vehicle.status}</Badge>
                      }

                      return (
                        <TableRow key={vehicle.id}>
                          <TableCell className="font-medium">{vehicle.id.substring(0, 8)}</TableCell>
                          <TableCell>
                            {vehicle.type === "BIKE"
                              ? "Vélo"
                              : vehicle.type === "SCOOTER"
                                ? "Trottinette"
                                : vehicle.type === "HOVERBOARD"
                                  ? "Hoverboard"
                                  : vehicle.type}
                          </TableCell>
                          <TableCell>{vehicle.model}</TableCell>
                          <TableCell>{statusBadge}</TableCell>
                          <TableCell>{vehicle.hourly_rate.toFixed(2)} €/h</TableCell>
                          <TableCell>{vehicle.autonomy} km</TableCell>
                          <TableCell>{vehicle.maintenance_count} fois</TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher un client..." className="pl-8" />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Liste des clients</CardTitle>
              <CardDescription>Gérez les comptes clients de votre agence</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Total: 24 clients</span>
                </div>
                <Button variant="outline" size="sm">
                  Exporter la liste
                </Button>
              </div>

              <div className="space-y-4">
                {/* Liste des clients simulée */}
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="bg-muted rounded-full p-2">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {i === 1 ? "Jean Dupont" : i === 2 ? "Marie Martin" : "Pierre Durand"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {i === 1
                            ? "jean.dupont@example.com"
                            : i === 2
                              ? "marie.martin@example.com"
                              : "pierre.durand@example.com"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        {i === 1 ? "3" : i === 2 ? "1" : "5"} réservations
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  )
}
