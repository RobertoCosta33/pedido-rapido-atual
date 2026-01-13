#!/bin/bash

# =============================================================================
# DEPLOY SCRIPT - RAILWAY
# Script para deploy automatizado no Railway
# =============================================================================

set -e

echo "🚂 Iniciando deploy no Railway..."

# Verificar se Railway CLI está instalado
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI não encontrado."
    echo "📥 Instale com: npm install -g @railway/cli"
    exit 1
fi

# Verificar se está logado
if ! railway whoami &> /dev/null; then
    echo "🔐 Fazendo login no Railway..."
    railway login
fi

# Verificar se existe um projeto
if ! railway status &> /dev/null; then
    echo "📦 Criando novo projeto no Railway..."
    railway init
fi

# Configurar variáveis de ambiente
echo "⚙️  Configurando variáveis de ambiente..."

# Variáveis obrigatórias
railway variables set ASPNETCORE_ENVIRONMENT=Production
railway variables set ASPNETCORE_URLS=http://+:8080
railway variables set UseEntityFramework=true

# JWT (gerar secret aleatório se não existir)
JWT_SECRET=${JWT_SECRET:-$(openssl rand -base64 32)}
railway variables set Jwt__Secret="$JWT_SECRET"
railway variables set Jwt__Issuer="PedidoRapido.API"
railway variables set Jwt__Audience="PedidoRapido.Frontend"

# PostgreSQL (Railway provisiona automaticamente)
echo "🗄️  PostgreSQL será provisionado automaticamente pelo Railway"

# CORS (configurar domínio do frontend)
FRONTEND_URL=${FRONTEND_URL:-"https://pedidorapido.vercel.app"}
railway variables set CORS__AllowedOrigins="$FRONTEND_URL"

# Stripe (deve ser configurado manualmente)
echo "💳 Configure as variáveis do Stripe manualmente:"
echo "   railway variables set Stripe__SecretKey=sk_live_..."
echo "   railway variables set Stripe__PublicKey=pk_live_..."
echo "   railway variables set Stripe__WebhookSecret=whsec_..."

# Deploy
echo "🚀 Fazendo deploy..."
railway up

# Verificar status
echo "📊 Verificando status do deploy..."
railway status

echo "✅ Deploy concluído!"
echo ""
echo "🔗 Links úteis:"
echo "   Dashboard: https://railway.app/dashboard"
echo "   Logs: railway logs"
echo "   Variáveis: railway variables"
echo ""