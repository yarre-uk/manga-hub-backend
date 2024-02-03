FROM postgres:16-alpine

RUN apk update && apk add postgresql-contrib

ADD *.sql /docker-entrypoint-initdb.d/
