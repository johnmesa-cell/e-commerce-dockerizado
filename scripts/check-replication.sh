#!/bin/bash
# scripts/check-replication.sh

echo "=========================================="
echo "📊 Verificando estado de replicación"
echo "=========================================="

# Verificar si el contenedor está corriendo
if ! docker ps | grep -q "ecommerce-db-replica"; then
    echo "❌ El contenedor ecommerce-db-replica no está corriendo"
    exit 1
fi

echo ""
echo "Estado de Replicación:"
echo "----------------------------------------"

docker exec ecommerce-db-replica mysql -u root -preplica_root_pass_123 \
  -e "SHOW SLAVE STATUS\G" 2>/dev/null | egrep 'Slave_IO_Running|Slave_SQL_Running|Seconds_Behind_Master'

echo ""
echo "✅ Si ambos muestran 'Yes' y lag es bajo, la replicación está OK"
echo "=========================================="

