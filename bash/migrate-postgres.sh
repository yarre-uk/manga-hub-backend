#!/bin/sh

echo "Waiting for postgres..."

echo $1 $2

until pg_isready -q -h $1 -U $2; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

echo "Postgres is up - executing command"

yarn prisma migrate deploy