using PropFlow.Domain.Common;
using PropFlow.Domain.Enums;

namespace PropFlow.Domain.Entities;

public class Contract : BaseEntity
{
    public Guid TenantId { get; set; }
    public Guid RentalUnitId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public decimal MonthlyRent { get; set; }
    public decimal DepositAmount { get; set; }
    public string Currency { get; set; } = "USD";
    public ContractStatus Status { get; set; }
    
    // Navigation properties
    public Tenant Tenant { get; set; } = null!;
    public RentalUnit RentalUnit { get; set; } = null!;
    public ICollection<Payment> Payments { get; set; } = new List<Payment>();
}
