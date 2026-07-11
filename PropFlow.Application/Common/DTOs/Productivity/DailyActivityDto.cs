namespace PropFlow.Application.Common.DTOs.Productivity;

public class DailyActivityDto
{
    public Guid Id { get; set; }
    public DateTime Date { get; set; }
    public int Contacts { get; set; }
    public int Conversations { get; set; }
    public int LeadsAdded { get; set; }
    public int AppointmentsSet { get; set; }
    public int AppointmentsMet { get; set; }
    public int AgreementsSigned { get; set; }
    public int OffersWritten { get; set; }
    public decimal LeadGenHours { get; set; }
    public string? Notes { get; set; }
}

public class UpsertDailyActivityDto
{
    public DateTime Date { get; set; }
    public int Contacts { get; set; }
    public int Conversations { get; set; }
    public int LeadsAdded { get; set; }
    public int AppointmentsSet { get; set; }
    public int AppointmentsMet { get; set; }
    public int AgreementsSigned { get; set; }
    public int OffersWritten { get; set; }
    public decimal LeadGenHours { get; set; }
    public string? Notes { get; set; }
}
