using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PropFlow.Domain.Entities;

namespace PropFlow.Infrastructure.Configurations;

public class RentalUnitConfiguration : IEntityTypeConfiguration<RentalUnit>
{
    public void Configure(EntityTypeBuilder<RentalUnit> builder)
    {
        builder.HasKey(u => u.Id);

        builder.Property(u => u.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(u => u.UnitNumber)
            .HasMaxLength(50);

        builder.Property(u => u.MonthlyRent)
            .HasPrecision(18, 2);

        builder.Property(u => u.Currency)
            .IsRequired()
            .HasMaxLength(3);

        builder.Property(u => u.Status)
            .IsRequired();

        builder.HasOne(u => u.Property)
            .WithMany(p => p.RentalUnits)
            .HasForeignKey(u => u.PropertyId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(u => u.Contracts)
            .WithOne(c => c.RentalUnit)
            .HasForeignKey(c => c.RentalUnitId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(u => u.MaintenanceRequests)
            .WithOne(m => m.RentalUnit)
            .HasForeignKey(m => m.RentalUnitId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
