"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ArrowRight, Bike, Calendar, Clock, Info, MapPin, BikeIcon as Scooter } from "lucide-react"
import { AppLayout } from "./app-layout"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useToast } from "@/hooks/use-toast"
// Ajouter l'import pour useReservations
import { useReservations } from "@/hooks/use-reservations"
import { useVehicles } from "@/hooks/use-vehicles"
import { Loader2 } from "lucide-react"

// Modifier la fonction NewReservationScreen pour ajouter la création de réservation
export function NewReservationScreen() {
  const router = useRouter()
  const { toast } = useToast()
  const { createReservation } = useReservations()
  const { vehicles, fetchVehicles } = useVehicles()
  const [step, setStep] = useState(1)
  const [agency, setAgency] = useState("")
  const [date, setDate] = useState<Date>()
  const [duration, setDuration] = useState("")
  const [vehicleType, setVehicleType] = useState("")
  const [selectedVehicle, setSelectedVehicle] = useState<string>("")
  const [loading, setLoading] = useState(false)

  // Ajouter useEffect pour charger les véhicules disponibles quand l'agence et le type de véhicule sont sélectionnés
  useEffect(() => {
    // Éviter les appels inutiles si les valeurs ne sont pas définies
    if (agency && vehicleType) {
      console.log("Fetching vehicles for:", agency, vehicleType)
      // Utiliser le nom de l'agence au lieu de l'ID
      fetchVehicles(undefined, vehicleType, agency)
    }
  }, [agency, vehicleType, fetchVehicles]) // fetchVehicles est maintenant mémorisé avec useCallback

  // Mettre à jour handleNext pour créer la réservation
  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Créer la réservation
      setLoading(true)
      try {
        // Utiliser le premier véhicule disponible du type sélectionné si aucun n'est spécifiquement choisi
        const vehicleId = selectedVehicle || (vehicles.length > 0 ? vehicles[0].id : "")

        if (!vehicleId) {
          throw new Error("Aucun véhicule disponible")
        }

        if (!date) {
          throw new Error("Veuillez sélectionner une date")
        }

        // Récupérer l'ID de l'agence à partir du véhicule sélectionné
        const selectedVehicleObj = vehicles.find((v) => v.id === vehicleId)
        if (!selectedVehicleObj) {
          throw new Error("Véhicule non trouvé")
        }

        const reservationData = {
          vehicleId,
          agencyId: selectedVehicleObj.agency_id, // Utiliser l'ID de l'agence du véhicule
          startDate: date,
          duration: Number.parseInt(duration),
        }

        const result = await createReservation(reservationData)

        if (result) {
          toast({
            title: "Réservation confirmée",
            description: `Votre réservation a été effectuée avec succès. Numéro: ${result.reservation_number}`,
          })
          router.push(`/reservation/${result.id}`)
        }
      } catch (error: any) {
        toast({
          title: "Erreur",
          description: error.message || "Une erreur est survenue lors de la création de la réservation",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    } else {
      router.back()
    }
  }

  const isStepComplete = () => {
    switch (step) {
      case 1:
        return agency !== "" && date !== undefined
      case 2:
        return vehicleType !== "" && duration !== ""
      case 3:
        return true
      default:
        return false
    }
  }

  return (
    <AppLayout>
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-semibold ml-2">Nouvelle réservation</h2>
      </div>

      <div className="flex justify-between mb-6">
        <div className="flex flex-col items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-green-600 text-white" : "bg-muted text-muted-foreground"}`}
          >
            1
          </div>
          <span className="text-xs mt-1">Lieu & Date</span>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className={`h-1 w-full ${step >= 2 ? "bg-green-600" : "bg-muted"}`}></div>
        </div>
        <div className="flex flex-col items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-green-600 text-white" : "bg-muted text-muted-foreground"}`}
          >
            2
          </div>
          <span className="text-xs mt-1">Véhicule</span>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className={`h-1 w-full ${step >= 3 ? "bg-green-600" : "bg-muted"}`}></div>
        </div>
        <div className="flex flex-col items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-green-600 text-white" : "bg-muted text-muted-foreground"}`}
          >
            3
          </div>
          <span className="text-xs mt-1">Paiement</span>
        </div>
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Choisissez une agence et une date</CardTitle>
            <CardDescription>Sélectionnez l'agence et la date de votre réservation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="agency">Agence</Label>
              <Select value={agency} onValueChange={setAgency}>
                <SelectTrigger id="agency">
                  <SelectValue placeholder="Sélectionnez une agence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="annecy">Annecy</SelectItem>
                  <SelectItem value="grenoble">Grenoble</SelectItem>
                  <SelectItem value="chambery">Chambéry</SelectItem>
                  <SelectItem value="valence">Valence</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date de réservation</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: fr }) : "Sélectionnez une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            {agency && (
              <div className="pt-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Agence {agency.charAt(0).toUpperCase() + agency.slice(1)}</p>
                    <p className="text-xs text-muted-foreground">12 rue du Lac, 74000 Annecy</p>
                    <p className="text-xs text-muted-foreground mt-1">Horaires: 9h00 - 19h00</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={handleNext}
              disabled={!isStepComplete()}
            >
              Continuer
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Choisissez votre véhicule</CardTitle>
            <CardDescription>Sélectionnez le type de véhicule et la durée de location</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Type de véhicule</Label>
              <RadioGroup value={vehicleType} onValueChange={setVehicleType}>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="velo" className="flex items-center space-x-3 rounded-md border p-3 cursor-pointer">
                    <RadioGroupItem value="velo" id="velo" />
                    <Bike className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Vélo électrique</p>
                      <p className="text-xs text-muted-foreground">City Explorer - Autonomie 80km</p>
                    </div>
                    <div className="text-sm font-medium">6€/h</div>
                  </Label>

                  <Label
                    htmlFor="trottinette"
                    className="flex items-center space-x-3 rounded-md border p-3 cursor-pointer"
                  >
                    <RadioGroupItem value="trottinette" id="trottinette" />
                    <Scooter className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Trottinette électrique</p>
                      <p className="text-xs text-muted-foreground">Urban Glide - Autonomie 30km</p>
                    </div>
                    <div className="text-sm font-medium">5€/h</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Durée de location</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger id="duration">
                  <SelectValue placeholder="Sélectionnez une durée" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 heure</SelectItem>
                  <SelectItem value="2">2 heures</SelectItem>
                  <SelectItem value="4">4 heures</SelectItem>
                  <SelectItem value="8">8 heures (journée)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {vehicles.length > 0 && vehicleType && (
              <div className="space-y-2">
                <Label htmlFor="vehicle">Véhicule disponible</Label>
                <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                  <SelectTrigger id="vehicle">
                    <SelectValue placeholder="Sélectionnez un véhicule" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.model} - {vehicle.hourly_rate}€/h
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {vehicleType && duration && (
              <Card className="mt-4 bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-center mb-2">
                    <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="text-sm font-medium">Récapitulatif</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Agence:</span>
                      <span>{agency.charAt(0).toUpperCase() + agency.slice(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span>{date ? format(date, "PPP", { locale: fr }) : ""}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Véhicule:</span>
                      <span>{vehicleType === "velo" ? "Vélo électrique" : "Trottinette électrique"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Durée:</span>
                      <span>
                        {duration} heure{Number.parseInt(duration) > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={handleNext}
              disabled={!isStepComplete()}
            >
              Continuer
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Paiement</CardTitle>
            <CardDescription>Vérifiez votre commande et procédez au paiement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {vehicleType === "velo" ? (
                    <Bike className="h-5 w-5 mr-2 text-muted-foreground" />
                  ) : (
                    <Scooter className="h-5 w-5 mr-2 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium">
                    {vehicleType === "velo" ? "Vélo électrique" : "Trottinette électrique"}
                  </span>
                </div>
                <span className="text-sm font-medium">{vehicleType === "velo" ? "6" : "5"}€/h</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {duration} heure{Number.parseInt(duration) > 1 ? "s" : ""}
                  </span>
                </div>
                <span className="text-sm font-medium">x{duration}</span>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Location ({duration}h)</span>
                  <span className="text-sm">{(vehicleType === "velo" ? 6 : 5) * Number.parseInt(duration)},00 €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Assurance</span>
                  <span className="text-sm">3,00 €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">TVA (20%)</span>
                  <span className="text-sm">
                    {(((vehicleType === "velo" ? 6 : 5) * Number.parseInt(duration) + 3) * 0.2).toFixed(2)} €
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{(((vehicleType === "velo" ? 6 : 5) * Number.parseInt(duration) + 3) * 1.2).toFixed(2)} €</span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-sm font-medium mb-2">Informations de paiement</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center">
                    <div className="w-8 h-5 bg-blue-600 rounded mr-2"></div>
                    <span className="text-sm">Visa •••• 4242</span>
                  </div>
                  {/* Correction ici: Envelopper le RadioGroupItem dans un RadioGroup */}
                  <RadioGroup value="card">
                    <RadioGroupItem value="card" id="card" />
                  </RadioGroup>
                </div>
                <Button variant="outline" className="w-full text-sm">
                  + Ajouter une carte
                </Button>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-xs text-muted-foreground">
                En cliquant sur "Confirmer et payer", vous acceptez les conditions générales de location et la politique
                de confidentialité d'Eco-Mobil.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleNext} disabled={loading}>
              {loading ? (
                <>
                  <span className="mr-2">Traitement en cours...</span>
                  <Loader2 className="h-4 w-4 animate-spin" />
                </>
              ) : (
                <>Confirmer et payer</>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
    </AppLayout>
  )
}
