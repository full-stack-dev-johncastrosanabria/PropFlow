using PropFlow.Domain.Common;
using PropFlow.Domain.Enums;

namespace PropFlow.Domain.Entities;

public class Lead : BaseEntity
{
    public Guid LandlordId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public LeadSource Source { get; set; }
    public LeadStage Stage { get; set; }
    public decimal EstimatedValue { get; set; }
    public string Currency { get; set; } = "USD";
    public string? InterestedIn { get; set; }
    public string? Notes { get; set; }
    public DateTime? LastContactedUtc { get; set; }

    // Navigation properties
    public Landlord Landlord { get; set; } = null!;
}
