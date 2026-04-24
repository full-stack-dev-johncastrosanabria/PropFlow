using PropFlow.Application.Common.DTOs.MaintenanceRequests;

namespace PropFlow.Application.Common.Interfaces;

public interface IMaintenanceRequestService
{
    Task<IEnumerable<MaintenanceRequestDto>> GetAllAsync(Guid landlordId, CancellationToken cancellationToken = default);
    Task<MaintenanceRequestDto> GetByIdAsync(Guid id, Guid landlordId, CancellationToken cancellationToken = default);
    Task<MaintenanceRequestDto> CreateAsync(CreateMaintenanceRequestDto dto, Guid landlordId, CancellationToken cancellationToken = default);
    Task<MaintenanceRequestDto> UpdateAsync(Guid id, UpdateMaintenanceRequestDto dto, Guid landlordId, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, Guid landlordId, CancellationToken cancellationToken = default);
}
