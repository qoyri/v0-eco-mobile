# Eco-Mobil - Plateforme de Location de Véhicules Électriques

## Vue d'ensemble

Eco-Mobil est une application web moderne pour la gestion et la location de véhicules électriques (vélos, trottinettes, hoverboards). Cette plateforme permet aux utilisateurs de réserver des véhicules électriques dans différentes agences, de gérer leurs réservations et de signaler des incidents.

## Table des matières

- [Technologies](#technologies)
- [Architecture](#architecture)
- [Fonctionnalités](#fonctionnalités)
- [Installation](#installation)
- [Structure du projet](#structure-du-projet)
- [API](#api)
- [Modèles de données](#modèles-de-données)
- [Authentification](#authentification)
- [Contribution](#contribution)

## Technologies

- **Frontend**: Next.js 14+, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, TypeScript
- **Base de données**: PostgreSQL (via Neon)
- **ORM**: Drizzle ORM
- **Authentification**: JWT
- **Déploiement**: Vercel (recommandé)

## Architecture

L'application suit une architecture moderne basée sur Next.js App Router:

- **App Router**: Utilisation du système de routage basé sur les dossiers de Next.js
- **Server Components**: Utilisation des composants serveur pour le rendu initial
- **Client Components**: Composants interactifs côté client
- **API Routes**: Points d'API RESTful pour les opérations CRUD
- **Server Actions**: Pour les opérations de mutation de données
- **Drizzle ORM**: Pour l'interaction avec la base de données PostgreSQL

## Fonctionnalités

### Utilisateurs
- Inscription et connexion
- Gestion de profil
- Différents rôles (CLIENT, ADMIN, MANAGER)

### Agences
- Liste des agences disponibles
- Détails des agences (adresse, horaires d'ouverture)

### Véhicules
- Catalogue de véhicules par agence
- Filtrage par type (vélo, trottinette, hoverboard)
- Détails des véhicules (autonomie, tarif horaire)

### Réservations
- Création de réservations
- Gestion du cycle de vie des réservations (confirmation, validation, etc.)
- Historique des réservations

### Incidents
- Signalement d'incidents (panne, vol, accident)
- Suivi des incidents

### Administration
- Tableau de bord administrateur
- Gestion des utilisateurs, agences, véhicules
- Rapports et statistiques

## Installation

### Prérequis
- Node.js 18+
- PostgreSQL (ou compte Neon)
- npm ou yarn

### Étapes d'installation

1. Cloner le dépôt
   \`\`\`bash
   git clone https://github.com/qoyri/v0-eco-mobile.git
   cd eco-mobil
   \`\`\`

2. Installer les dépendances
   \`\`\`bash
   npm install
   # ou
   yarn install
   \`\`\`

3. Configurer les variables d'environnement
   Créez un fichier `.env.local` à la racine du projet avec les variables suivantes:
   \`\`\`
   DATABASE_URL=postgresql://user:password@host:port/database
   JWT_SECRET=votre_secret_jwt_très_sécurisé
   NEXT_PUBLIC_API_URL=http://localhost:3000
   \`\`\`

4. Initialiser la base de données
   \`\`\`bash
   npm run db:push
   # ou
   yarn db:push
   \`\`\`

5. Lancer le serveur de développement
   \`\`\`bash
   npm run dev
   # ou
   yarn dev
   \`\`\`

6. Accéder à l'application
   Ouvrez votre navigateur à l'adresse [http://localhost:3000](http://localhost:3000)

## Structure du projet

\`\`\`
eco-mobil/
├── app/                    # Dossier principal de l'App Router
│   ├── api/                # API Routes
│   ├── admin/              # Routes d'administration
│   ├── dashboard/          # Dashboard utilisateur
│   ├── agencies/           # Pages des agences
│   ├── reservation/        # Pages de réservation
│   ├── support/            # Support et incidents
│   ├── layout.tsx          # Layout principal
│   └── page.tsx            # Page d'accueil
├── components/             # Composants React
│   ├── admin/              # Composants d'administration
│   ├── ui/                 # Composants d'interface utilisateur
│   └── ...                 # Autres composants
├── hooks/                  # Hooks React personnalisés
├── lib/                    # Bibliothèques et utilitaires
│   ├── services/           # Services métier
│   ├── schema.ts           # Schéma de base de données
│   ├── db.ts               # Configuration de la base de données
│   ├── auth.ts             # Logique d'authentification
│   └── api-config.ts       # Configuration de l'API
├── public/                 # Fichiers statiques
├── api/                    # Types d'API
├── src/                    # Code source supplémentaire
│   ├── models/             # Modèles de données
│   └── dtos/               # Objets de transfert de données
└── ...                     # Autres fichiers de configuration
\`\`\`

## API

L'API est organisée en plusieurs sections:

### Authentification
- `POST /api/auth/login` - Connexion utilisateur
- `POST /api/auth/register` - Inscription utilisateur
- `GET /api/auth/me` - Informations sur l'utilisateur connecté
- `POST /api/auth/logout` - Déconnexion

### Utilisateurs
- `GET /api/users` - Liste des utilisateurs
- `GET /api/users/:id` - Détails d'un utilisateur
- `PUT /api/users/:id` - Mise à jour d'un utilisateur
- `DELETE /api/users/:id` - Suppression d'un utilisateur

### Agences
- `GET /api/agencies` - Liste des agences
- `GET /api/agencies/:id` - Détails d'une agence
- `POST /api/agencies` - Création d'une agence
- `PUT /api/agencies/:id` - Mise à jour d'une agence
- `DELETE /api/agencies/:id` - Suppression d'une agence

### Véhicules
- `GET /api/vehicles` - Liste des véhicules
- `GET /api/vehicles/:id` - Détails d'un véhicule
- `POST /api/vehicles` - Création d'un véhicule
- `PUT /api/vehicles/:id` - Mise à jour d'un véhicule
- `PUT /api/vehicles/:id/status` - Mise à jour du statut d'un véhicule
- `DELETE /api/vehicles/:id` - Suppression d'un véhicule

### Réservations
- `GET /api/reservations` - Liste des réservations
- `GET /api/reservations/:id` - Détails d'une réservation
- `POST /api/reservations` - Création d'une réservation
- `PUT /api/reservations/:id/edit` - Mise à jour d'une réservation
- `DELETE /api/reservations/:id` - Annulation d'une réservation

### Incidents
- `GET /api/incidents` - Liste des incidents
- `GET /api/incidents/:id` - Détails d'un incident
- `POST /api/incidents` - Signalement d'un incident
- `PUT /api/incidents/:id` - Mise à jour d'un incident
- `GET /api/incidents/user` - Incidents de l'utilisateur connecté

### Base de données
- `GET /api/db-status` - État de la base de données
- `POST /api/init-db` - Initialisation de la base de données
- `POST /api/seed` - Peuplement de la base de données
- `POST /api/init-users` - Création des utilisateurs initiaux

## Modèles de données

### User
\`\`\`typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "CLIENT" | "ADMIN" | "MANAGER";
  phoneNumber?: string;
  address?: string;
  createdAt: Date;
}
\`\`\`

### Agency
\`\`\`typescript
interface Agency {
  id: string;
  name: string;
  address: string;
  city: string;
  zipCode: string;
  phoneNumber: string;
  openingHours: string;
  isActive: boolean;
}
\`\`\`

### Vehicle
\`\`\`typescript
interface Vehicle {
  id: string;
  type: "BIKE" | "SCOOTER" | "HOVERBOARD";
  model: string;
  description?: string;
  autonomy: number;
  status: "AVAILABLE" | "RENTED" | "MAINTENANCE" | "OUT_OF_SERVICE";
  agencyId: string;
  hourlyRate: number;
  maintenanceCount: number;
  lastMaintenanceDate?: Date;
}
\`\`\`

### Reservation
\`\`\`typescript
interface Reservation {
  id: string;
  reservationNumber: string;
  userId: string;
  vehicleId: string;
  agencyId: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  status: "PENDING" | "CONFIRMED" | "VALIDATED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  totalAmount: number;
  paymentStatus: "PENDING" | "PAID" | "REFUNDED";
  createdAt: Date;
  updatedAt: Date;
}
\`\`\`

### Incident
\`\`\`typescript
interface Incident {
  id: string;
  reservationId: string;
  type: "BREAKDOWN" | "THEFT" | "ACCIDENT" | "OTHER";
  description: string;
  reportedAt: Date;
  status: "REPORTED" | "IN_PROGRESS" | "RESOLVED";
  resolvedAt?: Date;
}
\`\`\`

## Authentification

L'authentification est basée sur JWT (JSON Web Tokens):

1. L'utilisateur s'authentifie via `/api/auth/login`
2. Le serveur génère un JWT contenant l'ID et le rôle de l'utilisateur
3. Le token est stocké dans un cookie HTTP-only
4. Les requêtes API vérifient la validité du token
5. Les routes protégées vérifient les autorisations basées sur le rôle

### Middleware d'authentification

Le middleware d'authentification vérifie la présence et la validité du token JWT pour les routes protégées.

### Hooks d'authentification

Le hook `useAuth` fournit:
- État d'authentification
- Informations sur l'utilisateur connecté
- Fonctions de connexion/déconnexion
- Vérification des rôles

## Services

Les services encapsulent la logique métier et l'accès aux données:

- `user-service.ts` - Gestion des utilisateurs
- `agency-service.ts` - Gestion des agences
- `vehicle-service.ts` - Gestion des véhicules
- `reservation-service.ts` - Gestion des réservations
- `incident-service.ts` - Gestion des incidents

## Hooks personnalisés

- `use-auth.tsx` - Gestion de l'authentification
- `use-agencies.ts` - Récupération des agences
- `use-vehicles.ts` - Récupération des véhicules
- `use-reservations.ts` - Gestion des réservations
- `use-incidents.ts` - Gestion des incidents
- `use-api.ts` - Utilitaire pour les appels API
- `use-mobile-navigation.ts` - Navigation mobile

## Contribution

1. Forker le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/amazing-feature`)
3. Commiter vos changements (`git commit -m 'Add some amazing feature'`)
4. Pousser vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## Licence

Ce projet est sous licence [MIT](LICENSE).
