Deploy guide (free-tier k3s on EC2)

This repository now includes basic infra and CI/CD scaffolding to run a single-node k3s cluster on a free-tier EC2 instance and deploy your microservices.

What I added
- infra/: Terraform scaffold to create a single EC2 instance and install k3s (minimal).
- .github/workflows/ci.yml: builds Docker images for each service and pushes to GitHub Container Registry (GHCR).
- .github/workflows/deploy.yml: SSH-based deploy that triggers a remote script on the EC2 instance to update container images.
- helm/: a small Helm chart scaffold to install your microservices (values.yaml uses image placeholders).
- scripts/remote_deploy.sh: remote script that updates images in-k8s via kubectl set image. Assumes deployments already exist.

Quick bootstrap (manual steps)
1) Create a key pair locally and have the public key path (e.g. ~/.ssh/id_rsa.pub).
2) Run terraform to create the EC2 instance:

   cd infra
   terraform init
   terraform apply -var "key_name=my-key" -var "public_key_path=~/.ssh/id_rsa.pub"

3) SSH to the instance and clone this repo:

   ssh -i ~/.ssh/id_rsa ubuntu@<instance_public_ip>
   git clone https://github.com/<your-org-or-username>/<repo> ~/app

4) On the instance, install helm (if not installed) and create initial deployments using Helm or kubectl. Example (from instance):

   cd ~/app
   helm upgrade --install microservices ./helm/microservices -f ./helm/microservices/values.yaml

   Note: Edit `helm/microservices/values.yaml` to replace `REPLACE_OWNER` with your GitHub username or org.

5) Create Kubernetes secrets for configuration (on the instance):

   kubectl create secret generic app-secrets --from-literal=MONGODB_URI="<your atlas uri>" --from-literal=JWT_SECRET="<secret>"

6) Configure GitHub secrets in your repository:
   - SSH_PRIVATE_KEY : the private key corresponding to the public key you used in Terraform
   - EC2_HOST : the public IP of the EC2 instance
   - ATLAS_MONGODB_URI : connection string for your Atlas free tier cluster
   - JWT_SECRET : secret for JWTs

7) Push code to main. The CI workflow will build and push images to GHCR. The deploy workflow will SSH to the host and run `scripts/remote_deploy.sh` to update images.

Notes & next improvements
- This is intentionally minimal so you can iterate quickly. I can help harden, add remote-state for Terraform, automate initial Helm install, or convert to ArgoCD for GitOps.
