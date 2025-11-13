# Verify App Icon
# This script checks if your app icon exists and is the correct size

$iconPath = "assets\icon.png"
$requiredSize = 1024

Write-Host "Checking app icon..." -ForegroundColor Cyan

if (Test-Path $iconPath) {
    Write-Host "✓ Icon file exists: $iconPath" -ForegroundColor Green
    
    try {
        # Load image using .NET
        Add-Type -AssemblyName System.Drawing
        $img = [System.Drawing.Image]::FromFile((Resolve-Path $iconPath).Path)
        
        $width = $img.Width
        $height = $img.Height
        
        Write-Host "`nIcon dimensions: ${width}x${height} pixels" -ForegroundColor Yellow
        
        if ($width -eq $requiredSize -and $height -eq $requiredSize) {
            Write-Host "✓ Icon is the correct size (1024x1024)" -ForegroundColor Green
        } elseif ($width -eq $height) {
            Write-Host "⚠ Icon is square but not 1024x1024" -ForegroundColor Yellow
            Write-Host "  Required: ${requiredSize}x${requiredSize}" -ForegroundColor Red
            Write-Host "  Current: ${width}x${height}" -ForegroundColor Red
        } else {
            Write-Host "✗ Icon is not square!" -ForegroundColor Red
            Write-Host "  Required: ${requiredSize}x${requiredSize} (square)" -ForegroundColor Red
            Write-Host "  Current: ${width}x${height}" -ForegroundColor Red
        }
        
        # Check file extension
        $extension = [System.IO.Path]::GetExtension($iconPath).ToLower()
        if ($extension -eq ".png") {
            Write-Host "✓ Icon format is PNG" -ForegroundColor Green
        } else {
            Write-Host "⚠ Icon format is $extension (should be .png)" -ForegroundColor Yellow
        }
        
        $img.Dispose()
        
    } catch {
        Write-Host "✗ Error reading image: $_" -ForegroundColor Red
        Write-Host "  Make sure the file is a valid image" -ForegroundColor Yellow
    }
    
} else {
    Write-Host "✗ Icon file not found: $iconPath" -ForegroundColor Red
    Write-Host "  The app.json expects the icon at: ./assets/icon.png" -ForegroundColor Yellow
}

Write-Host "`nPress any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

