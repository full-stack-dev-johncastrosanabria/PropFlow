using PropFlow.Application.Common.DTOs.Payments;

namespace PropFlow.Application.Common.Interfaces;

public interface IPaymentService
{
    Task<IEnumerable<PaymentDto>> GetAllAsync(Guid landlordId, CancellationToken cancellationToken = default);
    Task<IEnumerable<PaymentDto>> GetByContractIdAsync(Guid contractId, Guid landlordId, CancellationToken cancellationToken = default);
    Task<PaymentDto> GetByIdAsync(Guid id, Guid landlordId, CancellationToken cancellationToken = default);
    Task<PaymentDto> CreateAsync(CreatePaymentDto dto, Guid landlordId, CancellationToken cancellationToken = default);
    Task<PaymentDto> UpdateAsync(Guid id, UpdatePaymentDto dto, Guid landlordId, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, Guid landlordId, CancellationToken cancellationToken = default);
}
