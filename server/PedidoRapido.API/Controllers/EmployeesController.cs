using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PedidoRapido.Application.DTOs;
using PedidoRapido.Application.Interfaces;

namespace PedidoRapido.API.Controllers;

/// <summary>
/// Controller de Funcionários.
/// Gerencia operações CRUD de funcionários vinculados a quiosques.
/// Requer autenticação de Admin ou Super Admin.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[Authorize(Policy = "Admin")] // Requer Admin ou SuperAdmin
public class EmployeesController : ControllerBase
{
    private readonly IEmployeeService _employeeService;
    private readonly ILogger<EmployeesController> _logger;

    public EmployeesController(IEmployeeService employeeService, ILogger<EmployeesController> logger)
    {
        _employeeService = employeeService;
        _logger = logger;
    }

    /// <summary>
    /// Lista todos os funcionários
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<EmployeeDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<EmployeeDto>>> GetAll()
    {
        var employees = await _employeeService.GetAllAsync();
        return Ok(employees);
    }

    /// <summary>
    /// Lista funcionários de um quiosque
    /// </summary>
    [HttpGet("kiosk/{kioskId:guid}")]
    [ProducesResponseType(typeof(IEnumerable<EmployeeDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<EmployeeDto>>> GetByKiosk(Guid kioskId)
    {
        var employees = await _employeeService.GetByKioskIdAsync(kioskId);
        return Ok(employees);
    }

    /// <summary>
    /// Obtém um funcionário por ID
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(EmployeeDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<EmployeeDto>> GetById(Guid id)
    {
        var employee = await _employeeService.GetByIdAsync(id);
        if (employee == null)
            return NotFound(new { message = "Funcionário não encontrado" });
        
        return Ok(employee);
    }

    /// <summary>
    /// Cria um novo funcionário
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(EmployeeDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<EmployeeDto>> Create([FromBody] CreateEmployeeDto dto)
    {
        try
        {
            var employee = await _employeeService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = employee.Id }, employee);
        }
        catch (KeyNotFoundException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao criar funcionário");
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Atualiza um funcionário
    /// </summary>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(EmployeeDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<EmployeeDto>> Update(Guid id, [FromBody] UpdateEmployeeDto dto)
    {
        try
        {
            var employee = await _employeeService.UpdateAsync(id, dto);
            return Ok(employee);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Funcionário não encontrado" });
        }
    }

    /// <summary>
    /// Remove um funcionário
    /// </summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _employeeService.DeleteAsync(id);
        if (!deleted)
            return NotFound(new { message = "Funcionário não encontrado" });
        
        return NoContent();
    }

    /// <summary>
    /// Obtém ranking dos funcionários mais bem avaliados (público)
    /// </summary>
    [HttpGet("ranking")]
    [AllowAnonymous] // Ranking é público
    [ProducesResponseType(typeof(IEnumerable<EmployeeRankingDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<EmployeeRankingDto>>> GetRanking([FromQuery] int limit = 10)
    {
        var ranking = await _employeeService.GetTopRatedAsync(limit);
        return Ok(ranking);
    }
}

