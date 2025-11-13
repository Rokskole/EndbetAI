# Verify App Icon
# This script checks if your app icon exists and is the correct size

$iconPath = "assets\icon.png"
$requiredSize = 1024

Write-Host "Checking app icon..." -ForegroundColor Cyan

if (Test-Path $iconPath) {
    Write-Host "Icon file exists: $iconPath" -ForegroundColor Green
    
    try {
        # Load image using .NET
        Add-Type -AssemblyName System.Drawing
        $img = [System.Drawing.Image]::FromFile((Resolve-Path $iconPath).Path)
        
        $width = $img.Width
        $height = $img.Height
        
        Write-Host ""
        Write-Host "Icon dimensions: ${width}x${height} pixels" -ForegroundColor Yellow
        
        if ($width -eq $requiredSize -and $height -eq $requiredSize) {
            Write-Host "SUCCESS: Icon is the correct size (1024x1024)" -ForegroundColor Green
            $isCorrect = $true
        } elseif ($width -eq $height) {
            Write-Host "WARNING: Icon is square but not 1024x1024" -ForegroundColor Yellow
            Write-Host "  Required: ${requiredSize}x${requiredSize}" -ForegroundColor Red
            Write-Host "  Current: ${width}x${height}" -ForegroundColor Red
            $isCorrect = $false
        } else {
            Write-Host "ERROR: Icon is not square!" -ForegroundColor Red
            Write-Host "  Required: ${requiredSize}x${requiredSize} (square)" -ForegroundColor Red
            Write-Host "  Current: ${width}x${height}" -ForegroundColor Red
            $isCorrect = $false
        }
        
        # Check file extension
        $extension = [System.IO.Path]::GetExtension($iconPath).ToLower()
        if ($extension -eq ".png") {
            Write-Host "SUCCESS: Icon format is PNG" -ForegroundColor Green
        } else {
            Write-Host "WARNING: Icon format is $extension (should be .png)" -ForegroundColor Yellow
            $isCorrect = $false
        }
        
        $img.Dispose()
        
        if ($isCorrect) {
            Write-Host ""
            Write-Host "=== ICON VERIFICATION PASSED ===" -ForegroundColor Green
            exit 0
        } else {
            Write-Host ""
            Write-Host "=== ICON VERIFICATION FAILED ===" -ForegroundColor Red
            Write-Host "Please fix the issues above before submitting to App Store." -ForegroundColor Yellow
            exit 1
        }
        
    } catch {
        Write-Host "ERROR: Could not read image: $_" -ForegroundColor Red
        Write-Host "  Make sure the file is a valid image file" -ForegroundColor Yellow
        exit 1
    }
    
} else {
    Write-Host "ERROR: Icon file not found: $iconPath" -ForegroundColor Red
    Write-Host "  The app.json expects the icon at: ./assets/icon.png" -ForegroundColor Yellow
    Write-Host "  Current directory: $(Get-Location)" -ForegroundColor Yellow
    exit 1
}
