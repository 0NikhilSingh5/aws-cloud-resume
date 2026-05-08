import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nikhil Singh — Cloud Engineer | AWS Specialist",
  description:
    "Cloud Engineer with 3+ years architecting and operating scalable AWS systems — Cognito auth platforms, multi-stack Terraform IaC, ECR/ECS Fargate CI/CD.",
  metadataBase: new URL("https://resume.codenickk.com"),
  openGraph: {
    title: "Nikhil Singh — Cloud Engineer | AWS Specialist",
    description:
      "Cognito auth platforms, multi-stack Terraform IaC, ECR/ECS Fargate CI/CD.",
    url: "https://resume.codenickk.com",
    siteName: "Nikhil Singh",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nikhil Singh — Cloud Engineer",
    description:
      "Cognito auth platforms, multi-stack Terraform IaC, ECR/ECS Fargate CI/CD.",
  },
  icons: {
    icon: "/images/portfolio.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
