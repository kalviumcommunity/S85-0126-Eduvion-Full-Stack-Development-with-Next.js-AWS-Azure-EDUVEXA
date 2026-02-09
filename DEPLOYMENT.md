# Deployment (AWS ECS - Fargate)

This document shows how to containerize the Next.js app and deploy it to AWS ECS using Fargate, plus a sample GitHub Actions workflow to build/push the image to ECR and trigger a service redeploy.

Files included in this repo:

- `Dockerfile` — multi-stage Node.js build (builder + runtime)
- `.github/workflows/deploy-ecs.yml` — example GitHub Action to build/push and update ECS

Required GitHub secrets (add these to your repository settings):

- `AWS_REGION` (e.g., `ap-south-1`)
- `AWS_ACCOUNT_ID` (your AWS account ID)
- `AWS_ACCESS_KEY_ID` (IAM user with ECR/ECS permissions)
- `AWS_SECRET_ACCESS_KEY`
- `ECR_REPOSITORY` (the ECR repo name, e.g., `nextjs-app`)
- `ECS_CLUSTER` (ECS cluster name)
- `ECS_SERVICE` (ECS service name)

Build and test locally

```bash
# Build the Docker image locally
docker build -t nextjs-app .

# Run the container and map port 3000
docker run -p 3000:3000 nextjs-app

# Visit http://localhost:3000 to verify
```

Push to Amazon ECR (manual steps)

```bash
# Authenticate (example region ap-south-1)
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-south-1.amazonaws.com

# Tag and push
docker tag nextjs-app:latest <account-id>.dkr.ecr.ap-south-1.amazonaws.com/nextjs-app:latest
docker push <account-id>.dkr.ecr.ap-south-1.amazonaws.com/nextjs-app:latest
```

CI/CD (GitHub Actions)

The included workflow `.github/workflows/deploy-ecs.yml` will:

- Configure AWS credentials
- Login to ECR
- Build and push the Docker image
- Trigger `aws ecs update-service --force-new-deployment` to pull the latest image

ECS Task/Service notes

- Create an ECS Task Definition that exposes port `3000` and references your ECR image.
- Use Fargate launch type for simplified infra management.
- Start with a small task size (0.25 vCPU / 512 MB). Scale horizontally via Service autoscaling (e.g., CPU 50% threshold).
- Configure health checks and CloudWatch logging for observability.

Best practices and reflections

- Use immutable tags (e.g., commit SHA) for production images instead of `latest`.
- Provide a lightweight startup (avoid heavy init in container) to reduce cold-start time.
- Implement readiness and liveness checks so ECS can detect unhealthy tasks.
- Monitor metrics (CPU, memory, request latency) and tune resource allocation.

Troubleshooting

- If the service doesn't pick up the new image, ensure the task definition references the same repository and specify an image tag or force new deployment.
- Check CloudWatch logs for runtime errors and ECS task events for failures.
