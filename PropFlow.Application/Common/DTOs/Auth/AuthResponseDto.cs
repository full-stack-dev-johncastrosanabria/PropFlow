namespace PropFlow.Application.Common.DTOs.Auth;

public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;
    public LandlordDto Landlord { get; set; } = null!;
}
