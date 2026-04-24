using AutoMapper;
using PropFlow.Application.Common.DTOs.Contracts;
using PropFlow.Application.Common.Exceptions;
using PropFlow.Application.Common.Interfaces;
using PropFlow.Domain.Entities;
using PropFlow.Domain.Interfaces;

namespace PropFlow.Application.Features.Contracts;

public class ContractService : IContractService
{
    private readonly IRepository<Contract> _contractRepository;
    private readonly IRepository<Tenant> _tenantRepository;
    private readonly IRepository<RentalUnit> _rentalUnitRepository;
    private readonly IRepository<Property> _propertyRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public ContractService(
        IRepository<Contract> contractRepository,
        IRepository<Tenant> tenantRepository,
        IRepository<RentalUnit> rentalUnitRepository,
        IRepository<Property> propertyRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _contractRepository = contractRepository;
        _tenantRepository = tenantRepository;
        _rentalUnitRepository = rentalUnitRepository;
        _propertyRepository = propertyRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ContractDto>> GetAllAsync(Guid landlordId, CancellationToken cancellationToken = default)
    {
        var tenants = await _tenantRepository.FindAsync(t => t.LandlordId == landlordId, cancellationToken);
        var tenantIds = tenants.Select(t => t.Id).ToList();
        
        var contracts = await _contractRepository.FindAsync(c => tenantIds.Contains(c.TenantId), cancellationToken);
        
        // Load related entities
        var contractList = contracts.ToList();
        foreach (var contract in contractList)
        {
            contract.Tenant = await _tenantRepository.GetByIdAsync(contract.TenantId, cancellationToken) ?? new Tenant();
            contract.RentalUnit = await _rentalUnitRepository.GetByIdAsync(contract.RentalUnitId, cancellationToken) ?? new RentalUnit();
        }
        
        return _mapper.Map<IEnumerable<ContractDto>>(contractList);
    }

    public async Task<ContractDto> GetByIdAsync(Guid id, Guid landlordId, CancellationToken cancellationToken = default)
    {
        var contract = await _contractRepository.GetByIdAsync(id, cancellationToken);
        if (contract == null)
        {
            throw new NotFoundException("Contract not found");
        }

        var tenant = await _tenantRepository.GetByIdAsync(contract.TenantId, cancellationToken);
        if (tenant == null || tenant.LandlordId != landlordId)
        {
            throw new NotFoundException("Contract not found");
        }

        contract.Tenant = tenant;
        contract.RentalUnit = await _rentalUnitRepository.GetByIdAsync(contract.RentalUnitId, cancellationToken) ?? new RentalUnit();

        return _mapper.Map<ContractDto>(contract);
    }

    public async Task<ContractDto> CreateAsync(CreateContractDto dto, Guid landlordId, CancellationToken cancellationToken = default)
    {
        var tenant = await _tenantRepository.GetByIdAsync(dto.TenantId, cancellationToken);
        if (tenant == null || tenant.LandlordId != landlordId)
        {
            throw new NotFoundException("Tenant not found");
        }

        var unit = await _rentalUnitRepository.GetByIdAsync(dto.RentalUnitId, cancellationToken);
        if (unit == null)
        {
            throw new NotFoundException("Rental unit not found");
        }

        var property = await _propertyRepository.GetByIdAsync(unit.PropertyId, cancellationToken);
        if (property == null || property.LandlordId != landlordId)
        {
            throw new NotFoundException("Rental unit not found");
        }

        var contract = _mapper.Map<Contract>(dto);
        contract.Id = Guid.NewGuid();
        contract.CreatedAtUtc = DateTime.UtcNow;

        await _contractRepository.AddAsync(contract, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        contract.Tenant = tenant;
        contract.RentalUnit = unit;

        return _mapper.Map<ContractDto>(contract);
    }

    public async Task<ContractDto> UpdateAsync(Guid id, UpdateContractDto dto, Guid landlordId, CancellationToken cancellationToken = default)
    {
        var contract = await _contractRepository.GetByIdAsync(id, cancellationToken);
        if (contract == null)
        {
            throw new NotFoundException("Contract not found");
        }

        var tenant = await _tenantRepository.GetByIdAsync(contract.TenantId, cancellationToken);
        if (tenant == null || tenant.LandlordId != landlordId)
        {
            throw new NotFoundException("Contract not found");
        }

        _mapper.Map(dto, contract);
        await _contractRepository.UpdateAsync(contract, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        contract.Tenant = tenant;
        contract.RentalUnit = await _rentalUnitRepository.GetByIdAsync(contract.RentalUnitId, cancellationToken) ?? new RentalUnit();

        return _mapper.Map<ContractDto>(contract);
    }

    public async Task DeleteAsync(Guid id, Guid landlordId, CancellationToken cancellationToken = default)
    {
        var contract = await _contractRepository.GetByIdAsync(id, cancellationToken);
        if (contract == null)
        {
            throw new NotFoundException("Contract not found");
        }

        var tenant = await _tenantRepository.GetByIdAsync(contract.TenantId, cancellationToken);
        if (tenant == null || tenant.LandlordId != landlordId)
        {
            throw new NotFoundException("Contract not found");
        }

        await _contractRepository.DeleteAsync(contract, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
