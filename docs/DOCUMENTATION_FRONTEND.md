# 📚 Documentation Frontend - SunuLek Web

## Table des matières
1. [Présentation du projet](#1-présentation-du-projet)
2. [Architecture technique](#2-architecture-technique)
3. [Structure du projet](#3-structure-du-projet)
4. [Composants](#4-composants)
5. [Gestion d'état](#5-gestion-détat)
6. [Hooks personnalisés](#6-hooks-personnalisés)
7. [Routage](#7-routage)
8. [Types TypeScript](#8-types-typescript)
9. [Styles et UI](#9-styles-et-ui)
10. [Configuration](#10-configuration)
11. [Installation et démarrage](#11-installation-et-démarrage)
12. [Problèmes résolus](#12-problèmes-résolus)

---

## 1. Présentation du projet

### 1.1 Qu'est-ce que SunuLek Web ?
**SunuLek Web** est l'interface utilisateur de la plateforme SunuLek. C'est une Single Page Application (SPA) moderne construite avec React et TypeScript, offrant une expérience utilisateur fluide et responsive.

### 1.2 Fonctionnalités principales

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      FONCTIONNALITÉS SUNULEK                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  👤 UTILISATEURS          📦 ANNONCES           💬 MESSAGERIE          │
│  ├─ Inscription           ├─ Création           ├─ Conversations       │
│  ├─ Connexion             ├─ Modification       ├─ Envoi messages      │
│  ├─ Profil                ├─ Suppression        ├─ Notifications       │
│  ├─ Photo avatar          ├─ Corbeille          └─ Badge non lus       │
│  └─ Mot de passe          ├─ Restauration                              │
│                           ├─ Images multiples   ❤️ FAVORIS             │
│  🔍 RECHERCHE             ├─ Catégories         ├─ Ajouter/Retirer     │
│  ├─ Par mot-clé           ├─ Localisation       └─ Liste des favoris   │
│  ├─ Par catégorie         └─ Prix négociable                           │
│  ├─ Par région                                                          │
│  └─ Par prix                                                            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 1.3 Stack technique Frontend

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
| React Hook Form | 7.x | Gestion formulaires |

---

## 2. Architecture technique

### 2.1 Diagramme d'architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        ARCHITECTURE FRONTEND                             │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                              BROWSER                                     │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                         REACT APP                                  │  │
│  │                                                                    │  │
│  │  ┌─────────────────────────────────────────────────────────────┐  │  │
│  │  │                      ROUTER                                  │  │  │
│  │  │  (React Router - Gestion des routes et navigation)         │  │  │
│  │  └──────────────────────────┬──────────────────────────────────┘  │  │
│  │                             │                                      │  │
│  │  ┌──────────────────────────┴──────────────────────────────────┐  │  │
│  │  │                        PAGES                                 │  │  │
│  │  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │  │  │
│  │  │  │  Home   │ │Annonces │ │ Profile │ │Messages │ ...       │  │  │
│  │  │  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘           │  │  │
│  │  └───────┼──────────┼──────────┼──────────┼────────────────────┘  │  │
│  │          │          │          │          │                        │  │
│  │  ┌───────┴──────────┴──────────┴──────────┴────────────────────┐  │  │
│  │  │                     COMPONENTS                               │  │  │
│  │  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐    │  │  │
│  │  │  │Header│ │Button│ │ Card │ │Input │ │Modal │ │Toast │    │  │  │
│  │  │  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘    │  │  │
│  │  └─────────────────────────────────────────────────────────────┘  │  │
│  │                             │                                      │  │
│  │  ┌──────────────────────────┴──────────────────────────────────┐  │  │
│  │  │                        HOOKS                                 │  │  │
│  │  │  useAuth │ useAds │ useMessages │ useFavorites │ ...       │  │  │
│  │  └──────────────────────────┬──────────────────────────────────┘  │  │
│  │                             │                                      │  │
│  │  ┌──────────────────────────┴──────────────────────────────────┐  │  │
│  │  │                       STORES                                 │  │  │
│  │  │  ┌──────────────┐  ┌──────────────┐                        │  │  │
│  │  │  │  authStore   │  │  toastStore  │   (Zustand)            │  │  │
│  │  │  │  - user      │  │  - toasts    │                        │  │  │
│  │  │  │  - tokens    │  │  - addToast  │                        │  │  │
│  │  │  │  - isAuth    │  │  - remove    │                        │  │  │
│  │  │  └──────────────┘  └──────────────┘                        │  │  │
│  │  └─────────────────────────────────────────────────────────────┘  │  │
│  │                             │                                      │  │
│  │  ┌──────────────────────────┴──────────────────────────────────┐  │  │
│  │  │                     API CLIENT                               │  │  │
│  │  │  ┌────────────────────────────────────────────────────────┐ │  │  │
│  │  │  │ Axios Instance + Interceptors (JWT refresh)            │ │  │  │
│  │  │  └────────────────────────────────────────────────────────┘ │  │  │
│  │  └─────────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP/HTTPS
                                    ▼
                    ┌───────────────────────────┐
                    │      BACKEND API          │
                    │   (Django REST Framework) │
                    └───────────────────────────┘
```

### 2.2 Flux de données

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         FLUX DE DONNÉES                                  │
└─────────────────────────────────────────────────────────────────────────┘

    ┌──────────────┐
    │  Composant   │
    │   (React)    │
    └──────┬───────┘
           │ 1. Appelle hook
           ▼
    ┌──────────────┐
    │    Hook      │
    │ (useQuery)   │
    └──────┬───────┘
           │ 2. Requête API
           ▼
    ┌──────────────┐
    │  API Client  │
    │   (Axios)    │
    └──────┬───────┘
           │ 3. HTTP Request
           │    + JWT Token
           ▼
    ┌──────────────┐
    │   Backend    │
    │   (Django)   │
    └──────┬───────┘
           │ 4. Response JSON
           ▼
    ┌──────────────┐
    │  React Query │
    │   (Cache)    │
    └──────┬───────┘
           │ 5. Update UI
           ▼
    ┌──────────────┐
    │  Composant   │
    │  (Re-render) │
    └──────────────┘
```

---

## 3. Structure du projet

```
sunulek-web/
├── index.html              # Point d'entrée HTML
├── package.json            # Dépendances npm
├── vite.config.ts          # Configuration Vite
├── tailwind.config.js      # Configuration Tailwind
├── tsconfig.json           # Configuration TypeScript
│
├── public/                  # Assets statiques
│   └── favicon.ico
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
    │   │   ├── Toast.tsx
    │   │   └── ToastContainer.tsx
    │   │
    │   ├── annonces/        # Composants annonces
    │   │   ├── AdCard.tsx
    │   │   ├── AdGrid.tsx
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
    │   │
    │   ├── annonces/
    │   │   ├── Annonces.tsx
    │   │   ├── AnnonceDetail.tsx
    │   │   ├── CreateAnnonce.tsx
    │   │   └── EditAnnonce.tsx
    │   │
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

---

## 4. Composants

### 4.1 Composants UI de base

#### Button.tsx
```tsx
interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  isLoading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  onClick?: () => void
  type?: 'button' | 'submit'
  className?: string
}
```

**Utilisation :**
```tsx
<Button variant="primary" leftIcon={<Plus />} isLoading={loading}>
  Publier
</Button>
```

#### Input.tsx
```tsx
interface InputProps {
  label?: string
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  // + tous les props de <input>
}
```

**Utilisation :**
```tsx
<Input
  label="Email"
  type="email"
  leftIcon={<Mail />}
  error={errors.email?.message}
  {...register('email')}
/>
```

#### Card.tsx
```tsx
interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}
```

#### Modal.tsx
```tsx
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}
```

### 4.2 Composants Layout

#### Header.tsx
Structure du header responsive :

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           HEADER (Desktop)                               │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌────────────────┐  ┌─────────────────────────────────┐  │
│  │  LOGO    │  │    NAV LINKS   │  │         ACTIONS                 │  │
│  │ SunuLek  │  │ Accueil Annonces│  │ Publier ❤️ 💬 [Avatar ▼]      │  │
│  └──────────┘  └────────────────┘  └─────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                           HEADER (Mobile)                                │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌──────────┐                                          ┌─────────────┐  │
│  │  LOGO    │                                          │ ☰ Menu      │  │
│  │ SunuLek  │                                          │             │  │
│  └──────────┘                                          └─────────────┘  │
├─────────────────────────────────────────────────────────────────────────┤
│                      MENU MOBILE (ouvert)                                │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ 🏠 Accueil                                                        │  │
│  │ 🔍 Annonces                                                       │  │
│  │ ───────────────────────────────────────────────────────────────── │  │
│  │ ➕ Publier une annonce                                            │  │
│  │ 👤 Mon profil                                                     │  │
│  │ 📦 Mes annonces                                                   │  │
│  │ ❤️ Favoris                                                        │  │
│  │ 💬 Messages (badge)                                               │  │
│  │ 🚪 Déconnexion                                                    │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4.3 Composants de routage

#### ProtectedRoute.tsx
Protège les routes nécessitant une authentification :

```tsx
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}
```

#### GuestRoute.tsx
Redirige les utilisateurs connectés (pour login/register) :

```tsx
export default function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }
  
  return <>{children}</>
}
```

---

## 5. Gestion d'état

### 5.1 Zustand Stores

#### authStore.ts

```typescript
interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  setUser: (user: User) => void
  setAuth: (user: User, tokens: AuthTokens) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      
      setUser: (user) => set({ user }),
      
      setAuth: (user, tokens) => set({
        user,
        tokens,
        isAuthenticated: true,
      }),
      
      logout: () => set({
        user: null,
        tokens: null,
        isAuthenticated: false,
      }),
    }),
    {
      name: 'sunulek-auth',  // Clé localStorage
    }
  )
)
```

**Diagramme d'état :**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           AUTH STORE                                     │
└─────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────┐
                    │   LOGGED OUT    │
                    │   user: null    │
                    │   tokens: null  │
                    │   isAuth: false │
                    └────────┬────────┘
                             │
                             │ setAuth(user, tokens)
                             ▼
                    ┌─────────────────┐
                    │   LOGGED IN     │
                    │   user: {...}   │
                    │   tokens: {...} │
                    │   isAuth: true  │
                    └────────┬────────┘
                             │
                ┌────────────┼────────────┐
                │            │            │
                │ setUser()  │            │ logout()
                ▼            │            ▼
        ┌───────────────┐    │    ┌─────────────────┐
        │ UPDATE USER   │    │    │   LOGGED OUT    │
        │ (même tokens) │    │    │   (clear all)   │
        └───────────────┘    │    └─────────────────┘
                             │
                             │ Token expiré → refresh
                             ▼
                    ┌─────────────────┐
                    │ TOKEN REFRESH   │
                    │ (auto via API)  │
                    └─────────────────┘
```

#### toastStore.ts

```typescript
interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
}

interface ToastState {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  
  addToast: (toast) => {
    const id = Math.random().toString(36)
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }))
    // Auto-remove après 5 secondes
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }))
    }, 5000)
  },
  
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}))
```

### 5.2 React Query (TanStack Query)

React Query gère le cache des données serveur :

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        REACT QUERY CACHE                                 │
└─────────────────────────────────────────────────────────────────────────┘

    ┌───────────────────────────────────────────────────────────────────┐
    │                         QUERY CACHE                               │
    │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
    │  │ ['ads']         │  │ ['ad', slug]    │  │ ['categories']  │  │
    │  │ Liste annonces  │  │ Détail annonce  │  │ Liste catégories│  │
    │  │ staleTime: 5min │  │ staleTime: 5min │  │ staleTime: 1h   │  │
    │  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
    │                                                                   │
    │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
    │  │ ['my-ads']      │  │ ['favorites']   │  │ ['conversations']│  │
    │  │ Mes annonces    │  │ Mes favoris     │  │ Conversations   │  │
    │  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
    └───────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Invalidation après mutation
                                    ▼
    ┌───────────────────────────────────────────────────────────────────┐
    │                      MUTATIONS                                    │
    │  createAd → invalidate(['ads'], ['my-ads'])                      │
    │  updateAd → invalidate(['ad', slug], ['my-ads'])                 │
    │  deleteAd → invalidate(['my-ads'])                               │
    │  toggleFavorite → invalidate(['favorites'])                      │
    └───────────────────────────────────────────────────────────────────┘
```

---

## 6. Hooks personnalisés

### 6.1 useAuth.ts

```typescript
// Connexion
export function useLogin() {
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()
  
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await api.post('/auth/login/', credentials)
      return data
    },
    onSuccess: (data) => {
      setAuth(data.user, { access: data.access, refresh: data.refresh })
      navigate('/')
    },
  })
}

