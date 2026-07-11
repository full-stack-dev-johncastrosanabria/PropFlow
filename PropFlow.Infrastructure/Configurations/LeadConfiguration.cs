using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PropFlow.Domain.Entities;

namespace PropFlow.Infrastructure.Configurations;

public class LeadConfiguration : IEntityTypeConfiguration<Lead>
{
    public void Configure(EntityTypeBuilder<Lead> builder)
    {
        builder.HasKey(l => l.Id);

        builder.Property(l => l.FullName)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(l => l.Email)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(l => l.Phone)
            .HasMaxLength(50);

        builder.Property(l => l.Source)
            .IsRequired();

        builder.Property(l => l.Stage)
            .IsRequired();

        builder.Property(l => l.EstimatedValue)
            .HasPrecision(18, 2);

        builder.Property(l => l.Currency)
            .IsRequired()
            .HasMaxLength(3);

        builder.Property(l => l.InterestedIn)
            .HasMaxLength(300);

        builder.Property(l => l.Notes)
            .HasMaxLength(2000);

        builder.HasOne(l => l.Landlord)
            .WithMany()
            .HasForeignKey(l => l.LandlordId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(l => l.LandlordId);
    }
}
