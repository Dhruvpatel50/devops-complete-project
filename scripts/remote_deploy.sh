#!/usr/bin/env bash
set -euo pipefail

SHA="$1"
OWNER="$2"

services=(auth-service user-service swap-service messaging-service feedback-service)

echo "Deploying images with SHA=$SHA and OWNER=$OWNER"

for s in "${services[@]}"; do
  IMAGE=ghcr.io/${OWNER}/${s}:${SHA}
  echo "Updating deployment ${s} -> ${IMAGE}"
  # Try to set image; if deployment doesn't exist, warn
  if kubectl -n default get deployment ${s} >/dev/null 2>&1; then
    kubectl -n default set image deployment/${s} ${s}=${IMAGE} --record || kubectl -n default rollout restart deployment/${s}
  else
    echo "Deployment ${s} not found in cluster; skipping image update. You may need to run initial helm install or kubectl apply to create deployments."
  fi
done

echo "Deploy step finished. Check pod status:"
kubectl get pods -A
