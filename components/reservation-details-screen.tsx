"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, ArrowLeft, Bike, Calendar, Clock, CreditCard, MapPin, QrCode } from "lucide-react"
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
import { formatDate, formatTime } from "@/lib/utils/date-utils"
import { Loader2 } from "lucide-react"

// Données fictives pour le mode statique
const MOCK_RESERVATION = {
  id: "reservation-1",
  reservation_number: "ECO-12345",
  user_id: "user-1",
  vehicle_id: "vehicle-1",
  agency_id: "agency-1",
  start_date: new Date().toISOString(),
  end_date: new Date(Date.now() + 3600000).toISOString(),
  duration: 1,
  status: "CONFIRMED",
  total_amount: 15,
  payment_status: "PAID",
  vehicle_type: "BIKE",
  vehicle_model: "City Explorer",
  vehicle_autonomy: 80,
  agency_name: "Eco Mobile Annecy Centre",
  agency_city: "Annecy",
  agency_address: "15 rue de la République, 74000 Annecy",
  agency_zip_code: "74000",
  agency_phone: "04 50 XX XX XX",
}

interface ReservationDetailsScreenProps {
  id?: string
}

export function ReservationDetailsScreen({ id }: ReservationDetailsScreenProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [reservationDetails, setReservationDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [incidentType, setIncidentType] = useState("panne")
  const [incidentDescription, setIncidentDescription] = useState("")
  const [reportLoading, setReportLoading] = useState(false)

  useEffect(() => {
    // Simuler un chargement
    const timer = setTimeout(() => {
      setReservationDetails(MOCK_RESERVATION)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [id])

  const handleBack = () => {
    router.back()
  }

  const handleCancel = async () => {
    if (!reservationDetails) return

    try {
      // Simuler une annulation
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
      // Simuler un signalement d'incident
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Incident signalé",
        description: "Votre signalement a été envoyé à l'agence",
      })

      setIncidentDescription("")
      setIncidentType("panne")
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
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    )
  }

  if (!reservationDetails) {
    return (
      <AppLayout>
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
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-semibold ml-2">Détails de la réservation</h2>
      </div>

      <div className="space-y-4">
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
          <CardContent className="pb-2">
            {isActive && (
              <>
                <div className="flex justify-center my-4">
                  <div className="bg-white p-2 rounded-lg">
                    <QrCode className="h-32 w-32" />
                  </div>
                </div>
                <p className="text-xs text-center text-muted-foreground mb-4">
                  Présentez ce QR code à l'agence pour récupérer votre véhicule
                </p>
              </>
            )}

            <div className="space-y-3">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Agence {reservationDetails.agency_name}</p>
                  <p className="text-xs text-muted-foreground">{reservationDetails.agency_address}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{formatDate(new Date(reservationDetails.start_date))}</p>
                  <p className="text-xs text-muted-foreground">Date de réservation</p>
                </div>
              </div>

              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
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

              <div className="flex items-center">
                <Bike className="h-5 w-5 mr-2 text-muted-foreground" />
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

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Paiement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-muted-foreground" />
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

        <div className="grid grid-cols-2 gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Signaler un incident
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Signaler un incident</DialogTitle>
                <DialogDescription>Veuillez décrire le problème rencontré avec votre véhicule.</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <RadioGroup value={incidentType} onValueChange={setIncidentType}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="panne" id="panne" />
                    <Label htmlFor="panne">Panne</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="vol" id="vol" />
                    <Label htmlFor="vol">Vol</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="accident" id="accident" />
                    <Label htmlFor="accident">Accident</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="autre" id="autre" />
                    <Label htmlFor="autre">Autre</Label>
                  </div>
                </RadioGroup>
                <div className="mt-4">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Décrivez le problème rencontré..."
                    className="mt-2"
                    value={incidentDescription}
                    onChange={(e) => setIncidentDescription(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {}}>
                  Annuler
                </Button>
                <Button onClick={handleReportIncident} disabled={reportLoading || !incidentDescription.trim()}>
                  {reportLoading ? (
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
    </AppLayout>
  )
}

export default ReservationDetailsScreen
