@echo off
echo 🏥 Healthcare Management App Setup
echo ==================================

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker and try again.
    pause
    exit /b 1
)

echo ✅ Docker is running

echo.
echo 🚀 Starting services...
echo This may take a few minutes on first run...

REM Build and start services
docker-compose up --build -d

echo.
echo ⏳ Waiting for services to start...
timeout /t 10 /nobreak >nul

REM Check service status
echo.
echo 📊 Service Status:
docker-compose ps

echo.
echo 🌐 Access URLs:
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:5000
echo.
echo 📝 Logs:
echo docker-compose logs -f [service_name]
echo.
echo 🛑 Stop services:
echo docker-compose down

pause
