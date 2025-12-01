FROM mysql:8.0

COPY my.cnf /etc/mysql/conf.d/my.cnf
COPY init/ /docker-entrypoint-initdb.d/

EXPOSE 3306
