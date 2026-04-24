using PropFlow.Application.Common.DTOs.Properties;

namespace PropFlow.Application.Common.Interfaces;

public interface IPropertyService
{
    Task<IEnumerable<PropertyDto>> GetAllAsync(Guid landlordId, CancellationToken cancellationToken = default);
    Task<PropertyDto> GetByIdAsync(Guid id, Guid landlordId, CancellationToken cancellationToken = default);
    Task<PropertyDto> CreateAsync(CreatePropertyDto dto, Guid landlordId, CancellationToken cancellationToken = default);
    Task<PropertyDto> UpdateAsync(Guid id, UpdatePropertyDto dto, Guid landlordId, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, Guid landlordId, CancellationToken cancellationToken = default);
}
