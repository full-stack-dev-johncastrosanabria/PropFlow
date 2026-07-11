namespace PropFlow.Application.Common.DTOs.Dashboard;

public class StageCountDto
{
    public int Stage { get; set; }
    public string Label { get; set; } = string.Empty;
    public int Count { get; set; }
    public decimal Value { get; set; }
}

public class MonthlyRevenueDto
{
    public string Month { get; set; } = string.Empty;   // e.g. "Jul"
    public int Year { get; set; }
    public decimal Collected { get; set; }
    public decimal Expected { get; set; }
}

public class UpcomingPaymentDto
{
    public Guid Id { get; set; }
    public string TenantName { get; set; } = string.Empty;
    public string UnitName { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "USD";
    public DateTime DueDate { get; set; }
    public int Status { get; set; }      // PaymentStatus
    public bool IsOverdue { get; set; }
    public int DaysUntilDue { get; set; }
}

public class ExpiringContractDto
{
    public Guid Id { get; set; }
    public string TenantName { get; set; } = string.Empty;
    public string UnitName { get; set; } = string.Empty;
    public DateTime EndDate { get; set; }
    public int DaysLeft { get; set; }
    public decimal MonthlyRent { get; set; }
    public string Currency { get; set; } = "USD";
}

public class ActivityItemDto
{
    public string Type { get; set; } = string.Empty;   // payment | lead | maintenance | contract
    public string Title { get; set; } = string.Empty;
    public string Subtitle { get; set; } = string.Empty;
    public DateTime When { get; set; }
}
