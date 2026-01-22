# Smart Vendor Billing - Run Guide

## 1. Prerequisites
*   **Java 17+** installed (`java -version`)
*   **Maven** installed (`mvn -version`) - *Optional if using wrapper*
*   **PostgreSQL** installed and running on port `5432`

## 2. Database Setup (One-Time)
Run this SQL command in pgAdmin or terminal to create the database:
```sql
CREATE DATABASE smart_reconcile_db;
```
*   **User:** `postgres`
*   **Password:** `postgres`
*   *(If your password is different, update `src/main/resources/application.properties`)*

## 3. How to Run the Application

### Option A: Using Maven (Command Line)
Open a terminal in the project root (`backend/`) and run:
```bash
mvn spring-boot:run
```

### Option B: Using JAR File (Production Mode)
```bash
mvn clean package -DskipTests
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

### Option C: Using Docker
```bash
docker-compose up --build
```

## 4. Verification Check
Once the app starts (look for `Started SmartReconciliationApplication`):
1.  **Health Check:** Open [http://localhost:8080/actuator/health](http://localhost:8080/actuator/health) -> Should return `{"status":"UP"}`.
2.  **Swagger UI:** Open [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) -> Should show API docs.

## 5. First-Run Checklist (API Flow)
The system auto-creates an Admin user on startup (`DataInitializer.java`).

**Step 1: Login**
*   **URL:** `POST http://localhost:8080/api/auth/signin`
*   **Body:**
    ```json
    {
      "username": "admin",
      "password": "admin123"
    }
    ```
*   **Response:** Copy the `accessToken` (JWT).

**Step 2: Create a Vendor**
*   **URL:** `POST http://localhost:8080/api/vendors`
*   **Auth:** Bearer Token `{accessToken}`
*   **Body:**
    ```json
    {
      "name": "Tech Corp",
      "email": "billing@techcorp.com",
      "taxId": "US-123456"
    }
    ```
*   **Response:** Note the `id` (e.g., 1).

**Step 3: Create an Invoice**
*   **URL:** `POST http://localhost:8080/api/invoices`
*   **Auth:** Bearer Token
*   **Body:**
    ```json
    {
      "vendorId": 1,
      "invoiceNumber": "INV-2024-001",
      "amountTotal": 1000.00,
      "dueDate": "2024-12-31"
    }
    ```

**Step 4: Add a Payment**
*   **URL:** `POST http://localhost:8080/api/payments`
*   **Auth:** Bearer Token
*   **Body:**
    ```json
    {
      "vendorId": 1,
      "amount": 1000.00,
      "transactionRef": "TXN-999"
    }
    ```

**Step 5: Run Reconciliation**
*   **URL:** `POST http://localhost:8080/api/reconciliation/run`
*   **Auth:** Bearer Token
*   **Body:** (Empty JSON) `{}`.
*   **Result:** The Invoice status will change to `PAID`.

## 6. Troubleshooting
### "mvn is not recognized"
*   You must install Maven manually: https://maven.apache.org/install.html
*   Add the `bin` directory of Maven to your System `PATH`.
*   Restart your terminal.

### "Docker error during connect"
*   Ensure **Docker Desktop** is running.
*   Run `docker ps` to verify connectivity.
