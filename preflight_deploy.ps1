[CmdletBinding()]
param(
  [switch]$SkipHealthchecks
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

function Write-Section([string]$msg) { Write-Host "`n=== $msg ===" -ForegroundColor Cyan }
function Write-Ok([string]$msg) { Write-Host "[OK] $msg" -ForegroundColor Green }
function Write-WarnMsg([string]$msg) { Write-Host "[WARN] $msg" -ForegroundColor Yellow }
function Write-Fail([string]$msg) { Write-Host "[FAIL] $msg" -ForegroundColor Red }

function Load-EnvFile([string]$path) {
  $map = @{}
  Get-Content -Path $path | ForEach-Object {
    $line = $_.Trim()
    if (-not $line -or $line.StartsWith('#')) { return }
    $idx = $line.IndexOf('=')
    if ($idx -lt 1) { return }
    $key = $line.Substring(0, $idx).Trim()
    $value = $line.Substring($idx + 1).Trim()
    $map[$key] = $value
  }
  return $map
}

function Test-PortAvailable([int]$port) {
  try {
    $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $port)
    $listener.Start()
    $listener.Stop()
    return $true
  }
  catch {
    return $false
  }
}

function Wait-HttpOk([string]$url, [int]$timeoutSeconds = 25) {
  $deadline = (Get-Date).AddSeconds($timeoutSeconds)
  while ((Get-Date) -lt $deadline) {
    try {
      $res = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 4
      if ($res.StatusCode -ge 200 -and $res.StatusCode -lt 500) {
        return $true
      }
    }
    catch {}
    Start-Sleep -Seconds 1
  }
  return $false
}

$failures = New-Object System.Collections.Generic.List[string]
$warnings = New-Object System.Collections.Generic.List[string]

Write-Section 'Arquivos .env'
$envPaths = @{
  backend = Join-Path $root 'backend/.env'
  vendaiBackend = Join-Path $root 'vendai-backend/.env'
}

foreach ($k in $envPaths.Keys) {
  if (Test-Path $envPaths[$k]) {
    Write-Ok "$k .env encontrado"
  } else {
    $failures.Add("Arquivo ausente: $($envPaths[$k])")
    Write-Fail "$k .env não encontrado"
  }
}

$backendEnv = @{}
$vendaiEnv = @{}
if (Test-Path $envPaths.backend) { $backendEnv = Load-EnvFile $envPaths.backend }
if (Test-Path $envPaths.vendaiBackend) { $vendaiEnv = Load-EnvFile $envPaths.vendaiBackend }

Write-Section 'Variáveis obrigatórias'
$requiredBackend = @('MONGO_URI', 'JWT_SECRET', 'PORT')
$requiredVendai = @('MONGO_URI', 'SECRET_KEY', 'PORT')

foreach ($varName in $requiredBackend) {
  if (-not $backendEnv.ContainsKey($varName) -or [string]::IsNullOrWhiteSpace($backendEnv[$varName])) {
    $failures.Add("backend/.env: variável obrigatória faltando: $varName")
    Write-Fail "backend/.env sem $varName"
  } else {
    Write-Ok "backend/.env contém $varName"
  }
}

foreach ($varName in $requiredVendai) {
  if (-not $vendaiEnv.ContainsKey($varName) -or [string]::IsNullOrWhiteSpace($vendaiEnv[$varName])) {
    $failures.Add("vendai-backend/.env: variável obrigatória faltando: $varName")
    Write-Fail "vendai-backend/.env sem $varName"
  } else {
    Write-Ok "vendai-backend/.env contém $varName"
  }
}

Write-Section 'Validação de placeholders inseguros'
$placeholderRegex = '(?i)^(seu_|sua_|changeme|example|supersecret|secreto123|refreshsecreto123)$'
foreach ($entry in $backendEnv.GetEnumerator()) {
  if ($entry.Value -match $placeholderRegex) {
    $warnings.Add("backend/.env: $($entry.Key) parece placeholder inseguro")
    Write-WarnMsg "backend/.env $($entry.Key) com valor de placeholder"
  }
}
foreach ($entry in $vendaiEnv.GetEnumerator()) {
  if ($entry.Value -match $placeholderRegex) {
    $warnings.Add("vendai-backend/.env: $($entry.Key) parece placeholder inseguro")
    Write-WarnMsg "vendai-backend/.env $($entry.Key) com valor de placeholder"
  }
}

Write-Section 'Portas'
$backendPort = [int]($backendEnv.PORT | ForEach-Object { if ($_){$_} else {'5000'} })
$vendaiPort = [int]($vendaiEnv.PORT | ForEach-Object { if ($_){$_} else {'8000'} })
$frontendPort = 3000

