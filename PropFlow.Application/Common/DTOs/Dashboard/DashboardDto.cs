namespace PropFlow.Application.Common.DTOs.Dashboard;

public class DashboardDto
{
    public int TotalProperties { get; set; }
    public int TotalUnits { get; set; }
    public int OccupiedUnits { get; set; }
    public int PendingPayments { get; set; }
    public int LatePayments { get; set; }
    public int OpenMaintenanceRequests { get; set; }
}
