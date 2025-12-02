-- Usuario de replicación
CREATE USER IF NOT EXISTS 'replicator'@'%' IDENTIFIED BY 'replicator_password_123';
GRANT REPLICATION SLAVE ON *.* TO 'replicator'@'%';
FLUSH PRIVILEGES;
