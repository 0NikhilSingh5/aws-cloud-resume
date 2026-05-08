import type { Metadata } from "next";
import { RolePage } from "@/components/role-page";

export const metadata: Metadata = {
  title: "Readywire — Nikhil Singh",
  description:
    "Associate Solutions Architect at Readywire — Acumatica CI/CD, RDS monitoring, MySQL backup automation.",
};

export default function ReadywirePage() {
  return (
    <RolePage
      company="Readywire"
      logo="/images/Readywire_full_logo.png"
      logoAlt="Readywire"
      role="Associate Solutions Architect"
      dates="June 2023 — 2026"
      location="India"
      accent="#fd5200"
      bg="#0a0a0a"
      fg="#ffffff"
      prevHref="/enetro"
      prevLabel="Enetro AI"
      nextHref="/tcs"
      nextLabel="TCS"
      bullets={[
        {
          title: "Automated RDS Monitoring System",
          body: "Designed and deployed an intelligent monitoring system using AWS Lambda to detect high CPU utilization. Implemented dynamic slow query logging with real-time insights delivery to developers, improving troubleshooting efficiency and optimizing memory and I/O performance.",
        },
        {
          title: "Acumatica CI/CD Pipeline",
          body: "Architected an end-to-end CI/CD pipeline for Acumatica ERP customization projects using Jenkins, Groovy, Batch, PowerShell, Python, and REST APIs. Fully automated the build, backup, and deployment processes with secure credential handling.",
        },
        {
          title: "MySQL Backup Automation",
          body: "Created a robust MySQL backup automation script featuring encrypted credential handling, definer cleanup, 7z compression, S3 uploads, and automated pre-signed URL generation shared via AWS SES.",
        },
        {
          title: "Monitoring & Alerting Systems",
          body: "Implemented comprehensive monitoring dashboards and alert systems using Grafana and CloudWatch, enabling real-time system health tracking and proactive incident response.",
        },
      ]}
      skills={[
        {
          title: "Cloud Platforms",
          tags: ["AWS", "Lambda", "EC2", "RDS", "S3", "CloudWatch", "SES"],
        },
        {
          title: "ERP & Automation",
          tags: ["Acumatica", "Jenkins", "Groovy", "REST APIs"],
        },
        {
          title: "Programming",
          tags: ["Python", "PowerShell", "Batch", "SQL"],
        },
        {
          title: "Monitoring & Ops",
          tags: ["Grafana", "CloudWatch", "MySQL"],
        },
      ]}
    />
  );
}
