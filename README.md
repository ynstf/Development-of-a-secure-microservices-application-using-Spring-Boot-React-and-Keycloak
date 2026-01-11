# Secure Microservices E-Commerce Application

<img width="1318" height="277" alt="image_1" src="https://github.com/user-attachments/assets/b92c888b-0542-4977-97f0-ff3c9ad0e144" />


A robust, secure e-commerce platform built with **Spring Boot Microservices**, **React**, **Keycloak** (OAuth2/OIDC), and a comprehensive **DevSecOps** pipeline offering static analysis (SonarQube) and container scanning (Trivy).

---

## 🏗️ Architecture

The application follows a microservices architecture pattern, orchestrating distinct services for specific business domains.

```mermaid
graph TD
    subgraph Client
        Browser[React Frontend]
    end

    subgraph "API Gateway Layer"
        Gateway[Spring Cloud Gateway :8083]
    end

    subgraph "Security Layer"
        Keycloak[Keycloak IAM :8080]
    end

    subgraph "Microservices Layer"
        Product[Product Service :8081]
        Order[Order Service :8082]
    end

    subgraph "Data Layer"
        ProductDB[(PostgreSQL - Product)]
        OrderDB[(PostgreSQL - Order)]
        KeycloakDB[(PostgreSQL - Keycloak)]
    end

    subgraph "DevSecOps"
        Sonar[SonarQube]
        Trivy[Trivy Scanner]
    end

    Browser -->|HTTPS/REST| Gateway
    Gateway -->|Auth Check| Keycloak
    Gateway -->|Route| Product
    Gateway -->|Route| Order
    
    Product -->|JDBC| ProductDB
    Order -->|JDBC| OrderDB
    Keycloak -->|JDBC| KeycloakDB
    Order -->|REST| Product
```

---

## 🚀 Key Features

*   **Microservices**: Decoupled Product and Order services.
*   **Security**: Centralized Identity & Access Management (IAM) with Keycloak.
*   **API Gateway**: Unified entry point for routing and load balancing.
*   **Frontend**: Modern React UI for customers and administrators.
*   **Observability**: Centralized logging and monitoring ready.
*   **DevSecOps**:
    *   **SAST**: SonarQube integration for code quality and security hotspots.
    *   **Container Security**: Trivy scanning for Docker image vulnerabilities.
    *   **SCA**: OWASP Dependency-Check for library vulnerabilities.

---

## 🛠️ Technology Stack

| Component | Technology |
| :--- | :--- |
| **Backend** | Java 21, Spring Boot 3.2, Spring Cloud Gateway |
| **Frontend** | React.js, Bootstrap / Tailwind |
| **Security** | Keycloak, OAuth2, OpenID Connect |
| **Database** | PostgreSQL 15 |
| **Containerization** | Docker, Docker Compose |
| **DevOps** | Maven, SonarQube, Trivy, OWASP Dependency-Check |

---

## 📋 Prerequisites

*   **Docker Desktop**: Installed and running.
*   **Java 21**: Installed (for local development).
*   **Node.js**: Installed (for frontend development).

---

## ⚙️ Installation & Setup

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/ynstf/Development-of-a-secure-microservices-application-using-Spring-Boot-React-and-Keycloak.git
    cd Development-of-a-secure-microservices-application-using-Spring-Boot-React-and-Keycloak
    ```

2.  **Build and Start Services**
    Use Docker Compose to bring up the entire stack (Databases, Keycloak, Backend, Frontend, SonarQube).
    ```bash
    docker-compose up -d --build
    ```

3.  **Access the Application**
    *   **Frontend**: [http://localhost:3000](http://localhost:3000)
    *   **Keycloak Admin**: [http://localhost:8080](http://localhost:8080) (user: `admin`, pass: `admin`)
    *   **SonarQube**: [http://localhost:9000](http://localhost:9000) (user: `admin`, pass: `admin`)

---

## 🖥️ User Interface

### Client View: Products
Customers can browse products and add them to their cart.

<img width="1281" height="637" alt="image" src="https://github.com/user-attachments/assets/ea30780e-65f1-441c-bf49-3d4a8829c6b4" />


### Admin View: Orders
Administrators can view and manage customer orders.

<img width="1286" height="524" alt="image" src="https://github.com/user-attachments/assets/a182ca98-3223-483c-95f4-0b7263a1b7eb" />

<img width="1276" height="636" alt="image" src="https://github.com/user-attachments/assets/d47ce1bb-3243-4e61-b177-d297eb451fe9" />


### Order Process Flow (Sequence Diagram)
How an order is placed and processed through the system:

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Gateway
    participant Keycloak
    participant OrderService
    participant ProductService
    participant Database

    User->>Frontend: Click "Place Order"
    Frontend->>Gateway: POST /api/orders (Bearer Token)
    Gateway->>Keycloak: Validate Token
    Keycloak-->>Gateway: Token Valid
    Gateway->>OrderService: Forward Request
    OrderService->>ProductService: Check Inventory (Product ID)
    ProductService-->>OrderService: Inventory Available
    OrderService->>Database: Save Order Status "CREATED"
    OrderService-->>Gateway: Order Created (201 Created)
    Gateway-->>Frontend: Order Confirmation
    Frontend-->>User: Show Success Message
```

---

## 🛡️ DevSecOps & Security Scanning

We implement a **Shift-Left** security strategy integration testing tools directly into the development workflow.

### 1. Static Analysis (SonarQube)
Code quality and security hotspots analysis.

**Run Analysis:**
```powershell
.\scan_all.ps1
```

**Dashboard:**
<img width="1338" height="642" alt="sonar 1" src="https://github.com/user-attachments/assets/a0b60804-2278-4b03-9b43-e3eb9a7c07e0" />

<img width="907" height="519" alt="sonar 2" src="https://github.com/user-attachments/assets/ac03c42c-180c-4bb3-8867-8c4d70f300ed" />

<img width="1200" height="488" alt="sonar 3" src="https://github.com/user-attachments/assets/6c4be4d1-59be-4158-a3af-0b7327167689" />


### 2. Container Security (Trivy)
Scans Docker images for OS and library vulnerabilities.

**Run Scan:**
```powershell
.\scan_trivy.ps1
```

**Results Interface:**

<img width="951" height="246" alt="image" src="https://github.com/user-attachments/assets/9688e5ea-d696-4c11-9428-f49e09e7368a" />

<img width="978" height="702" alt="image" src="https://github.com/user-attachments/assets/cdf3d0c2-a973-4685-9d3f-52d599667dd8" />

<img width="786" height="625" alt="image" src="https://github.com/user-attachments/assets/fcba3091-e576-475b-865c-79390ceaeb6a" />

<img width="604" height="168" alt="image" src="https://github.com/user-attachments/assets/92fc9534-e6a3-4cb1-9ce5-0c74c4de12de" />


### 3. Dependency Scanning (OWASP)
detects publicly disclosed vulnerabilities contained within project dependencies.

**Run Scan:**
```powershell
.\scan_dependency_check.ps1
```
