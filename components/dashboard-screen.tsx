"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Bike, Calendar, Clock, MapPin, Plus, ChevronRight, AlertTriangle, TrendingUp, Leaf } from "lucide-react"
import { AppLayout } from "./app-layout"
import { useReservations } from "@/hooks/use-reservations"
import { formatDate, formatTime } from "@/lib/utils/date-utils"
import { Loader2 } from "lucide-react"

export function DashboardScreen() {
  const router = useRouter()
  const { reservations, loading, fetchReservations } = useReservations()
  const [activeTab, setActiveTab] = useState("upcoming")

  useEffect(() => {
    fetchReservations()
  }, [fetchReservations])

  const handleNewReservation = () => {
    router.push("/new-reservation")
  }

  const handleViewReservation = (id: string) => {
    router.push(`/reservation/${id}`)
  }

  const handleViewIncidents = () => {
    router.push("/incidents")
  }

  // Filtrer les réservations
  const upcomingReservations = reservations.filter((res) => res.status !== "COMPLETED" && res.status !== "CANCELLED")
  const pastReservations = reservations.filter((res) => res.status === "COMPLETED" || res.status === "CANCELLED")

  // Statistiques
  const totalReservations = reservations.length
  const activeReservations = reservations.filter((res) => res.status === "IN_PROGRESS").length
  const completedReservations = reservations.filter((res) => res.status === "COMPLETED").length
  const cancelledReservations = reservations.filter((res) => res.status === "CANCELLED").length

  // Fonction pour afficher le statut
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "PENDING":
        return { text: "En attente", color: "bg-yellow-500" }
      case "CONFIRMED":
        return { text: "Confirmée", color: "bg-blue-500" }
      case "VALIDATED":
        return { text: "Validée", color: "bg-blue-600" }
      case "IN_PROGRESS":
        return { text: "En cours", color: "bg-green-600" }
      case "COMPLETED":
        return { text: "Terminée", color: "bg-gray-500" }
      case "CANCELLED":
        return { text: "Annulée", color: "bg-red-500" }
      default:
        return { text: status, color: "bg-gray-500" }
    }
  }

  return (
    <AppLayout>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-green-700">Tableau de bord</h1>
            <p className="text-muted-foreground">
              Bienvenue, {reservations.length > 0 ? `${reservations[0].user_first_name}` : "utilisateur"}
            </p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <Button variant="outline" onClick={handleViewIncidents}>
              <AlertTriangle className="mr-2 h-4 w-4" />
              Mes incidents
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleNewReservation}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle réservation
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total réservations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-green-600 mr-2" />
                <div className="text-2xl font-bold">{totalReservations}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Réservations actives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Bike className="h-5 w-5 text-green-600 mr-2" />
                <div className="text-2xl font-bold">{activeReservations}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Réservations terminées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                <div className="text-2xl font-bold">{completedReservations}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Impact écologique</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Leaf className="h-5 w-5 text-green-600 mr-2" />
                <div className="text-2xl font-bold">{completedReservations * 2.5} kg</div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">CO2 économisé</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Mes réservations</CardTitle>
                <CardDescription>Gérez vos réservations de véhicules électriques</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
                  <div className="px-6">
                    <TabsList className="grid w-full max-w-md grid-cols-2">
                      <TabsTrigger value="upcoming">À venir</TabsTrigger>
                      <TabsTrigger value="past">Passées</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="upcoming" className="p-0">
                    {loading ? (
                      <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                      </div>
                    ) : upcomingReservations.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium">Aucune réservation à venir</p>
                        <p className="text-sm text-muted-foreground mb-6">
                          Vous n'avez pas de réservation active ou à venir
                        </p>
                        <Button className="bg-green-600 hover:bg-green-700" onClick={handleNewReservation}>
                          <Plus className="mr-2 h-4 w-4" />
                          Nouvelle réservation
                        </Button>
                      </div>
                    ) : (
                      <div className="divide-y">
                        {upcomingReservations.map((reservation) => {
                          const status = getStatusDisplay(reservation.status)
                          const isActive = reservation.status === "IN_PROGRESS"

                          return (
                            <div
                              key={reservation.id}
                              className={`p-4 hover:bg-muted/50 cursor-pointer ${isActive ? "bg-green-50" : ""}`}
                              onClick={() => handleViewReservation(reservation.id)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4">
                                  <div className={`mt-1 rounded-full p-1 ${isActive ? "bg-green-100" : "bg-gray-100"}`}>
                                    <Bike className={`h-5 w-5 ${isActive ? "text-green-600" : "text-gray-500"}`} />
                                  </div>
                                  <div>
                                    <p className="font-medium">
                                      {reservation.vehicle_type} - {reservation.vehicle_model}
                                    </p>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                      <MapPin className="h-3 w-3 mr-1" />
                                      <span>Agence {reservation.agency_name}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      <span>{formatDate(new Date(reservation.start_date))}</span>
                                      <Clock className="h-3 w-3 ml-2 mr-1" />
                                      <span>
                                        {formatTime(new Date(reservation.start_date))} -{" "}
                                        {formatTime(new Date(reservation.end_date))}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge className={status.color}>{status.text}</Badge>
                                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="past" className="p-0">
                    {loading ? (
                      <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                      </div>
                    ) : pastReservations.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium">Aucune réservation passée</p>
                        <p className="text-sm text-muted-foreground mb-6">
                          Vous n'avez pas encore effectué de réservation
                        </p>
                        <Button className="bg-green-600 hover:bg-green-700" onClick={handleNewReservation}>
                          <Plus className="mr-2 h-4 w-4" />
                          Nouvelle réservation
                        </Button>
                      </div>
                    ) : (
                      <div className="divide-y">
                        {pastReservations.map((reservation) => {
                          const status = getStatusDisplay(reservation.status)

                          return (
                            <div
                              key={reservation.id}
                              className="p-4 hover:bg-muted/50 cursor-pointer"
                              onClick={() => handleViewReservation(reservation.id)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4">
                                  <div className="mt-1 rounded-full p-1 bg-gray-100">
                                    <Bike className="h-5 w-5 text-gray-500" />
                                  </div>
                                  <div>
                                    <p className="font-medium">
                                      {reservation.vehicle_type} - {reservation.vehicle_model}
                                    </p>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                      <MapPin className="h-3 w-3 mr-1" />
                                      <span>Agence {reservation.agency_name}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      <span>{formatDate(new Date(reservation.start_date))}</span>
                                      <Clock className="h-3 w-3 ml-2 mr-1" />
                                      <span>
                                        {formatTime(new Date(reservation.start_date))} -{" "}
                                        {formatTime(new Date(reservation.end_date))}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge className={status.color}>{status.text}</Badge>
                                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between border-t p-4">
                <Button variant="ghost" onClick={() => router.push("/reservations")}>
                  Voir toutes les réservations
                </Button>
                <Button className="bg-green-600 hover:bg-green-700" onClick={handleNewReservation}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvelle réservation
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Statistiques d'utilisation</CardTitle>
                <CardDescription>Votre impact écologique</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">CO2 économisé</span>
                    <span className="font-medium">{completedReservations * 2.5} kg</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-green-600 h-2.5 rounded-full"
                      style={{ width: `${Math.min((completedReservations * 10) / 2, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Distance parcourue</span>
                    <span className="font-medium">{completedReservations * 15} km</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${Math.min((completedReservations * 15) / 2, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Heures d'utilisation</span>
                    <span className="font-medium">
                      {reservations.reduce((total, res) => total + res.duration, 0)} heures
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-purple-600 h-2.5 rounded-full"
                      style={{
                        width: `${Math.min(
                          (reservations.reduce((total, res) => total + res.duration, 0) * 5) / 2,
                          100,
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Prochaine réservation</h3>
                  {upcomingReservations.length > 0 ? (
                    <div
                      className="p-3 border rounded-md cursor-pointer hover:bg-gray-50"
                      onClick={() => handleViewReservation(upcomingReservations[0].id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {upcomingReservations[0].vehicle_type} - {upcomingReservations[0].vehicle_model}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(new Date(upcomingReservations[0].start_date))}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-3 border rounded-md">
                      <p className="text-sm text-muted-foreground">Aucune réservation à venir</p>
                      <Button variant="link" className="mt-1 p-0 h-auto text-green-600" onClick={handleNewReservation}>
                        Réserver maintenant
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Incidents récents</CardTitle>
                <CardDescription>Suivez vos incidents signalés</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full flex justify-between items-center"
                  onClick={handleViewIncidents}
                >
                  <span>Voir mes incidents</span>
                  <AlertTriangle className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
