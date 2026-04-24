using PropFlow.Domain.Common;
using PropFlow.Domain.Enums;

namespace PropFlow.Domain.Entities;

public class RentalUnit : BaseEntity
{
    public Guid PropertyId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? UnitNumber { get; set; }
    public decimal MonthlyRent { get; set; }
    public string Currency { get; set; } = "USD";
    public UnitStatus Status { get; set; }
    
    // Navigation properties
    public Property Property { get; set; } = null!;
    public ICollection<Contract> Contracts { get; set; } = new List<Contract>();
    public ICollection<MaintenanceRequest> MaintenanceRequests { get; set; } = new List<MaintenanceRequest>();
}
