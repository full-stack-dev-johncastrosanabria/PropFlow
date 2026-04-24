using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using PropFlow.Application.Common.Interfaces;
using PropFlow.Domain.Interfaces;
using PropFlow.Infrastructure.Auth;
using PropFlow.Infrastructure.Data;
using PropFlow.Infrastructure.Repositories;

namespace PropFlow.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        
        services.AddDbContext<PropFlowDbContext>(options =>
            options.UseMySql(connectionString, new MySqlServerVersion(new Version(9, 6, 0))));

        services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IJwtService, JwtService>();

        return services;
    }
}
