# Complete System Specification: SecurePay Fraud Detection

> [!NOTE]
> This document provides the low-level technical details for the entire distributed system. Use this as a reference for your "Technical Deep Dive" portion of the presentation.

---

## 🎨 1. Frontend (The Command Center)
*An immersive, reactive environment built for high-stakes monitoring.*

- **Core Engine**: React 19 (Modern functional components)
- **Build System**: Vite (Next-generation lightning-fast frontend tooling)
- **Primary Styling**: **TailwindCSS 4** (Utilizing a curated Dark Mode glassmorphic theme)
- **Key Modules**:
    - **Visualization**: `Recharts` for high-frequency data trends.
    - **Geospatial**: `Leaflet` & `React-Simple-Maps` for mapping transaction coordinates to global cities.
    - **Communication**: `Axios` with a centralized interceptor pattern for all API requests.
    - **Iconography**: `Lucide-react` for consistent, crisp SVG iconography.
- **Critical Features**:
    - **Auto-Sync Engine**: A custom React Hook that polls for new transactions every **20-30 seconds**.
    - **Audio Feedback**: Web Audio API integration that triggers high-alert sounds on fraud detection.
    - **Reporting Layer**: `jsPDF` for generating forensic transaction reports directly in the browser.

---

## ⚙️ 2. Backend (The Enterprise Gateway)
*The secure orchestrator built with Java Spring Boot.*

- **Framework**: **Java Spring Boot 3.x**
- **Port**: **8082**
- **Dependency Management**: Maven
- **Strategic Layers**:
    - **Controllers**: REST endpoints for Auth, Transactions, Personnel Management, and System Telemetry.
    - **Services**: Business logic for calculating metrics, triggering ML analysis, and formatting notifications.
    - **Repositories**: Spring Data JPA for abstracting high-speed database queries.
- **Protocol Loop**: 
    1. Receives transaction from Frontend.
    2. Persists raw data to MySQL.
    3. Forwards specialized feature-set to Python ML API (Port 8000).
    4. Aggregates the ML prediction and serves it back to the UI.
- **Communication Alerts**: Integrated **Spring Mail (SMTP)** for automated "Critical Fraud Alert" emails to the security team.

---

## 🧠 3. ML-Service (The Predictive Brain)
*A high-performance Python API hosting the trained intelligence.*

- **Environment**: Python 3.10+
- **API Framework**: **FastAPI** (Chosen for its asynchronous processing and minimal latency)
- **Port**: **8000**
- **Model Storage**: `Joblib` (Serialized pre-trained model)
- **Technical Intelligence**:
    - **Training Data**: 250,000 transaction samples ([fraud_dataset_250k.csv](file:///c:/Users/B.N.MAHEEDHARACHARYA/OneDrive/Desktop/DigitalBanking/ml-service/fraud_dataset_250k.csv)) representing real-world banking patterns.
    - **Model**: Scikit-learn derived classifier (Random Forest/XGBoost logic).
    - **Feature Engineering**: Analyzes 30+ parameters including **Amount**, **Merchant ID**, **Transaction Hour**, **User Lat/Long vs. Merchant Lat/Long**, and **Population Density**.
- **Real-Time Inference**: Processes a prediction in **<50ms**, ensuring the frontend dashboard remains liquid and responsive.

---

## 🗄️ 4. Database (The Persistent Registry)
*A relational MySQL database designed for audit-ready data storage.*

- **Engine**: **MySQL 8.0**
- **Database Identity**: `frauddb`
- **Port**: **3306**
- **Core Schema Tables**:
    - **`users`**: Secure storage of hashed credentials, operational roles (Admin/Analyst), and clearance strings.
    - **`transactions`**: The central ledger—stores every processed transaction ID, amount, and the ML-assigned "Risk Score".
    - **`contact_requests`**: The communication channel record—stores Analyst signals, Admin responses, and read-status.
    - **`audit_logs`**: A tamper-evident trail of all system-sensitive operations (e.g., user deletion, settings changes).
- **In-Memory Logic**: Uses Hibernate's session management to optimize query performance during high-volume transaction generation.
