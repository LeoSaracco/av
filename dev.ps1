# AV Fitness - Dev Script (Windows PowerShell)

$ErrorActionPreference = "Stop"

Write-Host "==> Starting AV Fitness local environment..." -ForegroundColor Green
Write-Host ""

docker-compose down --remove-orphans 2>$null
docker-compose up -d --build

Write-Host ""
Write-Host "==> Waiting for services to be healthy..." -ForegroundColor Yellow

$maxWait = 120
$elapsed = 0
while ($elapsed -lt $maxWait) {
    $backendHealth = docker inspect --format='{{.State.Health.Status}}' av-backend 2>$null
    $frontendRunning = docker inspect --format='{{.State.Status}}' av-frontend 2>$null
    if ($backendHealth -eq "healthy" -and $frontendRunning -eq "running") {
        Write-Host ""
        Write-Host "==> All services ready!" -ForegroundColor Green
        Write-Host "    Backend:  http://localhost:8080"
        Write-Host "    Frontend: http://localhost:5173"
        Write-Host "    Health:   http://localhost:8080/actuator/health"
        Write-Host ""
        Write-Host "==> Showing logs (Ctrl+C to exit)..." -ForegroundColor Gray
        docker-compose logs -f
        exit 0
    }
    Start-Sleep -Seconds 2
    $elapsed += 2
    Write-Host -NoNewline "."
}

Write-Host ""
Write-Host "==> Timeout waiting for services. Check: docker-compose ps" -ForegroundColor Red
docker-compose ps
