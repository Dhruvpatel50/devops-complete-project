output "ssh_command" {
  description = "SSH command to connect to the k3s node"
  value       = "ssh -i ~/.ssh/<your-key>.pem ubuntu@${aws_instance.k3s_node.public_ip}"
}

output "kubeconfig_instructions" {
  description = "Instructions to get the kubeconfig file"
  value = <<EOT
After terraform apply, get the kubeconfig from the instance=
EOT
}

output "default_vpc_id" {
  description = "ID of the default VPC being used"
  value       = data.aws_vpc.default.id
}
