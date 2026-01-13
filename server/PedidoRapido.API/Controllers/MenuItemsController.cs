using Microsoft.AspNetCore.Mvc;
using PedidoRapido.Application.DTOs;
using PedidoRapido.Application.Interfaces;

namespace PedidoRapido.API.Controllers;

/// <summary>
/// Controller de Itens de Menu.
/// Gerencia operações CRUD de pratos e bebidas.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class MenuItemsController : ControllerBase
{
    private readonly IMenuItemService _menuItemService;
    private readonly ILogger<MenuItemsController> _logger;

    public MenuItemsController(IMenuItemService menuItemService, ILogger<MenuItemsController> logger)
    {
        _menuItemService = menuItemService;
        _logger = logger;
    }

    /// <summary>
    /// Lista todos os itens de menu
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<MenuItemDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<MenuItemDto>>> GetAll()
    {
        var items = await _menuItemService.GetAllAsync();
        return Ok(items);
    }

    /// <summary>
    /// Lista itens de menu de um quiosque
    /// </summary>
    [HttpGet("kiosk/{kioskId:guid}")]
    [ProducesResponseType(typeof(IEnumerable<MenuItemDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<MenuItemDto>>> GetByKiosk(Guid kioskId)
    {
        var items = await _menuItemService.GetByKioskIdAsync(kioskId);
        return Ok(items);
    }

    /// <summary>
    /// Obtém um item por ID
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(MenuItemDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<MenuItemDto>> GetById(Guid id)
    {
        var item = await _menuItemService.GetByIdAsync(id);
        if (item == null)
            return NotFound(new { message = "Item não encontrado" });
        
        return Ok(item);
    }

    /// <summary>
    /// Cria um novo item de menu
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(MenuItemDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<MenuItemDto>> Create([FromBody] CreateMenuItemDto dto)
    {
        try
        {
            var item = await _menuItemService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
        }
        catch (KeyNotFoundException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao criar item de menu");
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Atualiza um item de menu
    /// </summary>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(MenuItemDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<MenuItemDto>> Update(Guid id, [FromBody] UpdateMenuItemDto dto)
    {
        try
        {
            var item = await _menuItemService.UpdateAsync(id, dto);
            return Ok(item);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Item não encontrado" });
        }
    }

    /// <summary>
    /// Remove um item de menu
    /// </summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _menuItemService.DeleteAsync(id);
        if (!deleted)
            return NotFound(new { message = "Item não encontrado" });
        
        return NoContent();
    }

    /// <summary>
    /// Obtém ranking dos pratos mais bem avaliados
    /// </summary>
    [HttpGet("ranking/dishes")]
    [ProducesResponseType(typeof(IEnumerable<MenuItemRankingDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<MenuItemRankingDto>>> GetTopDishes([FromQuery] int limit = 10)
    {
        var ranking = await _menuItemService.GetTopRatedDishesAsync(limit);
        return Ok(ranking);
    }

    /// <summary>
    /// Obtém ranking das bebidas mais bem avaliadas
    /// </summary>
    [HttpGet("ranking/drinks")]
    [ProducesResponseType(typeof(IEnumerable<MenuItemRankingDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<MenuItemRankingDto>>> GetTopDrinks([FromQuery] int limit = 10)
    {
        var ranking = await _menuItemService.GetTopRatedDrinksAsync(limit);
        return Ok(ranking);
    }
}

