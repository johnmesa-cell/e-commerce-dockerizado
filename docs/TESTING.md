# 🧪 Guía de Testing - E-commerce

## 📋 Tipos de Pruebas

### 1. Pruebas de Conectividad
- Verifican que todos los servicios estén accesibles
- Validan comunicación entre contenedores

### 2. Pruebas de Base de Datos
- Conexión a MySQL Primary y Replica
- Estado de replicación
- Lag de replicación

### 3. Pruebas de Separación R/W
- GET usa base de datos Replica
- POST/PUT/DELETE usan base Primary
- Verificación en logs del backend

### 4. Pruebas de Resiliencia
- Comportamiento con réplica caída
- Comportamiento con primaria caída
- Manejo de errores

---

## 🚀 Ejecutar Pruebas

### Suite completa automatizada

