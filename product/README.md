# Product Microservice

Microservice de gestion des produits avec Spring Boot, PostgreSQL et Keycloak.

## 🚀 Démarrage rapide

### Prérequis
- Docker et Docker Compose installés
- Java 17+ (pour développement local)
- Maven 3.8+ (pour développement local)

### Lancer avec Docker Compose

```bash
# Construire et démarrer tous les services
docker-compose up -d --build

# Vérifier les logs
docker-compose logs -f product-service

# Arrêter les services
docker-compose down

# Arrêter et supprimer les volumes
docker-compose down -v
```

## 📋 Services disponibles

| Service | URL | Description |
|---------|-----|-------------|
| Product Service | http://localhost:8081 | API de gestion des produits |
| PostgreSQL | localhost:5432 | Base de données des produits |
| Keycloak | http://localhost:8080 | Serveur d'authentification |

### Keycloak Admin
- **URL**: http://localhost:8080
- **Username**: admin
- **Password**: admin

## 🔐 Configuration Keycloak

### 1. Créer un Realm
1. Connectez-vous à Keycloak (admin/admin)
2. Créez un nouveau realm nommé `ecommerce`

### 2. Créer les rôles
- Créez le rôle `ADMIN`
- Créez le rôle `CLIENT`

### 3. Créer des utilisateurs
**Admin:**
- Username: admin
- Email: admin@ecommerce.com
- Rôle: ADMIN

**Client:**
- Username: client
- Email: client@ecommerce.com
- Rôle: CLIENT

### 4. Créer un client OAuth2
1. Nom: `product-service`
2. Client Protocol: `openid-connect`
3. Access Type: `confidential`
4. Valid Redirect URIs: `*`
5. Web Origins: `*`

## 📡 API Endpoints

### Products (ADMIN & CLIENT peuvent lire)

#### Créer un produit (ADMIN seulement)
```bash
POST /api/products
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Laptop Dell XPS 15",
  "description": "Ordinateur portable haute performance",
  "price": 1299.99,
  "stockQuantity": 50
}
```

#### Obtenir tous les produits
```bash
GET /api/products
Authorization: Bearer <token>
```

#### Obtenir un produit par ID
```bash
GET /api/products/{id}
Authorization: Bearer <token>
```

#### Mettre à jour un produit (ADMIN seulement)
```bash
PUT /api/products/{id}
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Laptop Dell XPS 15 Updated",
  "description": "Ordinateur portable haute performance - Nouveau modèle",
  "price": 1399.99,
  "stockQuantity": 45
}
```

#### Supprimer un produit (ADMIN seulement)
```bash
DELETE /api/products/{id}
Authorization: Bearer <token>
```

#### Rechercher des produits
```bash
GET /api/products/search?name=laptop
Authorization: Bearer <token>
```

## 🔑 Obtenir un token JWT

```bash
curl -X POST 'http://localhost:8080/realms/ecommerce/protocol/openid-connect/token' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'username=admin' \
  -d 'password=admin' \
  -d 'grant_type=password' \
  -d 'client_id=product-service' \
  -d 'client_secret=<your-client-secret>'
```

## 🧪 Tests avec cURL

```bash
# Obtenir le token
export TOKEN=$(curl -s -X POST 'http://localhost:8080/realms/ecommerce/protocol/openid-connect/token' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'username=admin' \
  -d 'password=admin' \
  -d 'grant_type=password' \
  -d 'client_id=product-service' \
  -d 'client_secret=<your-secret>' | jq -r '.access_token')

# Créer un produit
curl -X POST http://localhost:8081/api/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "description": "High performance laptop",
    "price": 1299.99,
    "stockQuantity": 50
  }'

# Lister les produits
curl -X GET http://localhost:8081/api/products \
  -H "Authorization: Bearer $TOKEN"
```

## 🏗️ Architecture

```
product-service/
├── src/
│   ├── main/
│   │   ├── java/com/ecommerce/product/
│   │   │   ├── ProductServiceApplication.java
│   │   │   ├── config/
│   │   │   │   └── SecurityConfig.java
│   │   │   ├── controller/
│   │   │   │   └── ProductController.java
│   │   │   ├── dto/
│   │   │   │   ├── ProductRequest.java
│   │   │   │   └── ProductResponse.java
│   │   │   ├── exception/
│   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   └── ProductNotFoundException.java
│   │   │   ├── model/
│   │   │   │   └── Product.java
│   │   │   ├── repository/
│   │   │   │   └── ProductRepository.java
│   │   │   └── service/
│   │   │       ├── ProductService.java
│   │   │       └── ProductServiceImpl.java
│   │   └── resources/
│   │       └── application.yml
├── Dockerfile
├── docker-compose.yml
└── pom.xml
```

## 📊 Base de données

### Schéma de la table `products`

| Colonne | Type | Description |
|---------|------|-------------|
| id | BIGINT | Identifiant unique (auto-incrémenté) |
| name | VARCHAR | Nom du produit |
| description | TEXT | Description détaillée |
| price | DECIMAL | Prix unitaire |
| stock_quantity | INTEGER | Quantité en stock |
| created_at | TIMESTAMP | Date de création |
| updated_at | TIMESTAMP | Date de dernière modification |

## 🔒 Sécurité

- ✅ Authentification OAuth2/OpenID Connect avec Keycloak
- ✅ Autorisation basée sur les rôles (ADMIN, CLIENT)
- ✅ Validation JWT sur chaque requête
- ✅ Session stateless
- ✅ Logs d'accès avec identification utilisateur
- ✅ Gestion des erreurs 401 et 403

## 🐛 Debugging

### Vérifier les logs
```bash
docker-compose logs -f product-service
```

### Accéder à la base de données
```bash
docker exec -it product-db psql -U productuser -d productdb

# Lister les produits
SELECT * FROM products;
```

### Health Check
```bash
curl http://localhost:8081/actuator/health
```

## 📝 Notes importantes

1. **Keycloak doit être configuré** avant de tester les endpoints
2. Le **client secret** doit être récupéré dans Keycloak (Clients → product-service → Credentials)
3. Les **tokens JWT expirent** (durée configurable dans Keycloak)
4. La base de données est **automatiquement initialisée** au démarrage

## 🚀 Prochaines étapes

1. Implémenter le **Micro-service Commande**
2. Ajouter l'**API Gateway** (Spring Cloud Gateway)
3. Créer le **Frontend React**
4. Intégrer **SonarQube** pour l'analyse de code
5. Ajouter **OWASP Dependency-Check**
6. Scanner les images Docker avec **Trivy**