#!/bin/bash

migrateContainerExited () {
  RES=$(docker ps -a \
    --filter "status=exited" \
    --filter "name=prisma_migrate" \
    --format "{{.ID}}\t{{.Names}}");

  if [ -z "$RES"  ]
  then
    return 1
  fi

  return 0
}

docker compose -f docker-compose.migrate.yml up -d --build

if [ $? -eq 1 ]; then
  echo "Error starting container, docker might not be running or the image might not be built. Exiting..."
  exit 1
fi

echo "Waiting for container finishing..."
migrateContainerExited
until [ $? -eq 0 ]; do
  >&2 echo "Container hasn't finished - sleeping"
  sleep 1
  migrateContainerExited
done
echo

echo "Container has finished - logs:"
docker logs prisma_migrate | sed 's/^/==> /'
echo

echo "Container is up - executing command"
echo "Waiting for containers deletion..."
docker compose -f docker-compose.migrate.yml down --remove-orphans
echo

echo "Container is deleted - script finished"