# =============================================================================
# DOCKERFILE - PEDIDO RÁPIDO API
# Multi-stage build para otimização de tamanho e segurança
# =============================================================================

# =============================================================================
# STAGE 1: Build
# =============================================================================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar arquivos de projeto para restore
COPY ["PedidoRapido.API/PedidoRapido.API.csproj", "PedidoRapido.API/"]
COPY ["PedidoRapido.Application/PedidoRapido.Application.csproj", "PedidoRapido.Application/"]
COPY ["PedidoRapido.Domain/PedidoRapido.Domain.csproj", "PedidoRapido.Domain/"]
COPY ["PedidoRapido.Infrastructure/PedidoRapido.Infrastructure.csproj", "PedidoRapido.Infrastructure/"]

# Restore dependencies
RUN dotnet restore "PedidoRapido.API/PedidoRapido.API.csproj"

# Copiar todo o código fonte
COPY . .

# Build da aplicação
WORKDIR "/src/PedidoRapido.API"
RUN dotnet build "PedidoRapido.API.csproj" -c Release -o /app/build

# =============================================================================
# STAGE 2: Publish
# =============================================================================
FROM build AS publish
RUN dotnet publish "PedidoRapido.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# =============================================================================
# STAGE 3: Runtime
# =============================================================================
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final

# Criar usuário não-root para segurança
RUN addgroup --system --gid 1001 dotnet \
    && adduser --system --uid 1001 --ingroup dotnet --shell /bin/false dotnet

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos publicados
COPY --from=publish /app/publish .

# Alterar ownership para usuário dotnet
RUN chown -R dotnet:dotnet /app
USER dotnet

# Expor porta 8080 (padrão para containers)
EXPOSE 8080

# Variáveis de ambiente padrão
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Entry point
ENTRYPOINT ["dotnet", "PedidoRapido.API.dll"]