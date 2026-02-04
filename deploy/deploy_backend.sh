#!/bin/bash

# =============================================================================
# 🚀 Script de déploiement SunuLek Backend sur Kamatera/Ubuntu
# =============================================================================
# Usage: 
#   1. Copier ce script sur le serveur
#   2. chmod +x deploy_backend.sh
#   3. sudo ./deploy_backend.sh
# =============================================================================

set -e  # Arrêter si une commande échoue

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables de configuration - À MODIFIER
APP_NAME="sunulek"
APP_USER="sunulek"
APP_DIR="/home/$APP_USER/sunulek-api"
DOMAIN="api.sunulek.com"  # Ton domaine ou IP du serveur
GIT_REPO="https://github.com/TON_USERNAME/sunulek-api.git"  # À modifier
PYTHON_VERSION="3.11"

# Variables PostgreSQL
DB_NAME="sunulek"
DB_USER="sunulek"
DB_PASSWORD="$(openssl rand -base64 32)"  # Génère un mot de passe sécurisé

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🚀 Déploiement SunuLek Backend${NC}"
echo -e "${GREEN}========================================${NC}"

# =============================================================================
# 1. Mise à jour du système
# =============================================================================
echo -e "${YELLOW}📦 Mise à jour du système...${NC}"
apt update && apt upgrade -y

# =============================================================================
# 2. Installation des dépendances
# =============================================================================
echo -e "${YELLOW}📦 Installation des dépendances...${NC}"
apt install -y \
    python${PYTHON_VERSION} \
    python${PYTHON_VERSION}-venv \
    python${PYTHON_VERSION}-dev \
    python3-pip \
    postgresql \
    postgresql-contrib \
    libpq-dev \
    nginx \
    supervisor \
    git \
    curl \
    certbot \
    python3-certbot-nginx \
    build-essential \
    libffi-dev \
    libssl-dev

# =============================================================================
# 3. Créer l'utilisateur de l'application
# =============================================================================
echo -e "${YELLOW}👤 Création de l'utilisateur ${APP_USER}...${NC}"
if ! id "$APP_USER" &>/dev/null; then
    useradd -m -s /bin/bash $APP_USER
    echo -e "${GREEN}✓ Utilisateur $APP_USER créé${NC}"
else
    echo -e "${GREEN}✓ Utilisateur $APP_USER existe déjà${NC}"
fi

# =============================================================================
# 4. Configuration PostgreSQL
# =============================================================================
echo -e "${YELLOW}🐘 Configuration PostgreSQL...${NC}"
sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';" 2>/dev/null || true
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;" 2>/dev/null || true
sudo -u postgres psql -c "ALTER USER $DB_USER CREATEDB;" 2>/dev/null || true
echo -e "${GREEN}✓ Base de données créée${NC}"

# Sauvegarder les credentials
echo -e "${YELLOW}💾 Sauvegarde des credentials...${NC}"
cat > /root/.sunulek_db_credentials << EOF
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
EOF
chmod 600 /root/.sunulek_db_credentials
echo -e "${GREEN}✓ Credentials sauvegardés dans /root/.sunulek_db_credentials${NC}"

# =============================================================================
# 5. Cloner le projet
# =============================================================================
echo -e "${YELLOW}📥 Clonage du projet...${NC}"
if [ -d "$APP_DIR" ]; then
    echo -e "${YELLOW}Le dossier existe, mise à jour...${NC}"
    cd $APP_DIR
    sudo -u $APP_USER git pull origin main
else
    sudo -u $APP_USER git clone $GIT_REPO $APP_DIR
fi
cd $APP_DIR

# =============================================================================
# 6. Configuration de l'environnement Python
# =============================================================================
echo -e "${YELLOW}🐍 Configuration de l'environnement Python...${NC}"
sudo -u $APP_USER python${PYTHON_VERSION} -m venv venv
sudo -u $APP_USER $APP_DIR/venv/bin/pip install --upgrade pip
sudo -u $APP_USER $APP_DIR/venv/bin/pip install -r requirements.txt
sudo -u $APP_USER $APP_DIR/venv/bin/pip install gunicorn

# =============================================================================
# 7. Créer le fichier .env
# =============================================================================
echo -e "${YELLOW}⚙️ Création du fichier .env...${NC}"
SECRET_KEY=$(openssl rand -base64 50 | tr -dc 'a-zA-Z0-9' | head -c 50)

cat > $APP_DIR/.env << EOF
# Django Settings
DEBUG=False
SECRET_KEY=$SECRET_KEY
ALLOWED_HOSTS=$DOMAIN,localhost,127.0.0.1

# Database
DATABASE_URL=postgres://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME

