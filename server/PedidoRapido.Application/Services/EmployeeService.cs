using PedidoRapido.Application.DTOs;
using PedidoRapido.Application.Interfaces;
using PedidoRapido.Domain.Entities;
using PedidoRapido.Domain.Interfaces;

namespace PedidoRapido.Application.Services;

/// <summary>
/// Serviço de Funcionários.
/// </summary>
public class EmployeeService : IEmployeeService
{
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IKioskRepository _kioskRepository;

    public EmployeeService(
        IEmployeeRepository employeeRepository,
        IKioskRepository kioskRepository)
    {
        _employeeRepository = employeeRepository;
        _kioskRepository = kioskRepository;
    }

    public async Task<EmployeeDto?> GetByIdAsync(Guid id)
    {
        var employee = await _employeeRepository.GetByIdAsync(id);
        if (employee == null) return null;
        
        return await ToDto(employee);
    }

    public async Task<IEnumerable<EmployeeDto>> GetAllAsync()
    {
        var employees = await _employeeRepository.GetAllAsync();
        var result = new List<EmployeeDto>();
        
        foreach (var emp in employees)
        {
            result.Add(await ToDto(emp));
        }
        
        return result;
    }

    public async Task<IEnumerable<EmployeeDto>> GetByKioskIdAsync(Guid kioskId)
    {
        var employees = await _employeeRepository.GetByKioskIdAsync(kioskId);
        var result = new List<EmployeeDto>();
        
        foreach (var emp in employees)
        {
            result.Add(await ToDto(emp));
        }
        
        return result;
    }

    public async Task<EmployeeDto> CreateAsync(CreateEmployeeDto dto)
    {
        var kiosk = await _kioskRepository.GetByIdAsync(dto.KioskId)
            ?? throw new KeyNotFoundException($"Quiosque {dto.KioskId} não encontrado");

        var employee = new Employee
        {
            KioskId = dto.KioskId,
            Name = dto.Name,
            Role = dto.Role,
            Phone = dto.Phone,
            Email = dto.Email,
            Document = dto.Document,
            HireDate = dto.HireDate,
            Salary = dto.Salary,
            WorkSchedule = dto.WorkSchedule ?? string.Empty,
            Photo = dto.Photo
        };

        var created = await _employeeRepository.AddAsync(employee);
        return await ToDto(created);
    }

    public async Task<EmployeeDto> UpdateAsync(Guid id, UpdateEmployeeDto dto)
    {
        var employee = await _employeeRepository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Funcionário {id} não encontrado");

        if (dto.Name != null) employee.Name = dto.Name;
        if (dto.Role.HasValue) employee.Role = dto.Role.Value;
        if (dto.Phone != null) employee.Phone = dto.Phone;
        if (dto.Email != null) employee.Email = dto.Email;
        if (dto.Salary.HasValue) employee.Salary = dto.Salary.Value;
        if (dto.WorkSchedule != null) employee.WorkSchedule = dto.WorkSchedule;
        if (dto.Photo != null) employee.Photo = dto.Photo;
        if (dto.IsActive.HasValue) employee.IsActive = dto.IsActive.Value;

        employee.UpdatedAt = DateTime.UtcNow;

        var updated = await _employeeRepository.UpdateAsync(employee);
        return await ToDto(updated);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        return await _employeeRepository.DeleteAsync(id);
    }

    public async Task<IEnumerable<EmployeeRankingDto>> GetTopRatedAsync(int limit = 10)
    {
        var topEmployees = await _employeeRepository.GetTopRatedAsync(limit);
        var result = new List<EmployeeRankingDto>();
        int position = 1;

        foreach (var emp in topEmployees)
        {
            var kiosk = await _kioskRepository.GetByIdAsync(emp.KioskId);
            
            result.Add(new EmployeeRankingDto(
                emp.Id,
                emp.Name,
                emp.Role.ToString(),
                kiosk?.Name ?? "Desconhecido",
                emp.Photo,
                Math.Round(emp.AverageRating, 1),
                emp.TotalRatings,
                position++
            ));
        }

        return result;
    }

    private async Task<EmployeeDto> ToDto(Employee employee)
    {
        var kiosk = await _kioskRepository.GetByIdAsync(employee.KioskId);

        return new EmployeeDto(
            employee.Id,
            employee.KioskId,
            kiosk?.Name ?? "Desconhecido",
            employee.Name,
            employee.Role.ToString(),
            employee.Phone,
            employee.Email,
            employee.HireDate,
            employee.Photo,
            Math.Round(employee.AverageRating, 1),
            employee.TotalRatings,
            employee.IsActive,
            employee.CreatedAt
        );
    }
}

