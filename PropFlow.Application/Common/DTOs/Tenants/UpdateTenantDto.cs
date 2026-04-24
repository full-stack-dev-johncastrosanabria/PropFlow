namespace PropFlow.Application.Common.DTOs.Tenants;

public class UpdateTenantDto
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? IdentificationNumber { get; set; }
    public string? Notes { get; set; }
}
