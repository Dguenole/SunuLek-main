# 🇸🇳 SunuLek API - Backend

API REST pour la plateforme de petites annonces SunuLek, développée avec Django REST Framework.

## 📋 Table des matières

- [Technologies](#-technologies)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Structure du projet](#-structure-du-projet)
- [API Endpoints](#-api-endpoints)
- [Modèles de données](#-modèles-de-données)
- [Commandes utiles](#-commandes-utiles)

## 🛠️ Technologies

| Technologie | Version | Rôle |
|-------------|---------|------|
| Python | 3.13 | Langage de programmation |
| Django | 5.2.10 | Framework web |
| Django REST Framework | 3.15+ | API REST |
| PostgreSQL | 15+ | Base de données |
| Simple JWT | 5.3+ | Authentification JWT |
| Pillow | 10+ | Traitement d'images |
| django-cors-headers | 4+ | Gestion CORS |
| drf-spectacular | 0.27+ | Documentation OpenAPI |

## 🏗️ Architecture

```
sunulek-api/
├── manage.py                 # Point d'entrée Django
├── requirements.txt          # Dépendances Python
├── Procfile                  # Configuration Heroku
├── runtime.txt              # Version Python
│
├── config/                   # Configuration principale
│   ├── settings.py          # Paramètres Django
│   ├── urls.py              # URLs racine
│   ├── wsgi.py              # WSGI pour production
│   └── asgi.py              # ASGI pour async
│
├── apps/                     # Applications Django
│   ├── users/               # Authentification & utilisateurs
│   │   ├── models.py        # Modèle User personnalisé
│   │   ├── serializers.py   # Sérialiseurs DRF
│   │   ├── views.py         # Vues API
│   │   └── urls.py          # Routes auth
│   │
│   ├── annonces/            # Gestion des annonces
│   │   ├── models.py        # Ad, AdImage
│   │   ├── serializers.py   # AdSerializer, etc.
│   │   ├── views.py         # AdViewSet
│   │   └── urls.py          # Routes annonces
│   │
│   ├── categories/          # Catégories
│   │   ├── models.py        # Category
│   │   └── views.py
│   │
│   ├── messages/            # Messagerie
│   │   ├── models.py        # Conversation, Message
│   │   └── views.py
│   │
│   └── favorites/           # Favoris
│       ├── models.py        # Favorite
│       └── views.py
│
└── media/                    # Fichiers uploadés
    ├── avatars/             # Photos profil
    ├── annonces/            # Images annonces
    └── categories/          # Icônes catégories
```

## 🚀 Installation

### 1. Prérequis
- Python 3.11+
- PostgreSQL 15+
- pip

### 2. Créer l'environnement virtuel

```bash
cd sunulek-api
python -m venv venv

# Activer l'environnement
source venv/bin/activate      # macOS/Linux
# ou
venv\Scripts\activate         # Windows
```

### 3. Installer les dépendances

```bash
pip install -r requirements.txt
```

### 4. Configurer la base de données

```bash
# Créer la base de données PostgreSQL
createdb sunulek
```

### 5. Variables d'environnement

Créer un fichier `.env` à la racine :

```env
# Django
SECRET_KEY=votre-clé-secrète-très-longue
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,192.168.1.5

# Base de données
DB_NAME=sunulek
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe
DB_HOST=localhost
DB_PORT=5432

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://192.168.1.5:3000
```

### 6. Appliquer les migrations

```bash
python manage.py migrate
```

### 7. Créer un superutilisateur

```bash
python manage.py createsuperuser
```

### 8. Lancer le serveur

```bash
# Développement local
python manage.py runserver

# Accessible sur le réseau local
python manage.py runserver 0.0.0.0:8000
```

## 📚 Documentation API

Une fois le serveur lancé :

- **Swagger UI** : http://localhost:8000/api/docs/
- **ReDoc** : http://localhost:8000/api/redoc/
- **Schema OpenAPI** : http://localhost:8000/api/schema/

## 🔌 API Endpoints

### Authentification (`/api/v1/auth/`)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/auth/register/` | Inscription | ❌ |
| POST | `/auth/login/` | Connexion (retourne JWT) | ❌ |
| POST | `/auth/logout/` | Déconnexion | ✅ |
| POST | `/auth/token/refresh/` | Rafraîchir access token | ✅ |
| GET | `/auth/profile/` | Récupérer profil | ✅ |
| PATCH | `/auth/profile/` | Modifier profil | ✅ |
| POST | `/auth/change-password/` | Changer mot de passe | ✅ |

### Annonces (`/api/v1/annonces/`)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/annonces/` | Liste des annonces | ❌ |
| GET | `/annonces/{slug}/` | Détail d'une annonce | ❌ |
| POST | `/annonces/` | Créer une annonce | ✅ |
| PUT/PATCH | `/annonces/{slug}/` | Modifier une annonce | ✅ |
| DELETE | `/annonces/{slug}/` | Supprimer définitivement | ✅ |
| GET | `/annonces/my_ads/` | Mes annonces | ✅ |
| POST | `/annonces/{slug}/soft_delete/` | Mettre en corbeille | ✅ |
| POST | `/annonces/{slug}/restore/` | Restaurer de la corbeille | ✅ |

**Paramètres de filtrage :**
```
GET /annonces/?category=electronique&region=Dakar&price_min=5000&ordering=-created_at
GET /annonces/my_ads/?status=active|pending|deleted
```

### Catégories (`/api/v1/categories/`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/categories/` | Liste des catégories |
| GET | `/categories/{slug}/` | Détail catégorie |

### Favoris (`/api/v1/favorites/`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/favorites/` | Liste des favoris |
| POST | `/favorites/toggle/` | Toggle favori |

### Messages (`/api/v1/conversations/`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/conversations/` | Liste des conversations |
| POST | `/conversations/start/` | Démarrer conversation |
| POST | `/conversations/{id}/send/` | Envoyer message |
| GET | `/conversations/unread_count/` | Nombre non lus |

## 🔐 Authentification JWT

```bash
# Login
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# Réponse
{
  "access": "eyJ...",
  "refresh": "eyJ...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "john",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+221771234567",
    "avatar": "/media/avatars/photo.jpg"
  }
}

# Utiliser le token
curl http://localhost:8000/api/v1/auth/profile/ \
  -H "Authorization: Bearer eyJ..."
```

## 📊 Modèles de données

### User
```python
- email (unique)
- username
- first_name, last_name
- phone
- avatar
- role (acheteur/vendeur/admin)
- is_email_verified
```

### Ad (Annonce)
```python
- title, slug, description
- price, is_negotiable
- category (FK)
- user (FK)
- region, department, neighborhood
- status (draft/pending/active/sold/expired/rejected)
- is_featured
- views_count
- deleted_at (soft delete)
- created_at, updated_at
```

### Conversation & Message
```python
# Conversation
- participant1, participant2 (FK User)
- ad (FK)

# Message
- conversation (FK)
- sender (FK User)
- content
- is_read
```

## 🔧 Commandes utiles

```bash
# Créer une migration
python manage.py makemigrations

# Appliquer les migrations
python manage.py migrate

# Créer un superuser
python manage.py createsuperuser

# Shell Django
python manage.py shell

# Collecter les fichiers statiques
python manage.py collectstatic

# Lancer les tests
python manage.py test
```

## 📖 Documentation complète

Voir [docs/DOCUMENTATION_BACKEND.md](../docs/DOCUMENTATION_BACKEND.md) pour la documentation détaillée incluant :
- Diagrammes d'architecture
- Diagramme ERD complet
- Flux d'authentification JWT
- Problèmes résolus
- Et plus...

## 📦 Déploiement

### Render
1. Créer un Web Service sur Render
2. Connecter votre repo GitHub
3. Configurer les variables d'environnement
4. Build command : `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
5. Start command : `gunicorn config.wsgi:application`

### Heroku
```bash
heroku create sunulek-api
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
heroku run python manage.py migrate
```

---

**Version :** 1.0.0  
**Dernière mise à jour :** Février 2026

Développé avec ❤️ pour le Sénégal 🇸🇳
