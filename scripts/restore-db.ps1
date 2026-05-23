param(
  [Parameter(Mandatory = $true)]
  [string]$BackupFile,
  [string]$ContainerName = "site-test-postgres-1"
)

if (-not (Test-Path $BackupFile)) {
  throw "Backup file not found: $BackupFile"
}

Write-Host "Restoring from: $BackupFile"
Get-Content -Raw $BackupFile | docker exec -i $ContainerName psql -U postgres -d posleslovie

if ($LASTEXITCODE -ne 0) {
  throw "Restore failed."
}

Write-Host "Restore completed"
