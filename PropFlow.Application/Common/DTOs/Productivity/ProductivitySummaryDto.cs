namespace PropFlow.Application.Common.DTOs.Productivity;

public class ActivityTotalsDto
{
    public int Contacts { get; set; }
    public int Conversations { get; set; }
    public int LeadsAdded { get; set; }
    public int AppointmentsSet { get; set; }
    public int AppointmentsMet { get; set; }
    public int AgreementsSigned { get; set; }
    public int OffersWritten { get; set; }
    public decimal LeadGenHours { get; set; }
    public int DaysLogged { get; set; }
}

public class DayPointDto
{
    public DateTime Date { get; set; }
    public string Label { get; set; } = string.Empty;   // Mon, Tue…
    public int Contacts { get; set; }
    public int Conversations { get; set; }
    public int AppointmentsMet { get; set; }
    public decimal LeadGenHours { get; set; }
    public bool BlockDone { get; set; }                  // lead-gen block completed that day
}

public class ProductivitySummaryDto
{
    public DateTime Today { get; set; }
    public DailyActivityDto TodayActivity { get; set; } = new();
    public ActivityTotalsDto WeekTotals { get; set; } = new();
    public ActivityTotalsDto MonthTotals { get; set; } = new();
    public ActivityTotalsDto Last30Totals { get; set; } = new();   // powers the Economic Model
    public int LeadGenStreak { get; set; }                         // consecutive days block done
    public int BestStreak { get; set; }
    public List<DayPointDto> Last7Days { get; set; } = new();
    public ProductivityGoalsDto Goals { get; set; } = new();
}
