# 🌩️ Cloud Resume Challenge

Welcome to my Cloud Resume Challenge! This project follows the structure outlined by Forrest Brazeal and demonstrates my expertise in AWS cloud services, automation, and CI/CD.

## 🚀 Project Overview
This project consists of a personal resume website hosted entirely on AWS. The stack includes:
- **Frontend:** HTML, CSS, JavaScript (deployed on AWS S3 and served via CloudFront)
- **Backend:** AWS Lambda, API Gateway, and DynamoDB to track visitor count
- **CI/CD:** GitHub Actions for automated deployment

## 🛠️ Technologies Used
- **AWS Services:** S3, CloudFront, API Gateway, Lambda, DynamoDB, IAM
- **CI/CD:** GitHub Actions
- **Programming Languages:** JavaScript, Python
- **Security & Monitoring:** IAM roles, CloudWatch, AWS Secrets Manager

## 📜 Features
- **Static Website Hosting:** The resume is hosted on **AWS S3** and served via **CloudFront** for fast content delivery.
- **Visitor Counter:** A **serverless backend** using **AWS Lambda + API Gateway + DynamoDB** tracks and displays visitor count.
- **CI/CD Pipeline:** **GitHub Actions** automatically deploys changes to **S3** and invalidates the **CloudFront** cache.
- **Security Best Practices:** IAM roles for least-privileged access, HTTPS enforcement via CloudFront.

## 📂 Project Structure
```
📁 aws-cloud-resume
 ├── 📁 .github/workflows
 |    └── 📄 deploy.yml             #GitHub Actions workflow for CI/CD
 ├── 📁 assets
 |   ├── 📁 css
 |   |   ├── 📄 main.css             #Main CSS-style
 |   |   ├── 📄 nonscript.css
 |   |   └── 📄 fontawesome-all.min.css
 |   ├── 📁 js
 |   |   └── 📄 main.js              #Main JS-script
 |   └──  📁 webfonts
 |
 ├── 📁 backend
 │   └── 📄 handler.py               #AWS Lambda function
 |
 ├── 📁 images                       #All Image related to site
 |
 ├── 📄 index.html                   # Main resume page
 ├── 📄 job1.html                     
 ├── 📄 job2.html
 │   
 📜 README.md                       # Project documentation
```

## 🔧 Setup and Deployment
### 1️⃣ Clone the Repository
```sh
git clone https://github.com/0NikhilSingh5/aws-cloud-resume.git
cd cloud-resume-challenge
```

### 2️⃣ Deploy Frontend
```sh
aws s3 sync . s3://your-resume-bucket --delete
```

### 3️⃣ CI/CD via GitHub Actions
- Push changes to the `master` branch to trigger the deployment workflow (`deploy.yml`).

## 🌐 Live Demo
You can view the live version of my Cloud Resume here: [https://resume.codenickk.com]

## 📜 Lessons Learned
- **Serverless Architectures**: Implementing API Gateway + Lambda + DynamoDB
- **CI/CD Automation**: Leveraging GitHub Actions for automatic deployments
- **Security Best Practices**: IAM role configurations, CloudFront HTTPS enforcement

## 🎯 Future Enhancements
- Implement user authentication using Cognito
- Add a contact form with SES email integration
- Enhance UI with modern JavaScript frameworks (React/Vue)

## 🏆 Acknowledgments
- **Forrest Brazeal** for the Cloud Resume Challenge inspiration
- AWS documentation & community for support

---
🙌 Thanks for checking out my Cloud Resume Challenge! If you have any feedback or suggestions, feel free to reach out.

