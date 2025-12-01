#!/bin/bash
# mysql-slave/init/setup-slave.sh

set -e

echo "==== Configurando Slave automáticamente ===="

# Esperar a que el master esté completamente listo
echo "Esperando al master..."
sleep 30

# Variables con nombres correctos
MASTER_HOST="${MASTER_HOST:-db-primary}"
MASTER_USER="${MASTER_USER:-replicator}"
MASTER_PASSWORD="${MASTER_PASSWORD:-replicator_password_123}"

# Esperar a que MySQL Slave esté listo
until mysql -uroot -p"$MYSQL_ROOT_PASSWORD" -e "SELECT 1;" &> /dev/null; do
    echo "Esperando MySQL Slave..."
    sleep 3
done

echo "== Obteniendo archivo de log y posición del master =="
FILE=$(mysql -h $MASTER_HOST -u$MASTER_USER -p$MASTER_PASSWORD -e "SHOW MASTER STATUS\G" | grep File | awk '{print $2}')
POSITION=$(mysql -h $MASTER_HOST -u$MASTER_USER -p$MASTER_PASSWORD -e "SHOW MASTER STATUS\G" | grep Position | awk '{print $2}')

echo "== Iniciando replicación con archivo: $FILE | posición: $POSITION =="

mysql -uroot -p"$MYSQL_ROOT_PASSWORD" <<EOF
STOP SLAVE;
CHANGE MASTER TO
  MASTER_HOST='$MASTER_HOST',
  MASTER_USER='$MASTER_USER',
  MASTER_PASSWORD='$MASTER_PASSWORD',
  MASTER_LOG_FILE='$FILE',
  MASTER_LOG_POS=$POSITION;
START SLAVE;
EOF

# Verificar estado
mysql -uroot -p"$MYSQL_ROOT_PASSWORD" -e "SHOW SLAVE STATUS\G"

echo "Replicación configurada correctamente ✔️"