// Inscription
export function useRegister() { ... }

// Déconnexion
export function useLogout() { ... }

// Mise à jour profil
export function useUpdateProfile() { ... }

// Changement mot de passe
export function useChangePassword() { ... }
```

### 6.2 useAds.ts

```typescript
// Liste des annonces (avec pagination et filtres)
export function useAds(params?: AdFilters) {
  return useQuery({
    queryKey: ['ads', params],
    queryFn: async () => {
      const { data } = await api.get('/annonces/', { params })
      return data
    },
  })
}

// Détail d'une annonce
export function useAd(slug: string) {
  return useQuery({
    queryKey: ['ad', slug],
    queryFn: async () => {
      const { data } = await api.get(`/annonces/${slug}/`)
      return data
    },
    enabled: !!slug,
  })
}

// Mes annonces (avec filtre status)
export function useMyAds(status?: 'active' | 'pending' | 'deleted') {
  return useQuery({
    queryKey: ['my-ads', status],
    queryFn: async () => {
      const params = status ? { status } : {}
      const { data } = await api.get('/annonces/my_ads/', { params })
      return data
    },
  })
}

// Créer une annonce
export function useCreateAd() { ... }

// Modifier une annonce
export function useUpdateAd() { ... }

// Supprimer (soft delete)
export function useDeleteAd() { ... }

