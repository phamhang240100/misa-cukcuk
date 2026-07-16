---
name: deploy
description: Deploy current project lên on-prem Kubernetes cluster (k3s). Tạo Dockerfile, k8s manifests, deploy.sh nếu chưa có, rồi deploy.
argument-hint: "[subdomain]"
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Cluster

- Registry: `100.104.168.197:30500` (insecure, no auth)
- Ingress: traefik → `<subdomain>.teval.site`
- PostgreSQL: `postgresql://postgres:changeme@postgres.infra.svc.cluster.local:5432/<dbname>`
- Redis: `redis://:changeme@redis.infra.svc.cluster.local:6379`

# Rules

- Base image: dùng LTS latest
- `--platform linux/amd64`
- `.dockerignore`: exclude `node_modules`, `.next`, `.git`
- `imagePullPolicy: Always`, tag `latest`
- Next.js: `output: 'standalone'` in next config
- pnpm: dùng BuildKit mount cache `--mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store`
- OrbStack insecure registry: `~/.orbstack/config/docker.json` → `{"insecure-registries": ["100.104.168.197:30500"]}` rồi `orbctl restart docker`

# Steps (first deploy)

1. Detect framework, port, env vars
2. Hỏi subdomain nếu chưa có. Check: `kubectl get ingress -A | grep <subdomain>`
3. Nếu cần DB: `kubectl exec -n infra deploy/postgres -- psql -U postgres -c "CREATE DATABASE <dbname>;"`
4. Tạo `.dockerignore`, `Dockerfile`, `scripts/k8s/<name>.yaml`, `scripts/deploy.sh`
5. Verify registry: `curl -s http://100.104.168.197:30500/v2/_catalog`
6. Build, push, apply, verify

# Deploy

```bash
docker buildx build --platform linux/amd64 -t 100.104.168.197:30500/<name>:latest --push .
kubectl apply -f scripts/k8s/
kubectl rollout restart deployment/<name> -n default
kubectl rollout status deployment/<name> -n default
```

# Troubleshooting

- `exec format error` → thiếu `--platform linux/amd64`
- `ImagePullBackOff` HTTPS error → k3s cần insecure registry trong `/etc/rancher/k3s/registries.yaml`
- `ErrImagePull` → check `curl http://100.104.168.197:30500/v2/<name>/tags/list`
