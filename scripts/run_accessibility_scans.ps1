param(
    [ValidateSet("all", "targets", "home")]
    [string]$Mode = "targets"
)

$ErrorActionPreference = "Stop"
$adb = "$env:LOCALAPPDATA\Android\sdk\platform-tools\adb.exe"
$device = "emulator-5554"
$repoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$outDir = Join-Path $repoRoot "assignments\week-6\scanner-results"
$scannerSvc = "com.google.android.apps.accessibility.auditor/com.google.android.apps.accessibility.auditor.ScannerService"

$testFile = switch ($Mode) {
    "all" { "integration_test/accessibility_scanner_tour.dart" }
    "home" { "integration_test/accessibility_scanner_home.dart" }
    default { "integration_test/accessibility_scanner_targets.dart" }
}

New-Item -ItemType Directory -Force -Path $outDir | Out-Null

function Invoke-Adb {
    param([string[]]$AdbArgs)
    & $adb -s $device @AdbArgs 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) { throw "adb failed: $($AdbArgs -join ' ')" }
}

function Get-ScannerButtonCenter {
    $dump = & $adb -s $device shell dumpsys window windows 2>&1 | Out-String
    if ($dump -match 'Scanner, frame=\[Rect\((\d+), (\d+) - (\d+), (\d+)\)\]') {
        $left = [int]$Matches[1]
        $top = [int]$Matches[2]
        $right = [int]$Matches[3]
        $bottom = [int]$Matches[4]
        return @{
            X = [int](($left + $right) / 2)
            Y = [int](($top + $bottom) / 2)
        }
    }
    return @{ X = 640; Y = 792 }
}

function Invoke-AccessibilityScan {
    $btn = Get-ScannerButtonCenter
    Invoke-Adb @("shell", "input", "tap", "$($btn.X)", "$($btn.Y)")
    Start-Sleep -Milliseconds 800

    $menuY = $btn.Y + 220
    Invoke-Adb @("shell", "input", "tap", "$($btn.X)", "$menuY")
    Start-Sleep -Seconds 10
}

function Save-ScanScreenshots {
    param([string]$Route)

    $safe = ($Route -replace '[\\/?&=]', '_').Trim('_')
    $screenPath = Join-Path $outDir "${safe}-screen.png"
    $scanPath = Join-Path $outDir "${safe}-scan.png"

    Start-Sleep -Milliseconds 400
    Invoke-Adb @("shell", "screencap", "-p", "/sdcard/a11y-screen.png")
    Invoke-Adb @("pull", "/sdcard/a11y-screen.png", $screenPath)

    Invoke-AccessibilityScan

    Invoke-Adb @("shell", "screencap", "-p", "/sdcard/a11y-scan.png")
    Invoke-Adb @("pull", "/sdcard/a11y-scan.png", $scanPath)

    Invoke-Adb @("shell", "input", "keyevent", "KEYCODE_BACK")
    Start-Sleep -Milliseconds 400

    Write-Host "Captured $Route"
}

Write-Host "Ensuring Accessibility Scanner service is enabled..."
Invoke-Adb @("shell", "settings", "put", "secure", "enabled_accessibility_services", $scannerSvc)
Invoke-Adb @("shell", "settings", "put", "secure", "accessibility_enabled", "1")

Push-Location (Join-Path $repoRoot "flutter_app")
try {
    Write-Host "Running $Mode scan ($testFile) on $device..."
    $prevErrorAction = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    flutter test $testFile -d $device 2>&1 | ForEach-Object {
        $text = $_.ToString()
        Write-Host $text
        if ($text -match 'A11Y_SCAN_READY:(.+)') {
            Save-ScanScreenshots $matches[1].Trim()
        }
    }
    $testExit = $LASTEXITCODE
    $ErrorActionPreference = $prevErrorAction
    if ($testExit -ne 0) {
        throw "flutter test failed with exit code $testExit"
    }
} finally {
    Pop-Location
}

Write-Host "Done. Results in $outDir"
