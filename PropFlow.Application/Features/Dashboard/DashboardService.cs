using PropFlow.Application.Common.DTOs.Dashboard;
using PropFlow.Application.Common.Interfaces;
using PropFlow.Domain.Entities;
using PropFlow.Domain.Enums;
using PropFlow.Domain.Interfaces;

namespace PropFlow.Application.Features.Dashboard;

public class DashboardService : IDashboardService
{
    private readonly IRepository<Property> _propertyRepository;
    private readonly IRepository<RentalUnit> _rentalUnitRepository;
    private readonly IRepository<Tenant> _tenantRepository;
    private readonly IRepository<Contract> _contractRepository;
    private readonly IRepository<Payment> _paymentRepository;
    private readonly IRepository<MaintenanceRequest> _maintenanceRequestRepository;
    private readonly IRepository<Lead> _leadRepository;

    private static readonly string[] StageLabels =
        { "New", "Contacted", "Qualified", "Viewing", "Negotiation", "Won", "Lost" };

    public DashboardService(
        IRepository<Property> propertyRepository,
        IRepository<RentalUnit> rentalUnitRepository,
        IRepository<Tenant> tenantRepository,
        IRepository<Contract> contractRepository,
        IRepository<Payment> paymentRepository,
        IRepository<MaintenanceRequest> maintenanceRequestRepository,
        IRepository<Lead> leadRepository)
    {
        _propertyRepository = propertyRepository;
        _rentalUnitRepository = rentalUnitRepository;
        _tenantRepository = tenantRepository;
        _contractRepository = contractRepository;
        _paymentRepository = paymentRepository;
        _maintenanceRequestRepository = maintenanceRequestRepository;
        _leadRepository = leadRepository;
    }

