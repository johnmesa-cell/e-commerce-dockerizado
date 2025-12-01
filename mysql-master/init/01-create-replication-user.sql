-- Usuario de replicación
CREATE USER 'replicator'@'%' IDENTIFIED WITH mysql_native_password BY 'replicator_password_123';
GRANT REPLICATION SLAVE ON *.* TO 'replicator'@'%';

-- Usuario de aplicación (FALTA COMPLETAMENTE)
CREATE USER 'ecommerce_user'@'%' IDENTIFIED WITH mysql_native_password BY 'ecommerce_password_123';
GRANT ALL PRIVILEGES ON ecommerce.* TO 'ecommerce_user'@'%';

FLUSH PRIVILEGES;
