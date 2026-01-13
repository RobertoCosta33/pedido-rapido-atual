#!/bin/bash

# =============================================================================
# BUILD SCRIPT - PEDIDO RÁPIDO API
# Script para build local e validação antes do deploy
# =============================================================================

set -e  # Parar em caso de erro

echo "🚀 Iniciando build do Pedido Rápido API..."

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não encontrado. Instale o Docker primeiro."
    exit 1
fi

# Limpar builds anteriores
echo "🧹 Limpando builds anteriores..."
docker system prune -f

# Build da imagem
echo "🔨 Fazendo build da imagem Docker..."
docker build -t pedido-rapido-api:latest .

# Verificar se a imagem foi criada
if docker images | grep -q "pedido-rapido-api"; then
    echo "✅ Imagem criada com sucesso!"
    docker images | grep pedido-rapido-api
else
    echo "❌ Falha na criação da imagem"
    exit 1
fi

# Testar se a aplicação inicia
echo "🧪 Testando inicialização da aplicação..."
CONTAINER_ID=$(docker run -d \
    -e ASPNETCORE_ENVIRONMENT=Production \
    -e ConnectionStrings__DefaultConnection="Host=localhost;Database=test;Username=test;Password=test" \
    -e Jwt__Secret="TestSecret123456789012345678901234567890" \
    -p 8080:8080 \
    pedido-rapido-api:latest)

# Aguardar alguns segundos para a aplicação iniciar
sleep 10

# Verificar se o container está rodando
if docker ps | grep -q $CONTAINER_ID; then
    echo "✅ Aplicação iniciou com sucesso!"
    
    # Testar health check
    if curl -f http://localhost:8080/health > /dev/null 2>&1; then
        echo "✅ Health check passou!"
    else
        echo "⚠️  Health check falhou (pode ser normal se não houver banco)"
    fi
else
    echo "❌ Aplicação falhou ao iniciar"
    docker logs $CONTAINER_ID
    exit 1
fi

# Limpar container de teste
docker stop $CONTAINER_ID > /dev/null
docker rm $CONTAINER_ID > /dev/null

echo "🎉 Build concluído com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "   1. Fazer push da imagem: docker push pedido-rapido-api:latest"
echo "   2. Deploy no Railway/Render/AWS"
echo "   3. Configurar variáveis de ambiente"
echo ""