#!/bin/bash

# BTCnews.co.za - Simple Server Deployment Script
# This script runs ON THE SERVER to build and run the app with PM2

set -e  # Exit on any error

echo "🖥️  BTCnews.co.za Simple Server Deployment"
echo "========================================="

# Update system
echo "📦 Updating system packages..."
apt-get update

# Install Node.js if not present
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js 18..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
fi

# Install PM2 if not present
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    npm install -g pm2
fi

# Install and configure Nginx
if ! command -v nginx &> /dev/null; then
    echo "📦 Installing Nginx..."
    apt-get install -y nginx
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create data directory
mkdir -p data

# Build the application
echo "🔨 Building application..."
npm run build

# Stop existing PM2 process if running
echo "🛑 Stopping existing application..."
pm2 stop btcnews || true
pm2 delete btcnews || true

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'btcnews',
    script: 'npm',
    args: 'start',
    cwd: '/home/btcnews.co.za',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001,
      ADMIN_PASSWORD: 'Platinum@0181',
      NEXT_PUBLIC_GA_ID: 'GA_MEASUREMENT_ID',
      DATABASE_URL: './data/bitcoin.db',
      COINGECKO_API_URL: 'https://api.coingecko.com/api/v3',
      BINANCE_API_URL: 'https://api.binance.com/api/v3',
      NEXT_PUBLIC_APP_URL: 'http://146.190.16.77:3001',
      NEXTAUTH_URL: 'http://146.190.16.77:3001'
    }
  }]
};
EOF

# Start the application with PM2
echo "🚀 Starting BTCnews.co.za application..."
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup systemd -u root --hp /root || true

# Configure Nginx reverse proxy
# Configure Nginx
echo "🌐 Configuring Nginx..."

# Check if SSL certs already exist
CERT_PATH="/etc/letsencrypt/live/btcnews.co.za/fullchain.pem"
KEY_PATH="/etc/letsencrypt/live/btcnews.co.za/privkey.pem"

if [ -f "$CERT_PATH" ] && [ -f "$KEY_PATH" ]; then
    echo "🔒 SSL certificates detected. Generating HTTPS configuration..."
    cat > /etc/nginx/sites-available/btcnews << EOF
server {
    listen 80;
    server_name www.btcnews.co.za btcnews.co.za 146.190.16.77;
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name www.btcnews.co.za btcnews.co.za;

    ssl_certificate $CERT_PATH;
    ssl_certificate_key $KEY_PATH;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        proxy_pass http://localhost:3001;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF
else
    echo "⚠️  No SSL certificates found. Generating HTTP configuration..."
    cat > /etc/nginx/sites-available/btcnews << EOF
server {
    listen 80;
    server_name www.btcnews.co.za btcnews.co.za 146.190.16.77;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        proxy_pass http://localhost:3001;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF
fi

# Enable the site
ln -sf /etc/nginx/sites-available/btcnews /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Restart Nginx
systemctl restart nginx
systemctl enable nginx

echo "⏳ Waiting for application to start..."
sleep 5

# Check if application is running
if curl -f http://localhost:3001 >/dev/null 2>&1; then
    echo "✅ Application is running successfully!"
else
    echo "❌ Application health check failed. Checking logs..."
    pm2 logs btcnews --lines 20
    exit 1
fi

echo ""
echo "🎉 BTCnews.co.za is now live!"
echo "🌐 Website: http://www.btcnews.co.za"
echo "🌐 Also available: http://146.190.16.77"
echo "🔐 Admin: http://www.btcnews.co.za/admin"
echo ""
echo "📊 Useful commands:"
echo "  View logs: pm2 logs btcnews"
echo "  Restart: pm2 restart btcnews"
echo "  Stop: pm2 stop btcnews"
echo "  Status: pm2 status"
echo "  Nginx status: systemctl status nginx"
echo "  Nginx reload: systemctl reload nginx"
