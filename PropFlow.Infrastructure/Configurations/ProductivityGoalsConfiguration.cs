using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PropFlow.Domain.Entities;

namespace PropFlow.Infrastructure.Configurations;

public class ProductivityGoalsConfiguration : IEntityTypeConfiguration<ProductivityGoals>
{
    public void Configure(EntityTypeBuilder<ProductivityGoals> builder)
    {
        builder.HasKey(g => g.Id);

        builder.Property(g => g.LeadGenHours).HasPrecision(5, 2);

        builder.HasOne(g => g.Landlord)
            .WithMany()
            .HasForeignKey(g => g.LandlordId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(g => g.LandlordId).IsUnique();
    }
}
