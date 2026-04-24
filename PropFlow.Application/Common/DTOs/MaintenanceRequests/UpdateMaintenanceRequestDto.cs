using PropFlow.Domain.Enums;

namespace PropFlow.Application.Common.DTOs.MaintenanceRequests;

public class UpdateMaintenanceRequestDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Priority Priority { get; set; }
    public MaintenanceStatus Status { get; set; }
}
