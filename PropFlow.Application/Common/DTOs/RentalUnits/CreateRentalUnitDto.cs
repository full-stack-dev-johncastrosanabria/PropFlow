using PropFlow.Domain.Enums;

namespace PropFlow.Application.Common.DTOs.RentalUnits;

public class CreateRentalUnitDto
{
    public Guid PropertyId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? UnitNumber { get; set; }
    public decimal MonthlyRent { get; set; }
    public string Currency { get; set; } = "USD";
    public UnitStatus Status { get; set; }
}
