#!/bin/bash
set -e

echo "🔄 Attente de la base de données..."
while ! nc -z db 5432; do
  sleep 1
done
echo "✅ Base de données prête!"

echo "🔄 Exécution des migrations..."
python manage.py migrate --noinput

echo "📁 Collecte des fichiers statiques..."
python manage.py collectstatic --noinput

echo "🚀 Démarrage de Gunicorn..."
exec gunicorn config.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 3 \
    --threads 2 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile -
