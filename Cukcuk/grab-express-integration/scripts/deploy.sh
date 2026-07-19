#!/usr/bin/env bash
set -euo pipefail

NAME=cukcuk
REGISTRY=100.104.168.197:30500
IMAGE=$REGISTRY/$NAME:latest

cd "$(dirname "$0")/.."

echo "==> Building & pushing $IMAGE"
docker buildx build --platform linux/amd64 -t "$IMAGE" --push .

echo "==> Applying k8s manifests"
kubectl apply -f scripts/k8s/

echo "==> Restarting deployment"
kubectl rollout restart deployment/$NAME -n default

echo "==> Waiting for rollout"
kubectl rollout status deployment/$NAME -n default

echo "==> Done: https://$NAME.teval.site"
