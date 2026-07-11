using Microsoft.EntityFrameworkCore;
using PropFlow.Domain.Entities;
using PropFlow.Infrastructure.Configurations;

namespace PropFlow.Infrastructure.Data;

public class PropFlowDbContext : DbContext
{
    public PropFlowDbContext(DbContextOptions<PropFlowDbContext> options) : base(options)
    {
    }

    public DbSet<Landlord> Landlords => Set<Landlord>();
    public DbSet<Property> Properties => Set<Property>();
    public DbSet<RentalUnit> RentalUnits => Set<RentalUnit>();
    public DbSet<Tenant> Tenants => Set<Tenant>();
    public DbSet<Contract> Contracts => Set<Contract>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<MaintenanceRequest> MaintenanceRequests => Set<MaintenanceRequest>();
    public DbSet<Lead> Leads => Set<Lead>();
    public DbSet<DailyActivity> DailyActivities => Set<DailyActivity>();
    public DbSet<ProductivityGoals> ProductivityGoals => Set<ProductivityGoals>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfiguration(new LandlordConfiguration());
        modelBuilder.ApplyConfiguration(new PropertyConfiguration());
        modelBuilder.ApplyConfiguration(new RentalUnitConfiguration());
        modelBuilder.ApplyConfiguration(new TenantConfiguration());
        modelBuilder.ApplyConfiguration(new ContractConfiguration());
        modelBuilder.ApplyConfiguration(new PaymentConfiguration());
        modelBuilder.ApplyConfiguration(new MaintenanceRequestConfiguration());
        modelBuilder.ApplyConfiguration(new LeadConfiguration());
        modelBuilder.ApplyConfiguration(new DailyActivityConfiguration());
        modelBuilder.ApplyConfiguration(new ProductivityGoalsConfiguration());
    }
}
