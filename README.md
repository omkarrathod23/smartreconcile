# 🚀 SmartReconcile: Intelligent Vendor Billing & Reconciliation

![SmartReconcile Hero](docs/images/hero-banner.png)

> **Transforming B2B Financial Operations with Automated Precision.**

SmartReconcile is a state-of-the-art **Vendor Billing and Payment Reconciliation** platform designed to eliminate manual data entry, reduce financial discrepancies, and streamline the accounts payable process. Built with a robust **Spring Boot** backend and a premium **Next.js** frontend, it provides an end-to-end solution for modern enterprises.

---

## 🌟 Key Features

### 🔐 Multi-Tier Security & Isolation
- **Granular RBAC**: Four distinct roles (Admin, Finance Manager, Accounts Executive, Vendor User) with strictly enforced boundaries.
- **Vendor Isolation**: Proprietary data isolation logic ensures vendors can only access their own history, preventing cross-tenant data leaks.

### 📄 Intelligent Invoice Management
- **Cloudinary Integration**: Secure, cloud-native storage for invoice PDFs and receipts.
- **Dynamic Forms**: Modern, drag-and-drop interfaces for effortless billing submission.
- **Real-time Status Tracking**: Instant visibility into "Pending", "Approved", and "Paid" statuses.

### 🤖 Automated Reconciliation
- **FIFO Strategy**: Advanced First-In-First-Out matching algorithm that automatically links payments to outstanding invoices.
- **Discrepancy Detection**: Real-time identification of partial payments and unallocated funds.

### 📊 Financial Insights
- **Dynamic Analytics**: Interactive charts powered by `Recharts` visualizing cash flow trends and vendor aging.
- **Professional Reports**: Comprehensive breakdowns of expense distribution and liability.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | ![Next.js](https://img.shields.io/badge/Next.js-14-black) ![React](https://img.shields.io/badge/React-18-blue) ![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC) ![Recharts](https://img.shields.io/badge/Recharts-Analytics-FF6384) |
| **Backend** | ![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2-6DB33F) ![Spring Security](https://img.shields.io/badge/Spring_Security-Auth-6DB33F) ![JPA](https://img.shields.io/badge/Spring_Data-JPA-brightgreen) |
| **Storage** | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Data-336791) ![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-3448C5) |
| **DevOps** | ![Git](https://img.shields.io/badge/Git-VCS-F05032) ![Vercel](https://img.shields.io/badge/Vercel-Deployment-black) |

---

## 🏗️ System Architecture

![Flow Visualization](docs/images/flow-visualization.png)

```mermaid
graph TD
    A[Vendor User] -->|Uploads Invoice| B(Next.js Frontend)
    B -->|API Request| C{Spring Boot Backend}
    C -->|Store PDF| D[Cloudinary Storage]
    C -->|Save Record| E[(PostgreSQL DB)]
    F[Accounts Team] -->|Approves| B
    G[Bank API / CSV] -->|Record Payment| C
    C -->|Run FIFO Match| H[[Reconciliation Engine]]
    H -->|Update Status| E
```

---

## 🧑‍💻 Getting Started

### Prerequisites
- **Java 17+**
- **Node.js 18+**
- **PostgreSQL** instance
- **Cloudinary** account (for file uploads)

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/omkarrathod23/smartreconcile.git
   cd smartreconcile
   ```

2. **Backend Setup**
   Configure `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/smartreconcile
   cloudinary.cloud-name=your_name
   cloudinary.api-key=your_key
   cloudinary.api-secret=your_secret
   ```
   Run the backend:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## 👥 Role Definitions

| Role | Access Level | Responsibilities |
| :--- | :--- | :--- |
| **Admin** | Superuser | System configuration, User management, Auditing. |
| **Finance Manager** | Management | Approval flows, Reconciliation trigger, High-level reports. |
| **Accounts Executive** | Operations | Daily transaction entry, Vendor communications, Payment tracking. |
| **Vendor User** | Self-Service | Invoice submission, Payment tracking, Profile management. |

---

## 📈 Roadmap
- [x] Cloudinary File Upload Integration
- [x] Role-Based Data Isolation
- [x] Intelligent FIFO Reconciliation
- [ ] Multi-Currency Support
- [ ] AI-Powered Document OCR
- [ ] Slack/Email Notification Engine

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Developed with ❤️ by the SmartReconcile Team
</p>
