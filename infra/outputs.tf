

output "ssh_command" {
  description = "SSH command to connect to the k3s node"
  value       = "ssh -i ~/.ssh/<your-key>.pem ubuntu@${aws_instance.k3s_node.public_ip}"
}

output "kubeconfig_instructions" {
  description = "Instructions to get the kubeconfig file"
  value = <<EOT
After terraform apply, get the kubeconfig from the instance:
1. SSH into the instance:
   ssh -i ~/.ssh/<your-key>.pem ubuntu@${aws_instance.k3s_node.public_ip}

2. Copy the kubeconfig to your local machine:
   scp -i ~/.ssh/<your-key>.pem ubuntu@${aws_instance.k3s_node.public_ip}:/etc/rancher/k3s/k3s.yaml ~/.kube/config

3. Edit ~/.kube/config and replace "127.0.0.1" with "${aws_instance.k3s_node.public_ip}"
EOT
}

output "default_vpc_id" {
  description = "ID of the default VPC being used"
  value       = data.aws_vpc.default.id
}
