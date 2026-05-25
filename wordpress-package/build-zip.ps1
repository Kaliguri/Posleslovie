# ============================================================
# build-zip.ps1 — сборка темы posleslovie-fresh.zip
#
# Запуск: .\build-zip.ps1
# Результат: posleslovie-fresh.zip — готов к загрузке в WordPress
# ============================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$themeDir   = Join-Path $PSScriptRoot "theme\posleslovie-theme-v2"
$outputZip  = Join-Path $PSScriptRoot "posleslovie-fresh.zip"
$folderName = "posleslovie-fresh"

# Файлы, которые не попадают в архив
$skipFiles = @("_cities.js")

if (Test-Path $outputZip) { Remove-Item $outputZip -Force }

$fsStream   = New-Object System.IO.FileStream($outputZip, [System.IO.FileMode]::Create, [System.IO.FileAccess]::Write)
$zipArchive = New-Object System.IO.Compression.ZipArchive($fsStream, [System.IO.Compression.ZipArchiveMode]::Create)

$count = 0
Get-ChildItem -Recurse -File $themeDir | ForEach-Object {
    $file = $_
    if ($skipFiles -contains $file.Name) { return }
    $relPath   = $file.FullName.Substring($themeDir.Length + 1).Replace("\", "/")
    $entryName = "$folderName/$relPath"
    $entry       = $zipArchive.CreateEntry($entryName, [System.IO.Compression.CompressionLevel]::Optimal)
    $entryStream = $entry.Open()
    $fileBytes   = [System.IO.File]::ReadAllBytes($file.FullName)
    $entryStream.Write($fileBytes, 0, $fileBytes.Length)
    $entryStream.Close()
    $count++
}

$zipArchive.Dispose()
$fsStream.Close()

$sizeKb = [math]::Round((Get-Item $outputZip).Length / 1024, 1)
Write-Host "OK: $outputZip ($count files, $sizeKb KB)"
