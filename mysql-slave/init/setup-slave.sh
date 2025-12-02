#!/bin/bash
set -e

echo "==== Configurando réplica automáticamente ===="

MASTER_HOST="${MASTER_HOST:-db-primary}"
MASTER_USER="${MASTER_USER:-replicator}"
MASTER_PASSWORD="${MASTER_PASSWORD:-replicator_password_123}"

# Esperar a que MySQL de la réplica esté listo
until mysql -uroot -p"$MYSQL_ROOT_PASSWORD" -e "SELECT 1;" &> /dev/null; do
  echo "Esperando MySQL réplica..."
  sleep 3
done

echo "== Obteniendo binlog y posición del master =="
FILE=$(mysql -h "$MASTER_HOST" -u"$MASTER_USER" -p"$MASTER_PASSWORD" -e "SHOW MASTER STATUS\G" | grep File | awk '{print $2}')
POSITION=$(mysql -h "$MASTER_HOST" -u"$MASTER_USER" -p"$MASTER_PASSWORD" -e "SHOW MASTER STATUS\G" | grep Position | awk '{print $2}')

echo "Master file: $FILE, position: $POSITION"

echo "== Configurando REPLICATION SOURCE en la réplica =="

mysql -uroot -p"$MYSQL_ROOT_PASSWORD" <<EOF
STOP REPLICA;
RESET REPLICA ALL;

CHANGE REPLICATION SOURCE TO
  SOURCE_HOST='$MASTER_HOST',
  SOURCE_PORT=3306,
  SOURCE_USER='$MASTER_USER',
  SOURCE_PASSWORD='$MASTER_PASSWORD',
  SOURCE_LOG_FILE='$FILE',
  SOURCE_LOG_POS=$POSITION;

START REPLICA;

-- Opcional: dejar la réplica en solo lectura
SET GLOBAL read_only = 1;
SET GLOBAL super_read_only = 1;
EOF

echo "== Estado de la réplica (resumen) =="
mysql -uroot -p"$MYSQL_ROOT_PASSWORD" -e "SHOW REPLICA STATUS\G" | egrep 'Replica_IO_Running|Replica_SQL_Running|Seconds_Behind_Source' || \
mysql -uroot -p"$MYSQL_ROOT_PASSWORD" -e "SHOW SLAVE STATUS\G" | egrep 'Slave_IO_Running|Slave_SQL_Running|Seconds_Behind_Master'

echo "==== Réplica configurada automáticamente ✔️ ===="
