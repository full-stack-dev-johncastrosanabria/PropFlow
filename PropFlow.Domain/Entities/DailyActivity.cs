using PropFlow.Domain.Common;

namespace PropFlow.Domain.Entities;

/// <summary>
/// One record per agent (landlord) per day. Captures the Keller Williams
/// daily productivity numbers used to measure lead-generation activity.
/// </summary>
public class DailyActivity : BaseEntity
{
    public Guid LandlordId { get; set; }
    public DateTime Date { get; set; }               // the day being tracked (date only, UTC midnight)

    public int Contacts { get; set; }                // touches: calls, texts, in-person
    public int Conversations { get; set; }           // meaningful two-way conversations
    public int LeadsAdded { get; set; }              // new people added to the database / SOI
    public int AppointmentsSet { get; set; }         // appointments scheduled
    public int AppointmentsMet { get; set; }         // appointments actually held
    public int AgreementsSigned { get; set; }        // listing / buyer agreements signed
    public int OffersWritten { get; set; }           // offers written
    public decimal LeadGenHours { get; set; }        // hours spent in the lead-gen time block

    public string? Notes { get; set; }

    // Navigation
    public Landlord Landlord { get; set; } = null!;
}
