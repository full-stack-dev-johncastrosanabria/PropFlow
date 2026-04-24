using AutoMapper;
using PropFlow.Application.Common.DTOs.MaintenanceRequests;
using PropFlow.Application.Common.Exceptions;
using PropFlow.Application.Common.Interfaces;
using PropFlow.Domain.Entities;
using PropFlow.Domain.Interfaces;

namespace PropFlow.Application.Features.MaintenanceRequests;

public class MaintenanceRequestService : IMaintenanceRequestService
{
    private readonly IRepository<MaintenanceRequest> _maintenanceRequestRepository;
    private readonly IRepository<Property> _propertyRepository;
    private readonly IRepository<RentalUnit> _rentalUnitRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public MaintenanceRequestService(
        IRepository<MaintenanceRequest> maintenanceRequestRepository,
        IRepository<Property> propertyRepository,
        IRepository<RentalUnit> rentalUnitRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _maintenanceRequestRepository = maintenanceRequestRepository;
        _propertyRepository = propertyRepository;
        _rentalUnitRepository = rentalUnitRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<MaintenanceRequestDto>> GetAllAsync(Guid landlordId, CancellationToken cancellationToken = default)
    {
        var properties = await _propertyRepository.FindAsync(p => p.LandlordId == landlordId, cancellationToken);
        var propertyIds = properties.Select(p => p.Id).ToList();
        
        var requests = await _maintenanceRequestRepository.FindAsync(m => propertyIds.Contains(m.PropertyId), cancellationToken);
        
        // Load related entities
        var requestList = requests.ToList();
        foreach (var request in requestList)
        {
            request.Property = await _propertyRepository.GetByIdAsync(request.PropertyId, cancellationToken) ?? new Property();
            if (request.RentalUnitId.HasValue)
            {
                request.RentalUnit = await _rentalUnitRepository.GetByIdAsync(request.RentalUnitId.Value, cancellationToken);
            }
        }
        
        return _mapper.Map<IEnumerable<MaintenanceRequestDto>>(requestList);
    }

    public async Task<MaintenanceRequestDto> GetByIdAsync(Guid id, Guid landlordId, CancellationToken cancellationToken = default)
    {
        var request = await _maintenanceRequestRepository.GetByIdAsync(id, cancellationToken);
        if (request == null)
        {
            throw new NotFoundException("Maintenance request not found");
        }

        var property = await _propertyRepository.GetByIdAsync(request.PropertyId, cancellationToken);
        if (property == null || property.LandlordId != landlordId)
        {
            throw new NotFoundException("Maintenance request not found");
        }

        request.Property = property;
        if (request.RentalUnitId.HasValue)
        {
            request.RentalUnit = await _rentalUnitRepository.GetByIdAsync(request.RentalUnitId.Value, cancellationToken);
        }

        return _mapper.Map<MaintenanceRequestDto>(request);
    }

    public async Task<MaintenanceRequestDto> CreateAsync(CreateMaintenanceRequestDto dto, Guid landlordId, CancellationToken cancellationToken = default)
    {
        var property = await _propertyRepository.GetByIdAsync(dto.PropertyId, cancellationToken);
        if (property == null || property.LandlordId != landlordId)
        {
            throw new NotFoundException("Property not found");
        }

        if (dto.RentalUnitId.HasValue)
        {
            var unit = await _rentalUnitRepository.GetByIdAsync(dto.RentalUnitId.Value, cancellationToken);
            if (unit == null || unit.PropertyId != dto.PropertyId)
            {
                throw new BadRequestException("Rental unit does not belong to the specified property");
            }
        }

        var request = _mapper.Map<MaintenanceRequest>(dto);
        request.Id = Guid.NewGuid();
        request.CreatedAtUtc = DateTime.UtcNow;

        await _maintenanceRequestRepository.AddAsync(request, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        request.Property = property;
        if (request.RentalUnitId.HasValue)
        {
            request.RentalUnit = await _rentalUnitRepository.GetByIdAsync(request.RentalUnitId.Value, cancellationToken);
        }

        return _mapper.Map<MaintenanceRequestDto>(request);
    }

    public async Task<MaintenanceRequestDto> UpdateAsync(Guid id, UpdateMaintenanceRequestDto dto, Guid landlordId, CancellationToken cancellationToken = default)
    {
        var request = await _maintenanceRequestRepository.GetByIdAsync(id, cancellationToken);
        if (request == null)
        {
            throw new NotFoundException("Maintenance request not found");
        }

        var property = await _propertyRepository.GetByIdAsync(request.PropertyId, cancellationToken);
        if (property == null || property.LandlordId != landlordId)
        {
            throw new NotFoundException("Maintenance request not found");
        }

        _mapper.Map(dto, request);
        await _maintenanceRequestRepository.UpdateAsync(request, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        request.Property = property;
        if (request.RentalUnitId.HasValue)
        {
            request.RentalUnit = await _rentalUnitRepository.GetByIdAsync(request.RentalUnitId.Value, cancellationToken);
        }

        return _mapper.Map<MaintenanceRequestDto>(request);
    }

    public async Task DeleteAsync(Guid id, Guid landlordId, CancellationToken cancellationToken = default)
    {
        var request = await _maintenanceRequestRepository.GetByIdAsync(id, cancellationToken);
        if (request == null)
        {
            throw new NotFoundException("Maintenance request not found");
        }

        var property = await _propertyRepository.GetByIdAsync(request.PropertyId, cancellationToken);
        if (property == null || property.LandlordId != landlordId)
        {
            throw new NotFoundException("Maintenance request not found");
        }

        await _maintenanceRequestRepository.DeleteAsync(request, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
