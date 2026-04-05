# Deployment and Email Security Plan: SecurePay Fraud Detection

This plan outlines how to securely deploy the **SecurePay** multi-service project and address concerns regarding the safety and security of email alerts.

## 1. 🛡️ Making Email Alerts Safe
To ensure email alerts are secure in a production environment, we will transition from hardcoded credentials to **Environment-Based Security**.

### Proposed Security Enhancements:
- **Secret Management**: Move SMTP credentials out of `application.properties` and into system environment variables or a Secret Manager (like AWS Secrets Manager or HashiCorp Vault).
- **Service Isolation**: Use a dedicated SMTP provider (e.g., SendGrid, Mailgun, or AWS SES) instead of a personal Gmail account for better reliability and security controls.
- **Data Masking**: Ensure that sensitive user data (like full mobile numbers or account IDs) is masked in the email body, sending only what is necessary for the alert.
- **TLS/SSL Encryption**: Force `STARTTLS` for all SMTP traffic (already partially implemented).

---

## 2. 🚢 Deployment Strategy: Docker Containerization
The system consists of four main components that must work in harmony:
1.  **Frontend**: React (Vite)
2.  **Backend Hub**: Java (Spring Boot)
3.  **ML Inference Engine**: Python (FastAPI)
4.  **Database**: MySQL 8.0

### Containerization Plan
We will create a `docker-compose.yml` to orchestrate these services. This ensures that the exact same environment is used in development and production.

| Service | Technology | Port | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend** | Nginx + React | 80/443 | Serves the UI dashboard. |
| **Backend** | Spring Boot | 8082 | Orchestrates data and alerts. |
| **ML API** | FastAPI | 8000 | Returns fraud risk scores. |
| **Database** | MySQL | 3306 | Persistent storage for transactions. |

---

## 3. 🚀 Step-by-Step Deployment Guide

### Phase 1: Environment Hardening
1.  **Modify `application.properties`**: Use placeholders like `${SPRING_MAIL_PASSWORD}` instead of raw text.
2.  **Externalize ML URL**: Ensure the Java backend calls the ML service using a configurable URL (e.g., `http://ml-service:8000`).

### Phase 2: Building Docker Components
1.  **Java Backend Dockerfile**: Package the JAR.
2.  **ML Service Dockerfile**: Python + Model.
3.  **Frontend Dockerfile**: Nginx + Build.

### Phase 3: Orchestration with Docker Compose
1.  Define a `docker-compose.yml`.
2.  Inject secrets via `.env`.

### Phase 4: Cloud Hosting
- Host on AWS, DigitalOcean, or Azure with SSL/TLS (HTTPS).

---

> [!NOTE]
> By moving the email password to an environment variable, it becomes "safe" because it is never stored in the code and is only injected at runtime.
