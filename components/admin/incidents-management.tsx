"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle, ChevronRight, Search, Loader2, RefreshCw, Calendar, Clock, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatDate, formatTime } from "@/lib/utils/date-utils"
import { AdminLayout } from "./admin-layout"
import { useIncidents } from "@/hooks/use-incidents"

export function IncidentsManagement() {
  const { toast } = useToast()
  const { incidents, currentIncident, loading, error, fetchAllIncidents, fetchIncidentById, updateIncidentStatus } =
    useIncidents()

  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedIncident, setSelectedIncident] = useState<any | null>(null)
  const [showResponseDialog, setShowResponseDialog] = useState(false)
  const [responseText, setResponseText] = useState("")
  const [newStatus, setNewStatus] = useState<string>("IN_PROGRESS")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [viewMode, setViewMode] = useState<"list" | "detail">("list")
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [directIncidents, setDirectIncidents] = useState<any[]>([])

  // Fonction pour charger les incidents directement depuis l'API
  const loadIncidentsDirectly = async () => {
    setIsLoading(true)
    setLoadError(null)

    try {
      console.log("Chargement direct des incidents...")
      const response = await fetch("/api/incidents", {
        method: "GET",
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      console.log("Statut de la réponse:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Erreur HTTP:", response.status, errorText)
        setLoadError(`Erreur HTTP: ${response.status}`)
        return []
      }

      const data = await response.json()
      console.log("Incidents récupérés directement:", data?.length || 0)

      // Afficher les premiers incidents pour le débogage
      if (data && data.length > 0) {
        console.log("Premier incident:", data[0])
      }

      setDirectIncidents(data || [])
      return data
    } catch (error) {
      console.error("Erreur lors du chargement direct des incidents:", error)
      setLoadError("Erreur lors du chargement des incidents")
      return []
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    console.log("IncidentsManagement - Chargement initial")
    loadIncidentsDirectly()
  }, [])

  const handleViewIncident = async (incident: any) => {
    setSelectedIncident(incident)
    setViewMode("detail")
  }

  const handleBack = () => {
    setViewMode("list")
    setSelectedIncident(null)
  }

  const handleOpenResponseDialog = (incident: any) => {
    setSelectedIncident(incident)
    setResponseText(incident.response || "")
    setNewStatus(incident.status === "REPORTED" ? "IN_PROGRESS" : "RESOLVED")
    setShowResponseDialog(true)
  }

  const handleSubmitResponse = async () => {
    if (!selectedIncident) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/incidents/${selectedIncident.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus, response: responseText }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour de l'incident")
      }

      const updatedIncident = await response.json()

      setShowResponseDialog(false)
      toast({
        title: "Succès",
        description: "L'incident a été mis à jour avec succès",
      })

      // Mettre à jour l'incident dans la liste
      setDirectIncidents((prev) => prev.map((inc) => (inc.id === selectedIncident.id ? updatedIncident : inc)))

      if (viewMode === "detail") {
        setSelectedIncident(updatedIncident)
      }

      // Recharger tous les incidents
      loadIncidentsDirectly()
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'incident:", error)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'incident. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Filtrer les incidents
  const filteredIncidents = directIncidents
    .filter((incident) => statusFilter === "all" || incident.status === statusFilter)
    .filter((incident) => {
      if (!searchTerm) return true
      const searchLower = searchTerm.toLowerCase()

      // Vérifier si les propriétés existent avant de les utiliser
      const reservationNumber = incident.reservation?.reservation_number || ""
      const firstName = incident.reservation?.user?.firstName || ""
      const lastName = incident.reservation?.user?.lastName || ""
      const type = incident.type || ""
      const description = incident.description || ""

      return (
        reservationNumber.toLowerCase().includes(searchLower) ||
        firstName.toLowerCase().includes(searchLower) ||
        lastName.toLowerCase().includes(searchLower) ||
        type.toLowerCase().includes(searchLower) ||
        description.toLowerCase().includes(searchLower)
      )
    })

  useEffect(() => {
    console.log("Incidents disponibles:", directIncidents.length)
    console.log("Incidents filtrés:", filteredIncidents.length)
  }, [directIncidents, filteredIncidents, statusFilter, searchTerm])

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

  // Fonction pour afficher le statut
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "REPORTED":
        return (
          <Badge variant="outline" className="bg-yellow-900 text-yellow-200 border-yellow-800">
            Signalé
          </Badge>
        )
      case "IN_PROGRESS":
        return (
          <Badge variant="outline" className="bg-slate-700 text-slate-200 border-slate-600">
            En traitement
          </Badge>
        )
      case "RESOLVED":
        return (
          <Badge variant="outline" className="bg-emerald-900 text-emerald-200 border-emerald-800">
            Résolu
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Vue détaillée d'un incident
  if (viewMode === "detail" && selectedIncident) {
    return (
      <AdminLayout>
        <div className="container mx-auto">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="icon" onClick={handleBack} className="text-white hover:bg-slate-800">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-xl font-semibold ml-2 text-white">Détails de l'incident</h2>
            <div className="ml-auto">
              <Button
                onClick={() => handleOpenResponseDialog(selectedIncident)}
                className="bg-slate-700 hover:bg-slate-600 text-white"
              >
                {selectedIncident.status === "RESOLVED" ? "Modifier la réponse" : "Répondre à l'incident"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="border-slate-700" style={{ backgroundColor: "hsl(222.2 47.4% 11.2%)" }}>
                <CardHeader className="pb-2 border-b border-slate-700">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl text-white">
                      Incident {getTypeDisplay(selectedIncident.type)}
                    </CardTitle>
                    {getStatusBadge(selectedIncident.status)}
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
                        <h3 className="font-medium mb-2 text-slate-300">Réponse</h3>
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
                  <CardTitle className="text-lg text-white">Informations client</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-slate-300">Nom:</span>
                      <span className="text-sm text-white">
                        {selectedIncident.reservation?.user?.firstName || "N/A"}{" "}
                        {selectedIncident.reservation?.user?.lastName || ""}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-slate-300">Email:</span>
                      <span className="text-sm text-white">{selectedIncident.reservation?.user?.email || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-slate-300">Téléphone:</span>
                      <span className="text-sm text-white">{selectedIncident.reservation?.user?.phone || "N/A"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-4 border-slate-700" style={{ backgroundColor: "hsl(222.2 47.4% 11.2%)" }}>
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
                      <span className="text-sm font-medium text-slate-300">Date début:</span>
                      <span className="text-sm text-white">
                        {selectedIncident.reservation?.start_date
                          ? formatDate(new Date(selectedIncident.reservation.start_date))
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-slate-300">Date fin:</span>
                      <span className="text-sm text-white">
                        {selectedIncident.reservation?.end_date
                          ? formatDate(new Date(selectedIncident.reservation.end_date))
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Gestion des incidents</h1>
            <p className="text-slate-400">Gérez les incidents signalés par les clients</p>
          </div>
          <Button variant="outline" onClick={() => loadIncidentsDirectly()} className="border-slate-700 text-slate-300">
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualiser
          </Button>
        </div>

        {/* Afficher les erreurs s'il y en a */}
        {(error || loadError) && (
          <Card className="mb-6 border-red-700 bg-red-900/20">
            <CardContent className="p-4">
              <div className="flex items-center text-red-300">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <p>{error || loadError}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filtres et recherche */}
          <div className="lg:col-span-1">
            <Card className="border-slate-700" style={{ backgroundColor: "hsl(222.2 47.4% 11.2%)" }}>
              <CardHeader>
                <CardTitle className="text-lg text-white">Filtres</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Recherche</label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
                    <Input
                      placeholder="Rechercher..."
                      className="pl-8 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Statut</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="REPORTED">Signalés</SelectItem>
                      <SelectItem value="IN_PROGRESS">En traitement</SelectItem>
                      <SelectItem value="RESOLVED">Résolus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4">
                  <h3 className="text-sm font-medium mb-2 text-slate-300">Statistiques</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Total:</span>
                      <Badge variant="outline" className="border-slate-600 text-slate-300">
                        {directIncidents.length}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Signalés:</span>
                      <Badge variant="outline" className="bg-yellow-900 text-yellow-200 border-yellow-800">
                        {directIncidents.filter((i) => i.status === "REPORTED").length}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">En traitement:</span>
                      <Badge variant="outline" className="bg-slate-700 text-slate-200 border-slate-600">
                        {directIncidents.filter((i) => i.status === "IN_PROGRESS").length}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Résolus:</span>
                      <Badge variant="outline" className="bg-emerald-900 text-emerald-200 border-emerald-800">
                        {directIncidents.filter((i) => i.status === "RESOLVED").length}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Liste des incidents */}
          <div className="lg:col-span-3">
            <Card className="border-slate-700" style={{ backgroundColor: "hsl(222.2 47.4% 11.2%)" }}>
              <CardHeader className="border-b border-slate-700">
                <CardTitle className="text-lg text-white">Liste des incidents</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-300">Date</TableHead>
                      <TableHead className="text-slate-300">Réservation</TableHead>
                      <TableHead className="text-slate-300">Client</TableHead>
                      <TableHead className="text-slate-300">Type</TableHead>
                      <TableHead className="text-slate-300">Statut</TableHead>
                      <TableHead className="text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow className="border-slate-700">
                        <TableCell colSpan={6} className="text-center py-4 text-slate-300">
                          <div className="flex justify-center items-center">
                            <Loader2 className="h-6 w-6 animate-spin mr-2 text-slate-400" />
                            Chargement des incidents...
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredIncidents.length === 0 ? (
                      <TableRow className="border-slate-700">
                        <TableCell colSpan={6} className="text-center py-4 text-slate-300">
                          <div className="flex flex-col items-center justify-center py-4">
                            <AlertTriangle className="h-8 w-8 text-slate-400 mb-2" />
                            <p>Aucun incident trouvé</p>
                            <Button
                              variant="outline"
                              onClick={() => loadIncidentsDirectly()}
                              className="mt-4 border-slate-700 text-slate-300"
                            >
                              Essayer de charger directement
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredIncidents.map((incident) => {
                        return (
                          <TableRow key={incident.id} className="border-slate-700">
                            <TableCell className="text-slate-300">
                              {formatDate(new Date(incident.reportedAt))}
                              <div className="text-xs text-slate-400">{formatTime(new Date(incident.reportedAt))}</div>
                            </TableCell>
                            <TableCell className="text-slate-300">
                              {incident.reservation?.reservation_number || "N/A"}
                              <div className="text-xs text-slate-400">
                                {incident.reservation?.vehicle?.type || ""} {incident.reservation?.vehicle?.model || ""}
                              </div>
                            </TableCell>
                            <TableCell className="text-slate-300">
                              {incident.reservation?.user?.firstName || "N/A"}{" "}
                              {incident.reservation?.user?.lastName || ""}
                              <div className="text-xs text-slate-400">{incident.reservation?.user?.email || ""}</div>
                            </TableCell>
                            <TableCell className="text-slate-300">{getTypeDisplay(incident.type)}</TableCell>
                            <TableCell>{getStatusBadge(incident.status)}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                                  onClick={() => handleOpenResponseDialog(incident)}
                                >
                                  {incident.status === "REPORTED" ? "Traiter" : "Mettre à jour"}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-slate-300 hover:bg-slate-800"
                                  onClick={() => handleViewIncident(incident)}
                                >
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
          </div>
        </div>

        {selectedIncident && (
          <Dialog open={showResponseDialog} onOpenChange={setShowResponseDialog}>
            <DialogContent
              className="sm:max-w-[600px] border-slate-700 text-white"
              style={{ backgroundColor: "hsl(222.2 47.4% 11.2%)" }}
            >
              <DialogHeader>
                <DialogTitle className="text-slate-200">Répondre à l'incident</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Incident signalé le {formatDate(new Date(selectedIncident.reportedAt))} par{" "}
                  {selectedIncident.reservation?.user?.firstName || "N/A"}{" "}
                  {selectedIncident.reservation?.user?.lastName || ""}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-slate-200">Détails de l'incident</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-slate-400">Type:</span>
                      <span className="text-sm text-slate-300">
                        {selectedIncident.type === "BREAKDOWN"
                          ? "Panne"
                          : selectedIncident.type === "THEFT"
                            ? "Vol"
                            : selectedIncident.type === "ACCIDENT"
                              ? "Accident"
                              : "Autre"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-slate-400">Réservation:</span>
                      <span className="text-sm text-slate-300">
                        {selectedIncident.reservation?.reservation_number || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-slate-400">Véhicule:</span>
                      <span className="text-sm text-slate-300">
                        {selectedIncident.reservation?.vehicle?.type || "N/A"}{" "}
                        {selectedIncident.reservation?.vehicle?.model || ""}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-slate-400">Date:</span>
                      <span className="text-sm text-slate-300">
                        {formatDate(new Date(selectedIncident.reportedAt))}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-slate-200">Description</h4>
                  <p className="text-sm bg-slate-800 p-3 rounded-md text-slate-300">{selectedIncident.description}</p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <h4 className="font-medium text-slate-200">Statut</h4>
                  <Select value={newStatus} onValueChange={(value: any) => setNewStatus(value)}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      <SelectItem value="IN_PROGRESS">En traitement</SelectItem>
                      <SelectItem value="RESOLVED">Résolu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <h4 className="font-medium text-slate-200">Réponse</h4>
                  <Textarea
                    placeholder="Entrez votre réponse ici..."
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    rows={5}
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowResponseDialog(false)}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleSubmitResponse}
                  disabled={isSubmitting || !responseText.trim()}
                  className="bg-slate-700 hover:bg-slate-600 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Envoi...
                    </>
                  ) : (
                    "Envoyer"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AdminLayout>
  )
}
