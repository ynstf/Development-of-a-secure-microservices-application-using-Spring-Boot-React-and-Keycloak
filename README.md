# Secure Microservices E-Commerce Application

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
    git clone https://github.com/your-username/secure-microservices-ecommerce.git
    cd secure-microservices-ecommerce
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

![Products Page](C:/Users/pc/.gemini/antigravity/brain/3b142bbc-6eb3-4203-8490-20d80830b258/products_page_client_1768166267026.png)

### Admin View: Orders
Administrators can view and manage customer orders.

![Orders Page](C:/Users/pc/.gemini/antigravity/brain/3b142bbc-6eb3-4203-8490-20d80830b258/orders_page_admin_1768166283707.png)

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
![SonarQube Dashboard](C:/Users/pc/.gemini/antigravity/brain/3b142bbc-6eb3-4203-8490-20d80830b258/sonarqube_dashboard_mockup_1768166300940.png)

### 2. Container Security (Trivy)
Scans Docker images for OS and library vulnerabilities.

**Run Scan:**
```powershell
.\scan_trivy.ps1
```

**Results Interface:**
![Trivy Scan Results](C:/Users/pc/.gemini/antigravity/brain/3b142bbc-6eb3-4203-8490-20d80830b258/trivy_scan_results_mockup_1768166317498.png)

### 3. Dependency Scanning (OWASP)
detects publicly disclosed vulnerabilities contained within project dependencies.

**Run Scan:**
```powershell
.\scan_dependency_check.ps1
```

---

## 📄 API Documentation

*   **Product Service**: `http://localhost:8081/swagger-ui.html`
*   **Order Service**: `http://localhost:8082/swagger-ui.html`