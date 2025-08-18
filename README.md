# Application de Réservation Restaurant

Une application web complète pour gérer les réservations d'un restaurant, développée avec React/TypeScript, Express et SQLite.

## Fonctionnalités

### Page Publique (/)
- Formulaire de réservation avec validation
- Champs requis : nom, email, téléphone, nombre de personnes, date (jj-mm-aaaa), heure
- Validation stricte du format de date jj-mm-aaaa
- Design responsive avec thème restaurant

### Page Administration (/admin)
- Accès protégé par mot de passe (défaut: `admin123`)
- Liste complète des réservations
- Suppression des réservations
- Interface d'administration intuitive

## Technologies

- **Frontend**: React 18 + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Node.js + Express 5 + TypeScript
- **Base de données**: SQLite + Kysely (Query Builder)
- **Routing**: React Router DOM
- **Build**: Vite

## Installation et Démarrage

### Prérequis
- Node.js 18+ 
- npm

### Installation
```bash
# Cloner le projet
git clone [votre-repo]
cd restaurant-reservation

# Installer les dépendances
npm install
```

### Démarrage en développement
```bash
# Démarrer le serveur de développement (frontend + backend)
npm run start
```

L'application sera accessible sur :
- Frontend : http://localhost:3000
- Backend API : http://localhost:3001

### Build pour production
```bash
# Créer le build de production
npm run build

# Démarrer en production
NODE_ENV=production node dist/server/index.js
```

## Structure de la Base de Données

### Table `reservations`
```sql
CREATE TABLE reservations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  guests INTEGER NOT NULL,
  date TEXT NOT NULL,           -- Format: jj-mm-aaaa
  time TEXT NOT NULL,           -- Format: HH:MM
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### Publics
- `POST /api/reservations` - Créer une réservation

### Administration
- `POST /api/admin/login` - Authentification admin
- `POST /api/admin/reservations` - Lister les réservations (avec mot de passe)
- `DELETE /api/admin/reservations/:id` - Supprimer une réservation

## Configuration

### Variables d'environnement
```bash
# Optionnel - Port du serveur (défaut: 3001)
PORT=3001

# Optionnel - Mot de passe admin (défaut: admin123)
ADMIN_PASSWORD=votre_mot_de_passe_securise

# Optionnel - Répertoire de données (défaut: ./data)
DATA_DIRECTORY=/chemin/vers/donnees
```

## Validation des Données

### Format de date
- **Requis** : jj-mm-aaaa (ex: 18-08-2025)
- Validation côté client et serveur
- Vérification que la date n'est pas dans le passé

### Autres validations
- Email valide requis
- Téléphone requis
- Nombre de personnes : 1-20
- Tous les champs sont obligatoires

## Sécurité

- Mot de passe admin requis pour toutes les opérations d'administration
- Validation stricte des entrées utilisateur
- Protection contre l'injection SQL (Kysely)
- Nettoyage des données entrantes

## Structure du Projet

```
restaurant-reservation/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Composants réutilisables
│   │   ├── pages/         # Pages de l'application
│   │   └── lib/          # Utilitaires
├── server/                # Backend Express
│   ├── database/         # Configuration base de données
│   └── index.ts          # Serveur principal
├── data/                  # Base de données SQLite
└── README.md
```

## Utilisation

### Créer une réservation
1. Aller sur la page d'accueil
2. Remplir le formulaire avec les informations requises
3. **Important** : La date doit être au format jj-mm-aaaa
4. Sélectionner l'heure parmi les créneaux disponibles
5. Cliquer sur "Réserver"

### Gérer les réservations (Admin)
1. Aller sur `/admin`
2. Entrer le mot de passe administrateur (défaut: `admin123`)
3. Consulter la liste des réservations
4. Supprimer les réservations si nécessaire

## Support

Pour toute question ou problème, vérifiez :
1. Que Node.js 18+ est installé
2. Que toutes les dépendances sont installées (`npm install`)
3. Que le port 3001 (backend) et 3000 (frontend) sont disponibles
4. Les logs du serveur pour plus de détails

## Licence

MIT License - Libre d'utilisation pour projets personnels et commerciaux.
