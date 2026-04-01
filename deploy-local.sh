#!/bin/bash

# BTCnews.co.za - Local Deployment Script
# This script builds and transfers your Bitcoin dashboard to the server

set -e  # Exit on any error

echo "🚀 BTCnews.co.za Deployment Script"
echo "=================================="

# Configuration
SERVER_IP="146.190.16.77"
SERVER_USER="root"
LOCAL_PROJECT_DIR="$(pwd)"
SERVER_PROJECT_DIR="/home/btcnews.co.za"

echo "📦 Step 1: Building Docker image locally..."
docker build -t btcnews-app .

echo "💾 Step 2: Saving Docker image to tar file..."
docker save btcnews-app:latest | gzip > btcnews-docker-image.tar.gz

echo "📁 Step 3: Creating deployment package..."
# Create a temporary deployment directory
rm -rf deploy-package
mkdir -p deploy-package

# Copy necessary files
cp docker-compose.yml deploy-package/
cp .env.local deploy-package/.env
cp btcnews-docker-image.tar.gz deploy-package/
cp deploy-server.sh deploy-package/

echo "🔄 Step 4: Transferring files to server..."
# Create directory on server
ssh ${SERVER_USER}@${SERVER_IP} "mkdir -p ${SERVER_PROJECT_DIR}"

# Transfer deployment package
scp -r deploy-package/* ${SERVER_USER}@${SERVER_IP}:${SERVER_PROJECT_DIR}/

echo "🐳 Step 5: Deploying on server..."
ssh ${SERVER_USER}@${SERVER_IP} "cd ${SERVER_PROJECT_DIR} && chmod +x deploy-server.sh && ./deploy-server.sh"

echo "🧹 Step 6: Cleaning up local files..."
rm -rf deploy-package
rm btcnews-docker-image.tar.gz

echo ""
echo "✅ Deployment Complete!"
echo "🌐 Your Bitcoin dashboard is now running at: http://167.172.47.100:3001"
echo "🔐 Admin dashboard: http://167.172.47.100:3001/admin"
echo "🔑 Admin password: Platinum@0181"
echo ""
echo "📊 To check status: ssh ${SERVER_USER}@${SERVER_IP} 'cd ${SERVER_PROJECT_DIR} && docker-compose ps'"
echo "📝 To view logs: ssh ${SERVER_USER}@${SERVER_IP} 'cd ${SERVER_PROJECT_DIR} && docker-compose logs -f'"
