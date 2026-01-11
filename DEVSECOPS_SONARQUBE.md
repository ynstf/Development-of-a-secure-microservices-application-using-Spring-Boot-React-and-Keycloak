# DevSecOps avec SonarQube (Analyse Statique)

Ce document explique comment utiliser SonarQube pour analyser la sécurité et la qualité du code de vos microservices.

## Pourquoi SonarQube ?

L'intégration de SonarQube permet de mettre en place une démarche **DevSecOps** complète en détectant tôt (Shift Left) :
1.  **Vulnérabilités de sécurité** (ex. Injection SQL, XSS, mauvais usage de la crypto).
2.  **Bugs** qui pourraient causer des erreurs d'exécution.
3.  **Dette technique** (Code Smells, complexité cyclomatique élevée).

## 1. Prérequis

Assurez-vous que l'ensemble de la stack Docker tourne :

```bash
docker-compose up -d
```

Vérifiez que SonarQube est accessible à l'adresse : [http://localhost:9000](http://localhost:9000).

*Note : Le démarrage initial de SonarQube peut prendre 1 à 2 minutes.*

## 2. Configuration Initiale

1.  **Connexion** :
    *   Login : `admin`
    *   Password : `admin` (Vous serez invité à le changer, mettez par exemple `admin123`).
2.  **Créer un projet manuel** :
    *   Allez dans "Create Project" > "Manually".
    *   **Project Key** : `ecommerce-app`
    *   **Display Name** : `E-Commerce Microservices`
    *   Cliquez sur "Set Up".
3.  **Générer un Token** :
    *   Choisissez "Locally".
    *   Donnez un nom au token (ex. `maven-analysis`).
    *   **Copiez le token généré**.

## 3. Lancer l'Analyse (Scan)

Vous pouvez lancer l'analyse directement depuis la racine du projet ou pour chaque microservice. Comme vos projets utilisent Maven, la commande est simple.

### Option A : Analyser tout (si configuré avec un POM parent, sinon Option B recommandée)

Si vous n'avez pas de POM parent unifiant les modules, analysez chaque service individuellement.

### Option B : Analyser un service spécifique (ex. Product Service)

Ouvrez un terminal dans le dossier `product` :

```bash
cd product
mvn clean verify sonar:sonar \
  -Dsonar.projectKey=ecommerce-product \
  -Dsonar.projectName="Product Service" \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.token=VOTRE_TOKEN_ICI
```

Répétez pour `order` ou `gateway`.

## 4. Analyser les Résultats

Une fois la commande terminée, retournez sur [http://localhost:9000](http://localhost:9000).

Vous verrez un tableau de bord indiquant :
*   **Security Hotspots** : Zones de code sensibles à revoir (ex. Configuration de sécurité, gestion des mots de passe).
*   **Vulnerabilities** : Failles confirmées.
*   **Bugs** : Erreurs logiques.
*   **Code Smells** : Code malpropre ou difficile à maintenir.

## 5. Intégration Continue (CI)

Dans un environnement de production (ex. GitLab CI, Jenkins, GitHub Actions), cette commande `mvn sonar:sonar` serait exécutée automatiquement à chaque "Push" pour empêcher le code vulnérable d'être déployé.
