using PropFlow.Domain.Common;

namespace PropFlow.Domain.Entities;

public class Tenant : BaseEntity
{
    public Guid LandlordId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? IdentificationNumber { get; set; }
    public string? Notes { get; set; }
    
    // Navigation properties
    public Landlord Landlord { get; set; } = null!;
    public ICollection<Contract> Contracts { get; set; } = new List<Contract>();
}
