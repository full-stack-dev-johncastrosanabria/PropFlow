using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PropFlow.Domain.Entities;

namespace PropFlow.Infrastructure.Configurations;

public class LandlordConfiguration : IEntityTypeConfiguration<Landlord>
{
    public void Configure(EntityTypeBuilder<Landlord> builder)
    {
        builder.HasKey(l => l.Id);

        builder.Property(l => l.Email)
            .IsRequired()
            .HasMaxLength(255);

        builder.HasIndex(l => l.Email)
            .IsUnique();

        builder.Property(l => l.PasswordHash)
            .IsRequired();

        builder.Property(l => l.FullName)
            .IsRequired()
            .HasMaxLength(200);

        builder.HasMany(l => l.Properties)
            .WithOne(p => p.Landlord)
            .HasForeignKey(p => p.LandlordId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
