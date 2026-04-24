using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PropFlow.Domain.Entities;

namespace PropFlow.Infrastructure.Configurations;

public class MaintenanceRequestConfiguration : IEntityTypeConfiguration<MaintenanceRequest>
{
    public void Configure(EntityTypeBuilder<MaintenanceRequest> builder)
    {
        builder.HasKey(m => m.Id);

        builder.Property(m => m.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(m => m.Description)
            .IsRequired()
            .HasMaxLength(2000);

        builder.Property(m => m.Priority)
            .IsRequired();

        builder.Property(m => m.Status)
            .IsRequired();

        builder.HasOne(m => m.Property)
            .WithMany(p => p.MaintenanceRequests)
            .HasForeignKey(m => m.PropertyId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(m => m.RentalUnit)
            .WithMany(u => u.MaintenanceRequests)
            .HasForeignKey(m => m.RentalUnitId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
