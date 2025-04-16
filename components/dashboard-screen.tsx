"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bike, Calendar, ChevronRight, Clock, MapPin, Plus, Settings, User } from "lucide-react"
import { AppLayout } from "./app-layout"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useReservations } from "@/hooks/use-reservations"
import { formatDate, formatTime } from "@/lib/utils/date-utils"

export function DashboardScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const { activeReservation, reservations, loading, fetchReservations } = useReservations()

  useEffect(() => {
    // Utiliser une variable pour éviter les appels multiples
    let isMounted = true

    const loadReservations = async () => {
      if (isMounted) {
        await fetchReservations()
      }
    }

    loadReservations()

    // Nettoyer l'effet
    return () => {
      isMounted = false
    }
  }, [fetchReservations]) // fetchReservations est maintenant mémorisé avec useCallback

  const handleNewReservation = () => {
    router.push("/new-reservation")
  }

  const handleViewReservation = () => {
    if (activeReservation) {
      router.push(`/reservation/${activeReservation.id}`)
    }
  }

  // Formater les initiales pour l'avatar
  const getInitials = () => {
    if (!user) return "U"
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
  }

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-2">
            <AvatarImage src="/placeholder.svg" alt="Avatar" />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold">Bonjour, {user?.firstName || "Utilisateur"}</h2>
            <p className="text-sm text-muted-foreground">Bienvenue sur Eco-Mobil</p>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      <Tabs defaultValue="reservations" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reservations">Réservations</TabsTrigger>
          <TabsTrigger value="profile">Profil</TabsTrigger>
        </TabsList>

        <TabsContent value="reservations" className="space-y-4 mt-4">
          {loading ? (
            <Card>
              <CardContent className="flex justify-center py-8">
                <div className="text-center">
                  <p className="text-muted-foreground">Chargement...</p>
                </div>
              </CardContent>
            </Card>
          ) : activeReservation ? (
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Réservation active</CardTitle>
                  <Badge className="bg-green-600">En cours</Badge>
                </div>
                <CardDescription>
                  {activeReservation.reservation_number} • {activeReservation.vehicle_type}{" "}
                  {activeReservation.vehicle_model}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>Agence {activeReservation.agency_name}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{formatDate(new Date(activeReservation.start_date))}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>
                      {formatTime(new Date(activeReservation.start_date))} -{" "}
                      {formatTime(new Date(activeReservation.end_date))}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Bike className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>1 véhicule</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline" onClick={handleViewReservation}>
                  Voir les détails
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Aucune réservation active</CardTitle>
                <CardDescription>Réservez un véhicule pour commencer</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center py-8">
                <div className="text-center">
                  <Bike className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Vous n'avez pas de réservation en cours</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleNewReservation}>
                  Nouvelle réservation
                  <Plus className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {reservations.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Historique</h3>
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  {reservations
                    .filter((r) => r.status !== "IN_PROGRESS")
                    .slice(0, 5)
                    .map((reservation) => (
                      <Card
                        key={reservation.id}
                        className="cursor-pointer hover:bg-accent"
                        onClick={() => router.push(`/reservation/${reservation.id}`)}
                      >
                        <CardHeader className="p-4 pb-2">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-sm font-medium">{reservation.reservation_number}</CardTitle>
                            <Badge variant="outline">
                              {reservation.status === "COMPLETED"
                                ? "Terminée"
                                : reservation.status === "CANCELLED"
                                  ? "Annulée"
                                  : reservation.status === "PENDING"
                                    ? "En attente"
                                    : reservation.status === "CONFIRMED"
                                      ? "Confirmée"
                                      : reservation.status === "VALIDATED"
                                        ? "Validée"
                                        : "En cours"}
                            </Badge>
                          </div>
                          <CardDescription className="text-xs">
                            {reservation.vehicle_type} {reservation.vehicle_model}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 text-xs">
                          <div className="flex justify-between">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{formatDate(new Date(reservation.start_date))}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>{reservation.agency_city}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </TabsContent>

        <TabsContent value="profile" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center mb-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder.svg" alt="Avatar" />
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">Membre depuis 2025</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <p className="text-sm">Annecy, France</p>
                </div>

                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <p className="text-sm">
                    {reservations.length} réservation{reservations.length !== 1 ? "s" : ""} effectuée
                    {reservations.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Modifier mon profil
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Préférences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Notifications</span>
                <Badge variant="outline">Activées</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Langue</span>
                <Badge variant="outline">Français</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Agence préférée</span>
                <Badge variant="outline">Annecy</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  )
}
