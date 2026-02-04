# Dockerfile pour SunuLek Backend
FROM python:3.11-slim

# Variables d'environnement
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Répertoire de travail
WORKDIR /app

# Installer les dépendances système
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    netcat-traditional \
    && rm -rf /var/lib/apt/lists/*

# Copier les requirements
COPY requirements.txt .

# Installer les dépendances Python
RUN pip install --upgrade pip && \
    pip install -r requirements.txt && \
    pip install gunicorn

# Copier le code
COPY . .

# Créer le dossier pour les fichiers statiques et media
RUN mkdir -p /app/staticfiles /app/media

# Exposer le port
EXPOSE 8000

# Script de démarrage
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
