# Comprehensive Functionality Map (Analyst vs. Admin)

> [!IMPORTANT]
> This map outlines every interactive element in the UI. Use this to demonstrate the **Separation of Duties** (SoD) implemented in the system.

---

## 🧭 Shared Functionalities (Base Terminal)
*These actions are available to all authorized personnel.*

| Functional Area | Actions & Interactions |
| :--- | :--- |
| **Real-Time Feed** | • **Manual Refresh**: Trigger immediate data sync and auto-generation.<br>• **Live Pulse**: Monitor the "Live" connectivity status and the "Auto-Gen Countdown" timer. |
| **Transaction Hub** | • **Advanced Search**: Search via Transaction ID, Sender, or Receiver ID.<br>• **Smart Filters**: Filter by status (Safe/Medium/High Risk).<br>• **Amount Filtering**: Use the Min-Max range inputs to isolate high-value threats. |
| **Exploration** | • **Detail Inspection**: Click any transaction to open the "Deep Analysis Modal" (shows behavioral metrics like latitude/longitude and precise fraud scores).<br>• **Threat Mapping**: Interact with the geographic "Threat Map" to see global fraud clustering. |
| **Analytics** | • **Performance Charts**: View interactive trend charts for fraud volume vs. safe volume. |
| **System Hygiene** | • **Theme Overlay**: Switch between high-contrast Dark Mode and Light Mode.<br>• **Secure Termination**: Gracefully logout of the session. |

---

## 🛡️ Analyst Terminal (Level 1 Clearance)
*Focused on detection, investigation, and signaling.*

| Action Category | Specific UI Functionalities |
| :--- | :--- |
| **Alert Management** | • **Global Notifications**: Use the persistent "Admin Bell" to track unread responses from Headquarters. |
| **Escalation** | • **Support Terminal**: Direct access to the `Contact Admin` tab.<br>• **Encrypted Transmission**: Draft and send messages to report system issues or request account freezes. |
| **Audit Trails** | • **Self-Audit**: View the status of your own support requests (PENDING vs. PROCESSED).<br>• **Acknowledgment**: Action the "Administrative Response Received" banner to confirm you've read Admin instructions. |

---

## ⚙️ Administrative Terminal (Level 2 Clearance)
*Focused on governance, infrastructure, and protocol execution.*

| Action Category | Specific UI Functionalities |
| :--- | :--- |
| **Identity & Access** | • **Provisioning**: Create and provision new Analysts via the "Propose New Analyst" modal.<br>• **Modification**: Edit existing user roles, emails, and permissions.<br>• **Termination**: Permanently delete users from the system Registry. |
| **Protocol Response** | • **Review Inbound**: Access the "Incoming Clearance Requests" dashboard.<br>• **Direct Response**: Provide custom text responses to analyst escalations.<br>• **Status Update**: Mark requests as "PROCESSED" or "IGNORED".<br>• **History Purge**: Use the "Trash Icon" to permanently erase transmission logs for audit cleanup. |
| **Infra Monitoring** | • **Telemetry HUD**: Access the `System Status` tab to view real-time API latency, Database speed, and Analysis duration.<br>• **Alert Dispatcher**: Direct link to the **Operational Gmail Inbox** to verify outbound fraud notifications. |
| **Global Oversight** | • **Audit Log Master**: View a comprehensive trail of all actions performed by *every* user in the system. |
