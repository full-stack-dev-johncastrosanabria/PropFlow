using PropFlow.Domain.Common;

namespace PropFlow.Domain.Entities;

/// <summary>
/// Per-agent daily productivity targets (Keller Williams "know your numbers").
/// One row per landlord; defaults follow the MREA recommendations.
/// </summary>
public class ProductivityGoals : BaseEntity
{
    public Guid LandlordId { get; set; }

    public decimal LeadGenHours { get; set; } = 3;   // the 3-hour lead-gen block
    public int Contacts { get; set; } = 20;
    public int Conversations { get; set; } = 10;
    public int AppointmentsSet { get; set; } = 2;
    public int LeadsAdded { get; set; } = 2;
    public int AppointmentsMet { get; set; } = 1;

    // Navigation
    public Landlord Landlord { get; set; } = null!;
}
