# SunuLek API 🇸🇳

API REST pour le site d'annonces SunuLek, développée avec Django REST Framework.

## 🏗️ Architecture

```
sunulek-api/
├── config/                 # Configuration Django
│   ├── settings.py        # Settings principal
│   ├── urls.py            # URLs racine
│   ├── api_urls.py        # URLs API v1
│   ├── wsgi.py
│   └── asgi.py
├── apps/                   # Applications Django
│   ├── users/             # Authentification & utilisateurs
│   ├── annonces/          # Gestion des annonces
│   ├── categories/        # Catégories d'annonces
│   └── favorites/         # Favoris utilisateur
├── media/                  # Fichiers uploadés
├── staticfiles/           # Fichiers statiques (production)
├── requirements.txt
├── manage.py
└── .env.example
```

## 🚀 Installation

### 1. Cloner et créer l'environnement virtuel

```bash
cd sunulek-api
python -m venv venv
source venv/bin/activate  # macOS/Linux
# ou
venv\Scripts\activate     # Windows
```

### 2. Installer les dépendances

```bash
pip install -r requirements.txt
```

### 3. Configuration

```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer avec vos valeurs
nano .env
```

### 4. Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Créer un superuser

```bash
python manage.py createsuperuser
```

### 6. Lancer le serveur

```bash
python manage.py runserver
```

## 📚 Documentation API

Une fois le serveur lancé :

- **Swagger UI** : http://localhost:8000/api/docs/
- **ReDoc** : http://localhost:8000/api/redoc/
- **Schema OpenAPI** : http://localhost:8000/api/schema/

## 🔗 Endpoints principaux

### Authentication
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/v1/auth/register/` | Inscription |
| POST | `/api/v1/auth/login/` | Connexion (JWT) |
| POST | `/api/v1/auth/logout/` | Déconnexion |
| POST | `/api/v1/auth/token/refresh/` | Rafraîchir le token |
| POST | `/api/v1/auth/verify-email/<id>/` | Vérifier email |
| GET/PUT | `/api/v1/auth/profile/` | Profil utilisateur |

### Annonces
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/v1/annonces/` | Liste des annonces |
| POST | `/api/v1/annonces/` | Créer une annonce |
| GET | `/api/v1/annonces/<slug>/` | Détail d'une annonce |
| PUT | `/api/v1/annonces/<slug>/` | Modifier une annonce |
| DELETE | `/api/v1/annonces/<slug>/` | Supprimer une annonce |
| GET | `/api/v1/annonces/my_ads/` | Mes annonces |
| GET | `/api/v1/annonces/featured/` | Annonces en vedette |
| POST | `/api/v1/annonces/<slug>/contact/` | Contacter le vendeur |

### Catégories
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/v1/categories/` | Liste des catégories |
| GET | `/api/v1/categories/<slug>/` | Détail catégorie |
| GET | `/api/v1/categories/<slug>/ads/` | Annonces par catégorie |

### Favoris
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/v1/favorites/` | Mes favoris |
| POST | `/api/v1/favorites/toggle/` | Ajouter/Retirer favori |
| GET | `/api/v1/favorites/count/` | Nombre de favoris |

## 🔍 Filtres & Recherche

```
GET /api/v1/annonces/?category=electronique
GET /api/v1/annonces/?region=Dakar&department=Dakar
GET /api/v1/annonces/?min_price=10000&max_price=50000
GET /api/v1/annonces/?search=iphone
GET /api/v1/annonces/?ordering=-price  # Tri par prix décroissant
```

## 🔐 Authentification

L'API utilise JWT (JSON Web Tokens).

```bash
# Login
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# Réponse
{
  "access": "eyJ...",
  "refresh": "eyJ...",
  "user": { ... }
}

# Utiliser le token
curl http://localhost:8000/api/v1/auth/profile/ \
  -H "Authorization: Bearer eyJ..."
```

## 🌐 CORS

Les origines autorisées sont configurées dans `.env` :

```
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

## 📦 Déploiement (Render)

1. Créer un Web Service sur Render
2. Connecter votre repo GitHub
3. Configurer les variables d'environnement
4. Build command : `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
5. Start command : `gunicorn config.wsgi:application`

## 🛠️ Technologies

- **Django 5.x** - Framework web
- **Django REST Framework** - API REST
- **SimpleJWT** - Authentification JWT
- **drf-spectacular** - Documentation OpenAPI
- **django-filter** - Filtrage des querysets
- **django-cors-headers** - Gestion CORS
- **Pillow** - Traitement d'images
- **WhiteNoise** - Fichiers statiques

## 📱 Frontend

Ce backend est conçu pour fonctionner avec :
- **React** (web) - à venir
- **Flutter** (mobile) - à venir

---

Développé avec ❤️ pour le Sénégal 🇸🇳
