-- Usuario de replicación
CREATE USER IF NOT EXISTS 'replicator'@'%' IDENTIFIED WITH mysql_native_password BY 'replicator_password_123';
GRANT REPLICATION SLAVE ON *.* TO 'replicator'@'%';

-- El usuario de aplicación 'ecommerce_user' ya es creado automáticamente 
-- por Docker mediante las variables MYSQL_USER y MYSQL_PASSWORD
-- Solo necesitamos asegurarnos de que tenga los permisos correctos
GRANT ALL PRIVILEGES ON ecommerce.* TO 'ecommerce_user'@'%';

FLUSH PRIVILEGES;