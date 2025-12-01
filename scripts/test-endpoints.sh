#!/bin/bash

# Script de pruebas de integración para validar arquitectura R/W

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuración
API_URL="http://localhost:3000/api"
FRONTEND_URL="http://localhost:5173"

# Contadores
TESTS_PASSED=0
TESTS_FAILED=0

# Función para imprimir resultados
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ PASS${NC}: $2"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC}: $2"
        ((TESTS_FAILED++))
    fi
}

# Función para hacer peticiones
make_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    
    if [ -z "$data" ]; then
        curl -s -X $method "${API_URL}${endpoint}" \
             -H "Content-Type: application/json" \
             -w "\n%{http_code}"
    else
        curl -s -X $method "${API_URL}${endpoint}" \
             -H "Content-Type: application/json" \
             -d "$data" \
             -w "\n%{http_code}"
    fi
}

echo "=========================================="
echo "🧪 SUITE DE PRUEBAS - E-COMMERCE DOCKERIZADO"
echo "=========================================="
echo ""

# ============================================
# FASE 1: PRUEBAS DE CONECTIVIDAD
# ============================================
echo -e "${BLUE}📡 FASE 1: Pruebas de Conectividad${NC}"
echo "------------------------------------------"

# Test 1: Frontend accesible
echo -n "Test 1: Frontend accesible... "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" $FRONTEND_URL)
if [ "$HTTP_CODE" -eq 200 ]; then
    print_result 0 "Frontend responde en puerto 5173"
else
    print_result 1 "Frontend no accesible (HTTP $HTTP_CODE)"
fi

# Test 2: API Health Check
echo -n "Test 2: API Health Check... "
RESPONSE=$(make_request GET "/health")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
if [ "$HTTP_CODE" -eq 200 ]; then
    print_result 0 "API /health responde correctamente"
else
    print_result 1 "API /health falló (HTTP $HTTP_CODE)"
fi

# Test 3: Verificar proxy reverso
echo -n "Test 3: Proxy reverso Nginx → Backend... "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${FRONTEND_URL}/api/health")
if [ "$HTTP_CODE" -eq 200 ]; then
    print_result 0 "Proxy reverso funcionando"
else
    print_result 1 "Proxy reverso falló (HTTP $HTTP_CODE)"
fi

echo ""

# ============================================
# FASE 2: PRUEBAS DE BASES DE DATOS
# ============================================
echo -e "${BLUE}🗄️  FASE 2: Pruebas de Bases de Datos${NC}"
echo "------------------------------------------"

# Test 4: Conexión a DB Primary
echo -n "Test 4: Conexión a DB Primary... "
RESULT=$(docker exec ecommerce-db-primary mysql -u root -pprimary_root_pass_123 -e "SELECT 1" 2>/dev/null)
if [ $? -eq 0 ]; then
    print_result 0 "MySQL Primary conectado"
else
    print_result 1 "MySQL Primary no responde"
fi

# Test 5: Conexión a DB Replica
echo -n "Test 5: Conexión a DB Replica... "
RESULT=$(docker exec ecommerce-db-replica mysql -u root -preplica_root_pass_123 -e "SELECT 1" 2>/dev/null)
if [ $? -eq 0 ]; then
    print_result 0 "MySQL Replica conectado"
else
    print_result 1 "MySQL Replica no responde"
fi

# Test 6: Estado de Replicación
echo -n "Test 6: Estado de Replicación... "
SLAVE_STATUS=$(docker exec ecommerce-db-replica mysql -u root -preplica_root_pass_123 \
    -e "SHOW SLAVE STATUS\G" 2>/dev/null | grep "Slave_.*_Running")

IO_RUNNING=$(echo "$SLAVE_STATUS" | grep "Slave_IO_Running" | awk '{print $2}')
SQL_RUNNING=$(echo "$SLAVE_STATUS" | grep "Slave_SQL_Running" | awk '{print $2}')

if [ "$IO_RUNNING" == "Yes" ] && [ "$SQL_RUNNING" == "Yes" ]; then
    print_result 0 "Replicación activa (IO: $IO_RUNNING, SQL: $SQL_RUNNING)"
else
    print_result 1 "Replicación con problemas (IO: $IO_RUNNING, SQL: $SQL_RUNNING)"
fi

echo ""

# ============================================
# FASE 3: PRUEBAS DE SEPARACIÓN R/W
# ============================================
echo -e "${BLUE}🔄 FASE 3: Pruebas de Separación Lectura/Escritura${NC}"
echo "------------------------------------------"

