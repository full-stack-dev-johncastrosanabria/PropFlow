using PropFlow.Domain.Common;

namespace PropFlow.Domain.Entities;

public class Landlord : BaseEntity
{
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    
    // Navigation properties
    public ICollection<Property> Properties { get; set; } = new List<Property>();
}
