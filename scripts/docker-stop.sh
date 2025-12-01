#!/bin/bash
# scripts/docker-stop.sh

echo "🛑 Deteniendo todos los servicios..."

# Detectar comando docker-compose correcto
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
elif docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    echo "❌ Docker Compose no está instalado"
    exit 1
fi

$DOCKER_COMPOSE down

echo "✅ Todos los servicios han sido detenidos"
echo ""
echo "💡 Para eliminar también los volúmenes (⚠️ borra datos):"
echo "   $DOCKER_COMPOSE down -v"