// Restaurer
export function useRestoreAd() { ... }

// Supprimer définitivement
export function usePermanentDeleteAd() { ... }
```

### 6.3 useMessages.ts

```typescript
// Liste des conversations
export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const { data } = await api.get('/conversations/')
      return data
    },
    refetchInterval: 30000, // Refresh toutes les 30s
  })
}

// Messages d'une conversation
export function useMessages(conversationId: number) { ... }

// Démarrer une conversation
export function useStartConversation() { ... }

// Envoyer un message
export function useSendMessage() { ... }

// Marquer comme lu
export function useMarkAsRead() { ... }

// Compteur de messages non lus
export function useUnreadMessagesCount() {
  return useQuery({
    queryKey: ['unread-messages-count'],
    queryFn: async () => {
      const { data } = await api.get('/conversations/unread_count/')
      return data.count
    },
    refetchInterval: 60000,
  })
}
```

### 6.4 useFavorites.ts

```typescript
// Liste des favoris
export function useFavorites() {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const { data } = await api.get('/favorites/')
      return data
    },
  })
}

// Toggle favori
export function useFavoriteToggle() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (adId: number) => {
      const { data } = await api.post('/favorites/toggle/', { ad: adId })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
      queryClient.invalidateQueries({ queryKey: ['ads'] })
    },
  })
}
```

---

## 7. Routage

### 7.1 Structure des routes (App.tsx)

```tsx
<Routes>
  {/* Routes publiques */}
  <Route path="/" element={<Home />} />
  <Route path="/annonces" element={<Annonces />} />
  <Route path="/annonces/:slug" element={<AnnonceDetail />} />
  
  {/* Routes invités (non connectés) */}
  <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
  <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
  
  {/* Routes protégées (connectés) */}
  <Route path="/profil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
  <Route path="/mes-annonces" element={<ProtectedRoute><MyAnnonces /></ProtectedRoute>} />
  <Route path="/favoris" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
  <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
  <Route path="/annonces/creer" element={<ProtectedRoute><CreateAnnonce /></ProtectedRoute>} />
  <Route path="/annonces/:slug/modifier" element={<ProtectedRoute><EditAnnonce /></ProtectedRoute>} />
  
  {/* 404 */}
  <Route path="*" element={<NotFound />} />
