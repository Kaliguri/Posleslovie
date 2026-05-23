param(
  [string]$BackupDir = ".\backups",
  [string]$ContainerName = "site-test-postgres-1"
)

if (-not (Test-Path $BackupDir)) {
  New-Item -ItemType Directory -Path $BackupDir | Out-Null
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupFile = Join-Path $BackupDir "posleslovie-$timestamp.sql"

Write-Host "Creating backup: $backupFile"
docker exec $ContainerName pg_dump -U postgres -d posleslovie > $backupFile

if ($LASTEXITCODE -ne 0) {
  throw "Backup failed."
}

Write-Host "Backup completed: $backupFile"
