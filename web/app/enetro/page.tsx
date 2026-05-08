import type { Metadata } from "next";
import { RolePage } from "@/components/role-page";

export const metadata: Metadata = {
  title: "Enetro AI — Nikhil Singh",
  description:
    "Cloud Engineer at Enetro AI — Cognito auth platform, multi-stack Terraform IaC, ECR/ECS Fargate CI/CD.",
};

export default function EnetroPage() {
  return (
    <RolePage
      company="Enetro AI"
      logo="/images/Enetro_logo.svg"
      logoAlt="Enetro AI"
      role="Cloud Engineer"
      dates="2026 — Present"
      location="India"
      accent="#10b981"
      bg="#0a0a0a"
      fg="#ffffff"
      prevHref="/"
      prevLabel="Home"
      nextHref="/readywire"
      nextLabel="Readywire"
      bullets={[
        {
          id: "cognito",
          title: "Cognito Auth Platform",
          body: "Designed and operated a multi-environment authentication platform on AWS Cognito, with a pre-token-generation Lambda injecting custom claims (role, tenant id, employee id) into every JWT. Backend services verify RS256 tokens locally against cached JWKS — no per-request round-trip to Cognito while staying tamper-proof. Codified password policy, account recovery, and OAuth Authorization Code flow for the hosted UI.",
        },
        {
          id: "terraform",
          title: "Terraform Multi-Stack IaC",
          body: "Authored a modular Terraform monorepo provisioning the AWS footprint across separate stacks — auth (Cognito), networking (VPC, subnets, NAT, API Gateway), compute (EC2, RDS, Valkey, DNS) and observability — with S3-backed remote state and DynamoDB state locking. One change to a shared locals file rolls out across all four environments; lifecycle rules handle Cognito's append-only schema constraints.",
        },
        {
          id: "cicd",
          title: "ECR / ECS Fargate CI/CD",
          body: "Built a branch-gated container delivery pipeline: develop → dev, beta → beta, main → sandbox → manual gate → prod. The deploy script resolves environment-scoped secrets, validates required vars, builds linux/amd64 Docker images, pushes to ECR, then forces an ECS Fargate redeploy via boto3. Change-set filters keep unrelated services from rebuilding.",
        },
      ]}
      skills={[
        {
          title: "Cloud Platforms",
          tags: [
            "AWS",
            "Cognito",
            "Lambda",
            "ECS Fargate",
            "ECR",
            "API Gateway",
            "EC2",
            "RDS",
            "S3",
            "CloudWatch",
          ],
        },
        {
          title: "Infrastructure as Code",
          tags: ["Terraform", "S3 + DynamoDB state", "lifecycle rules"],
        },
        {
          title: "Containers & CI/CD",
          tags: [
            "Docker",
            "Bitbucket Pipelines",
            "boto3",
            "linux/amd64 builds",
          ],
        },
        {
          title: "Auth & Security",
          tags: ["OIDC / OAuth2", "JWT (RS256)", "JWKS", "IAM"],
        },
        {
          title: "Programming",
          tags: ["Python", "Bash", "TypeScript"],
        },
      ]}
    />
  );
}
