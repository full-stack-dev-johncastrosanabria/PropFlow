using PropFlow.Application.Common.DTOs.Leads;

namespace PropFlow.Application.Common.Interfaces;

public interface ILeadService
{
    Task<IEnumerable<LeadDto>> GetAllAsync(Guid landlordId, CancellationToken cancellationToken = default);
    Task<LeadDto> GetByIdAsync(Guid id, Guid landlordId, CancellationToken cancellationToken = default);
    Task<LeadDto> CreateAsync(CreateLeadDto dto, Guid landlordId, CancellationToken cancellationToken = default);
    Task<LeadDto> UpdateAsync(Guid id, UpdateLeadDto dto, Guid landlordId, CancellationToken cancellationToken = default);
    Task<LeadDto> UpdateStageAsync(Guid id, UpdateLeadStageDto dto, Guid landlordId, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, Guid landlordId, CancellationToken cancellationToken = default);
}
