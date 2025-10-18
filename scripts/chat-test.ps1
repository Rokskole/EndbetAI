# Interactive Chat Testing Script
# This script provides an interactive way to test the chat API

param(
    [string]$ApiUrl = "https://endbet-ai-api-749k.vercel.app",
    [string]$SessionToken = ""
)

function Write-Success { param($msg) Write-Host "✅ $msg" -ForegroundColor Green }
function Write-Error { param($msg) Write-Host "❌ $msg" -ForegroundColor Red }
function Write-Info { param($msg) Write-Host "ℹ️  $msg" -ForegroundColor Yellow }
function Write-Bot { param($msg) Write-Host "🤖 Assistant: $msg" -ForegroundColor Cyan }
function Write-User { param($msg) Write-Host "👤 You: $msg" -ForegroundColor White }

Clear-Host
Write-Host "💬 QuitBet AI - Interactive Chat Tester" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if session token is provided
if ([string]::IsNullOrEmpty($SessionToken)) {
    Write-Error "Session token is required!"
    Write-Host ""
    Write-Host "To get a session token:" -ForegroundColor Yellow
    Write-Host "1. Run: .\scripts\test-api.ps1" -ForegroundColor Gray
    Write-Host "2. Follow the authentication steps" -ForegroundColor Gray
    Write-Host "3. Copy your session ID" -ForegroundColor Gray
    Write-Host "4. Run: .\scripts\chat-test.ps1 -SessionToken 'YOUR_SESSION_ID'" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

# Test connection
try {
    $headers = @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $SessionToken"
    }
    
    $meResponse = Invoke-RestMethod -Uri "$ApiUrl/api/auth/me" -Method GET -Headers $headers
    Write-Success "Connected as: $($meResponse.data.email)"
    Write-Host ""
} catch {
    Write-Error "Invalid session token or API not running"
    Write-Info "Please check your session token and ensure the API is running"
    exit 1
}

# Get chat history
Write-Info "Loading your recent chat history..."
try {
    $historyResponse = Invoke-RestMethod -Uri "$ApiUrl/api/chat/messages?limit=5" -Method GET -Headers $headers
    $messages = $historyResponse.data
    
    if ($messages.Count -gt 0) {
        Write-Host "Recent messages:" -ForegroundColor Gray
        foreach ($msg in $messages) {
            if ($msg.role -eq "user") {
                Write-User $msg.content
            } else {
                Write-Bot $msg.content
            }
        }
    } else {
        Write-Info "No previous messages found"
    }
    Write-Host ""
} catch {
    Write-Info "Could not load chat history"
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Start chatting! (Type 'exit' to quit, 'history' to see all messages)" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Interactive chat loop
while ($true) {
    Write-Host "👤 You: " -NoNewline -ForegroundColor White
    $userInput = Read-Host
    
    if ($userInput -eq "exit" -or $userInput -eq "quit") {
        Write-Info "Goodbye! Stay strong on your recovery journey! 💪"
        break
    }
    
    if ($userInput -eq "history") {
        try {
            $historyResponse = Invoke-RestMethod -Uri "$ApiUrl/api/chat/messages?limit=20" -Method GET -Headers $headers
            $messages = $historyResponse.data
            
            Write-Host ""
            Write-Host "Chat History (last 20 messages):" -ForegroundColor Cyan
            Write-Host "================================" -ForegroundColor Cyan
            foreach ($msg in $messages) {
                if ($msg.role -eq "user") {
                    Write-User $msg.content
                } else {
                    Write-Bot $msg.content
                }
                Write-Host ""
            }
        } catch {
            Write-Error "Could not load chat history"
        }
        continue
    }
    
    if ([string]::IsNullOrWhiteSpace($userInput)) {
        continue
    }
    
    # Send message to API
    try {
        $chatBody = @{
            content = $userInput
        } | ConvertTo-Json
        
        Write-Host "   (Thinking...)" -ForegroundColor DarkGray
        
        $response = Invoke-RestMethod -Uri "$ApiUrl/api/chat/messages" -Method POST -Headers $headers -Body $chatBody
        
        if ($response.success) {
            Write-Bot $response.data.content
            Write-Host ""
        } else {
            Write-Error "Failed to get response"
        }
    } catch {
        Write-Error "Error sending message: $($_.Exception.Message)"
        Write-Info "Please check your connection and try again"
    }
}