</Routes>
```

### 7.2 Diagramme de navigation

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        NAVIGATION SUNULEK                                │
└─────────────────────────────────────────────────────────────────────────┘

                              ┌─────────┐
                              │  HOME   │
                              │    /    │
                              └────┬────┘
                                   │
          ┌────────────────────────┼────────────────────────┐
          │                        │                        │
          ▼                        ▼                        ▼
    ┌───────────┐           ┌───────────┐           ┌───────────┐
    │ /annonces │           │  /login   │           │ /register │
    │  Liste    │           │ Connexion │           │Inscription│
    └─────┬─────┘           └─────┬─────┘           └───────────┘
          │                       │
          ▼                       │ (si connecté)
    ┌───────────┐                 │
    │/annonces/ │                 ▼
    │  {slug}   │◀────────────────┴─────────────────────────────┐
    │  Détail   │                                               │
    └─────┬─────┘                                               │
          │                                                     │
          │ (propriétaire)                                      │
          ▼                                                     │
    ┌───────────┐                                               │
    │/annonces/ │                                               │
    │{slug}/    │                                               │
    │modifier   │                                               │
    │  Édition  │                                               │
    └───────────┘                                               │
                                                                │
    ┌───────────────────────────────────────────────────────────┘
    │ ROUTES PROTÉGÉES (nécessitent connexion)
    │
    ├──▶ /profil        → Profile.tsx       (Mon profil)
    ├──▶ /mes-annonces  → MyAnnonces.tsx    (Mes annonces + 3 onglets)
    ├──▶ /favoris       → Favorites.tsx     (Liste favoris)
    ├──▶ /messages      → Messages.tsx      (Messagerie)
    └──▶ /annonces/creer → CreateAnnonce.tsx (Nouvelle annonce)
```

