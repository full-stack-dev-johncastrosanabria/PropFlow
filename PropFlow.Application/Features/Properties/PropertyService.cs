using AutoMapper;
using PropFlow.Application.Common.DTOs.Properties;
using PropFlow.Application.Common.Exceptions;
using PropFlow.Application.Common.Interfaces;
using PropFlow.Domain.Entities;
using PropFlow.Domain.Interfaces;

namespace PropFlow.Application.Features.Properties;

public class PropertyService : IPropertyService
{
    private readonly IRepository<Property> _propertyRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public PropertyService(
        IRepository<Property> propertyRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _propertyRepository = propertyRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<PropertyDto>> GetAllAsync(Guid landlordId, CancellationToken cancellationToken = default)
    {
        var properties = await _propertyRepository.FindAsync(p => p.LandlordId == landlordId, cancellationToken);
        return _mapper.Map<IEnumerable<PropertyDto>>(properties);
    }

    public async Task<PropertyDto> GetByIdAsync(Guid id, Guid landlordId, CancellationToken cancellationToken = default)
    {
        var property = await _propertyRepository.GetByIdAsync(id, cancellationToken);
        if (property == null || property.LandlordId != landlordId)
        {
            throw new NotFoundException("Property not found");
        }

        return _mapper.Map<PropertyDto>(property);
    }

    public async Task<PropertyDto> CreateAsync(CreatePropertyDto dto, Guid landlordId, CancellationToken cancellationToken = default)
    {
        var property = _mapper.Map<Property>(dto);
        property.Id = Guid.NewGuid();
        property.LandlordId = landlordId;
        property.CreatedAtUtc = DateTime.UtcNow;

        await _propertyRepository.AddAsync(property, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<PropertyDto>(property);
    }

    public async Task<PropertyDto> UpdateAsync(Guid id, UpdatePropertyDto dto, Guid landlordId, CancellationToken cancellationToken = default)
    {
        var property = await _propertyRepository.GetByIdAsync(id, cancellationToken);
        if (property == null || property.LandlordId != landlordId)
        {
            throw new NotFoundException("Property not found");
        }

        _mapper.Map(dto, property);
        await _propertyRepository.UpdateAsync(property, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<PropertyDto>(property);
    }

    public async Task DeleteAsync(Guid id, Guid landlordId, CancellationToken cancellationToken = default)
    {
        var property = await _propertyRepository.GetByIdAsync(id, cancellationToken);
        if (property == null || property.LandlordId != landlordId)
        {
            throw new NotFoundException("Property not found");
        }

        await _propertyRepository.DeleteAsync(property, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
