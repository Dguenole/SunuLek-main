# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY . .

# Arguments de build pour les variables d'environnement
ARG VITE_API_URL
ARG VITE_MEDIA_URL

# Définir les variables d'environnement pour le build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_MEDIA_URL=$VITE_MEDIA_URL

# Build de l'application
RUN npm run build

# Production stage - Nginx pour servir les fichiers statiques
FROM nginx:alpine

# Copier la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers buildés depuis le stage précédent
COPY --from=builder /app/dist /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
