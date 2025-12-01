#!/bin/bash
# scripts/init-replication.sh

echo "=========================================="
echo "🔄 Inicializando Replicación MySQL"
echo "=========================================="

# Verificar que los contenedores estén corriendo
if ! docker ps | grep -q "ecommerce-db-primary"; then
    echo "❌ El contenedor db-primary no está corriendo"
    echo "   Ejecuta primero: ./scripts/docker-start.sh"
    exit 1
fi

if ! docker ps | grep -q "ecommerce-db-replica"; then
    echo "❌ El contenedor db-replica no está corriendo"
    echo "   Ejecuta primero: ./scripts/docker-start.sh"
    exit 1
fi

echo "✅ Contenedores encontrados"
echo ""

# Obtener variables del .env
if [ -f .env ]; then
    source .env
else
    echo "❌ Archivo .env no encontrado"
    exit 1
fi

echo "📊 Paso 1: Bloqueando tablas en PRIMARY..."
docker exec ecommerce-db-primary mysql -uroot -p"${DB_PRIMARY_ROOT_PASSWORD}" \
    -e "FLUSH TABLES WITH READ LOCK;" 2>/dev/null

echo "📦 Paso 2: Creando dump de la base de datos..."
docker exec ecommerce-db-primary mysqldump -uroot -p"${DB_PRIMARY_ROOT_PASSWORD}" \
    --all-databases --master-data > /tmp/ecommerce_dump.sql 2>/dev/null

echo "📤 Paso 3: Copiando dump al REPLICA..."
docker cp /tmp/ecommerce_dump.sql ecommerce-db-replica:/tmp/dump.sql

echo "📥 Paso 4: Importando dump en REPLICA..."
docker exec -i ecommerce-db-replica mysql -uroot -p"${DB_REPLICA_ROOT_PASSWORD}" \
    < /tmp/ecommerce_dump.sql 2>/dev/null

echo "🔓 Paso 5: Desbloqueando tablas en PRIMARY..."
docker exec ecommerce-db-primary mysql -uroot -p"${DB_PRIMARY_ROOT_PASSWORD}" \
    -e "UNLOCK TABLES;" 2>/dev/null

echo "🔄 Paso 6: Reiniciando replicación en REPLICA..."
docker exec ecommerce-db-replica mysql -uroot -p"${DB_REPLICA_ROOT_PASSWORD}" \
    -e "STOP SLAVE; START SLAVE;" 2>/dev/null

echo ""
echo "=========================================="
echo "✅ Replicación inicializada correctamente"
echo "=========================================="
echo ""
echo "🔍 Verificar estado con:"
echo "   ./scripts/check-replication.sh"

# Limpiar archivo temporal
rm -f /tmp/ecommerce_dump.sql

