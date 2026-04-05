# Technical Overview: SecurePay Fraud Detection System

> [!IMPORTANT]
> This project follows a **Distributed Hybrid Architecture**, combining the robust enterprise features of Java with the high-performance data science capabilities of Python.

---

## 🏗️ 3-Tier Architecture
We developed this system using a three-layer decoupled architecture to ensure scalability and high availability:

1.  **Frontend (React/Vite)**: An immersive, high-performance dashboard that provides real-time transaction monitoring and administrative control.
2.  **Backend (Spring Boot Gateway)**: Acts as the secure "orchestrator," managing user identity, audit logs, and communication between systems.
3.  **ML API (Python/FastAPI)**: The "Brain" of the system, hosting the trained machine learning model for instant risk scoring.

---

## 💻 Full Technology Stack

### 🎨 Frontend
- **Framework**: React 19 + Vite (for ultra-fast builds)
- **Styling**: TailwindCSS 4 (Modern, utility-first design)
- **Visualization**: 
    - **Recharts**: For fraud trends and risk distribution analytics.
    - **Leaflet & React-Simple-Maps**: For the "Fraud Location Analytics" geographic mapping.
- **Icons**: Lucide-react (Clean, consistent iconography)

### ⚙️ Backend (The Hub)
- **Framework**: Java Spring Boot 3
- **Database**: MySQL (For persistent storage of Users, Transactions, and Communication Logs)
- **ORM**: Spring Data JPA / Hibernate
- **Communication**: RESTful APIs with JSON payloads
- **Security**: Role-Based Access Control (RBAC) separating Admins and Analysts.

### 🧠 Machine Learning & Data Science
- **Language**: Python 3.x
- **Inference Engine**: FastAPI (High-performance web framework for Python)
- **Data Engineering**: Pandas & NumPy
- **Model Storage**: Joblib (Pre-trained serialization)
- **Dataset**: Trained on a **250,000 entry** dataset ([fraud_dataset_250k.csv](file:///c:/Users/B.N.MAHEEDHARACHARYA/OneDrive/Desktop/DigitalBanking/ml-service/fraud_dataset_250k.csv)) focusing on behavioral patterns, location proximity, and transaction velocity.

---

## 📡 Core Data Flow
The system processes data through a sophisticated pipeline:
1.  **Ingestion**: Frontend submits transaction data via **Axios**.
2.  **Validation**: Java Backend authenticates the request and logs it to **MySQL**.
3.  **Analysis**: Java Backend triggers a high-speed HTTP call to the **Python ML API**.
4.  **Inference**: Python processes the features (lat/long, amount, time) and returns a **Risk Score**.
5.  **Output**: Frontend visually flags the transaction as **Safe (Green)** or **Fraud (Red)** based on the ML result.

---

## 🛠️ Key Development Features
- **Real-Time Telemetry**: Custom monitoring of API response times and database latency.
- **Secure Messaging**: An integrated "Central Support Terminal" using a custom communication protocol between Analyst and Admin.
- **Dynamic Risk Adjustment**: The system doesn't just use static rules; it predicts risk based on 30+ behavioral features from the pre-trained model.
