using PropFlow.Domain.Enums;

namespace PropFlow.Application.Common.DTOs.Leads;

public class UpdateLeadDto
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public LeadSource Source { get; set; }
    public LeadStage Stage { get; set; }
    public decimal EstimatedValue { get; set; }
    public string Currency { get; set; } = "USD";
    public string? InterestedIn { get; set; }
    public string? Notes { get; set; }
}
