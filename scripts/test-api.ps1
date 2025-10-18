# QuitBet AI - API Testing Script for PowerShell
# This script helps you test the API endpoints including authentication and chat

param(
    [string]$ApiUrl = "https://endbet-ai-api-749k.vercel.app",
    [string]$Email = "test@example.com"
)

$ErrorActionPreference = "Continue"

Write-Host "🧪 QuitBet AI API Testing Script" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Colors for output
function Write-Success { param($msg) Write-Host "✅ $msg" -ForegroundColor Green }
function Write-Error { param($msg) Write-Host "❌ $msg" -ForegroundColor Red }
function Write-Info { param($msg) Write-Host "ℹ️  $msg" -ForegroundColor Yellow }
function Write-Step { param($msg) Write-Host "📍 $msg" -ForegroundColor Cyan }

# Test 1: Health Check
Write-Step "Step 1: Testing API Health..."
try {
    $healthResponse = Invoke-RestMethod -Uri "$ApiUrl/health" -Method GET -ContentType "application/json"
    if ($healthResponse.status -eq "ok") {
        Write-Success "API is running! Version: $($healthResponse.version)"
        Write-Info "Timestamp: $($healthResponse.timestamp)"
    }
} catch {
    Write-Error "API is not running. Please start it with: npm run dev:api"
    Write-Info "Expected URL: $ApiUrl/health"
    exit 1
}

Write-Host ""

# Test 2: Send Magic Link
Write-Step "Step 2: Testing Authentication (Magic Link)..."
Write-Info "Using email: $Email"
try {
    $loginBody = @{
        email = $Email
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "$ApiUrl/api/auth/login" -Method POST -Headers @{ "Content-Type" = "application/json" } -Body $loginBody
    
    if ($loginResponse.success) {
        Write-Success $loginResponse.message
        Write-Info "Check your email ($Email) for the magic link!"
        Write-Info "Note: In development, you might need to check your Supabase dashboard or logs"
    }
} catch {
    $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json
    Write-Error "Failed to send magic link: $($errorDetails.error)"
    Write-Info "Make sure Supabase is configured in your .env file"
}

Write-Host ""

# Test 3: Test Protected Endpoint (should fail without auth)
Write-Step "Step 3: Testing Protected Endpoint (without auth)..."
try {
    $meResponse = Invoke-RestMethod -Uri "$ApiUrl/api/auth/me" -Method GET -ErrorAction Stop
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 401) {
        Write-Success "Protected endpoint correctly requires authentication"
    } else {
        Write-Error "Unexpected error: $($_.Exception.Message)"
    }
}

Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "📋 How to Test Chat Endpoint:" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To test the chat endpoint, you need a valid session token." -ForegroundColor Yellow
Write-Host ""
Write-Host "Manual Steps:" -ForegroundColor White
Write-Host "1. Check your email for the magic link" -ForegroundColor Gray
Write-Host "2. Click the link or copy the token from the email" -ForegroundColor Gray
Write-Host "3. Use the token to verify and get a session:" -ForegroundColor Gray
Write-Host ""
Write-Host '   $verifyBody = @{' -ForegroundColor DarkGray
Write-Host '       token_hash = "YOUR_TOKEN_HASH"' -ForegroundColor DarkGray
Write-Host '       type = "magiclink"' -ForegroundColor DarkGray
Write-Host '       email = "test@example.com"' -ForegroundColor DarkGray
Write-Host '   } | ConvertTo-Json' -ForegroundColor DarkGray
Write-Host ""
Write-Host '   $session = Invoke-RestMethod -Uri "https://endbet-ai-api-749k.vercel.app/api/auth/verify" `' -ForegroundColor DarkGray
Write-Host '       -Method POST -Headers @{ "Content-Type" = "application/json" } `' -ForegroundColor DarkGray
Write-Host '       -Body $verifyBody' -ForegroundColor DarkGray
Write-Host ""
Write-Host "4. Once you have a session, test the chat:" -ForegroundColor Gray
Write-Host ""
Write-Host '   $sessionId = $session.data.session.id' -ForegroundColor DarkGray
Write-Host '   $chatBody = @{ content = "Hello! I need help staying away from gambling." } | ConvertTo-Json' -ForegroundColor DarkGray
Write-Host ""
Write-Host '   $chatResponse = Invoke-RestMethod -Uri "https://endbet-ai-api-749k.vercel.app/api/chat/messages" `' -ForegroundColor DarkGray
Write-Host '       -Method POST `' -ForegroundColor DarkGray
Write-Host '       -Headers @{ ' -ForegroundColor DarkGray
Write-Host '           "Content-Type" = "application/json"' -ForegroundColor DarkGray
Write-Host '           "Authorization" = "Bearer $sessionId"' -ForegroundColor DarkGray
Write-Host '       } `' -ForegroundColor DarkGray
Write-Host '       -Body $chatBody' -ForegroundColor DarkGray
Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Quick Tips:" -ForegroundColor Cyan
Write-Host "  • API Port: 3001 (default)" -ForegroundColor Gray
Write-Host "  • Make sure your .env file is configured" -ForegroundColor Gray
Write-Host "  • Supabase URL and keys must be valid" -ForegroundColor Gray
Write-Host "  • For production, use your Vercel deployment URL" -ForegroundColor Gray
Write-Host ""
Write-Host "📚 Available Endpoints:" -ForegroundColor Cyan
Write-Host "  GET  /health                    - API health check" -ForegroundColor Gray
Write-Host "  POST /api/auth/login            - Send magic link" -ForegroundColor Gray
Write-Host "  POST /api/auth/verify           - Verify magic link" -ForegroundColor Gray
Write-Host "  GET  /api/auth/me               - Get current user (auth required)" -ForegroundColor Gray
Write-Host "  POST /api/chat/messages         - Send chat message (auth required)" -ForegroundColor Gray
Write-Host "  GET  /api/chat/messages         - Get chat history (auth required)" -ForegroundColor Gray
Write-Host "  POST /api/chat/analyze          - Analyze message for crisis (auth required)" -ForegroundColor Gray
Write-Host ""

