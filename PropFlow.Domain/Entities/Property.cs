using PropFlow.Domain.Common;

namespace PropFlow.Domain.Entities;

public class Property : BaseEntity
{
    public Guid LandlordId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string? Notes { get; set; }
    
    // Navigation properties
    public Landlord Landlord { get; set; } = null!;
    public ICollection<RentalUnit> RentalUnits { get; set; } = new List<RentalUnit>();
    public ICollection<MaintenanceRequest> MaintenanceRequests { get; set; } = new List<MaintenanceRequest>();
}
