data "aws_vpc" "default" {
  default = true
}

data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*", "ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

resource "aws_security_group" "k3s_sg" {
  name        = "k3s-sg"
  description = "Allow SSH, HTTP, HTTPS for k3s node"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # restrict to your IP in prod
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 6443
    to_port     = 6443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # In production, restrict to your IP
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "k3s_node" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type              = var.instance_type
  key_name                  = var.key_name  # This will use your existing key
  vpc_security_group_ids    = [aws_security_group.k3s_sg.id]
  associate_public_ip_address = true

  tags = {
    Name = "k3s-single-node"
  }

  user_data = <<-EOF
    #!/bin/bash
    set -e
    curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="--write-kubeconfig-mode=644" sh -
    # Allow ubuntu user to read kubeconfig
    if id ubuntu >/dev/null 2>&1; then
      mkdir -p /home/ubuntu/.kube
      cp /etc/rancher/k3s/k3s.yaml /home/ubuntu/.kube/config
      chown -R ubuntu:ubuntu /home/ubuntu/.kube
    fi
EOF
}

output "instance_public_ip" {
  value = aws_instance.k3s_node.public_ip
}

output "ssh_user" {
  value = "ubuntu"
}
