using Microsoft.Extensions.DependencyInjection;
using PropFlow.Application.Common.Interfaces;
using PropFlow.Application.Features.Auth;
using PropFlow.Application.Features.Contracts;
using PropFlow.Application.Features.Dashboard;
using PropFlow.Application.Features.MaintenanceRequests;
using PropFlow.Application.Features.Payments;
using PropFlow.Application.Features.Properties;
using PropFlow.Application.Features.RentalUnits;
using PropFlow.Application.Features.Tenants;

namespace PropFlow.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddAutoMapper(typeof(DependencyInjection).Assembly);
        
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IPropertyService, PropertyService>();
        services.AddScoped<IRentalUnitService, RentalUnitService>();
        services.AddScoped<ITenantService, TenantService>();
        services.AddScoped<IContractService, ContractService>();
        services.AddScoped<IPaymentService, PaymentService>();
        services.AddScoped<IMaintenanceRequestService, MaintenanceRequestService>();
        services.AddScoped<IDashboardService, DashboardService>();
        
        return services;
    }
}