# CORS
CORS_ALLOWED_ORIGINS=https://sunulek.com,https://www.sunulek.com

# Email (configurer avec ton service email)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=ton_email@gmail.com
EMAIL_HOST_PASSWORD=ton_app_password
DEFAULT_FROM_EMAIL=noreply@sunulek.com
EOF

chown $APP_USER:$APP_USER $APP_DIR/.env
chmod 600 $APP_DIR/.env
echo -e "${GREEN}✓ Fichier .env créé${NC}"

# =============================================================================
# 8. Migrations et collectstatic
# =============================================================================
echo -e "${YELLOW}🔄 Exécution des migrations...${NC}"
cd $APP_DIR
sudo -u $APP_USER $APP_DIR/venv/bin/python manage.py migrate --noinput
sudo -u $APP_USER $APP_DIR/venv/bin/python manage.py collectstatic --noinput

# =============================================================================
# 9. Configuration Gunicorn avec Supervisor
# =============================================================================
echo -e "${YELLOW}🦄 Configuration Gunicorn...${NC}"

cat > /etc/supervisor/conf.d/sunulek.conf << EOF
[program:sunulek]
directory=$APP_DIR
command=$APP_DIR/venv/bin/gunicorn config.wsgi:application --workers 3 --bind unix:$APP_DIR/sunulek.sock
user=$APP_USER
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/sunulek/gunicorn.log
stderr_logfile=/var/log/sunulek/gunicorn_error.log
environment=LANG=en_US.UTF-8,LC_ALL=en_US.UTF-8
EOF

# Créer le dossier de logs
mkdir -p /var/log/sunulek
chown -R $APP_USER:$APP_USER /var/log/sunulek

# Recharger Supervisor
supervisorctl reread
supervisorctl update
supervisorctl restart sunulek

echo -e "${GREEN}✓ Gunicorn configuré${NC}"

# =============================================================================
# 10. Configuration Nginx
# =============================================================================
echo -e "${YELLOW}🌐 Configuration Nginx...${NC}"

cat > /etc/nginx/sites-available/sunulek << EOF
server {
    listen 80;
    server_name $DOMAIN;

    # Taille max des uploads (pour les images)
    client_max_body_size 10M;

    # Logs
    access_log /var/log/nginx/sunulek_access.log;
    error_log /var/log/nginx/sunulek_error.log;

    # Fichiers statiques
    location /static/ {
        alias $APP_DIR/staticfiles/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Fichiers media (images des annonces)
    location /media/ {
        alias $APP_DIR/media/;
        expires 7d;
        add_header Cache-Control "public";
    }

    # Proxy vers Gunicorn
    location / {
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_pass http://unix:$APP_DIR/sunulek.sock;
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
    }
}
EOF

# Activer le site
ln -sf /etc/nginx/sites-available/sunulek /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Tester et recharger Nginx
nginx -t && systemctl reload nginx
echo -e "${GREEN}✓ Nginx configuré${NC}"

# =============================================================================
# 11. Configuration du firewall
# =============================================================================
echo -e "${YELLOW}🔥 Configuration du firewall...${NC}"
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
echo -e "${GREEN}✓ Firewall configuré${NC}"

# =============================================================================
# 12. SSL avec Let's Encrypt (optionnel)
# =============================================================================
echo -e "${YELLOW}🔒 Configuration SSL...${NC}"
echo -e "${YELLOW}Pour activer SSL, exécutez :${NC}"
echo -e "   sudo certbot --nginx -d $DOMAIN"

# =============================================================================
# RÉSUMÉ
# =============================================================================
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ DÉPLOIEMENT TERMINÉ !${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "📍 ${YELLOW}Informations importantes :${NC}"
echo -e "   • URL API : http://$DOMAIN"
echo -e "   • Dossier : $APP_DIR"
echo -e "   • Logs : /var/log/sunulek/"
echo ""
echo -e "🔐 ${YELLOW}Credentials PostgreSQL :${NC}"
echo -e "   • Database : $DB_NAME"
echo -e "   • User : $DB_USER"
echo -e "   • Password : (voir /root/.sunulek_db_credentials)"
echo ""
echo -e "📝 ${YELLOW}Commandes utiles :${NC}"
echo -e "   • Redémarrer : sudo supervisorctl restart sunulek"
echo -e "   • Logs live : tail -f /var/log/sunulek/gunicorn.log"
echo -e "   • Status : sudo supervisorctl status sunulek"
echo ""
echo -e "🔒 ${YELLOW}Pour activer HTTPS :${NC}"
echo -e "   sudo certbot --nginx -d $DOMAIN"
echo ""
