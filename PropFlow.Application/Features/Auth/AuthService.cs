using AutoMapper;
using PropFlow.Application.Common.DTOs.Auth;
using PropFlow.Application.Common.Exceptions;
using PropFlow.Application.Common.Interfaces;
using PropFlow.Domain.Entities;
using PropFlow.Domain.Interfaces;

namespace PropFlow.Application.Features.Auth;

public class AuthService : IAuthService
{
    private readonly IRepository<Landlord> _landlordRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IJwtService _jwtService;
    private readonly IMapper _mapper;

    public AuthService(
        IRepository<Landlord> landlordRepository,
        IUnitOfWork unitOfWork,
        IJwtService jwtService,
        IMapper mapper)
    {
        _landlordRepository = landlordRepository;
        _unitOfWork = unitOfWork;
        _jwtService = jwtService;
        _mapper = mapper;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto, CancellationToken cancellationToken = default)
    {
        var existingLandlords = await _landlordRepository.FindAsync(l => l.Email == dto.Email, cancellationToken);
        if (existingLandlords.Any())
        {
            throw new BadRequestException("Email already registered");
        }

        var landlord = new Landlord
        {
            Id = Guid.NewGuid(),
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            FullName = dto.FullName,
            CreatedAtUtc = DateTime.UtcNow
        };

        await _landlordRepository.AddAsync(landlord, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var token = _jwtService.GenerateToken(landlord);
        var landlordDto = _mapper.Map<LandlordDto>(landlord);

        return new AuthResponseDto
        {
            Token = token,
            Landlord = landlordDto
        };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto, CancellationToken cancellationToken = default)
    {
        var landlords = await _landlordRepository.FindAsync(l => l.Email == dto.Email, cancellationToken);
        var landlord = landlords.FirstOrDefault();

        if (landlord == null || !BCrypt.Net.BCrypt.Verify(dto.Password, landlord.PasswordHash))
        {
            throw new UnauthorizedException("Invalid email or password");
        }

        var token = _jwtService.GenerateToken(landlord);
        var landlordDto = _mapper.Map<LandlordDto>(landlord);

        return new AuthResponseDto
        {
            Token = token,
            Landlord = landlordDto
        };
    }

    public async Task<LandlordDto> GetCurrentUserAsync(Guid landlordId, CancellationToken cancellationToken = default)
    {
        var landlord = await _landlordRepository.GetByIdAsync(landlordId, cancellationToken);
        if (landlord == null)
        {
            throw new NotFoundException("Landlord not found");
        }

        return _mapper.Map<LandlordDto>(landlord);
    }
}
