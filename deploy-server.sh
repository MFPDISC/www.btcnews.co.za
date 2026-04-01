#!/bin/bash

# BTCnews.co.za - Server Deployment Script
# This script runs ON THE SERVER to deploy the Docker container

set -e  # Exit on any error

echo "🖥️  BTCnews.co.za Server Deployment"
echo "=================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "📦 Installing Docker..."
    apt-get update
    apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "📦 Installing Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

echo "🛑 Stopping existing containers..."
docker-compose down || true

echo "🐳 Loading Docker image..."
if [ -f "btcnews-docker-image.tar.gz" ]; then
    gunzip -c btcnews-docker-image.tar.gz | docker load
    rm btcnews-docker-image.tar.gz
fi

echo "🚀 Starting BTCnews.co.za application..."
docker-compose up -d

echo "⏳ Waiting for application to start..."
sleep 10

echo "🔍 Checking application health..."
if curl -f http://localhost:3001 >/dev/null 2>&1; then
    echo "✅ Application is running successfully!"
else
    echo "❌ Application health check failed. Checking logs..."
    docker-compose logs
    exit 1
fi

echo ""
echo "🎉 BTCnews.co.za is now live!"
echo "🌐 Website: http://167.172.47.100:3001"
echo "🔐 Admin: http://167.172.47.100:3001/admin"
echo ""
echo "📊 Useful commands:"
echo "  View logs: docker-compose logs -f"
echo "  Restart: docker-compose restart"
echo "  Stop: docker-compose down"
echo "  Status: docker-compose ps"
