using PropFlow.Application.Common.DTOs.Contracts;

namespace PropFlow.Application.Common.Interfaces;

public interface IContractService
{
    Task<IEnumerable<ContractDto>> GetAllAsync(Guid landlordId, CancellationToken cancellationToken = default);
    Task<ContractDto> GetByIdAsync(Guid id, Guid landlordId, CancellationToken cancellationToken = default);
    Task<ContractDto> CreateAsync(CreateContractDto dto, Guid landlordId, CancellationToken cancellationToken = default);
    Task<ContractDto> UpdateAsync(Guid id, UpdateContractDto dto, Guid landlordId, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, Guid landlordId, CancellationToken cancellationToken = default);
}
