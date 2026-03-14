#!/bin/bash
# Start a Postgres test container, export env vars, run pytest, then clean up.

set -e

# Find a free port
FREE_PORT=$(comm -23 <(seq 20000 25000 | sort) <(ss -Htan | awk '{print $4}' | grep -oE '[0-9]+$' | sort -u) | shuf | head -n 1)

# Start the container and capture env vars
CONTAINER_ID=$(docker run -d -e POSTGRES_DB=test -e POSTGRES_USER=test -e POSTGRES_PASSWORD=test -p $FREE_PORT:5432 postgres:15.3)

# Wait for Postgres to be ready
until docker exec $CONTAINER_ID pg_isready -U test > /dev/null 2>&1; do
  sleep 1
done

export POSTGRES_DB=test
export POSTGRES_USER=test
export POSTGRES_PASSWORD=test
export POSTGRES_HOST=localhost
export POSTGRES_PORT=$FREE_PORT
export POSTGRES_SSLMODE=disable
export DJANGO_SETTINGS_MODULE=config.settings

pytest logify-backend

# Stop and remove the container
docker stop $CONTAINER_ID > /dev/null
docker rm $CONTAINER_ID > /dev/null
