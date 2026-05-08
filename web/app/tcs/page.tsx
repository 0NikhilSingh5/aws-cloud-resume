import type { Metadata } from "next";
import { RolePage } from "@/components/role-page";

export const metadata: Metadata = {
  title: "TCS — Nikhil Singh",
  description:
    "Associate Engineer at TATA Consultancy Services — AWS infrastructure support, CloudWatch monitoring, IAM, secure VPC architecture.",
};

export default function TcsPage() {
  return (
    <RolePage
      company="TATA Consultancy Services"
      logo="/images/TCS_new.png"
      logoAlt="TATA Consultancy Services"
      role="Associate Engineer"
      dates="August 2021 — June 2023"
      location="India"
      accent="#1A3DE8"
      bg="#0a0a0a"
      fg="#ffffff"
      prevHref="/readywire"
      prevLabel="Readywire"
      nextHref="/"
      nextLabel="Home"
      bullets={[
        {
          title: "CloudWatch Monitoring Implementation",
          body: "Configured custom CloudWatch metrics, alarms, and comprehensive dashboards, enabling real-time visibility into system performance, application health, and resource utilization across multiple environments.",
        },
        {
          title: "Performance Optimization",
          body: "Analyzed EC2 CPU, memory, and network metrics to proactively optimize performance, right-size instances, and reduce operational costs. Implemented cost-effective scaling strategies that improved resource utilization.",
        },
        {
          title: "Secure Network Architecture",
          body: "Architected and implemented secure AWS network environments using VPCs, subnets, security groups, and NACLs, ensuring robust protection for sensitive workloads and maintaining compliance with security standards.",
        },
        {
          title: "Infrastructure Support Excellence",
          body: "Delivered Level 1 support for AWS infrastructure services, including EC2, S3, and Lambda, reducing downtime through quick issue resolution and proactive monitoring.",
        },
        {
          title: "CI/CD Pipeline Enhancement",
          body: "Collaborated with DevOps and development teams to streamline CI/CD pipelines, accelerating deployment cycles and increasing release reliability.",
        },
        {
          title: "Security & Compliance",
          body: "Conducted periodic security audits and vulnerability assessments to maintain compliance with organizational and industry standards.",
        },
        {
          title: "IAM & Access Management",
          body: "Managed IAM roles and security groups for over 200 users, enforcing least-privilege access and automating access reviews.",
        },
        {
          title: "Incident Response Leadership",
          body: "Served as the primary AWS technical liaison during critical incidents, ensuring effective communication between development and infrastructure teams.",
        },
        {
          title: "Knowledge Management",
          body: "Authored comprehensive runbooks and knowledge base articles for recurring AWS issues, empowering Tier-1 teams to resolve tickets independently.",
        },
      ]}
      skills={[
        {
          title: "Cloud Services",
          tags: ["AWS", "CloudWatch", "EC2", "S3", "Lambda", "VPC"],
        },
        {
          title: "Security & Compliance",
          tags: [
            "IAM",
            "Security Groups",
            "NACLs",
            "Vulnerability Assessment",
          ],
        },
        {
          title: "Monitoring & Support",
          tags: [
            "CloudWatch",
            "Performance Monitoring",
            "Incident Response",
            "Technical Support",
          ],
        },
        {
          title: "DevOps & Automation",
          tags: ["CI/CD", "DevOps", "Automation", "Documentation"],
        },
      ]}
    />
  );
}
