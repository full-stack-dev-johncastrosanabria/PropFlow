using AutoMapper;
using PropFlow.Application.Common.DTOs.Payments;
using PropFlow.Application.Common.Exceptions;
using PropFlow.Application.Common.Interfaces;
using PropFlow.Domain.Entities;
using PropFlow.Domain.Interfaces;

namespace PropFlow.Application.Features.Payments;

public class PaymentService : IPaymentService
{
    private readonly IRepository<Payment> _paymentRepository;
    private readonly IRepository<Contract> _contractRepository;
    private readonly IRepository<Tenant> _tenantRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public PaymentService(
        IRepository<Payment> paymentRepository,
        IRepository<Contract> contractRepository,
        IRepository<Tenant> tenantRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _paymentRepository = paymentRepository;
        _contractRepository = contractRepository;
        _tenantRepository = tenantRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<PaymentDto>> GetAllAsync(Guid landlordId, CancellationToken cancellationToken = default)
    {
        var tenants = await _tenantRepository.FindAsync(t => t.LandlordId == landlordId, cancellationToken);
        var tenantIds = tenants.Select(t => t.Id).ToList();
        
        var contracts = await _contractRepository.FindAsync(c => tenantIds.Contains(c.TenantId), cancellationToken);
        var contractIds = contracts.Select(c => c.Id).ToList();
        
        var payments = await _paymentRepository.FindAsync(p => contractIds.Contains(p.ContractId), cancellationToken);
        return _mapper.Map<IEnumerable<PaymentDto>>(payments);
    }

    public async Task<IEnumerable<PaymentDto>> GetByContractIdAsync(Guid contractId, Guid landlordId, CancellationToken cancellationToken = default)
    {
        var contract = await _contractRepository.GetByIdAsync(contractId, cancellationToken);
        if (contract == null)
        {
            throw new NotFoundException("Contract not found");
        }

        var tenant = await _tenantRepository.GetByIdAsync(contract.TenantId, cancellationToken);
        if (tenant == null || tenant.LandlordId != landlordId)
        {
            throw new NotFoundException("Contract not found");
        }

        var payments = await _paymentRepository.FindAsync(p => p.ContractId == contractId, cancellationToken);
        return _mapper.Map<IEnumerable<PaymentDto>>(payments);
    }

    public async Task<PaymentDto> GetByIdAsync(Guid id, Guid landlordId, CancellationToken cancellationToken = default)
    {
        var payment = await _paymentRepository.GetByIdAsync(id, cancellationToken);
        if (payment == null)
        {
            throw new NotFoundException("Payment not found");
        }

        var contract = await _contractRepository.GetByIdAsync(payment.ContractId, cancellationToken);
        if (contract == null)
        {
            throw new NotFoundException("Payment not found");
        }

        var tenant = await _tenantRepository.GetByIdAsync(contract.TenantId, cancellationToken);
        if (tenant == null || tenant.LandlordId != landlordId)
        {
            throw new NotFoundException("Payment not found");
        }

        return _mapper.Map<PaymentDto>(payment);
    }

    public async Task<PaymentDto> CreateAsync(CreatePaymentDto dto, Guid landlordId, CancellationToken cancellationToken = default)
    {
        var contract = await _contractRepository.GetByIdAsync(dto.ContractId, cancellationToken);
        if (contract == null)
        {
            throw new NotFoundException("Contract not found");
        }

        var tenant = await _tenantRepository.GetByIdAsync(contract.TenantId, cancellationToken);
        if (tenant == null || tenant.LandlordId != landlordId)
        {
            throw new NotFoundException("Contract not found");
        }

        var payment = _mapper.Map<Payment>(dto);
        payment.Id = Guid.NewGuid();
        payment.CreatedAtUtc = DateTime.UtcNow;

        await _paymentRepository.AddAsync(payment, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<PaymentDto>(payment);
    }

    public async Task<PaymentDto> UpdateAsync(Guid id, UpdatePaymentDto dto, Guid landlordId, CancellationToken cancellationToken = default)
    {
        var payment = await _paymentRepository.GetByIdAsync(id, cancellationToken);
        if (payment == null)
        {
            throw new NotFoundException("Payment not found");
        }

        var contract = await _contractRepository.GetByIdAsync(payment.ContractId, cancellationToken);
        if (contract == null)
        {
            throw new NotFoundException("Payment not found");
        }

        var tenant = await _tenantRepository.GetByIdAsync(contract.TenantId, cancellationToken);
        if (tenant == null || tenant.LandlordId != landlordId)
        {
            throw new NotFoundException("Payment not found");
        }

        _mapper.Map(dto, payment);
        await _paymentRepository.UpdateAsync(payment, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<PaymentDto>(payment);
    }

    public async Task DeleteAsync(Guid id, Guid landlordId, CancellationToken cancellationToken = default)
    {
        var payment = await _paymentRepository.GetByIdAsync(id, cancellationToken);
        if (payment == null)
        {
            throw new NotFoundException("Payment not found");
        }

        var contract = await _contractRepository.GetByIdAsync(payment.ContractId, cancellationToken);
        if (contract == null)
        {
            throw new NotFoundException("Payment not found");
        }

        var tenant = await _tenantRepository.GetByIdAsync(contract.TenantId, cancellationToken);
        if (tenant == null || tenant.LandlordId != landlordId)
        {
            throw new NotFoundException("Payment not found");
        }

        await _paymentRepository.DeleteAsync(payment, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
