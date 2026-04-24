using PropFlow.Application.Common.DTOs.Dashboard;

namespace PropFlow.Application.Common.Interfaces;

public interface IDashboardService
{
    Task<DashboardDto> GetDashboardAsync(Guid landlordId, CancellationToken cancellationToken = default);
}
