using PropFlow.Domain.Enums;

namespace PropFlow.Application.Common.DTOs.Payments;

public class CreatePaymentDto
{
    public Guid ContractId { get; set; }
    public DateTime DueDate { get; set; }
    public DateTime? PaidDate { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "USD";
    public PaymentStatus Status { get; set; }
    public string? Notes { get; set; }
}
