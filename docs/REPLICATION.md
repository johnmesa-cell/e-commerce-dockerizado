# MySQL Master–Slave Replication

## 📌 Arquitectura
El proyecto usa un esquema Master–Slave para garantizar disponibilidad y lectura distribuida.

- **Master (mysql-master):**
  - Escribe datos
  - Genera binary logs

- **Slave (mysql-slave):**
  - Solo lectura
  - Ejecuta relay logs

---

## ✔️ Pasos del proceso de replicación

1. Crear usuario de replicación (automático en `mysql-master/init/01-create-replication-user.sql`)
2. Configurar master con logging binario (`log_bin`)
3. Configurar slave con relay log (`relay_log`)
4. Obtener `MASTER_LOG_FILE` y `MASTER_LOG_POS`
5. Configurar el slave mediante el script `setup-slave.sh`
6. Iniciar replicación con:  


START SLAVE;


---

## 🔍 Verificar replicación

Ejecutar:

```bash
./scripts/check-replication.sh
