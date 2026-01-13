# =============================================================================
# VALIDAÇÃO DE BUILD - PEDIDO RÁPIDO API
# Script PowerShell para validar o projeto antes do deploy
# =============================================================================

Write-Host "🔍 Validando projeto Pedido Rápido API..." -ForegroundColor Green

$hasErrors = $false

# Verificar se estamos na pasta correta
if (-not (Test-Path "PedidoRapido.sln")) {
    Write-Host "❌ Arquivo PedidoRapido.sln não encontrado. Execute na pasta server/" -ForegroundColor Red
    exit 1
}

# Verificar arquivos essenciais
$requiredFiles = @(
    "Dockerfile",
    "docker-compose.yml",
    ".dockerignore",
    "railway.toml",
    "PedidoRapido.API/appsettings.Production.json",
    "README-DEPLOY.md"
)

Write-Host "📁 Verificando arquivos essenciais..." -ForegroundColor Yellow
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file" -ForegroundColor Red
        $hasErrors = $true
    }
}

# Verificar se .NET SDK está instalado
Write-Host "🔧 Verificando .NET SDK..." -ForegroundColor Yellow
try {
    $dotnetVersion = dotnet --version
    Write-Host "  ✅ .NET SDK $dotnetVersion" -ForegroundColor Green
} catch {
    Write-Host "  ❌ .NET SDK não encontrado" -ForegroundColor Red
    $hasErrors = $true
}

# Tentar build do projeto
Write-Host "🔨 Testando build do projeto..." -ForegroundColor Yellow
try {
    $buildResult = dotnet build PedidoRapido.API/PedidoRapido.API.csproj -c Release --verbosity quiet
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ Build bem-sucedido" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Falha no build" -ForegroundColor Red
        $hasErrors = $true
    }
} catch {
    Write-Host "  ❌ Erro ao executar build: $_" -ForegroundColor Red
    $hasErrors = $true
}

# Verificar configurações de produção
Write-Host "⚙️  Verificando configurações..." -ForegroundColor Yellow

try {
    $prodConfig = Get-Content "PedidoRapido.API/appsettings.Production.json" | ConvertFrom-Json
    if ($prodConfig.UseEntityFramework -eq $true) {
        Write-Host "  ✅ UseEntityFramework configurado para produção" -ForegroundColor Green
    } else {
        Write-Host "  ❌ UseEntityFramework deve ser true em produção" -ForegroundColor Red
        $hasErrors = $true
    }

    if ($prodConfig.Logging.LogLevel.Default -eq "Warning") {
        Write-Host "  ✅ Logging configurado para produção" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  Considere usar Warning para logs em produção" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  ❌ Erro ao ler appsettings.Production.json" -ForegroundColor Red
    $hasErrors = $true
}

# Verificar Dockerfile
Write-Host "🐳 Verificando Dockerfile..." -ForegroundColor Yellow
try {
    $dockerfileContent = Get-Content "Dockerfile" -Raw
    if ($dockerfileContent -match "EXPOSE 8080") {
        Write-Host "  ✅ Porta 8080 exposta" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Porta 8080 não encontrada no Dockerfile" -ForegroundColor Red
        $hasErrors = $true
    }

    if ($dockerfileContent -match "ASPNETCORE_URLS=http://\+:8080") {
        Write-Host "  ✅ ASPNETCORE_URLS configurado" -ForegroundColor Green
    } else {
        Write-Host "  ❌ ASPNETCORE_URLS não configurado" -ForegroundColor Red
        $hasErrors = $true
    }
} catch {
    Write-Host "  ❌ Erro ao ler Dockerfile" -ForegroundColor Red
    $hasErrors = $true
}

# Resumo
Write-Host "`n📋 RESUMO DA VALIDAÇÃO" -ForegroundColor Cyan
Write-Host "======================" -ForegroundColor Cyan

if ($hasErrors) {
    Write-Host "❌ Validação falhou! Corrija os erros antes do deploy." -ForegroundColor Red
    exit 1
} else {
    Write-Host "✅ Projeto validado com sucesso!" -ForegroundColor Green
    Write-Host "`n🚀 Próximos passos:" -ForegroundColor Yellow
    Write-Host "  1. docker build -t pedido-rapido-api:latest ." -ForegroundColor White
    Write-Host "  2. Configurar variáveis de ambiente no provedor cloud" -ForegroundColor White
    Write-Host "  3. Fazer deploy" -ForegroundColor White
    Write-Host "`n📚 Consulte README-DEPLOY.md para instruções detalhadas" -ForegroundColor Cyan
}