# upload-academy-images.ps1
# Uploads all pitch diagram images to Supabase Storage bucket lesson-media
# Usage: powershell -File scripts/upload-academy-images.ps1

$key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpa3J4a3hwaXpkZXphemx3eGhiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjY1MDczNiwiZXhwIjoyMDg4MjI2NzM2fQ.19h2jOkJF3tuw3T1Wen4xhgDMGd1pgCdOzhJgck8AqA"
$project = "pikrxkxpizdezazlwxhb"
$bucket = "lesson-media"
$baseUrl = "https://${project}.supabase.co/storage/v1/object/${bucket}"

$localRoot = "media/pitch-diagrams/junior"
$files = Get-ChildItem $localRoot -Recurse -File
$total = $files.Count
$uploaded = 0
$failed = 0

Write-Host "Uploading $total files to Supabase Storage..."

foreach ($file in $files) {
    $relativePath = $file.FullName.Replace((Resolve-Path $localRoot).Path, "").TrimStart("\","/")
    $storagePath = "media/pitch-diagrams/junior/$($relativePath -replace '\\','/')"
    $url = "${baseUrl}/${storagePath}"

    $headers = @{
        "apikey" = $key
        "Authorization" = "Bearer $key"
        "Content-Type" = "image/png"
        "x-upsert" = "true"
    }

    try {
        $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
        Invoke-RestMethod -Uri $url -Headers $headers -Method Post -Body $bytes | Out-Null
        $uploaded++
        Write-Host "  [$uploaded/$total] $storagePath"
    } catch {
        $failed++
        Write-Host "  FAILED: $storagePath - $($_.Exception.Message)"
    }
}

Write-Host "`nDone! Uploaded: $uploaded, Failed: $failed"
