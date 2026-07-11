using PropFlow.Application.Common.DTOs.Productivity;

namespace PropFlow.Application.Common.Interfaces;

public interface IProductivityService
{
    Task<ProductivitySummaryDto> GetSummaryAsync(Guid landlordId, CancellationToken cancellationToken = default);
    Task<DailyActivityDto> GetDayAsync(Guid landlordId, DateTime date, CancellationToken cancellationToken = default);
    Task<DailyActivityDto> UpsertAsync(UpsertDailyActivityDto dto, Guid landlordId, CancellationToken cancellationToken = default);
    Task<ProductivityGoalsDto> GetGoalsAsync(Guid landlordId, CancellationToken cancellationToken = default);
    Task<ProductivityGoalsDto> UpdateGoalsAsync(ProductivityGoalsDto dto, Guid landlordId, CancellationToken cancellationToken = default);
}
