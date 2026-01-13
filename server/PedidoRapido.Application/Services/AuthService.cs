using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using PedidoRapido.Application.DTOs;
using PedidoRapido.Application.Interfaces;
using PedidoRapido.Domain.Entities;
using PedidoRapido.Domain.Interfaces;

namespace PedidoRapido.Application.Services;

/// <summary>
/// Serviço de autenticação.
/// Valida credenciais contra usuários seedados e gera tokens JWT.
/// </summary>
public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IKioskRepository _kioskRepository;
    private readonly IConfiguration _configuration;

    // Senha padrão para todos os usuários seedados (em produção, usar hash real)
    private const string DEFAULT_PASSWORD = "123456";

    public AuthService(
        IUserRepository userRepository,
        IKioskRepository kioskRepository,
        IConfiguration configuration)
    {
        _userRepository = userRepository;
        _kioskRepository = kioskRepository;
        _configuration = configuration;
    }

    /// <inheritdoc />
    public async Task<LoginResponseDto?> LoginAsync(LoginRequestDto request)
    {
        // Buscar usuário por email
        var user = await _userRepository.GetByEmailAsync(request.Email);
        
        if (user == null)
        {
            return null; // Usuário não encontrado
        }

        // Validar senha (em produção, usar BCrypt ou similar)
        // Para desenvolvimento, aceitamos a senha padrão ou "hashed_password" como indicador
        if (!ValidatePassword(request.Password, user.PasswordHash))
        {
            return null; // Senha inválida
        }

        // Buscar dados do quiosque se aplicável
        Kiosk? kiosk = null;
        if (user.KioskId.HasValue)
        {
            kiosk = await _kioskRepository.GetByIdAsync(user.KioskId.Value);
        }

        // Gerar token JWT
        var token = GenerateJwtToken(user);
        var expiresAt = DateTime.UtcNow.AddHours(GetTokenExpirationHours());

        return new LoginResponseDto
        {
            Token = token,
            ExpiresAt = expiresAt,
            User = new UserDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role.ToString(),
                KioskId = user.KioskId,
                KioskName = kiosk?.Name
            }
        };
    }

    /// <inheritdoc />
    public Task<bool> ValidateTokenAsync(string token)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(GetJwtSecret());

            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = GetJwtIssuer(),
                ValidateAudience = true,
                ValidAudience = GetJwtAudience(),
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            }, out _);

            return Task.FromResult(true);
        }
        catch
        {
            return Task.FromResult(false);
        }
    }

    /// <inheritdoc />
    public async Task<UserDto?> GetUserByIdAsync(Guid userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        
        if (user == null)
        {
            return null;
        }

        Kiosk? kiosk = null;
        if (user.KioskId.HasValue)
        {
            kiosk = await _kioskRepository.GetByIdAsync(user.KioskId.Value);
        }

        return new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role.ToString(),
            KioskId = user.KioskId,
            KioskName = kiosk?.Name
        };
    }

    // =========================================================================
    // Métodos Privados
    // =========================================================================

    /// <summary>
    /// Valida a senha do usuário.
    /// Em desenvolvimento, aceita a senha padrão "123456".
    /// Em produção, deve usar BCrypt ou similar.
    /// </summary>
    private bool ValidatePassword(string inputPassword, string storedHash)
    {
        // Para desenvolvimento: aceita senha padrão ou qualquer senha se hash é "hashed_password"
        if (storedHash == "hashed_password")
        {
            return inputPassword == DEFAULT_PASSWORD;
        }

        // Para produção: usar BCrypt.Verify(inputPassword, storedHash)
        return inputPassword == DEFAULT_PASSWORD;
    }

    /// <summary>
    /// Gera um token JWT para o usuário.
    /// </summary>
    private string GenerateJwtToken(User user)
    {
        var key = Encoding.UTF8.GetBytes(GetJwtSecret());
        var tokenHandler = new JwtSecurityTokenHandler();

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Name, user.Name),
            new(ClaimTypes.Role, user.Role.ToString()),
            new("userId", user.Id.ToString()),
            new("role", user.Role.ToString())
        };

        // Adicionar kioskId se aplicável
        if (user.KioskId.HasValue)
        {
            claims.Add(new Claim("kioskId", user.KioskId.Value.ToString()));
        }

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddHours(GetTokenExpirationHours()),
            Issuer = GetJwtIssuer(),
            Audience = GetJwtAudience(),
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    // =========================================================================
    // Helpers de Configuração
    // =========================================================================

    private string GetJwtSecret() =>
        _configuration["JwtSettings:Secret"] ?? throw new InvalidOperationException("JWT Secret não configurado");

    private string GetJwtIssuer() =>
        _configuration["JwtSettings:Issuer"] ?? "PedidoRapido.API";

    private string GetJwtAudience() =>
        _configuration["JwtSettings:Audience"] ?? "PedidoRapido.Frontend";

    private int GetTokenExpirationHours() =>
        int.TryParse(_configuration["JwtSettings:ExpirationInHours"], out var hours) ? hours : 2;
}

