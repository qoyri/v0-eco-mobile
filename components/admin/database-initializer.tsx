"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, Database, UserPlus, TableProperties, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface DatabaseStatus {
  success: boolean
  tablesStatus: Record<string, boolean>
  enumsStatus: Record<string, boolean>
  recordCounts: Record<string, number>
  isDatabaseInitialized: boolean
  isDatabaseEmpty: boolean
  allTablesExist: boolean
  allEnumsExist: boolean
}

export default function DatabaseInitializer() {
  const [dbStatus, setDbStatus] = useState<DatabaseStatus | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [initLoading, setInitLoading] = useState<boolean>(false)
  const [seedLoading, setSeedLoading] = useState<boolean>(false)
  const [usersLoading, setUsersLoading] = useState<boolean>(false)
  const { toast } = useToast()

  // Vérifier l'état de la base de données au chargement du composant
  useEffect(() => {
    checkDatabaseStatus()
  }, [])

  // Vérifier l'état de la base de données
  const checkDatabaseStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/db-status")
      const data = await response.json()
      setDbStatus(data)
    } catch (error) {
      console.error("Erreur lors de la vérification de l'état de la base de données:", error)
      toast({
        title: "Erreur",
        description: "Impossible de vérifier l'état de la base de données",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Initialiser la base de données
  const initializeDatabase = async () => {
    setInitLoading(true)
    try {
      const response = await fetch("/api/init-db", {
        method: "POST",
      })
      const data = await response.json()

      if (data.success) {
        toast({
          title: "Succès",
          description: "Base de données initialisée avec succès",
        })
        // Mettre à jour l'état de la base de données
        checkDatabaseStatus()
      } else {
        toast({
          title: "Erreur",
          description: data.error || "Erreur lors de l'initialisation de la base de données",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erreur lors de l'initialisation de la base de données:", error)
      toast({
        title: "Erreur",
        description: "Erreur lors de l'initialisation de la base de données",
        variant: "destructive",
      })
    } finally {
      setInitLoading(false)
    }
  }

  // Peupler la base de données
  const seedDatabase = async () => {
    setSeedLoading(true)
    try {
      const response = await fetch("/api/seed", {
        method: "POST",
      })
      const data = await response.json()

      if (data.success) {
        toast({
          title: "Succès",
          description: "Base de données peuplée avec succès",
        })
        // Mettre à jour l'état de la base de données
        checkDatabaseStatus()
      } else {
        toast({
          title: "Erreur",
          description: data.error || data.message || "Erreur lors du peuplement de la base de données",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erreur lors du peuplement de la base de données:", error)
      toast({
        title: "Erreur",
        description: "Erreur lors du peuplement de la base de données",
        variant: "destructive",
      })
    } finally {
      setSeedLoading(false)
    }
  }

  // Créer les utilisateurs
  const createUsers = async () => {
    setUsersLoading(true)
    try {
      const response = await fetch("/api/init-users", {
        method: "POST",
      })
      const data = await response.json()

      if (!data.error) {
        toast({
          title: "Succès",
          description: "Utilisateurs créés avec succès",
        })
        // Mettre à jour l'état de la base de données
        checkDatabaseStatus()
      } else {
        toast({
          title: "Erreur",
          description: data.error || "Erreur lors de la création des utilisateurs",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erreur lors de la création des utilisateurs:", error)
      toast({
        title: "Erreur",
        description: "Erreur lors de la création des utilisateurs",
        variant: "destructive",
      })
    } finally {
      setUsersLoading(false)
    }
  }

  // Afficher un résumé de l'état de la base de données
  const renderDatabaseSummary = () => {
    if (!dbStatus) return null

    const { isDatabaseInitialized, isDatabaseEmpty, recordCounts } = dbStatus
    const totalRecords = Object.values(recordCounts).reduce((acc, count) => acc + count, 0)

    let status = "Non initialisée"
    let color = "bg-red-500"

    if (isDatabaseInitialized) {
      if (isDatabaseEmpty) {
        status = "Initialisée (vide)"
        color = "bg-yellow-500"
      } else {
        status = "Initialisée et peuplée"
        color = "bg-green-500"
      }
    }

    return (
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${color}`}></div>
          <span className="font-medium">État: {status}</span>
        </div>
        {isDatabaseInitialized && (
          <div className="text-sm text-gray-500">
            {totalRecords} enregistrements au total ({recordCounts.users} utilisateurs, {recordCounts.agencies} agences,{" "}
            {recordCounts.vehicles} véhicules, {recordCounts.reservations} réservations, {recordCounts.incidents}{" "}
            incidents)
          </div>
        )}
      </div>
    )
  }

  // Afficher l'état des tables
  const renderTablesStatus = () => {
    if (!dbStatus) return null

    const { tablesStatus, recordCounts } = dbStatus

    return (
      <div className="grid grid-cols-2 gap-2 mb-4">
        {Object.entries(tablesStatus).map(([table, exists]) => (
          <div key={table} className="flex items-center gap-2">
            {exists ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-500" />
            )}
            <span className="capitalize">{table}</span>
            {exists && (
              <Badge variant="outline" className="ml-auto">
                {recordCounts[table as keyof typeof recordCounts]} enregistrements
              </Badge>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Initialisation de la base de données
        </CardTitle>
        <CardDescription>Gérez l'état de la base de données de l'application Eco Mobile</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : dbStatus ? (
          <>
            {renderDatabaseSummary()}

            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">État des tables</h3>
              {renderTablesStatus()}
            </div>

            {!dbStatus.isDatabaseInitialized && (
              <Alert variant="warning" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Base de données non initialisée</AlertTitle>
                <AlertDescription>
                  La base de données n'est pas encore initialisée. Cliquez sur le bouton "Initialiser la base de
                  données" pour créer les tables nécessaires.
                </AlertDescription>
              </Alert>
            )}

            {dbStatus.isDatabaseInitialized && dbStatus.isDatabaseEmpty && (
              <Alert className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Base de données vide</AlertTitle>
                <AlertDescription>
                  La base de données est initialisée mais ne contient aucune donnée. Cliquez sur le bouton "Peupler la
                  base de données" pour ajouter des données de test.
                </AlertDescription>
              </Alert>
            )}
          </>
        ) : (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>
              Impossible de vérifier l'état de la base de données. Veuillez réessayer.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-4 sm:flex-row">
        <Button onClick={checkDatabaseStatus} variant="outline" className="w-full sm:w-auto" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Vérification...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Vérifier l'état
            </>
          )}
        </Button>
        <Button
          onClick={initializeDatabase}
          variant="default"
          className="w-full sm:w-auto"
          disabled={initLoading || (dbStatus?.isDatabaseInitialized && !dbStatus?.isDatabaseEmpty)}
        >
          {initLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Initialisation...
            </>
          ) : (
            <>
              <TableProperties className="mr-2 h-4 w-4" />
              Initialiser la base de données
            </>
          )}
        </Button>
        <Button
          onClick={createUsers}
          variant="secondary"
          className="w-full sm:w-auto"
          disabled={usersLoading || !dbStatus?.isDatabaseInitialized || (dbStatus?.recordCounts.users || 0) > 0}
        >
          {usersLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Création...
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              Créer les utilisateurs
            </>
          )}
        </Button>
        <Button
          onClick={seedDatabase}
          variant="destructive"
          className="w-full sm:w-auto"
          disabled={seedLoading || !dbStatus?.isDatabaseInitialized || !dbStatus?.isDatabaseEmpty}
        >
          {seedLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Peuplement...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Peupler la base de données
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
