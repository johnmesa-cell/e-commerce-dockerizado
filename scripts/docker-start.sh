#!/bin/bash
# scripts/docker-start.sh

echo "🚀 Iniciando todos los servicios del e-commerce..."

# Verificar si existe archivo .env
if [ ! -f .env ]; then
    echo "⚠️  Archivo .env no encontrado. Copiando .env.example..."
    cp .env.example .env
    echo "✅ Archivo .env creado. Por favor, revisa las variables antes de continuar."
    exit 1
fi

# Detectar comando docker-compose correcto
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
elif docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    echo "❌ Docker Compose no está instalado"
    exit 1
fi

# Iniciar servicios
$DOCKER_COMPOSE up -d --build

echo ""
echo "⏳ Esperando a que los servicios estén listos..."
sleep 10

# Mostrar estado
$DOCKER_COMPOSE ps

echo ""
echo "✅ Servicios iniciados correctamente"
echo ""
echo "📊 URLs de acceso:"
echo "   - Frontend: http://localhost:5173"
echo "   - Backend API: http://localhost:3000/api"
echo "   - Health Check: http://localhost:3000/api/health"
echo ""
echo "📝 Comandos útiles:"
echo "   - Ver logs: ./scripts/docker-logs.sh"
echo "   - Detener: ./scripts/docker-stop.sh"
echo "   - Verificar replicación: ./scripts/check-replication.sh"
