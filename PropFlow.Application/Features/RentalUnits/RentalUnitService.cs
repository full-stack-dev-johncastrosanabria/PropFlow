using AutoMapper;
using PropFlow.Application.Common.DTOs.RentalUnits;
using PropFlow.Application.Common.Exceptions;
using PropFlow.Application.Common.Interfaces;
using PropFlow.Domain.Entities;
using PropFlow.Domain.Interfaces;

namespace PropFlow.Application.Features.RentalUnits;

public class RentalUnitService : IRentalUnitService
{
    private readonly IRepository<RentalUnit> _rentalUnitRepository;
    private readonly IRepository<Property> _propertyRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public RentalUnitService(
        IRepository<RentalUnit> rentalUnitRepository,
        IRepository<Property> propertyRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _rentalUnitRepository = rentalUnitRepository;
        _propertyRepository = propertyRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<RentalUnitDto>> GetAllAsync(Guid landlordId, CancellationToken cancellationToken = default)
    {
        var properties = await _propertyRepository.FindAsync(p => p.LandlordId == landlordId, cancellationToken);
        var propertyIds = properties.Select(p => p.Id).ToList();
        
        var units = await _rentalUnitRepository.FindAsync(u => propertyIds.Contains(u.PropertyId), cancellationToken);
        return _mapper.Map<IEnumerable<RentalUnitDto>>(units);
    }

    public async Task<IEnumerable<RentalUnitDto>> GetByPropertyIdAsync(Guid propertyId, Guid landlordId, CancellationToken cancellationToken = default)
    {
        var property = await _propertyRepository.GetByIdAsync(propertyId, cancellationToken);
        if (property == null || property.LandlordId != landlordId)
        {
            throw new NotFoundException("Property not found");
        }

        var units = await _rentalUnitRepository.FindAsync(u => u.PropertyId == propertyId, cancellationToken);
        return _mapper.Map<IEnumerable<RentalUnitDto>>(units);
    }

    public async Task<RentalUnitDto> GetByIdAsync(Guid id, Guid landlordId, CancellationToken cancellationToken = default)
    {
        var unit = await _rentalUnitRepository.GetByIdAsync(id, cancellationToken);
        if (unit == null)
        {
            throw new NotFoundException("Rental unit not found");
        }

        var property = await _propertyRepository.GetByIdAsync(unit.PropertyId, cancellationToken);
        if (property == null || property.LandlordId != landlordId)
        {
            throw new NotFoundException("Rental unit not found");
        }

        return _mapper.Map<RentalUnitDto>(unit);
    }

    public async Task<RentalUnitDto> CreateAsync(CreateRentalUnitDto dto, Guid landlordId, CancellationToken cancellationToken = default)
    {
        var property = await _propertyRepository.GetByIdAsync(dto.PropertyId, cancellationToken);
        if (property == null || property.LandlordId != landlordId)
        {
            throw new NotFoundException("Property not found");
        }

        var unit = _mapper.Map<RentalUnit>(dto);
        unit.Id = Guid.NewGuid();
        unit.CreatedAtUtc = DateTime.UtcNow;

        await _rentalUnitRepository.AddAsync(unit, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<RentalUnitDto>(unit);
    }

    public async Task<RentalUnitDto> UpdateAsync(Guid id, UpdateRentalUnitDto dto, Guid landlordId, CancellationToken cancellationToken = default)
    {
        var unit = await _rentalUnitRepository.GetByIdAsync(id, cancellationToken);
        if (unit == null)
        {
            throw new NotFoundException("Rental unit not found");
        }

        var property = await _propertyRepository.GetByIdAsync(unit.PropertyId, cancellationToken);
        if (property == null || property.LandlordId != landlordId)
        {
            throw new NotFoundException("Rental unit not found");
        }

        _mapper.Map(dto, unit);
        await _rentalUnitRepository.UpdateAsync(unit, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<RentalUnitDto>(unit);
    }

    public async Task DeleteAsync(Guid id, Guid landlordId, CancellationToken cancellationToken = default)
    {
        var unit = await _rentalUnitRepository.GetByIdAsync(id, cancellationToken);
        if (unit == null)
        {
            throw new NotFoundException("Rental unit not found");
        }

        var property = await _propertyRepository.GetByIdAsync(unit.PropertyId, cancellationToken);
        if (property == null || property.LandlordId != landlordId)
        {
            throw new NotFoundException("Rental unit not found");
        }

        await _rentalUnitRepository.DeleteAsync(unit, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
