$images = @(
    "ecommerce/product-service:latest",
    "ecommerce/order-service:latest",
    "ecommerce/api-gateway:latest",
    "ecommerce/frontend:latest"
)

Write-Host "Updating Trivy DB..." -ForegroundColor Cyan
# Pull the latest trivy scanner image
docker pull aquasec/trivy:latest

foreach ($img in $images) {
    Write-Host "`n===============================================" -ForegroundColor Cyan
    Write-Host "Scanning image: $img" -ForegroundColor Cyan
    Write-Host "===============================================" -ForegroundColor Cyan

    # Run scan (single line to avoid powershell backtick issues)
    docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -v trivy-cache:/root/.cache/ aquasec/trivy:latest image --no-progress --timeout 15m --scanners vuln --severity "HIGH,CRITICAL" "$img"
}

Write-Host "`nScan Complete." -ForegroundColor Green