---

## 8. Types TypeScript

### 8.1 Types principaux (types/index.ts)

```typescript
// Utilisateur
export interface User {
  id: number
  email: string
  username: string
  first_name: string
  last_name: string
  full_name: string
  phone: string
  avatar?: string
  role: 'acheteur' | 'vendeur' | 'admin'
  is_email_verified: boolean
  date_joined: string
}

// Tokens JWT
export interface AuthTokens {
  access: string
  refresh: string
}

// Catégorie
export interface Category {
  id: number
  name: string
  slug: string
  icon?: string
  description?: string
  ads_count?: number
}

// Image d'annonce
export interface AdImage {
  id: number
  image: string
  is_primary: boolean
  order: number
}

// Annonce
export interface Ad {
  id: number
  title: string
  slug: string
  description: string
  price: string
  is_negotiable: boolean
  category: Category
  region: string
  department: string
  neighborhood?: string
  address?: string
  status: 'draft' | 'pending' | 'active' | 'sold' | 'expired' | 'rejected'
  is_active: boolean
  is_featured: boolean
  views_count: number
  images: AdImage[]
  user: User
  is_favorite?: boolean
  created_at: string
  updated_at: string
  deleted_at?: string | null
}

// Conversation
export interface Conversation {
  id: number
  participant: User
  ad: Ad
  last_message?: Message
  unread_count: number
  created_at: string
  updated_at: string
}

// Message
export interface Message {
  id: number
  sender: User
  content: string
  is_read: boolean
  created_at: string
}

// Favori
export interface Favorite {
  id: number
  ad: Ad
  created_at: string
}

// Réponse paginée
export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}
```

---

## 9. Styles et UI

### 9.1 Configuration Tailwind

