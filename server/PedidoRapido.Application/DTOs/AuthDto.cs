namespace PedidoRapido.Application.DTOs;

/// <summary>
/// DTO para requisição de login.
/// </summary>
public class LoginRequestDto
{
    /// <summary>
    /// Email do usuário.
    /// </summary>
    /// <example>admin@pedidorapido.com</example>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Senha do usuário.
    /// </summary>
    /// <example>123456</example>
    public string Password { get; set; } = string.Empty;
}

/// <summary>
/// DTO para resposta de login com token JWT.
/// </summary>
public class LoginResponseDto
{
    /// <summary>
    /// Token JWT para autenticação.
    /// </summary>
    public string Token { get; set; } = string.Empty;

    /// <summary>
    /// Data de expiração do token.
    /// </summary>
    public DateTime ExpiresAt { get; set; }

    /// <summary>
    /// Dados do usuário autenticado.
    /// </summary>
    public UserDto User { get; set; } = null!;
}

/// <summary>
/// DTO com informações do usuário autenticado.
/// </summary>
public class UserDto
{
    /// <summary>
    /// Identificador único do usuário.
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Nome completo do usuário.
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Email do usuário.
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Papel do usuário no sistema.
    /// </summary>
    public string Role { get; set; } = string.Empty;

    /// <summary>
    /// ID do quiosque (se aplicável).
    /// </summary>
    public Guid? KioskId { get; set; }

    /// <summary>
    /// Nome do quiosque (se aplicável).
    /// </summary>
    public string? KioskName { get; set; }
}

/// <summary>
/// DTO para erro de autenticação.
/// </summary>
public class AuthErrorDto
{
    /// <summary>
    /// Mensagem de erro.
    /// </summary>
    public string Message { get; set; } = string.Empty;

    /// <summary>
    /// Código de erro.
    /// </summary>
    public string Code { get; set; } = string.Empty;
}

