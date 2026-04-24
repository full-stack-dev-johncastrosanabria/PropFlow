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

    public DashboardService(
        IRepository<Property> propertyRepository,
        IRepository<RentalUnit> rentalUnitRepository,
        IRepository<Tenant> tenantRepository,
        IRepository<Contract> contractRepository,
        IRepository<Payment> paymentRepository,
        IRepository<MaintenanceRequest> maintenanceRequestRepository)
    {
        _propertyRepository = propertyRepository;
        _rentalUnitRepository = rentalUnitRepository;
        _tenantRepository = tenantRepository;
        _contractRepository = contractRepository;
        _paymentRepository = paymentRepository;
        _maintenanceRequestRepository = maintenanceRequestRepository;
    }

    public async Task<DashboardDto> GetDashboardAsync(Guid landlordId, CancellationToken cancellationToken = default)
    {
        var properties = await _propertyRepository.FindAsync(p => p.LandlordId == landlordId, cancellationToken);
        var propertyIds = properties.Select(p => p.Id).ToList();
        
        var units = await _rentalUnitRepository.FindAsync(u => propertyIds.Contains(u.PropertyId), cancellationToken);
        var unitsList = units.ToList();
        
        var tenants = await _tenantRepository.FindAsync(t => t.LandlordId == landlordId, cancellationToken);
        var tenantIds = tenants.Select(t => t.Id).ToList();
        
        var contracts = await _contractRepository.FindAsync(c => tenantIds.Contains(c.TenantId), cancellationToken);
        var contractIds = contracts.Select(c => c.Id).ToList();
        
        var payments = await _paymentRepository.FindAsync(p => contractIds.Contains(p.ContractId), cancellationToken);
        var paymentsList = payments.ToList();
        
        var maintenanceRequests = await _maintenanceRequestRepository.FindAsync(m => propertyIds.Contains(m.PropertyId), cancellationToken);

        return new DashboardDto
        {
            TotalProperties = propertyIds.Count,
            TotalUnits = unitsList.Count,
            OccupiedUnits = unitsList.Count(u => u.Status == UnitStatus.Occupied),
            PendingPayments = paymentsList.Count(p => p.Status == PaymentStatus.Pending),
            LatePayments = paymentsList.Count(p => p.Status == PaymentStatus.Late),
            OpenMaintenanceRequests = maintenanceRequests.Count(m => m.Status == MaintenanceStatus.Open)
        };
    }
}
