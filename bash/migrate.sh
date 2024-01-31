#!/bin/sh

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
echo "Waiting for container finishing..."
migrateContainerExited
until [ $? -eq 1 ]; do
  >&2 echo "Container hasn't finished - sleeping"
  sleep 1
  migrateContainerExited
done
echo

sleep 1
echo "Container has finished - logs:"
docker logs prisma_migrate | sed 's/^/==> /'
echo

echo "Container is up - executing command"
echo "Waiting for containers deletion..."
docker compose -f docker-compose.migrate.yml down --remove-orphans
echo

echo "Container is deleted - script finished"