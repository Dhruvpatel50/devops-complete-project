#!/bin/bash

# Get the instance IP from terraform output
INSTANCE_IP=$(terraform output -raw instance_public_ip)
SSH_USER=$(terraform output -raw ssh_user)

echo "Waiting for K3s to be ready..."
sleep 30

# Get the kubeconfig from the remote instance
mkdir -p ~/.kube
scp -o StrictHostKeyChecking=no $SSH_USER@$INSTANCE_IP:/etc/rancher/k3s/k3s.yaml ~/.kube/config

# Replace localhost with the instance IP
sed -i "s/127.0.0.1/$INSTANCE_IP/" ~/.kube/config

echo "Kubeconfig has been downloaded and configured."