foreach ($port in @($backendPort, $vendaiPort, $frontendPort)) {
  if (Test-PortAvailable $port) {
    Write-Ok "Porta $port disponível"
  } else {
    $warnings.Add("Porta $port já está em uso")
    Write-WarnMsg "Porta $port já está ocupada"
  }
}

Write-Section 'URLs hardcoded de desenvolvimento'
$hardcodedFiles = @(
  (Join-Path $root 'frontend/src/services/api.js'),
  (Join-Path $root 'frontend/src/pages/Reports.js'),
  (Join-Path $root 'vendai-frontend/src/services/api.ts')
)
foreach ($file in $hardcodedFiles) {
  if (Test-Path $file) {
    $content = Get-Content $file -Raw
    $hasLocalhost = $content -match '127\.0\.0\.1|localhost'
    $hasEnvBinding = $content -match 'REACT_APP_API_URL|NEXT_PUBLIC_API_URL'

    if ($hasLocalhost -and -not $hasEnvBinding) {
      $warnings.Add("URL local hardcoded em: $file")
      Write-WarnMsg "URL local detectada em $(Split-Path $file -Leaf)"
    } elseif ($hasLocalhost -and $hasEnvBinding) {
      Write-Ok "$(Split-Path $file -Leaf) usa variável de ambiente com fallback local"
    } else {
      Write-Ok "Sem localhost hardcoded em $(Split-Path $file -Leaf)"
    }
  }
}

if (-not $SkipHealthchecks) {
  Write-Section 'Healthchecks automatizados'

  $nodeProc = $null
  $pyProc = $null
  $nodeLog = Join-Path $root 'logs_preflight_node.txt'
  $nodeErr = Join-Path $root 'logs_preflight_node.err.txt'
  $pyLog = Join-Path $root 'logs_preflight_python.txt'
  $pyErr = Join-Path $root 'logs_preflight_python.err.txt'

  try {
    if (Test-PortAvailable $backendPort) {
      $nodeProc = Start-Process -FilePath 'node' -ArgumentList 'index.js' -WorkingDirectory (Join-Path $root 'backend') -RedirectStandardOutput $nodeLog -RedirectStandardError $nodeErr -PassThru
      Start-Sleep -Seconds 2
      if (Wait-HttpOk -url "http://127.0.0.1:$backendPort/api/products" -timeoutSeconds 25) {
        Write-Ok "Backend Node respondeu em /api/products"
      } else {
        $failures.Add('Backend Node não respondeu no healthcheck lógico /api/products')
        Write-Fail 'Backend Node sem resposta em /api/products'
      }
    } else {
      Write-WarnMsg "Pulando start do backend Node (porta $backendPort já ocupada)"
    }

    if (Test-PortAvailable $vendaiPort) {
      $pythonExe = Join-Path $root '.venv/Scripts/python.exe'
      if (-not (Test-Path $pythonExe)) { $pythonExe = 'python' }
      $pyProc = Start-Process -FilePath $pythonExe -ArgumentList '-m uvicorn main:app --host 127.0.0.1 --port 8000' -WorkingDirectory (Join-Path $root 'vendai-backend') -RedirectStandardOutput $pyLog -RedirectStandardError $pyErr -PassThru
      Start-Sleep -Seconds 2
      if (Wait-HttpOk -url "http://127.0.0.1:$vendaiPort/health" -timeoutSeconds 25) {
        Write-Ok 'VendAI backend respondeu em /health'
      } else {
        $failures.Add('VendAI backend não respondeu em /health')
        Write-Fail 'VendAI backend sem resposta em /health'
      }
    } else {
      Write-WarnMsg "Pulando start do VendAI backend (porta $vendaiPort já ocupada)"
    }
  }
  finally {
    if ($nodeProc -and -not $nodeProc.HasExited) { Stop-Process -Id $nodeProc.Id -Force }
    if ($pyProc -and -not $pyProc.HasExited) { Stop-Process -Id $pyProc.Id -Force }
  }
}

Write-Section 'Comandos de subida recomendados (produção)'
Write-Host '1) Backend Node:     cd backend && $env:NODE_ENV="production"; node index.js'
Write-Host '2) Frontend React:   cd frontend && npm ci && npm run build'
Write-Host '3) Backend FastAPI:  cd vendai-backend && .\.venv\Scripts\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8000'
Write-Host '4) Frontend Next:    cd vendai-frontend && npm ci && npm run build && npm run start'

Write-Section 'Resumo'
if ($warnings.Count -gt 0) {
  Write-Host "Warnings: $($warnings.Count)"
  $warnings | ForEach-Object { Write-WarnMsg $_ }
} else {
  Write-Ok 'Sem warnings'
}

if ($failures.Count -gt 0) {
  Write-Host "Falhas: $($failures.Count)"
  $failures | ForEach-Object { Write-Fail $_ }
  exit 1
}

Write-Ok 'Preflight concluído sem falhas bloqueantes.'
exit 0
