using PedidoRapido.Application.DTOs;

namespace PedidoRapido.Application.Interfaces;

/// <summary>
/// Interface do serviço de Funcionários.
/// </summary>
public interface IEmployeeService
{
    Task<EmployeeDto?> GetByIdAsync(Guid id);
    Task<IEnumerable<EmployeeDto>> GetAllAsync();
    Task<IEnumerable<EmployeeDto>> GetByKioskIdAsync(Guid kioskId);
    Task<EmployeeDto> CreateAsync(CreateEmployeeDto dto);
    Task<EmployeeDto> UpdateAsync(Guid id, UpdateEmployeeDto dto);
    Task<bool> DeleteAsync(Guid id);
    Task<IEnumerable<EmployeeRankingDto>> GetTopRatedAsync(int limit = 10);
}

