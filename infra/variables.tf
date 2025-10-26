variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "key_name" {
  description = "Name of your existing AWS key pair in the region"
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type (t3.micro or t2.micro for free tier)"
  type        = string
  default     = "t3.micro"
}