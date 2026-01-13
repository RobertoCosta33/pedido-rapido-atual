# 🚀 DEPLOY EM PRODUÇÃO - PEDIDO RÁPIDO API

Este guia contém todas as instruções para fazer deploy da API Pedido Rápido em ambientes cloud.

## 📋 PRÉ-REQUISITOS

- ✅ Docker instalado
- ✅ Conta no provedor cloud (Railway, Render, AWS, etc.)
- ✅ Variáveis de ambiente configuradas
- ✅ Banco PostgreSQL disponível

## 🐳 BUILD LOCAL

```bash
# Navegar para a pasta server
cd server

# Build da imagem Docker
docker build -t pedido-rapido-api:latest .

# Testar localmente
docker run -p 8080:8080 \
  -e ASPNETCORE_ENVIRONMENT=Production \
  -e ConnectionStrings__DefaultConnection="Host=localhost;Database=pedido_rapido;Username=postgres;Password=postgres" \
  -e Jwt__Secret="PedidoRapido-SuperSecretKey-2026-MinLength32Chars!" \
  pedido-rapido-api:latest

# Verificar health check
curl http://localhost:8080/health
```

## 🚂 DEPLOY NO RAILWAY

### 1. Instalação do CLI

```bash
npm install -g @railway/cli
railway login
```

### 2. Configuração do Projeto

```bash
cd server
railway init
```

### 3. Variáveis de Ambiente

```bash
# Ambiente
railway variables set ASPNETCORE_ENVIRONMENT=Production
railway variables set ASPNETCORE_URLS=http://+:$PORT
railway variables set UseEntityFramework=true

# JWT
railway variables set Jwt__Secret="$(openssl rand -base64 32)"
railway variables set Jwt__Issuer="PedidoRapido.API"
railway variables set Jwt__Audience="PedidoRapido.Frontend"

# PostgreSQL (Railway provisiona automaticamente)
# A variável DATABASE_URL será criada automaticamente

# CORS
railway variables set CORS__AllowedOrigins="https://seudominio.com"

# Stripe (configurar com suas chaves reais)
railway variables set Stripe__SecretKey="sk_live_..."
railway variables set Stripe__PublicKey="pk_live_..."
railway variables set Stripe__WebhookSecret="whsec_..."
```

### 4. Deploy

```bash
railway up
```

### 5. Verificação

```bash
railway status
railway logs
```

## 🎨 DEPLOY NO RENDER

### 1. Configuração no Dashboard

