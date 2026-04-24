using PropFlow.Domain.Common;
using PropFlow.Domain.Enums;

namespace PropFlow.Domain.Entities;

public class Payment : BaseEntity
{
    public Guid ContractId { get; set; }
    public DateTime DueDate { get; set; }
    public DateTime? PaidDate { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "USD";
    public PaymentStatus Status { get; set; }
    public string? Notes { get; set; }
    
    // Navigation properties
    public Contract Contract { get; set; } = null!;
}
