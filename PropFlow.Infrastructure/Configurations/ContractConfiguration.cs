using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PropFlow.Domain.Entities;

namespace PropFlow.Infrastructure.Configurations;

public class ContractConfiguration : IEntityTypeConfiguration<Contract>
{
    public void Configure(EntityTypeBuilder<Contract> builder)
    {
        builder.HasKey(c => c.Id);

        builder.Property(c => c.StartDate)
            .IsRequired();

        builder.Property(c => c.MonthlyRent)
            .HasPrecision(18, 2);

        builder.Property(c => c.DepositAmount)
            .HasPrecision(18, 2);

        builder.Property(c => c.Currency)
            .IsRequired()
            .HasMaxLength(3);

        builder.Property(c => c.Status)
            .IsRequired();

        builder.HasOne(c => c.Tenant)
            .WithMany(t => t.Contracts)
            .HasForeignKey(c => c.TenantId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(c => c.RentalUnit)
            .WithMany(u => u.Contracts)
            .HasForeignKey(c => c.RentalUnitId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(c => c.Payments)
            .WithOne(p => p.Contract)
            .HasForeignKey(p => p.ContractId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
