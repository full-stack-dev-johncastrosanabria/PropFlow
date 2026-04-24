using PropFlow.Domain.Common;
using PropFlow.Domain.Enums;

namespace PropFlow.Domain.Entities;

public class MaintenanceRequest : BaseEntity
{
    public Guid PropertyId { get; set; }
    public Guid? RentalUnitId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Priority Priority { get; set; }
    public MaintenanceStatus Status { get; set; }
    
    // Navigation properties
    public Property Property { get; set; } = null!;
    public RentalUnit? RentalUnit { get; set; }
}
