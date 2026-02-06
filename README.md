# 🇸🇳 SunuLek - Plateforme de Petites Annonces au Sénégal

<p align="center">
  <img src="https://img.shields.io/badge/Django-5.2-green?style=for-the-badge&logo=django" alt="Django">
  <img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/PostgreSQL-15-blue?style=for-the-badge&logo=postgresql" alt="PostgreSQL">
</p>

**SunuLek** (signifiant "Notre Annonce" en Wolof) est une plateforme moderne de petites annonces en ligne destinée au marché sénégalais.

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Architecture](#-architecture)
- [Technologies](#-technologies)
- [Installation rapide](#-installation-rapide)
- [Documentation](#-documentation)
- [Structure du projet](#-structure-du-projet)
- [Contribuer](#-contribuer)

## ✨ Fonctionnalités

### 👤 Utilisateurs
- Inscription et connexion sécurisée (JWT)
- Profil personnalisable avec photo
- Vérification par email

### 📦 Annonces
- Création d'annonces avec images multiples
- Catégorisation (Électronique, Véhicules, Immobilier, etc.)
- Localisation par région/département sénégalais
- Recherche avancée et filtres
- Système de corbeille (soft delete)
- Workflow de validation (pending → active)

### 💬 Messagerie
- Chat intégré entre acheteurs et vendeurs
- Notifications de messages non lus
- Historique des conversations

### ❤️ Favoris
- Sauvegarde d'annonces favorites
- Gestion facile des favoris

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTS                                  │
│     Browser (Desktop)  │  Mobile Browser  │  Tablet              │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                       │
│                    http://localhost:3000                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Pages     │  │  Components │  │   Stores    │             │
│  │  (Routes)   │  │    (UI)     │  │  (Zustand)  │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└────────────────────────────────┬────────────────────────────────┘
                                 │ REST API (JSON)
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Django REST Framework)               │
│                    http://localhost:8000/api/v1/                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │    Auth     │  │   Annonces  │  │  Messages   │             │
│  │    API      │  │     API     │  │    API      │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      PostgreSQL Database                         │
│                      + Media Storage (fichiers)                  │
└─────────────────────────────────────────────────────────────────┘
```

## 🛠️ Technologies

### Backend
| Technologie | Version | Description |
|-------------|---------|-------------|
| Python | 3.13 | Langage de programmation |
| Django | 5.2.10 | Framework web |
| Django REST Framework | 3.15+ | API REST |
| PostgreSQL | 15+ | Base de données |
| Simple JWT | 5.3+ | Authentification JWT |
| Pillow | 10+ | Traitement d'images |

### Frontend
| Technologie | Version | Description |
|-------------|---------|-------------|
| React | 18.x | Bibliothèque UI |
| TypeScript | 5.x | Typage statique |
| Vite | 5.x | Build tool |
| TanStack Query | 5.x | Gestion des requêtes API |
| Zustand | 4.x | State management |
| Tailwind CSS | 3.x | Styles CSS |
| Framer Motion | 11.x | Animations |

## 🚀 Installation rapide

### Prérequis
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+

### 1. Cloner le projet
```bash
git clone <repository-url>
cd SunuLek-main
```

### 2. Configurer le Backend
```bash
cd sunulek-api

# Créer l'environnement virtuel
python -m venv venv
source venv/bin/activate  # macOS/Linux

# Installer les dépendances
pip install -r requirements.txt

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos paramètres

# Créer la base de données
createdb sunulek

# Appliquer les migrations
python manage.py migrate

# Créer un superutilisateur
python manage.py createsuperuser

# Lancer le serveur
python manage.py runserver 0.0.0.0:8000
```

### 3. Configurer le Frontend
```bash
cd sunulek-web

# Installer les dépendances
npm install

# Configurer l'API
# Éditer src/lib/constants.ts avec l'URL de votre API

# Lancer en développement
npm run dev
```

### 4. Accéder à l'application
- **Frontend** : http://localhost:3000
- **API** : http://localhost:8000/api/v1/
- **Admin Django** : http://localhost:8000/admin/

## 📚 Documentation

Une documentation détaillée est disponible dans le dossier `docs/` :

| Document | Description |
|----------|-------------|
| [DOCUMENTATION_BACKEND.md](docs/DOCUMENTATION_BACKEND.md) | Documentation complète du backend Django |
| [DOCUMENTATION_FRONTEND.md](docs/DOCUMENTATION_FRONTEND.md) | Documentation complète du frontend React |

### Contenu de la documentation
- Architecture et diagrammes
- Structure des fichiers
- Modèles de données (ERD)
- Endpoints API détaillés
- Hooks et composants
- Guide d'installation
- Problèmes résolus

## 📂 Structure du projet

```
SunuLek-main/
├── sunulek-api/          # Backend Django
│   ├── config/           # Configuration Django
│   ├── apps/             # Applications Django
│   │   ├── users/        # Authentification
│   │   ├── annonces/     # Gestion des annonces
│   │   ├── categories/   # Catégories
│   │   ├── messages/     # Messagerie
│   │   └── favorites/    # Favoris
│   ├── media/            # Fichiers uploadés
│   └── requirements.txt
│
├── sunulek-web/          # Frontend React
│   ├── src/
│   │   ├── components/   # Composants réutilisables
│   │   ├── pages/        # Pages/vues
│   │   ├── hooks/        # Hooks personnalisés
│   │   ├── stores/       # State management
│   │   ├── lib/          # Utilitaires
│   │   └── types/        # Types TypeScript
│   └── package.json
│
└── docs/                 # Documentation
    ├── DOCUMENTATION_BACKEND.md
    └── DOCUMENTATION_FRONTEND.md
```

## 🔐 API Endpoints principaux

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/auth/register/` | POST | Inscription |
| `/auth/login/` | POST | Connexion |
| `/auth/profile/` | GET/PATCH | Profil utilisateur |
| `/annonces/` | GET/POST | Liste/Création d'annonces |
| `/annonces/{slug}/` | GET/PUT/DELETE | Détail/Modification/Suppression |
| `/annonces/my_ads/` | GET | Mes annonces |
| `/categories/` | GET | Liste des catégories |
| `/favorites/` | GET/POST | Gestion des favoris |
| `/conversations/` | GET | Liste des conversations |
| `/conversations/start/` | POST | Démarrer une conversation |

## 🤝 Contribuer

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Équipe

Développé par Dguenole

---

**Version :** 1.0.0  
**Dernière mise à jour :** Février 2026