```javascript
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',  // Couleur principale (vert)
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

### 9.2 Classes utilitaires personnalisées

```css
/* index.css */
@layer components {
  .btn-primary {
    @apply bg-primary-500 text-white px-4 py-2 rounded-xl 
           hover:bg-primary-600 transition-colors;
  }
  
  .input-field {
    @apply w-full px-4 py-3 rounded-xl border border-gray-200 
           focus:ring-2 focus:ring-primary-500 focus:border-transparent;
  }
  
  .card {
    @apply bg-white rounded-2xl shadow-sm border border-gray-100 p-6;
  }
}
```

### 9.3 Charte graphique

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        CHARTE GRAPHIQUE                                  │
└─────────────────────────────────────────────────────────────────────────┘

COULEURS PRINCIPALES :
┌────────────────────────────────────────────────────────────────────────┐
│  PRIMARY (Vert)                                                        │
│  ┌────────┬────────┬────────┬────────┬────────┬────────┬────────┐    │
│  │  50    │  100   │  200   │  300   │  400   │  500   │  600   │    │
│  │#f0fdf4 │#dcfce7 │#bbf7d0 │#86efac │#4ade80 │#22c55e │#16a34a │    │
│  └────────┴────────┴────────┴────────┴────────┴────────┴────────┘    │
│                                        ▲                               │
│                                        │ Principale                    │
└────────────────────────────────────────────────────────────────────────┘

TYPOGRAPHIE :
┌────────────────────────────────────────────────────────────────────────┐
│  Font : Inter                                                          │
│  ├─ Titres (H1-H3) : font-bold                                        │
│  ├─ Corps : font-normal                                                │
│  └─ Petits textes : text-sm, text-gray-500                            │
└────────────────────────────────────────────────────────────────────────┘

BORDURES ET OMBRES :
┌────────────────────────────────────────────────────────────────────────┐
│  Border Radius : rounded-xl (12px), rounded-2xl (16px)                │
│  Shadows : shadow-sm, shadow-lg                                        │
│  Borders : border-gray-100, border-gray-200                           │
└────────────────────────────────────────────────────────────────────────┘

ESPACEMENTS :
┌────────────────────────────────────────────────────────────────────────┐
│  Gap : gap-2 (8px), gap-4 (16px), gap-6 (24px)                        │
│  Padding : p-4 (16px), p-6 (24px), p-8 (32px)                         │
│  Margin : m-4, my-6, mb-8                                              │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Configuration

### 10.1 Variables d'environnement

```env
# .env
VITE_API_URL=http://192.168.1.5:8000/api/v1
```

### 10.2 Configuration Vite (vite.config.ts)

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',  // Pour accès réseau local
  },
})
```

### 10.3 Configuration API (lib/api.ts)

```typescript
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { API_URL } from './constants'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use((config) => {
  const { tokens } = useAuthStore.getState()
  if (tokens?.access) {
    config.headers.Authorization = `Bearer ${tokens.access}`
  }
  return config
})

// Intercepteur pour refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const { tokens, setAuth, logout } = useAuthStore.getState()
      
      if (tokens?.refresh) {
        try {
          const { data } = await axios.post(`${API_URL}/auth/token/refresh/`, {
            refresh: tokens.refresh,
          })
          
          setAuth(useAuthStore.getState().user!, {
            access: data.access,
            refresh: tokens.refresh,
          })
          
          originalRequest.headers.Authorization = `Bearer ${data.access}`
          return api(originalRequest)
        } catch {
          logout()
        }
      }
    }
    
    return Promise.reject(error)
  }
)

export default api
```

### 10.4 Constantes (lib/constants.ts)

```typescript
export const API_URL = 'http://192.168.1.5:8000/api/v1'
export const MEDIA_URL = 'http://192.168.1.5:8000'

// Fonction helper pour les URLs de médias
export function getMediaUrl(path: string | undefined | null): string | undefined {
  if (!path) return undefined
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  return `${MEDIA_URL}${path.startsWith('/') ? '' : '/'}${path}`
}

// Régions du Sénégal
export const REGIONS_SENEGAL = [
  'Dakar', 'Thiès', 'Diourbel', 'Fatick', 'Kaffrine', 'Kaolack',
  'Kédougou', 'Kolda', 'Louga', 'Matam', 'Saint-Louis', 'Sédhiou',
  'Tambacounda', 'Ziguinchor',
]

// Départements par région
export const DEPARTMENTS_BY_REGION: Record<string, string[]> = {
  'Dakar': ['Dakar', 'Pikine', 'Guédiawaye', 'Rufisque', 'Keur Massar'],
  'Thiès': ['Thiès', 'Mbour', 'Tivaouane'],
  // ...
}

// Statuts d'annonce
export const AD_STATUS = {
  draft: 'Brouillon',
  pending: 'En attente',
  active: 'Active',
  sold: 'Vendu',
  expired: 'Expirée',
  rejected: 'Rejetée',
}
```