    public async Task<DashboardDto> GetDashboardAsync(Guid landlordId, CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        var today = now.Date;
        var monthStart = new DateTime(now.Year, now.Month, 1);

        var properties = (await _propertyRepository.FindAsync(p => p.LandlordId == landlordId, cancellationToken)).ToList();
        var propertyIds = properties.Select(p => p.Id).ToList();

        var units = (await _rentalUnitRepository.FindAsync(u => propertyIds.Contains(u.PropertyId), cancellationToken)).ToList();
        var unitName = units.ToDictionary(u => u.Id, u => u.Name);

        var tenants = (await _tenantRepository.FindAsync(t => t.LandlordId == landlordId, cancellationToken)).ToList();
        var tenantIds = tenants.Select(t => t.Id).ToList();
        var tenantName = tenants.ToDictionary(t => t.Id, t => t.FullName);

        var contracts = (await _contractRepository.FindAsync(c => tenantIds.Contains(c.TenantId), cancellationToken)).ToList();
        var contractIds = contracts.Select(c => c.Id).ToList();

        var payments = (await _paymentRepository.FindAsync(p => contractIds.Contains(p.ContractId), cancellationToken)).ToList();
        var maintenance = (await _maintenanceRequestRepository.FindAsync(m => propertyIds.Contains(m.PropertyId), cancellationToken)).ToList();
        var leads = (await _leadRepository.FindAsync(l => l.LandlordId == landlordId, cancellationToken)).ToList();

        var currency = units.FirstOrDefault()?.Currency ?? "USD";

        // ---- Occupancy ----
        var occupied = units.Count(u => u.Status == UnitStatus.Occupied);
        var available = units.Count(u => u.Status == UnitStatus.Available);
        var maintUnits = units.Count(u => u.Status == UnitStatus.Maintenance);
        var occupancyRate = units.Count > 0 ? Math.Round((double)occupied / units.Count * 100, 1) : 0;

        // ---- Financials (current month, by due date) ----
        var monthPayments = payments.Where(p => p.DueDate >= monthStart && p.DueDate < monthStart.AddMonths(1)).ToList();
        var expectedThisMonth = monthPayments.Sum(p => p.Amount);
        var collectedThisMonth = monthPayments.Where(p => p.Status == PaymentStatus.Paid).Sum(p => p.Amount);
        var collectionRate = expectedThisMonth > 0 ? Math.Round((double)(collectedThisMonth / expectedThisMonth) * 100, 1) : 0;

        var unpaid = payments.Where(p => p.Status != PaymentStatus.Paid).ToList();
        var outstanding = unpaid.Sum(p => p.Amount);
        var overdue = payments.Where(p => p.Status == PaymentStatus.Late || (p.Status == PaymentStatus.Pending && p.DueDate < today)).Sum(p => p.Amount);
        var mrr = contracts.Where(c => c.Status == ContractStatus.Active).Sum(c => c.MonthlyRent);

        // ---- Contracts ----
        var activeContracts = contracts.Where(c => c.Status == ContractStatus.Active).ToList();
        var expiringWindow = today.AddDays(45);
        var expiring = activeContracts
            .Where(c => c.EndDate.HasValue && c.EndDate.Value.Date >= today && c.EndDate.Value.Date <= expiringWindow)
            .OrderBy(c => c.EndDate)
            .ToList();

        // ---- Revenue trend (last 6 months) ----
        var trend = new List<MonthlyRevenueDto>();
        for (var i = 5; i >= 0; i--)
        {
            var m = monthStart.AddMonths(-i);
            var next = m.AddMonths(1);
            var inMonth = payments.Where(p => p.DueDate >= m && p.DueDate < next).ToList();
            trend.Add(new MonthlyRevenueDto
            {
                Month = m.ToString("MMM", System.Globalization.CultureInfo.InvariantCulture),
                Year = m.Year,
                Expected = inMonth.Sum(p => p.Amount),
                Collected = inMonth.Where(p => p.Status == PaymentStatus.Paid).Sum(p => p.Amount)
            });
        }

        // ---- Upcoming / overdue payments ----
        var upcoming = unpaid
            .OrderBy(p => p.DueDate)
            .Take(6)
            .Select(p =>
            {
                var contract = contracts.FirstOrDefault(c => c.Id == p.ContractId);
                var tName = contract != null && tenantName.TryGetValue(contract.TenantId, out var tn) ? tn : "—";
                var uName = contract != null && unitName.TryGetValue(contract.RentalUnitId, out var un) ? un : "—";
                return new UpcomingPaymentDto
                {
                    Id = p.Id,
                    TenantName = tName,
                    UnitName = uName,
                    Amount = p.Amount,
                    Currency = p.Currency,
                    DueDate = p.DueDate,
                    Status = (int)p.Status,
                    IsOverdue = p.DueDate < today,
                    DaysUntilDue = (int)(p.DueDate.Date - today).TotalDays
                };
            })
            .ToList();

        var expiringList = expiring.Take(6).Select(c => new ExpiringContractDto
        {
            Id = c.Id,
            TenantName = tenantName.TryGetValue(c.TenantId, out var tn) ? tn : "—",
            UnitName = unitName.TryGetValue(c.RentalUnitId, out var un) ? un : "—",
            EndDate = c.EndDate!.Value,
            DaysLeft = (int)(c.EndDate!.Value.Date - today).TotalDays,
            MonthlyRent = c.MonthlyRent,
            Currency = c.Currency
        }).ToList();

        // ---- Sales funnel ----
        var byStage = new List<StageCountDto>();
        for (var s = 0; s < StageLabels.Length; s++)
        {
            var group = leads.Where(l => (int)l.Stage == s).ToList();
            byStage.Add(new StageCountDto
            {
                Stage = s,
                Label = StageLabels[s],
                Count = group.Count,
                Value = group.Sum(l => l.EstimatedValue)
            });
        }
        var activeLeads = leads.Where(l => l.Stage != LeadStage.Won && l.Stage != LeadStage.Lost).ToList();

        // ---- Recent activity ----
        var activity = new List<ActivityItemDto>();
        foreach (var p in payments.Where(p => p.Status == PaymentStatus.Paid && p.PaidDate.HasValue).OrderByDescending(p => p.PaidDate).Take(4))
        {
            var contract = contracts.FirstOrDefault(c => c.Id == p.ContractId);
            var tName = contract != null && tenantName.TryGetValue(contract.TenantId, out var tn) ? tn : "Tenant";
            activity.Add(new ActivityItemDto
            {
                Type = "payment",
                Title = "Payment received",
                Subtitle = string.Format(System.Globalization.CultureInfo.InvariantCulture, "{0} {1:N0} · {2}", p.Currency, p.Amount, tName),
                When = p.PaidDate!.Value
            });
        }
        foreach (var l in leads.Where(l => l.Stage == LeadStage.Won).OrderByDescending(l => l.LastContactedUtc ?? l.CreatedAtUtc).Take(3))
        {
            activity.Add(new ActivityItemDto
            {
                Type = "lead",
                Title = "Lead won",
                Subtitle = string.Format(System.Globalization.CultureInfo.InvariantCulture, "{0} · {1} {2:N0}/mo", l.FullName, l.Currency, l.EstimatedValue),
                When = l.LastContactedUtc ?? l.CreatedAtUtc
            });
        }
        foreach (var m in maintenance.Where(m => m.Status != MaintenanceStatus.Closed).OrderByDescending(m => m.CreatedAtUtc).Take(3))
        {
            var pName = properties.FirstOrDefault(p => p.Id == m.PropertyId)?.Name ?? "Property";
            activity.Add(new ActivityItemDto
            {
                Type = "maintenance",
                Title = "Maintenance reported",
                Subtitle = $"{m.Title} · {pName}",
                When = m.CreatedAtUtc
            });
        }
        var recentActivity = activity.OrderByDescending(a => a.When).Take(6).ToList();

        return new DashboardDto
        {
            Currency = currency,
            TotalProperties = properties.Count,
            TotalUnits = units.Count,
            OccupiedUnits = occupied,
            AvailableUnits = available,
            MaintenanceUnits = maintUnits,
            OccupancyRate = occupancyRate,

            CollectedThisMonth = collectedThisMonth,
            ExpectedThisMonth = expectedThisMonth,
            CollectionRate = collectionRate,
            OutstandingAmount = outstanding,
            OverdueAmount = overdue,
            MonthlyRecurringRevenue = mrr,

            PendingPayments = payments.Count(p => p.Status == PaymentStatus.Pending),
            LatePayments = payments.Count(p => p.Status == PaymentStatus.Late),
            PaidPaymentsThisMonth = monthPayments.Count(p => p.Status == PaymentStatus.Paid),

            TotalTenants = tenants.Count,
            ActiveContracts = activeContracts.Count,
            ExpiringContracts = expiring.Count,

            OpenMaintenanceRequests = maintenance.Count(m => m.Status == MaintenanceStatus.Open),
            InProgressMaintenance = maintenance.Count(m => m.Status == MaintenanceStatus.InProgress),
            HighPriorityMaintenance = maintenance.Count(m => m.Status != MaintenanceStatus.Closed && m.Priority == Priority.High),

            TotalLeads = leads.Count,
            ActiveLeads = activeLeads.Count,
            WonLeads = leads.Count(l => l.Stage == LeadStage.Won),
            PipelineValue = activeLeads.Sum(l => l.EstimatedValue),
            LeadsByStage = byStage,

            RevenueTrend = trend,
            UpcomingPayments = upcoming,
            ExpiringContractsList = expiringList,
            RecentActivity = recentActivity
        };
    }
}
