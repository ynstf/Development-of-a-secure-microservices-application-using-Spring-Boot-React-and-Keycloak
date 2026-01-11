# Analyse des Dépendances (OWASP Dependency-Check)

Ce document explique comment vérifier si les bibliothèques (JARs) utilisées dans votre projet contiennent des vulnérabilités connues (CVE).

## 1. Comment lancer l'analyse

Un script PowerShell a été créé pour automatiser l'analyse sur tous les microservices (`product`, `order`, `gateway`).

```powershell
.\scan_dependency_check.ps1
```

Ce script va :
1.  Parcourir chaque service.
2.  Exécuter `mvn dependency-check:check`.
3.  Télécharger la base de données des vulnérabilités du NVD (National Vulnerability Database) - *La première fois, cela peut être long (5-10 mins)*.
4.  Générer un rapport HTML.

## 2. Consulter les Rapports

Une fois l'analyse terminée, ouvrez les fichiers HTML suivants dans votre navigateur :

*   **Product Service** : `product/target/dependency-check-report/dependency-check-report.html`
*   **Order Service** : `order/target/dependency-check-report/dependency-check-report.html`
*   **API Gateway** : `gateway/target/dependency-check-report/dependency-check-report.html`

## 3. Comprendre le Rapport

Le rapport liste toutes les dépendances vulnérables.

*   **Dependency** : Le fichier JAR concerné.
*   **CVE** : L'identifiant de la faille (ex. CVE-2023-1234).
*   **Severity** : La gravité (Low, Medium, High, Critical).

### Comment corriger ?
Si une vulnérabilité est trouvée :
1.  Identifiez la bibliothèque en cause.
2.  Mettez à jour sa version dans le `pom.xml` (ou la version de Spring Boot si c'est une dépendance tranisitve gérée par le parent).
