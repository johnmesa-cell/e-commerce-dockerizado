#!/bin/bash
# scripts/docker-reset.sh

echo "=========================================="
echo "⚠️  ADVERTENCIA: RESET COMPLETO"
echo "=========================================="
echo ""
echo "Esto eliminará:"
echo "  - Todos los contenedores"
echo "  - Todos los volúmenes (DATOS DE BD)"
echo "  - Todas las imágenes locales del proyecto"
echo "  - Todas las redes"
echo ""
read -p "¿Estás COMPLETAMENTE seguro? (escribe 'SI' para confirmar): " -r
echo

if [[ $REPLY == "SI" ]]; then
    echo "🗑️  Eliminando contenedores, volúmenes, redes e imágenes..."
    
    # Detectar comando docker-compose correcto
    if command -v docker-compose &> /dev/null; then
        DOCKER_COMPOSE="docker-compose"
    elif docker compose version &> /dev/null; then
        DOCKER_COMPOSE="docker compose"
    else
        echo "❌ Docker Compose no está instalado"
        exit 1
    fi
    
    # Detener y eliminar todo
    $DOCKER_COMPOSE down -v --rmi local --remove-orphans
    
    # Limpiar sistema
    docker system prune -f
    
    echo ""
    echo "🧹 Sistema limpio completamente"
    echo ""
    echo "Para reconstruir el proyecto ejecuta:"
    echo "   ./scripts/docker-start.sh"
else
    echo "❌ Operación cancelada"
    exit 0
fi
