# copy-academy-images.ps1
# Copies media/imageN.png -> media/pitch-diagrams/junior/{skill}/{session-name}.png
# Generates 030_update-academy-diagram-urls.sql with UPDATE statements.
#
# Usage: powershell -File scripts/copy-academy-images.ps1

$imageMapping = Get-Content "bailey-image-mapping.json" | ConvertFrom-Json
$project = "pikrxkxpizdezazlwxhb"
$storageBase = "https://${project}.supabase.co/storage/v1/object/public/lesson-media/media/pitch-diagrams"

$imageByHeader = @{}
foreach ($entry in $imageMapping) { $imageByHeader["$($entry.slide)"] = $entry }

$map = @()
$map += ,@("1","shielding","session-academy-shielding-ball-mastery-junior","session-academy-shielding-shark-attack-junior","session-academy-shielding-1v1-junior","session-academy-shielding-game-junior")
$map += ,@("2","1v1","session-academy-2v2-passing-in-2s-junior","session-academy-2v2-passing-interference-junior","session-academy-2v2-battles-junior","session-academy-2v2-games-junior")
$map += ,@("3","1v1","session-academy-1v1defending-ball-mastery-junior","session-academy-1v1defending-line-football-junior","session-academy-1v1defending-goals-gates-junior","session-academy-1v1defending-game-junior")
$map += ,@("4","passing-receiving","session-academy-passcontrol-games-passing-junior","session-academy-passcontrol-games-relays-junior","session-academy-passcontrol-games-possession-junior","session-academy-passcontrol-games-game-junior")
$map += ,@("5","1v1","session-academy-5050-brazil-skills-junior","session-academy-5050-knockout-junior","session-academy-5050-1v1-junior","session-academy-5050-1v1-goals-junior")
$map += ,@("6","passing-receiving","session-academy-passcontrol-passing-junior","session-academy-passcontrol-rondo-junior","session-academy-passcontrol-possession-junior","session-academy-passcontrol-games-junior")
$map += ,@("7","shooting","session-academy-shooting-laces-brazil-junior","session-academy-shooting-laces-drill-junior","session-academy-shooting-laces-transition-junior","session-academy-shooting-laces-3team-junior")
$map += ,@("8","passing-receiving","session-academy-passcontrol2-passing-junior","session-academy-passcontrol2-rondo-junior","session-academy-passcontrol2-possession-junior","session-academy-passcontrol2-4goal-game-junior")
$map += ,@("9","1v1","session-academy-2v1defending-ball-mastery-junior","session-academy-2v1defending-2v1-junior","session-academy-2v1defending-3v2-junior","session-academy-2v1defending-overload-game-junior")
$map += ,@("12","1v1","session-academy-1v1turns-ball-mastery-junior","session-academy-1v1turns-wide-junior","session-academy-1v1turns-goals-junior","session-academy-1v1turns-game-junior")
$map += ,@("15","passing-receiving","session-academy-passing-receiving-passing2s-junior","session-academy-passing-receiving-rondo3v1-junior","session-academy-passing-receiving-possession-junior","session-academy-passing-receiving-4goal-junior")
$map += ,@("18","dribbling","session-academy-1v1-dribbling-ball-mastery-junior","session-academy-1v1-dribbling-wide-channel-junior","session-academy-1v1-dribbling-end-zones-junior","session-academy-1v1-dribbling-game-junior")
$map += ,@("19","shooting","session-academy-kicking-techniques-ball-mastery-junior","session-academy-kicking-techniques-inside-foot-junior","session-academy-kicking-techniques-2v1-goal-junior","session-academy-kicking-techniques-game-junior")
$map += ,@("21","passing-receiving","session-academy-rondo-possession-3v1-junior","session-academy-rondo-possession-4v2-junior","session-academy-rondo-possession-game-junior","session-academy-rondo-possession-4goal-junior")
$map += ,@("22","1v1","session-academy-1v1-attacking-central-mastery-junior","session-academy-1v1-attacking-central-skill-junior","session-academy-1v1-attacking-central-goal-junior","session-academy-1v1-attacking-central-game-junior")
$map += ,@("23","passing-receiving","session-academy-punch-pass-passing2s-junior","session-academy-punch-pass-interference-junior","session-academy-punch-pass-possession-junior","session-academy-punch-pass-4goal-junior")
$map += ,@("24","1v1","session-academy-1v1-defending-central-mastery-junior","session-academy-1v1-defending-central-skill-junior","session-academy-1v1-defending-central-endzones-junior","session-academy-1v1-defending-central-game-junior")
$map += ,@("25","shooting","session-academy-shooting-power-mastery-junior","session-academy-shooting-power-laces-junior","session-academy-shooting-power-transition-junior","session-academy-shooting-power-game-junior")
$map += ,@("26","passing-receiving","session-academy-rondo-games-3v1-junior","session-academy-rondo-games-4v2-junior","session-academy-rondo-games-possession-junior","session-academy-rondo-games-4goal-junior")
$map += ,@("27","1v1","session-academy-1v1-attacking-wide-mastery-junior","session-academy-1v1-attacking-wide-skill-junior","session-academy-1v1-attacking-wide-goal-junior","session-academy-1v1-attacking-wide-game-junior")
$map += ,@("28","passing-receiving","session-academy-passing-movement-passing2s-junior","session-academy-passing-movement-drill-junior","session-academy-passing-movement-possession-junior","session-academy-passing-movement-4goal-junior")
$map += ,@("29","1v1","session-academy-1v1-defending-recovery-mastery-junior","session-academy-1v1-defending-recovery-skill-junior","session-academy-1v1-defending-recovery-endzones-junior","session-academy-1v1-defending-recovery-game-junior")
$map += ,@("30","shooting","session-academy-shooting-1v1-finishing-mastery-junior","session-academy-shooting-1v1-finishing-skill-junior","session-academy-shooting-1v1-finishing-2v1-junior","session-academy-shooting-1v1-finishing-game-junior")
$map += ,@("31","passing-receiving","session-academy-rondo-support-3v1-junior","session-academy-rondo-support-4v2-junior","session-academy-rondo-support-possession-junior","session-academy-rondo-support-4goal-junior")
$map += ,@("32","1v1","session-academy-1v1-attacking-finishing-mastery-junior","session-academy-1v1-attacking-finishing-skill-junior","session-academy-1v1-attacking-finishing-gates-junior","session-academy-1v1-attacking-finishing-game-junior")
$map += ,@("33","passing-receiving","session-academy-passing-speed-passing2s-junior","session-academy-passing-speed-drill-junior","session-academy-passing-speed-possession-junior","session-academy-passing-speed-4goal-junior")
$map += ,@("34","1v1","session-academy-1v1-attacking-u9u10-mastery-junior","session-academy-1v1-attacking-u9u10-line-junior","session-academy-1v1-attacking-u9u10-goals-junior","session-academy-1v1-attacking-u9u10-tournament-junior")
$map += ,@("35","1v1","session-academy-break-line-1-2-passing-junior","session-academy-break-line-football-junior","session-academy-break-line-transition-junior","session-academy-break-line-overload-junior")
$map += ,@("37","passing-receiving","session-academy-crossing-finishing-mastery-junior","session-academy-crossing-finishing-isolated-junior","session-academy-crossing-finishing-defender-junior","session-academy-crossing-finishing-2v2-floaters-junior")
$map += ,@("38","1v1","session-academy-1v1-defending-expanded-mastery-junior","session-academy-1v1-defending-expanded-1v1s-junior","session-academy-1v1-defending-expanded-overload-junior","session-academy-1v1-defending-expanded-tournament-junior")
$map += ,@("39","1v1","session-academy-defending-transition-interference-junior","session-academy-defending-transition-shark-junior","session-academy-defending-transition-rondo-junior","session-academy-defending-transition-game-junior")
$map += ,@("40","passing-receiving","session-academy-defending-process-square-passing-junior","session-academy-defending-process-2v2v2-junior","session-academy-defending-process-directional-junior","session-academy-defending-process-game-junior")

