#!/bin/bash

# Script para visualizar logs de todos los servicios

echo "=========================================="
echo "📋 LOGS DE TODOS LOS SERVICIOS"
echo "=========================================="

# Colores para mejor visualización
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar logs de un servicio
show_service_logs() {
    local service=$1
    local color=$2
    local lines=${3:-50}
    
    echo -e "\n${color}==================== $service ====================${NC}"
    docker-compose logs --tail=$lines $service
}

# Menú de opciones
if [ "$1" == "--help" ] || [ "$1" == "-h" ]; then
    echo "Uso: ./docker-logs.sh [opción]"
    echo ""
    echo "Opciones:"
    echo "  all              Ver logs de todos los servicios (por defecto)"
    echo "  frontend         Ver logs solo del frontend"
    echo "  backend          Ver logs solo del backend"
    echo "  db-primary       Ver logs de la base de datos primaria"
    echo "  db-replica       Ver logs de la base de datos réplica"
    echo "  follow           Seguir logs en tiempo real"
    echo "  -h, --help       Mostrar esta ayuda"
    exit 0
fi

case "$1" in
    frontend)
        show_service_logs "frontend" "$GREEN" 100
        ;;
    backend)
        show_service_logs "backend" "$BLUE" 100
        ;;
    db-primary)
        show_service_logs "db-primary" "$YELLOW" 100
        ;;
    db-replica)
        show_service_logs "db-replica" "$RED" 100
        ;;
    follow)
        echo -e "${GREEN}📡 Siguiendo logs en tiempo real (Ctrl+C para salir)...${NC}"
        docker-compose logs -f
        ;;
    all|*)
        show_service_logs "db-primary" "$YELLOW" 30
        show_service_logs "db-replica" "$RED" 30
        show_service_logs "backend" "$BLUE" 30
        show_service_logs "frontend" "$GREEN" 30
        
        echo -e "\n${GREEN}=========================================="
        echo "✅ Para ver más detalles usa:"
        echo "   ./docker-logs.sh [frontend|backend|db-primary|db-replica]"
        echo "   ./docker-logs.sh follow  (para seguir en tiempo real)"
        echo "==========================================${NC}"
        ;;
esac
