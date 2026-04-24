using AutoMapper;
using PropFlow.Application.Common.DTOs.Tenants;
using PropFlow.Application.Common.Exceptions;
using PropFlow.Application.Common.Interfaces;
using PropFlow.Domain.Entities;
using PropFlow.Domain.Interfaces;

namespace PropFlow.Application.Features.Tenants;

public class TenantService : ITenantService
{
    private readonly IRepository<Tenant> _tenantRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public TenantService(
        IRepository<Tenant> tenantRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _tenantRepository = tenantRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<TenantDto>> GetAllAsync(Guid landlordId, CancellationToken cancellationToken = default)
    {
        var tenants = await _tenantRepository.FindAsync(t => t.LandlordId == landlordId, cancellationToken);
        return _mapper.Map<IEnumerable<TenantDto>>(tenants);
    }

    public async Task<TenantDto> GetByIdAsync(Guid id, Guid landlordId, CancellationToken cancellationToken = default)
    {
        var tenant = await _tenantRepository.GetByIdAsync(id, cancellationToken);
        if (tenant == null || tenant.LandlordId != landlordId)
        {
            throw new NotFoundException("Tenant not found");
        }

        return _mapper.Map<TenantDto>(tenant);
    }

    public async Task<TenantDto> CreateAsync(CreateTenantDto dto, Guid landlordId, CancellationToken cancellationToken = default)
    {
        var tenant = _mapper.Map<Tenant>(dto);
        tenant.Id = Guid.NewGuid();
        tenant.LandlordId = landlordId;
        tenant.CreatedAtUtc = DateTime.UtcNow;

        await _tenantRepository.AddAsync(tenant, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<TenantDto>(tenant);
    }

    public async Task<TenantDto> UpdateAsync(Guid id, UpdateTenantDto dto, Guid landlordId, CancellationToken cancellationToken = default)
    {
        var tenant = await _tenantRepository.GetByIdAsync(id, cancellationToken);
        if (tenant == null || tenant.LandlordId != landlordId)
        {
            throw new NotFoundException("Tenant not found");
        }

        _mapper.Map(dto, tenant);
        await _tenantRepository.UpdateAsync(tenant, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<TenantDto>(tenant);
    }

    public async Task DeleteAsync(Guid id, Guid landlordId, CancellationToken cancellationToken = default)
    {
        var tenant = await _tenantRepository.GetByIdAsync(id, cancellationToken);
        if (tenant == null || tenant.LandlordId != landlordId)
        {
            throw new NotFoundException("Tenant not found");
        }

        await _tenantRepository.DeleteAsync(tenant, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
