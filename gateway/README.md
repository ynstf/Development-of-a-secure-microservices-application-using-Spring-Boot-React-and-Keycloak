# API Gateway - E-commerce Microservices

Point d'entrée unique pour tous les microservices avec Spring Cloud Gateway.

## 🎯 Responsabilités

- ✅ Point d'entrée unique pour le frontend
- ✅ Validation des tokens JWT
- ✅ Routage vers les microservices
- ✅ Centralisation de la sécurité
- ✅ Gestion CORS
- ✅ Logging centralisé
- ✅ Aucune logique métier

## 🚀 Démarrage

### Lancer avec Docker Compose

```bash
# Depuis la racine du projet
docker-compose up -d --build

# Vérifier les logs
docker-compose logs -f api-gateway
```

### Lancer localement (développement)

```bash
cd api-gateway
mvn spring-boot:run
```

## 📡 Routes Configurées

| Route | Destination | Port | Description |
|-------|-------------|------|-------------|
| `/api/products/**` | Product Service | 8081 | Gestion des produits |
| `/api/orders/**` | Order Service | 8082 | Gestion des commandes |
| `/realms/ecommerce/protocol/openid-connect/**` | Keycloak | 8080 | Authentification |

## 🔐 Sécurité

### Authentication Flow

1. **Frontend** → API Gateway (`POST /realms/ecommerce/protocol/openid-connect/token`)
2. **Gateway** → Keycloak (forward request)
3. **Keycloak** → Gateway → **Frontend** (return JWT token)
4. **Frontend** → Gateway (`GET /api/products` with Bearer token)
5. **Gateway** validates JWT → forwards to Product Service
6. **Product Service** validates JWT again → returns data

### Double Validation

```
┌─────────┐     JWT      ┌─────────┐     JWT      ┌─────────┐
│Frontend │ ──────────>  │ Gateway │ ──────────>  │ Service │
└─────────┘              └─────────┘              └─────────┘
                            ✓ Validate              ✓ Validate
```

**Avantages** :
- ✅ Defense in depth (sécurité en profondeur)
- ✅ Services protégés même si accès direct
- ✅ Conformité aux standards de sécurité

## 🧪 Tests via API Gateway

### 1. Obtenir un token via Gateway

```bash
curl -X POST "http://localhost:8083/realms/ecommerce/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password" \
  -d "client_id=product-service" \
  -d "client_secret=YOUR_SECRET" \
  -d "username=client" \
  -d "password=client123"
```

### 2. Accéder aux produits via Gateway

```bash
curl -X GET "http://localhost:8083/api/products" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Créer une commande via Gateway

```bash
curl -X POST "http://localhost:8083/api/orders" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": 1,
        "quantity": 2
      }
    ]
  }'
```

## ⚠️ Règles Importantes

### ❌ Accès Direct Interdit

```
Frontend ──X──> Product Service (Port 8081)  ❌ INTERDIT
Frontend ──X──> Order Service (Port 8082)    ❌ INTERDIT
```

### ✅ Accès via Gateway Uniquement

```
Frontend ──✓──> API Gateway (Port 8083) ──> Services  ✅ OBLIGATOIRE
```

## 📊 Architecture de Routage

```
                    ┌──────────────┐
                    │   Frontend   │
                    │ (React/Web)  │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ API Gateway  │
                    │  Port 8083   │
                    └──────┬───────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
            ▼              ▼              ▼
    ┌──────────┐   ┌──────────┐   ┌──────────┐
    │ Product  │   │  Order   │   │Keycloak  │
    │ Service  │   │ Service  │   │   Auth   │
    │  :8081   │   │  :8082   │   │  :8080   │
    └──────────┘   └──────────┘   └──────────┘
```

## 🔄 Flux de Requête Complet

### Scénario : CLIENT crée une commande

```
1. Frontend envoie: POST http://localhost:8083/api/orders
   Headers: Authorization: Bearer <token>
   
2. Gateway reçoit la requête
   ├─ Valide le JWT token
   ├─ Extrait les rôles (CLIENT)
   ├─ Log la requête
   └─ Route vers Order Service
   
3. Order Service reçoit la requête
   ├─ Valide le JWT token (2e validation)
   ├─ Vérifie le rôle CLIENT
   ├─ Appelle Product Service pour vérifier stock
   │  └─ Product Service valide le JWT aussi
   └─ Crée la commande
   
