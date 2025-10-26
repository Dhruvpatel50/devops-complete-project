# Terraform AWS Infrastructure with EKS

This guide will help you set up the complete AWS infrastructure using Terraform and deploy your microservices using GitHub Actions.

## Prerequisites
1. AWS CLI configured with appropriate credentials
2. Terraform installed
3. kubectl installed
4. Docker installed

## Step-by-Step Deployment Guide

### 1. Set up AWS Infrastructure
```bash
# Initialize Terraform
cd infra
terraform init

# Plan the infrastructure
terraform plan

# Apply the infrastructure
terraform apply
```

### 2. Configure GitHub Secrets
Add these secrets to your GitHub repository:
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- AWS_REGION
- AWS_ACCOUNT_ID

### 3. Connect to EKS Cluster
```bash
aws eks update-kubeconfig --name skillswapper-eks --region us-east-1
```

### 4. Deploy AWS Load Balancer Controller
```bash
# Install using Helm
helm repo add eks https://aws.github.io/eks-charts
helm repo update
helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=skillswapper-eks \
  --set serviceAccount.create=true
```

### 5. Deploy Application
Push to main branch or create a pull request to trigger the GitHub Actions workflow.

### 6. Access the Application
After deployment:
1. Get the ALB DNS name:
```bash
kubectl get ingress skillswapper-ingress -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'
```
2. Access services through the ALB URL:
- Auth Service: http://<ALB_DNS>/api/auth
- User Service: http://<ALB_DNS>/api/users
- etc.

### 7. Optional: Set up Custom Domain
1. Register domain in Route 53
2. Create SSL certificate in ACM
3. Update ingress annotations with certificate ARN
4. Create Route 53 alias record pointing to ALB

## Monitoring Setup
1. Deploy Prometheus:
```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack
```

2. Deploy Grafana:
```bash
helm repo add grafana https://grafana.github.io/helm-charts
helm install grafana grafana/grafana
```

3. Access Grafana:
```bash
kubectl get secret grafana -o jsonpath="{.data.admin-password}" | base64 --decode
kubectl port-forward service/grafana 3000:80
```

## Infrastructure Diagram
```
Internet
   │
   ▼
Route 53 (Optional)
   │
   ▼
Application Load Balancer
   │
   ▼
EKS Cluster
   │
   ├─► Auth Service Pod(s)
   ├─► User Service Pod(s)
   ├─► Swap Service Pod(s)
   ├─► Messaging Service Pod(s)
   └─► Feedback Service Pod(s)
        │
        ▼
    MongoDB Atlas
    (or Amazon DocumentDB)