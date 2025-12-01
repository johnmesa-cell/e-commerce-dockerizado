FROM mysql:8.0

COPY my.cnf /etc/mysql/conf.d/my.cnf
COPY init/setup-slave.sh /docker-entrypoint-initdb.d/setup-slave.sh

RUN chmod +x /docker-entrypoint-initdb.d/setup-slave.sh

EXPOSE 3306
