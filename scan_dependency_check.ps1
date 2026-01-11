$projects = @("product", "order", "gateway")

Write-Host "Starting OWASP Dependency-Check Analysis..." -ForegroundColor Cyan

foreach ($project in $projects) {
    Write-Host "`n===============================================" -ForegroundColor Cyan
    Write-Host "Analyzing '$project'..." -ForegroundColor Cyan
    Write-Host "===============================================" -ForegroundColor Cyan
    
    Push-Location $project
    
    # Run dependency-check using Maven wrapper
    # -DskipTests to speed up and avoid DB connection issues
    cmd /c ".\mvnw.cmd dependency-check:check -DskipTests"
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error analyzing $project" -ForegroundColor Red
    }
    else {
        Write-Host "Success: Report generated at $project/target/dependency-check-report/dependency-check-report.html" -ForegroundColor Green
    }
    
    Pop-Location
}

Write-Host "`nAll analyses completed." -ForegroundColor Green
