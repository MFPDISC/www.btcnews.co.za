#!/bin/bash

# setup-ssl.sh - Set up SSL certificates with Certbot
# Run this script ON THE SERVER as root

set -e

echo "🔒 Setting up SSL certificates..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
  echo "❌ Please run as root"
  exit 1
fi

DOMAINS=("btcnews.co.za" "www.btcnews.co.za")
SERVER_IP=$(curl -s ifconfig.me)  # Get public IP

# Install Certbot and Nginx plugin
echo "📦 Installing Certbot..."
if ! command -v certbot &> /dev/null; then
    apt-get update
    apt-get install -y certbot python3-certbot-nginx
else
    echo "✅ Certbot is already installed"
fi

# DNS Propagation Check
echo "🔍 Checking DNS propagation for all domains..."
echo "Server IP: $SERVER_IP"
ALL_GOOD=true

for domain in "${DOMAINS[@]}"; do
    if host "$domain" | grep -q "$SERVER_IP"; then
        echo "✅ $domain points to $SERVER_IP"
    else
        echo "❌ $domain DOES NOT point to $SERVER_IP"
        # Try to resolve to see what it points to
        DETECTED_IP=$(host "$domain" | grep "has address" | awk '{print $4}')
        if [ -z "$DETECTED_IP" ]; then
             echo "   (Could not resolve IP for $domain)"
        else
             echo "   (Actually points to: $DETECTED_IP)"
        fi
        ALL_GOOD=false
    fi
done

if [ "$ALL_GOOD" = false ]; then
    echo ""
    echo "⚠️  DNS records are not propagating correctly yet."
    echo "Please update your DNS records to point all domains to $SERVER_IP"
    echo "Wait a few minutes (or hours) for changes to propagate before running this script again."
    read -p "Do you want to proceed anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Exiting..."
        exit 1
    fi
fi

# Run Certbot
# This will obtain certificates and configure Nginx automatically
echo "🚀 Running Certbot..."
echo "You will be asked to provide an email address for renewal reminders."

DOMAIN_ARGS=""
for domain in "${DOMAINS[@]}"; do
    DOMAIN_ARGS="$DOMAIN_ARGS -d $domain"
done

certbot --nginx $DOMAIN_ARGS

echo ""
echo "✅ SSL Setup Complete!"
echo "Your sites should now be accessible via HTTPS."
