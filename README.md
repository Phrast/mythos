# Mythos Archives

Mythos Archives est une plateforme où les utilisateurs peuvent répertorier des créatures mythologiques et soumettre des témoignages les concernant. Les experts valident ou rejettent ces témoignages.

## Architecture

Le projet est composé de deux microservices :

- **auth-service** gère l'authentification des utilisateurs avec JWT et une base MySQL.
- **lore-service** gère les créatures et témoignages avec MongoDB. Il vérifie les tokens en appelant auth-service.

## Prérequis

Avant de commencer, assurez-vous d'avoir installé Node.js (v18+), MySQL (via XAMPP) et MongoDB.

## Installation

### Auth-service

Allez dans le dossier auth-service et installez les dépendances :

```bash
cd auth-service
npm install
```

Créez une base de données `mythos_auth` dans phpMyAdmin, puis lancez les migrations :

```bash
npx prisma migrate dev
```

### Lore-service

Allez dans le dossier lore-service et installez les dépendances :

```bash
cd lore-service
npm install
```

Assurez-vous que MongoDB tourne sur le port 27017.

## Lancer les services

Ouvrez deux terminaux :

```bash
# Terminal 1
cd auth-service
npm run dev
```

```bash
# Terminal 2
cd lore-service
npm run dev
```

Auth-service tourne sur le port 3001, lore-service sur le port 3002.

## Utilisation

Commencez par créer un compte avec POST /auth/register, puis connectez-vous avec POST /auth/login pour obtenir un token JWT.

Utilisez ce token dans le header `Authorization: Bearer <token>` pour accéder aux routes protégées de lore-service.

Vous pouvez créer des créatures, soumettre des témoignages, et si vous êtes EXPERT ou ADMIN, valider ou rejeter les témoignages des autres.

## Exemples

Inscription :
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@test.com", "username": "test", "password": "password123"}'
```

Connexion :
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@test.com", "password": "password123"}'
```

Créer une créature :
```bash
curl -X POST http://localhost:3002/creatures \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Dragon", "origin": "Nordique"}'
```
