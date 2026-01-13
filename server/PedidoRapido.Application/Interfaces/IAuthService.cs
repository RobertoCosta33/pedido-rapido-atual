using PedidoRapido.Application.DTOs;

namespace PedidoRapido.Application.Interfaces;

/// <summary>
/// Interface do serviço de autenticação.
/// Responsável por validar credenciais e gerar tokens JWT.
/// </summary>
public interface IAuthService
{
    /// <summary>
    /// Realiza o login do usuário.
    /// </summary>
    /// <param name="request">Dados de login (email e senha).</param>
    /// <returns>Resposta com token JWT e dados do usuário, ou null se credenciais inválidas.</returns>
    Task<LoginResponseDto?> LoginAsync(LoginRequestDto request);

    /// <summary>
    /// Valida se um token JWT é válido.
    /// </summary>
    /// <param name="token">Token JWT a ser validado.</param>
    /// <returns>True se o token é válido, false caso contrário.</returns>
    Task<bool> ValidateTokenAsync(string token);

    /// <summary>
    /// Obtém os dados do usuário a partir do token.
    /// </summary>
    /// <param name="userId">ID do usuário.</param>
    /// <returns>Dados do usuário ou null se não encontrado.</returns>
    Task<UserDto?> GetUserByIdAsync(Guid userId);
}

