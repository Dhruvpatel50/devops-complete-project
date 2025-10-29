#!/usr/bin/env bash
# Helper: create a GHCR imagePull secret for the cluster
# Usage:
#   GITHUB_USER=your-username GHCR_PAT=ghp_xxx kubectl apply -f k8s/create-ghcr-secret.sh -- not supported
# Instead run this script locally where kubectl is configured:
#   export GITHUB_USER=your-github-username
#   export GHCR_PAT=your-personal-access-token (needs package:write & read:packages scope)
#   ./k8s/create-ghcr-secret.sh

if [ -z "$GITHUB_USER" ] || [ -z "$GHCR_PAT" ]; then
  echo "Please set GITHUB_USER and GHCR_PAT environment variables."
  echo "Example: GITHUB_USER=youruser GHCR_PAT=ghp_xxx ./k8s/create-ghcr-secret.sh"
  exit 1
fi

kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username="$GITHUB_USER" \
  --docker-password="$GHCR_PAT" \
  --docker-email="you@example.com" \
  --dry-run=client -o yaml | kubectl apply -f -

echo "Created/updated secret 'ghcr-secret' in current namespace."
