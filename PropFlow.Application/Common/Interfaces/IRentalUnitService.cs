using PropFlow.Application.Common.DTOs.RentalUnits;

namespace PropFlow.Application.Common.Interfaces;

public interface IRentalUnitService
{
    Task<IEnumerable<RentalUnitDto>> GetAllAsync(Guid landlordId, CancellationToken cancellationToken = default);
    Task<IEnumerable<RentalUnitDto>> GetByPropertyIdAsync(Guid propertyId, Guid landlordId, CancellationToken cancellationToken = default);
    Task<RentalUnitDto> GetByIdAsync(Guid id, Guid landlordId, CancellationToken cancellationToken = default);
    Task<RentalUnitDto> CreateAsync(CreateRentalUnitDto dto, Guid landlordId, CancellationToken cancellationToken = default);
    Task<RentalUnitDto> UpdateAsync(Guid id, UpdateRentalUnitDto dto, Guid landlordId, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, Guid landlordId, CancellationToken cancellationToken = default);
}