1. Acesse [render.com](https://render.com)
2. Conecte seu repositório GitHub
3. Crie um novo **Web Service**
4. Configure:
   - **Runtime**: Docker
   - **Build Command**: (deixe vazio)
   - **Start Command**: (deixe vazio)

### 2. Variáveis de Ambiente

Configure no dashboard do Render:

```env
# Ambiente
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://+:10000
UseEntityFramework=true

# JWT
Jwt__Secret=SeuSecretSuperSeguroAqui32Chars
Jwt__Issuer=PedidoRapido.API
Jwt__Audience=PedidoRapido.Frontend

# PostgreSQL (criar database separado no Render)
ConnectionStrings__DefaultConnection=postgresql://user:pass@host:port/db

# CORS
CORS__AllowedOrigins=https://seudominio.com

# Stripe
Stripe__SecretKey=sk_live_...
Stripe__PublicKey=pk_live_...
Stripe__WebhookSecret=whsec_...
```

### 3. Deploy

O deploy acontece automaticamente após configuração.

## ☁️ DEPLOY NA AWS (ECS/Fargate)

### 1. Build e Push para ECR

```bash
# Criar repositório ECR
aws ecr create-repository --repository-name pedido-rapido-api

# Login no ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com

# Tag e push
docker tag pedido-rapido-api:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/pedido-rapido-api:latest
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/pedido-rapido-api:latest
```

### 2. Configurar ECS Task Definition

```json
{
  "family": "pedido-rapido-api",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::123456789012:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "pedido-rapido-api",
      "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/pedido-rapido-api:latest",
      "portMappings": [
        {
          "containerPort": 8080,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "ASPNETCORE_ENVIRONMENT",
          "value": "Production"
        },
        {
          "name": "ASPNETCORE_URLS",
          "value": "http://+:8080"
        }
      ],
      "secrets": [
        {
          "name": "ConnectionStrings__DefaultConnection",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789012:secret:pedido-rapido-db"
        },
        {
          "name": "Jwt__Secret",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789012:secret:pedido-rapido-jwt"
        }
      ],
      "healthCheck": {
        "command": [
          "CMD-SHELL",
          "curl -f http://localhost:8080/health || exit 1"
        ],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
```

## 🔧 VARIÁVEIS DE AMBIENTE OBRIGATÓRIAS

| Variável                               | Descrição                                  | Exemplo                                                      |
| -------------------------------------- | ------------------------------------------ | ------------------------------------------------------------ |
| `ASPNETCORE_ENVIRONMENT`               | Ambiente da aplicação                      | `Production`                                                 |
| `ASPNETCORE_URLS`                      | URLs de bind                               | `http://+:8080`                                              |
| `ConnectionStrings__DefaultConnection` | String de conexão PostgreSQL               | `Host=db;Database=pedido_rapido;Username=user;Password=pass` |
| `Jwt__Secret`                          | Chave secreta JWT (min 32 chars)           | `SuperSecretKey32CharsMinimum!`                              |
| `Jwt__Issuer`                          | Emissor do token                           | `PedidoRapido.API`                                           |
| `Jwt__Audience`                        | Audiência do token                         | `PedidoRapido.Frontend`                                      |
| `Stripe__SecretKey`                    | Chave secreta do Stripe                    | `sk_live_...`                                                |
| `Stripe__PublicKey`                    | Chave pública do Stripe                    | `pk_live_...`                                                |
| `Stripe__WebhookSecret`                | Secret do webhook Stripe                   | `whsec_...`                                                  |
| `CORS__AllowedOrigins`                 | Origens permitidas (separadas por vírgula) | `https://app.com,https://www.app.com`                        |

## 🏥 HEALTH CHECK

A aplicação expõe um endpoint de health check em `/health`:

```json
{
  "status": "Healthy",
  "environment": "Production",
  "timestamp": "2025-01-13T10:30:00Z",
  "version": "1.0.0",
  "checks": [
    {
      "name": "postgresql",
      "status": "Healthy",
      "duration": 45.2
    },
    {
      "name": "self",
      "status": "Healthy",
      "duration": 1.1
    }
  ]
}
```

## 🔍 TROUBLESHOOTING

### Problema: Aplicação não inicia

```bash
# Verificar logs
docker logs <container_id>

# Verificar variáveis de ambiente
docker exec <container_id> env | grep -E "(ASPNETCORE|ConnectionStrings|Jwt)"
```

### Problema: Erro de conexão com banco

```bash
# Testar conexão manualmente
docker exec <container_id> pg_isready -h <host> -p <port> -U <user>
```

### Problema: JWT não funciona

- Verificar se `Jwt__Secret` tem pelo menos 32 caracteres
- Verificar se `Jwt__Issuer` e `Jwt__Audience` estão corretos
- Verificar se o token está sendo enviado no header `Authorization: Bearer <token>`

### Problema: CORS

- Verificar se `CORS__AllowedOrigins` inclui o domínio do frontend
- Verificar se não há espaços extras nas URLs
- Verificar se o protocolo (http/https) está correto

## 📚 RECURSOS ADICIONAIS

- [Documentação Railway](https://docs.railway.app/)
- [Documentação Render](https://render.com/docs)
- [Documentação AWS ECS](https://docs.aws.amazon.com/ecs/)
- [ASP.NET Core em Produção](https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/)

## 🆘 SUPORTE

Em caso de problemas:

1. Verificar logs da aplicação
2. Verificar health check: `GET /health`
3. Verificar variáveis de ambiente
4. Verificar conectividade com banco de dados
