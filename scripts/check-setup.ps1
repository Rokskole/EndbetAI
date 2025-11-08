# Environment Setup Verification Script
# Checks if all required environment variables are properly configured

$ErrorActionPreference = "Continue"

function Write-Success { param($msg) Write-Host "✅ $msg" -ForegroundColor Green }
function Write-Error { param($msg) Write-Host "❌ $msg" -ForegroundColor Red }
function Write-Warning { param($msg) Write-Host "⚠️  $msg" -ForegroundColor Yellow }
function Write-Info { param($msg) Write-Host "ℹ️  $msg" -ForegroundColor Cyan }

Clear-Host
Write-Host "🔍 QuitBet AI - Setup Verification" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env file exists
if (Test-Path ".env") {
    Write-Success ".env file found"
} else {
    Write-Error ".env file not found"
    Write-Info "Please copy env.example to .env and configure it"
    Write-Host ""
    Write-Host "Run: Copy-Item env.example .env" -ForegroundColor Gray
    exit 1
}

Write-Host ""
Write-Host "Checking environment variables..." -ForegroundColor Cyan
Write-Host ""

# Load .env file
$envVars = @{}
Get-Content .env | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim()
        $envVars[$key] = $value
    }
}

# Required variables
$required = @{
    'SUPABASE_URL' = 'Supabase project URL'
    'SUPABASE_ANON_KEY' = 'Supabase anonymous key'
    'SUPABASE_SERVICE_ROLE_KEY' = 'Supabase service role key'
}

# Optional but recommended
$optional = @{
    'DEEPSEEK_API_KEY' = 'AI chat functionality'
    'PORT' = 'API server port'
    'CLIENT_URL' = 'Frontend URL for redirects'
}

$allValid = $true

# Check required variables
Write-Host "Required Configuration:" -ForegroundColor White
Write-Host "----------------------" -ForegroundColor White
foreach ($key in $required.Keys) {
    $value = $envVars[$key]
    if ([string]::IsNullOrWhiteSpace($value)) {
        Write-Error "$key - Missing"
        Write-Info "  Purpose: $($required[$key])"
        $allValid = $false
    } elseif ($value -match "your_|placeholder") {
        Write-Warning "$key - Not configured (using placeholder)"
        Write-Info "  Purpose: $($required[$key])"
        $allValid = $false
    } else {
        $masked = $value.Substring(0, [Math]::Min(10, $value.Length)) + "..."
        Write-Success "$key - Configured ($masked)"
    }
}

Write-Host ""
Write-Host "Optional Configuration:" -ForegroundColor White
Write-Host "----------------------" -ForegroundColor White
foreach ($key in $optional.Keys) {
    $value = $envVars[$key]
    if ([string]::IsNullOrWhiteSpace($value)) {
        Write-Warning "$key - Not set"
        Write-Info "  Purpose: $($optional[$key])"
    } elseif ($value -match "your_|placeholder") {
        Write-Warning "$key - Using default/placeholder"
        Write-Info "  Purpose: $($optional[$key])"
    } else {
        if ($key -eq "PORT") {
            Write-Success "$key - Set to $value"
        } else {
            $masked = $value.Substring(0, [Math]::Min(10, $value.Length)) + "..."
            Write-Success "$key - Configured ($masked)"
        }
    }
}

Write-Host ""
Write-Host "Feature Flags:" -ForegroundColor White
Write-Host "--------------" -ForegroundColor White
$features = @('ENABLE_CRISIS_DETECTION', 'ENABLE_AI_CHAT', 'ENABLE_ANALYTICS')
foreach ($feature in $features) {
    $value = $envVars[$feature]
    if ($value -eq "true") {
        Write-Success "$feature - Enabled"
    } else {
        Write-Info "$feature - Disabled"
    }
}

Write-Host ""
Write-Host "===================================" -ForegroundColor Cyan

if ($allValid) {
    Write-Host ""
    Write-Success "All required configuration is set!"
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Cyan
    Write-Host "1. Install dependencies: npm install" -ForegroundColor Gray
    Write-Host "2. Start the API: npm run dev:api" -ForegroundColor Gray
    Write-Host "3. Test the API: .\scripts\test-api.ps1" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host ""
    Write-Error "Some required configuration is missing!"
    Write-Host ""
    Write-Host "How to fix:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Get Supabase credentials:" -ForegroundColor White
    Write-Host "   • Go to https://supabase.com" -ForegroundColor Gray
    Write-Host "   • Create a new project or select existing one" -ForegroundColor Gray
    Write-Host "   • Go to Settings > API" -ForegroundColor Gray
    Write-Host "   • Copy Project URL, anon key, and service_role key" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Update your .env file:" -ForegroundColor White
    Write-Host "   • Open .env in a text editor" -ForegroundColor Gray
    Write-Host "   • Replace placeholder values with your credentials" -ForegroundColor Gray
    Write-Host "   • Save the file" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. (Optional) Get DeepSeek API key for AI chat:" -ForegroundColor White
    Write-Host "   • Visit https://platform.deepseek.com" -ForegroundColor Gray
    Write-Host "   • Sign up and get API key" -ForegroundColor Gray
    Write-Host "   • Add to DEEPSEEK_API_KEY in .env" -ForegroundColor Gray
    Write-Host ""
}

Write-Host ""
Write-Host "Configuration file location: $(Resolve-Path .env)" -ForegroundColor Gray
Write-Host ""


