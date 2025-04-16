"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  AlertTriangle,
  ArrowLeft,
  Bike,
  Calendar,
  Clock,
  CreditCard,
  MapPin,
  QrCode,
  Printer,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { AppLayout } from "./app-layout"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useReservations } from "@/hooks/use-reservations"
import { formatDate, formatTime } from "@/lib/utils/date-utils"
import { Loader2 } from "lucide-react"

interface ReservationDetailsScreenProps {
  id?: string
}

export default function ReservationDetailsScreen({ id }: ReservationDetailsScreenProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { reservationDetails, fetchReservationDetails, updateReservation, reportIncident, loading } = useReservations()
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showIncidentDialog, setShowIncidentDialog] = useState(false)
  const [incidentType, setIncidentType] = useState("BREAKDOWN")
  const [incidentDescription, setIncidentDescription] = useState("")
  const [reportLoading, setReportLoading] = useState(false)
  const [reportSuccess, setReportSuccess] = useState(false)

  useEffect(() => {
    if (id) {
      fetchReservationDetails(id)
    }
  }, [id, fetchReservationDetails])

  const handleBack = () => {
    router.back()
  }

  const handleCancel = async () => {
    if (!reservationDetails) return

    try {
      await updateReservation(reservationDetails.id, "cancel")
      setShowCancelDialog(false)
      toast({
        title: "Réservation annulée",
        description: "Votre réservation a été annulée avec succès",
      })
      router.push("/dashboard")
    } catch (error) {
      console.error("Erreur lors de l'annulation:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'annulation de la réservation",
        variant: "destructive",
      })
    }
  }

  const handleReportIncident = async () => {
    if (!reservationDetails) return

    setReportLoading(true)
    try {
      console.log("Signalement d'incident:", {
        reservationId: reservationDetails.id,
        type: incidentType,
        description: incidentDescription,
      })

      const result = await reportIncident({
        reservationId: reservationDetails.id,
        type: incidentType,
        description: incidentDescription,
      })

      console.log("Résultat du signalement:", result)
      setReportSuccess(true)

      setTimeout(() => {
        setShowIncidentDialog(false)
        setReportSuccess(false)
        setIncidentDescription("")
        setIncidentType("BREAKDOWN")

        toast({
          title: "Incident signalé",
          description: "Votre signalement a été envoyé à l'agence",
        })
      }, 1500)
    } catch (error) {
      console.error("Erreur lors du signalement:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du signalement de l'incident",
        variant: "destructive",
      })
    } finally {
      setReportLoading(false)
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="flex justify-center items-center h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!reservationDetails) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="flex items-center mb-4">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-lg font-semibold ml-2">Détails de la réservation</h2>
          </div>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <AlertTriangle className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">Réservation non trouvée</p>
              <p className="text-sm text-muted-foreground mt-2">
                La réservation que vous recherchez n'existe pas ou vous n'avez pas les droits pour y accéder.
              </p>
              <Button className="mt-6" onClick={() => router.push("/dashboard")}>
                Retour au tableau de bord
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    )
  }

  // Déterminer le statut à afficher
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

  const status = getStatusDisplay(reservationDetails.status)
  const isActive = reservationDetails.status === "IN_PROGRESS"
  const canCancel = ["PENDING", "CONFIRMED", "VALIDATED"].includes(reservationDetails.status)

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-xl font-semibold ml-2">Détails de la réservation</h2>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Imprimer
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className={isActive ? "border-green-200 bg-green-50" : ""}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{reservationDetails.reservation_number}</CardTitle>
                  <Badge className={status.color}>{status.text}</Badge>
                </div>
                <CardDescription>
                  {reservationDetails.vehicle_type} - {reservationDetails.vehicle_model}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                {isActive && (
                  <div className="flex flex-col md:flex-row items-center justify-center my-6 gap-6">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                      <QrCode className="h-40 w-40" />
                    </div>
                    <div className="text-center md:text-left">
                      <h3 className="text-lg font-semibold text-green-700 mb-2">Votre réservation est active</h3>
                      <p className="text-sm mb-4">
                        Présentez ce QR code à l'agence pour récupérer votre véhicule. Vous pouvez également l'imprimer
                        ou le télécharger pour une utilisation hors ligne.
                      </p>
                      <Button className="bg-green-600 hover:bg-green-700">
                        <Printer className="mr-2 h-4 w-4" />
                        Imprimer le QR code
                      </Button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-3 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Agence {reservationDetails.agency_name}</p>
                      <p className="text-xs text-muted-foreground">{reservationDetails.agency_address}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-3 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{formatDate(new Date(reservationDetails.start_date))}</p>
                      <p className="text-xs text-muted-foreground">Date de réservation</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="h-5 w-5 mr-3 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">
                        {formatTime(new Date(reservationDetails.start_date))} -{" "}
                        {formatTime(new Date(reservationDetails.end_date))}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {reservationDetails.duration} heure{reservationDetails.duration > 1 ? "s" : ""} de location
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Bike className="h-5 w-5 mr-3 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">
                        {reservationDetails.vehicle_type} - {reservationDetails.vehicle_model}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Autonomie: {reservationDetails.vehicle_autonomy || 80}km
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Paiement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Carte Visa •••• 4242</p>
                    <p className="text-xs text-muted-foreground">
                      Paiement {reservationDetails.payment_status === "PAID" ? "effectué" : "en attente"}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Location ({reservationDetails.duration}h)</span>
                    <span className="text-sm">{(Number(reservationDetails.total_amount) * 0.8).toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Assurance</span>
                    <span className="text-sm">3,00 €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">TVA (20%)</span>
                    <span className="text-sm">{(Number(reservationDetails.total_amount) * 0.2).toFixed(2)} €</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>{Number(reservationDetails.total_amount).toFixed(2)} €</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <Dialog open={showIncidentDialog} onOpenChange={setShowIncidentDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Signaler un incident
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  {reportSuccess ? (
                    <div className="py-8 flex flex-col items-center justify-center">
                      <div className="rounded-full bg-green-100 p-3 mb-4">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-center mb-2">Incident signalé avec succès</h3>
                      <p className="text-center text-muted-foreground mb-6">
                        Votre signalement a été envoyé à l'agence. Vous serez contacté rapidement.
                      </p>
                    </div>
                  ) : (
                    <>
                      <DialogHeader>
                        <DialogTitle>Signaler un incident</DialogTitle>
                        <DialogDescription>
                          Veuillez décrire le problème rencontré avec votre véhicule.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <div className="mb-4">
                          <Label className="text-base font-medium mb-3 block">Type d'incident</Label>
                          <RadioGroup
                            value={incidentType}
                            onValueChange={setIncidentType}
                            className="grid grid-cols-2 gap-4"
                          >
                            <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50 cursor-pointer">
                              <RadioGroupItem value="BREAKDOWN" id="panne" className="border-green-600" />
                              <Label htmlFor="panne" className="cursor-pointer">
                                Panne
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50 cursor-pointer">
                              <RadioGroupItem value="THEFT" id="vol" className="border-green-600" />
                              <Label htmlFor="vol" className="cursor-pointer">
                                Vol
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50 cursor-pointer">
                              <RadioGroupItem value="ACCIDENT" id="accident" className="border-green-600" />
                              <Label htmlFor="accident" className="cursor-pointer">
                                Accident
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50 cursor-pointer">
                              <RadioGroupItem value="OTHER" id="autre" className="border-green-600" />
                              <Label htmlFor="autre" className="cursor-pointer">
                                Autre
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                        <div className="mt-4">
                          <Label htmlFor="description" className="text-base font-medium mb-2 block">
                            Description détaillée
                          </Label>
                          <Textarea
                            id="description"
                            placeholder="Décrivez le problème rencontré..."
                            className="min-h-[120px]"
                            value={incidentDescription}
                            onChange={(e) => setIncidentDescription(e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground mt-2">
                            Veuillez fournir autant de détails que possible pour nous aider à traiter votre incident
                            rapidement.
                          </p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowIncidentDialog(false)}>
                          <XCircle className="h-4 w-4 mr-2" />
                          Annuler
                        </Button>
                        <Button
                          onClick={handleReportIncident}
                          disabled={reportLoading || !incidentDescription.trim()}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {reportLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Envoi...
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="mr-2 h-4 w-4" />
                              Signaler l'incident
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </>
                  )}
                </DialogContent>
              </Dialog>

              <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="w-full" disabled={!canCancel}>
                    Annuler la réservation
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Annuler la réservation</DialogTitle>
                    <DialogDescription>
                      Êtes-vous sûr de vouloir annuler votre réservation ? Cette action est irréversible.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="text-sm text-muted-foreground">Conditions d'annulation :</p>
                    <ul className="text-sm text-muted-foreground list-disc pl-5 mt-2">
                      <li>Annulation gratuite jusqu'à 24h avant la réservation</li>
                      <li>50% de frais d'annulation entre 24h et 2h avant la réservation</li>
                      <li>Aucun remboursement pour une annulation moins de 2h avant</li>
                    </ul>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                      Retour
                    </Button>
                    <Button variant="destructive" onClick={handleCancel}>
                      Confirmer l'annulation
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export { ReservationDetailsScreen }
