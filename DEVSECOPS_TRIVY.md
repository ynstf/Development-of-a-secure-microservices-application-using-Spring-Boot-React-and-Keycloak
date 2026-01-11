# DevSecOps avec Trivy (Scan de Conteneurs)

Ce document explique comment utiliser **Trivy** pour analyser la sécurité des images Docker de vos microservices.

## Pourquoi Trivy ?
Trivy est un outil simple et complet pour scanner les vulnérabilités dans les conteneurs et les systèmes de fichiers.

## 1. Prérequis
Vous devez avoir Docker installé et en cours d'exécution.

Il est nécessaire d'avoir "construit" les images avec les bons noms avant de les scanner :

```powershell
docker-compose build
```

Cela va générer les images :
- `ecommerce/product-service:latest`
- `ecommerce/order-service:latest`
- `ecommerce/api-gateway:latest`
- `ecommerce/frontend:latest`

## 2. Lancer le Scan (Windows / PowerShell)

Nous avons fourni un script helper `scan_trivy.ps1`.

```powershell
.\scan_trivy.ps1
```

Ce script va :
1.  Télécharger la dernière version de l'image Docker `aquasec/trivy`.
2.  Scanner chacune des images de votre projet.
3.  Afficher un rapport des vulnérabilités **HIGH** et **CRITICAL**.

## 3. Résultats typiques

Vous verrez une sortie de tableau pour chaque image :

```text
ecommerce/product-service:latest (alpine 3.17.3)
================================================
Total: 0 (UNKNOWN: 0, LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0)
```

Si des vulnérabilités sont trouvées, elles seront listées avec leur CVE (Common Vulnerabilities and Exposures) et la version corrigée si disponible.

## 4. Intégration Continue (CI)

Dans un pipeline CI (GitLab CI, GitHub Actions), vous pouvez utiliser Trivy de la manière suivante :

```yaml
trivy_scan:
  stage: test
  image: aquasec/trivy:latest
  script:
    - trivy image --exit-code 1 --severity CRITICAL ecommerce/product-service:latest
```

L'option `--exit-code 1` permet de faire échouer le pipeline si une vulnérabilité critique est trouvée.
