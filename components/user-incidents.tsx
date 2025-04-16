"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, ArrowLeft, Calendar, Clock, ChevronRight, Filter, RefreshCw } from "lucide-react"
import { AppLayout } from "./app-layout"
import { type Incident, useIncidents } from "@/hooks/use-incidents"
import { formatDate, formatTime } from "@/lib/utils/date-utils"
import { Loader2 } from "lucide-react"

export function UserIncidents() {
  const router = useRouter()
  const { userIncidents, loading, error, fetchUserIncidents } = useIncidents()
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    fetchUserIncidents()
  }, [fetchUserIncidents])

  const handleBack = () => {
    if (selectedIncident) {
      setSelectedIncident(null)
    } else {
      router.push("/dashboard")
    }
  }

  const handleViewIncident = (incident: Incident) => {
    setSelectedIncident(incident)
  }

  const handleRefresh = () => {
    fetchUserIncidents()
  }

  // Fonction pour afficher le statut
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "REPORTED":
        return { text: "Signalé", color: "bg-yellow-500" }
      case "IN_PROGRESS":
        return { text: "En traitement", color: "bg-blue-500" }
      case "RESOLVED":
        return { text: "Résolu", color: "bg-green-600" }
      default:
        return { text: status, color: "bg-gray-500" }
    }
  }

  // Fonction pour afficher le type
  const getTypeDisplay = (type: string) => {
    switch (type) {
      case "BREAKDOWN":
        return "Panne"
      case "THEFT":
        return "Vol"
      case "ACCIDENT":
        return "Accident"
      case "OTHER":
        return "Autre"
      default:
        return type
    }
  }

  // Filtrer les incidents selon l'onglet actif
  const filteredIncidents = userIncidents.filter((incident) => {
    if (activeTab === "all") return true
    if (activeTab === "active") return incident.status !== "RESOLVED"
    if (activeTab === "resolved") return incident.status === "RESOLVED"
    return true
  })

  // Compter les incidents par statut
  const activeIncidentsCount = userIncidents.filter((incident) => incident.status !== "RESOLVED").length
  const resolvedIncidentsCount = userIncidents.filter((incident) => incident.status === "RESOLVED").length

  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="flex justify-center items-center h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        </div>
      </AppLayout>
    )
  }

  // Affichage des détails d'un incident
  if (selectedIncident) {
    const status = getStatusDisplay(selectedIncident.status)

    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="icon" onClick={handleBack} className="text-white hover:bg-slate-800">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-xl font-semibold ml-2 text-white">Détails de l'incident</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="border-slate-700" style={{ backgroundColor: "hsl(222.2 47.4% 11.2%)" }}>
                <CardHeader className="pb-2 border-b border-slate-700">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl text-white">
                      Incident {getTypeDisplay(selectedIncident.type)}
                    </CardTitle>
                    <Badge className={status.color}>{status.text}</Badge>
                  </div>
                  <CardDescription className="text-slate-400">
                    Réservation {selectedIncident.reservation?.reservation_number || "N/A"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-slate-400" />
                      <div>
                        <p className="text-sm font-medium text-white">
                          {formatDate(new Date(selectedIncident.reportedAt))}
                        </p>
                        <p className="text-xs text-slate-400">
                          Signalé à {formatTime(new Date(selectedIncident.reportedAt))}
                        </p>
                      </div>
                    </div>
                    {selectedIncident.resolvedAt && (
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-slate-400" />
                        <div>
                          <p className="text-sm font-medium text-white">
                            {formatDate(new Date(selectedIncident.resolvedAt))}
                          </p>
                          <p className="text-xs text-slate-400">
                            Résolu à {formatTime(new Date(selectedIncident.resolvedAt))}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator className="bg-slate-700" />

                  <div>
                    <h3 className="font-medium mb-2 text-slate-300">Description</h3>
                    <p className="text-sm bg-slate-800 p-3 rounded-md text-white">{selectedIncident.description}</p>
                  </div>

                  {selectedIncident.response && (
                    <>
                      <Separator className="bg-slate-700" />
                      <div>
                        <h3 className="font-medium mb-2 text-slate-300">Réponse de l'agence</h3>
                        <p className="text-sm bg-slate-800 p-3 rounded-md border border-slate-700 text-white">
                          {selectedIncident.response}
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="border-slate-700" style={{ backgroundColor: "hsl(222.2 47.4% 11.2%)" }}>
                <CardHeader>
                  <CardTitle className="text-lg text-white">Détails de la réservation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-slate-300">Réservation:</span>
                      <span className="text-sm text-white">
                        {selectedIncident.reservation?.reservation_number || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-slate-300">Véhicule:</span>
                      <span className="text-sm text-white">
                        {selectedIncident.reservation?.vehicle?.type || "N/A"}{" "}
                        {selectedIncident.reservation?.vehicle?.model || ""}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-slate-300">Agence:</span>
                      <span className="text-sm text-white">{selectedIncident.reservation?.agency?.name || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-slate-300">Date:</span>
                      <span className="text-sm text-white">
                        {selectedIncident.reservation?.start_date
                          ? formatDate(new Date(selectedIncident.reservation.start_date))
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  {selectedIncident.reservation && (
                    <Button
                      variant="outline"
                      className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                      onClick={() => router.push(`/reservation/${selectedIncident.reservation?.id}`)}
                    >
                      Voir la réservation
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card className="mt-4 border-slate-700" style={{ backgroundColor: "hsl(222.2 47.4% 11.2%)" }}>
                <CardHeader>
                  <CardTitle className="text-lg text-white">Statut de l'incident</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-300">État actuel:</span>
                      <Badge className={status.color}>{status.text}</Badge>
                    </div>

                    <div className="relative pt-4">
                      <div className="absolute left-2.5 top-0 h-full w-0.5 bg-slate-700"></div>
                      <ul className="space-y-6 relative">
                        <li className="ml-6">
                          <div className="absolute -left-2.5 mt-1.5 h-5 w-5 rounded-full border-2 border-slate-500 bg-slate-900"></div>
                          <div className="text-sm">
                            <p className="font-medium text-white">Incident signalé</p>
                            <p className="text-xs text-slate-400">
                              {formatDate(new Date(selectedIncident.reportedAt))} à{" "}
                              {formatTime(new Date(selectedIncident.reportedAt))}
                            </p>
                          </div>
                        </li>

                        {selectedIncident.status === "IN_PROGRESS" && (
                          <li className="ml-6">
                            <div className="absolute -left-2.5 mt-1.5 h-5 w-5 rounded-full border-2 border-blue-500 bg-slate-900"></div>
                            <div className="text-sm">
                              <p className="font-medium text-white">En cours de traitement</p>
                              <p className="text-xs text-slate-400">L'agence traite actuellement votre incident</p>
                            </div>
                          </li>
                        )}

                        {selectedIncident.status === "RESOLVED" && (
                          <li className="ml-6">
                            <div className="absolute -left-2.5 mt-1.5 h-5 w-5 rounded-full border-2 border-green-600 bg-slate-900"></div>
                            <div className="text-sm">
                              <p className="font-medium text-white">Incident résolu</p>
                              <p className="text-xs text-slate-400">
                                {selectedIncident.resolvedAt
                                  ? `${formatDate(new Date(selectedIncident.resolvedAt))} à ${formatTime(
                                      new Date(selectedIncident.resolvedAt),
                                    )}`
                                  : "Date non spécifiée"}
                              </p>
                            </div>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={handleBack} className="text-white hover:bg-slate-800">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-xl font-semibold ml-2 text-white">Mes incidents</h2>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/support")}
              className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Contacter le support
            </Button>
          </div>
        </div>

        {error ? (
          <Card className="border-red-800" style={{ backgroundColor: "hsl(222.2 47.4% 11.2%)" }}>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
              <p className="text-xl font-medium text-white">Erreur de chargement</p>
              <p className="text-base text-slate-400 mt-2 mb-6">{error}</p>
              <Button onClick={handleRefresh} className="bg-slate-700 hover:bg-slate-600 text-white">
                <RefreshCw className="mr-2 h-4 w-4" />
                Réessayer
              </Button>
            </CardContent>
          </Card>
        ) : userIncidents.length === 0 ? (
          <Card className="border-slate-700" style={{ backgroundColor: "hsl(222.2 47.4% 11.2%)" }}>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <AlertTriangle className="h-16 w-16 text-slate-400 mb-4" />
              <p className="text-xl font-medium text-white">Aucun incident</p>
              <p className="text-base text-slate-400 mt-2">Vous n'avez signalé aucun incident pour le moment.</p>
              <Button
                className="mt-6 bg-slate-700 hover:bg-slate-600 text-white"
                onClick={() => router.push("/support")}
              >
                Contacter le support
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-slate-700" style={{ backgroundColor: "hsl(222.2 47.4% 11.2%)" }}>
            <CardHeader className="pb-0 border-b border-slate-700">
              <CardTitle className="text-white">Liste des incidents</CardTitle>
              <CardDescription className="text-slate-400">Historique de vos incidents signalés</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <div className="flex justify-between items-center mb-4">
                  <TabsList className="bg-slate-800">
                    <TabsTrigger
                      value="all"
                      className="relative data-[state=active]:bg-slate-700 text-slate-300 data-[state=active]:text-white"
                    >
                      Tous
                      <Badge className="ml-2 bg-gray-500">{userIncidents.length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger
                      value="active"
                      className="relative data-[state=active]:bg-slate-700 text-slate-300 data-[state=active]:text-white"
                    >
                      En cours
                      <Badge className="ml-2 bg-yellow-500">{activeIncidentsCount}</Badge>
                    </TabsTrigger>
                    <TabsTrigger
                      value="resolved"
                      className="relative data-[state=active]:bg-slate-700 text-slate-300 data-[state=active]:text-white"
                    >
                      Résolus
                      <Badge className="ml-2 bg-green-600">{resolvedIncidentsCount}</Badge>
                    </TabsTrigger>
                  </TabsList>
                  <div className="flex items-center text-sm text-slate-400">
                    <Filter className="h-4 w-4 mr-1" />
                    <span>Filtrer par statut</span>
                  </div>
                </div>

                <TabsContent value="all" className="m-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredIncidents.map((incident) => {
                      const status = getStatusDisplay(incident.status)
                      return (
                        <Card
                          key={incident.id}
                          className="cursor-pointer hover:bg-slate-800 border-slate-700 transition-colors"
                          style={{ backgroundColor: "hsl(222.2 47.4% 11.2%)" }}
                          onClick={() => handleViewIncident(incident)}
                        >
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-base text-white">{getTypeDisplay(incident.type)}</CardTitle>
                              <Badge className={status.color}>{status.text}</Badge>
                            </div>
                            <CardDescription className="text-slate-400">
                              {formatDate(new Date(incident.reportedAt))} •{" "}
                              {incident.reservation?.reservation_number || "N/A"}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm line-clamp-2 text-slate-300">{incident.description}</p>
                            {incident.response && (
                              <div className="mt-2 p-2 bg-slate-800 rounded-md border border-slate-700">
                                <p className="text-xs font-medium text-slate-300">Réponse:</p>
                                <p className="text-xs line-clamp-1 text-white">{incident.response}</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="active" className="m-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredIncidents.map((incident) => {
                      const status = getStatusDisplay(incident.status)
                      return (
                        <Card
                          key={incident.id}
                          className="cursor-pointer hover:bg-slate-800 border-slate-700 transition-colors"
                          style={{ backgroundColor: "hsl(222.2 47.4% 11.2%)" }}
                          onClick={() => handleViewIncident(incident)}
                        >
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-base text-white">{getTypeDisplay(incident.type)}</CardTitle>
                              <Badge className={status.color}>{status.text}</Badge>
                            </div>
                            <CardDescription className="text-slate-400">
                              {formatDate(new Date(incident.reportedAt))} •{" "}
                              {incident.reservation?.reservation_number || "N/A"}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm line-clamp-2 text-slate-300">{incident.description}</p>
                            {incident.response && (
                              <div className="mt-2 p-2 bg-slate-800 rounded-md border border-slate-700">
                                <p className="text-xs font-medium text-slate-300">Réponse:</p>
                                <p className="text-xs line-clamp-1 text-white">{incident.response}</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="resolved" className="m-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredIncidents.map((incident) => {
                      const status = getStatusDisplay(incident.status)
                      return (
                        <Card
                          key={incident.id}
                          className="cursor-pointer hover:bg-slate-800 border-slate-700 transition-colors"
                          style={{ backgroundColor: "hsl(222.2 47.4% 11.2%)" }}
                          onClick={() => handleViewIncident(incident)}
                        >
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-base text-white">{getTypeDisplay(incident.type)}</CardTitle>
                              <Badge className={status.color}>{status.text}</Badge>
                            </div>
                            <CardDescription className="text-slate-400">
                              {formatDate(new Date(incident.reportedAt))} •{" "}
                              {incident.reservation?.reservation_number || "N/A"}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm line-clamp-2 text-slate-300">{incident.description}</p>
                            {incident.response && (
                              <div className="mt-2 p-2 bg-slate-800 rounded-md border border-slate-700">
                                <p className="text-xs font-medium text-slate-300">Réponse:</p>
                                <p className="text-xs line-clamp-1 text-white">{incident.response}</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  )
}
