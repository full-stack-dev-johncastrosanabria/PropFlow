using AutoMapper;
using PropFlow.Application.Common.DTOs.Leads;
using PropFlow.Application.Common.Exceptions;
using PropFlow.Application.Common.Interfaces;
using PropFlow.Domain.Entities;
using PropFlow.Domain.Enums;
using PropFlow.Domain.Interfaces;

namespace PropFlow.Application.Features.Leads;

public class LeadService : ILeadService
{
    private readonly IRepository<Lead> _leadRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public LeadService(
        IRepository<Lead> leadRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _leadRepository = leadRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<LeadDto>> GetAllAsync(Guid landlordId, CancellationToken cancellationToken = default)
    {
        var leads = await _leadRepository.FindAsync(l => l.LandlordId == landlordId, cancellationToken);
        return _mapper.Map<IEnumerable<LeadDto>>(leads);
    }

    public async Task<LeadDto> GetByIdAsync(Guid id, Guid landlordId, CancellationToken cancellationToken = default)
    {
        var lead = await _leadRepository.GetByIdAsync(id, cancellationToken);
        if (lead == null || lead.LandlordId != landlordId)
        {
            throw new NotFoundException("Lead not found");
        }

        return _mapper.Map<LeadDto>(lead);
    }

    public async Task<LeadDto> CreateAsync(CreateLeadDto dto, Guid landlordId, CancellationToken cancellationToken = default)
    {
        var lead = _mapper.Map<Lead>(dto);
        lead.Id = Guid.NewGuid();
        lead.LandlordId = landlordId;
        lead.CreatedAtUtc = DateTime.UtcNow;

        await _leadRepository.AddAsync(lead, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<LeadDto>(lead);
    }

    public async Task<LeadDto> UpdateAsync(Guid id, UpdateLeadDto dto, Guid landlordId, CancellationToken cancellationToken = default)
    {
        var lead = await _leadRepository.GetByIdAsync(id, cancellationToken);
        if (lead == null || lead.LandlordId != landlordId)
        {
            throw new NotFoundException("Lead not found");
        }

        _mapper.Map(dto, lead);
        await _leadRepository.UpdateAsync(lead, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<LeadDto>(lead);
    }

    public async Task<LeadDto> UpdateStageAsync(Guid id, UpdateLeadStageDto dto, Guid landlordId, CancellationToken cancellationToken = default)
    {
        var lead = await _leadRepository.GetByIdAsync(id, cancellationToken);
        if (lead == null || lead.LandlordId != landlordId)
        {
            throw new NotFoundException("Lead not found");
        }

        lead.Stage = dto.Stage;
        if (dto.Stage == LeadStage.Contacted && lead.LastContactedUtc == null)
        {
            lead.LastContactedUtc = DateTime.UtcNow;
        }

        await _leadRepository.UpdateAsync(lead, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<LeadDto>(lead);
    }

    public async Task DeleteAsync(Guid id, Guid landlordId, CancellationToken cancellationToken = default)
    {
        var lead = await _leadRepository.GetByIdAsync(id, cancellationToken);
        if (lead == null || lead.LandlordId != landlordId)
        {
            throw new NotFoundException("Lead not found");
        }

        await _leadRepository.DeleteAsync(lead, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
