using PropFlow.Domain.Enums;

namespace PropFlow.Application.Common.DTOs.Contracts;

public class ContractDto
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public Guid RentalUnitId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public decimal MonthlyRent { get; set; }
    public decimal DepositAmount { get; set; }
    public string Currency { get; set; } = "USD";
    public ContractStatus Status { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    
    // Additional info
    public string? TenantName { get; set; }
    public string? UnitName { get; set; }
}
