# 🚀 Guide de Déploiement SunuLek Backend sur Kamatera

## 📋 Prérequis

- Un compte Kamatera
- Un nom de domaine (optionnel mais recommandé)
- Accès SSH à ta machine locale

---

## 🖥️ Étape 1 : Créer le serveur Kamatera

### 1.1 Aller sur Kamatera
1. Va sur [console.kamatera.com](https://console.kamatera.com)
2. Clique sur **"Create New Server"**

### 1.2 Configuration recommandée

| Paramètre | Valeur recommandée |
|-----------|-------------------|
| **Zone** | Europe (Amsterdam) ou proche de tes utilisateurs |
| **Image** | Ubuntu Server 22.04 64-bit |
| **Type** | Type A (General Purpose) |
| **CPU** | 2 vCPUs |
| **RAM** | 2 GB |
| **SSD** | 40 GB |
| **Network** | 1 IP publique |

### 1.3 Configurer l'accès
- **Username** : root
- **Password** : Choisis un mot de passe fort ou utilise une clé SSH
- Note l'**IP publique** du serveur

---

## 🔐 Étape 2 : Première connexion

### 2.1 Connexion SSH
```bash
ssh root@<IP_DU_SERVEUR>
```

### 2.2 Mise à jour du système
```bash
apt update && apt upgrade -y
```

---

## 📦 Étape 3 : Installation des dépendances

```bash
# Python et outils de build
apt install -y python3.11 python3.11-venv python3.11-dev python3-pip

# PostgreSQL
apt install -y postgresql postgresql-contrib libpq-dev

# Nginx et Supervisor
apt install -y nginx supervisor

# Outils
apt install -y git curl certbot python3-certbot-nginx
```

---

## 👤 Étape 4 : Créer un utilisateur dédié

```bash
# Créer l'utilisateur
useradd -m -s /bin/bash sunulek

# Se connecter en tant que sunulek
su - sunulek
```

---

## 🐘 Étape 5 : Configurer PostgreSQL

```bash
# En tant que root
sudo -u postgres psql

# Dans le shell PostgreSQL
CREATE USER sunulek WITH PASSWORD 'mot_de_passe_securise';
CREATE DATABASE sunulek OWNER sunulek;
ALTER USER sunulek CREATEDB;
\q
```

---

## 📥 Étape 6 : Cloner le projet

```bash
# En tant que sunulek
su - sunulek
cd ~

# Cloner le repo (remplace par ton URL)
git clone https://github.com/TON_USERNAME/sunulek-api.git
cd sunulek-api
```

---

## 🐍 Étape 7 : Environnement Python

```bash
# Créer l'environnement virtuel
python3.11 -m venv venv

# Activer
source venv/bin/activate

# Installer les dépendances
pip install --upgrade pip
pip install -r requirements.txt
pip install gunicorn
```

---

## ⚙️ Étape 8 : Configuration .env

```bash
# Créer le fichier .env
nano .env
```

Contenu du fichier `.env` :

```env
# Django
DEBUG=False
SECRET_KEY=une_cle_secrete_tres_longue_et_aleatoire
ALLOWED_HOSTS=api.sunulek.com,ton_ip_serveur

# Database
DATABASE_URL=postgres://sunulek:mot_de_passe@localhost:5432/sunulek

# CORS - URLs du frontend
CORS_ALLOWED_ORIGINS=https://sunulek.com,https://www.sunulek.com

# Email (Gmail exemple)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=ton_email@gmail.com
EMAIL_HOST_PASSWORD=ton_app_password
DEFAULT_FROM_EMAIL=noreply@sunulek.com
```

---

## 🔄 Étape 9 : Migrations et fichiers statiques

```bash
# Activer l'environnement
source venv/bin/activate

# Migrations
python manage.py migrate

# Fichiers statiques
python manage.py collectstatic --noinput

# Créer un superuser
python manage.py createsuperuser
```

---

## 🦄 Étape 10 : Configurer Gunicorn avec Supervisor

En tant que **root** :

```bash
# Créer le fichier de configuration
nano /etc/supervisor/conf.d/sunulek.conf
```

Contenu :

```ini
[program:sunulek]
directory=/home/sunulek/sunulek-api
command=/home/sunulek/sunulek-api/venv/bin/gunicorn config.wsgi:application --workers 3 --bind unix:/home/sunulek/sunulek-api/sunulek.sock
user=sunulek
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/sunulek/gunicorn.log
stderr_logfile=/var/log/sunulek/gunicorn_error.log
```

```bash
# Créer le dossier de logs
mkdir -p /var/log/sunulek
chown -R sunulek:sunulek /var/log/sunulek

# Démarrer
supervisorctl reread
supervisorctl update
supervisorctl start sunulek
```

---

## 🌐 Étape 11 : Configurer Nginx

```bash
# Créer la config
nano /etc/nginx/sites-available/sunulek
```

Contenu :

```nginx
server {
    listen 80;
    server_name api.sunulek.com;  # Ou ton IP

    client_max_body_size 10M;

    location /static/ {
        alias /home/sunulek/sunulek-api/staticfiles/;
    }

    location /media/ {
        alias /home/sunulek/sunulek-api/media/;
    }

    location / {
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_pass http://unix:/home/sunulek/sunulek-api/sunulek.sock;
    }
}
```

```bash
# Activer le site
ln -s /etc/nginx/sites-available/sunulek /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default

# Tester et redémarrer
nginx -t
systemctl restart nginx
```

---

## 🔒 Étape 12 : SSL avec Let's Encrypt

```bash
# Installer le certificat SSL
certbot --nginx -d api.sunulek.com

# Renouvellement automatique (déjà configuré)
certbot renew --dry-run
```

---

## 🔥 Étape 13 : Configurer le Firewall

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

---

## ✅ Vérification

```bash
# Status de Gunicorn
supervisorctl status sunulek

# Logs en temps réel
tail -f /var/log/sunulek/gunicorn.log

# Tester l'API
curl http://localhost/api/v1/categories/
```

---

## 🔄 Mise à jour du code

Pour mettre à jour le backend après des modifications :

```bash
cd /home/sunulek/sunulek-api
su - sunulek
git pull origin main
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
exit
supervisorctl restart sunulek
```

Ou utilise le script `update_backend.sh` fourni.

---

## 📝 Commandes utiles

| Commande | Description |
|----------|-------------|
| `supervisorctl status sunulek` | État du serveur |
| `supervisorctl restart sunulek` | Redémarrer |
| `supervisorctl stop sunulek` | Arrêter |
| `tail -f /var/log/sunulek/gunicorn.log` | Logs live |
| `tail -f /var/log/nginx/sunulek_error.log` | Logs Nginx |
| `systemctl restart nginx` | Redémarrer Nginx |

---

## 🐛 Dépannage

### Erreur 502 Bad Gateway
```bash
# Vérifier que Gunicorn tourne
supervisorctl status sunulek

# Vérifier les permissions du socket
ls -la /home/sunulek/sunulek-api/sunulek.sock
```

### Erreur de connexion à la base de données
```bash
# Tester la connexion
sudo -u postgres psql -c "\l"

# Vérifier le mot de passe dans .env
```

### Fichiers statiques non chargés
```bash
# Recollectstatic
su - sunulek
cd sunulek-api
source venv/bin/activate
python manage.py collectstatic --noinput
```

---

## 🎉 C'est fait !

Ton API est maintenant accessible sur :
- **HTTP** : http://api.sunulek.com
- **HTTPS** : https://api.sunulek.com (après SSL)

N'oublie pas de mettre à jour l'URL de l'API dans ton frontend !
