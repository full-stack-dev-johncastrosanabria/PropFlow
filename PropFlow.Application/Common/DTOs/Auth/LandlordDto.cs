namespace PropFlow.Application.Common.DTOs.Auth;

public class LandlordDto
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; }
}
