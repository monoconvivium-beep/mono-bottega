$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

$url = "http://127.0.0.1:4177/"
$healthUrl = "http://127.0.0.1:4177/api/health"
$envFile = Join-Path $root ".env.local"

function Test-AiProviderConfigured {
  if (-not (Test-Path -LiteralPath $envFile)) {
    return $false
  }

  foreach ($line in Get-Content -LiteralPath $envFile) {
    if ($line -match "^OPENAI_API_KEY\s*=") {
      $value = ($line -split "=", 2)[1].Trim()
      if ($value.StartsWith("sk-") -and $value.Length -gt 30 -and $value -notmatch "inserisci") {
        return $true
      }
    }

    if ($line -match "^GEMINI_API_KEY\s*=") {
      $value = ($line -split "=", 2)[1].Trim()
      if ($value.Length -gt 24 -and $value -notmatch "inserisci") {
        return $true
      }
    }
  }

  return $false
}

function Test-Health {
  try {
    $response = Invoke-WebRequest -UseBasicParsing $healthUrl -TimeoutSec 2
    return $response.StatusCode -eq 200
  } catch {
    return $false
  }
}

Write-Host ""
Write-Host "MONO Social Studio 1.0" -ForegroundColor DarkYellow
Write-Host "Avvio agente AI locale sicuro..." -ForegroundColor DarkYellow
Write-Host "Link corretto: $url" -ForegroundColor Green
Write-Host "Non usare 127.001.477: serve 127.0.0.1:4177 con i due punti prima della porta." -ForegroundColor Yellow
Write-Host ""

if (-not (Test-AiProviderConfigured)) {
  Write-Host "Nessuna chiave AI ancora configurata." -ForegroundColor Yellow
  Write-Host "Apro comunque l'app. Dentro MONO Social Studio vai su Impostazioni e salva Gemini, OpenAI o entrambi."
  Write-Host "La chiave resta solo in .env.local su questo computer e non viene salvata in Git."
  Write-Host ""
}

if (Test-Health) {
  Write-Host "Server gia attivo: apro l'app." -ForegroundColor Green
  Start-Process $url
  exit 0
}

$node = (Get-Command node.exe -ErrorAction Stop).Source

Start-Process -FilePath powershell.exe -WindowStyle Hidden -ArgumentList @(
  "-NoProfile",
  "-ExecutionPolicy",
  "Bypass",
  "-Command",
  "Start-Sleep -Seconds 2; Start-Process '$url'"
)

Write-Host "App pronta: $url" -ForegroundColor Green
Write-Host ""
Write-Host "Lascia aperta questa finestra mentre usi MONO Social Studio."
Write-Host "Per spegnere il server: chiudi questa finestra o premi CTRL+C."
Write-Host ""

& $node "server.mjs"
