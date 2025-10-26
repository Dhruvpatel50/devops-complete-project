# Deploying SkillSwapper Microservices on AWS (Free Tier Friendly)

## 1. Local Testing (Optional but Recommended)
```powershell
# In project root
cd C:\Dhruv\microservice_skillswapper
# Build and run all services locally
# (First time may take a few minutes)
docker-compose up --build
```
- Visit http://localhost:3001/health (auth), http://localhost:3002/health (user), etc. to check services.

## 2. Build and Push Docker Images to AWS ECR
1. Create an ECR repo for each service (from AWS Console or CLI):
```powershell
aws ecr create-repository --repository-name auth-service --region us-east-1
# Repeat for user-service, swap-service, etc.
```
2. Authenticate Docker to ECR:
```powershell
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
```
3. Build, tag, and push each service:
```powershell
cd services/auth-service
docker build -t auth-service:latest .
docker tag auth-service:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/auth-service:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/auth-service:latest
```
- Repeat for each service (user-service, swap-service, etc.)

## 3. Run a Service on AWS EC2 (Free Tier)
1. Launch a t2.micro EC2 (Amazon Linux 2, allow inbound ports 3001-3005, 27017 for MongoDB)
2. SSH into the instance:
```powershell
ssh -i <your-key.pem> ec2-user@<ec2-public-ip>
```
3. Install Docker:
```bash
sudo yum update -y
sudo amazon-linux-extras install docker -y
sudo service docker start
sudo usermod -a -G docker ec2-user
exit
# Reconnect to apply group change
ssh -i <your-key.pem> ec2-user@<ec2-public-ip>
```
4. Pull and run MongoDB:
```bash
docker run -d --name mongodb -p 27017:27017 mongo:6
```
5. Pull and run a service (example: auth-service):
```bash
docker run -d --name auth-service -e MONGODB_URI=mongodb://<ec2-private-ip>:27017/auth -e JWT_SECRET=prodsecret -p 3001:3001 <account-id>.dkr.ecr.us-east-1.amazonaws.com/auth-service:latest
```
- Replace `<ec2-private-ip>` with the instance's private IP (run `hostname -I`)
- Repeat for other services, changing ports and image names

## 4. Access Your Service
- Visit `http://<ec2-public-ip>:3001/health` in your browser to confirm it's running on AWS.

## 5. Next Steps
- For production, use EKS and managed databases (not free tier).
- Set up a domain and HTTPS with AWS Route 53 and ACM.
- Add monitoring (CloudWatch) and CI/CD (GitHub Actions).

---
This guide helps you get your microservices running and visible on AWS with minimal cost. For full Kubernetes/EKS deployment, see the `infra/` and `k8s/` directories.