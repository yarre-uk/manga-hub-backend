#!/bin/bash

source .env

if [ -z "$1" ]
then
  echo "No argument supplied"
  exit 1
fi

export DATABASE_URL=$DATABASE_URL_MIGRATE
docker compose -f docker-compose.migrate.yml up -d --build db


until pg_isready -q -h $DB_HOST_MIGRATE -U $POSTGRES_USER; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

yarn prisma migrate dev --name $1 --preview-feature

docker compose -f docker-compose.migrate.yml down