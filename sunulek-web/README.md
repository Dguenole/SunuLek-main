# 🇸🇳 SunuLek Web - Frontend

Interface utilisateur moderne pour la plateforme de petites annonces SunuLek, développée avec React et TypeScript.

## 📋 Table des matières

- [Technologies](#-technologies)
- [Installation](#-installation)
- [Structure du projet](#-structure-du-projet)
- [Composants](#-composants)
- [Hooks personnalisés](#-hooks-personnalisés)
- [Gestion d'état](#-gestion-détat)
- [Routage](#-routage)
- [Configuration](#-configuration)

## 🛠️ Technologies

| Technologie | Version | Rôle |
|-------------|---------|------|
| React | 18.x | Bibliothèque UI |
| TypeScript | 5.x | Typage statique |
| Vite | 5.x | Build tool |
| React Router | 6.x | Routage SPA |
| TanStack Query | 5.x | Gestion des requêtes API |
| Zustand | 4.x | State management |
| Tailwind CSS | 3.x | Styles CSS |
| Framer Motion | 11.x | Animations |
| Axios | 1.x | Client HTTP |
| Lucide React | 0.x | Icônes |

## 🚀 Installation

### 1. Prérequis
- Node.js 18+
- npm ou yarn

### 2. Installer les dépendances

```bash
cd sunulek-web
npm install
```

### 3. Configurer l'API

Éditer `src/lib/constants.ts` :

```typescript
export const API_URL = 'http://192.168.1.5:8000/api/v1'
export const MEDIA_URL = 'http://192.168.1.5:8000'
```

### 4. Lancer en développement

```bash
npm run dev
```

L'application sera accessible sur http://localhost:3000

### 5. Build pour production

```bash
npm run build
npm run preview
```

## 📂 Structure du projet

```
sunulek-web/
├── index.html              # Point d'entrée HTML
├── package.json            # Dépendances npm
├── vite.config.ts          # Configuration Vite
├── tailwind.config.js      # Configuration Tailwind
├── tsconfig.json           # Configuration TypeScript
│
├── public/                  # Assets statiques
│
└── src/
    ├── main.tsx             # Point d'entrée React
    ├── App.tsx              # Composant racine + Routes
    ├── index.css            # Styles globaux + Tailwind
    │
    ├── components/          # Composants réutilisables
    │   ├── layout/          # Layout (Header, Footer)
    │   │   ├── Header.tsx
    │   │   └── Layout.tsx
    │   │
    │   ├── ui/              # Composants UI de base
    │   │   ├── Button.tsx
    │   │   ├── Input.tsx
    │   │   ├── Card.tsx
    │   │   ├── Select.tsx
    │   │   ├── Modal.tsx
    │   │   └── Toast.tsx
    │   │
    │   ├── annonces/        # Composants annonces
    │   │   ├── AdCard.tsx
    │   │   └── AdFilters.tsx
    │   │
    │   ├── messages/        # Composants messagerie
    │   │   ├── ConversationList.tsx
    │   │   ├── ChatWindow.tsx
    │   │   └── ContactSellerModal.tsx
    │   │
    │   └── routes/          # Composants de routage
    │       ├── ProtectedRoute.tsx
    │       └── GuestRoute.tsx
    │
    ├── pages/               # Pages (vues)
    │   ├── Home.tsx
    │   ├── auth/
    │   │   ├── Login.tsx
    │   │   └── Register.tsx
    │   ├── annonces/
    │   │   ├── Annonces.tsx
    │   │   ├── AnnonceDetail.tsx
    │   │   ├── CreateAnnonce.tsx
    │   │   └── EditAnnonce.tsx
    │   └── profile/
    │       ├── Profile.tsx
    │       ├── MyAnnonces.tsx
    │       ├── Favorites.tsx
    │       └── Messages.tsx
    │
    ├── hooks/               # Hooks personnalisés
    │   ├── useAuth.ts
    │   ├── useAds.ts
    │   ├── useCategories.ts
    │   ├── useFavorites.ts
    │   └── useMessages.ts
    │
    ├── stores/              # State management (Zustand)
    │   ├── authStore.ts
    │   └── toastStore.ts
    │
    ├── lib/                 # Utilitaires
    │   ├── api.ts           # Client Axios
    │   ├── utils.ts         # Fonctions utilitaires
    │   ├── constants.ts     # Constantes
    │   └── queryClient.ts   # Config React Query
    │
    └── types/               # Types TypeScript
        └── index.ts
```

## 🧩 Composants

### Composants UI (`src/components/ui/`)

| Composant | Description |
|-----------|-------------|
| `Button` | Bouton avec variantes (primary, secondary, outline, ghost, danger) |
| `Input` | Champ de saisie avec label, icônes et erreurs |
| `Card` | Conteneur avec ombre et bordure |
| `Select` | Liste déroulante stylisée |
| `Modal` | Fenêtre modale avec animation |
| `Toast` | Notification temporaire |

### Composants Layout (`src/components/layout/`)

| Composant | Description |
|-----------|-------------|
| `Header` | Barre de navigation (desktop + mobile) |
| `Layout` | Wrapper avec Header + contenu |

### Composants Routes (`src/components/routes/`)

| Composant | Description |
|-----------|-------------|
| `ProtectedRoute` | Redirige vers /login si non connecté |
| `GuestRoute` | Redirige vers / si déjà connecté |

## 🪝 Hooks personnalisés

### useAuth.ts
```typescript
useLogin()           // Connexion
useRegister()        // Inscription
useLogout()          // Déconnexion
useUpdateProfile()   // Mise à jour profil
useChangePassword()  // Changement mot de passe
```

### useAds.ts
```typescript
useAds(params?)              // Liste des annonces
useAd(slug)                  // Détail d'une annonce
useMyAds(status?)            // Mes annonces (active/pending/deleted)
useCreateAd()                // Créer une annonce
useUpdateAd()                // Modifier une annonce
useDeleteAd()                // Supprimer (soft delete)
useRestoreAd()               // Restaurer de la corbeille
usePermanentDeleteAd()       // Supprimer définitivement
```

### useMessages.ts
```typescript
useConversations()           // Liste des conversations
useMessages(conversationId)  // Messages d'une conversation
useStartConversation()       // Démarrer une conversation
useSendMessage()             // Envoyer un message
useUnreadMessagesCount()     // Compteur de non lus
```

### useFavorites.ts
```typescript
useFavorites()               // Liste des favoris
useFavoriteToggle()          // Ajouter/Retirer un favori
```

## 📦 Gestion d'état

### Zustand Stores

**authStore.ts** - Authentification
```typescript
interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  setUser: (user: User) => void
  setAuth: (user: User, tokens: AuthTokens) => void
  logout: () => void
}
```

**toastStore.ts** - Notifications
```typescript
interface ToastState {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}
```

### React Query

Gestion du cache et des requêtes API avec TanStack Query.

## 🛤️ Routage

```tsx
// Routes publiques
/                       → Home
/annonces               → Liste des annonces
/annonces/:slug         → Détail d'une annonce

// Routes invités (non connectés)
/login                  → Connexion
/register               → Inscription

// Routes protégées (connectés)
/profil                 → Mon profil
/mes-annonces           → Mes annonces (3 onglets)
/favoris                → Favoris
/messages               → Messagerie
/annonces/creer         → Créer une annonce
/annonces/:slug/modifier → Modifier une annonce
```

## ⚙️ Configuration

### vite.config.ts
```typescript
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',  // Accès réseau local
  },
})
```

### constants.ts
```typescript
export const API_URL = 'http://192.168.1.5:8000/api/v1'
export const MEDIA_URL = 'http://192.168.1.5:8000'

// Fonction helper pour les URLs de médias
export function getMediaUrl(path: string | undefined | null): string | undefined {
  if (!path) return undefined
  if (path.startsWith('http')) return path
  return `${MEDIA_URL}${path}`
}

// Régions du Sénégal
export const REGIONS_SENEGAL = ['Dakar', 'Thiès', 'Diourbel', ...]

// Départements par région
export const DEPARTMENTS_BY_REGION = { ... }
```

## 🎨 Styles

### Couleurs principales (Tailwind)
```javascript
colors: {
  primary: {
    500: '#22c55e',  // Vert principal
    600: '#16a34a',  // Hover
  },
}
```

### Classes utilitaires
```css
.btn-primary   → Bouton vert
.input-field   → Champ de saisie
.card          → Conteneur Card
```

## 📱 Responsive

L'application est entièrement responsive :
- **Desktop** : Navigation complète dans le header
- **Mobile** : Menu hamburger avec toutes les options

## 🔧 Scripts npm

| Script | Commande | Description |
|--------|----------|-------------|
| `dev` | `npm run dev` | Lance le serveur de développement |
| `build` | `npm run build` | Build pour production |
| `preview` | `npm run preview` | Preview du build |
| `lint` | `npm run lint` | Vérifie le code |

## 📖 Documentation complète

Voir [docs/DOCUMENTATION_FRONTEND.md](../docs/DOCUMENTATION_FRONTEND.md) pour la documentation détaillée incluant :
- Diagrammes d'architecture
- Flux de données
- Composants détaillés
- Types TypeScript
- Problèmes résolus
- Et plus...

---

**Version :** 1.0.0  
**Dernière mise à jour :** Février 2026

Développé avec ❤️ pour le Sénégal 🇸🇳
