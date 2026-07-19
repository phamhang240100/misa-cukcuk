#!/usr/bin/env bash
# init.sh - Start development environment for autonomous agent sessions
# This script ensures the dev server is running and the environment is ready

set -e

echo "Checking development environment..."

# Check if Docker is available
if command -v docker &> /dev/null && docker info &> /dev/null; then
    # Docker available - use docker compose
    if ! docker compose ps | grep -q "Up"; then
        echo "Starting Docker services..."
        docker compose up -d

        echo "Waiting for PostgreSQL..."
        max_attempts=30
        attempt=0
        until docker compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1 || [ $attempt -eq $max_attempts ]; do
            attempt=$((attempt + 1))
            sleep 1
        done
        if [ $attempt -eq $max_attempts ]; then
            echo "PostgreSQL failed to start"
            exit 1
        fi
        echo "PostgreSQL ready"
    fi
else
    # No Docker (e.g. devcontainer) - check database via DATABASE_URL from .env
    echo "Docker not available, checking database connection directly..."

    if [ -f .env ]; then
        DATABASE_URL=$(grep -E '^DATABASE_URL=' .env | cut -d '=' -f2- | tr -d '"')
    fi

    if [ -z "$DATABASE_URL" ]; then
        echo "ERROR: DATABASE_URL not set. Create a .env file with DATABASE_URL."
        exit 1
    fi

    # Parse host and port from DATABASE_URL (postgresql://user:pass@host:port/db)
    DB_HOST=$(echo "$DATABASE_URL" | sed -E 's|.*@([^:]+):.*|\1|')
    DB_PORT=$(echo "$DATABASE_URL" | sed -E 's|.*:([0-9]+)/.*|\1|')
    DB_USER=$(echo "$DATABASE_URL" | sed -E 's|.*://([^:]+):.*|\1|')

    echo "Waiting for PostgreSQL at ${DB_HOST}:${DB_PORT}..."
    max_attempts=30
    attempt=0
    until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" > /dev/null 2>&1 || [ $attempt -eq $max_attempts ]; do
        attempt=$((attempt + 1))
        sleep 1
    done
    if [ $attempt -eq $max_attempts ]; then
        echo "PostgreSQL at ${DB_HOST}:${DB_PORT} is not reachable"
        exit 1
    fi
    echo "PostgreSQL ready at ${DB_HOST}:${DB_PORT}"
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    pnpm install
fi

# Check if Prisma client is generated
if [ ! -d "generated/prisma" ]; then
    echo "Generating Prisma client..."
    pnpm prisma generate
fi

# Check if database is migrated
echo "Checking database..."
pnpm prisma migrate deploy 2>/dev/null || pnpm prisma db push --skip-generate 2>/dev/null || echo "Database already up to date"

# Check if dev server is already running on port 3000
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "Dev server already running on http://localhost:3000"
else
    echo "Starting dev server..."

    # Kill any existing dev processes
    pkill -f "next dev" 2>/dev/null || true

    # Start dev server in background
    pnpm dev > dev-server.log 2>&1 &
    DEV_PID=$!
    echo $DEV_PID > .dev-server.pid

    # Wait for server to be ready (max 60 seconds)
    echo "Waiting for dev server to start..."
    max_attempts=30
    attempt=0
    until [ $attempt -eq $max_attempts ]; do
        attempt=$((attempt + 1))
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null || echo "000")
        if [ "$HTTP_CODE" -ge 200 ] && [ "$HTTP_CODE" -lt 400 ]; then
            break
        fi
        sleep 2
    done
    if [ $attempt -eq $max_attempts ]; then
        echo "Dev server failed to start. Check dev-server.log for errors"
        exit 1
    fi

    echo "Dev server started on http://localhost:3000 (PID: $DEV_PID)"
fi

echo ""
echo "=================================================="
echo "Environment ready!"
echo "=================================================="
echo "App:        http://localhost:3000"
echo "PostgreSQL: localhost:5432"
echo ""
echo "Logs:       tail -f dev-server.log"
echo "Stop:       kill \$(cat .dev-server.pid)"
echo "=================================================="
