using PropFlow.Domain.Enums;

namespace PropFlow.Application.Common.DTOs.MaintenanceRequests;

public class MaintenanceRequestDto
{
    public Guid Id { get; set; }
    public Guid PropertyId { get; set; }
    public Guid? RentalUnitId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Priority Priority { get; set; }
    public MaintenanceStatus Status { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    
    // Additional info
    public string? PropertyName { get; set; }
    public string? UnitName { get; set; }
}