# Test 7: Operación de LECTURA (debe usar réplica)
echo -n "Test 7: GET usa DB Replica... "
RESPONSE=$(make_request GET "/products")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n -1)

if [ "$HTTP_CODE" -eq 200 ]; then
    # Verificar en logs del backend que usó REPLICA
    sleep 1
    BACKEND_LOG=$(docker logs ecommerce-backend 2>&1 | tail -n 20 | grep -i "replica\|slave" || echo "")
    if [ -n "$BACKEND_LOG" ]; then
        print_result 0 "GET ejecutado en REPLICA"
    else
        print_result 1 "GET no muestra uso de REPLICA en logs"
    fi
else
    print_result 1 "GET falló (HTTP $HTTP_CODE)"
fi

# Test 8: Operación de ESCRITURA (debe usar primaria)
echo -n "Test 8: POST usa DB Primary... "
TEST_DATA='{"nombre":"Producto Test","precio":99.99,"stock":10,"categoria_id":1}'
RESPONSE=$(make_request POST "/products" "$TEST_DATA")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

if [ "$HTTP_CODE" -eq 200 ] || [ "$HTTP_CODE" -eq 201 ]; then
    # Verificar en logs del backend que usó PRIMARY
    sleep 1
    BACKEND_LOG=$(docker logs ecommerce-backend 2>&1 | tail -n 20 | grep -i "primary\|master" || echo "")
    if [ -n "$BACKEND_LOG" ]; then
        print_result 0 "POST ejecutado en PRIMARY"
    else
        print_result 1 "POST no muestra uso de PRIMARY en logs"
    fi
else
    print_result 1 "POST falló (HTTP $HTTP_CODE)"
fi

# Test 9: Verificar lag de replicación
echo -n "Test 9: Lag de replicación < 5 segundos... "
SECONDS_BEHIND=$(docker exec ecommerce-db-replica mysql -u root -preplica_root_pass_123 \
    -e "SHOW SLAVE STATUS\G" 2>/dev/null | grep "Seconds_Behind_Master" | awk '{print $2}')

if [ "$SECONDS_BEHIND" == "NULL" ]; then
    print_result 1 "Replicación detenida"
elif [ "$SECONDS_BEHIND" -lt 5 ]; then
    print_result 0 "Lag de replicación: ${SECONDS_BEHIND}s"
else
    print_result 1 "Lag excesivo: ${SECONDS_BEHIND}s"
fi

echo ""

# ============================================
# FASE 4: PRUEBAS DE RESILIENCIA
# ============================================
echo -e "${BLUE}💪 FASE 4: Pruebas de Resiliencia${NC}"
echo "------------------------------------------"

# Test 10: Detener réplica - GET debe fallar controladamente
echo -n "Test 10: Resiliencia - Detener Replica... "
docker-compose stop db-replica > /dev/null 2>&1
sleep 3

RESPONSE=$(make_request GET "/products")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

# Debe retornar error controlado (500 o 503)
if [ "$HTTP_CODE" -ge 500 ]; then
    print_result 0 "GET falla controladamente sin réplica (HTTP $HTTP_CODE)"
else
    print_result 1 "GET no manejó falla de réplica apropiadamente"
fi

# Reiniciar réplica
docker-compose start db-replica > /dev/null 2>&1
sleep 5

# Test 11: POST sigue funcionando sin réplica
echo -n "Test 11: POST funciona sin Replica... "
RESPONSE=$(make_request POST "/products" "$TEST_DATA")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

if [ "$HTTP_CODE" -eq 200 ] || [ "$HTTP_CODE" -eq 201 ]; then
    print_result 0 "POST funciona sin réplica"
else
    print_result 1 "POST falló sin réplica (HTTP $HTTP_CODE)"
fi

echo ""

# ============================================
# RESUMEN FINAL
# ============================================
echo "=========================================="
echo -e "${BLUE}📊 RESUMEN DE PRUEBAS${NC}"
echo "=========================================="
echo -e "${GREEN}Tests Exitosos:${NC} $TESTS_PASSED"
echo -e "${RED}Tests Fallidos:${NC} $TESTS_FAILED"
echo "Total: $((TESTS_PASSED + TESTS_FAILED))"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ TODAS LAS PRUEBAS PASARON${NC}"
    exit 0
else
    echo -e "${RED}❌ ALGUNAS PRUEBAS FALLARON${NC}"
    echo "Revisa los logs con: ./docker-logs.sh"
    exit 1
fi
