Terraform infra scaffold (free-tier friendly)

What this does (initial skeleton)
- Creates an EC2 instance (t3.micro by default) in your account and installs k3s.
- Creates an SSH key pair resource (uploads your public key) and a Security Group that allows SSH/HTTP/HTTPS.

Important notes
- This is a minimal, free-tier-first scaffold meant for dev/testing. It runs a single-node k3s cluster on an EC2 instance.
- You must provide `var.key_name` and ensure `var.public_key_path` points to your public key.
- Review and tighten the security group CIDR for SSH (don't leave 0.0.0.0/0 in production).

Quick start
1. Install Terraform and AWS CLI and configure AWS credentials locally.
2. Edit `infra/variables.tf` or pass variables on the command line. Example:

   terraform init
   terraform apply -var "key_name=my-key" -var "public_key_path=~/.ssh/id_rsa.pub"

3. After apply, get the EC2 public IP from the outputs and SSH in:

   ssh -i ~/.ssh/id_rsa ubuntu@<instance_public_ip>

4. On the instance the installer put the k3s kubeconfig at `/etc/rancher/k3s/k3s.yaml`. Copy it to your machine and replace `127.0.0.1` with the instance public IP, or use `ssh -L` port forwarding.

Next steps (I can add these):
- Create an S3 remote state backend and DynamoDB lock table.
- Add an initial bootstrap script that clones your repo on the instance and runs Helm install.
- Harden networking (private subnets, bastion host) if you want production-level security.
# AWS Infrastructure for SkillSwapper Microservices

This directory contains Terraform code to provision the base AWS infrastructure for deploying microservices:

## Resources Provisioned
- VPC (Virtual Private Cloud)
- Public and Private Subnets
- EKS Cluster (Kubernetes)
- EKS Node Group
- IAM Roles for EKS and EC2

## Usage
1. Install [Terraform](https://www.terraform.io/downloads.html)
2. Configure your AWS credentials (`aws configure`)
3. Run the following commands:
   ```sh
   terraform init
   terraform plan
   terraform apply
   ```
4. Use the outputs to configure your Kubernetes deployment and CI/CD pipelines.

## Next Steps
- Build and push Docker images to AWS ECR
- Apply Kubernetes manifests in the `k8s` directory
- Set up CI/CD pipelines for automated deployment
