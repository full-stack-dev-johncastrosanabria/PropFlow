using PropFlow.Application.Common.DTOs.Tenants;

namespace PropFlow.Application.Common.Interfaces;

public interface ITenantService
{
    Task<IEnumerable<TenantDto>> GetAllAsync(Guid landlordId, CancellationToken cancellationToken = default);
    Task<TenantDto> GetByIdAsync(Guid id, Guid landlordId, CancellationToken cancellationToken = default);
    Task<TenantDto> CreateAsync(CreateTenantDto dto, Guid landlordId, CancellationToken cancellationToken = default);
    Task<TenantDto> UpdateAsync(Guid id, UpdateTenantDto dto, Guid landlordId, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, Guid landlordId, CancellationToken cancellationToken = default);
}
