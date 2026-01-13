using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PedidoRapido.Application.DTOs;
using PedidoRapido.Application.Interfaces;

namespace PedidoRapido.API.Controllers;

/// <summary>
/// Controller de autenticação.
/// Endpoints para login e validação de token.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    /// <summary>
    /// Realiza login do usuário.
    /// </summary>
    /// <param name="request">Email e senha do usuário.</param>
    /// <returns>Token JWT e dados do usuário.</returns>
    /// <response code="200">Login realizado com sucesso.</response>
    /// <response code="401">Credenciais inválidas.</response>
    [HttpPost("login")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(LoginResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(AuthErrorDto), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        // Validação básica
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return Unauthorized(new AuthErrorDto
            {
                Message = "Email e senha são obrigatórios",
                Code = "INVALID_CREDENTIALS"
            });
        }

        var result = await _authService.LoginAsync(request);

        if (result == null)
        {
            return Unauthorized(new AuthErrorDto
            {
                Message = "Email ou senha inválidos",
                Code = "INVALID_CREDENTIALS"
            });
        }

        return Ok(result);
    }

    /// <summary>
    /// Obtém os dados do usuário autenticado.
    /// </summary>
    /// <returns>Dados do usuário.</returns>
    /// <response code="200">Dados do usuário.</response>
    /// <response code="401">Não autenticado.</response>
    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetCurrentUser()
    {
        // Obter userId do token
        var userIdClaim = User.FindFirst("userId")?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new AuthErrorDto
            {
                Message = "Token inválido",
                Code = "INVALID_TOKEN"
            });
        }

        var user = await _authService.GetUserByIdAsync(userId);

        if (user == null)
        {
            return Unauthorized(new AuthErrorDto
            {
                Message = "Usuário não encontrado",
                Code = "USER_NOT_FOUND"
            });
        }

        return Ok(user);
    }

    /// <summary>
    /// Valida se o token JWT é válido.
    /// </summary>
    /// <returns>Status de validação.</returns>
    /// <response code="200">Token válido.</response>
    /// <response code="401">Token inválido.</response>
    [HttpGet("validate")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public IActionResult ValidateToken()
    {
        // Se chegou aqui, o token já foi validado pelo middleware
        return Ok(new { valid = true, message = "Token válido" });
    }
}

