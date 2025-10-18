# Quick Chat Test - Send a single message
param(
    [Parameter(Mandatory=$true)]
    [string]$Message,
    
    [Parameter(Mandatory=$true)]
    [string]$SessionToken,
    
    [string]$ApiUrl = "https://endbet-ai-api-749k.vercel.app"
)

try {
    $headers = @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $SessionToken"
    }
    
    $chatBody = @{
        content = $Message
    } | ConvertTo-Json
    
    Write-Host "Sending message..." -ForegroundColor Yellow
    
    $response = Invoke-RestMethod -Uri "$ApiUrl/api/chat/messages" -Method POST -Headers $headers -Body $chatBody
    
    if ($response.success) {
        Write-Host "`n✅ Response received:" -ForegroundColor Green
        Write-Host $response.data.content -ForegroundColor Cyan
        Write-Host ""
        
        # Show crisis detection if any
        $content = $Message.ToLower()
        if ($content -match "suicide|kill|die|hopeless") {
            Write-Host "⚠️  Crisis keywords detected - support resources provided" -ForegroundColor Yellow
        } elseif ($content -match "bet|gamble|casino|urge") {
            Write-Host "⚠️  Gambling urge detected - coping strategies provided" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ Error: $($response.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Failed to send message" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

