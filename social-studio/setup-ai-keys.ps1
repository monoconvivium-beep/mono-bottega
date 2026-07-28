$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$envFile = Join-Path $root ".env.local"
$port = "4177"
$appUrl = "http://127.0.0.1:$port/"

function Convert-SecretToPlainText {
  param([System.Security.SecureString]$SecureSecret)

  if (-not $SecureSecret -or $SecureSecret.Length -eq 0) {
    return ""
  }

  $secretPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecureSecret)
  try {
    return [Runtime.InteropServices.Marshal]::PtrToStringBSTR($secretPointer)
  } finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($secretPointer)
  }
}

function Read-SecretValue {
  param([string]$Label)

  Write-Host ""
  Write-Host "Incolla $Label e premi Invio. Lascia vuoto per saltare." -ForegroundColor Cyan
  $secureSecret = Read-Host $Label -AsSecureString
  return (Convert-SecretToPlainText $secureSecret).Trim()
}

function Normalize-SecretValue {
  param([string]$Secret)

  $normalizedSecret = ""
  if ($null -ne $Secret) {
    $normalizedSecret = $Secret.Trim()
  }

  if ($normalizedSecret -match "^(?:GEMINI_API_KEY|GOOGLE_API_KEY|OPENAI_API_KEY)\s*=\s*(.+)$") {
    $normalizedSecret = $Matches[1].Trim()
  }

  return $normalizedSecret.Trim().Trim("`"").Trim("'").Trim()
}

function Update-EnvLocal {
  param($Updates)

  $existingLines = @()
  if (Test-Path -LiteralPath $envFile) {
    $existingLines = Get-Content -LiteralPath $envFile
  }

  $pendingKeys = [System.Collections.Generic.HashSet[string]]::new()
  foreach ($key in $Updates.Keys) {
    [void]$pendingKeys.Add($key)
  }

  $nextLines = [System.Collections.Generic.List[string]]::new()
  foreach ($line in $existingLines) {
    if ($line -match "^\s*([A-Z0-9_]+)\s*=") {
      $key = $Matches[1]
      if ($Updates.Contains($key)) {
        $nextLines.Add("$key=$($Updates[$key])")
        [void]$pendingKeys.Remove($key)
      } elseif ($line.Trim()) {
        $nextLines.Add($line)
      }
    } elseif ($line.Trim()) {
      $nextLines.Add($line)
    }
  }

  foreach ($key in $Updates.Keys) {
    if ($pendingKeys.Contains($key)) {
      $nextLines.Add("$key=$($Updates[$key])")
    }
  }

  Set-Content -LiteralPath $envFile -Value $nextLines -Encoding UTF8
}

function Send-KeyToLocalServer {
  param(
    [string]$Provider,
    [string]$ApiKey,
    [string]$Model,
    [string]$ImageModel
  )

  try {
    $body = if ($Provider -eq "gemini") {
      @{ geminiKey = $ApiKey; openaiKey = "" }
    } else {
      @{ openaiKey = $ApiKey; geminiKey = "" }
    }
    $body = $body | ConvertTo-Json -Depth 4

    Invoke-RestMethod -Uri "http://127.0.0.1:$port/api/setup" -Method Post -ContentType "application/json" -Body $body -TimeoutSec 20 | Out-Null
    return $true
  } catch {
    return $false
  }
}

Clear-Host
Write-Host "MONO AI - setup chiavi" -ForegroundColor DarkYellow
Write-Host ""
Write-Host "Sicurezza:" -ForegroundColor DarkYellow
Write-Host "- Le chiavi non vengono mostrate a schermo."
Write-Host "- Non vengono mandate in chat o a Codex."
Write-Host "- Vengono salvate solo in .env.local, escluso da Git."
Write-Host ""

$geminiKey = Normalize-SecretValue (Read-SecretValue "GEMINI_API_KEY")
$openAiKey = Normalize-SecretValue (Read-SecretValue "OPENAI_API_KEY")

$updates = [ordered]@{
  PORT = $port
}

if ($geminiKey) {
  if ($geminiKey.Length -lt 20 -or $geminiKey.Length -gt 300 -or $geminiKey -match "\s|[""'<>]" -or $geminiKey -match "inserisci") {
    Write-Host "Gemini non salvata: formato chiave non valido." -ForegroundColor Red
  } else {
    $updates["GEMINI_API_KEY"] = $geminiKey
    $updates["GEMINI_IMAGE_MODEL"] = "gemini-3.1-flash-image"
    $updates["GEMINI_VIDEO_MODEL"] = "gemini-omni-flash-preview"
  }
}

if ($openAiKey) {
  if (-not $openAiKey.StartsWith("sk-") -or $openAiKey.Length -le 30 -or $openAiKey -match "inserisci") {
    Write-Host "OpenAI non salvata: la chiave deve iniziare con sk-." -ForegroundColor Red
  } else {
    $updates["OPENAI_API_KEY"] = $openAiKey
    $updates["OPENAI_MODEL"] = "gpt-5.4-mini"
  }
}

if ($updates.Keys.Count -le 1) {
  Write-Host ""
  Write-Host "Nessuna chiave valida da salvare." -ForegroundColor Yellow
  Write-Host "Premi Invio per chiudere."
  [void](Read-Host)
  exit 0
}

Update-EnvLocal -Updates $updates

$geminiServerUpdated = $false
$openAiServerUpdated = $false
if ($updates.Contains("GEMINI_API_KEY")) {
  $geminiServerUpdated = Send-KeyToLocalServer -Provider "gemini" -ApiKey $updates["GEMINI_API_KEY"] -Model "" -ImageModel $updates["GEMINI_IMAGE_MODEL"]
}

if ($updates.Contains("OPENAI_API_KEY")) {
  $openAiServerUpdated = Send-KeyToLocalServer -Provider "openai" -ApiKey $updates["OPENAI_API_KEY"] -Model $updates["OPENAI_MODEL"] -ImageModel ""
}

Write-Host ""
Write-Host "Chiavi salvate in .env.local." -ForegroundColor Green
Write-Host "Gemini: $($(if ($updates.Contains('GEMINI_API_KEY')) { 'salvata' } else { 'non inserita' }))"
Write-Host "OpenAI: $($(if ($updates.Contains('OPENAI_API_KEY')) { 'salvata' } else { 'non inserita' }))"

if ($geminiServerUpdated -or $openAiServerUpdated) {
  Write-Host "Server locale aggiornato senza riavvio." -ForegroundColor Green
} else {
  Write-Host "Se l'app era gia aperta, riavvia AVVIA_MONO_SOCIAL_STUDIO.cmd per caricare le chiavi." -ForegroundColor Yellow
}

Start-Process $appUrl
Write-Host ""
Write-Host "Premi Invio per chiudere questa finestra."
[void](Read-Host)
