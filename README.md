# SkillSwapper - DevOps & Microservices Platform

A modern, cloud-native microservices platform for skill exchange, built with comprehensive DevSecOps practices and deployed on AWS EKS.

![Build Status](https://github.com/Dhruvpatel50/devops-complete-project/actions/workflows/ci-cd.yml/badge.svg)
[![Security Scan](https://github.com/Dhruvpatel50/devops-complete-project/actions/workflows/ci-cd.yml/badge.svg?event=security)](https://github.com/Dhruvpatel50/devops-complete-project/security)

## Table of Contents
- [Project Overview](#project-overview)
- [System Architecture](#system-architecture)
- [Repository Structure](#repository-structure)
- [Microservices](#microservices)
- [Infrastructure Setup](#infrastructure-setup)
- [DevSecOps Pipeline](#devsecops-pipeline)
- [Deployment Guide](#deployment-guide)
- [Security Features](#security-features)

## Project Overview

SkillSwapper is a comprehensive platform that enables users to:
- Connect with other users to exchange skills
- Manage skill swap requests
- Real-time messaging between users
- Provide feedback and ratings
- Secure user authentication and profile management

## System Architecture

Our project implements a comprehensive DevSecOps pipeline to ensure security, code quality, and reliability throughout the development lifecycle.

### Security Scanning Tools

1. **Gitleaks**
   - Scans repository for hardcoded secrets and sensitive information
   - Prevents accidental commit of credentials
   - Generates SARIF reports for GitHub Security tab

2. **Snyk**
   - Continuous dependency vulnerability scanning
   - Container image security scanning
   - License compliance checking

3. **Trivy**
   - Container vulnerability scanning
   - Identifies vulnerabilities in container images
   - Checks for security issues in base images

### Code Quality Tools

1. **ESLint**
   - Static code analysis
   - Enforces code style and best practices
   - Security-focused rules enabled

2. **SonarCloud**
   - Code quality metrics
   - Security vulnerability detection
   - Code coverage tracking

### Dependency Management

1. **NPM Audit**
   - Continuous dependency scanning
   - Automatic security updates
   - Vulnerability reporting

### Pipeline Stages

1. **Security Scanning**
   - Secret detection
   - SAST (Static Application Security Testing)
   - License compliance

2. **Dependency Check**
   - Vulnerability scanning
   - Package auditing
   - Dependency updates

3. **Code Quality**
   - Linting
   - Style checking
   - Code smell detection

4. **Container Security**
   - Image scanning
   - Base image validation
   - Runtime security checks

### Continuous Monitoring

- Security scan results in GitHub Security tab
- Automated notifications for vulnerabilities
- Regular dependency updates
- Compliance reporting

## System Architecture

Our system architecture follows a microservices approach deployed on AWS EKS with Kubernetes orchestration:

```ascii
┌─────────────────────────────────────────────────────────────────────────┐
│                         🌐 PUBLIC ACCESS LAYER                          │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     AWS Application Load Balancer               │   │
│  └────────────────────────────┬────────────────────────────────────┘   │
└───────────────────────────────┼────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    🔀 KUBERNETES INGRESS LAYER                          │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │              Nginx Ingress Controller (LoadBalancer)             │  │
│  │                                                                  │  │
│  │  Routes:                                                         │  │
│  │   • /api/auth/*          → Auth Service (Port 80 → 3001)        │  │
│  │   • /api/users/*         → User Service (Port 80 → 3002)        │  │
│  │   • /api/messages/*      → Messaging Service (Port 80 → 3003)   │  │
│  │   • /api/swaps/*         → Swap Service (Port 80 → 3004)        │  │
│  │   • /api/feedback/*      → Feedback Service (Port 80 → 3005)    │  │
│  └─────┬──────────┬─────────┬─────────┬──────────────┬─────────────┘  │
└────────┼──────────┼─────────┼─────────┼──────────────┼────────────────┘
         │          │         │         │              │
         ▼          ▼         ▼         ▼              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     ☸️  KUBERNETES SERVICES LAYER                       │
│                                                                         │
│  ┌────────┐  ┌────────┐  ┌─────────┐  ┌────────┐  ┌────────────┐      │
│  │  Auth  │  │  User  │  │Messaging│  │  Swap  │  │ Feedback   │      │
│  │Service │  │Service │  │ Service │  │Service │  │  Service   │      │
│  │ClusterIP│  │ClusterIP│  │ClusterIP│  │ClusterIP│  │ ClusterIP │      │
│  │Port: 80│  │Port: 80│  │Port: 80 │  │Port: 80│  │  Port: 80 │      │
│  └───┬────┘  └───┬────┘  └────┬────┘  └───┬────┘  └─────┬────┘      │
└──────┼──────────┼──────────────┼──────────┼────────────┼─────────────┘
       │          │              │          │            │
       ▼          ▼              ▼          ▼            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           📦 STORAGE LAYER                              │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                         AWS S3 Bucket                            │  │
│  │                                                                  │  │
│  │  • User Profile Images                                          │  │
│  │  • Skill Certification Documents                                │  │
│  │  • Message Attachments                                          │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                   🔐 CONFIGURATION & SECRETS                            │
│                                                                         │
│  ┌──────────────────────┐        ┌──────────────────────────────────┐  │
│  │   ConfigMaps         │        │      Kubernetes Secrets          │  │
│  │                      │        │                                  │  │
│  │  • S3_BUCKET        │        │  • AWS_ACCESS_KEY_ID            │  │
│  │  • AWS_REGION       │        │  • AWS_SECRET_ACCESS_KEY        │  │
│  │  • API_ENDPOINTS    │        │  • JWT_SECRET                   │  │
│  └──────────────────────┘        └──────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

### Infrastructure Components:

#### Kubernetes Control Plane
- **kube-apiserver**: API server that exposes the Kubernetes API
- **etcd**: Consistent and highly-available key value store for all cluster data
- **kube-scheduler**: Watches for newly created Pods and selects nodes for them
- **kube-controller-manager**: Runs controller processes

#### Worker Nodes
Each worker node contains:
- **kubelet**: Agent that ensures containers are running in a Pod
- **kube-proxy**: Network proxy that maintains network rules
- **Container Runtime**: Docker/containerd for running containers

#### Kubernetes Resources
- **Pods**: Smallest deployable units, hosting our microservices
- **Services**: Load balancing and service discovery for Pods
- **Ingress**: NGINX Ingress Controller for routing external traffic
- **CoreDNS**: For cluster DNS services

#### AWS Infrastructure
- **EKS Control Plane**: Managed by AWS
- **ALB**: AWS Application Load Balancer
- **S3**: Object storage for file persistence
- **Security Groups**: Network security
- **IAM Roles**: For EKS and worker nodes

#### Container Registry
- **GitHub Container Registry (ghcr.io)**: Stores our container images
- Automatic image pulling with GitHub Actions integration

## Repository Structure

```
devops-complete-project/
├── services/                  # Microservices
│   ├── auth-service/         # Authentication service
│   ├── user-service/         # User management
│   ├── messaging-service/    # Real-time messaging
│   ├── swap-service/         # Skill swap management
│   └── feedback-service/     # User feedback & ratings
├── k8s/                      # Kubernetes manifests
│   ├── auth-service/
│   ├── feedback-service/
│   ├── messaging-service/
│   ├── swap-service/
│   └── ingress.yaml
├── infra/                    # Terraform configurations
│   ├── main.tf              # Main infrastructure
│   ├── variables.tf         # Variable definitions
│   └── outputs.tf           # Output definitions
├── .github/
│   └── workflows/           # CI/CD pipelines
└── scripts/                 # Deployment scripts
```

## Microservices

### 1. Auth Service
- User authentication and authorization
- JWT token management
- OAuth2 integration
- **Tech Stack**: Node.js, Express, JWT

### 2. User Service
- User profile management
- Skill inventory
- Account settings
- **Tech Stack**: Node.js, Express, MongoDB

### 3. Messaging Service
- Real-time chat functionality
- Message history
- User presence detection
- **Tech Stack**: Node.js, Socket.io, Redis

### 4. Swap Service
- Skill swap request management
- Matching algorithm
- Schedule coordination
- **Tech Stack**: Node.js, Express, MongoDB

### 5. Feedback Service
- User ratings and reviews
- Feedback management
- Rating analytics
- **Tech Stack**: Node.js, Express, MongoDB

## Infrastructure Setup

### AWS Resources
- EKS Cluster with 2 managed node groups
- VPC with public and private subnets
- NAT Gateway for private subnet access
- ALB for load balancing
- Route53 for DNS management

### Kubernetes Configuration
Example pod configuration:
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: auth-service
spec:
  containers:
  - name: auth
    image: ghcr.io/dhruvpatel50/auth-service:latest
    ports:
    - containerPort: 3000
    resources:
      limits:
        memory: "512Mi"
        cpu: "500m"
      requests:
        memory: "256Mi"
        cpu: "250m"
```

## DevSecOps Pipeline

Our CI/CD pipeline implements comprehensive security scanning:

### Security Checks
1. **Secret Scanning**: Gitleaks
   - Prevents secret leaks
   - Custom rules for specific patterns
   - SARIF reporting

2. **SAST**: ESLint security rules
   - Code quality checks
   - Security best practices
   - Custom security rules

3. **Dependency Scanning**: Snyk
   - Vulnerability detection
   - License compliance
   - Dependency updates

4. **Container Scanning**: Trivy
   - Base image scanning
   - Package vulnerability checks
   - Misconfiguration detection

5. **Infrastructure Scanning**: Terraform security checks
   - IaC best practices
   - Security group validation
   - Access control verification

### CI/CD Flow
1. Code Push/PR → Security Scans
2. Build → Test → Security Scans
3. Container Build → Container Scan
4. Push to Registry
5. Deploy to EKS

### Security Reports
- All scan results available in GitHub Security tab
- Automated vulnerability reporting
- Compliance documentation
- Security metrics tracking

## Deployment Guide

1. **Prerequisites**
   ```bash
   aws configure
   kubectl configure
   terraform init
   ```

2. **Infrastructure Deployment**
   ```bash
   cd infra
   terraform plan
   terraform apply
   ```

3. **Application Deployment**
   ```bash
   kubectl apply -f k8s/
   ```

## Security Features

1. **Infrastructure Security**
   - Private subnets for workloads
   - Security groups and NACLs
   - IAM roles and policies
   - AWS KMS encryption

2. **Application Security**
   - JWT authentication
   - Rate limiting
   - Input validation
   - HTTPS enforcement

3. **Container Security**
   - Image scanning
   - Runtime security
   - Resource limits
   - Network policies

## Logging

Application logs are handled through:
- Container stdout/stderr logs
- AWS CloudWatch Logs (via EKS)

## Contributing

Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
