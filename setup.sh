#!/bin/bash

echo "🏥 Healthcare Management App Setup"
echo "=================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "✅ Docker is running"

# Check if ports are available
echo "🔍 Checking port availability..."

check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "❌ Port $1 is already in use"
        return 1
    else
        echo "✅ Port $1 is available"
        return 0
    fi
}

check_port 3000
check_port 5000
check_port 5432
check_port 6379
check_port 9092

echo ""
echo "🚀 Starting services..."
echo "This may take a few minutes on first run..."

# Build and start services
docker-compose up --build -d

echo ""
echo "⏳ Waiting for services to start..."
sleep 10

# Check service status
echo ""
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "🌐 Access URLs:"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:5000"
echo ""
echo "📝 Logs:"
echo "docker-compose logs -f [service_name]"
echo ""
echo "🛑 Stop services:"
echo "docker-compose down"
