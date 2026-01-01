# Order Microservice

Microservice de gestion des commandes avec Spring Boot, PostgreSQL et Keycloak.

## 🚀 Démarrage rapide

### Structure complète du projet

```
ecommerce-microservices/
├── product-service/        # Micro-service Produit
│   ├── src/
│   ├── Dockerfile
│   └── pom.xml
├── order-service/          # Micro-service Commande
│   ├── src/
│   ├── Dockerfile
│   └── pom.xml
└── docker-compose.yml      # Orchestration complète
```

### Lancer tous les services

```bash
# Depuis la racine du projet
docker-compose up -d --build

# Vérifier les logs
docker-compose logs -f order-service
docker-compose logs -f product-service

# Arrêter tous les services
docker-compose down
```

## 📋 Services disponibles

| Service | URL | Port | Description |
|---------|-----|------|-------------|
| Product Service | http://localhost:8081 | 8081 | API de gestion des produits |
| Order Service | http://localhost:8082 | 8082 | API de gestion des commandes |
| Keycloak | http://localhost:8080 | 8080 | Serveur d'authentification |
| Product DB | localhost:5432 | 5432 | Base de données produits |
| Order DB | localhost:5433 | 5432 | Base de données commandes |

## 🔐 Utilisateurs Keycloak

| Username | Password | Rôle | Permissions |
|----------|----------|------|-------------|
| admin | admin123 | ADMIN | Toutes les opérations + voir toutes les commandes |
| client | client123 | CLIENT | Créer et voir ses propres commandes |

## 📡 API Endpoints - Order Service

### Créer une commande (CLIENT uniquement)

```bash
POST /api/orders
Content-Type: application/json
Authorization: Bearer <token>

{
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 2,
      "quantity": 1
    }
  ]
}
```

### Obtenir une commande par ID

```bash
GET /api/orders/{id}
Authorization: Bearer <token>
```

### Obtenir mes commandes (CLIENT)

```bash
GET /api/orders/my-orders
Authorization: Bearer <token>
```

### Lister toutes les commandes (ADMIN uniquement)

```bash
GET /api/orders
Authorization: Bearer <token>
```

## 🧪 Tests complets avec PowerShell

```powershell
# 1. Obtenir token CLIENT
$clientResponse = Invoke-RestMethod -Uri "http://localhost:8080/realms/ecommerce/protocol/openid-connect/token" -Method Post -Body @{
    username = "client"
    password = "client123"
    grant_type = "password"
    client_id = "product-service"
    client_secret = "VOTRE_CLIENT_SECRET"
} -ContentType "application/x-www-form-urlencoded"

$clientToken = $clientResponse.access_token

# 2. Créer une commande
$headers = @{
    Authorization = "Bearer $clientToken"
    "Content-Type" = "application/json"
}

$order = @{
    items = @(
        @{
            productId = 1
            quantity = 2
        },
        @{
            productId = 2
            quantity = 1
        }
    )
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "http://localhost:8082/api/orders" -Method Post -Headers $headers -Body $order | ConvertTo-Json

# 3. Voir mes commandes
Invoke-RestMethod -Uri "http://localhost:8082/api/orders/my-orders" -Method Get -Headers $headers | ConvertTo-Json

# 4. Obtenir token ADMIN
$adminResponse = Invoke-RestMethod -Uri "http://localhost:8080/realms/ecommerce/protocol/openid-connect/token" -Method Post -Body @{
    username = "admin"
    password = "admin123"
    grant_type = "password"
    client_id = "product-service"
    client_secret = "VOTRE_CLIENT_SECRET"
} -ContentType "application/x-www-form-urlencoded"

$adminToken = $adminResponse.access_token
$adminHeaders = @{ Authorization = "Bearer $adminToken" }

# 5. ADMIN voit toutes les commandes
Invoke-RestMethod -Uri "http://localhost:8082/api/orders" -Method Get -Headers $adminHeaders | ConvertTo-Json
```

## 🔄 Communication inter-services

Le service Order communique avec le service Product pour :
- Vérifier l'existence des produits
- Récupérer les prix actuels
- Vérifier la disponibilité du stock

**Important** : Le token JWT est propagé automatiquement lors des appels inter-services.

## 🏗️ Schéma de la base de données

### Table `orders`

| Colonne | Type | Description |
|---------|------|-------------|
| id | BIGINT | Identifiant unique |
| order_date | TIMESTAMP | Date de la commande |
| status | VARCHAR | Statut (PENDING, CONFIRMED, etc.) |
| total_amount | DECIMAL | Montant total |
| user_id | VARCHAR | ID de l'utilisateur |
| username | VARCHAR | Nom d'utilisateur |
| created_at | TIMESTAMP | Date de création |
| updated_at | TIMESTAMP | Date de modification |

### Table `order_items`

| Colonne | Type | Description |
|---------|------|-------------|
| id | BIGINT | Identifiant unique |
| order_id | BIGINT | Référence à la commande |
| product_id | BIGINT | ID du produit |
| product_name | VARCHAR | Nom du produit |
| quantity | INTEGER | Quantité |
| price | DECIMAL | Prix unitaire |

## 🔒 Sécurité

- ✅ Authentification OAuth2/OpenID Connect
- ✅ Autorisation basée sur les rôles (ADMIN, CLIENT)
- ✅ Validation JWT sur chaque requête
- ✅ Propagation du token entre services
- ✅ CLIENT ne peut voir que ses propres commandes
- ✅ ADMIN peut voir toutes les commandes

## 🐛 Debugging

### Vérifier les logs

```bash
docker-compose logs -f order-service
docker-compose logs -f product-service
```

### Accéder aux bases de données

```bash
# Order DB
docker exec -it order-db psql -U orderuser -d orderdb
SELECT * FROM orders;
SELECT * FROM order_items;

# Product DB
docker exec -it product-db psql -U productuser -d productdb
SELECT * FROM products;
```

### Health Checks

```bash
curl http://localhost:8081/actuator/health  # Product Service
curl http://localhost:8082/actuator/health  # Order Service
```

## 📊 Flux de création de commande

1. CLIENT envoie une demande de commande avec les produits et quantités
2. Order Service reçoit la requête avec le token JWT
3. Pour chaque produit :
    - Appel au Product Service avec propagation du token
    - Vérification de l'existence du produit
    - Vérification du stock disponible
    - Récupération du prix actuel
4. Calcul du montant total
5. Sauvegarde de la commande dans la base de données
6. Retour de la commande créée

## ⚠️ Gestion des erreurs

- **404** : Produit non trouvé
- **400** : Stock insuffisant
- **401** : Non authentifié
- **403** : Non autorisé
- **500** : Erreur serveur

## 🎯 Matrice des permissions

| Endpoint | Méthode | ADMIN | CLIENT |
|----------|---------|-------|--------|
| `/api/orders` | POST | ❌ | ✅ |
| `/api/orders/{id}` | GET | ✅ (toutes) | ✅ (siennes) |
| `/api/orders/my-orders` | GET | ❌ | ✅ |
| `/api/orders` | GET | ✅ | ❌ |

## 🚀 Prochaines étapes

1. Implémenter l'**API Gateway** (Spring Cloud Gateway)
2. Créer le **Frontend React**
3. Ajouter le **Circuit Breaker** (Resilience4j)
4. Intégrer **SonarQube** pour l'analyse de code
5. Ajouter **OWASP Dependency-Check**
6. Scanner les images Docker avec **Trivy**