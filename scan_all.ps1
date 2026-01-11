$projects = @("product", "order", "gateway")
$sonarToken = "sqp_5bfe521896505b24bd935b8520ddefc0fb655fbc"
$sonarHost = "http://localhost:9000"

foreach ($project in $projects) {
    Write-Host "Analyzing '$project'..." -ForegroundColor Cyan
    Push-Location $project
    
    # We use ./mvnw.cmd because 'mvn' is not installed globally
    # We MUST append the project name to the key, otherwise SonarQube will overwrite
    # the results of the previous service with the current one.
    $projectKey = "ecommerce-app"
    $projectName = "E-Commerce Microservices"
    
    # Using 'cmd /c' to run the batch file from PowerShell
    cmd /c ".\mvnw.cmd clean verify org.sonarsource.scanner.maven:sonar-maven-plugin:sonar -Dsonar.projectKey=$projectKey -Dsonar.projectName=`"$projectName`" -Dsonar.host.url=$sonarHost -Dsonar.token=$sonarToken -DskipTests"
        
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error analyzing $project" -ForegroundColor Red
    }
    else {
        Write-Host "Successfully analyzed $project" -ForegroundColor Green
    }
    
    Pop-Location
}

Write-Host "All analyses completed." -ForegroundColor Green
