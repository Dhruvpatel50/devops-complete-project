# Variables
$ip = "34.227.227.110"  # Your EC2 public IP
$myip = (Invoke-RestMethod -Uri "https://checkip.amazonaws.com").Trim()

# Find the instance ID
$instanceId = (aws ec2 describe-instances `
    --filters "Name=ip-address,Values=$ip" `
    --query "Reservations[0].Instances[0].InstanceId" `
    --output text)

# Find its Security Group ID
$sgId = (aws ec2 describe-instances `
    --instance-ids $instanceId `
    --query "Reservations[0].Instances[0].SecurityGroups[0].GroupId" `
    --output text)

# Allow access to port 6443 from your IP
aws ec2 authorize-security-group-ingress `
    --group-id $sgId `
    --protocol tcp `
    --port 6443 `
    --cidr "$myip/32"

Write-Host "✅ Ingress rule added for port 6443 from $myip to $sgId"
