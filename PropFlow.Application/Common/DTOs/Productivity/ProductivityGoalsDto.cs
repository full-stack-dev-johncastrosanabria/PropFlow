namespace PropFlow.Application.Common.DTOs.Productivity;

public class ProductivityGoalsDto
{
    public decimal LeadGenHours { get; set; } = 3;
    public int Contacts { get; set; } = 20;
    public int Conversations { get; set; } = 10;
    public int AppointmentsSet { get; set; } = 2;
    public int LeadsAdded { get; set; } = 2;
    public int AppointmentsMet { get; set; } = 1;
}
