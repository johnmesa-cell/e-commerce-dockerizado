FROM mysql:8.0

COPY my.cnf /etc/mysql/conf.d/my.cnf
COPY init/setup-slave.sh /docker-entrypoint-initdb.d/01-setup-slave.sh

RUN chmod +x /docker-entrypoint-initdb.d/*.sh

EXPOSE 3306
