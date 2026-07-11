namespace PropFlow.Application.Common.DTOs.Dashboard;

public class DashboardDto
{
    public string Currency { get; set; } = "USD";

    // Portfolio & occupancy
    public int TotalProperties { get; set; }
    public int TotalUnits { get; set; }
    public int OccupiedUnits { get; set; }
    public int AvailableUnits { get; set; }
    public int MaintenanceUnits { get; set; }
    public double OccupancyRate { get; set; }

    // Financials (current month)
    public decimal CollectedThisMonth { get; set; }
    public decimal ExpectedThisMonth { get; set; }
    public double CollectionRate { get; set; }
    public decimal OutstandingAmount { get; set; }
    public decimal OverdueAmount { get; set; }
    public decimal MonthlyRecurringRevenue { get; set; }

    // Payments
    public int PendingPayments { get; set; }
    public int LatePayments { get; set; }
    public int PaidPaymentsThisMonth { get; set; }

    // Tenants & contracts
    public int TotalTenants { get; set; }
    public int ActiveContracts { get; set; }
    public int ExpiringContracts { get; set; }

    // Maintenance
    public int OpenMaintenanceRequests { get; set; }
    public int InProgressMaintenance { get; set; }
    public int HighPriorityMaintenance { get; set; }

    // Sales funnel
    public int TotalLeads { get; set; }
    public int ActiveLeads { get; set; }
    public int WonLeads { get; set; }
    public decimal PipelineValue { get; set; }
    public List<StageCountDto> LeadsByStage { get; set; } = new();

    // Trends & work lists
    public List<MonthlyRevenueDto> RevenueTrend { get; set; } = new();
    public List<UpcomingPaymentDto> UpcomingPayments { get; set; } = new();
    public List<ExpiringContractDto> ExpiringContractsList { get; set; } = new();
    public List<ActivityItemDto> RecentActivity { get; set; } = new();
}
