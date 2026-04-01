#!/bin/bash

# BTCnews.co.za - Simple Deployment Script (No Docker Build Locally)
# This script transfers source code and builds on the server

set -e  # Exit on any error

echo "🚀 BTCnews.co.za Simple Deployment Script"
echo "========================================"

# Configuration
SERVER_IP="146.190.16.77"
SERVER_USER="root"
LOCAL_PROJECT_DIR="$(pwd)"
SERVER_PROJECT_DIR="/home/btcnews.co.za"

echo "📁 Step 1: Creating deployment package..."
# Create a temporary deployment directory
rm -rf deploy-package
mkdir -p deploy-package

# Copy all source files except node_modules and build artifacts
rsync -av --exclude='node_modules' --exclude='.next' --exclude='data' --exclude='*.log' --exclude='.git' ./ deploy-package/

# Copy deployment scripts
cp deploy-server-simple.sh deploy-package/

echo "🔄 Step 2: Transferring files to server..."
# Create directory on server
ssh ${SERVER_USER}@${SERVER_IP} "mkdir -p ${SERVER_PROJECT_DIR}"

# Transfer deployment package
scp -r deploy-package/* ${SERVER_USER}@${SERVER_IP}:${SERVER_PROJECT_DIR}/

echo "🔧 Step 3: Building and deploying on server..."
ssh ${SERVER_USER}@${SERVER_IP} "cd ${SERVER_PROJECT_DIR} && chmod +x deploy-server-simple.sh && ./deploy-server-simple.sh"

echo "🧹 Step 4: Cleaning up local files..."
rm -rf deploy-package

echo ""
echo "✅ Deployment Complete!"
echo "🌐 Your Bitcoin dashboard is now running at: http://www.btcnews.co.za"
echo "🌐 Also available at: http://167.172.47.100"
echo "🔐 Admin dashboard: http://www.btcnews.co.za/admin"
echo "🔑 Admin password: Platinum@0181"
echo ""
echo "📊 To check status: ssh ${SERVER_USER}@${SERVER_IP} 'cd ${SERVER_PROJECT_DIR} && pm2 status'"
echo "📝 To view logs: ssh ${SERVER_USER}@${SERVER_IP} 'cd ${SERVER_PROJECT_DIR} && pm2 logs btcnews'"
echo "🌐 To check Nginx: ssh ${SERVER_USER}@${SERVER_IP} 'systemctl status nginx'"
