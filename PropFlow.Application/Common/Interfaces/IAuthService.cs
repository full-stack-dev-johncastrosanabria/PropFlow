using PropFlow.Application.Common.DTOs.Auth;

namespace PropFlow.Application.Common.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterDto dto, CancellationToken cancellationToken = default);
    Task<AuthResponseDto> LoginAsync(LoginDto dto, CancellationToken cancellationToken = default);
    Task<LandlordDto> GetCurrentUserAsync(Guid landlordId, CancellationToken cancellationToken = default);
}