$copyCount = 0
$skipCount = 0
$sqlLines = @("-- Migration 030: Update Academy session diagram URLs","-- Generated by scripts/copy-academy-images.ps1","","BEGIN;","")

foreach ($entry in $map) {
    $headerSlide = $entry[0]
    $skill = $entry[1]
    $sessions = @($entry[2], $entry[3], $entry[4], $entry[5])
    $imgData = $imageByHeader[$headerSlide]
    if (-not $imgData) { Write-Host "WARNING: No image data for header slide $headerSlide"; continue }
    $images = @($imgData.session1, $imgData.session2, $imgData.session3, $imgData.session4)
    $labels = @("S1","S2","S3","S4")

    for ($i = 0; $i -lt 4; $i++) {
        $sn = $sessions[$i]
        $src = $images[$i]
        if (-not $src -or $src -eq "image7.png") { Write-Host "  SKIP: Slide $headerSlide $($labels[$i]) - no image"; $skipCount++; continue }
        $srcPath = "media/$src"
        $destDir = "media/pitch-diagrams/junior/$skill"
        $destFile = "$destDir/$sn.png"
        if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir -Force | Out-Null }
        if (Test-Path $srcPath) {
            Copy-Item $srcPath $destFile -Force
            Write-Host "  COPY: $srcPath -> $destFile"
            $copyCount++
        } else {
            Write-Host "  MISSING: $srcPath"
            $skipCount++
            continue
        }
        $url = "${storageBase}/junior/${skill}/${sn}.png"
        $sqlLines += "UPDATE sessions SET diagram_url = '${url}' WHERE session_name = '${sn}';"
    }
    $sqlLines += ""
}

$sqlLines += "COMMIT;"
$sqlPath = "supabase/migrations/030_update-academy-diagram-urls.sql"
$sqlLines | Out-File -FilePath $sqlPath -Encoding UTF8
Write-Host "`nDone! Copied $copyCount images, skipped $skipCount."
Write-Host "SQL migration written to: $sqlPath"
