#!/bin/sh

migrateContainerExited () {
  RES=$(docker ps -a \
    --filter "status=exited" \
    --filter "name=prisma_add_migration" \
    --format "{{.ID}}\t{{.Names}}");

  if [ -z "$RES"  ]
  then
    return 1
  fi

  return 0
}

if [ -z "$1" ]
then
  echo "No argument supplied"
  exit 1
fi

export MIGRATION_NAME=$1
docker compose -f docker-compose.add-migration.yml up -d --build


if [ $? -eq 1 ]; then
  echo "Error starting container, docker might not be running or the image might not be built. Exiting..."
  exit 1
fi

echo "Waiting for container finishing..."
migrateContainerExited
until [ $? -eq 1 ]; do
  >&2 echo "Container hasn't finished - sleeping"
  sleep 1
  migrateContainerExited
done
echo

sleep 10
echo "Container has finished - logs:"
docker logs prisma_add_migration | sed 's/^/==> /'
echo


echo "Container is up - executing command"
echo "Waiting for containers deletion..."
docker compose -f docker-compose.add-migration.yml down --remove-orphans
echo

echo "Container is deleted - script finished"