4. Réponse remonte
   Order Service → Gateway → Frontend
```

## 🛡️ Filters Appliqués

### Global Filters (tous les routes)

1. **LoggingFilter** : Log toutes les requêtes/réponses
2. **CorsFilter** : Gère les requêtes CORS
3. **DedupeResponseHeader** : Évite les headers dupliqués

### Route-Specific Filters

1. **RemoveRequestHeader** : Supprime les cookies sensibles
2. **CircuitBreaker** : Protection contre les services down (optionnel)

## 📝 Configuration des Routes

Deux méthodes possibles :

### Méthode 1 : application.properties (Utilisée)

```properties
spring.cloud.gateway.routes[0].id=product-service
spring.cloud.gateway.routes[0].uri=http://localhost:8081
spring.cloud.gateway.routes[0].predicates[0]=Path=/api/products/**
```

### Méthode 2 : Programmatique (GatewayConfig.java)

```java
@Bean
public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
    return builder.routes()
        .route("product-service", r -> r
            .path("/api/products/**")
            .uri("http://localhost:8081"))
        .build();
}
```

## 🔍 Monitoring & Debugging

### Actuator Endpoints

```bash
# Health check
curl http://localhost:8083/actuator/health

# Gateway routes
curl http://localhost:8083/actuator/gateway/routes

# Gateway metrics
curl http://localhost:8083/actuator/metrics
```

### Logs

```bash
# Voir les logs en temps réel
docker-compose logs -f api-gateway

# Logs avec détails de routage
docker-compose logs api-gateway | grep "Incoming Request"
```

## 🐛 Troubleshooting

| Problème | Solution |
|----------|----------|
| 404 Not Found | Vérifier les routes dans application.properties |
| 401 Unauthorized | Vérifier que le token est valide |
| 503 Service Unavailable | Vérifier que les services backend sont lancés |
| CORS Error | Vérifier CorsConfig.java allowedOrigins |
| Connection refused | Vérifier les URLs des services |

## ⚙️ Variables d'Environnement

| Variable | Description | Défaut |
|----------|-------------|--------|
| `MICROSERVICES_PRODUCT_SERVICE_URL` | URL Product Service | `http://localhost:8081` |
| `MICROSERVICES_ORDER_SERVICE_URL` | URL Order Service | `http://localhost:8082` |
| `SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_ISSUER_URI` | Keycloak Issuer | `http://localhost:8080/realms/ecommerce` |

## 🎯 Matrice de Sécurité

| Endpoint | Auth Required | Roles | Validation |
|----------|---------------|-------|------------|
| `GET /api/products` | ✅ | ADMIN, CLIENT | Gateway + Service |
| `POST /api/products` | ✅ | ADMIN | Gateway + Service |
| `POST /api/orders` | ✅ | CLIENT | Gateway + Service |
| `GET /api/orders` | ✅ | ADMIN | Gateway + Service |
| `POST /realms/.../token` | ❌ | Public | None |
| `/actuator/health` | ❌ | Public | None |

## 📦 Dépendances Clés

- **Spring Cloud Gateway** : Routage et filtres
- **Spring Security OAuth2** : Validation JWT
- **Spring Boot Actuator** : Monitoring
- **WebFlux** : Support réactif (requis par Gateway)
- **Lombok** : Réduction boilerplate

## 🚀 Prochaines Étapes

1. ✅ Gateway fonctionnel
2. ⬜ Ajouter Circuit Breaker (Resilience4j)
3. ⬜ Ajouter Rate Limiting
4. ⬜ Implémenter Request/Response caching
5. ⬜ Ajouter distributed tracing (Zipkin)
6. ⬜ Créer le Frontend React

## 📊 Performance

- **Latency** : ~10-50ms overhead
- **Throughput** : Dépend des services backend
- **Scalability** : Stateless, peut être répliqué

## ✅ Checklist de Validation

- [ ] Gateway démarre sans erreur
- [ ] Routes vers Product Service fonctionnent
- [ ] Routes vers Order Service fonctionnent
- [ ] Validation JWT fonctionne
- [ ] CORS configuré pour le frontend
- [ ] Logs affichent les requêtes/réponses
- [ ] Health check accessible
- [ ] Accès direct aux services est interdit (firewall/network)
- [ ] Double validation JWT (Gateway + Services)