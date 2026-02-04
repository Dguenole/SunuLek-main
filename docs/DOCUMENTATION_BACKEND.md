# 📚 Documentation Backend - SunuLek API

## Table des matières
1. [Présentation du projet](#1-présentation-du-projet)
2. [Problème résolu](#2-problème-résolu)
3. [Architecture technique](#3-architecture-technique)
4. [Structure du projet](#4-structure-du-projet)
5. [Modèles de données](#5-modèles-de-données)
6. [API Endpoints](#6-api-endpoints)
7. [Authentification](#7-authentification)
8. [Configuration](#8-configuration)
9. [Installation et démarrage](#9-installation-et-démarrage)
10. [Problèmes résolus pendant le développement](#10-problèmes-résolus-pendant-le-développement)

---

## 1. Présentation du projet

### 1.1 Qu'est-ce que SunuLek ?
**SunuLek** (signifiant "Notre Annonce" en Wolof) est une plateforme de petites annonces en ligne destinée au marché sénégalais. Elle permet aux utilisateurs de publier, rechercher et gérer des annonces de produits et services.

### 1.2 Objectifs du projet
- Créer une plateforme moderne et intuitive pour les petites annonces au Sénégal
- Faciliter les échanges entre acheteurs et vendeurs
- Offrir un système de messagerie intégré
- Gérer les annonces avec validation administrative
- Supporter les spécificités locales (régions, départements du Sénégal)

### 1.3 Stack technique Backend
| Technologie | Version | Rôle |
|-------------|---------|------|
| Python | 3.13 | Langage de programmation |
| Django | 5.2.10 | Framework web |
| Django REST Framework | 3.15+ | API REST |
| PostgreSQL | 15+ | Base de données |
| SimpleJWT | 5.3+ | Authentification JWT |
| Pillow | 10+ | Traitement d'images |
| django-cors-headers | 4+ | Gestion CORS |
| drf-spectacular | 0.27+ | Documentation OpenAPI |

---

## 2. Problème résolu

### 2.1 Contexte
Au Sénégal, les plateformes de petites annonces existantes présentent plusieurs limitations :
- Interfaces vieillissantes et peu intuitives
- Pas de système de messagerie intégré
- Manque de filtrage géographique adapté (régions/départements sénégalais)
- Processus de publication complexe
- Pas de gestion des favoris

### 2.2 Solution apportée
SunuLek résout ces problèmes en offrant :

```
┌─────────────────────────────────────────────────────────────────┐
│                     PROBLÈMES → SOLUTIONS                        │
├─────────────────────────────────────────────────────────────────┤
│ ❌ Interface vieillissante    → ✅ Design moderne et responsive │
│ ❌ Pas de messagerie          → ✅ Chat intégré temps réel      │
│ ❌ Filtrage géographique      → ✅ Régions/Départements Sénégal │
│ ❌ Publication complexe       → ✅ Formulaire simplifié         │
│ ❌ Pas de favoris             → ✅ Système de favoris complet   │
│ ❌ Pas de validation          → ✅ Workflow de modération       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Architecture technique

### 3.1 Diagramme d'architecture globale

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENTS                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                   │
│  │   Browser    │  │   Mobile     │  │   Tablet     │                   │
│  │   (React)    │  │   Browser    │  │   Browser    │                   │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘                   │
└─────────┼─────────────────┼─────────────────┼───────────────────────────┘
          │                 │                 │
          └────────────────┬┴─────────────────┘
                           │ HTTPS (Port 3000 → 8000)
                           ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         BACKEND (Django)                                 │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                    Django REST Framework                          │  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐     │  │
│  │  │  Auth   │ │ Annonces│ │Messages │ │Favorites│ │Categories│     │  │
│  │  │   API   │ │   API   │ │   API   │ │   API   │ │   API   │     │  │
│  │  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘     │  │
│  └───────┼──────────┼──────────┼──────────┼──────────┼──────────────┘  │
│          │          │          │          │          │                  │
│  ┌───────┴──────────┴──────────┴──────────┴──────────┴──────────────┐  │
│  │                         MODELS (ORM)                              │  │
│  │   User  │  Ad  │  AdImage  │  Category  │  Message  │  Favorite  │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        PostgreSQL Database                               │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  users_user │ annonces_ad │ categories_category │ messages_*   │    │
│  └─────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         File Storage (Media)                             │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  /media/avatars/  │  /media/annonces/  │  /media/categories/   │    │
│  └─────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Diagramme de flux - Publication d'annonce

```
┌────────┐     ┌────────────┐     ┌────────────┐     ┌──────────┐
│  User  │────▶│  Frontend  │────▶│  Backend   │────▶│ Database │
└────────┘     └────────────┘     └────────────┘     └──────────┘
    │                │                  │                  │
    │ 1. Remplit     │                  │                  │
    │    formulaire  │                  │                  │
    │───────────────▶│                  │                  │
    │                │ 2. POST /api/v1/ │                  │
    │                │    annonces/     │                  │
    │                │─────────────────▶│                  │
    │                │                  │ 3. Validation    │
    │                │                  │    des données   │
    │                │                  │─────────────────▶│
    │                │                  │                  │
    │                │                  │ 4. Sauvegarde    │
    │                │                  │    (status=      │
    │                │                  │    pending)      │
    │                │                  │◀─────────────────│
    │                │ 5. Response 201  │                  │
    │                │◀─────────────────│                  │
    │ 6. Toast       │                  │                  │
    │    "En attente"│                  │                  │
    │◀───────────────│                  │                  │
```

### 3.3 Diagramme de flux - Messagerie

```
┌──────────┐                              ┌──────────┐
│ Acheteur │                              │ Vendeur  │
└────┬─────┘                              └────┬─────┘
     │                                         │
     │ 1. Clique "Contacter"                   │
     │         sur annonce                     │
     ▼                                         │
┌─────────────────────────────────────────────────────────┐
│                    Backend API                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ POST /conversations/start/                        │  │
│  │ {ad_id, content: "Premier message"}              │  │
│  └──────────────────────────────────────────────────┘  │
│                         │                               │
│                         ▼                               │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Création conversation + Premier message          │  │
│  │ → Notification au vendeur                        │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
     │                                         │
     │ 2. Conversation créée                   │ 3. Reçoit notif
     ▼                                         ▼
┌──────────┐                              ┌──────────┐
│  Chat    │◀────── Messages ────────────▶│  Chat    │
│  Window  │                              │  Window  │
└──────────┘                              └──────────┘
```

---

## 4. Structure du projet

```
sunulek-api/
├── manage.py                 # Point d'entrée Django
├── requirements.txt          # Dépendances Python
├── Procfile                  # Configuration Heroku
├── runtime.txt              # Version Python pour déploiement
│
├── config/                   # Configuration principale
│   ├── __init__.py
│   ├── settings.py          # Paramètres Django
│   ├── urls.py              # URLs racine
│   ├── wsgi.py              # WSGI pour production
│   └── asgi.py              # ASGI pour async
│
├── apps/                     # Applications Django
│   ├── users/               # Gestion utilisateurs
│   │   ├── models.py        # Modèle User personnalisé
│   │   ├── serializers.py   # Sérialiseurs DRF
│   │   ├── views.py         # Vues API
│   │   ├── urls.py          # Routes auth
│   │   └── migrations/      # Migrations DB
│   │
│   ├── annonces/            # Gestion annonces
│   │   ├── models.py        # Ad, AdImage
│   │   ├── serializers.py   # AdSerializer, etc.
│   │   ├── views.py         # AdViewSet
│   │   ├── urls.py          # Routes annonces
│   │   └── migrations/
│   │
│   ├── categories/          # Catégories
│   │   ├── models.py        # Category
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   │
│   ├── messages/            # Messagerie
│   │   ├── models.py        # Conversation, Message
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   │
│   └── favorites/           # Favoris
│       ├── models.py        # Favorite
│       ├── serializers.py
│       ├── views.py
│       └── urls.py
│
├── media/                    # Fichiers uploadés
│   ├── avatars/             # Photos profil
│   ├── annonces/            # Images annonces
│   └── categories/          # Icônes catégories
│
└── venv/                     # Environnement virtuel
```

---

## 5. Modèles de données

### 5.1 Diagramme Entité-Relation (ERD)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DIAGRAMME ENTITÉ-RELATION                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│      USER        │         │       AD         │         │    CATEGORY      │
├──────────────────┤         ├──────────────────┤         ├──────────────────┤
│ PK id            │         │ PK id            │         │ PK id            │
│    email (unique)│◀────┐   │ FK user_id       │────────▶│    name          │
│    username      │     │   │ FK category_id   │────────▶│    slug (unique) │
│    first_name    │     │   │    title         │         │    icon          │
│    last_name     │     │   │    slug (unique) │         │    description   │
│    phone         │     │   │    description   │         │    created_at    │
│    avatar        │     │   │    price         │         └──────────────────┘
│    role          │     │   │    is_negotiable │
│    is_email_     │     │   │    region        │
│      verified    │     │   │    department    │
│    date_joined   │     │   │    neighborhood  │
└──────────────────┘     │   │    address       │
         │               │   │    status        │
         │               │   │    is_active     │
         │               │   │    is_featured   │
         │               │   │    views_count   │
         │               │   │    created_at    │
         │               │   │    updated_at    │
         │               │   │    published_at  │
         │               │   │    deleted_at    │  ← Soft delete
         │               │   └──────────────────┘
         │               │            │
         │               │            │ 1:N
         │               │            ▼
         │               │   ┌──────────────────┐
         │               │   │    AD_IMAGE      │
         │               │   ├──────────────────┤
         │               │   │ PK id            │
         │               │   │ FK ad_id         │
         │               │   │    image         │
         │               │   │    is_primary    │
         │               │   │    order         │
         │               │   └──────────────────┘
         │               │
         │ 1:N           │
         ▼               │
┌──────────────────┐     │
│    FAVORITE      │     │
├──────────────────┤     │
│ PK id            │     │
│ FK user_id       │─────┘
│ FK ad_id         │─────────▶ (vers AD)
│    created_at    │
└──────────────────┘

         │
         │ 1:N (participant1, participant2)
         ▼
┌──────────────────┐         ┌──────────────────┐
│  CONVERSATION    │         │     MESSAGE      │
├──────────────────┤         ├──────────────────┤
│ PK id            │◀────────│ FK conversation  │
│ FK participant1  │         │ PK id            │
│ FK participant2  │         │ FK sender_id     │─────────▶ (vers USER)
│ FK ad_id         │         │    content       │
│    created_at    │         │    is_read       │
│    updated_at    │         │    created_at    │
└──────────────────┘         └──────────────────┘
```

### 5.2 Modèle User (apps/users/models.py)

```python
class User(AbstractUser):
    """Modèle utilisateur personnalisé."""
    
    class Role(models.TextChoices):
        ACHETEUR = 'acheteur', 'Acheteur'
        VENDEUR = 'vendeur', 'Vendeur'
        ADMIN = 'admin', 'Administrateur'
    
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.ACHETEUR)
    is_email_verified = models.BooleanField(default=False)
    
    USERNAME_FIELD = 'email'  # Connexion par email
    REQUIRED_FIELDS = ['username']
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip() or self.username
```

### 5.3 Modèle Ad (apps/annonces/models.py)

```python
class Ad(models.Model):
    """Modèle Annonce."""
    
    class Status(models.TextChoices):
        DRAFT = 'draft', 'Brouillon'
        PENDING = 'pending', 'En attente de validation'
        ACTIVE = 'active', 'Active'
        SOLD = 'sold', 'Vendu'
        EXPIRED = 'expired', 'Expirée'
        REJECTED = 'rejected', 'Rejetée'
    
    # Informations de base
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    is_negotiable = models.BooleanField(default=True)
    
    # Relations
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ads')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    
    # Localisation (Sénégal)
    region = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    neighborhood = models.CharField(max_length=100, blank=True)
    
    # Statut
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    
    # Statistiques
    views_count = models.PositiveIntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)  # Soft delete
    
    def soft_delete(self):
        """Suppression douce (corbeille)."""
        self.deleted_at = timezone.now()
        self.is_active = False
        self.save()
    
    def restore(self):
        """Restaurer une annonce supprimée."""
        self.deleted_at = None
        self.is_active = True
        self.save()
```

### 5.4 Statuts d'une annonce

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    CYCLE DE VIE D'UNE ANNONCE                           │
└─────────────────────────────────────────────────────────────────────────┘

    ┌─────────┐
    │  DRAFT  │ ─── (Brouillon, non publié)
    └────┬────┘
         │ Soumettre
         ▼
    ┌─────────┐
    │ PENDING │ ─── (En attente de validation admin)
    └────┬────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌─────────┐  ┌──────────┐
│ ACTIVE  │  │ REJECTED │ ─── (Refusée par admin)
└────┬────┘  └──────────┘
     │
     │ Vendu / Expiré
     ▼
┌─────────┐  ┌─────────┐
│  SOLD   │  │ EXPIRED │
└─────────┘  └─────────┘

Note: deleted_at ≠ NULL → Annonce dans la corbeille (soft delete)
```

---

## 6. API Endpoints

### 6.1 Authentification (`/api/v1/auth/`)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/auth/register/` | Inscription | ❌ |
| POST | `/auth/login/` | Connexion (retourne JWT) | ❌ |
| POST | `/auth/logout/` | Déconnexion | ✅ |
| POST | `/auth/token/refresh/` | Rafraîchir access token | ✅ |
| GET | `/auth/profile/` | Récupérer profil | ✅ |
| PATCH | `/auth/profile/` | Modifier profil | ✅ |
| POST | `/auth/change-password/` | Changer mot de passe | ✅ |
| POST | `/auth/verify-email/` | Vérifier email (code) | ❌ |
| POST | `/auth/resend-verification/` | Renvoyer code | ❌ |

### 6.2 Annonces (`/api/v1/annonces/`)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/annonces/` | Liste des annonces (paginée) | ❌ |
| GET | `/annonces/{slug}/` | Détail d'une annonce | ❌ |
| POST | `/annonces/` | Créer une annonce | ✅ |
| PUT/PATCH | `/annonces/{slug}/` | Modifier une annonce | ✅ (propriétaire) |
| DELETE | `/annonces/{slug}/` | Supprimer définitivement | ✅ (propriétaire) |
| GET | `/annonces/my_ads/` | Mes annonces (avec filtre status) | ✅ |
| POST | `/annonces/{slug}/soft_delete/` | Mettre en corbeille | ✅ (propriétaire) |
| POST | `/annonces/{slug}/restore/` | Restaurer de la corbeille | ✅ (propriétaire) |
| DELETE | `/annonces/{slug}/permanent_delete/` | Supprimer définitivement | ✅ (propriétaire) |

**Paramètres de filtrage :**
```
GET /annonces/?category=electronique&region=Dakar&price_min=5000&price_max=50000&ordering=-created_at
GET /annonces/my_ads/?status=active|pending|deleted
```

### 6.3 Catégories (`/api/v1/categories/`)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/categories/` | Liste des catégories | ❌ |
| GET | `/categories/{slug}/` | Détail catégorie | ❌ |

### 6.4 Favoris (`/api/v1/favorites/`)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/favorites/` | Liste des favoris | ✅ |
| POST | `/favorites/` | Ajouter un favori | ✅ |
| DELETE | `/favorites/{id}/` | Retirer un favori | ✅ |
| POST | `/favorites/toggle/` | Toggle favori | ✅ |

### 6.5 Messages (`/api/v1/conversations/`)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/conversations/` | Liste des conversations | ✅ |
| GET | `/conversations/{id}/` | Détail conversation | ✅ |
| POST | `/conversations/start/` | Démarrer conversation | ✅ |
| POST | `/conversations/{id}/send/` | Envoyer message | ✅ |
| POST | `/conversations/{id}/mark_read/` | Marquer comme lu | ✅ |
| GET | `/conversations/unread_count/` | Nombre non lus | ✅ |

---

## 7. Authentification

### 7.1 Système JWT

SunuLek utilise **Simple JWT** pour l'authentification :

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         FLUX D'AUTHENTIFICATION                          │
└─────────────────────────────────────────────────────────────────────────┘

┌────────┐                  ┌────────────┐                  ┌────────────┐
│ Client │                  │   Backend  │                  │  Database  │
└───┬────┘                  └─────┬──────┘                  └─────┬──────┘
    │                             │                               │
    │ 1. POST /auth/login/        │                               │
    │    {email, password}        │                               │
    │────────────────────────────▶│                               │
    │                             │ 2. Vérifier credentials       │
    │                             │──────────────────────────────▶│
    │                             │◀──────────────────────────────│
    │                             │                               │
    │ 3. {access, refresh, user}  │                               │
    │◀────────────────────────────│                               │
    │                             │                               │
    │ 4. GET /annonces/my_ads/    │                               │
    │    Header: Bearer {access}  │                               │
    │────────────────────────────▶│                               │
    │                             │ 5. Valider token              │
    │                             │ 6. Récupérer user             │
    │                             │──────────────────────────────▶│
    │                             │◀──────────────────────────────│
    │ 7. Response 200             │                               │
    │◀────────────────────────────│                               │
    │                             │                               │
    │ --- Après 5 minutes ---     │                               │
    │                             │                               │
    │ 8. POST /auth/token/refresh/│                               │
    │    {refresh}                │                               │
    │────────────────────────────▶│                               │
    │                             │                               │
    │ 9. {access: new_token}      │                               │
    │◀────────────────────────────│                               │
```

### 7.2 Configuration JWT (settings.py)

```python
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
}
```

### 7.3 Réponse de connexion

```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "john_doe",
    "first_name": "John",
    "last_name": "Doe",
    "full_name": "John Doe",
    "phone": "+221771234567",
    "avatar": "/media/avatars/photo.jpg",
    "role": "vendeur",
    "is_email_verified": true
  }
}
```

---

## 8. Configuration

### 8.1 Variables d'environnement

Créer un fichier `.env` à la racine de `sunulek-api/` :

```env
# Django
SECRET_KEY=votre-clé-secrète-très-longue
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,192.168.1.5

# Base de données
DATABASE_URL=postgres://user:password@localhost:5432/sunulek
# Ou séparément :
DB_NAME=sunulek
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe
DB_HOST=localhost
DB_PORT=5432

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://192.168.1.5:3000

# Email (optionnel)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=votre-email@gmail.com
EMAIL_HOST_PASSWORD=votre-app-password
```

### 8.2 Configuration CORS (settings.py)

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://192.168.1.5:3000",  # Pour accès réseau local
]

CORS_ALLOW_CREDENTIALS = True
```

### 8.3 Configuration Media

```python
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
```

---

## 9. Installation et démarrage

### 9.1 Prérequis

- Python 3.11+
- PostgreSQL 15+
- pip

### 9.2 Installation

```bash
# 1. Cloner le projet
git clone <repo-url>
cd sunulek-api

# 2. Créer l'environnement virtuel
python -m venv venv

# 3. Activer l'environnement
# macOS/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# 4. Installer les dépendances
pip install -r requirements.txt

# 5. Créer la base de données PostgreSQL
createdb sunulek

# 6. Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos valeurs

# 7. Appliquer les migrations
python manage.py migrate

# 8. Créer un superutilisateur
python manage.py createsuperuser

# 9. Lancer le serveur
python manage.py runserver 0.0.0.0:8000
```

### 9.3 Commandes utiles

```bash
# Créer une migration après modification de modèle
python manage.py makemigrations

# Appliquer les migrations
python manage.py migrate

# Créer un superuser
python manage.py createsuperuser

# Ouvrir le shell Django
python manage.py shell

# Collecter les fichiers statiques (production)
python manage.py collectstatic
```

---

## 10. Problèmes résolus pendant le développement

### 10.1 Erreur de catégorie (slug vs ID)

**Problème :** Le frontend envoyait le slug de la catégorie (`"telephone"`) mais le backend attendait l'ID (`1`).

**Solution :** Utiliser `SlugRelatedField` dans le serializer :

```python
# apps/annonces/serializers.py
class AdCreateSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(
        slug_field='slug',
        queryset=Category.objects.all()
    )
```

### 10.2 Photos de profil non affichées

**Problème :** L'avatar retournait `/media/avatars/photo.jpg` au lieu de l'URL complète.

**Solution :** 
1. Backend : Retourner l'URL avec le domaine
2. Frontend : Créer une fonction `getMediaUrl()` pour construire l'URL complète

```python
# Backend - serializers.py
'avatar': self.user.avatar.url if self.user.avatar else None,
```

```typescript
// Frontend - constants.ts
export function getMediaUrl(path: string | undefined | null): string | undefined {
  if (!path) return undefined
  if (path.startsWith('http')) return path
  return `${MEDIA_URL}${path}`
}
```

### 10.3 Champs du profil vides après connexion

**Problème :** Le `CustomTokenObtainPairSerializer` ne retournait pas tous les champs utilisateur.

**Solution :** Ajouter les champs manquants :

```python
data['user'] = {
    'id': self.user.id,
    'email': self.user.email,
    'username': self.user.username,
    'first_name': self.user.first_name,      # ← Ajouté
    'last_name': self.user.last_name,        # ← Ajouté
    'full_name': self.user.full_name,
    'phone': self.user.phone,                # ← Ajouté
    'avatar': self.user.avatar.url if self.user.avatar else None,  # ← Ajouté
    'role': self.user.role,
    'is_email_verified': self.user.is_email_verified,
}
```

### 10.4 Système de corbeille (Soft Delete)

**Problème :** La suppression d'annonce était définitive.

**Solution :** Implémenter le soft delete :

1. Ajouter `deleted_at` au modèle
2. Créer les méthodes `soft_delete()` et `restore()`
3. Créer les endpoints `/soft_delete/`, `/restore/`, `/permanent_delete/`
4. Filtrer les annonces par statut dans `my_ads`

### 10.5 Bouton Messages absent sur mobile

**Problème :** Le lien Messages n'apparaissait pas dans le menu hamburger.

**Solution :** Ajouter le lien dans le menu mobile du Header :

```tsx
<Link to="/messages" onClick={() => setIsMenuOpen(false)}>
  <MessageSquare /> Messages
  {unreadCount > 0 && <span>{unreadCount}</span>}
</Link>
```

---

## Annexe : Codes HTTP utilisés

| Code | Signification | Utilisation |
|------|---------------|-------------|
| 200 | OK | Requête réussie |
| 201 | Created | Ressource créée |
| 204 | No Content | Suppression réussie |
| 400 | Bad Request | Données invalides |
| 401 | Unauthorized | Non authentifié |
| 403 | Forbidden | Pas les permissions |
| 404 | Not Found | Ressource introuvable |
| 500 | Server Error | Erreur serveur |

---

**Document créé le :** 4 février 2026  
**Version :** 1.0  
**Auteur :** Équipe SunuLek