---

## 11. Installation et démarrage

### 11.1 Prérequis

- Node.js 18+
- npm ou yarn

### 11.2 Installation

```bash
# 1. Cloner le projet
git clone <repo-url>
cd sunulek-web

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec l'URL de l'API

# 4. Lancer en développement
npm run dev

# 5. Build pour production
npm run build
```

### 11.3 Scripts npm

| Script | Commande | Description |
|--------|----------|-------------|
| `dev` | `npm run dev` | Lance le serveur de dev |
| `build` | `npm run build` | Build pour production |
| `preview` | `npm run preview` | Preview du build |
| `lint` | `npm run lint` | Vérifie le code |

### 11.4 Accès réseau local

Pour tester sur d'autres appareils (mobile, tablette) sur le même réseau :

1. Le serveur Vite doit écouter sur `0.0.0.0` (configuré dans vite.config.ts)
2. Accéder via l'IP locale : `http://192.168.1.X:3000`
3. Vérifier que le firewall autorise le port 3000

---

## 12. Problèmes résolus

### 12.1 Photos de profil non affichées

**Problème :** Les avatars ne s'affichaient pas car l'URL était relative (`/media/avatars/photo.jpg`).

**Solution :** Créer la fonction `getMediaUrl()` pour construire l'URL complète :

```typescript
export function getMediaUrl(path: string | undefined | null): string | undefined {
  if (!path) return undefined
  if (path.startsWith('http')) return path
  return `${MEDIA_URL}${path}`
}
```

**Usage :**
```tsx
<img src={getMediaUrl(user.avatar)} />
```

### 12.2 Bouton Messages absent sur mobile

**Problème :** Le lien vers la messagerie n'était pas dans le menu hamburger mobile.

**Solution :** Ajouter le lien dans la section mobile du Header :

```tsx
<Link to="/messages">
  <MessageSquare /> Messages
  {unreadCount > 0 && <span>{unreadCount}</span>}
</Link>
```

### 12.3 Redirection des utilisateurs connectés

**Problème :** Les utilisateurs connectés pouvaient accéder aux pages login/register.

**Solution :** Créer le composant `GuestRoute` :

```tsx
export default function GuestRoute({ children }) {
  const { isAuthenticated } = useAuthStore()
  if (isAuthenticated) return <Navigate to="/" replace />
  return <>{children}</>
}
```

### 12.4 Catégorie non reconnue lors de la création d'annonce

**Problème :** Le frontend envoyait le slug de la catégorie, le backend attendait l'ID.

**Solution :** Modifier le backend pour accepter le slug (voir documentation backend).

### 12.5 Page "Mes Annonces" avec 3 onglets

**Implémentation :**

```tsx
const TABS = [
  { key: 'active', label: 'Actives', icon: CheckCircle, color: 'text-green-600' },
  { key: 'pending', label: 'En attente', icon: Clock, color: 'text-yellow-600' },
  { key: 'deleted', label: 'Corbeille', icon: Trash2, color: 'text-red-600' },
]

// Fetch des données par onglet
const { data: activeAds } = useMyAds('active')
const { data: pendingAds } = useMyAds('pending')
const { data: deletedAds } = useMyAds('deleted')
```

---

## Annexe : Commandes de développement utiles

```bash
# Vérifier les types TypeScript
npx tsc --noEmit

# Formater le code
npx prettier --write .

# Analyser le bundle
npm run build && npx vite-bundle-analyzer
```

---

**Document créé le :** 4 février 2026  
**Version :** 1.0  
**Auteur :** Équipe SunuLek
