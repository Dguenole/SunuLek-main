#!/bin/bash

# =============================================================================
# 🔄 Script de mise à jour SunuLek Backend
# =============================================================================
# Usage: sudo ./update_backend.sh
# =============================================================================

set -e

APP_USER="sunulek"
APP_DIR="/home/$APP_USER/sunulek-api"

echo "🔄 Mise à jour de SunuLek Backend..."

# Aller dans le dossier
cd $APP_DIR

# Pull les derniers changements
echo "📥 Pull des changements..."
sudo -u $APP_USER git pull origin main

# Installer les nouvelles dépendances
echo "📦 Installation des dépendances..."
sudo -u $APP_USER $APP_DIR/venv/bin/pip install -r requirements.txt

# Migrations
echo "🔄 Migrations..."
sudo -u $APP_USER $APP_DIR/venv/bin/python manage.py migrate --noinput

# Collectstatic
echo "📁 Collectstatic..."
sudo -u $APP_USER $APP_DIR/venv/bin/python manage.py collectstatic --noinput

# Redémarrer Gunicorn
echo "🔄 Redémarrage de Gunicorn..."
supervisorctl restart sunulek

echo "✅ Mise à jour terminée !"
