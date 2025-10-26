# S3 bucket for Terraform state
resource "aws_s3_bucket" "terraform_state" {
  bucket = "skillswapper-terraform-state-${data.aws_caller_identity.current.account_id}"

  # Prevent accidental deletion
  lifecycle {
    prevent_destroy = true
  }
}

# Enable versioning for state files
resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  versioning_configuration {
    status = "Enabled"
  }
}

# Enable server-side encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# DynamoDB table for state locking
resource "aws_dynamodb_table" "terraform_locks" {
  name         = "skillswapper-terraform-locks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }
}

# Get current AWS account ID
data "aws_caller_identity" "current" {}

# Output the S3 bucket name and DynamoDB table
output "terraform_state_bucket" {
  value = aws_s3_bucket.terraform_state.id
  description = "S3 bucket for Terraform state (use this in backend.tf)"
}