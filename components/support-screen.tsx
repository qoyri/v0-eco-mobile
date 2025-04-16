"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { AlertTriangle, HelpCircle, MessageSquare, Phone, Send } from "lucide-react"
import { AppLayout } from "./app-layout"
import { useToast } from "@/hooks/use-toast"

export function SupportScreen() {
  const { toast } = useToast()
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Message envoyé",
      description: "Nous vous répondrons dans les plus brefs délais",
    })
    setSubject("")
    setMessage("")
  }

  return (
    <AppLayout>
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-green-700">Support</h1>
          <p className="text-muted-foreground">Besoin d'aide ? Nous sommes là pour vous aider</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <MessageSquare className="h-5 w-5 mr-2 text-green-600" />
                  Nous contacter
                </CardTitle>
                <CardDescription>Envoyez-nous un message et nous vous répondrons rapidement</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Sujet</Label>
                    <Select value={subject} onValueChange={setSubject} required>
                      <SelectTrigger id="subject">
                        <SelectValue placeholder="Sélectionnez un sujet" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reservation">Question sur ma réservation</SelectItem>
                        <SelectItem value="incident">Signaler un problème</SelectItem>
                        <SelectItem value="account">Gestion de compte</SelectItem>
                        <SelectItem value="other">Autre demande</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Comment pouvons-nous vous aider ?"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      className="min-h-[200px]"
                    />
                  </div>

                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                    Envoyer
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-green-600" />
                  Nous appeler
                </CardTitle>
                <CardDescription>Notre service client est disponible du lundi au vendredi de 9h à 18h</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center py-4">
                  <Button variant="outline" className="text-lg px-6">
                    04 50 XX XX XX
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2 text-green-600" />
                  Questions fréquentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Comment annuler ma réservation ?</AccordionTrigger>
                    <AccordionContent>
                      Vous pouvez annuler votre réservation directement depuis l'application en accédant aux détails de
                      votre réservation et en cliquant sur "Annuler la réservation". Les conditions d'annulation
                      dépendent du délai avant la date de réservation.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Que faire en cas de panne ?</AccordionTrigger>
                    <AccordionContent>
                      En cas de panne, utilisez la fonction "Signaler un incident" dans les détails de votre
                      réservation. Notre équipe sera immédiatement notifiée et prendra contact avec vous pour vous
                      assister.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Comment prolonger ma location ?</AccordionTrigger>
                    <AccordionContent>
                      Pour prolonger votre location, contactez directement l'agence où vous avez loué le véhicule. La
                      prolongation est possible sous réserve de disponibilité du véhicule.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>Les véhicules sont-ils assurés ?</AccordionTrigger>
                    <AccordionContent>
                      Oui, tous nos véhicules sont assurés. Une assurance de base est incluse dans le prix de la
                      location. Des options d'assurance complémentaires sont disponibles lors de la réservation.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                  Urgence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">
                  En cas d'urgence (accident, vol), contactez immédiatement notre numéro d'urgence disponible 24h/24 et
                  7j/7 :
                </p>
                <div className="flex justify-center">
                  <Button variant="destructive" className="text-lg px-6">
                    04 50 XX XX XX
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
