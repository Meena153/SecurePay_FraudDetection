# Java Email Logic Documentation - Digital Banking Fraud Detection

This document explains the technical implementation of email services within the Java Spring Boot backend of the Digital Banking Fraud Detection system.

## 1. Core Service: `EmailService.java`
**Path:** `src/main/java/com/meena/frauddetection/service/EmailService.java`

This is the primary class responsible for constructing and dispatching emails. It uses Spring's `JavaMailSender` to communicate with the SMTP server.

### Key Logic:
- **`sendFraudAlert(to, transactionId, amount, riskLevel)`**:
    - Uses `SimpleMailMessage` for lightweight text alerts.
    - **Logic**: It uses a conditional block (`if-else if`) to select the appropriate **Subject** and **Body template** based on the risk level (`HIGH`, `MEDIUM`, or `SAFE`).
    - **Error Handling**: Wrapped in a try-catch block to ensure that if an email fails to send, it doesn't crash the entire transaction process.

- **`sendWelcomeEmail(toEmail, username, role, password)`**:
    - Uses `MimeMessage` and `MimeMessageHelper` to send **HTML formatted** content.
    - **Logic**: It generates a premium, CSS-styled HTML body for a professional onboarding experience.
    - Includes account credentials and basic onboarding instructions.

---

## 2. Triggering Fraud Alerts: `TransactionController.java`
**Path:** `src/main/java/com/meena/frauddetection/controller/TransactionController.java`

Fraud alerts are sent as part of the transaction processing lifecycle.

### Key Logic:
- **`checkAndSendAlert(PaymentTransaction tx)`**:
    - This private method is called after every transaction is processed.
    - **Setting Check**: It first checks the `isEmailAlertEnabled` flag (which can be toggled via the Admin dashboard).
    - **Condition**: It only triggers the service if the risk level is recognized (`HIGH`, `MEDIUM`, or `SAFE`).
    - **Telemetry**: It records the "Alert Dispatch Latency" to the `PerformanceTracker` to measure how long the SMTP server takes to respond.

---

## 3. Triggering Welcome Emails: `UserController.java`
**Path:** `src/main/java/com/meena/frauddetection/controller/UserController.java`

Welcome emails are sent when a new administrative or analyst account is created.

### Key Logic:
- **`createUser(User user)`**:
    - When a POST request is made to create a user, the system saves the user to the database first.
    - **Immediate Dispatch**: Once the user is successfully saved, `emailService.sendWelcomeEmail(...)` is invoked with the provided credentials.
    - This ensures that a new team member receives their login details instantly via their registered email.

---

## 4. Configuration: `application.properties`
**Path:** `src/main/resources/application.properties`

The low-level connection details are managed here.

### Key Properties:
- `spring.mail.host`: Usually `smtp.gmail.com` for development.
- `spring.mail.port`: `587` (TLs).
- `spring.mail.username`: The sender email address.
- `spring.mail.password`: The App Password (not the actual account password for security).
- `app.fraud.alert-recipient`: The default email address where all high-risk fraud alerts are sent for monitoring.

---

## Summary Flow
1. **Admin/User action** (New User or Transaction).
2. **Controller** receives request and processes data.
3. **Controller** calls `EmailService`.
4. **EmailService** formats the message based on risk/type.
5. **JavaMailSender** transmits the packet to the SMTP provider.
6. **Telemetry** captures the dispatch time for the dashboard HUD.
