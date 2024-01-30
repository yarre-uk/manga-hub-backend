FROM postgres:16

RUN apt-get clean
RUN apt-get update
RUN apt-get install -y postgresql-contrib

ADD *.sql /docker-entrypoint-initdb.d/
